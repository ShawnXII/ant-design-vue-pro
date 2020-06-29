import md5 from 'md5'
import { ask } from '@/utils/request'
import qs from 'qs'
/**
 * 用户登录URL
 */
const LOGIN_URL = '/api/shop/doLogin.do'

export function init (config) {
    config.error = false
    config.errorMessage = ''
    Object.keys(config.valida).forEach(key => {
        config.valida[key].status = ''
        config.valida[key].hasFeed = false
        config.valida[key].extra = ''
    })
}
/**
 * 登录
 * @param {*} form
 * @param {*} config
 */
export function login (form, model, config, errorCallback) {
     init(config)
     form.validate(valid => {
        if (!valid) {
            return
        }
        var { loginType = 1, customActiveKey, username, password, mobile, captcha, rememberMe = false } = model
        config.loginBtn = true
        setTimeout(() => {
            if (config.loginBtn) {
                config.loginBtn = false
            }
        }, 3000)
        var urls = {
            url: LOGIN_URL,
            method: 'POST',
            paramsSerializer (v) {
                return qs.stringify(v)
            }
        }
        var params = { rememberMe: rememberMe }
        if (customActiveKey === 'username') {
            // 账号密码登录
            Object.assign(params, { username: username, loginType: loginType })
            params.password = md5(password)
        } else {
            // 手机验证码登录
            params.username = mobile
            // login type: 0 email, 1 username, 2 telephone 3:免密登录
            params.loginType = 3
            params.captcha = captcha
        }
        ask(urls, params).then(res => {
            config.loginBtn = false
            var { success = false } = res
            if (!success) {
                handlerLoginError(res, config, model, form, errorCallback)
                return
            }
            // 登录成功 存储token
            console.log(res)
        }).then(e => {
            config.loginBtn = false
            handlerLoginError({ code: '1007', message: '系统异常' }, config, model, form, errorCallback)
        })
    })
}
const clearModel = (form) => {
    form.resetFields()
}
/**
 * 登录错误处理
 */
const handlerLoginError = (res, config, model, form, errorCallback) => {
    var { code } = res
    var flag = true
    var message = res.message || '未知错误'
    switch (code) {
        case '1001':
            //  未知错误！
            config.error = flag
            config.errorMessage = message
            break
        case '1002':
            //  InternalAuthenticationServiceException
            message = '该计算机无法登录此系统！'
            config.error = flag
            config.errorMessage = message
            break
        case '1003':
            //  账号被锁定
            message = '帐号被锁定'
            config.error = flag
            config.errorMessage = message
            break
        case '1004':
             //  未知错误
             message = '系统异常'
             config.error = flag
             config.errorMessage = message
             break
        case '1005':
             //  账号被禁用
             message = '帐号被禁用'
             config.error = flag
             config.errorMessage = message
             break
        case '1006':
             //  账号被锁定
            //  密码过期（也会登录成功 但是登录后 会需要重新设置密码！）
             message = '密码已经过期'
             break
        case '1101':
             config.valida.captcha.status = 'error'
             config.valida.captcha.hasFeed = true
             config.valida.captcha.extra = res.message || '验证码不能为空'
             break
        case '1102':
             //  验证码错误
             config.valida.captcha.status = 'error'
             config.valida.captcha.hasFeed = true
             config.valida.captcha.extra = res.message || '验证码错误'
             break
        case '1103':
             //  用户名不能为空
             config.valida.username.status = 'error'
             config.valida.username.hasFeed = true
             config.valida.username.extra = res.message || ' 用户名不能为空'
             break
        case '1104':
             //  密码不能为空
             config.valida.password.status = 'error'
             config.valida.password.hasFeed = true
             config.valida.password.extra = res.message || ' 密码不能为空'
             break
        case '1105':
             //  用户名不存在
             config.valida.username.status = 'error'
             config.valida.username.hasFeed = true
             config.valida.username.extra = res.message || ' 用户名不存在'
             clearModel(form)
             break
        case '1106':
             //  密码错误
             config.valida.username.status = 'error'
             config.valida.username.hasFeed = true
             config.valida.username.extra = res.message || ' 密码错误'
             clearModel(form)
             break
        case '1107':
             //  账号(email)未激活！
             break
        case '1108':
            break
        default:
             //  其他错误
             config.error = flag
             config.errorMessage = message
             break
    }
}
