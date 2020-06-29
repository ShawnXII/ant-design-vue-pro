<template>
  <a-card>
    <search-table
      :columns="columns"
      :data="data"
      bordered
      childrenColumnName="childs">
      <template slot="top">
        <!--搜索框-->
        <search-table-form :fields="fields" ref="tableSearchForm">

        </search-table-form>
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
                { title: '策略名', dataIndex: 'username', key: 'username', width: '20%', ellipsis: true },
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
    }
}
</script>

<style>

</style>
