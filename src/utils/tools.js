import { Loading } from 'element-ui'
const isEmptyObject = object => {
  if (Array.isArray(object)) {
    return object.length === 0
  } else {
    object = object || {}
    return Object.keys(object).length === 0
  }
}

const removeEmptyValue = object => {
  for (const [key, value] of Object.entries(object)) {
    if (!value && value !== 0) { delete object[key] }
  }
  return object
}

const saveValueFromObject = (tempObject, keyObject) => {
  const result = {}
  const keyArray = Object.keys(keyObject)
  for (const [key, value] of Object.entries(tempObject)) {
    for (const i in keyArray) {
      if (keyArray[i] === key) {
        result[key] = value === 0 ? value : value || ''
        break
      }
    }
  }
  return result
}

const saveDifferentValue = (temp, tempOrigin) => {
  const result = {}
  for (const [key, value] of Object.entries(tempOrigin)) {
    for (const [k, v] of Object.entries(temp)) {
      if (k === key) {
        if (value !== v) {
          result[k] = v === 0 ? v : v || ''
        }
        break
      }
    }
  }
  return result
}

export default {
  isEmptyObject,
  removeEmptyValue, // 去除对象中的空数值
  saveValueFromObject, // 取原对象中的指定数值重组
  saveDifferentValue // 编辑时取修改过的值
}
