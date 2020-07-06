import PermissionEnum from '@/utils/helper/permission.js'

import * as AllRoute from '@/config/router.config.js'

const Analys = class {
  constructor (route) {
    this.routes = route
  }

  getAnalysisRoute () {
    return this.analysisRoute(this.routes)
  }

  // 是否为空 支持JSON,Array和字符串的判断
  isEmpty (o) {
    if (typeof o === 'undefined' || o === null) {
      return true
    }
    if (typeof o === 'string') {
      if (o.trim() === '') {
        return true
      }
      return false
    }
    if (Array.isArray(o)) {
      if (o.length < 1) {
        return true
      }
      return false
    }
    if (typeof o === 'object') {
      for (var i in o) {
        return false
      }
      return true
    }
    return true
  }
  analysisRoute (routers, parent, arr = []) {
    if (Array.isArray(routers) && routers.length > 0) {
      for (var i in routers) {
        var item = routers[i]
        // TODO 重定向的菜单管不了
        var { name = '', path = '', meta = {}, children = [], hideChildrenInMenu = false } = item
        // 如果path 或者 name 不存在 则忽略该菜单
        if (this.isEmpty(path) || path === '*' || this.isEmpty(name)) {
          continue
        }
        // 还有下一级 就
        if (!hideChildrenInMenu && children.length > 0) {
          var s = this.analysisRoute(children, item)
          if (Array.isArray(s) && s.length > 0) {
            arr = arr.concat(s)
          }
          continue
        }
        // 获取完整的地址
        if (!this.isEmpty(parent) && path.indexOf('/') !== 0) {
          path = parent.path + path
        }
        // title 菜单名称 icon 菜单图标 keepAlive 是否缓存 target 跳转方式 hidden
        var { title = '', keepAlive = false, target = '', hiddenHeaderContent = false, permission = [] } = meta
        title = this.isEmpty(title) ? name : title
        target = this.isEmpty(target) ? '_self' : target
        var obj = { name: name, path: path, title: title, keepAlive: keepAlive, target: target, hiddenHeaderContent: hiddenHeaderContent }
        var subpage = []
        if (hideChildrenInMenu && children.length > 0) {
          // 父子菜单资源 子页面权限会汇总到总页面
          subpage = this.analysisSubpage(children, item)
        }
        // 子页面
        obj.subpage = subpage
        // 解析页面权限
        var auths = this.analysisPagePermission(permission)
        obj.auths = auths
        // 解析权限
        arr.push(obj)
      }
    }
    return arr
  }
  // 获取页面权限
  analysisPagePermission (permissions, prefix = '') {
    var arr = [] // 权限汇总
    var base = []// 基本权限
    Object.keys(PermissionEnum).forEach(k => {
      var obj = PermissionEnum[k]
      var { base: base1 = false, key, label } = obj
      if (base1) {
        base.push({ key: key, label: label, base: true })
      } else {
        for (var i in permissions) {
          var p = permissions[i]
          if (typeof p === 'string' && p === key) {
            arr.push({ key: key, label: label, base: false })
            break
          }
        }
      }
    })
    for (var i in permissions) {
      var p = permissions[i]
      if (typeof p === 'object') {
        var { key, label } = p
        var isExist = false
        for (var k in arr) {
          var k1 = arr[k]
          if (k1.key === key) {
            isExist = true
            break
          }
        }
        if (!isExist) {
          for (var k11 in base) {
            var k111 = base[k11]
            if (k111.key === key) {
              isExist = true
              break
            }
          }
        }
        if (!isExist) {
          arr.push({ key: key, label: label, base: false })
        }
      }
    }
    return base.concat(arr)
  }
  // 子菜单
  analysisSubpage (children, parent) {
    var arr = []
    children.forEach(item => {
      // 重定向的菜单管不了
      var { name = '', path = '', meta = {} } = item
      var { title = '', keepAlive = false, target = '', hiddenHeaderContent = false, permission = [] } = meta
      if (!this.isEmpty(parent) && path.indexOf('/') !== 0) {
        path = parent.path + path
      }
      var obj = { name: name, path: path, title: title, keepAlive: keepAlive, target: target, hiddenHeaderContent: hiddenHeaderContent }
      var auths = this.analysisPagePermission(permission)
      obj.auths = auths
      arr.push(obj)
    })
    return arr
  }
}

export function getAnalysisRoute () {
  var a = new Analys(AllRoute.asyncRouterMap)
  return a.getAnalysisRoute()
}
