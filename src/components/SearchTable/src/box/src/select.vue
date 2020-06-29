<template>
  <a-select
    v-bind="$attrs"
    v-on="$listeners"
    ref="select"
  >
    <a-select-option v-for="(item,index) in selectData" :key="'box-select-'+index" v-bind="item">
      {{ item.label }}
    </a-select-option>
  </a-select>
</template>

<script>
export default {
  props: {
    data: {
      type: [Array, String],
      default () {
        return []
      }
    },
    value: {
      type: [String, Array, Number],
      default: ''
    }
  },
  data () {
    return {
      selectData: []
    }
  },
  computed: {

  },
  watch: {
    value (a) {
      if (typeof this.$attrs.defaultValue !== 'undefined' && this.$attrs.defaultValue !== null) {
        if (a === this.$attrs.defaultValue) {
          var c = [this.$attrs.defaultValue]
          if (Array.isArray(this.$attrs.defaultValue)) {
            c = this.$attrs.defaultValue
          }
          this.$refs.select.$refs.vcSelect.fireChange(c)
        }
      } else if (typeof a === 'undefined' || a === null || a === '') {
        this.$refs.select.$refs.vcSelect.fireChange([])
      }
    }
  },
  created () {
    if (Array.isArray(this.data)) {
      this.selectData = this.data
    } else {
      // 定义type 通过接口获取数据
    }
  },
  mounted () {
    console.log(this.$refs.select)
  },
  methods: {

  }
}
</script>

<style>

</style>
