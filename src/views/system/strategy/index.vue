<template>
  <a-card>
    <search-table
      :columns="columns"
      :data="data"
      bordered
      childrenColumnName="childs">
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
            v-action:add>新建自定义策略</a-button>
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
import GlobalSearch from '@/components/Search/GlobalSearch'
export default {
    components: { GlobalSearch },
    data () {
        return {
           columns: [
                { title: '策略名', dataIndex: 'name', key: 'username', width: '20%', ellipsis: true },
                { title: '描述', dataIndex: 'phone', key: 'phone', width: '50%', ellipsis: true },
                { title: '服务类型',
                  dataIndex: 'email',
                  key: 'email',
                  filters: [
                    { text: 'Joe', value: 'Joe' },
                    { text: 'Jim', value: 'Jim' }
                  ],
                  width: '10%',
                ellipsis: true },
                { title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' }, width: '20%' }
           ],
           data: [],
           fields: [
            { key: 'organizatioName', type: 'input', placeholder: '支持搜索策略名称/描述/备注' }
          ]
        }
    },
    methods: {
      search () {
        // 搜索
      },
      add () {
         this.$router.push({ name: 'systemStrategyAdd' })
      }
    }
}
</script>

<style>

</style>
