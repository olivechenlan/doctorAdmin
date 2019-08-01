<template>
  <div class="components-upload-wrap">
    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      accept="application/pdf"
      :file-list="fileList"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :auto-upload="false"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="tip">请上传PDF格式的文档</div>
    </el-upload>
  </div>
</template>

<script>
import { uploadFile } from './js/upload'
export default {
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  computed: {
    fileList() {
      return !this.src ? [] : [{ name: this.src, url: this.src }]
    }
  },
  mounted() {
  },
  methods: {
    handleRemove(file, fileList) {
      this.$emit('getChange', '')
    },
    async handleChange(file, fileList) {
      this.handleRemove()
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
    .tip{
      font-size: 10px;
      color: #999;
    }
  }

</style>
