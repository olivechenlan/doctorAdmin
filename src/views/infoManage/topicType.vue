<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="请填写栏目关键字" clearable class="filter-item filter-item-option" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <headline list-title="栏目列表" button-name="新增栏目" @handleAction="handleCreate" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="编号" type="index" width="90" align="center" />
      <el-table-column label="栏目名称" prop="name" min-width="200" align="center" />
      <el-table-column label="排序" prop="weight" min-width="100" align="center" />
      <el-table-column label="文章数" prop="textCount" width="120" align="center" />
      <el-table-column label="备注" prop="remarks" min-width="200" align="center" />
      <el-table-column label="操作" width="147" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.textCount<1" type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="form-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="80px">
        <el-form-item label="栏目名称" prop="name">
          <el-input v-model="temp.name" placeholder="请填写栏目名称" />
        </el-form-item>
        <el-form-item label="排序" prop="weight">
          <el-input v-model="temp.weight" placeholder="请填写序号" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button plain @click="dialogFormVisible = false">
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
export default {
  components: { headline },
  filters: {

  },
  data() {
    return {
      listQuery: {
        name: '',
        code: '3310'
      },
      list: null,
      total: 0,
      listLoading: true,
      textMap: {
        update: '编辑栏目',
        create: '新增栏目'
      },
      temp: {
        type: '',
        name: '',
        typeLevel: '1',
        code: '3310',
        weight: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }]
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
      this.api.doctorApi.getTopicList(this.tools.removeEmptyValue(this.listQuery)).then(data => {
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
    handleDelete(row) {
      this.$confirm('确定删除该栏目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tools.$loading()
        this.api.doctorApi.topicDelete(this.tools.saveValueFromObject(row, { type: '', code: '' })).then(data => {
          this.tools.$loading().hide()
          if (data.responseFlag === '1') {
            this.$message.success('删除成功!')
            this.listQuery = this.$options.data().listQuery
            this.getList()
          } else {
            this.$message.warning(data.responseMessage)
          }
        }).catch(err => {
          this.tools.$loading().hide()
        })
      }).catch(() => {
      })
    },
    circleEdit() {
      this.tools.$loading()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      if (!params.weight) { params.weight = 0 }
      let method = ''
      if (this.dialogStatus === 'update') method = 'topicEdit'
      if (this.dialogStatus === 'create') {
        method = 'topicAdd'
        delete params['type']
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
