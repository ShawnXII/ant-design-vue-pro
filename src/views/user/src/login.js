import md5 from 'md5'
import { ask } from '@/utils/request'
import qs from 'qs'
/**
 * 用户登录URL
 */
const LOGIN_URL = '/api/shop/doLogin.do'
/**
 * 登录
 * @param {*} form
 * @param {*} config
 */
export function login (form, model, config, errorCallback) {
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
        if (customActiveKey !== 'username') {
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
            var { success } = res
            if (!success) {
                handlerLoginError(res, config, errorCallback)
            }
        }).then(e => {
            console.log(e)
        })
    })
}
/**
 * 登录错误处理
 */
const handlerLoginError = (res, config, errorCallback) => {
    var { code } = res
    var flag = true
    var message = res.message || '未知错误'
    switch (code) {
        case '1001':
            //  未知错误！
            break
        case '1002':
            //  InternalAuthenticationServiceException
            message = '该计算机无法登录此系统！'
            break
        case '1003':
            //  账号被锁定
            message = '帐号被锁定'
            break
        case '1004':
             //  未知错误
             message = '系统异常'
             break
        case '1005':
             //  账号被禁用
             message = '帐号被禁用'
             break
        case '1006':
             //  账号被锁定
            //  密码过期（也会登录成功 但是登录后 会需要重新设置密码！）
             message = '密码已经过期'
             break
        case '1101':
             message = '验证码不能为空'
             break
        case '1102':
             //  验证码错误

             break
        case '1103':
             //  用户名不能为空
             break
        case '1104':
             //  密码不能为空
             break
        case '1105':
             //  用户名不存在
             break
        case '1106':
             //  密码错误
             break
        case '1107':
             //  账号(email)未激活！
             break
        default:
             //  其他错误
             break
    }
    config.error = flag
    config.errorMessage = message
}
