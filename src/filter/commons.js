// 过滤器
import map from '@/utils/map'
import dayjs from 'dayjs'
export default {
  install: function(Vue, options) {
    Vue.filter('formatTo', (type, mapName) => {
      let result = null
      if (type || type === 0) result = map[mapName].find(item => item.code === type)
      if ((!result)) result = { name: '' }
      return result.name
    })

    Vue.filter('formatToTime', (time) => {
      let result = ''
      if (time) result = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
      return result
    })

    Vue.filter('numDesensitization', (num, beginLength, endLength) => { // 数字脱敏
      let result = ''
      if (num && num.length > (beginLength + endLength)) {
        const len = num.length - beginLength - endLength
        const star = new Array(len + 1).join('*')
        result = num.substring(0, beginLength) + star + num.substring(num.length - endLength)
      }
      return result
    })
  }
}
