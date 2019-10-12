<template>
  <div class="app-container">
    <el-form :inline="true" label-width="100px">
      <el-form-item label="标题关键字">
        <el-input v-model="listQuery.title" placeholder="请填写标题关键字" clearable />
      </el-form-item>
      <el-form-item label="职称">
        <el-cascader :props="titleProps" placeholder="请填写职称" :options="titleOptions" clearable @change="cascaderChange" />
      </el-form-item>
      <el-form-item label="医院">
        <el-input v-model="listQuery.hospitalName" placeholder="请填写医院名称" clearable />
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="listQuery.checkState" placeholder="请选择审核状态">
          <el-option label="全部" value="" />
          <el-option v-for="item in checkStateOption" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布人">
        <el-input v-model="listQuery.name" placeholder="请填写发布人" clearable />
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="listQuery.phone" type="tel" placeholder="请填写手机号码" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
    </el-form>

    <headline list-title="病例列表" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      class="table-wrap"
    >
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="标题" prop="title" min-width="160" align="center" />
      <el-table-column label="发布人" prop="name" min-width="100" align="center" />
      <el-table-column label="职称" prop="zc" min-width="100" align="center" />
      <el-table-column label="手机号码" prop="phone" min-width="120" align="center">
        <template slot-scope="{row}">
          {{ row.phone|numDesensitization(3,4) }}
        </template>
      </el-table-column>
      <el-table-column label="所属医院" prop="hospitalName" min-width="130" align="center" />
      <el-table-column label="审核状态" min-width="95" align="center">
        <template slot-scope="{row}">
          {{ row.checkState|formatTo('getSkillCheckState') }}
        </template>
      </el-table-column>
      <el-table-column label="点击量" prop="views" min-width="70" align="center" />
      <el-table-column label="审核人" prop="checkName" min-width="100" align="center" />
      <el-table-column label="创建时间" min-width="160" align="center">
        <template slot-scope="{row}">
          {{ row.createTime|formatToTime }}
        </template>
      </el-table-column>
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
import handleTemp from '@/mixin/handleTemp'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: { headline, Pagination },
  mixins: [handleTemp],
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
      }
    }
  },
  computed: {
    ...mapGetters(['titleOptions'])
  },
  created() {
  },
  mounted() {
    this.getList()
    this.getTitle()
  },
  methods: {
    ...mapActions({
      getTitle: 'options/getTitle'
    }),
    getList() {
      this.listLoading = true
      const params = this.tools.removeEmptyValue(Object.assign({}, this.listQuery))
      this.api.doctorApi.getDoctorSkillList(params).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          this.list = data.data.records
          this.total = data.data.total
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    cascaderChange(val) {
      this.listQuery.zcId = val[val.length - 1]
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
