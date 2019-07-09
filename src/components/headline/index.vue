<template>
  <div class="components-headline-wrap">
    <aside>
      <el-row justify="space-between" type="flex" align="middle">
        <el-col :span="6">{{ listTitle }}</el-col>
        <el-col v-if="!!buttonName" :span="6" style="text-align: right">
          <el-button plain icon="el-icon-circle-plus-outline" @click="handleAction">{{ buttonName }}</el-button>
        </el-col>
      </el-row>
    </aside>
  </div>
</template>

<script>
export default {
  props: {
    listTitle: {
      type: String,
      default: ''
    },
    buttonName: {
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
  methods: {
    handleAction() {
      this.$emit('handleAction')
    }
  }
}
</script>

<style>

</style>
