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
    },
    resource: {
        prefix: '/api/page/resource',
        sync: {
            url: '/api/page/resource/sync.do',
            method: 'POST'
        }
    },
    interfaceResource: {
        prefix: '/api/resource',
        sync: {
            url: '/api/resource/sync.do',
            method: 'POST'
        }
    },
    role: {
        prefix: '/api/role',
        check: {
            url: '/api/role/check.do',
            method: 'POST'
        }
    },
    account: {
        prefix: '/api/account'
    },
    log: {
        prefix: '/api/log'
    }
}

export default URLS
