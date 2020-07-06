<template>
  <a-card :bordered="false">
    <search-table
      :columns="columns"
      :data="data"
      ref="tableRef"
      bordered>
      <template slot="top">
        <!--搜索框-->
        <!-- <search-table-form :fields="fields" ref="tableSearchForm" /> -->
        <!--按钮-->
        <div class="table-operator">
          <a-button
            type="primary"
            ghost
            icon="sync"
            @click="sync"
            v-action:sync>同步</a-button>
          <a-input-search
            v-model="searchVal"
            placeholder="支持搜索URL/请求方式"
            style="width: 300px;float:right;"
            @search="search"/>
        </div>
      </template>
      <span slot="action">
        <a-button type="link" v-action:show>查看详情</a-button>
        <a-button type="link" v-action:edit >修改</a-button>
      </span>
      <span slot="path" slot-scope="a,row">
        {{ row.packageName }}.{{ row.className }}.{{ row.methodName }}
      </span>
      <span slot="astrict" slot-scope="a,row">
        <a-tooltip placement="top" :title="row.limitationTime+'秒内请求超过'+row.limit+'次,该接口会被锁定'+row.locktime+'秒'">
          <a-tag color="pink" v-if="row.limitation">访问频率受限</a-tag>
        </a-tooltip>
        <a-tag color="pink" v-if="row.loginAutority">登录认证</a-tag>
        <!--点击查看白名单-->
        <a-tag color="pink" v-if="row.whiteList">白名单访问</a-tag>
      </span>
    </search-table>
  </a-card>
</template>

<script>
import { page, ask } from '@/utils/request.js'
import urls from '@/api/urls.js'

export default {
  data () {
    return {
      data: this.page,
      columns: [
        { title: 'url地址', dataIndex: 'url', key: 'url', width: '20%', ellipsis: true },
        { title: '请求方式', dataIndex: 'method', key: 'method', width: '8%', align: 'center', ellipsis: true },
        { title: '接口地址', dataIndex: 'path', key: 'path', width: '35%', ellipsis: true, scopedSlots: { customRender: 'path' } },
        { title: '访问限制', dataIndex: 'limitation', key: 'limitation', width: '25%', scopedSlots: { customRender: 'astrict' } },
        { title: '同步时间', dataIndex: 'syncTime', key: 'syncTime', width: '20%', ellipsis: true, time: true }
        // { title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' }, width: '20%' }
      ],
      searchVal: ''
    }
  },
  methods: {
    search () {
      // 搜索
       this.$refs.tableRef.refresh()
    },
    sync () {
      // 系统资源同步
      var lock = false
      var that = this
      this.syncContent = '无效的开发资源会在同步过程中被系统删除处理,同步过程无法被取消,请谨慎操作!'
      this.syncModel = this.$confirm({
        title: '确定要同步前后端资源吗?',
        content: this.syncContent,
        keyboard: false,
        centered: true,
        onOk () {
          lock = true
          return new Promise((resolve, reject) => {
            that.syncContent = '开始同步后端接口资源'
            ask(urls.interfaceResource.sync).then(res => {
              lock = false
              that.$message.success('同步资源成功!')
              resolve()
              that.$refs.tableRef.refresh(true)
            }).catch(e => {
              that.$message.error('同步资源失败!')
              resolve()
              that.$refs.tableRef.refresh(true)
            })
          })
        },
        onCancel () {
          if (lock) {
            return new Promise((resolve, reject) => {
              that.syncContent = '正在同步资源,无法取消!'
            })
          }
        }
      })
    },
    page (p) {
      return page(urls.interfaceResource.prefix, Object.assign({ searchValue: this.searchVal }, p))
    }
  }
}
</script>

<style>

</style>
