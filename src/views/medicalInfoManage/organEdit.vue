<template>
  <div class="app-container">
    <headline :list-title="pageTitle" />
    <el-form ref="dataForm" :model="temp" label-width="80px" :rules="rules" class="form-container">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="医院名称" prop="shortName">
            <el-input v-model="temp.shortName" placeholder="请填写医院名称" />
          </el-form-item>
          <el-form-item label="机构代码" prop="hospitalCode">
            <el-input v-model="temp.hospitalCode" :disabled="!!temp.hospitalId" placeholder="请填写机构代码" />
          </el-form-item>
          <el-form-item label="医院类型" prop="orgType">
            <el-select v-model="temp.orgType" placeholder="请选择医院类型">
              <el-option v-for="item in orgTypeOptions" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属区域" prop="orgAreaCode">
            <el-select v-model="temp.orgAreaCode" placeholder="请选择所属区域" @change="changeAreaName">
              <el-option v-for="item in areaOptions" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="医院图片">
            <upload-image :src="temp.orgIconUrl" @getChange="getImage" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="医院全称" prop="hospitalName">
            <el-input v-model="temp.hospitalName" :disabled="!!temp.hospitalId" placeholder="请填写医院全称" />
          </el-form-item>
          <el-form-item label="医院性质" prop="orgKind">
            <el-select v-model="temp.orgKind" placeholder="请选择医院性质">
              <el-option v-for="item in orgKindOptions" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="医院等级" prop="orgLevel">
            <el-select v-model="temp.orgLevel" placeholder="请选择医院等级">
              <el-option v-for="item in orgLevelOptions" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" prop="orgTel">
            <el-input v-model="temp.orgTel" placeholder="请填写联系电话" />
          </el-form-item>
          <el-form-item label="详细地址" prop="orgAddr">
            <el-input v-model="temp.orgAddr" placeholder="请填写详细地址" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="医院介绍" prop="orgInfo">
        <el-input v-model="temp.orgInfo" :autosize="{ minRows: 8, maxRows: 12}" type="textarea" placeholder="" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="updateData">
        提交
      </el-button>
      <el-button plain @click="$router.back()">
        返回
      </el-button>
    </div>
  </div>
</template>

<script>
import headline from '@/components/headline'
import uploadImage from '@/components/uploadFile/uploadImage'
import map from '@/utils/map'
import { phoneValidate } from '@/utils/validate'
export default {
  components: { headline, uploadImage },

  data() {
    return {
      pageTitle: '',
      temp: {
        hospitalId: '',
        hospitalCode: '',
        hospitalName: '',
        shortName: '',
        orgType: '',
        orgAreaCode: '',
        orgAreaName: '',
        orgKind: '',
        orgLevel: '',
        orgTel: '',
        orgAddr: '',
        orgInfo: '',
        orgIconUrl: ''
      },
      areaOptions: map.getArea,
      orgTypeOptions: map.getHospitalType,
      orgKindOptions: map.getHospitalKind,
      orgLevelOptions: map.getHospitalLevel,
      rules: {
        shortName: [{ required: true, message: '请输入医院名称', trigger: 'blur' }],
        hospitalCode: [{ required: true, message: '请输入机构代码', trigger: 'blur' }],
        orgType: [{ required: true, message: '请选择医院类型', trigger: 'change' }],
        orgAreaCode: [{ required: true, message: '请选择所属区域', trigger: 'change' }],
        hospitalName: [{ required: true, message: '请输入医院全称', trigger: 'blur' }],
        orgKind: [{ required: true, message: '请选择医院性质', trigger: 'change' }],
        orgLevel: [{ required: true, message: '请选择医院等级', trigger: 'change' }],
        orgTel: [{ required: true, validator: phoneValidate, trigger: 'blur' }],
        orgAddr: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      }
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.temp = this.store.session('organInfo') || this.$options.data().temp
      !!this.$refs.dataForm && this.$refs.dataForm.resetFields()
      this.pageTitle = this.tools.isEmptyObject(this.temp.hospitalId) ? '新增资讯' : '编辑资讯'
    },
    getImage(image) {
      this.temp.orgIconUrl = image
    },
    changeAreaName(value) {
      this.temp.orgAreaName = this.areaOptions.find(item => item.code === value).name
    },
    hospitalEdit() {
      this.tools.$loading()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      let method = ''
      if (this.temp.hospitalId) { method = 'hospitalEdit' } else {
        method = 'hospitalAdd'
        delete params['hospitalId']
      }
      this.api.doctorApi[method](params).then(data => {
        this.tools.$loading().hide()
        if (data.responseFlag === '1') {
          this.$router.back()
        } else {
          this.$message.error(data.responseMessage)
        }
      }).catch(() => {
        this.tools.$loading().hide()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.hospitalEdit()
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
