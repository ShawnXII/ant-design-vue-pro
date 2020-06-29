<template>
  <div class="search-table-form table-page-search-wrapper" ref="searchTableForm">
    <a-form layout="inline" hide-required-mark :form="form">
      <a-row :gutter="48" >
        <template v-for="(item,index) in fields">
          <a-col v-bind="span.props" :key="'search-table-'+index" v-show="advanced || index<(span.span-1)">
            <a-form-item v-bind="item.item" :label="item.label">
              <template v-if="item.slot">
                <slot :name="item.slot"></slot>
              </template>
              <template v-else>
                <component
                  v-if="component(item)!=null"
                  :is="component(item)"
                  v-bind="attr(item)"
                  v-on="on(item)"
                  v-decorator="[`${item.key}`,doption(item)]"></component>
              </template>
            </a-form-item>
          </a-col>
        </template>
        <a-col v-if="fields.length>0" v-bind="span.props" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
          <span class="table-page-search-submitButtons" >
            <a-button type="primary" @click="search" :loading="loading">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset" :loading="loading">重置</a-button>
            <a @click="advanced = !advanced" style="margin-left: 8px" v-if="span.span<=fields.length">
              {{ advanced ? '收起' : '更多' }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import Config from '../box/config'

import emitter from '@/components/_util/emitter'

export default {
  mixins: [emitter],
  name: 'SearchTableForm',
  componentName: 'SearchTableForm',
  props: {
    /**
     * 搜索字段配置
     */
    fields: {
      type: Array,
      default () {
        return []
      }
    },
    // 更多搜索内容
    more: {
      type: Boolean,
      default: true
    },
    config: {
      type: Object,
      default () {
        return {
          xs: {
            row: 2,
            min: 0, // 临界宽度 最小宽度
            max: 576
          },
          sm: {
            row: 2,
            min: 576,
            max: 768
          },
          md: {
            row: 3,
            min: 768,
            max: 992
          },
          lg: {
            row: 4,
            span: 4,
            min: 992,
            max: 1200
          },
          xl: {
            row: 6,
            span: 4,
            min: 1200,
            max: 1600
          },
          xxl: {
            row: 6,
            min: 1600,
            max: 100000
          }
        }
      }
    }
  },
  data () {
    return {
      loading: false,
      screenWidth: 0,
      listener: true,
      advanced: false,
      form: this.$form.createForm(this)
      // xs <576px 响应式栅格，可为栅格数或一个包含其他属性的对象
      // sm	≥576px 响应式栅格，可为栅格数或一个包含其他属性的对象
      // md	≥768px 响应式栅格，可为栅格数或一个包含其他属性的对象
      // lg	≥992px 响应式栅格，可为栅格数或一个包含其他属性的对象
      // xl	≥1200px 响应式栅格，可为栅格数或一个包含其他属性的对象
      // xxl	≥1600px 响应式栅格，可为栅格数或一个包含其他属性的对象
    }
  },
  computed: {
    span () {
      var span = null
      const rows = 24
      var skey = ''
      var result = {}
      Object.keys(this.config).forEach(key => {
        const { row, min, max, span: span1 } = this.config[key]
        if (typeof span1 !== 'undefined' && span1 !== null) {
          result[key] = Math.floor(rows / span1)
        } else {
          result[key] = Math.floor(rows / row)
        }

        if (span == null) {
          if (this.screenWidth >= min && this.screenWidth < max) {
            span = row
            skey = key
          }
        }
      })
      return { props: result, span: span, key: skey }
    }
  },
  created () {
    // this.fields.forEach(item => {
    //   const { defaultValue, key } = item
    //   this.form.getFieldDecorator(key, { initialValue: defaultValue })
    // })
    this.$on('search.table.load', (v) => {
      this.loading = v
    })
  },
  mounted () {
    // 监听屏幕宽度
    this.resize()
    window.addEventListener('resize', this.resize, true)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize, true)
  },
  methods: {
    resize () {
      this.screenWidth = this.$refs.searchTableForm.clientWidth
      if (this.listener) {
        // 修复点击隐藏菜单时候获取的宽度是上一个状态的BUG
        this.listener = false
        setTimeout(() => {
          this.screenWidth = this.$refs.searchTableForm.clientWidth
          this.listener = true
        }, 200)
      }
    },
    search () {
      // 避免多次请求 本次请求必须得到应答才会完成
      this.dispatch('SearchTable', 'search.form.search', [this.form.getFieldsValue()])
    },
    reset () {
      this.form.resetFields()
      this.dispatch('SearchTable', 'search.form.search', [this.form.getFieldsValue()])
    },
    component (options) {
      const { type } = options
      if (!Config.hasOwnProperty(type) || !Config[type].component) {
        console.error('未配置的输入对象:[' + type + '],请在 components/SearchTable/src/box/config.js 文件中配置[' + type + ']对应的输入框!')
        return null
      }
      return Config[type].component
    },
    on (options) {
      const { type } = options
      return Object.assign({}, Config[type].on, options)
    },
    attr (options) {
      const { type } = options
      var attr = Object.assign({}, Config[type].bind, options)
      if (type !== 'select') {
        delete attr.defaultValue
      } else {
        attr.defaultValue = attr.defaultValue || ''
      }
      return attr
    },
    doption (options) {
      const { defaultValue, type } = options
      if (type !== 'select') {
        if (typeof defaultValue !== 'undefined' && defaultValue !== null && defaultValue !== '') {
          return { initialValue: defaultValue }
        }
      } else {
        return { initialValue: defaultValue }
      }
      return {}
    }
  }
}
</script>

<style>

</style>
