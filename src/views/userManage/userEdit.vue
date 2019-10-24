<template>
  <div class="app-container">
    <headline list-title="编辑用户信息" />
    <el-form ref="dataForm" :model="temp" label-width="100px" :rules="rules" class="form-container">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="temp.name" placeholder="请填写姓名" :disabled="temp.state==='1'" />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="temp.phone" placeholder="请填写手机号码" :disabled="temp.state==='1'" />
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="temp.idCard" placeholder="请填写身份证号码" :disabled="temp.state==='1'" />
          </el-form-item>
          <el-form-item label="所属医院" prop="hospitalId">
            <el-select v-model="temp.hospitalId" placeholder="请选择所属医院">
              <el-option v-for="item in hospitalOptions" :key="item.hospitalId" :label="item.hospitalName" :value="item.hospitalId" />
            </el-select>
          </el-form-item>
          <el-form-item label="科室" prop="departmentId">
            <el-cascader v-model="departmentModel" :props="departmentProps" placeholder="请选择科室" :options="departmentOptions" @change="cascaderChange($event,'departmentId','temp')" />
          </el-form-item>
          <el-form-item label="职称" prop="zc">
            <el-cascader v-model="titleModel" :props="titleProps" placeholder="请填写职称" :options="titleOptions" @change="cascaderChange($event,'zc','temp')" />
          </el-form-item>
          <el-form-item label="开通问诊" prop="isInquiry">
            <el-select v-model="temp.isInquiry" placeholder="请选择是否开通问诊" disabled>
              <el-option v-for="item in inquiryOptions" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item v-show="temp.isInquiry==='2'" label="工号" prop="doctorWorkId" :required="temp.isInquiry==='2'">
            <el-input v-model="temp.doctorWorkId" placeholder="请填写工号" />
          </el-form-item>
          <el-form-item label="院内短号" prop="shortPhone">
            <el-input v-model="temp.shortPhone" placeholder="请填写院内短号" />
          </el-form-item>
          <el-form-item label="认证状态" prop="state">
            <el-select v-model="temp.state" placeholder="请选择认证状态" disabled>
              <el-option v-for="item in authStateOptions" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="头像" prop="headImg">
            <upload-image :src="temp.headImg" @getChange="getFile($event,'headImg')" />
          </el-form-item>
          <el-form-item label="身份证正面" label-width="100px" prop="idImgUrl">
            <upload-image :src="temp.idImgUrl" @getChange="getFile($event,'idImgUrl')" />
          </el-form-item>
          <el-form-item label="认证图片" prop="workImgUrl">
            <upload-image :src="temp.workImgUrl" @getChange="getFile($event,'workImgUrl')" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="简介" prop="doctorInfo">
        <el-input v-model="temp.doctorInfo" :autosize="{ minRows: 8, maxRows: 10}" type="textarea" placeholder="" />
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
import map from '@/utils/map'
import uploadImage from '@/components/uploadFile/uploadImage'
import handleTemp from '@/mixin/handleTemp'
import handleDefault from '@/mixin/handleDefault'
import { idNumberValidate } from '@/utils/validate'
export default {
  components: { headline, uploadImage },
  mixins: [handleTemp, handleDefault],
  data() {
    return {
      authStateOptions: map.getAuthenStatus,
      inquiryOptions: [
        {
          name: '已开通',
          code: '2'
        },
        {
          name: '未开通',
          code: '1'
        }
      ],
      temp: {
        userId: '',
        name: '',
        phone: '',
        idCard: '',
        shortPhone: '',
        doctorWorkId: '',
        hospitalId: '',
        departmentId: '',
        zc: '',
        state: '',
        isInquiry: '',
        doctorInfo: '',
        headImg: '',
        workImgUrl: '',
        idImgUrl: ''
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        idCard: [{ required: true, validator: idNumberValidate, trigger: 'blur' }],
        hospitalId: [{ required: true, message: '请选择所属医院', trigger: 'change' }],
        departmentId: [{ required: true, message: '请选择科室', trigger: 'change' }],
        zc: [{ required: true, message: '请选择职称', trigger: 'change' }],
        workImgUrl: [{ required: true, message: '请上传认证照片', trigger: 'change' }],
        idImgUrl: [{ required: true, message: '请上传身份证正面', trigger: 'change' }],
        state: [{ required: true, message: '请选择认证状态', trigger: 'change' }],
        doctorWorkId: [{ message: '请输入工号', trigger: 'blur' }],
        isInquiry: [{ required: true, message: '请选择是否开通问诊', trigger: 'change' }]
      }
    }
  },
  watch: {
  },
  created() {
  },
  async mounted() {
    if (!this.$route.query.id) {
      this.$message.error('请返回后重试')
      return
    }
    await this.getDepartment()
    await this.getTitle()
    await this.getHospital()
    this.getList()
  },
  methods: {
    getList() {
      this.$loading().show()
      this.api.doctorApi.getUserInfoDetail(this.$route.query.id).then(data => {
        this.$loading().hide()
        if (data.responseFlag === '1') {
          data.data.isInquiry = data.data.isInquiry === '2' ? '2' : '1'
          this.departmentModel = this.getDefaultFromDepartment(data.data.departmentId)
          this.titleModel = this.getDefaultFromTitle(data.data.zc)
          this.temp = data.data
        }
      }).catch(() => {
        this.$loading().hide()
      })
    },
    userInfoEdit() {
      this.$loading().show()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      this.api.doctorApi.userInfoEdit(params).then(data => {
        this.$loading().hide()
        if (data.responseFlag === '1') {
          this.$router.back()
        } else {
          this.$message.error(data.responseMessage)
        }
      }).catch(() => {
        this.$loading().hide()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.userInfoEdit()
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
  .el-tag + .el-tag{
    margin-left: 10px;
  }
</style>
