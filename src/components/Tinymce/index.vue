<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
      <editorImage v-for="(item,index) in buttonGroup" :key="index" :disabled="intoType!=='' && intoType!==item.intoType" class="editor-upload-btn" :into-type="item.intoType" :last-num="item.lastNum" @successCallback="successCallback" />
    </div>
  </div>
</template>

<script>
import editorImage from './components/EditorImage'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

export default {
  name: 'Tinymce',
  components: { editorImage },
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
      imageNum: 9,
      videoNum: 1,
      menubar: 'file edit view format table',
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      },
      intoType: '',
      urlNum: 0

    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    },
    buttonGroup() {
      const group = [
        {
          intoType: '2',
          lastNum: this.imageNum - this.urlNum > 0 ? this.imageNum - this.urlNum : 0
        },
        {
          intoType: '1',
          lastNum: this.videoNum - this.urlNum > 0 ? this.videoNum - this.urlNum : 0
        }
      ]
      return group
    }
  },
  watch: {
    value(nval, oval) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => {
          window.tinymce.get(this.tinymceId).setContent(nval || '')
        })
      }
      let urlNum = 0
      let intoType = ''
      if (nval) {
        let matchString = ''
        if (nval.indexOf('<img') >= 0) {
          intoType = '2'
          matchString = '<img'
        }
        if (nval.indexOf('<video') >= 0) {
          intoType = '1'
          matchString = '<video'
        }
        if (nval.indexOf('<video') >= 0 && nval.indexOf('<img') >= 0) {
          intoType = ''
          matchString = ''
        }
        if (matchString) {
          const exp = new RegExp(matchString, 'g')
          urlNum = nval.match(exp).length
        }
      }
      this.intoType = intoType
      this.urlNum = urlNum
      this.$emit('getTemp', {
        intoType, urlNum
      })
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
    initTinymce() {
      const that = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: this.languageTypeList['zh'],
        forced_root_block: 'div',
        height: this.height,
        body_class: 'panel-body ',
        branding: false,
        menubar: this.menubar,
        toolbar: toolbar,
        plugins: plugins,
        end_container_on_empty_block: true,
        fontsize_formats: '10px 12px 14px 16px 18px 24px 28px 32px 38px 40px',
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
    },
    successCallback(val) {
      if (this.intoType === '2') {
        val.forEach(item => {
          window.tinymce.get(this.tinymceId).insertContent(`<img src="${item}" />`)
        })
      }
      if (this.intoType === '1') {
        val.forEach(item => {
          window.tinymce.get(this.tinymceId).insertContent(`<video src="${item}" controls="controls" />`)
        })
      }
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
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
  margin-left: 10px;
}
</style>
