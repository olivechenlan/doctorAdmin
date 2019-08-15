<template>
  <div class="upload-container">
    <el-button :disabled="disabled" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      添加{{ typeName }}
    </el-button>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <el-upload
        :multiple="isMultiple"
        :accept="accept"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-change="handleChange"
        class="editor-slide-upload"
        action="https://httpbin.org/post"
        list-type="picture-card"
        :auto-upload="false"
      >
        <el-button type="primary">
          添加{{ typeName }}
        </el-button>
      </el-upload>
      <div class="upload-tip">{{ lastNumTip }}</div>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        上传
      </el-button>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'EditorSlideUpload',
  props: {
    lastNum: {
      type: Number,
      default: -1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    intoType: {
      type: String,
      default: ''
    },
    intoUrl: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      lastNumTip: '',
      isMultiple: true,
      accept: 'image/*',
      typeName: '',
      dialogVisible: false,
      fileList: [],
      file: []
    }
  },
  computed: {

  },
  watch: {
    lastNum(val) {
      this.lastNumTip = this.intoType === '2' ? `最多可再添加${val}张图片` : `最多可再添加${val}段视频`
    }
  },

  created() {
    if (this.intoType === '1') {
      this.isMultiple = false
      this.accept = 'video/*'
      this.typeName = '视频'
    }
    if (this.intoType === '2') {
      this.isMultiple = true
      this.accept = 'image/*'
      this.typeName = '图片'
    }
  },
  methods: {
    async handleSubmit() {
      if (this.file.length <= 0) {
        this.$message.error('请先选择一张上传')
        return
      }
      if (this.file.length > this.lastNum) {
        if (this.intoType === '2') this.$message.error(`最多只能再上传${this.lastNum}张图片，请重试`)
        if (this.intoType === '1') this.$message.error(`最多只能再上传${this.lastNum}段视频，请重试`)
        return
      }
      this.tools.$loading()
      const result = []
      for (const i in this.file) {
        const src = await this.uploadFile(this.file[i].raw)
        result.push(src)
      }
      this.$emit('successCallback', result)
      this.tools.$loading().hide()
      this.fileList = []
      this.dialogVisible = false
    },
    handleRemove(file, fileList) {
      this.file = fileList
    },
    handleChange(file, fileList) {
      this.file = fileList
    },
    uploadFile(file) {
      return new Promise((resolve, reject) => {
        this.api.uploadApi.uploadFile({ file }).then(data => {
          if (data.code === '1') {
            resolve(data.data.url)
          } else {
            this.tools.$loading().hide()
            this.$message.error(data.msg)
          }
        }).catch(() => {
          this.tools.$loading().hide()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-button--primary.is-disabled{
    background-color: #a0cfff;
    border-color: #a0cfff;
  }
  .editor-slide-upload {
    margin-bottom: 20px;
    /deep/ .el-upload--picture-card {
      line-height: 1;
      height: auto;
      border-width: 0;
      width: 100%;

    }
  }
  .upload-tip{
    margin-bottom: 20px;
  }

</style>
