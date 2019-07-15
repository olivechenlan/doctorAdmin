<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.hospitalName" placeholder="请填写医院名称" clearable class="filter-item filter-item-option" />
      <el-input v-model="listQuery.phone" placeholder="请填写手机号码" clearable class="filter-item filter-item-option" />
      <el-select v-model="listQuery.appVersion" placeholder="请选择APP版本" clearable class="filter-item filter-item-option">
        <el-option v-for="(item,index) in versionOptions" :key="index" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.checkState" placeholder="请选择状态" clearable class="filter-item filter-item-option">
        <el-option v-for="item in stateOptions" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <headline list-title="反馈列表" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="医院名称" prop="hospitalName" min-width="150" align="center" />
      <el-table-column label="手机号码" prop="phone" width="120" align="center" />
      <el-table-column label="反馈内容" prop="content" min-width="150" align="center" />
      <el-table-column label="app版本" prop="appVersion" min-width="120" align="center" />
      <el-table-column label="手机系统" prop="sysVersion" min-width="120" align="center" />
      <el-table-column label="反馈日期" prop="createTime" min-width="180" align="center" />
      <el-table-column label="医生姓名" prop="name" min-width="150" align="center" />
      <el-table-column label="职称" prop="zcName" min-width="150" align="center" />
      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.checkState|formatToState }}</span>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800px" top="3%" custom-class="form-container">
      <el-form ref="dataForm" :model="temp" label-width="70px" :rules="rules">
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="temp.phone" disabled placeholder="请填写手机号码" />
        </el-form-item>
        <el-form-item label="反馈内容" prop="content">
          <el-input v-model="temp.content" disabled placeholder="请填写反馈内容" />
        </el-form-item>
        <el-form-item label="状态" prop="checkState">
          <el-select v-model="temp.checkState" placeholder="请选择状态" clearable>
            <el-option v-for="item in stateOptions" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="checkInfo">
          <el-input v-model="temp.checkInfo" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="" />
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
import Pagination from '@/components/Pagination'
export default {
  filters: {
    formatToState(state) {
      let result = { name: '' }
      result = !!state && (map.getFeedbackStatus.find(item => item.code === state))
      return result.name
    }
  },
  components: { headline, Pagination },
  data() {
    return {
      listQuery: {
        phone: '',
        hospitalName: '',
        appVersion: '',
        checkState: '',
        current: 1,
        size: 15
      },
      versionOptions: [],
      stateOptions: map.getFeedbackStatus,
      textMap: {
        update: '编辑反馈',
        create: ''
      },

      list: null,
      total: 0,
      listLoading: true,
      temp: {
        id: '',
        checkState: '',
        checkInfo: ''
      },
      rules: {
        checkState: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  created() {

  },
  mounted() {
    this.getAppVersion()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.api.doctorApi.getFeedbackList(this.tools.removeEmptyValue(this.listQuery)).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          data.data.records.forEach(item => {
            item.createTime = item.createTime ? this.dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') : ''
          })
          this.list = data.data.records
          this.total = data.data.total
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    getAppVersion() {
      this.api.doctorApi.getAppVersion({}).then(data => {
        if (data.responseFlag === '1') {
          this.versionOptions = data.data.filter(item => item !== null)
        }
      }).catch(() => {})
    },
    resetTemp() {
      this.temp = this.$options.data().temp
      !!this.$refs.dataForm && this.$refs.dataForm.resetFields()
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleUpdate(row) {
      this.resetTemp()
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    feedbackEdit() {
      this.tools.$loading()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      this.api.doctorApi.feedbackEdit(params).then(async(data) => {
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
          this.feedbackEdit()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
