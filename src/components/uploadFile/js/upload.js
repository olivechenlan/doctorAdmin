const uploadFile = (file) => {
  const vm = window.$vue
  vm.tools.$loading()
  return new Promise((resolve, reject) => {
    vm.api.uploadApi.uploadFile({ file }).then(data => {
      vm.tools.$loading().hide()
      if (data.code === '1') {
        resolve(data.data.url)
      } else {
        vm.$message.error('上传失败，请稍后重试')
        reject()
      }
    }).catch(() => {
      vm.tools.$loading().hide()
      reject()
    })
  })
}
export {
  uploadFile
}
