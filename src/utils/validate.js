
const isExternal = (path) => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

const phoneValidate = (rule, value, callback) => {
  const regMobilePhone = new RegExp(/^1[34578]\d{9}$/)
  const regTelephone = new RegExp(/^((0\d{2,3})-?)(\d{7,8})(-(\d{3,}))?$/)
  if (!value) callback('请填写联系号码')
  if (value) {
    if (!(regMobilePhone.test(value) || regTelephone.test(value))) {
      callback(new Error('号码格式不对，请稍后重试'))
    } else {
      callback()
    }
  }
}

const isTimeValidate = (rule, value, callback, startTime) => {
  if (!value) callback('请选择下架时间')
  if (value) {
    if (value <= startTime) {
      callback(new Error('下架时间必须大于上架时间'))
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

export {
  isExternal,
  isTimeValidate, // 时间有效性
  phoneValidate, // 号码校验
  weightValidate// 权重校验
}
