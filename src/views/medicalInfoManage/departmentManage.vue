<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.departmentName" placeholder="请填写科室名称" clearable class="filter-item filter-item-option" />
      <el-select v-model="listQuery.useState" placeholder="请选择科室状态" clearable class="filter-item filter-item-option">
        <el-option v-for="item in departmentStateOptions" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="请选择科室类别" clearable class="filter-item filter-item-option">
        <el-option v-for="item in departmentTypeOptions" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <headline list-title="科室列表" button-name="新增科室" @handleAction="handleCreate" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      row-key="departmentId"
      style="width: 100%;"
    >
      <el-table-column label="科室名称" prop="departmentName" min-width="150" />
      <el-table-column label="标准科室代码" prop="departmentCode" min-width="150" align="center" />
      <el-table-column label="科室类别" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type|formatTo('Type') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科室状态" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.useState|formatTo('State') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800px" top="3%" custom-class="form-container">
      <el-form ref="dataForm" :model="temp" label-width="100px" :rules="rules">
        <el-form-item label="科室类别" prop="type">
          <el-select v-model="temp.type" placeholder="请选择科室类别" clearable>
            <el-option v-for="item in departmentTypeOptions" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.type==='1'" label="父级科室" prop="parDepartment">
          <el-select v-model="temp.parDepartment" placeholder="请选择一级科室" clearable>
            <el-option v-for="item in departmentOptions" :key="item.departmentId" :disabled="item.departmentId===temp.departmentId" :label="item.departmentName" :value="item.departmentId" />
          </el-select>
        </el-form-item>
        <el-form-item label="科室名称" prop="departmentName">
          <el-input v-model="temp.departmentName" placeholder="请填写科室名称" />
        </el-form-item>
        <el-form-item label="标准科室代码" prop="departmentCode">
          <el-input v-model="temp.departmentCode" placeholder="请填写标准科室代码" />
        </el-form-item>
        <el-form-item label="科室状态" prop="useState">
          <el-select v-model="temp.useState" placeholder="请选择科室状态" clearable>
            <el-option v-for="item in departmentStateOptions" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="orderNo">
          <el-input v-model="temp.orderNo" type="number" placeholder="请填写排序" />
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
import map from '@/utils/map'
import { weightValidate } from '@/utils/validate'
export default {
  filters: {
    formatTo(state, type) {
      let result = { name: '' }
      result = !!state && (map['getDepartment' + type].find(item => item.code === state))
      return result.name
    }
  },
  components: { headline },
  data() {
    return {
      listQuery: {
        departmentName: '',
        useState: '',
        type: ''
      },
      departmentTypeOptions: map.getDepartmentType,
      departmentStateOptions: map.getDepartmentState,
      departmentOptions: [],
      textMap: {
        update: '编辑科室信息',
        create: '新增科室'
      },

      list: null,
      total: 0,
      listLoading: true,
      temp: {
        type: '',
        departmentName: '',
        parDepartment: '',
        departmentCode: '',
        useState: '',
        orderNo: '',
        departmentId: ''
      },
      rules: {
        type: [{ required: true, message: '请选择科室类别', trigger: 'change' }],
        departmentName: [{ required: true, message: '请输入科室名称', trigger: 'blur' }],
        parDepartment: [{ required: true, message: '请选择父级科室', trigger: 'change' }],
        useState: [{ required: true, message: '请选择科室状态', trigger: 'change' }],
        orderNo: [{ validator: weightValidate, triiger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  created() {

  },
  async mounted() {
    this.getList()
    await map.getDepartment()
    this.departmentOptions = this.store.session('departmentList')
  },
  methods: {
    getList() {
      this.listLoading = true
      this.api.doctorApi.getDepartmentList(this.tools.removeEmptyValue(this.listQuery)).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          data.data.forEach(item => {
            item.parDepartment = item.parDepartment === '0' && ''
            item.children = item.subDeptList
          })
          this.list = data.data
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = this.$options.data().temp
      !!this.$refs.dataForm && this.$refs.dataForm.resetFields()
    },
    handleFilter() {
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.resetTemp()
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    departmentEdit() {
      this.tools.$loading()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      if (params.type === '0') delete params['parDepartment']
      if (!params.orderNo) { params.orderNo = 0 }
      this.api.doctorApi.departmentEdit(params).then(async(data) => {
        this.tools.$loading().hide()
        if (data.responseFlag === '1') {
          this.dialogFormVisible = false
          this.$message.success('操作成功')
          this.listQuery = this.$options.data().listQuery
          this.getList()
          await map.getDepartment(true)
        } else {
          this.$message.warning(data.responseMessage)
        }
      }).catch(() => {
        this.tools.$loading().hide()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.departmentEdit()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
