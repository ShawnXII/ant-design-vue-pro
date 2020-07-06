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
            v-action:add>新增角色</a-button>
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
        { title: '角色CODE', dataIndex: 'code', key: 'code', width: '20%', ellipsis: true },
        { title: '角色名称', dataIndex: 'name', key: 'name', width: '20%', ellipsis: true },
        { title: '角色说明', dataIndex: 'description', key: 'description', width: '30%', ellipsis: true },
        { title: '角色状态', dataIndex: 'status', key: 'status', width: '10%', scopedSlots: { customRender: 'status' }, ellipsis: true, align: 'center' },
        { title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' }, width: '20%' }
      ]
    }
  },
  methods: {
    page (o) {
      return page(urls.role.prefix, o)
    },
    search () {

    },
    add () {
      this.$router.push({ name: 'systemRoleAdd' })
    }
  }
}
</script>

<style>

</style>
