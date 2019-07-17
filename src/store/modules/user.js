import dayjs from 'dayjs'
import doctorApi from '@/network/api/doctorApi'
const state = {
  accessToken: '',
  refreshToken: '',
  refreshTime: '' // 刷新时间
}

const mutations = {
  setAccessToken: (state, data) => {
    state.accessToken = data
  },
  setRefreshToken: (state, data) => {
    state.refreshToken = data
  },
  setRefreshTime: (state, data) => {
    state.refreshTime = data
  }
}

const actions = {
  toggleUserInfo({ commit }, object) {
    commit('setAccessToken', object.accessToken)
    commit('setRefreshToken', object.refreshToken)
    commit('setRefreshTime', object.refreshTime)
  },
  resetToken({ state, commit, dispatch }, params = {}) {
    const vm = window.$vue
    const initData = {
      accessToken: '',
      refreshToken: '',
      refreshTime: ''
    }
    if (state.refreshToken) {
      doctorApi.refreshToken({
        refreshToken: state.refreshToken
      })
        .then(data => {
          if (data.responseFlag === '1') {
            commit('setAccessToken', data.data.accessToken)
            commit('setRefreshTime', dayjs())
            vm.$router.go(0)
          } else {
            dispatch('toggleUserInfo', initData)
            if (vm.$route.path !== '/login') vm.$router.push(`/login?redirect=${vm.$route.path}`)
          }
        })
        .catch(async() => {
          dispatch('toggleUserInfo', initData)
          if (vm.$route.path !== '/login') vm.$router.push(`/login?redirect=${vm.$route.path}`)
        })
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
