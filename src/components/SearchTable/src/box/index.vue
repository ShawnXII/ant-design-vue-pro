<template>
  <div class="box-input">
    <component :is="component" v-bind="attr" v-on="on" v-if="component!=null" ></component>
  </div>
</template>

<script>

import Config from './config.js'

export default {
  props: {
    options: {
      type: Object,
      default () {
        return null
      }
    }
  },
  data () {
    return {
      component: null,
      attr: {},
      on: {}
    }
  },
  created () {
    if (this.options != null) {
      const { type } = this.options
      if (!Config.hasOwnProperty(type) || !Config[type].component) {
        throw new Error('未配置的输入对象:[' + type + '],请在 components/SearchTable/src/box/config.js 文件中配置[' + type + ']对应的输入框!')
      }
      this.on = Object.assign({}, Config[type].on, this.options)
      this.attr = Object.assign({}, Config[type].bind, this.options)
      this.component = Config[type].component
    }
  }
}
</script>

<style>

</style>
