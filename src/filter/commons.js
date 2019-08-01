// 过滤器
import map from '@/utils/map'
export default {
  install: function(Vue, options) {
    Vue.filter('formatTo', (type, mapName) => {
      let result = null
      if (type) result = map[mapName].find(item => item.code === type)
      if ((!result)) result = { name: '' }
      return result.name
    })
  }
}
