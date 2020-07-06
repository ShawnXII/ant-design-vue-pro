<template>
  <a-form-model :model="form" v-bind="formBind" ref="roleAddForm" >
    <a-form-model-item label="角色CODE" prop="code">
      <a-input v-model="form.code" placeholder="角色CODE"/>
    </a-form-model-item>
    <a-form-model-item label="角色名称" prop="name">
      <a-input v-model="form.name" placeholder="角色名称"/>
    </a-form-model-item>
    <a-form-model-item label="角色状态" prop="status">
      <a-switch checkedChildren="启用" unCheckedChildren="禁用" @change="(e)=>{form.status = e?1:2}" :checked="form.status === 1"/>
    </a-form-model-item>
    <a-form-model-item label="角色说明">
      <a-textarea
        v-model="form.description"
        placeholder="角色说明"
        :maxLength="200"
        :autoSize="{ minRows: 3, maxRows: 5 }"/>
    </a-form-model-item>
    <a-form-model-item :wrapperCol="{span: 24, offset: 12}">
      <a-button type="primary" @click="nextStep">下一步</a-button>
    </a-form-model-item>
  </a-form-model>

</template>

<script>

import { ask } from '@/utils/request.js'
import urls from '@/api/urls.js'

export default {
  props: {
    model: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      formBind: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
        rules: {
          code: [{ required: true, message: '请输入角色CODE', trigger: 'blur' },
            { min: 1, max: 20, message: '请输入1-20个字符串', trigger: 'blur' },
            { pattern: '^[a-zA-Z]{1}[0-9a-zA-Z_]+$', message: '只能输入英文/数字/_,必须用英文开头', trigger: 'blur' },
            { validator: this.checkCode, trigger: 'blur' } ],
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 1, max: 15, message: '请输入1-15个字符串', trigger: 'blur' },
            { validator: this.checkName, trigger: 'blur' }
          ]
        }
      },
      form: {
        id: '',
        code: '',
        name: '',
        status: 1,
        description: ''
      }
    }
  },
  watch: {
    model: {
      deep: true,
      handler (v) {
        this.initData(v)
      }
    }
  },
  mounted () {
    this.initData(this.model)
  },
  methods: {
      initData (v) {
        Object.keys(this.form).forEach(key => {
          if (v.hasOwnProperty(key)) {
            this.form[key] = v[key]
          }
        })
      },
      checkName (rule, value, callback) {
       if (value) {
         ask(urls.role.check, { name: value }).then(res => {
            if (!res.data) {
              return callback(new Error('角色名称已经存在'))
            }
            return callback()
         })
       }
     },
    checkCode (rule, value, callback) {
      if (value) {
         ask(urls.role.check, { code: value }).then(res => {
            if (!res.data) {
              return callback(new Error('角色code已经存在'))
            }
            return callback()
         })
       }
    },
    nextStep () {
      this.$refs.roleAddForm.validate(valid => {
        if (!valid) {
          return
        }
        this.$emit('nextStep', this.form)
      })
    }
  }
}
</script>

<style>

</style>
