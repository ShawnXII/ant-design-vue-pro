import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'

import { getToken } from './util'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = getToken()
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = getToken()
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Authentication'] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  return response.data
}, errorHandler)
/**
 * 新增
 * @param {*} config
 * @param {*} option
 */
const add = function (config, option) {
  var s = Object.assign({ method: 'POST' }, config, { data: option })
  return request(s)
}
/**
 * 请求封装
 * @param {*} c
 * @param {*} params
 */
const ask = function (c, params) {
  var o = Object.assign({}, c, { data: params })
  var { method = 'get', headers = {}, filter = true, fields = [] } = o
  if (method.toLowerCase() !== 'get' && filter && Array.isArray(fields) && fields.length > 0) {
    var fd = o.data
    if (typeof fd === 'undefined' || fd === null) {
      fd = o.params
    }
    if (typeof fd === 'object') {
      var filterData = {}
      fields.forEach(key => {
        if (fd.hasOwnProperty(key)) {
          filterData[key] = fd[key]
        }
      })
      o.data = filterData
    }
  }
  if (method.toLowerCase() === 'get') {
    o.params = o.data
    delete o.data
  } else {
    if (headers.hasOwnProperty('Content-Type')) {
      var ct = headers['Content-Type']
      if (ct.indexOf('multipart/form-data') !== -1) {
        var formData = new FormData()
        var pd = o.data
        if (typeof pd === 'object') {
          Object.keys(pd).forEach(key => {
            var obj = pd[key]
            if (Array.isArray(obj)) {
              obj.forEach((o, j) => {
                if (typeof o === 'object') {
                  Object.keys(o).forEach(k => {
                    formData.append(key + '[' + j + '][' + k + ']', o[k])
                  })
                } else {
                  formData.append(key + '[' + j + ']', o)
                }
              })
            } else {
              formData.append(key, obj)
            }
          })
        }
        o.data = formData
      }
    } else {
      headers['Content-Type'] = 'application/json;charset=UTF-8'
      o.headers = headers
      // o.data = qs.stringify(o.data)
      var paramsSerializer = o.paramsSerializer
      if (typeof paramsSerializer === 'function') {
        var s = paramsSerializer(o.data)
        if (typeof s !== 'undefined' && s !== null) {
          o.data = s
        }
      }
      if (typeof o.data !== 'object') {
        o.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    }
  }
  return request(o)
}

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios,
  ask,
  add
}
