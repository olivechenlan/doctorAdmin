<template>
  <div class="components-phone-viewer">
    <div class="phone-wrap">
      <div class="content">
        <iframe ref="iframeWrap" :src="src" frameborder="0" width="100%" height="100%" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang="scss">
  .components-phone-viewer {
    background-color: #fafafa;
    padding: 10px 0;
    .phone-wrap {
      position: relative;
      margin: 0 auto;
      width: 323px;
      height: 670px;
      background: url(../../assets/phone/phone.png) no-repeat center 0;
      .content{
        width: 320px;
        height: 504px;
        position: absolute;
        bottom: 53px;
        left: 1px;
        iframe{
          font-size: 50px!important;
        }
      }
    }
  }
</style>
