<template>
  <a-card>
    <search-table
      :columns="columns"
      :data="data"
      bordered>
      <template slot="top">
        <!--搜索框-->
        <!-- <search-table-form :fields="fields" ref="tableSearchForm" /> -->
        <!--按钮-->
        <div class="table-operator">
          <a-button
            type="primary"
            ghost
            icon="plus"
            @click="add"
            v-action:add>新建用户</a-button>
          <a-button
            type="primary"
            ghost
            icon="import"
            v-action:remove
            disabled
            style="margin-left:5px;">删除</a-button>
          <a-input-search placeholder="支持搜索策略名称/描述/备注" style="width: 300px;float:right;" @search="search"/>
        </div>
      </template>
      <!--帐号状态-->
      <span slot="status" slot-scope="a,row">
        <a-tag color="#2db7f5" v-if="row.status === 1">正常</a-tag>
        <a-tag color="#87d068" v-else-if="row.status === 1">禁用</a-tag>
        <a-tag color="#87d068" v-else-if="row.status === 1">锁定</a-tag>
        <a-tag color="#87d068" v-else>待激活</a-tag>
      </span>
      <span slot="isLogin" slot-scope="a,row">
        <a-tag color="#2db7f5" v-if="row.isLogin">在线</a-tag>
        <a-tag color="#87d068" v-else>离线</a-tag>
      </span>
      <template slot="action" slot-scope="a,row">
        <a-button type="link" v-if="row.isLogin">下线</a-button>
        <a-button type="link" @click="showLog(row)">查看操作日志</a-button>
        <a-button type="link" >修改</a-button>
      </template>
    </search-table>
  </a-card>
</template>

<script>
import { page } from '@/utils/request.js'
import urls from '@/api/urls.js'
export default {
  data () {
    return {
       data: this.page,
       columns: [
        { title: '用户名', dataIndex: 'username', key: 'username', width: '10%', ellipsis: true },
        { title: '手机号', dataIndex: 'phone', key: 'phone', width: '10%', ellipsis: true },
        { title: '邮箱', dataIndex: 'email', key: 'email', width: '10%', ellipsis: true },
        { title: '帐号状态', dataIndex: 'status', key: 'status', width: '10%', ellipsis: true, scopedSlots: { customRender: 'status' } },
        { title: '注册时间', dataIndex: 'registerTime', key: 'registerTime', time: true, width: '10%', ellipsis: true, align: 'center' },
        { title: '注册地址', dataIndex: 'registerIp', key: 'registerIp', width: '10%', ellipsis: true },
        { title: '最后登录时间', dataIndex: 'lastLoginTime', key: 'lastLoginTime', time: true, width: '10%', ellipsis: true, align: 'center' },
        { title: '最后登录IP', dataIndex: 'lastLoginIp', key: 'lastLoginIp', width: '10%', ellipsis: true, align: 'center' },
        { title: '是否在线', dataIndex: 'isLogin', key: 'isLogin', width: '10%', ellipsis: true, align: 'center', scopedSlots: { customRender: 'isLogin' } },
        { title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' }, width: '20%' }
      ]
    }
  },
  methods: {
    page (o) {
      return page(urls.account.prefix, o)
    },
    search () {

    },
    add () {
      this.$router.push({ name: 'systemAccountAdd' })
    },
    showLog () {

    }
  }
}
</script>

<style>

</style>
