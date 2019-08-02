<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="请填写职称名称" clearable class="filter-item filter-item-option" />
      <el-select v-model="listQuery.useState" placeholder="请选择职称状态" clearable class="filter-item filter-item-option">
        <el-option v-for="item in titleStateOptions" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="请选择职称类别" clearable class="filter-item filter-item-option">
        <el-option v-for="item in titleTypeOptions" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <headline list-title="职称列表" button-name="新增职称" @handleAction="handleCreate" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      row-key="id"
      style="width: 100%;"
    >
      <el-table-column label="职称名称" prop="name" min-width="150" />
      <el-table-column label="职称类别" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type|formatTo('getTitleType') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职称状态" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.useState|formatTo('getTitleState') }}</span>
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
      <el-form ref="dataForm" :model="temp" label-width="80px" :rules="rules">
        <el-form-item label="职称类别" prop="type">
          <el-select v-model="temp.type" placeholder="请选择科室类别">
            <el-option v-for="item in titleTypeOptions" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.type==='1'" label="父级职称" prop="parZc">
          <el-select v-model="temp.parZc" placeholder="请选择一级职称">
            <el-option v-for="item in titleOptions" :key="item.id" :disabled="item.id===temp.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="职称名称" prop="name">
          <el-input v-model="temp.name" placeholder="请填写科室名称" />
        </el-form-item>
        <el-form-item label="职称状态" prop="useState">
          <el-select v-model="temp.useState" placeholder="请选择科室状态">
            <el-option v-for="item in titleStateOptions" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="orderNo">
          <el-input v-model="temp.orderNo" type="number" placeholder="请填写排序" @mousewheel.native.prevent />
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
  components: { headline },
  data() {
    return {
      listQuery: {
        name: '',
        useState: '',
        type: ''
      },
      titleStateOptions: map.getTitleState,
      titleTypeOptions: map.getTitleType,
      titleOptions: [],
      textMap: {
        update: '编辑职称',
        create: '新增职称'
      },

      list: null,
      total: 0,
      listLoading: true,
      temp: {
        type: '',
        name: '',
        parZc: '',
        id: '',
        useState: '',
        orderNo: ''
      },
      rules: {
        type: [{ required: true, message: '请选择职称类别', trigger: 'change' }],
        name: [{ required: true, message: '请输入职称名称', trigger: 'blur' }],
        parZc: [{ required: true, message: '请选择父级职称', trigger: 'change' }],
        useState: [{ required: true, message: '请选择职称状态', trigger: 'change' }],
        orderNo: [{ validator: weightValidate, trigger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  created() {

  },
  async mounted() {
    await map.getTitle()
    this.titleOptions = this.store.session('titleList') || []
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.api.doctorApi.getTitleList(this.tools.removeEmptyValue(this.listQuery)).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          data.data.forEach(item => {
            item.parZc = item.parZc === '0' && ''
            item.children = item.subZcList
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
    titleEdit() {
      this.tools.$loading()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      if (params.type === '0') delete params['parZc']
      if (!params.orderNo) { params.orderNo = 0 }
      this.api.doctorApi.titleEdit(params).then(async(data) => {
        this.tools.$loading().hide()
        if (data.responseFlag === '1') {
          this.dialogFormVisible = false
          this.$message.success('操作成功')
          this.listQuery = this.$options.data().listQuery
          this.getList()
          await map.getTitle(true)
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
          this.titleEdit()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
