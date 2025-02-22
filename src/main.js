import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import '@/filter' // 过滤器
import '@/network'
import tools from '@/utils/tools'
import store2 from 'store2'
import dayjs from 'dayjs'
import loading from '@/plugin/toast'

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
Vue.use(loading)

Vue.config.productionTip = false
Vue.prototype.tools = tools
Vue.prototype.store = store2
Vue.prototype.dayjs = dayjs

window.$vue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
