<template>
  <div class="app-container">
    <el-form :inline="true" label-width="80px">
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
      <el-form-item label="医院性质">
        <el-select v-model="listQuery.orgKind" placeholder="请选择医院性质">
          <el-option label="全部" value="" />
          <el-option v-for="item in orgKindOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="医院类型">
        <el-select v-model="listQuery.orgType" placeholder="请选择医院类型">
          <el-option label="全部" value="" />
          <el-option v-for="item in orgTypeOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="医院等级">
        <el-select v-model="listQuery.orgLevel" placeholder="请选择医院等级">
          <el-option label="全部" value="" />
          <el-option v-for="item in orgLevelOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <headline list-title="医疗机构列表" button-name="新增医疗机构" @handleAction="jumpToEdit" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      class="table-wrap"
    >
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="机构代码" prop="hospitalCode" width="100" align="center" />
      <el-table-column label="医院图片" min-width="120" align="center">
        <template slot-scope="{row}">
          <div class="image-column">
            <img :src="row.orgIconUrl" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="医院名称" prop="shortName" min-width="120" align="center" />
      <el-table-column label="医院性质" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.orgKind|formatTo('getHospitalKind') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="医院类型" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.orgType|formatTo('getHospitalType') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="医院等级" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.orgLevel|formatTo('getHospitalLevel') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" prop="orgTel" min-width="125" align="center">
        <template slot-scope="{row}">
          {{ row.orgTel|numDesensitization(3,4) }}
        </template>
      </el-table-column>
      <el-table-column label="所属区域" prop="orgAreaName" width="100" align="center" />
      <el-table-column label="地址" prop="orgAddr" min-width="200" align="center" />
      <el-table-column label="操作" align="center" width="100" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="jumpToEdit(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :limit.sync="listQuery.size" :page.sync="listQuery.current" @pagination="getList" />
  </div>

</template>

<script>
import headline from '@/components/headline'
import Pagination from '@/components/Pagination'
import map from '@/utils/map'
import { phoneValidate } from '@/utils/validate'
import handleTemp from '@/mixin/handleTemp'

export default {
  components: { headline, Pagination },
  mixins: [handleTemp],
  data() {
    return {
      listQuery: {
        current: 1,
        size: 10,
        orgAreaCode: '',
        hospitalName: '',
        hospitalCode: '',
        orgKind: '',
        orgType: '',
        orgLevel: '',
        orgInfo: ''
      },
      areaOptions: map.getArea,
      orgKindOptions: map.getHospitalKind,
      orgTypeOptions: map.getHospitalType,
      orgLevelOptions: map.getHospitalLevel,
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
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const params = this.tools.removeEmptyValue(Object.assign({}, this.listQuery))
      this.api.doctorApi.getHospitalListPage(params).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          this.list = data.data.records
          this.total = data.data.total
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    jumpToEdit(row) {
      if (row) { this.store.session.set('organInfo', row) } else {
        this.store.session.remove('organInfo')
      }
      this.$router.push({
        path: '/medicalInfoManage/organEdit'
      })
    },
    hospitalEdit() {
      this.$loading().show()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      let method = ''
      if (this.dialogStatus === 'create') {
        method = 'hospitalAdd'
        delete params['hospitalId']
      }
      if (this.dialogStatus === 'update') method = 'hospitalEdit'
      this.api.doctorApi[method](params).then(data => {
        this.$loading().hide()
        if (data.responseFlag === '1') {
          this.dialogFormVisible = false
          this.$message.success('操作成功')
          this.getList()
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
          this.hospitalEdit()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
