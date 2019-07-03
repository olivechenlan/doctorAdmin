<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <!--<div class="editor-custom-btn-container">-->
    <!--<editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" />-->
    <!--</div>-->
  </div>
</template>

<script>

import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

export default {
  name: 'Tinymce',
  // components: { editorImage },
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    temp: {
      type: Object,
      default: () => {}
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      mode: 'all',
      menubar: 'file edit view format table',
      toolbar: toolbar.toolbar,
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      }
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(nval, oval) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(nval || ''))
      }
      if (!!nval && nval.indexOf('<video') >= 0) {
        this.mode = 'video'
      }
      if (!!nval && nval.indexOf('<img') >= 0) {
        this.mode = 'image'
      }
      if (!nval || (nval.indexOf('<video') < 0 && nval.indexOf('<img') < 0)) {
        this.mode = 'all'
        this.temp.intoUrl = []
        this.temp.intoType = ''
      }
      const urlArray = []
      // 内容删减的情况下计算intourl
      if (!!oval && !!nval && oval.split('src=').length > nval.split('src=').length) {
        const valArray = nval.split('src="')
        valArray.forEach(item => {
          if (item.indexOf('http') === 0) {
            const endPath = item.indexOf('"')
            urlArray.push(item.slice(0, endPath))
          }
        })
        this.temp.intoUrl = urlArray
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {

    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    uploadImage(file) {
      return new Promise((resolve, reject) => {
        this.api.uploadApi.uploadImage({ file }).then(data => {
          if (data.code === '1') {
            resolve(data.data.url)
          } else {
            this.tools.$loading().hide()
            this.$message.warning(data.msg)
          }
        }).catch(err => {
          this.tools.$loading().hide()
        })
      })
    },
    initTinymce() {
      const that = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: this.languageTypeList['zh'],
        height: this.height,
        body_class: 'panel-body ',
        branding: false,
        menubar: this.menubar,
        toolbar: toolbar,
        plugins: plugins,
        theme_advanced_disable: 'media',
        file_picker_types: 'media image',
        file_picker_callback: function(callback, value, meta) {
          const tinymce = window.tinymce.get(that.tinymceId)
          const input = document.createElement('input')
          input.setAttribute('type', 'file')
          if (meta.filetype === 'media') {
            input.setAttribute('accept', 'video/*')
            input.onchange = async function() {
              if (that.mode === 'image') {
                that.$message.warning('上传图片后无法上传视频')
                return
              }
              if (!that.tools.isEmptyObject(that.temp.intoUrl)) {
                that.$message.warning('最多上传一段视频')
                return
              }
              const src = await that.uploadImage(this.files[0])
              that.temp.intoType = '1'
              that.temp.intoUrl.push(src)
              tinymce.insertContent(`<video src="${src}" controls="controls" />`)
              tinymce.windowManager.close()
              that.$emit('getTemp', that.temp)
            }
          }
          if (meta.filetype === 'image') {
            input.setAttribute('accept', 'image/*')
            input.setAttribute('multiple', 'multiple')
            input.onchange = async function() {
              if (that.mode === 'video') {
                that.$message.warning('上传视频后无法上传图片')
                return
              }
              const intoUrlLength = that.tools.isEmptyObject(that.temp.intoUrl) ? 0 : that.temp.intoUrl.length
              if (intoUrlLength + this.files.length > 9) {
                that.$message.error(`您已上传${intoUrlLength}张图片,最多上传9张图片`)
                return
              }
              for (let i = 0; i < this.files.length; i++) {
                const src = await that.uploadImage(this.files[i])
                that.temp.intoUrl.push(src)
                tinymce.insertContent(`<img src="${src}" />`)
              }
              that.temp.intoType = '2'
              tinymce.windowManager.close()
              that.$emit('getTemp', that.temp)
            }
          }
          input.click()
        },
        end_container_on_empty_block: true,
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        link_title: false,
        nonbreaking_force_tab: true,
        init_instance_callback: editor => {
          if (that.value) {
            editor.setContent(that.value)
          }
          that.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            that.hasChange = true
            that.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            that.fullscreen = e.state
          })
        }
      })
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
.tinymce-container>>>.mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
</style>
