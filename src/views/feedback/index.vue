<template>
  <div class="app-container">
    <el-form :inline="true" label-width="100px">
      <el-form-item label="医院名称">
        <el-input v-model="listQuery.hospitalName" placeholder="请填写医院名称" clearable />
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="listQuery.phone" type="tel" placeholder="请填写手机号码" clearable />
      </el-form-item>
      <el-form-item label="APP版本">
        <el-select v-model="listQuery.appVersion" placeholder="请选择APP版本">
          <el-option label="全部" value="" />
          <el-option v-for="(item,index) in versionOptions" :key="index" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listQuery.checkState" placeholder="请选择状态">
          <el-option label="全部" value="" />
          <el-option v-for="item in stateOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <headline list-title="反馈列表" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      class="table-wrap"
    >
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="医院名称" prop="hospitalName" min-width="140" align="center" />
      <el-table-column label="手机号码" prop="phone" width="110" align="center">
        <template slot-scope="{row}">
          {{ row.phone|numDesensitization(3,4) }}
        </template>
      </el-table-column>
      <el-table-column label="反馈内容" prop="content" min-width="150" align="center" />
      <el-table-column label="app版本" prop="appVersion" min-width="90" align="center" />
      <el-table-column label="手机系统" prop="sysVersion" min-width="100" align="center" />
      <el-table-column label="医生姓名" prop="name" min-width="100" align="center" />
      <el-table-column label="职称" prop="zcName" min-width="100" align="center" />
      <el-table-column label="状态" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.checkState|formatTo('getFeedbackStatus') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="反馈日期" min-width="180" align="center">
        <template slot-scope="{row}">
          {{ row.createTime|formatToTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" fixed="right" class-name="small-padding fixed-width">
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
        <el-row type="flex" justify="space-between" class="row-bg">
          <el-col :span="11">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="temp.phone" disabled placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="状态" prop="checkState">
              <el-select v-model="temp.checkState" placeholder="请选择状态">
                <el-option v-for="item in stateOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="反馈内容" prop="content">
          <el-input v-model="temp.content" disabled placeholder="" :autosize="{ minRows: 5, maxRows: 10}" type="textarea" />
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
import handleTemp from '@/mixin/handleTemp'
export default {
  components: { headline, Pagination },
  mixins: [handleTemp],
  data() {
    return {
      listQuery: {
        phone: '',
        hospitalName: '',
        appVersion: '',
        checkState: '',
        current: 1,
        size: 10
      },
      versionOptions: [],
      stateOptions: map.getFeedbackStatus,
      textMap: {
        update: '编辑反馈',
        create: ''
      },
      temp: {
        id: '',
        checkState: '',
        checkInfo: ''
      },
      rules: {
        checkState: [{ required: true, message: '请选择状态', trigger: 'change' }]
      }
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
      const params = this.tools.removeEmptyValue(Object.assign({}, this.listQuery))
      this.api.doctorApi.getFeedbackList(params).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
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
    feedbackEdit() {
      this.$loading().show()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      this.api.doctorApi.feedbackEdit(params).then(async(data) => {
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
          this.feedbackEdit()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
