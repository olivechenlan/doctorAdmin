<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="科室名称">
        <el-input v-model="listQuery.departmentName" placeholder="请填写科室名称" clearable />
      </el-form-item>
      <el-form-item label="科室状态">
        <el-select v-model="listQuery.useState" placeholder="请选择科室状态">
          <el-option label="全部" value="" />
          <el-option v-for="item in departmentStateOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="科室类别">
        <el-select v-model="listQuery.type" placeholder="请选择科室类别">
          <el-option label="全部" value="" />
          <el-option v-for="item in departmentTypeOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="问诊科室">
        <el-select v-model="listQuery.inquiry" placeholder="请选择是否是问诊科室">
          <el-option label="全部" value="" />
          <el-option v-for="item in inquiryOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <headline list-title="科室列表" button-name="新增科室" @handleAction="handleCreate" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      row-key="departmentId"
      class="table-wrap"
    >
      <el-table-column label="科室名称" prop="departmentName" min-width="150" />
      <el-table-column label="标准科室代码" prop="departmentCode" min-width="150" align="center" />
      <el-table-column label="科室类别" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type|formatTo('getDepartmentType') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科室状态" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.useState|formatTo('getDepartmentState') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="问诊科室" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.inquiry|formatTo('getInquiry') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="orderNo" min-width="60" align="center" />
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
        <el-row type="flex" justify="space-between" class="row-bg">
          <el-col :span="11">
            <el-form-item label="科室类别" prop="type">
              <el-select v-model="temp.type" placeholder="请选择科室类别">
                <el-option v-for="item in departmentTypeOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item label="科室状态" prop="useState">
              <el-select v-model="temp.useState" placeholder="请选择科室状态">
                <el-option v-for="item in departmentStateOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="orderNo">
              <el-input v-model="temp.orderNo" type="number" placeholder="请填写排序" @mousewheel.native.prevent />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item v-show="temp.type==='1'" label="父级科室" prop="parDepartment">
              <el-select v-model="temp.parDepartment" placeholder="请选择一级科室">
                <el-option v-for="item in departmentOptions" :key="item.departmentId" :disabled="item.departmentId===temp.departmentId" :label="item.departmentName" :value="item.departmentId" />
              </el-select>
            </el-form-item>
            <el-form-item label="科室名称" prop="departmentName">
              <el-input v-model="temp.departmentName" placeholder="请填写科室名称" />
            </el-form-item>
            <el-form-item label="标准科室代码" prop="departmentCode">
              <el-input v-model="temp.departmentCode" placeholder="请填写标准科室代码" />
            </el-form-item>
            <el-form-item v-show="temp.type==='0'" label="问诊科室" prop="inquiry">
              <el-select v-model="temp.inquiry" placeholder="请选择是否问诊科室">
                <el-option v-for="item in inquiryOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
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
import map from '@/utils/map'
import { weightValidate } from '@/utils/validate'
import handleTemp from '@/mixin/handleTemp'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: { headline },
  mixins: [handleTemp],
  data() {
    return {
      listQuery: {
        departmentName: '',
        useState: '',
        type: '',
        inquiry: ''
      },
      list: [
        {
          departmentId: ''
        }
      ],
      departmentTypeOptions: map.getDepartmentType,
      departmentStateOptions: map.getDepartmentState,
      inquiryOptions: map.getInquiry,
      textMap: {
        update: '编辑科室信息',
        create: '新增科室'
      },
      temp: {
        type: '',
        departmentName: '',
        parDepartment: '',
        departmentCode: '',
        useState: '',
        orderNo: '',
        departmentId: '',
        inquiry: ''
      },
      rules: {
        type: [{ required: true, message: '请选择科室类别', trigger: 'change' }],
        departmentName: [{ required: true, message: '请输入科室名称', trigger: 'blur' }],
        parDepartment: [{ required: true, message: '请选择父级科室', trigger: 'change' }],
        useState: [{ required: true, message: '请选择科室状态', trigger: 'change' }],
        orderNo: [{ validator: weightValidate, triiger: 'blur' }],
        inquiry: [{ required: true, message: '请选择是否开通问诊', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters(['departmentOptions'])
  },
  created() {
  },
  mounted() {
    this.getList()
    this.getDepartment()
  },
  methods: {
    ...mapActions({
      getDepartment: 'options/getDepartment',
      updateDepartment: 'options/updateDepartment'
    }),
    getList(ifUpdate = false) {
      this.listLoading = true
      const params = this.tools.removeEmptyValue(Object.assign({}, this.listQuery))
      this.api.doctorApi.getDepartmentList(params).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          data.data.forEach(item => {
            if (item.parDepartment === '0') item.parDepartment = ''
            item.children = item.subDeptList
          })
          this.list = data.data
          if (ifUpdate) this.updateDepartment(data.data)
        }
      }).catch(() => {
        this.listLoading = false
      })
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
          this.getList(true)
        } else {
          this.$message.error(data.responseMessage)
        }
      }).catch(() => {
        this.tools.$loading().hide()
      })
    },
    updateData() {
      this.rules.parDepartment[0].required = this.temp.type === '1'
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
