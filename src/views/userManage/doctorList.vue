<template>
  <div class="app-container">
    <el-form :inline="true" label-width="90px">
      <el-form-item label="医生姓名">
        <el-input v-model="listQuery.name" placeholder="请填写医生姓名" clearable />
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="listQuery.phone" placeholder="请填写手机号码" type="tel" clearable />
      </el-form-item>
      <el-form-item label="是否热门">
        <el-select v-model="listQuery.isHot" placeholder="请选择是否热门">
          <el-option label="全部" value="" />
          <el-option v-for="item in isHotOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="医院名称">
        <el-input v-model="listQuery.hospitalName" placeholder="请填写医院名称" clearable />
      </el-form-item>
      <el-form-item label="科室">
        <el-cascader :props="departmentProps" placeholder="请填写科室" :options="departmentOptions" clearable @change="cascaderChange($event,'departmentId','listQuery')" />
      </el-form-item>
      <el-form-item label="职称">
        <el-cascader :props="titleProps" placeholder="请填写职称" :options="titleOptions" clearable @change="cascaderChange($event,'zc','listQuery')" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <headline list-title="问诊医生列表" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      class="table-wrap"
    >
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="手机号" prop="phone" width="100" align="center">
        <template slot-scope="{row}">
          {{ row.phone|numDesensitization(3,4) }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" min-width="70" align="center" />
      <el-table-column label="问诊头像" min-width="100" align="center">
        <template slot-scope="{row}">
          <div class="image-column">
            <img :src="row.inquiryHead" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="医院名称" prop="hospitalName" min-width="130" align="center" />
      <el-table-column label="科室" prop="departmentName" min-width="90" align="center" />
      <el-table-column label="职称" prop="zcName" min-width="80" align="center" />
      <el-table-column label="问诊定价" prop="registrationFee" min-width="80" align="center" />
      <el-table-column label="总接诊量" prop="total" min-width="80" align="center" />
      <el-table-column label="好评率" prop="applauseRate" min-width="70" align="center" />
      <el-table-column label="热门医生" prop="isHot" min-width="80" align="center">
        <template slot-scope="{row}">
          {{ row.isHot|formatTo('getIsHot') }}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="weight" min-width="60" align="center" />
      <el-table-column label="开通时间" prop="checkTime" width="160" align="center">
        <template slot-scope="{row}">
          {{ row.checkTime|formatToTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleDialog(row,'update')">
            编辑
          </el-button>
          <el-button plain size="mini" @click="jumpToComment(row)">
            评价
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :limit.sync="listQuery.size" :page.sync="listQuery.current" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1200px" top="2%" custom-class="form-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="80px">
        <el-row type="flex" class="row-bg" :gutter="20">
          <el-col :span="6">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="temp.name" placeholder="请填写姓名" disabled />
            </el-form-item>
            <el-form-item label="所属医院" prop="hospitalId">
              <el-select v-model="temp.hospitalId" placeholder="请选择所属医院" disabled>
                <el-option v-for="item in hospitalOptions" :key="item.hospitalId" :label="item.hospitalName" :value="item.hospitalId" />
              </el-select>
            </el-form-item>
            <el-form-item label="问诊头像" prop="inquiryHead">
              <upload-image :src="temp.inquiryHead" @getChange="getFile($event,'inquiryHead')" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="temp.phone" disabled placeholder="请填写手机号码" />
            </el-form-item>
            <el-form-item label="科室" prop="departmentId">
              <el-cascader v-model="departmentModel" :props="departmentProps" placeholder="请选择科室" :options="departmentOptions" disabled @change="cascaderChange($event,'departmentId','temp')" />
            </el-form-item>
            <el-form-item label="排序" prop="weight">
              <el-input v-model="temp.weight" placeholder="请填写排序" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="temp.idCard" placeholder="请填写身份证号码" disabled />
            </el-form-item>
            <el-form-item label="职称" prop="zc">
              <el-cascader v-model="titleModel" :props="titleProps" placeholder="请填写职称" :options="titleOptions" disabled @change="cascaderChange($event,'zc','temp')" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工号" prop="doctorWorkId">
              <el-input v-model="temp.doctorWorkId" placeholder="请填写工号" disabled />
            </el-form-item>
            <el-form-item label="热门医生" prop="isHot">
              <el-select v-model="temp.isHot" placeholder="请选择是否热门医生">
                <el-option v-for="item in isHotOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between" :gutter="20">
          <el-col :span="12">
            <el-form-item label="擅长" prop="beGoodAt">
              <el-input v-model="temp.beGoodAt" :autosize="{ minRows: 4, maxRows: 8}" type="textarea" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="个人简介" prop="doctorInfo">
              <el-input v-model="temp.doctorInfo" :autosize="{ minRows: 4, maxRows: 8}" type="textarea" placeholder="" />
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
import uploadImage from '@/components/uploadFile/uploadImage'

import map from '@/utils/map'
import handleTemp from '@/mixin/handleTemp'
import handleDefault from '@/mixin/handleDefault'
import { weightValidate } from '@/utils/validate'

export default {
  components: { Pagination, headline, uploadImage },
  mixins: [handleTemp, handleDefault],
  data() {
    return {
      listQuery: {
        current: 1,
        size: 10,
        hospitalName: '',
        departmentId: '',
        zc: '',
        name: '',
        phone: '',
        isHot: ''
      },
      isHotOptions: map.getIsHot,
      textMap: {
        update: '编辑问诊医生信息'
      },
      temp: {
        userId: '',
        name: '',
        idCard: '',
        doctorWorkId: '',
        hospitalId: '',
        departmentId: '',
        zc: '',
        shortPhone: '',
        doctorInfo: '',
        headImg: '',
        inquiryHead: '',
        beGoodAt: '',
        isHot: ''
      },
      rules: {
        isHot: [{ required: true, message: '请选择是否热门医生', trigger: 'change' }],
        weight: [{ validator: weightValidate, trigger: 'blur' }],
        inquiryHead: [{ required: true, message: '请上传问诊头像', trigger: 'change' }],
        beGoodAt: [{ required: true, message: '请填写擅长', trigger: 'blur' }],
        doctorInfo: [{ required: true, message: '请填写个人简介', trigger: 'blur' }]
      }
    }
  },
  computed: {
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
      this.api.doctorApi.getInquiryList(params).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          this.list = data.data.records
          this.total = data.data.total
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    async handleDialog(row) {
      this.handleUpdate(row)
      await this.getInquiryDetailWEB(row.userId)
      this.departmentModel = this.getDefaultFromDepartment(row.departmentId)
      this.titleModel = this.getDefaultFromTitle(row.zc)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    async getInquiryDetailWEB(id) {
      this.$loading().show()
      await this.api.doctorApi.getInquiryDetailWEB({
        userId: id
      }).then(data => {
        this.$loading().hide()
        if (data.responseFlag === '1') {
          this.temp = data.data
        } else {
          this.$message.error(data.responseMessage)
        }
      }).catch(() => {
        this.$loading().hide()
      })
    },
    editInquiryDoctor() {
      this.$loading().show()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      this.api.doctorApi.editInquiryDoctor(params).then(data => {
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
          this.editInquiryDoctor()
        }
      })
    },
    jumpToComment(row) {
      this.$router.push({
        name: 'userManage-doctorList-commentList',
        query: {
          id: row.userId
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
</style>
