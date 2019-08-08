<template>
  <div class="app-container">
    <el-form :inline="true" label-width="100px">
      <el-form-item label="标题关键字">
        <el-input v-model="listQuery.title" placeholder="请填写标题关键字" clearable />
      </el-form-item>
      <el-form-item label="栏目">
        <el-select v-model="listQuery.type" placeholder="请选择栏目">
          <el-option label="全部" value="" />
          <el-option v-for="item in topicOptions" :key="item.type" :label="item.name" :value="item.type" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listQuery.status" placeholder="请选择状态">
          <el-option label="全部" value="" />
          <el-option v-for="item in stateOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否置顶">
        <el-select v-model="listQuery.isTOP" placeholder="请选择是否置顶">
          <el-option label="全部" value="" />
          <el-option v-for="item in isTopOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建人关键字">
        <el-input v-model="listQuery.fromUser" placeholder="请填写创建人关键字" clearable />
      </el-form-item>
      <el-form-item label="来源关键字">
        <el-input v-model="listQuery.fromSource" placeholder="请填写来源关键字" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <headline list-title="资讯列表" button-name="新增资讯" @handleAction="jumpToEdit" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="标题" prop="title" min-width="160" align="center" />
      <el-table-column label="缩略图" min-width="100" align="center">
        <template slot-scope="{row}">
          <div class="image-column">
            <img :src="row.listImg" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="栏目" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" prop="fromSource" min-width="80" align="center" />
      <el-table-column label="点击量" prop="author" min-width="68" align="center" />
      <el-table-column label="收藏数" prop="author" min-width="68" align="center" />
      <el-table-column label="创建人" prop="fromUser" min-width="80" align="center" />
      <el-table-column label="是否置顶" prop="isTop" min-width="80" align="center" />
      <el-table-column label="上架时间" min-width="160" align="center">
        <template slot-scope="{row}">
          {{ row.startTime|formatToTime }}
        </template>
      </el-table-column>
      <el-table-column label="下架时间" min-width="160" align="center">
        <template slot-scope="{row}">
          {{ row.endTime|formatToTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" fixed="right">
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
export default {
  components: { Pagination, headline },

  data() {
    return {
      listQuery: {
        size: 10,
        current: 1,
        type: '',
        typeCode: '3310',
        isTOP: '',
        fromUser: '',
        fromSource: ''
      },
      topicOptions: [],
      isTopOptions: [
        {
          name: '是',
          code: '1'
        },
        {
          name: '否',
          code: '0'
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
    this.getList()
    await map.getTopic()
    this.topicOptions = this.store.session('topicList') || []
  },
  methods: {
    getList() {
      this.listLoading = true
      const params = this.tools.removeEmptyValue(Object.assign({}, this.listQuery))
      this.api.doctorApi.getInfoList(params).then(data => {
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
      this.listQuery.current = 1
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
