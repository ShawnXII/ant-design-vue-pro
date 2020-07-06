<script>
import { page } from '@/utils/request.js'
import urls from '@/api/urls.js'
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      visible: false,
      data: [],
      columns: [

      ]
    }
  },
  watch: {
    visible (v) {
      v ? this.data = this.page : this.data = []
    }
  },
  methods: {
    page (o) {
      return page(urls.log.prefix, Object.assign({}, o))
    }
  },
  render (h) {
    var { visible, data, columns = [] } = this
    var pros = { visible: visible }
    var tp = { data: data, columns: columns, bordered: true }
    return (<a-modal {...pros}>
       <search-table {...tp}>
       </search-table>
    </a-modal>)
  }
}
</script>
