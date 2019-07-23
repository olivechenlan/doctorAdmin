const uploadFile = (file) => {
  const vm = window.$vue
  vm.tools.$loading()
  return new Promise((resolve, reject) => {
    vm.api.uploadApi.uploadFile({ file }).then(data => {
      vm.tools.$loading().hide()
      if (data.code === '1') {
        resolve(data.data.url)
      } else {
        vm.$message.error(data.msg)
      }
    }).catch(() => {
      vm.tools.$loading().hide()
    })
  })
}
export {
  uploadFile
}
