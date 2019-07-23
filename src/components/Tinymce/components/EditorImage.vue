<template>
  <div class="upload-container">
    <el-button :disabled="disabled" :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
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
        <el-button size="small" type="primary">
          添加{{ typeName }}
        </el-button>
      </el-upload>
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
    type: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#1890ff'
    },
    intoUrl: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
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
  },

  created() {
    if (this.type === 'image') {
      this.isMultiple = true
      this.accept = 'image/*'
      this.typeName = '图片'
    }
    if (this.type === 'video') {
      this.isMultiple = false
      this.accept = 'video/*'
      this.typeName = '视频'
    }
  },
  methods: {
    async handleSubmit() {
      if (this.file.length > this.lastNum) {
        if (this.type === 'image') this.$message.error(`最多只能再上传${this.lastNum}张图片，请重试`)
        if (this.type === 'video') this.$message.error(`最多只能再上传${this.lastNum}段视频，请重试`)
        return
      }
      this.tools.$loading()
      const result = []
      for (const i in this.file) {
        const src = await this.uploadFile(this.file[i].raw)
        result.push(src)
      }
      const callback = {
        result,
        mode: this.type
      }
      this.$emit('successCallback', callback)
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
    width: 100%;
  }
}
</style>
