import md5 from 'md5'
import { ask } from '@/utils/request'
import { secondToDate } from '@/utils/util'

import urls from '@/api/urls.js'

import store from '@/store'

export function reset (config) {
    if (config.setInterval !== null) {
        clearInterval(config.setInterval)
        config.setInterval = null
    }
    config.error = false
    config.errorMessage = ''
    Object.keys(config.valida).forEach(key => {
        config.valida[key].status = ''
        config.valida[key].extra = ''
    })
}
/**
 * 登录
 * @param {*} form
 * @param {*} config
 */
export function login (form, model, config, callback) {
    reset(config)
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
        ask(urls.login, params).then(res => {
            var { success } = res
            if (!success) {
                handlerLoginError(res, config, form)
                return
            }
            // 登录成功
            var token = res.data.token
            store.dispatch('Login', token).then(() => {
                // 跳转至主页
                if (typeof callback === 'function') {
                    callback(token)
                }
            })
        }).catch(err => {
            if (typeof err !== 'undefined') {
                handlerLoginError({ code: '1007', message: '系统异常!' }, config, form)
            }
        }).finally(() => {
            config.loginBtn = false
        })
    })
}

const resetForm = (form) => {
    form.resetFields()
}
/**
 * 登录错误处理
 */
const handlerLoginError = (res, config, form) => {
    var { code, time } = res
    switch (code) {
        case '1006':
             //  账号被锁定
            //  密码过期（也会登录成功 但是登录后 会需要重新设置密码！）
             break
        case '1101':
             // 验证码不能为空
             config.valida.captcha.status = 'error'
             config.valida.captcha.extra = '验证码不能为空'
             resetForm(form)
             break
        case '1102':
             //  验证码错误
             config.valida.captcha.status = 'error'
             config.valida.captcha.extra = '验证码错误'
             break
        case '1103':
             //  用户名不能为空
             config.valida.username.status = 'error'
             config.valida.username.extra = '用户名不能为空'
             resetForm(form)
             break
        case '1104':
             //  密码不能为空
             config.valida.password.status = 'error'
             config.valida.password.extra = '密码不能为空'
             resetForm(form)
             break
        case '1105':
             //  用户名不存在
             config.valida.username.status = 'error'
             config.valida.username.extra = '用户名或者密码错误'
             resetForm(form)
             break
        case '1106':
             //  密码错误
             config.valida.username.status = 'error'
             config.valida.username.extra = '用户名或者密码错误'
             resetForm(form)
             break
        case '1107':
             //  账号(email)未激活！
             break
        case '1108':
            config.error = true
            var t = secondToDate(time)
            config.setInterval = setInterval(() => {
                time--
                if (time <= 0) {
                    clearInterval(config.setInterval)
                    config.setInterval = null
                    config.error = false
                    config.errorMessage = ''
                    return
                }
                var t1 = secondToDate(time)
                config.errorMessage = '账号被锁定,还剩' + t1 + '解锁'
            }, 1000)
            config.errorMessage = '账号被锁定,还剩' + t + '解锁'
            break
        default:
             //  其他错误
             config.error = true
             config.errorMessage = res.message || '未知错误'
             resetForm(form)
             break
    }
}
