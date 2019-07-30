<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col>
          <el-input v-model="listQuery.title" placeholder="请填写标题关键字" clearable class="filter-item filter-item-option" />
          <el-select v-model="listQuery.zcId" placeholder="请选择职称" clearable class="filter-item filter-item-option">
            <el-option v-for="item in titleOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
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
      <el-table-column label="发布人" prop="title" min-width="160" align="center" />
      <el-table-column label="职称" prop="title" min-width="160" align="center" />
      <el-table-column label="手机号码" prop="title" min-width="160" align="center" />
      <el-table-column label="所属医院" prop="title" min-width="160" align="center" />
      <el-table-column label="审核状态" prop="title" min-width="160" align="center" />
      <el-table-column label="点击量" prop="title" min-width="160" align="center" />
      <el-table-column label="审核人" prop="title" min-width="160" align="center" />
      <el-table-column label="创建时间" prop="title" min-width="160" align="center" />
      <el-table-column label="操作" align="center" width="100" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="jumpToEdit(row)">
            操作
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<pagination v-show="total>0" :total="total" :limit.sync="listQuery.size" :page.sync="listQuery.current" @pagination="getList" />-->
  </div>
</template>

<script>
import headline from '@/components/headline'
import Pagination from '@/components/Pagination'
import map from '@/utils/map'
export default {
  components: { Pagination, headline },

  data() {
    return {
      listQuery: {
        title: '',
        checkState: '',
        name: '',
        phone: '',
        hospitalName: '',
        zcId: ''
      },
      checkStateOption: map.getSkillCheckState,
      titleOptions: [],
      isTopOptions: [
        {
          name: '否',
          code: '0'
        }, {
          name: '是',
          code: '1'
        }
      ],
      stateOptions: map.getBannerStatus,
      list: null,
      total: 0,
      listLoading: true,
      textMap: {
        update: '编辑资讯',
        create: '新增资讯'
      }
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
            item.typeName = this.topicOptions.find(it => it.type === item.type).name
            item.startTime = item.startTime ? this.dayjs(item.startTime).format('YYYY-MM-DD HH:mm:ss') : ''
            item.endTime = item.endTime ? this.dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss') : ''
            item.isTop = item.weight > 0 ? '是' : '否'
          })
          this.total = data.data.total
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.getList()
    },
    jumpToEdit(row) {
      if (row) { this.store.session.set('info', row) } else {
        this.store.session.remove('info')
      }
      this.$router.push({
        path: '/infoManage/infoEdit'
      })
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
