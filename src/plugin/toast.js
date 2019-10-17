import { Loading } from 'element-ui'
import Vue from 'vue'
let loading = ''
let options = {}

const loadInstance = (params = {}) => {
  options = Object.assign({
    lock: true,
    background: 'rgba(0, 0, 0, 0)'
  }, params)
  const show = () => {
    loading = Loading.service(options)
  }
  const hide = () => {
    Vue.nextTick(() => {
      loading.close()
    })
  }
  return { show, hide }
}

export default {
  install: Vue => {
    Vue.prototype.$loading = loadInstance
  }
}

