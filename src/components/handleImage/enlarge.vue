<template>
  <div class="components-enlarge-wrap">
    <div v-if="isImageLoad" class="enlarge-wrap" @click="dialogChange">
      <transition name="el-zoom-in-center">
        <div class="enlarge-button">
          <i class="el-icon-zoom-in" />
        </div>
      </transition>
      <img :src="dialogImageUrl" alt="" @error="imgLoadError">
    </div>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['dialogImageUrl'],
  data() {
    return {
      isImageLoad: true,
      dialogVisible: false
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    imgLoadError() {
      this.isImageLoad = false
    },
    dialogChange() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .enlarge-wrap{
    height: 200px;
    width: 300px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    .enlarge-button{
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      align-items: center;
      justify-content: center;
      background-color: rgba(0,0,0,.3);
      i{
        font-size: 28px;
        color: white;
      }
    }
    img{
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
    }
    &:hover{
      .enlarge-button{
        display: flex;
      }
    }
  }

</style>
