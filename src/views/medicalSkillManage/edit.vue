<template>
  <div class="app-container">
    <headline list-title="病例审核" />
    <el-form ref="dataForm" :model="temp" label-width="80px" :rules="rules" class="form-container">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="病例详情">
            <phone-viewer :src="webSrc" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="病例标题">
            <el-input v-model="temp.title" disabled :autosize="{ minRows: 2, maxRows: 6}" type="textarea" placeholder="" />
          </el-form-item>
          <el-form-item label="谁可以看">
            <el-select v-model="temp.status" disabled placeholder="" class="filter-item filter-item-option">
              <el-option v-for="item in stateOption" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属标签">
            <template v-if="temp.labels.length>0">
              <el-tag
                v-for="(item,index) in temp.labels"
                :key="index"
              >
                {{ item.label }}
              </el-tag>
            </template>
            <template v-else>
              无
            </template>
          </el-form-item>
          <el-form-item v-show="temp.checkState!=='2'" label="驳回理由" prop="rejectContent">
            <el-input v-model="temp.rejectContent" :disabled="temp.checkState!=='0'" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="" />
          </el-form-item>
          <el-form-item>
            <el-button plain @click="$router.back()">
              返回
            </el-button>
            <template v-if="temp.checkState==='0'">
              <el-button type="primary" @click="updateData('2')">
                通过
              </el-button>
              <el-button type="primary" plain @click="updateData('3')">
                不通过
              </el-button>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import headline from '@/components/headline'
import phoneViewer from '@/components/phoneViewer'
import map from '@/utils/map'
import { webHost } from '@/network/base/network'
export default {
  components: { headline, phoneViewer },
  data() {
    return {
      temp: {
        title: '',
        status: '',
        labels: [],
        rejectContent: ''
      },
      webSrc: '',
      stateOption: map.getMedicalSkillState,
      rules: {
        rejectContent: [{ required: true, message: '请输入驳回理由', trigger: 'blur' }]
      }
    }
  },
  watch: {
  },
  created() {

  },
  mounted() {
    if (!this.$route.query.id) {
      this.$message.error('请返回后重试')
      return
    }
    this.webSrc = `${webHost}doctorSkill?id=${this.$route.query.id}`
    this.getList()
  },
  methods: {
    getList() {
      this.tools.$loading()
      this.api.doctorApi.getDoctorSkillInfo({
        doctorArtId: this.$route.query.id
      }).then(data => {
        this.tools.$loading().hide()
        if (data.responseFlag === '1') {
          if (this.tools.isEmptyObject(data.data.status)) data.data.status = '1'
          data.data.checkState = this.$route.query.checkState
          this.temp = data.data
        }
      }).catch(() => {
        this.tools.$loading().hide()
      })
    },
    doctorSkillAuthenCheck(state) {
      let params = {
        doctorArtId: this.$route.query.id,
        checkState: state
      }
      if (state === '3') {
        params = Object.assign(params, {
          rejectContent: this.temp.rejectContent
        })
      }
      this.tools.$loading()
      this.api.doctorApi.doctorSkillAuthenCheck(params).then(async(data) => {
        this.tools.$loading().hide()
        if (data.responseFlag === '1') {
          this.$message.success('审核成功')
          setTimeout(() => {
            this.$router.back()
          }, 800)
        } else {
          this.$message.error(data.responseMessage)
        }
      }).catch(() => {
        this.tools.$loading().hide()
      })
    },
    updateData(state) {
      if (state === '2') this.doctorSkillAuthenCheck(state)
      if (state === '3') {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) this.doctorSkillAuthenCheck(state)
        })
      }
    }

  }
}
</script>

<style lang="scss" scoped>
  .el-tag + .el-tag{
    margin-left: 10px;
  }
</style>
