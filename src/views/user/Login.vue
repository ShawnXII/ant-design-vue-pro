<template>
  <div class="main">
    <a-form-model :model="model" ref="loginForm" class="user-layout-login" :rules="rules">
      <!---->
      <a-tabs :activeKey="model.customActiveKey" :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }" @change="handleTabClick">
        <a-tab-pane key="username" tab="账号密码登录">
          <!--用户名-->
          <a-form-model-item prop="username">
            <a-input :size="config.size" type="text" placeholder="用户名/邮箱" v-model="model.username">
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-model-item>
          <!--密码-->
          <a-form-model-item prop="password">
            <a-input-password :size="config.size" placeholder="密码" v-model="model.password" >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-model-item>
        </a-tab-pane>
        <a-tab-pane key="mobile" tab="手机号登录">
          <a-form-model-item prop="mobile">
            <a-input :size="config.size" v-model="model.mobile" type="text" placeholder="手机号" >
              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-model-item>
          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <a-input :size="config.size" type="text" placeholder="验证码" >
                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="config.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!config.smsSendBtn && '获取验证码' || (config.time+' s')"
              ></a-button>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
      <!--自动登录/忘记密码-->
      <a-form-model-item>
        <a-checkbox v-model="model.rememberMe">自动登录</a-checkbox>
        <router-link
          :to="{ name: 'recover', params: { user: 'aaa'} }"
          class="forge-password"
          style="float: right;"
        >忘记密码</router-link>
      </a-form-model-item>
      <a-form-model-item style="margin-top:24px">
        <a-button
          :size="config.size"
          type="primary"
          htmlType="submit"
          class="login-button"
          @click="handleSubmit"
          :loading="config.loginBtn"
          :disabled="config.loginBtn">登录</a-button>
      </a-form-model-item>
      <div class="user-login-other">
        <span>其他登录方式</span>
        <a>
          <a-icon class="item-icon" type="alipay-circle"></a-icon>
        </a>
        <a>
          <a-icon class="item-icon" type="taobao-circle"></a-icon>
        </a>
        <a>
          <a-icon class="item-icon" type="weibo-circle"></a-icon>
        </a>
        <router-link class="register" :to="{ name: 'register' }">注册账户</router-link>
      </div>
    </a-form-model>

    <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>
  </div>
</template>

<script>

import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { getSmsCaptcha, get2step } from '@/api/login'

import { login } from './src/login.js'

export default {
  components: {
    TwoStepCaptcha
  },
  data () {
    return {
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      rules: {
        username: [{ required: true, message: '请输入帐户名或邮箱地址', trigger: 'blur' }, { validator: this.handleUsernameOrEmail, trigger: 'blur' }],
        mobile: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号', trigger: 'change' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      model: {
        username: '', // 用户名
        password: '', // 密码
        mobile: '',
        rememberMe: false,
        captcha: '',
         // login type: 0 email, 1 username, 2 telephone
        loginType: 1,
        customActiveKey: 'username'
      },
      config: {
        size: 'large',
        time: 60,
        loginBtn: false,

        loginType: 0,
        smsSendBtn: false
      },
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  created () {
    get2step({ })
      .then(res => {
        this.requiredTwoStepCaptcha = res.result.stepCode
      })
      .catch(() => {
        this.requiredTwoStepCaptcha = false
      })
    // this.requiredTwoStepCaptcha = true
  },
  mounted () {

  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // 判断用户名是否是手机号码 或者 邮箱 或者用户名
    handleUsernameOrEmail (rule, value, callback) {
      const { model } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        model.loginType = 0
      } else {
        const mobilRegex = /^1[34578]\d{9}$/
        model.loginType = mobilRegex.test(value) ? 1 : 2
      }
      callback()
    },
    handleTabClick (key) {
      this.model.customActiveKey = key
      this.$refs.loginForm.resetFields()
    },
    handleSubmit (e) {
      login(this.$refs.loginForm, this.model)
      // e.preventDefault()
      // const {
      //   form: { validateFields },
      //   state,
      //   customActiveKey,
      //   Login
      // } = this

      // state.loginBtn = true

      // const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha']

      // validateFields(validateFieldsKey, { force: true }, (err, values) => {
      //   if (!err) {
      //     console.log('login form', values)
      //     const loginParams = { ...values }
      //     delete loginParams.username
      //     loginParams[!state.loginType ? 'email' : 'username'] = values.username
      //     loginParams.password = md5(values.password)
      //     Login(loginParams)
      //       .then((res) => this.loginSuccess(res))
      //       .catch(err => this.requestFailed(err))
      //       .finally(() => {
      //         state.loginBtn = false
      //       })
      //   } else {
      //     setTimeout(() => {
      //       state.loginBtn = false
      //     }, 600)
      //   }
      // })
    },
    getCaptcha (e) {
      e.preventDefault()
      const { form: { validateFields }, state } = this

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          getSmsCaptcha({ mobile: values.mobile }).then(res => {
            setTimeout(hide, 2500)
            this.$notification['success']({
              message: '提示',
              description: '验证码获取成功，您的验证码为：' + res.result.captcha,
              duration: 8
            })
          }).catch(err => {
            setTimeout(hide, 1)
            clearInterval(interval)
            state.time = 60
            state.smsSendBtn = false
            this.requestFailed(err)
          })
        }
      })
    },
    stepCaptchaSuccess () {
      this.loginSuccess()
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess (res) {
      console.log(res)
      // check res.homePage define, set $router.push name res.homePage
      // Why not enter onComplete
      /*
      this.$router.push({ name: 'analysis' }, () => {
        console.log('onComplete')
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      })
      */
      this.$router.push({ path: '/' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed (err) {
      this.isLoginError = true
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
