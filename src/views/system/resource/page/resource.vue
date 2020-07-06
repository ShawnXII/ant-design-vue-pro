<template>
  <a-card :bordered="false">
    <search-table
      :columns="columns"
      :data="data"
      ref="tableRef"
      childrenColumnName="subpage"
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
          <a-input-search placeholder="支持搜索页面标题/名称" style="width: 300px;float:right;" @search="search"/>
        </div>
      </template>
      <span slot="action" slot-scope="a,row">
        <a-button type="link" @click="show(row)" v-action:show>查看详情</a-button>
        <a-button type="link" @click="edit(row)" v-action:edit>修改</a-button>
      </span>
      <template slot="hiddenHeaderContent" slot-scope="a">
        <a-tag color="green" v-if="a">是</a-tag>
        <a-tag color="purple" v-else>否</a-tag>
      </template>
      <template slot="keepAlive" slot-scope="a">
        <a-tag color="green" v-if="a">是</a-tag>
        <a-tag color="purple" v-else>否</a-tag>
      </template>
      <span slot="status" slot-scope="a,row">
        <a-tag color="#2db7f5" v-if="row.status !== 1">禁用</a-tag>
        <a-tag color="#87d068" v-else>启用</a-tag>
      </span>
    </search-table>
  </a-card>
</template>

<script>
import { page, ask } from '@/utils/request.js'
import urls from '@/api/urls.js'
import { getAnalysisRoute } from '@/utils/routers.js'

export default {
  data () {
    return {
      data: this.page,
      columns: [
        { title: '页面标题', dataIndex: 'resourceTitle', key: 'resourceTitle', width: '20%', ellipsis: true },
        { title: 'name', dataIndex: 'resourceName', key: 'resourceName', width: '20%', ellipsis: true },
        { title: '页面是否缓存', dataIndex: 'keepAlive', key: 'keepAlive', width: '8%', ellipsis: true, align: 'center', scopedSlots: { customRender: 'keepAlive' } },
        { title: '是否隐藏header', dataIndex: 'hiddenHeaderContent', key: 'hiddenHeaderContent', width: '8%', align: 'center', ellipsis: true, scopedSlots: { customRender: 'hiddenHeaderContent' } },
        { title: '备注', dataIndex: 'description', key: 'description', width: '20%', ellipsis: true },
        // { title: '资源状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' }, width: '10%' },
        { title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' }, width: '20%' }
      ]
    }
  },
 computed: {

  },
  methods: {
    search () {
      // 搜索
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
            that.syncContent = '开始同步前端页面资源'
            var resource = getAnalysisRoute()
            ask(urls.resource.sync, resource).then(res => {
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
    page (o) {
      return page(urls.resource.prefix, Object.assign({}, o))
    },
    edit (row) {
       this.$router.push({ name: 'SystemResourcePageEdit' })
    },
    show (row) {
       this.$router.push({ name: 'SystemResourcePageShow' })
    }
  }
}
</script>

<style>

</style>
