<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col>
          <el-input v-model="listQuery.title" placeholder="请填写标题关键字" clearable class="filter-item filter-item-option" />
          <el-cascader :props="titleProps" placeholder="请填写职称" :options="titleOptions" clearable class="filter-item filter-item-option" @change="cascaderChange" />
          <el-input v-model="listQuery.hospitalName" placeholder="请填写医院名称" clearable class="filter-item filter-item-option" />
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-select v-model="listQuery.checkState" placeholder="请选择审核状态" clearable class="filter-item filter-item-option">
            <el-option v-for="item in checkStateOption" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
          <el-input v-model="listQuery.name" placeholder="请填写发布人" clearable class="filter-item filter-item-option" />
          <el-input v-model="listQuery.phone" placeholder="请填写手机号码" clearable class="filter-item filter-item-option" />
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </el-col>
      </el-row>
    </div>
    <headline list-title="病例列表" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" type="index" width="100" align="center" />
      <el-table-column label="标题" prop="title" min-width="160" align="center" />
      <el-table-column label="发布人" prop="name" min-width="160" align="center" />
      <el-table-column label="职称" prop="zc" min-width="160" align="center" />
      <el-table-column label="手机号码" prop="phone" min-width="160" align="center" />
      <el-table-column label="所属医院" prop="hospitalName" min-width="160" align="center" />
      <el-table-column label="审核状态" min-width="160" align="center">
        <template slot-scope="{row}">
          {{ row.checkState|formatTo('getSkillCheckState')}}
        </template>
      </el-table-column>
      <el-table-column label="点击量" prop="views" min-width="160" align="center" />
      <el-table-column label="审核人" prop="checkName" min-width="160" align="center" />
      <el-table-column label="创建时间" prop="createTime" min-width="160" align="center" />
      <el-table-column label="操作" align="center" width="100" fixed="right">
        <template slot-scope="{row}">
          <el-button v-if="row.checkState==='0'" type="primary" size="mini" @click="jumpToEdit(row)">
            审核
          </el-button>
          <el-button v-else plain size="mini" @click="jumpToEdit(row)">
            查看
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
export default {
  components: { headline, Pagination },
  data() {
    return {
      listQuery: {
        current: 1,
        size: 10,
        title: '',
        checkState: '',
        name: '',
        phone: '',
        hospitalName: '',
        zcId: ''
      },
      checkStateOption: map.getSkillCheckState,
      titleProps: {
        value: 'id',
        label: 'name',
        children: 'subZcList'
      },
      titleOptions: [],
      list: null,
      total: 0,
      listLoading: true
    }
  },
  created() {
  },
  async mounted() {
    await map.getTitle()
    this.titleOptions = this.store.session('titleList') || []
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.api.doctorApi.getDoctorSkillList(this.tools.removeEmptyValue(this.listQuery)).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          this.list = data.data.records
          this.list.forEach(item => {
          })
          this.total = data.data.total
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    cascaderChange(val) {
      this.listQuery.zcId = val[val.length - 1]
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    jumpToEdit(row) {
      this.$router.push({
        path: '/medicalSkillManage/edit',
        query: {
          id: row.doctorArtId,
          checkState: row.checkState
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
