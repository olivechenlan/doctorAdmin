<template>
  <div class="app-container">
    <el-form :inline="true" label-width="90px">
      <el-form-item label="区域">
        <el-select v-model="listQuery.orgAreaCode" placeholder="请选择区域">
          <el-option label="全部" value="" />
          <el-option v-for="item in areaOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="医院名称">
        <el-input v-model="listQuery.hospitalName" placeholder="请填写医院名称" clearable />
      </el-form-item>
      <el-form-item label="机构代码">
        <el-input v-model="listQuery.hospitalCode" placeholder="请填写机构代码" clearable />
      </el-form-item>
      <el-form-item label="科室">
        <el-cascader :props="departmentProps" placeholder="请填写科室" :options="departmentOptions" clearable @change="cascaderChange($event,'departmentId','listQuery')" />
      </el-form-item>
      <el-form-item label="职称">
        <el-cascader :props="titleProps" placeholder="请填写职称" :options="titleOptions" clearable @change="cascaderChange($event,'zc','listQuery')" />
      </el-form-item>
      <el-form-item label="医生姓名">
        <el-input v-model="listQuery.name" placeholder="请填写医生姓名" clearable />
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="listQuery.phone" placeholder="请填写手机号码" type="tel" clearable />
      </el-form-item>
      <el-form-item label="身份证号码">
        <el-input v-model="listQuery.idCard" placeholder="请填写身份证号码" clearable />
      </el-form-item>
      <el-form-item label="认证状态">
        <el-select v-model="listQuery.state" placeholder="请选择认证状态">
          <el-option label="全部" value="" />
          <el-option v-for="item in authStateOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <headline list-title="医护用户列表" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      class="table-wrap"
    >
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="手机号" prop="phone" width="110" align="center">
        <template slot-scope="{row}">
          {{ row.phone|numDesensitization(3,4) }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" width="120" align="center" />
      <el-table-column label="身份证号码" prop="idCard" width="160" align="center">
        <template slot-scope="{row}">
          {{ row.idCard|numDesensitization(6,4) }}
        </template>
      </el-table-column>
      <el-table-column label="医院名称" prop="hospitalName" min-width="150" align="center" />
      <el-table-column label="科室" prop="departmentName" min-width="100" align="center" />
      <el-table-column label="职称" prop="zcName" min-width="100" align="center" />
      <el-table-column label="机构代码" prop="hospitalId" width="90" align="center" />
      <el-table-column label="认证状态" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.state|formatTo('getAuthenStatus') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="updateMedicalUser(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :limit.sync="listQuery.size" :page.sync="listQuery.current" @pagination="getList" />
    <el-dialog fullscreen :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1200px" top="3%" custom-class="form-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="80px">
        <el-row type="flex" class="row-bg" :gutter="20">
          <el-col :span="6">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="temp.name" placeholder="请填写姓名" :disabled="temp.state==='1'" />
            </el-form-item>
            <el-form-item label="所属医院" prop="hospitalId">
              <el-select v-model="temp.hospitalId" placeholder="请选择所属医院">
                <el-option v-for="item in hospitalOptions" :key="item.hospitalId" :label="item.hospitalName" :value="item.hospitalId" />
              </el-select>
            </el-form-item>
            <el-form-item label="开通问诊" prop="isInquiry">
              <el-select v-model="temp.isInquiry" placeholder="请选择是否开通问诊" disabled>
                <el-option v-for="item in inquiryOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="temp.phone" placeholder="请填写手机号码" :disabled="temp.state==='1'" />
            </el-form-item>
            <el-form-item label="科室" prop="departmentId">
              <el-cascader v-model="departmentModel" :props="departmentProps" placeholder="请选择科室" :options="departmentOptions" @change="cascaderChange($event,'departmentId','temp')" />
            </el-form-item>
            <el-form-item v-show="temp.isInquiry==='2'" label="工号" prop="doctorWorkId" :required="temp.isInquiry==='2'">
              <el-input v-model="temp.doctorWorkId" placeholder="请填写工号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="temp.idCard" placeholder="请填写身份证号码" :disabled="temp.state==='1'" />
            </el-form-item>
            <el-form-item label="职称" prop="zc">
              <el-cascader v-model="titleModel" :props="titleProps" placeholder="请填写职称" :options="titleOptions" @change="cascaderChange($event,'zc','temp')" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="院内短号" prop="shortPhone">
              <el-input v-model="temp.shortPhone" placeholder="请填写院内短号" />
            </el-form-item>
            <el-form-item label="认证状态" prop="state">
              <el-select v-model="temp.state" placeholder="请选择认证状态" disabled>
                <el-option v-for="item in authStateOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="8">
            <el-form-item label="头像" prop="headImg">
              <upload-image :src="temp.headImg" @getChange="getFile($event,'headImg')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="认证图片" prop="workImgUrl">
              <upload-image :src="temp.workImgUrl" @getChange="getFile($event,'workImgUrl')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证正面" label-width="100px" prop="idImgUrl">
              <upload-image :src="temp.idImgUrl" @getChange="getFile($event,'idImgUrl')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="简介" prop="doctorInfo">
          <el-input v-model="temp.doctorInfo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import headline from '@/components/headline'
import Pagination from '@/components/Pagination'
import uploadImage from '@/components/uploadFile/uploadImage'
import map from '@/utils/map'
import handleTemp from '@/mixin/handleTemp'
import handleDefault from '@/mixin/handleDefault'
import { idNumberValidate } from '@/utils/validate'
export default {
  components: { Pagination, uploadImage, headline },
  mixins: [handleTemp, handleDefault],
  data() {
    return {
      listQuery: {
        current: 1,
        size: 10,
        orgAreaCode: '',
        hospitalName: '',
        hospitalCode: '',
        departmentId: '',
        zc: '',
        name: '',
        phone: '',
        idCard: '',
        state: ''
      },
      areaOptions: map.getArea,
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
      textMap: {
        update: '编辑用户信息'
      },
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
  computed: {
  },
  created() {
  },
  mounted() {
    this.getList()
    this.getDepartment()
    this.getTitle()
    this.getHospital()
  },
  methods: {
    getList() {
      this.listLoading = true
      const params = this.tools.removeEmptyValue(Object.assign({}, this.listQuery))
      this.api.doctorApi.getUserInfoList(params).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          data.data.records.forEach(item => {
            item.isInquiry = item.isInquiry === '2' ? '2' : '1'
          })
          this.list = data.data.records
          this.total = data.data.total
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    updateMedicalUser(row) {
      this.handleUpdate(row)
      this.departmentModel = this.getDefaultFromDepartment(row.departmentId)
      this.titleModel = this.getDefaultFromTitle(row.zc)
    },
    userInfoEdit() {
      let params = this.tools.saveDifferentValue(this.temp, this.tempBackup)
      if (this.tools.isEmptyObject(params)) {
        this.dialogFormVisible = false
        return
      }
      this.tools.$loading()
      params = Object.assign({}, params, { userId: this.temp.userId, hospitalId: this.temp.hospitalId })
      this.api.doctorApi.userInfoEdit(params).then(data => {
        this.tools.$loading().hide()
        if (data.responseFlag === '1') {
          this.dialogFormVisible = false
          this.$message.success('操作成功')
          this.getList()
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
          this.userInfoEdit()
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
</style>
