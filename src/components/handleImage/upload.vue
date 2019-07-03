<template>
  <div class="components-upload-wrap">
    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      accept="image/*"
      list-type="picture-card"
      :file-list="fileList"
      :limit="1"
      :on-preview="handlePictureCardPreview"
      :auto-upload="false"
      :on-remove="handleRemove"
      :on-change="handleChange"
      class="upload-input"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['fileList'],
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {

  },
  mounted() {
  },
  methods: {
    handleRemove(file, fileList) {
      this.$emit('imageChange', '')
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleChange(file, fileList) {
      const that = this
      const reader = new FileReader()
      reader.onload = async function(e) {
        const imageSrc = await that.uploadImage(file.raw)
        that.$emit('imageChange', imageSrc)
      }
      reader.readAsDataURL(file.raw)
    },
    uploadImage(file) {
      this.tools.$loading()
      return new Promise((resolve, reject) => {
        this.api.uploadApi.uploadImage({ file }).then(data => {
          this.tools.$loading().hide()
          if (data.code === '1') {
            resolve(data.data.url)
          } else {
            this.$message.warning(data.msg)
          }
        }).catch(err => {
          this.tools.$loading().hide()
        })
      })
    }

  }
}
</script>

<style lang="scss" scoped>
  .components-upload-wrap{
    .upload-input{
      width: 148px;
      height: 148px;
      overflow:hidden;
    }
  }

</style>
