<template>
  <div class="components-upload-wrap">
    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      accept="image/*"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :auto-upload="false"
      :disabled="isDisabled"
      class="upload-input"
    >
      <i v-if="!isDisabled" class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl+'?origin=true'" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { uploadFile } from './js/upload'
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    fileList() {
      return !this.src ? [] : [{ name: '', url: this.src }]
    }
  },
  mounted() {
  },
  methods: {
    handleRemove(file, fileList) {
      this.$emit('getChange', '')
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async handleChange(file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传的文件必须小于2M,请稍后重试')
        fileList.splice(-1, 1)
        return
      }
      await uploadFile(file.raw).then(data => {
        this.$emit('getChange', data)
      }).catch(() => {
        fileList.splice(-1, 1)
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
