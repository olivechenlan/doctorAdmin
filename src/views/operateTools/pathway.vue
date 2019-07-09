<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="请填写症状名称" clearable class="filter-item filter-item-option" />
      <el-select v-model="listQuery.major" placeholder="请选择所属专业" clearable class="filter-item filter-item-option">
        <el-option v-for="item in majorOptions" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="请选择类型" clearable class="filter-item filter-item-option">
        <el-option v-for="item in typeOptions" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <headline list-title="路径列表" button-name="新增路径" @handleAction="handleCreate" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="所属专业" prop="name" min-width="150" align="center" />
      <el-table-column label="症状名称" min-width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="适用类型" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
          <el-button size="mini" @click="handlePreview(row)">
            预览
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :limit.sync="listQuery.size" :page.sync="listQuery.current" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800px" top="3%" custom-class="form-container">
      <el-form ref="dataForm" :model="temp" label-width="80px" :rules="rules">
        <el-form-item label="症状名称" prop="name">
          <el-input v-model="temp.name" placeholder="请填写症状名称" />
        </el-form-item>
        <el-form-item label="所属专业" prop="major">
          <el-select v-model="temp.major" placeholder="请选择所属专业" clearable>
            <el-option v-for="item in majorOptions" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="适用类型" prop="type">
          <el-select v-model="temp.type" placeholder="请选择适用类型" clearable>
            <el-option v-for="item in typeOptions" :key="item.hospitalId" :label="item.hospitalName" :value="item.hospitalId" />
          </el-select>
        </el-form-item>
        <el-form-item label="上传附件" prop="pdf">
          <uploadPdf :src="temp.pdf" @getChange="getImage" />
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
import map from '@/utils/map'
import uploadPdf from '@/components/uploadFile/uploadPdf'
export default {
  filters: {},
  components: {
    headline, uploadPdf, Pagination
  },
  data() {
    return {
      listQuery: {
        name: '',
        major: '',
        type: '',
        current: 1,
        size: 15
      },
      typeOptions: map.getCircleType,
      majorOptions: [],
      hospitalOptions: [],
      textMap: {
        update: '编辑临床路径',
        create: '新增临床路径'
      },
      list: null,
      total: 0,
      listLoading: true,
      temp: {
        name: '',
        major: '',
        type: '',
        pdf: ''
      },
      rules: {
        name: [{ required: true, message: '请输入症状名称', trigger: 'blur' }],
        major: [{ required: true, message: '请选择所属专业', trigger: 'change' }],
        type: [{ required: true, message: '请选择适用类型', trigger: 'change' }],
        pdf: [{ required: true, message: '请上传附件', trigger: 'change' }]
      },
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.api.doctorApi.getCircleList(this.tools.removeEmptyValue(this.listQuery)).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          this.list = data.data.records
          this.total = data.data.total
          this.list.forEach(item => {
            item.createTime = this.dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
            item.typeName = item.type ? this.typeOptions.find(item => item.code === item.type).name : ''
          })
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
      this.temp.current = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    getImage(image) {
      this.temp.iconUrl = image
    },
    handleUpdate(row) {
      this.resetTemp()
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleDelete(row) {
      this.$confirm('确定删除该临时路径?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tools.$loading()
        this.api.doctorApi.circleDelete(row.groupId).then(data => {
          this.tools.$loading().hide()
          if (data.responseFlag === '1') {
            this.$message.success('删除成功!')
            this.listQuery = this.$options.data().listQuery
            this.getList()
          } else {
            this.$message.warning(data.responseMessage)
          }
        }).catch(() => {
          this.tools.$loading().hide()
        })
      }).catch(() => {
      })
    },
    circleEdit() {
      this.tools.$loading()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      if (this.dialogStatus === 'create') { delete params['groupId'] }
      this.api.doctorApi.circleEdit(params).then(data => {
        this.tools.$loading().hide()
        if (data.responseFlag === '1') {
          this.dialogFormVisible = false
          this.$message.success('操作成功')
          this.listQuery = this.$options.data().listQuery
          this.getList()
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
          this.circleEdit()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
