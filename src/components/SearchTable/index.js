import TableSearchForm from './src/form/form.vue'
import TableSearch from './src/table/table.vue'

TableSearchForm.install = function (Vue) {
    Vue.component(TableSearchForm.name, TableSearchForm)
}

TableSearch.install = function (Vue) {
    Vue.component(TableSearch.name, TableSearch)
}

export { TableSearchForm, TableSearch }
