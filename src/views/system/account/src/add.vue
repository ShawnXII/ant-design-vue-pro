<template>
  <a-card>
    <a-form-model :model="form" v-bind="formBind" ref="accountAddForm" >
      <a-form-model-item label="姓名" prop="username">
        <a-input v-model="form.username" placeholder="用户名"/>
      </a-form-model-item>
      <a-form-model-item label="性别" prop="phone" help="">
        <a-input v-model="form.username" placeholder="手机号"/>
      </a-form-model-item>
      <a-form-model-item label="生日" prop="phone" help="">
        <a-input v-model="form.username" placeholder="手机号"/>
      </a-form-model-item>
      <a-form-model-item label="组织" v-if="[1,2].indexOf(form.accountType) !== -1" prop="phone" help="">
        <a-input v-model="form.username" placeholder="手机号"/>
      </a-form-model-item>
      <a-form-model-item label="角色" v-if="[1,2].indexOf(form.accountType) !== -1" prop="phone" help="">
        <a-input v-model="form.username" placeholder="手机号"/>
      </a-form-model-item>
      <a-form-model-item label="手机号" prop="phone" help="">
        <a-input v-model="form.username" placeholder="手机号"/>
      </a-form-model-item>
      <a-form-model-item label="邮箱" prop="email" help="随机密码会发送至指定邮箱">
        <a-input v-model="form.email" placeholder="xx@xx.com"/>
      </a-form-model-item>
      <a-form-model-item label="用户名" prop="roles" help="">
        <a-input v-model="form.roles" placeholder="系统角色"/>
      </a-form-model-item>
      <a-form-model-item label="密码" prop="roles" help="">
        <a-input v-model="form.roles" placeholder="系统角色"/>
      </a-form-model-item>
    </a-form-model>
    <a-modal
      title="选择用户类型"
      :footer="null"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      centered
      :visible="visible">
      <a-radio-group size="large" style="width:100%" @change="selectAccountType">
        <div class="radio-div" v-for="item in accountTypes" :key="'account-type-'+item.value">
          <a-radio-button :value="item.value">
            {{ item.label }}
          </a-radio-button>
        </div>
      </a-radio-group>
    </a-modal>
  </a-card>

</template>

<script>
export default {
  data () {
    return {
      accountTypes: [
        { value: 1, label: '平台管理员' },
        { value: 2, label: '店铺管理员' },
        { value: 3, label: '测试帐号' }
      ],
      visible: true,
      formBind: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
        rules: {
          username: '',
          email: '',
          phone: ''
        }
      },
      form: {
        accountType: null
      }
    }
  },
  methods: {
    selectAccountType (e) {
      this.form.accountType = e.target.value
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
  .radio-div{
    margin-bottom: 5px;
    width:100%;
    /deep/.ant-radio-button-wrapper{
      width:100%;
      /deep/ span:last-child{
        text-align: center;
        width: 100%;
        display: block;
      }
    }

  }
</style>
