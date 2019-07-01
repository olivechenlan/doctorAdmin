import network from '../base/axiosHandle'
import cryptoJs from 'crypto-js'
import qs from 'qs'
import dayjs from 'dayjs'
const promiseAjaxPost = network.promiseAjaxPost

const uploadPost = (api, params = {}) => {
  const key = 'tsoUeDnGRWxo4cowaZmNq6BJCGFHhWmR'
  let paramsArray = qs.stringify(params).split('&')
  paramsArray = paramsArray.filter(item => item.indexOf('file') !== 0) // file字段不参与加密
  let sortArray = paramsArray.sort()
  sortArray = sortArray.concat(['key=' + key])
  const sortParams = sortArray.join('&')
  const sign = cryptoJs.MD5(sortParams).toString().toLowerCase()
  const formData = new FormData()
  for (const [key, value] of Object.entries(params)) {
    if (value) { formData.append(key, value) }
  }
  formData.append('sign', sign)
  return promiseAjaxPost('upload-api/' + api, formData, 'File')
}

const uploadImage = (params) => {
  const timestamp = dayjs().format('YYYYMMDDHHmmss')
  const env = 'DOCTOR_ENV'
  const appKey = '20190605034519074DB3'
  const authority = 'PUBLIC'
  const bodyParams = Object.assign({}, { timestamp, appKey, authority, env }, params)
  return uploadPost('api/file/upload', bodyParams)
}

export default {
  uploadImage // 上传本地图片
}
