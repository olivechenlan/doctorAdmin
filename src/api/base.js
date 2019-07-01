import axios from '@/utils/axios'
const get = (api, params, success, fail) => {
  axios
    .get(api, {
      params: params
    })
    .then(function(response) {
      success(response.data)
    })
    .catch(function(error) {
      fail(error)
    })
}
const promiseAjaxGet = (api, params) => {
  return new Promise((resolve, reject) => {
    get(
      api,
      params,
      success => {
        resolve(success)
      },
      fail => {
        reject(fail)
      }
    )
  })
}

const aa = () => {
  return promiseAjaxGet('api/tagtype/getalltypes', {})
}

export default { aa }
