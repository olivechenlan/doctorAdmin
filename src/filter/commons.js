// 过滤器
import map from '@/utils/map'
import dayjs from 'dayjs'
export default {
  install: function(Vue, options) {
    Vue.filter('formatTo', (type, mapName) => {
      let result = null
      if (type) result = map[mapName].find(item => item.code === type)
      if ((!result)) result = { name: '' }
      return result.name
    })

    Vue.filter('formatToTime', (time) => {
      let result = ''
      if (time) result = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
      return result
    })
  }
}
