<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.label" placeholder="请填写标签名称" clearable class="filter-item filter-item-option" />
      <el-select v-model="listQuery.type" placeholder="请选择标签种类" clearable class="filter-item filter-item-option">
        <el-option v-for="item in typeOptions" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <headline list-title="标签列表" button-name="新增标签" @handleAction="handleCreate" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      row-key="id"
      style="width: 100%;"
    >
      <el-table-column label="标签" prop="label" min-width="150" align="center" />
      <!--<el-table-column label="种类" prop="createTime" min-width="160" align="center" />-->
      <el-table-column label="描述" prop="remarks" min-width="200" align="center" />
      <el-table-column label="操作" width="148" fixed="right" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px" top="3%" custom-class="form-container">
      <el-form ref="dataForm" :model="temp" label-width="80px" :rules="rules">
        <el-row class="row-bg">
          <el-col :span="24">
            <el-form-item label="标签名称" prop="label">
              <el-input v-model="temp.label" placeholder="请填写标签名称" />
            </el-form-item>
            <!--<el-form-item label="标签种类" prop="type">-->
            <!--<el-select v-model="temp.type" placeholder="请选择标签种类" clearable>-->
            <!--<el-option v-for="item in typeOptions" :key="item.code" :label="item.name" :value="item.code" />-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item label="排序" prop="wegith">
              <el-input v-model="temp.wegith" type="number" placeholder="请填写排序" />
            </el-form-item>
            <el-form-item label="标签描述" prop="groupInfo">
              <el-input v-model="temp.remarks" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" >
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
export default {
  filters: {
    formatToType(state) {
      let result = { name: '' }
      result = !!state && (map.getCircleType.find(item => item.code === state))
      return result.name
    }
  },
  components: {
    headline
  },
  data() {
    return {
      listQuery: {
        label: '',
        type: ''
      },
      typeOptions: map.getCircleType,
      hospitalOptions: [],
      textMap: {
        update: '编辑标签',
        create: '新增标签'
      },
      list: null,
      total: 0,
      listLoading: true,
      temp: {
        id: '',
        label: '',
        wegith: ''
      },
      rules: {
        label: [{ required: true, message: '请输入标签名称', trigger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  async created() {
    this.getList()
  },
  mounted() {

  },
  methods: {
    getList() {
      this.listLoading = true
      this.api.doctorApi.getTag(this.tools.removeEmptyValue(this.listQuery)).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          this.list = data.data
        }
      }).catch(err => {
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
    circleEdit() {
      this.tools.$loading()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      if (!params.wegith) params.wegith = '0'
      let method = ''
      if (this.dialogStatus === 'update') method = 'tagEdit'
      if (this.dialogStatus === 'create') {
        method = 'tagAdd'
        delete params['id']
      }
      this.api.doctorApi[method](params).then(data => {
        this.tools.$loading().hide()
        if (data.responseFlag === '1') {
          this.dialogFormVisible = false
          this.$message.success('操作成功')
          this.listQuery = this.$options.data().listQuery
          this.getList()
        } else {
          this.$message.warning(data.responseMessage)
        }
      }).catch(err => {
        this.tools.$loading().hide()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.circleEdit()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
