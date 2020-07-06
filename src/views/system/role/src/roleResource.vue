<template>
  <a-form-model :model="form" v-bind="formBind" ref="roleResourceAddForm" >
    <a-form-model-item :wrapperCol="{span: 24, offset: 12}">
      <a-button type="primary" @click="nextStep">下一步</a-button>
      <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
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
        wrapperCol: { span: 18 }
      },
      form: {

      }
    }
  },
  watch: {
    model: {
      deep: true,
      handler (v) {
        Object.keys(this.form).keys(key => {
          if (v.hasOwnProperty(key)) {
            this.form[key] = v[key]
          }
        })
      }
    }
  },
  methods: {
    prevStep () {
      this.$emit('prevStep', {})
    },
    nextStep () {
      this.$emit('nextStep', {})
    }
  }
}
</script>

<style>

</style>
