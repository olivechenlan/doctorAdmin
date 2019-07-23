<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col>
          <el-select v-model="listQuery.orgAreaCode" placeholder="请选择区域" clearable class="filter-item filter-item-option">
            <el-option v-for="item in areaOptions" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
          <el-input v-model="listQuery.hospitalName" placeholder="请填写医院名称" clearable class="filter-item filter-item-option" />
          <el-input v-model="listQuery.hospitalCode" placeholder="请填写机构代码" clearable class="filter-item filter-item-option" />
          <el-cascader :props="departmentProps" placeholder="请填写科室" :options="departmentOptions" clearable class="filter-item filter-item-option" @change="cascaderChange($event,'departmentId','listQuery')" />
          <el-cascader :props="titleProps" placeholder="请填写职称" :options="titleOptions" clearable class="filter-item filter-item-option" @change="cascaderChange($event,'zc','listQuery')" />
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-input v-model="listQuery.name" placeholder="请填写医生姓名" clearable class="filter-item filter-item-option" />
          <el-input v-model="listQuery.phone" placeholder="请填写手机号码" type="number" clearable class="filter-item filter-item-option" />
          <el-input v-model="listQuery.idCard" placeholder="请填写身份证号码" clearable class="filter-item filter-item-option" />
          <el-select v-model="listQuery.state" placeholder="请选择认证状态" clearable class="filter-item filter-item-option">
            <el-option v-for="item in authStateOptions" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </el-col>
      </el-row>
    </div>
    <headline list-title="医护用户列表" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column label="手机号" prop="phone" width="150" align="center" />
      <el-table-column label="姓名" prop="name" width="120" align="center" />
      <el-table-column label="身份证号码" prop="idCard" width="180" align="center" />
      <el-table-column label="医院名称" prop="hospitalName" min-width="150" align="center" />
      <el-table-column label="科室" prop="departmentName" min-width="100" align="center" />
      <el-table-column label="职称" prop="zcName" min-width="100" align="center" />
      <el-table-column label="机构代码" prop="hospitalId" width="80" align="center" />
      <el-table-column label="认证状态" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.state|formatToState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :limit.sync="listQuery.size" :page.sync="listQuery.current" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1000px" top="3%" custom-class="form-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="80px">
        <el-row type="flex" class="row-bg" :gutter="20">
          <el-col :span="6">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="temp.name" placeholder="请填写姓名" />
            </el-form-item>
            <el-form-item label="所属医院" prop="hospitalId">
              <el-select v-model="temp.hospitalId" placeholder="请选择所属医院">
                <el-option v-for="item in hospitalOptions" :key="item.hospitalId" :label="item.hospitalName" :value="item.hospitalId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="temp.phone" disabled placeholder="请填写手机号码" />
            </el-form-item>
            <el-form-item label="科室" prop="departmentId">
              <el-cascader v-model="departmentModel" :props="departmentProps" placeholder="请选择科室" :options="departmentOptions" clearable @change="cascaderChange($event,'departmentId','temp')" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="temp.idCard" placeholder="请填写身份证号码" />
            </el-form-item>
            <el-form-item label="职称" prop="zc">
              <el-cascader v-model="titleModel" :props="titleProps" placeholder="请填写职称" :options="titleOptions" clearable @change="cascaderChange($event,'zc','temp')" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工号" prop="doctorWorkId">
              <el-input v-model="temp.doctorWorkId" placeholder="请填写工号" />
            </el-form-item>
            <el-form-item label="院内短号" prop="shortPhone">
              <el-input v-model="temp.shortPhone" placeholder="请填写院内短号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="简介" prop="doctorInfo">
          <el-input v-model="temp.doctorInfo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="" />
        </el-form-item>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="8">
            <el-form-item label="头像" prop="headImg">
              <upload-image :src="temp.headImg" @getChange="getImage($event,'headImg')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="认证图片" prop="workImgUrl">
              <upload-image :src="temp.workImgUrl" @getChange="getImage($event,'workImgUrl')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证正面" label-width="100px" prop="idImgUrl">
              <upload-image :src="temp.idImgUrl" @getChange="getImage($event,'idImgUrl')" />
            </el-form-item>
          </el-col>
        </el-row>
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

export default {
  components: { Pagination, uploadImage, headline },
  filters: {
    formatToState(state) {
      let result = { name: '' }
      result = !!state && (map.getAuthenStatus.find(item => item.code === state))
      return result.name
    }
  },
  data() {
    return {
      listQuery: {
        current: 1,
        size: 15,
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
      cascaderModel: [],
      areaOptions: map.getArea,
      departmentOptions: [],
      departmentProps: {
        value: 'departmentId',
        label: 'departmentName',
        children: 'subDeptList'
      },
      departmentModel: [],
      titleOptions: [],
      titleProps: {
        value: 'id',
        label: 'name',
        children: 'subZcList'
      },
      titleModel: [],
      authStateOptions: map.getAuthenStatus,
      hospitalOptions: [],
      textMap: {
        update: '编辑用户信息',
        create: '新增用户'
      },

      list: null,
      total: 0,
      listLoading: true,

      temp: {
        userId: '',
        name: '',
        idCard: '',
        doctorWorkId: '',
        hospitalId: '',
        departmentId: '',
        zc: '',
        shortPhone: '',
        doctorInfo: '',
        headImg: '',
        workImgUrl: '',
        idImgUrl: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        hospitalId: [{ required: true, message: '请选择所属医院', trigger: 'change' }],
        departmentId: [{ required: true, message: '请选择科室', trigger: 'change' }],
        zc: [{ required: true, message: '请选择职称', trigger: 'change' }],
        workImgUrl: [{ required: true, message: '请上传认证照片', trigger: 'change' }],
        idImgUrl: [{ required: true, message: '请上传身份证正面', trigger: 'change' }]
      }
    }
  },
  created() {

  },
  async mounted() {
    this.getList()
    await map.getDepartment()
    await map.getTitle()
    await map.getHospital()
    this.departmentOptions = this.store.session('departmentList') || []
    this.titleOptions = this.store.session('titleList') || []
    this.hospitalOptions = this.store.session('hospitalList') || []
  },
  methods: {
    getList() {
      this.listLoading = true
      this.api.doctorApi.getUserInfoList(this.tools.removeEmptyValue(this.listQuery)).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          this.list = data.data.records
          this.total = data.data.total
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    getImage(e, file) {
      this.temp[file] = e
      this.$refs.dataForm.validateField(file)
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    cascaderChange(e, model, flag) {
      if (flag === 'listQuery') this.listQuery[model] = e[e.length - 1]
      if (flag === 'temp') this.temp[model] = e[e.length - 1]
    },
    resetTemp() {
      this.temp = this.$options.data().temp
      !!this.$refs.dataForm && this.$refs.dataForm.resetFields()
    },
    handleUpdate(row) {
      this.resetTemp()
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.departmentModel = map.getDefaultFromDepartment(row.departmentId)
      this.titleModel = map.getDefaultFromTitle(row.zc)
    },
    userInfoEdit() {
      this.tools.$loading()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      this.api.doctorApi.userInfoEdit(params).then(data => {
        this.tools.$loading().hide()
        if (data.responseFlag === '1') {
          this.dialogFormVisible = false
          this.$message.success('操作成功')
          this.listQuery = this.$options.data().listQuery
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
