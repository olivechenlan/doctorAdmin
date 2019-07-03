<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col>
          <el-input v-model="listQuery.name" placeholder="请填写医生姓名" clearable class="filter-item filter-item-option" />
          <el-input v-model="listQuery.phone" placeholder="请填写手机号码" clearable type="number" class="filter-item filter-item-option" />
          <el-input v-model="listQuery.idCard" placeholder="请填写身份证号码" clearable class="filter-item filter-item-option" />
          <el-select v-model="listQuery.checkState" placeholder="请选择审核状态" clearable class="filter-item filter-item-option">
            <el-option v-for="item in checkStateOptions" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-input v-model="listQuery.hospitalName" placeholder="请填写医院名称" clearable class="filter-item filter-item-option" />
          <el-input v-model="listQuery.hospitalCode" placeholder="请填写机构代码" clearable class="filter-item filter-item-option" />
          <el-cascader :props="departmentProps" placeholder="请填写科室" :options="departmentOptions" clearable class="filter-item filter-item-option" @change="cascaderChange($event,'departmentId','listQuery')" />
          <el-cascader :props="titleProps" placeholder="请填写职称" :options="titleOptions" clearable class="filter-item filter-item-option" @change="cascaderChange($event,'zc','listQuery')" />
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </el-col>
      </el-row>
    </div>
    <headline list-title="审核列表" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="手机号" prop="phone" width="120" align="center" />
      <el-table-column label="姓名" prop="name" width="80" align="center" />
      <el-table-column label="身份证号码" prop="idCard" width="180" align="center" />
      <el-table-column label="医院名称" prop="hospitalName" min-width="130" align="center" />
      <el-table-column label="机构代码" prop="hospitalId" width="100" align="center" />
      <el-table-column label="科室" prop="departmentName" min-width="100" align="center" />
      <el-table-column label="职称" prop="zcName" min-width="100" align="center" />
      <el-table-column label="审核状态" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.checkState | stateFilter">
            {{ row.checkState | formatToState }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" prop="checkTime" width="180" align="center" />
      <el-table-column label="操作时间" prop="updateTime" width="180" align="center" />
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

    <el-dialog fullscreen :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="form-container">
      <el-form :model="temp" label-width="80px">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="认证图片" required>
              <enlarge :dialog-image-url="temp.workImgUrl" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="身份证正面" required label-width="100px">
              <enlarge :dialog-image-url="temp.idImgUrl" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" :gutter="20">
          <el-col :span="6">
            <el-form-item required label="姓名">
              <el-input v-model="temp.name" disabled placeholder="请填写姓名" />
            </el-form-item>
            <el-form-item label="所属医院" required>
              <el-select v-model="temp.hospitalId" disabled placeholder="请选择所属医院">
                <el-option v-for="item in hospitalOptions" :key="item.hospitalId" :label="item.hospitalName" :value="item.hospitalId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号码">
              <el-input v-model="temp.phone" type="number" disabled placeholder="请填写手机号码" />
            </el-form-item>
            <el-form-item label="科室" required>
              <el-cascader v-model="departmentModel" disabled style="width: 100%" :props="departmentProps" placeholder="请选择科室" :options="departmentOptions" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证号">
              <el-input v-model="temp.idCard" disabled placeholder="请填写身份证号码" />
            </el-form-item>
            <el-form-item label="职称" required>
              <el-cascader v-model="titleModel" disabled style="width: 100%" :props="titleProps" placeholder="请填写职称" :options="titleOptions" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工号">
              <el-input v-model="temp.doctorWorkId" disabled placeholder="请填写工号" />
            </el-form-item>
            <el-form-item label="院内短号">
              <el-input v-model="temp.shortPhone" disabled placeholder="请填写院内短号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="驳回理由">
          <el-input v-model="temp.checkInfo" :disabled="dialogStatus==='watch'" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="text-center">
        <el-button v-show="dialogStatus==='update'" type="primary" @click="authenCheck('2')">
          同意
        </el-button>
        <el-button v-show="dialogStatus==='update'" type="primary" plain @click="authenCheck('3')">
          驳回
        </el-button>
        <el-button plain @click="dialogFormVisible = false">
          返回
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import headline from '@/components/headline'
import Pagination from '@/components/Pagination'
import map from '@/utils/map'
import enlarge from '@/components/handleImage/enlarge'

export default {
  components: { Pagination, enlarge, headline },
  filters: {
    formatToState(state) {
      let result = { name: '' }
      result = !!state && (map.getCheckStatus.find(item => item.code === state))
      return result.name
    },
    stateFilter(state) {
      const stateMap = {
        '1': '',
        '2': 'success',
        '3': 'warning'
      }
      return stateMap[state]
    }
  },
  data() {
    return {
      listQuery: {
        current: 1,
        size: 15,
        name: '',
        hospitalName: '',
        hospitalCode: '',
        departmentId: '',
        zc: '',
        phone: '',
        idCard: '',
        checkState: ''
      },
      departmentOptions: [],
      departmentProps: {
        value: 'departmentId',
        label: 'departmentName',
        children: 'subDeptList'
      },
      departmentModel: [],
      titleOptions: [],
      titleProps: {
        value: 'id',
        label: 'name',
        children: 'subZcList'
      },
      titleModel: [],
      checkStateOptions: map.getCheckStatus,
      hospitalOptions: [],
      textMap: {
        update: '用户审核',
        watch: '用户查看'
      },
      list: null,
      total: 0,
      listLoading: true,
      temp: {
        userId: '',
        checkState: '',
        checkInfo: ''
      },
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  async created() {
    this.getList()
    await map.getDepartment()
    await map.getTitle()
    await map.getHospital()
    this.departmentOptions = this.store.session('departmentList')
    this.titleOptions = this.store.session('titleList')
    this.hospitalOptions = this.store.session('hospitalList')
  },
  methods: {
    getList() {
      this.listLoading = true
      this.api.doctorApi.getCheckList(this.tools.removeEmptyValue(this.listQuery)).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          this.list = data.data.records
          this.list.forEach(item => {
            item.checkTime = item.checkTime ? this.dayjs(item.checkTime).format('YYYY-MM-DD HH:mm:ss') : ''
            item.updateTime = item.updateTime ? this.dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : ''
          })
          this.total = data.data.total
        }
      }).catch(err => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    cascaderChange(e, model, flag) {
      if (flag === 'listQuery') this.listQuery[model] = e[e.length - 1]
      if (flag === 'temp') this.temp[model] = e[e.length - 1]
    },
    resetTemp() {
      this.temp = this.$options.data().temp
    },
    handleDialog(row, state) {
      this.resetTemp()
      this.temp = Object.assign({}, row)
      this.departmentModel = map.getDefaultFromDepartment(row.departmentId)
      this.titleModel = map.getDefaultFromTitle(row.zc)
      this.dialogStatus = state
      this.dialogFormVisible = true
    },
    authenCheck(state) {
      this.tools.$loading()
      this.temp.checkState = state
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      this.api.doctorApi.authenCheck(params).then(data => {
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
    }

  }
}
</script>
<style lang="scss" scoped>

</style>
