<template>
  <div class="app-container">
    <el-form :inline="true" label-width="90px">
      <el-form-item label="区域">
        <el-select v-model="listQuery.orgAreaCode" placeholder="请选择区域">
          <el-option label="全部" value="" />
          <el-option v-for="item in areaOptions" :key="item.code" :label="item.name" :value="item.code" />
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
      <el-form-item label="医生姓名">
        <el-input v-model="listQuery.name" placeholder="请填写医生姓名" clearable />
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="listQuery.phone" placeholder="请填写手机号码" type="tel" clearable />
      </el-form-item>
      <el-form-item label="身份证号码">
        <el-input v-model="listQuery.idCard" placeholder="请填写身份证号码" clearable />
      </el-form-item>
      <el-form-item label="认证状态">
        <el-select v-model="listQuery.state" placeholder="请选择认证状态">
          <el-option label="全部" value="" />
          <el-option v-for="item in authStateOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <headline list-title="医护用户列表" />
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
      <el-table-column label="姓名" prop="name" width="120" align="center" />
      <el-table-column label="身份证号码" prop="idCard" width="160" align="center">
        <template slot-scope="{row}">
          {{ row.idCard|numDesensitization(6,4) }}
        </template>
      </el-table-column>
      <el-table-column label="医院名称" prop="hospitalName" min-width="150" align="center" />
      <el-table-column label="科室" prop="departmentName" min-width="100" align="center" />
      <el-table-column label="职称" prop="zcName" min-width="100" align="center" />
      <el-table-column label="机构代码" prop="hospitalId" width="90" align="center" />
      <el-table-column label="认证状态" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.state|formatTo('getAuthenStatus') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="jumpToEdit(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :limit.sync="listQuery.size" :page.sync="listQuery.current" @pagination="getList" />
  </div>
</template>

<script>
import headline from '@/components/headline'
import Pagination from '@/components/Pagination'
import map from '@/utils/map'
import handleTemp from '@/mixin/handleTemp'
import handleDefault from '@/mixin/handleDefault'
export default {
  components: { Pagination, headline },
  mixins: [handleTemp, handleDefault],
  data() {
    return {
      listQuery: {
        current: 1,
        size: 10,
        orgAreaCode: '',
        hospitalName: '',
        hospitalCode: '',
        departmentId: '',
        zc: '',
        name: '',
        phone: '',
        idCard: '',
        state: ''
      },
      areaOptions: map.getArea,
      authStateOptions: map.getAuthenStatus
    }
  },
  computed: {
  },
  created() {
    // const medicalUserQuery = this.store.session('medicalUserQuery')
    // this.listQuery = Object.assign(this.listQuery, medicalUserQuery)
    // this.store.session.remove('medicalUserQuery')
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const params = this.tools.removeEmptyValue(Object.assign({}, this.listQuery))
      this.api.doctorApi.getUserInfoList(params).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          data.data.records.forEach(item => {
            item.isInquiry = item.isInquiry === '2' ? '2' : '1'
          })
          this.list = data.data.records
          this.total = data.data.total
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    jumpToEdit(row) {
      this.store.session.set('medicalUserQuery', this.listQuery)
      this.$router.push({
        path: '/userManage/medicalUser/userEdit',
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
