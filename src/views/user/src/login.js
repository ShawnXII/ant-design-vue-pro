import md5 from 'md5'

export function login (form) {
    var { model } = form
    var { loginType = 1, customActiveKey, username, password, mobile, captcha, rememberMe = false } = model
    var fields = customActiveKey === 'username' ? ['username', 'password', 'rememberMe'] : ['mobile', 'captcha', 'rememberMe']
    form.validateField(fields, valid => {
        if (valid !== '') {
            return false
        }
        var params = { rememberMe: rememberMe }
        if (customActiveKey === 'username') {
            // 账号密码登录
            if (loginType === 0) {
                params.email = username
            } else if (loginType === 1) {
                params.username = username
            } else if (loginType === 2) {
                params.mobile = username
            }
            params.password = md5(password)
        } else {
            // 手机验证码登录
            params.mobile = mobile
            params.captcha = captcha
        }
        console.log(params)
    })
}
