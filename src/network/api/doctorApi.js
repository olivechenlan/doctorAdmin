import network from '../base/axiosHandle'
import store from '@/store'
import qs from 'qs'
import cryptoJs from 'crypto-js'
import dayjs from 'dayjs'

const promiseAjaxGet = network.promiseAjaxGet
const promiseAjaxPost = network.promiseAjaxPost
const host = `${process.env.VUE_APP_BASE_API}/`

const key = 'wNsirOBq88'
const sid = '8B0308D0EA6B2804E0500B1E1E636A17'
const headerPackage = (params, type) => {
  let paramObject = params
  if (type === 'FormData') paramObject = {}
  let paramsTemp = decodeURIComponent(qs.stringify(paramObject)).split('&')
  paramsTemp = paramsTemp.filter(item => item.indexOf('=') < 0 || (item.indexOf('=') + 1) !== item.length)
  let sortArray = paramsTemp.sort()
  sortArray = sortArray.concat(['key=' + key])
  const sortParams = sortArray.join('&')
  const sign = cryptoJs.MD5(sortParams).toString().toLowerCase()
  let headers = {
    sign,
    sid,
    origins: 'web',
    appVersion: 'V1.0.0'
  }
  if (store.state.user.accessToken) {
    headers = Object.assign(headers, { token: store.state.user.accessToken })
  }
  return headers
}
const doctorPost = (api, params, type = 'Json') => {
  const headers = headerPackage(params, type)
  return new Promise((resolve, reject) => {
    promiseAjaxPost(host + api, params, type, headers).then(data => {
      resolve(data)
    }).catch(err => {
      if (typeof err === 'string' && err.indexOf('登录失效') === 0) {
        store.commit('user/setRefreshTime', dayjs().subtract(4, 'hour'))
        setTimeout(() => {
          window.$vue.$router.go(0)
        }, 800)
      }
    })
  })
}

const doctorGet = (api, params) => {
  const headers = headerPackage(params)
  return new Promise((resolve, reject) => {
    promiseAjaxGet(host + api, params, headers).then(data => {
      resolve(data)
    }).catch(err => {
      if (typeof err === 'string' && err.indexOf('登录失效') === 0) {
        store.commit('setRefreshTime', dayjs().subtract(4, 'hour'))
        setTimeout(() => {
          window.$vue.$router.go(0)
        }, 800)
      }
    })
  })
}

const getUserInfoList = params => {
  return doctorPost('userInfo/getList', params)
}

const userInfoEdit = params => {
  return doctorPost('userInfo/edit', params)
}

const getDepartmentList = params => {
  return doctorPost('orgDepartment/getList', params)
}

const getTitleList = params => {
  return doctorPost('doctorZc/getList', params)
}

const getHospitalList = params => {
  return doctorPost('orgHospitalInfo/getList', params)
}

const getCheckList = params => {
  return doctorPost('userInfo/getCheckList', params)
}

const authenCheck = params => {
  return doctorPost('userInfo/check', params)
}

const login = params => {
  return doctorPost('index/login', params)
}

const getHospitalListPage = params => {
  return doctorPost('orgHospitalInfo/getListPage', params)
}

const departmentEdit = params => {
  return doctorPost('orgDepartment/edit', params)
}

const hospitalEdit = params => {
  return doctorPost('orgHospitalInfo/edit', params)
}

const hospitalAdd = params => {
  return doctorPost('orgHospitalInfo/add', params)
}

const titleEdit = params => {
  return doctorPost('doctorZc/edit', params)
}

const getCircleList = params => {
  return doctorPost('doctorNetworkGroup/getListPage', params)
}

const getNotAddedHospital = params => {
  return doctorPost('orgHospitalInfo/getNoGroupList', params)
}

const circleEdit = params => {
  return doctorPost('doctorNetworkGroup/edit', params)
}

const circleDelete = query => {
  return doctorPost('doctorNetworkGroup/delete/' + query, {})
}

const getTopicList = params => {
  return doctorPost('headLine/code', params, 'FormData')
}

const getBannerList = params => {
  return doctorPost('otherRotationChart/getList', params)
}

const bannerEdit = params => {
  return doctorPost('otherRotationChart/update', params)
}

const bannerAdd = params => {
  return doctorPost('otherRotationChart/save', params)
}

const getTag = params => {
  return doctorPost('label/getList', params)
}

const tagEdit = params => {
  return doctorPost('label/update', params)
}

const tagAdd = params => {
  return doctorPost('label/save', params)
}

const topicEdit = params => {
  return doctorPost('headLine', params)
}

const topicAdd = params => {
  return doctorPost('headLine/save', params)
}

const topicDelete = params => {
  return doctorPost('headLine/removeByType', params)
}

const refreshToken = params => {
  return doctorGet('index/refreshToken', params)
}

const getInfoList = params => {
  return doctorPost('headLine/getHeadPage', params)
}

const infoAdd = params => {
  return doctorPost('headLine/saveInfo', params)
}

const infoEdit = params => {
  return doctorPost('headLine/updateInfo', params)
}

const getDictionary = query => {
  return doctorGet('dict/type/' + query, {})
}

const getFeedbackList = params => {
  return doctorPost('userFeedback/list', params)
}

const feedbackEdit = params => {
  return doctorPost('userFeedback/check', params)
}

const getAppVersion = params => {
  return doctorPost('userFeedback/getAppVersionList', params)
}

const getNewDetail = params => {
  return doctorGet('headLine/selectInfoById', params)
}

export default {
  getUserInfoList, // 获取用户信息列表
  userInfoEdit, // 编辑用户信息
  getDepartmentList, // 获取科室列表
  getTitleList, // 获取职称列表
  getHospitalList, // 获取医院列表
  getCheckList, // 获取审核列表
  authenCheck, // 审核
  login, // 登录
  getHospitalListPage, // 获取医院列表翻页
  departmentEdit, // 编辑,新增科室
  hospitalEdit, // 编辑医院
  hospitalAdd, // 新增医院
  titleEdit, // 编辑,新增职称
  getCircleList, // 获取圈子
  getNotAddedHospital, // 获取未添加院级圈的医院列表
  circleEdit, // 编辑,新增圈子
  circleDelete, // 删除圈子
  getTopicList, // 获取栏目列表
  getBannerList, // 获取轮播图列表
  bannerEdit, // 编辑轮播图
  bannerAdd, // 新增轮播图
  getTag, // 获取标签
  tagEdit, // 编辑标签
  tagAdd, // 新增标签
  topicEdit, // 编辑栏目分类
  topicAdd, // 新增栏目分类
  topicDelete, // 删除栏目分类
  refreshToken, // 刷新token
  getInfoList, // 获取资讯列表
  infoAdd, // 新增资讯
  infoEdit, // 编辑资讯
  getDictionary, // 获取字典
  getFeedbackList, // 获取反馈列表
  feedbackEdit, // 反馈
  getAppVersion, // 获取app版本
  getNewDetail
}
