import Vue from 'vue'
import doctorApi from './api/doctorApi'
import uploadApi from './api/uploadApi'

const api = {
  doctorApi,
  uploadApi
}

Vue.use({
  install: Vue => {
    Vue.prototype.api = api
  }
})
