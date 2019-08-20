
import doctorApi from '@/network/api/doctorApi'
import tools from '../../utils/tools'

const state = {
  departmentOptions: [], // 科室
  titleOptions: [], // 职称
  hospitalOptions: [], // 机构
  topicOptions: [], // 栏目
  pathwayMajorOptions: [], // 临时路径专业
  guideMajorOptions: [] // 指南专业
}

const mutations = {
  UPDATE_DEPARTMENT: (state, data) => {
    state.departmentOptions = data
  },
  UPDATE_TITLE: (state, data) => {
    state.titleOptions = data
  },
  UPDATE_HOSPITAL: (state, data) => {
    state.hospitalOptions = data
  },
  UPDATE_TOPIC: (state, data) => {
    state.topicOptions = data
  },
  UPDATE_PATHWAY_MAJOR: (state, data) => {
    state.pathwayMajorOptions = data
  },
  UPDATE_GUIDE_MAJOR: (state, data) => {
    state.guideMajorOptions = data
  }
}

const actions = {
  updateDepartment({ commit }, data) {
    commit('UPDATE_DEPARTMENT', data)
  },
  updateTitle({ commit }, data) {
    commit('UPDATE_TITLE', data)
  },
  updateHospital({ commit }, data) {
    commit('UPDATE_HOSPITAL', data)
  },
  updateTopic({ commit }, data) {
    commit('UPDATE_TOPIC', data)
  },
  updatePathwayMajor({ commit }, data) {
    commit('UPDATE_PATHWAY_MAJOR', data)
  },
  updateGuideMajor({ commit }, data) {
    commit('UPDATE_GUIDE_MAJOR', data)
  },
  getDepartment({ state, commit, dispatch }, params) {
    if (tools.isEmptyObject(state.departmentOptions)) {
      doctorApi.getDepartmentList({}).then(data => {
        if (data.responseFlag === '1') {
          data.data.forEach(item => {
            if (!item.subDeptList) item.subDeptList = []
            for (const i in item.subDeptList) {
              if (!item.subDeptList[i]) item.subDeptList[i] = []
            }
          })
          dispatch('updateDepartment', data.data)
        }
      }).catch(() => {})
    }
  },
  getTitle({ state, commit, dispatch }, params) {
    if (tools.isEmptyObject(state.titleOptions)) {
      doctorApi.getTitleList({}).then(data => {
        if (data.responseFlag === '1') {
          dispatch('updateTitle', data.data)
        }
      }).catch(() => {})
    }
  },
  getHospital({ state, commit, dispatch }, params) {
    if (tools.isEmptyObject(state.hospitalOptions)) {
      doctorApi.getHospitalList({}).then(data => {
        if (data.responseFlag === '1') {
          dispatch('updateHospital', data.data)
        }
      }).catch(() => {})
    }
  },
  getTopic({ state, commit, dispatch }, params) {
    if (tools.isEmptyObject(state.topicOptions)) {
      doctorApi.getTopicList({
        code: '3310'
      }).then(data => {
        if (data.responseFlag === '1') {
          dispatch('updateTopic', data.data)
        }
      }).catch(() => {})
    }
  },
  getPathwayMajor({ state, commit, dispatch }, params) {
    if (tools.isEmptyObject(state.pathwayMajorOptions)) {
      doctorApi.getDictionary('CP_MAJOR').then(data => {
        if (data.responseFlag === '1') {
          dispatch('updatePathwayMajor', data.data)
        }
      }).catch(() => {})
    }
  },
  getGuideMajor({ state, commit, dispatch }, params) {
    if (tools.isEmptyObject(state.guideMajorOptions)) {
      doctorApi.getGuideMajor({}).then(data => {
        if (data.responseFlag === '1') {
          const majorGroup = [
            data.data.nklist,
            data.data.wklist,
            data.data.otherList
          ]
          dispatch('updateGuideMajor', majorGroup)
        }
      }).catch(() => {})
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
