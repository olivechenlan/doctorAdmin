import axios from './axios'
import { Message } from 'element-ui'

const baseAjax = {
  get: (api, params, success, fail, headers) => {
    axios
      .get(api, {
        params,
        headers
      })
      .then(function(response) {
        success(response.data)
      })
      .catch(function(error) {
        fail(error)
      })
  },
  postFormData: (api, params, success, fail, headers) => {
    let data
    if (params) {
      const queries = []
      var keys = Object.keys(params)
      keys.forEach(key => {
        queries.push(
          encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        )
      })
      data = queries.join('&')
    }
    axios
      .post(api, data, {
        headers: Object.assign(
          {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          headers
        )
      })
      .then(response => {
        success(response.data)
      })
      .catch(error => {
        fail(error)
      })
  },
  postJson: (api, params, success, fail, headers) => {
    axios
      .post(api, params, {
        headers: Object.assign(
          {
            'Content-Type': 'application/json; charset=UTF-8'
          },
          headers
        )
      })
      .then(response => {
        success(response.data)
      })
      .catch(error => {
        fail(error)
      })
  },
  postXml: (api, xml, success, fail, headers) => {
    axios
      .post(api, xml, {
        headers: Object.assign(
          {
            'Content-Type': 'text/xml; charset=utf-8'
          },
          headers
        )
      })
      .then(response => {
        success(response.data)
      })
      .catch(error => {
        fail(error)
      })
  },
  postFile: (api, params, success, fail, headers) => {
    const data = new FormData()
    for (const [key, value] of Object.entries(params)) {
      if (value) { data.append(key, value) }
    }
    axios
      .post(api, data, {
        headers: Object.assign(
          {
            'Content-Type': 'multipart/form-data'
          },
          headers
        )
      })
      .then(response => {
        success(response.data)
      })
      .catch(error => {
        fail(error)
      })
  }
}

export default {
  promiseAjaxGet: (api, params, headers = {}) => {
    return new Promise((resolve, reject) => {
      baseAjax.get(
        api,
        params,
        success => {
          resolve(success)
        },
        fail => {
          reject(fail)
          typeof fail === 'string' && Message(fail)
        },
        headers
      )
    })
  },
  promiseAjaxPost: (api, params, type, headers = {}) => {
    return new Promise((resolve, reject) => {
      baseAjax['post' + type](
        api,
        params,
        success => {
          resolve(success)
        },
        fail => {
          reject(fail)
          typeof fail === 'string' && Message(fail)
        },
        headers
      )
    })
  }
}
