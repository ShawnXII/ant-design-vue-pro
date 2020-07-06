<template>
  <page-header-wrapper
    title="新增策略">
    <template v-slot:content>
      123123
    </template>
    <a-card>
      <a-form-model>
        <a-form-model-item label="策略名称" prop="name">

        </a-form-model-item>
        <a-form-model-item label="说明" prop="name">

        </a-form-model-item>
        <a-form-model-item label="策略资源" prop="name">

        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
export default {
  data () {
    return {
      model: {
        name: '',
        remake: ''
      }
    }
  },
  mounted () {
    console.log(this.$refs.warapper)
  },
  methods: {

  }
}
</script>

<style>

</style>
