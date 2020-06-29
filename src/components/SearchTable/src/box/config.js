const config = {
  input: {
    component: 'a-input',
    on: {

    },
    bind: {
      placeholder: '请输入'
    }
  },
  number: {
    component: 'a-input-number',
    on: {

    },
    bind: {
      placeholder: '请输入'
    }
  },
  select: {
    component: () => import('@/components/SearchTable/src/box/src/select.vue'),
    on: {

    },
    bind: {
      placeholder: '请选择'
    }
  }
}

export default config
