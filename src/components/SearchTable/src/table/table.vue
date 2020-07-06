<script>
import T from 'ant-design-vue/es/table/Table'
import get from 'lodash.get'
import emitter from '@/components/_util/emitter'
import { mapActions } from 'vuex'
import { times } from '@/utils/util.js'
export default {
  mixins: [emitter],
  name: 'SearchTable',
  componentName: 'SearchTable',
  data () {
    return {
      needTotalList: [],
      selectedRows: [],
      selectedRowKeys: [],
      localLoading: false,
      localDataSource: [],
      transitionDataSource: [],
      localPagination: Object.assign({}, this.pagination),
      searchData: {}// 查询条件
    }
  },
  props: Object.assign({}, T.props, {
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    data: {
      type: [Function, Array, Object, String],
      default () {
        return []
      }
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    },
    /**
     * alert: {
     *   show: true,
     *   clear: Function
     * }
     */
    alert: {
      type: [Object, Boolean],
      default: null
    },
    rowSelection: {
      type: Object,
      default: null
    },
    /** @Deprecated */
    showAlertInfo: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: String | Boolean,
      default: 'auto'
    },
    /**
     * enable page URI mode
     *
     * e.g:
     * /users/1
     * /users/2
     * /users/3?queryParam=test
     * ...
     */
    pageURI: {
      type: Boolean,
      default: false
    }
  }),
  watch: {
    'localPagination.current' (val) {
      this.pageURI && this.$router.push({
        ...this.$route,
        name: this.$route.name,
        params: Object.assign({}, this.$route.params, {
          pageNo: val
        })
      })
    },
    pageNum (val) {
      Object.assign(this.localPagination, {
        current: val
      })
    },
    pageSize (val) {
      Object.assign(this.localPagination, {
        pageSize: val
      })
    },
    showSizeChanger (val) {
      Object.assign(this.localPagination, {
        showSizeChanger: val
      })
    },
    localLoading (v) {
      this.broadcast('SearchTableForm', 'search.table.load', v)
    },
    data: {
      deep: true,
      handler (v) {
        if (Array.isArray(v)) {
          this.handleArrayData(v)
        }
      }
    },
    localDataSource: {
      deep: true,
      handler (v) {
        var arr = this.transitionData(v)
        this.transitionDataSource = arr
      }
    },
    selects: {
      deep: true,
      handler (v) {
        var arr = this.transitionData(this.localDataSource)
        this.transitionDataSource = arr
      }
    },
    transitionDataSource: {
      deep: true,
      handler (v) {
        console.log('transitionDataSource', this.transitionDataSource)
      }
    }
  },
  computed: {
    selects () {
      return this.$store.getters.selects
    }
  },
  created () {
    //
    const { pageNo } = this.$route.params
    const localPageNum = this.pageURI && (pageNo && parseInt(pageNo)) || this.pageNum
    this.localPagination = ['auto', true].includes(this.showPagination) && Object.assign({}, this.localPagination, {
      current: localPageNum,
      pageSize: this.pageSize,
      showSizeChanger: this.showSizeChanger
    }) || false
    this.needTotalList = this.initTotalList(this.columns)
    this.loadData()
    this.$on('search.form.search', (search) => {
      this.searchData = Object.assign({}, search)
      this.$emit('search', this.localPagination, search)
      this.loadData()
    })
  },
  methods: {
    ...mapActions([
      'loadSelect'
    ]),
    transitionData (data) {
      var res = []
      if (Array.isArray(data) && data.length > 0) {
        var { columns = [], childrenColumnName = 'children' } = this
        var enums = []
        var timearr = []
        columns.forEach(item => {
          var { enum: enum1 = '', time } = item
          if (enum1 !== '') {
            this.loadSelect(enum1)
            enums.push(item)
          }
          if (typeof time !== 'undefined' && time !== null && time !== false) {
            timearr.push(item)
          }
        })
        if (enums.length > 0 || timearr.length > 0) {
          data.forEach((item, index) => {
            var nitem = Object.assign({}, item)
            if (enums.length > 0) {
               enums.forEach(e => {
                var { key, enum: enum1 } = e
                var obj = item[key]
                var selectData = this.$store.getters.getSelectData(enum1)
                if (Array.isArray(selectData) && selectData.length > 0) {
                  if (typeof obj !== 'undefined' && obj !== null) {
                    if (!Array.isArray(obj)) {
                      obj = obj + ''
                      obj = obj.split(',')
                    }
                  }
                  var titles = []
                  for (var k in selectData) {
                    var sd = selectData[k]
                    var { value, title } = sd
                    var flag = false
                    for (var i in obj) {
                      var o = obj[i]
                      if (o === value) {
                        titles.push(title)
                        flag = true
                        break
                      }
                    }
                    if (obj.length === 1 && flag) {
                      break
                    }
                  }
                  nitem['_' + key] = titles.join(',')
                }
              })
            }
            if (timearr.length > 0) {
              timearr.forEach(t => {
                var { key: key1, time } = t
                var format = 'yyyy-MM-dd HH:mm:ss'
                if (time !== true) {
                  format = time
                }
                 var obj1 = item[key1]
                 if (typeof obj1 !== 'undefined' && obj1 !== null) {
                   nitem[key1] = times(obj1, format)
                   nitem['_' + key1] = obj1
                 }
              })
            }
            if (nitem.hasOwnProperty(childrenColumnName)) {
              var narr = nitem[childrenColumnName]
              var s = this.transitionData(narr)
              if (Array.isArray(s)) {
                nitem[childrenColumnName] = s
              }
            }
            res.push(nitem)
          })
        }
      }
      return res
    },
    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh (bool = false) {
      bool && (this.localPagination = Object.assign({}, {
        current: 1, pageSize: this.pageSize
      }))
      this.loadData()
      this.$emit('search', this.localPagination, this.searchData)
    },
    handleArrayData (arr) {
      if (Array.isArray(arr)) {
        var d = [].concat(arr)
        var { current = 1, pageSize = 10 } = this.localPagination
        var s = d.filter(item => {
          var flag = true
          for (var key in this.searchData) {
            var v = this.searchData[key]
            if (typeof v !== 'undefined' && v !== null && v !== '') {
              if (item.hasOwnProperty(key)) {
                if (item[key].indexOf(v) === -1) {
                  flag = false
                  break
                }
              }
            }
          }
          return flag
        })
        // 向上翻一页
        var { start, end } = this.setPageing(s.length, current, pageSize)
        var res = []
        for (var i = start; i < end; i++) {
          if (s.length <= i) {
            break
          }
          res.push(s[i])
        }
        this.localLoading = false
        this.localDataSource = res
        this.localPagination = this.showPagination && Object.assign({}, this.localPagination, {
          // current: r.pageNum, // 返回结果中的当前分页数
          total: s.length, // 返回结果中的总记录数
          showSizeChanger: this.showSizeChanger,
          showTotal: function (total, range) {
            return `共 ${total} 条`
          }
          // pageSize: (pagination && pagination.pageSize) ||
          //       this.localPagination.pageSize
        }) || false
      }
    },
    setPageing (len, current, pageSize) {
      var start = (current - 1) * pageSize
      var end = current * pageSize
      if (len < start && current > 1) {
        current--
        var s = this.setPageing(len, current, pageSize)
        if (typeof s !== 'undefined') {
          return s
        }
      }
      return { start: start, end: end }
    },
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    loadData (pagination, filters, sorter) {
      this.localLoading = true
      if (Array.isArray(this.data)) {
        this.localPagination = Object.assign({}, pagination || {})
        this.handleArrayData(this.data)
        setTimeout(() => {
          this.localLoading = false
        }, 500)
        return
      }
      const parameter = Object.assign({
        pageNumber: (pagination && pagination.current) ||
          this.showPagination && this.localPagination.current || this.pageNum,
        pageSize: (pagination && pagination.pageSize) ||
          this.showPagination && this.localPagination.pageSize || this.pageSize
      },
      (sorter && sorter.field && {
        sortField: sorter.field
      }) || {},
      (sorter && sorter.order && {
        sortOrder: sorter.order
      }) || {}, {
        ...filters
      },
      { ...this.searchData }
      )
      const result = this.data(parameter)
      // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.data
      // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then(res => {
          var { success = false } = res
          if (success) {
            var r = res.data || {}
            this.localPagination = this.showPagination && Object.assign({}, this.localPagination, {
              current: r.pageNum, // 返回结果中的当前分页数
              total: r.total, // 返回结果中的总记录数
              showSizeChanger: this.showSizeChanger,
              showTotal: function (total, range) {
                return `共 ${total} 条`
              },
              pageSize: (pagination && pagination.pageSize) ||
                this.localPagination.pageSize
            }) || false
            // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
            if ((!Array.isArray(r.list) || r.list.length === 0) && this.showPagination && this.localPagination.current > 1) {
              this.localPagination.current--
              this.loadData()
              return
            }
            // 这里用于判断接口是否有返回 r.totalCount 且 this.showPagination = true 且 pageNo 和 pageSize 存在 且 totalCount 小于等于 pageNo * pageSize 的大小
            // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
            try {
              if ((['auto', true].includes(this.showPagination) && r.total <= (r.pageNum * this.localPagination.pageSize))) {
                this.localPagination.hideOnSinglePage = true
              }
            } catch (e) {
              this.localPagination = false
            }
            this.localDataSource = r.list // 返回结果中的数组数据
            this.localLoading = false
            return
          }
          this.localLoading = false
          this.$message.error('加载表格数据失败!')
        }).catch(e => {
          this.localLoading = false
          this.$message.error('加载表格数据失败!')
        })
      }
    },
    initTotalList (columns) {
      const totalList = []
      columns && columns instanceof Array && columns.forEach(column => {
        if (column.needTotal) {
          totalList.push({
            ...column,
            total: 0
          })
        }
      })
      return totalList
    },
    /**
     * 用于更新已选中的列表数据 total 统计
     * @param selectedRowKeys
     * @param selectedRows
     */
    updateSelect (selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys
      const list = this.needTotalList
      this.needTotalList = list.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            const total = sum + parseInt(get(val, item.dataIndex))
            return isNaN(total) ? 0 : total
          }, 0)
        }
      })
    },
    /**
     * 清空 table 已选中项
     */
    clearSelected () {
      if (this.rowSelection) {
        this.rowSelection.onChange([], [])
        this.updateSelect([], [])
      }
    },
    getCustomSlots (h) {
      var { columns } = this
      var slots = {}
      columns.forEach((item, index) => {
        var { enum: enum1 = '', key, scopedSlots } = item
        if (enum1 !== '') {
          var skey = 'custom-' + key
          if (typeof scopedSlots === 'undefined' || scopedSlots === null) {
            columns.splice(index, 1, Object.assign({},
              item,
              { scopedSlots: { customRender: skey } }))
            slots[skey] = function (a, row) {
              return (<span>{row['_' + key]}</span>)
            }
          } else {
            if (scopedSlots.hasOwnProperty('customRender') &&
                scopedSlots.customRender === skey) {
              slots[skey] = function (a, row) {
                return (<span>{row['_' + key]}</span>)
              }
            }
          }
        }
      })
      return slots
    },
    /**
     * 处理交给 table 使用者去处理 clear 事件时，内部选中统计同时调用
     * @param callback
     * @returns {*}
     */
    renderClear (callback) {
      if (this.selectedRowKeys.length <= 0) return null
      return (
        <a style="margin-left: 24px" onClick={() => {
          callback()
          this.clearSelected()
        }}>清空</a>
      )
    },
    renderAlert () {
      // 绘制统计列数据
      const needTotalItems = this.needTotalList.map((item) => {
        return (<span style="margin-right: 12px">
          {item.title}总计 <a style="font-weight: 600">{!item.customRender ? item.total : item.customRender(item.total)}</a>
        </span>)
      })
      // 绘制 清空 按钮
      const clearItem = (typeof this.alert.clear === 'boolean' && this.alert.clear) ? (
        this.renderClear(this.clearSelected)
      ) : (this.alert !== null && typeof this.alert.clear === 'function') ? (
        this.renderClear(this.alert.clear)
      ) : null
      // 绘制 alert 组件
      return (
        <a-alert showIcon={true} style="margin-bottom: 16px">
          <template slot="message">
            <span style="margin-right: 12px">已选择: <a style="font-weight: 600">{this.selectedRows.length}</a></span>
            {needTotalItems}
            {clearItem}
          </template>
        </a-alert>
      )
    }
  },
  render (h) {
    const props = {}
    const localKeys = Object.keys(this.$data)
    const showAlert = (typeof this.alert === 'object' && this.alert !== null && this.alert.show) && typeof this.rowSelection.selectedRowKeys !== 'undefined' || this.alert
    Object.keys(T.props).forEach(k => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey]
        return props[k]
      }
      if (k === 'rowSelection') {
        if (showAlert && this.rowSelection) {
          // 如果需要使用alert，则重新绑定 rowSelection 事件
          props[k] = {
            ...this.rowSelection,
            selectedRows: this.selectedRows,
            selectedRowKeys: this.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.updateSelect(selectedRowKeys, selectedRows)
              typeof this[k].onChange !== 'undefined' && this[k].onChange(selectedRowKeys, selectedRows)
            }
          }
          return props[k]
        } else if (!this.rowSelection) {
          // 如果没打算开启 rowSelection 则清空默认的选择项
          props[k] = null
          return props[k]
        }
      }
      this[k] && (props[k] = this[k])
      return props[k]
    })
    var pc = ['top']
    var ss = this.getCustomSlots(h)
    Object.keys(this.$scopedSlots).forEach(name => {
      if (pc.indexOf(name) === -1) {
        ss[name] = this.$scopedSlots[name]
      }
    })
    // transitionDataSource
    var { dataSource } = props
    if (Array.isArray(dataSource) && dataSource.length > 0 && this.transitionDataSource.length > 0) {
      props.dataSource = this.transitionDataSource
    }
    // var slots = this.getCustomSlots(h)
    var { expandIcon, childrenColumnName } = props
    if (typeof expandIcon !== 'function') {
      props.expandIcon = function (e) {
        var { record = {}, expanded = false } = e
        if (record.hasOwnProperty(childrenColumnName)) {
          var arr = record[childrenColumnName]
          if (Array.isArray(arr) && arr.length > 0) {
            var ss1 = {
              on: {
                click () {
                  e.onExpand()
                }
              }
            }
            if (expanded) {
              return (<a title="收起" {...ss1}><a-icon type="caret-down" twoToneColor="#555"/></a>)
            }
            return (<a title="展开" {...ss1}><a-icon type="caret-right" twoToneColor="#555"/></a>)
          }
        }
        return (<span></span>)
      }
    }
    if (this.pagination === false) {
      props.pagination = false
    } else {
      Object.assign(props.pagination, { hideOnSinglePage: false })
    }
    const table = (
      <a-table {...{ props, scopedSlots: { ...ss } }} onChange={this.loadData} class="search_table">
        { Object.keys(ss).map(name => (<template slot={name}>{ss[name]}</template>)) }
      </a-table>
    )
    return (
      <div class="table-wrapper">
        <div class="search-table-top" style="margin-bottom:5px;">{this.$slots.top}</div>
        { showAlert ? this.renderAlert() : null }
        { table }
      </div>
    )
  }
}
</script>
<style lang="less">
.search_table{
  .ant-table-thead{
    tr{
      th{
        padding: 8px;
      }
      td{
        padding: 8px;
      }
    }
  }
  .ant-table-tbody{
    tr{
      th{
        padding: 5px 5px;
      }
      td{
        padding: 5px 5px;
      }
    }
  }
}
</style>
