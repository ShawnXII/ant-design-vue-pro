import qs from 'qs'

const URLS = {
    // 用户登录接口
    login: {
        url: '/api/shop/doLogin.do',
        method: 'POST',
        paramsSerializer (v) {
            return qs.stringify(v)
        }
    },
    // 获取用户信息
    getUserInfo: {
        url: '/api/account/getUserInfo.do',
        method: 'GET'
    },
    sendactivate: {
        url: '/api/shop/sendactivate.do',
        method: 'POST'
    }
}

export default URLS
