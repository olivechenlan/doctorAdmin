<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="请填写圈子名称" clearable class="filter-item filter-item-option" />
      <el-select v-model="listQuery.type" placeholder="请选择圈子类型" clearable class="filter-item filter-item-option">
        <el-option v-for="item in typeOptions" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <headline list-title="圈子列表" button-name="新增圈子" @handleAction="handleCreate" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      row-key="id"
      style="width: 100%;"
    >
      <el-table-column label="圈子名称" prop="name" width="150" align="center" />
      <el-table-column label="主图" width="160" align="center">
        <template slot-scope="{row}">
          <div class="image-column">
            <img :src="row.iconUrl" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type|formatToType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关注人数" prop="follows" width="90" align="center" />
      <el-table-column label="简介" prop="groupInfo" min-width="150" align="center" />
      <el-table-column label="创建人" prop="fromName" width="120" align="center" />
      <el-table-column label="创建时间" prop="createTime" width="160" align="center" />
      <el-table-column label="操作" width="148" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.type==='3'" type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :limit.sync="listQuery.size" :page.sync="listQuery.current" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800px" top="3%" custom-class="form-container">
      <el-form ref="dataForm" :model="temp" label-width="100px" :rules="rules">
        <el-row class="row-bg">
          <el-col :span="18">
            <el-form-item label="圈子名称" prop="name">
              <el-input v-model="temp.name" placeholder="请填写圈子名称" />
            </el-form-item>
            <el-form-item label="圈子类别" prop="type">
              <el-select v-model="temp.type" placeholder="请选择圈子类别" clearable>
                <el-option v-for="item in typeOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item v-show="temp.type==='2'" label="所属医院" prop="fromId">
              <el-select v-model="temp.fromId" placeholder="请选择所属医院" clearable>
                <el-option v-for="item in hospitalOptions" :key="item.hospitalId" :label="item.hospitalName" :value="item.hospitalId" />
              </el-select>
            </el-form-item>
            <el-form-item label="圈子主图" prop="fileList">
              <upload-image :file-list="temp.fileList" @imageChange="getImage" />
            </el-form-item>
            <el-form-item label="简介" prop="groupInfo">
              <el-input v-model="temp.groupInfo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="" />
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
import map from '@/utils/map'
import uploadImage from '@/components/handleImage/upload'
export default {
  filters: {
    formatToType(state) {
      let result = { name: '' }
      result = !!state && (map.getCircleType.find(item => item.code === state))
      return result.name
    }
  },
  components: {
    headline, uploadImage, Pagination
  },
  data() {
    return {
      listQuery: {
        name: '',
        type: '',
        current: 1,
        size: 15
      },
      typeOptions: map.getCircleType,
      hospitalOptions: [],
      textMap: {
        update: '编辑圈子',
        create: '新增圈子'
      },
      list: null,
      total: 0,
      listLoading: true,
      temp: {
        groupId: '',
        name: '',
        type: '',
        fromId: '',
        iconUrl: '',
        groupInfo: ''
      },
      rules: {
        name: [{ required: true, message: '请输入圈子名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择圈子类型', trigger: 'change' }],
        fromId: [{ required: true, message: '请选择所属医院', trigger: 'change' }]
      },
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  watch: {
    'dialogFormVisible'(vnew, vold) {
      if (vnew) {
        this.getNotAddedHospital()
      }
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
      this.api.doctorApi.getCircleList(this.tools.removeEmptyValue(this.listQuery)).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          this.list = data.data.records
          this.total = data.data.total
          this.list.forEach(item => {
            item.createTime = this.dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
            item.fileList = item.iconUrl ? [{ name: '', url: item.iconUrl }] : []
          })
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
      this.temp.current = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    getNotAddedHospital() {
      this.hospitalOptions = []
      if (this.dialogStatus === 'update') {
        this.hospitalOptions.push({
          hospitalId: this.temp.fromId,
          hospitalName: this.temp.fromName
        })
      }
      this.api.doctorApi.getNotAddedHospital({}).then(data => {
        if (data.responseFlag === '1') {
          data.data.forEach(item => {
            this.hospitalOptions.push({
              hospitalId: item.hospitalId,
              hospitalName: item.hospitalName
            })
          })
        }
      }).catch(err => {})
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
      this.$confirm('确定删除选中的圈子?', '提示', {
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
        }).catch(err => {
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
      }).catch(err => {
        this.tools.$loading().hide()
      })
    },
    updateData() {
      if (!this.temp.fromId) {
        if (this.temp.type === '1') this.temp.fromId = '331099'
        if (this.temp.type === '3') this.temp.fromId = this.$store.state.user.accessToken
      }
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
