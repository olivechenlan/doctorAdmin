<template>
  <div class="app-container">
    <el-form label-width="100px" :inline="true">
      <el-form-item label="医生姓名">
        <el-input v-model="listQuery.name" placeholder="请填写医生姓名" clearable />
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="listQuery.phone" placeholder="请填写手机号码" clearable type="tel" />
      </el-form-item>
      <el-form-item label="身份证号码">
        <el-input v-model="listQuery.idCard" placeholder="请填写身份证号码" clearable />
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="listQuery.checkState" placeholder="请选择审核状态">
          <el-option label="全部" value="" />
          <el-option v-for="item in checkStateOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="医院名称">
        <el-input v-model="listQuery.hospitalName" placeholder="请填写医院名称" clearable />
      </el-form-item>
      <el-form-item label="机构代码">
        <el-input v-model="listQuery.hospitalCode" placeholder="请填写机构代码" clearable />
      </el-form-item>
      <el-form-item label="科室">
        <el-cascader :props="departmentProps" placeholder="请填写科室" :options="departmentOptions" clearable @change="cascaderChange($event,'departmentId','listQuery')" />
      </el-form-item>
      <el-form-item label="职称">
        <el-cascader :props="titleProps" placeholder="请填写职称" :options="titleOptions" clearable @change="cascaderChange($event,'zc','listQuery')" />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <headline list-title="审核列表" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      class="table-wrap"
    >
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="手机号" prop="phone" width="110" align="center">
        <template slot-scope="{row}">
          {{ row.phone|numDesensitization(3,4) }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" width="80" align="center" />
      <el-table-column label="身份证号码" prop="idCard" width="160" align="center">
        <template slot-scope="{row}">
          {{ row.idCard|numDesensitization(6,4) }}
        </template>
      </el-table-column>
      <el-table-column label="医院名称" prop="hospitalName" min-width="130" align="center" />
      <el-table-column label="机构代码" prop="hospitalId" width="100" align="center" />
      <el-table-column label="科室" prop="departmentName" min-width="100" align="center" />
      <el-table-column label="职称" prop="zcName" min-width="100" align="center" />
      <el-table-column label="审核状态" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.checkState | stateFilter">
            {{ row.checkState | formatTo('getCheckStatus') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" min-width="170" align="center">
        <template slot-scope="{row}">
          {{ row.checkTime|formatToTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作时间" min-width="170" align="center">
        <template slot-scope="{row}">
          {{ row.updateTime|formatToTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.checkState==='1'" type="primary" size="mini" @click="handleDialog(row,'update')">
            审核
          </el-button>
          <el-button v-else size="mini" @click="handleDialog(row,'watch')">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :limit.sync="listQuery.size" :page.sync="listQuery.current" @pagination="getList" />

    <el-dialog width="1200px" top="3%" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="form-container">
      <el-form :model="temp" label-width="80px">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="认证图片" required>
              <upload-image :src="temp.workImgUrl" :is-disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="身份证正面" required label-width="100px">
              <upload-image :src="temp.idImgUrl" :is-disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col :span="6">
            <el-form-item required label="姓名">
              <el-input v-model="temp.name" disabled placeholder="" />
            </el-form-item>
            <el-form-item label="所属医院" required>
              <el-select v-model="temp.hospitalId" disabled placeholder="">
                <el-option v-for="item in hospitalOptions" :key="item.hospitalId" :label="item.hospitalName" :value="item.hospitalId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号码">
              <el-input v-model="temp.phone" type="tel" disabled placeholder="" />
            </el-form-item>
            <el-form-item label="科室" required>
              <el-cascader v-model="departmentModel" disabled :props="departmentProps" placeholder="请选择科室" :options="departmentOptions" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证号">
              <el-input v-model="temp.idCard" disabled placeholder="" />
            </el-form-item>
            <el-form-item label="职称" required>
              <el-cascader v-model="titleModel" disabled :props="titleProps" placeholder="" :options="titleOptions" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工号">
              <el-input v-model="temp.doctorWorkId" disabled placeholder="" />
            </el-form-item>
            <el-form-item label="院内短号">
              <el-input v-model="temp.shortPhone" disabled placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="驳回理由" prop="checkInfo">
          <el-input v-model="temp.checkInfo" :disabled="dialogStatus==='watch'" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="" />
        </el-form-item>
      </el-form>

      <div v-show="dialogStatus==='update'" slot="footer">
        <el-button type="primary" @click="updateData('2')">
          同意
        </el-button>
        <el-button type="primary" plain @click="updateData('3')">
          驳回
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import headline from '@/components/headline'
import Pagination from '@/components/Pagination'
import map from '@/utils/map'
import uploadImage from '@/components/uploadFile/uploadImage'
import handleTemp from '@/mixin/handleTemp'
import handleDefault from '@/mixin/handleDefault'

export default {
  components: { Pagination, uploadImage, headline },
  filters: {
    stateFilter(state) {
      const stateMap = {
        '1': '',
        '2': 'success',
        '3': 'warning'
      }
      return stateMap[state]
    }
  },
  mixins: [handleTemp, handleDefault],
  data() {
    return {
      listQuery: {
        current: 1,
        size: 10,
        name: '',
        hospitalName: '',
        hospitalCode: '',
        departmentId: '',
        zc: '',
        phone: '',
        idCard: '',
        checkState: ''
      },
      checkStateOptions: map.getCheckStatus,
      textMap: {
        update: '用户审核',
        watch: '用户查看'
      },
      temp: {
        userId: '',
        checkState: '',
        checkInfo: ''
      },
      rules: {
        checkInfo: [{ required: true, message: '请填写驳回理由', trigger: 'blur' }]
      }
    }
  },
  created() {
  },
  mounted() {
    this.getList()
    this.getDepartment()
    this.getTitle()
    this.getHospital()
  },
  methods: {
    getList() {
      this.listLoading = true
      const params = this.tools.removeEmptyValue(Object.assign({}, this.listQuery))
      this.api.doctorApi.getCheckList(params).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          this.list = data.data.records
          this.total = data.data.total
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleDialog(row, state) {
      this.resetTemp()
      this.temp = Object.assign({}, row)
      this.departmentModel = this.getDefaultFromDepartment(row.departmentId)
      this.titleModel = this.getDefaultFromTitle(row.zc)
      this.dialogStatus = state
      this.dialogFormVisible = true
    },
    authenCheck(state) {
      this.$loading().show()
      this.temp.checkState = state
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      this.api.doctorApi.authenCheck(params).then(data => {
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
    updateData(state) {
      this.temp.checkState = state
      this.rules.checkInfo[0].required = this.temp.checkState === '3'
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.authenCheck(state)
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>

</style>
