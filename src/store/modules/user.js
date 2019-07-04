const state = {
  accessToken: '',
  refreshToken: '',
  refreshTime: ''
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
  toggleUser({ commit }, object) {
    commit('setAccessToken', object.accessToken)
    commit('setRefreshToken', object.refreshToken)
    commit('setRefreshTime', object.refreshTime)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
