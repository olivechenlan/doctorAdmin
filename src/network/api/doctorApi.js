import network from '../base/axiosHandle'
import store from 'store2'

const promiseAjaxGet = network.promiseAjaxGet
const promiseAjaxPost = network.promiseAjaxPost
const host = `${process.env.VUE_APP_BASE_API}/`

const doctorPost = (api, params, type = 'Json') => {
  let headers = {}
  if (store.session('tokens')) {
    headers = { token: store.session('tokens').accessToken }
  }
  return promiseAjaxPost(host + api, params, type, headers)
}

const doctorGet = (api, params) => {
  return promiseAjaxGet(host + api, params)
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
  getInfoList // 获取资讯列表
}
