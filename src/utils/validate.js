import identityCodeValid from './identityCodeValid'

const isExternal = (path) => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

const phoneValidate = (rule, value, callback) => {
  const regMobilePhone = new RegExp(/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/)
  const regTelephone = new RegExp(/^((0\d{2,3})-?)(\d{7,8})(-(\d{3,}))?$/)
  if (rule.required && !value) {
    callback(new Error('请填写联系号码'))
  } else {
    if (value) {
      if (!(regMobilePhone.test(value) || regTelephone.test(value))) {
        callback(new Error('号码格式不对，请稍后重试'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
}

const isTimeValidate = (rule, value, callback, startTime) => {
  const vm = window.$vue
  if (rule.required && !value) {
    callback(new Error('请选择下架时间'))
  } else {
    if (value) {
      if (vm.dayjs(value) <= vm.dayjs(startTime)) {
        callback(new Error('下架时间必须大于上架时间'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
}

const weightValidate = (rule, value, callback) => {
  const regNum = new RegExp(/^[0-9]+$/)
  if (value && !regNum.test(value)) {
    callback(new Error('排序必须为正整数'))
  } else {
    callback()
  }
}

const idNumberValidate = (rule, value, callback) => {
  if (rule.required && !value) {
    callback(new Error('请填写身份证号码'))
  } else {
    if (value) {
      if (!(identityCodeValid(value))) {
        callback(new Error('身份证号码格式不对，请稍后重试'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
}

export {
  isExternal,
  isTimeValidate, // 时间有效性
  phoneValidate, // 号码校验
  weightValidate, // 权重校验
  idNumberValidate // 身份证号码校验
}
