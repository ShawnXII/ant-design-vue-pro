<template>
  <a-card>
    <a-steps :current="current">
      <a-step title="基本信息" description="角色基本信息" />
      <a-step title="角色资源" description="角色的资源" />
      <a-step title="确认" description="信息确认" />
    </a-steps>
    <div class="content">
      <basic-form :model="form" v-if="current === 0" @nextStep="nextStep"></basic-form>
      <role-resource :model="form" v-if="current === 1" @nextStep="nextStep" @prevStep="prevStep"></role-resource>
    </div>
  </a-card>
</template>

<script>
import BasicForm from './basic.vue'
import RoleResource from './roleResource.vue'
export default {
  components: { BasicForm, RoleResource },
  data () {
    return {
      current: 0,
      form: {
        id: '',
        code: '',
        name: '',
        description: '',
        status: 1,
        resource: []
      }
    }
  },
  methods: {
    nextStep (v) {
      Object.assign(this.form, v)
      this.current++
    },
    prevStep (v) {
      this.current > 0 && this.current--
    }
  }
}
</script>

<style>

</style>
