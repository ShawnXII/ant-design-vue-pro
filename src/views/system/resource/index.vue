<template>
  <div>
    <page-header-wrapper
      :tab-list="pages"
      v-if="page"
      :tab-active-key="currentKey"
      @tabChange="change" >
      <div class="account-settings-info-right">
        <route-view></route-view>
      </div>
    </page-header-wrapper>
    <route-view v-else></route-view>
  </div>
</template>

<script>
import { RouteView } from '@/layouts'

export default {
  components: {
    RouteView
  },
  data () {
    return {
      pages: [
        { key: 'SystemResourcePage', tab: '页面资源' },
        { key: 'SystemResourceInterface', tab: '接口资源' }
      ],
      currentKey: ''
    }
  },
  mounted () {
    this.currentKey = this.$route.name
  },
  computed: {
    page () {
      var index = this.pages.map(k => k.key).indexOf(this.$route.name)
      return index !== -1
    }
  },
  watch: {
    '$route' (v) {
      this.currentKey = v.name
    }
  },
  methods: {
    change (v) {
      this.$router.push({ name: v })
    }
  }
}
</script>

<style>

</style>
