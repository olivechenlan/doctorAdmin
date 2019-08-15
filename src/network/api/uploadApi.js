import network from '../base/axiosHandle'
import cryptoJs from 'crypto-js'
import qs from 'qs'
import dayjs from 'dayjs'
const promiseAjaxPost = network.promiseAjaxPost
const host = `${process.env.VUE_APP_BASE_API}/uploadApi/store/`

const uploadPost = (api, params = {}, type = 'Json') => {
  const key = 'tsoUeDnGRWxo4cowaZmNq6BJCGFHhWmR'
  const timestamp = dayjs().format('YYYYMMDDHHmmss')
  const env = 'DOCTOR_ENV'
  const appKey = '20190605034519074DB3'
  const authority = 'PUBLIC'
  const bodyParams = Object.assign({}, { timestamp, appKey, authority, env }, params)
  let paramsArray = qs.stringify(bodyParams).split('&')
  paramsArray = paramsArray.filter(item => item.indexOf('=') < 0 || (item.indexOf('=') + 1) !== item.length)
  paramsArray = paramsArray.filter(item => item.indexOf('file') !== 0) // file字段不参与加密
  let sortArray = paramsArray.sort()
  sortArray = sortArray.concat(['key=' + key])
  const sortParams = decodeURIComponent(sortArray.join('&'))
  const sign = cryptoJs.MD5(sortParams).toString().toLowerCase()
  return promiseAjaxPost(host + api, Object.assign({}, bodyParams, { sign }), type)
}

const uploadFile = (params) => {
  return uploadPost('api/file/upload', params, 'File')
}

const uploadUrl = (params) => {
  return uploadPost('api/file/uploadbyurl', params)
}

export default {
  uploadFile, // 上传文件
  uploadUrl // 上传url
}
