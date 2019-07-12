<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
      <editorImage v-for="(item,index) in buttonGroup" :key="index" color="#1890ff" :disabled="mode!=='all' && mode!==item.mode" class="editor-upload-btn" :type="item.mode" :last-num="item.lastNum" @successCallback="successCallback" />
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
      buttonGroup: [
        {
          mode: 'image',
          lastNum: 9
        },
        {
          mode: 'video',
          lastNum: 1
        }
      ]

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
    'temp.intoUrl'(val) {
      this.buttonGroup[0].lastNum = 9 - val.length
      this.buttonGroup[1].lastNum = 1 - val.length
    },
    value(nval, oval) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => {
          window.tinymce.get(this.tinymceId).setContent(nval || '')
        })
      }
      if (!!nval && nval.indexOf('<video') >= 0) this.mode = 'video'
      if (!!nval && nval.indexOf('<img') >= 0) this.mode = 'image'
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
      this.mode = val.mode
      if (val.mode === 'image') {
        this.temp.intoType = '2'
        val.result.forEach(item => {
          window.tinymce.get(this.tinymceId).insertContent(`<img src="${item}" />`)
        })
      }
      if (val.mode === 'video') {
        this.temp.intoType = '1'
        val.result.forEach(item => {
          window.tinymce.get(this.tinymceId).insertContent(`<video src="${item}" controls="controls" />`)
        })
      }
      this.temp.intoUrl = this.temp.intoUrl.concat(val.result)
      this.$emit('getTemp', this.temp)
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
