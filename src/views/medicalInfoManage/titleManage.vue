<template>
  <div class="app-container">
    <el-form :inline="true" label-width="100px">
      <el-form-item label="职称名称">
        <el-input v-model="listQuery.name" placeholder="请填写职称名称" clearable />
      </el-form-item>
      <el-form-item label="职称状态">
        <el-select v-model="listQuery.useState" placeholder="请选择职称状态">
          <el-option label="全部" value="" />
          <el-option v-for="item in titleStateOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="职称类别">
        <el-select v-model="listQuery.type" placeholder="请选择职称类别">
          <el-option label="全部" value="" />
          <el-option v-for="item in titleTypeOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="允许开通问诊">
        <el-select v-model="listQuery.inquiry" placeholder="请选择是否允许开通问诊">
          <el-option label="全部" value="" />
          <el-option v-for="item in inquiryOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <headline list-title="职称列表" button-name="新增职称" @handleAction="handleCreate" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      row-key="id"
      class="table-wrap"
    >
      <el-table-column label="职称名称" prop="name" min-width="150" />
      <el-table-column label="职称类别" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type|formatTo('getTitleType') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职称状态" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.useState|formatTo('getTitleState') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="问诊科室" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.inquiry|formatTo('getInquiry') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800px" top="3%" custom-class="form-container">
      <el-form ref="dataForm" :model="temp" label-width="80px" :rules="rules">
        <el-row type="flex" justify="space-between" class="row-bg">
          <el-col :span="11">
            <el-form-item label="职称类别" prop="type">
              <el-select v-model="temp.type" placeholder="请选择科室类别">
                <el-option v-for="item in titleTypeOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item v-show="temp.type==='1'" label="父级职称" prop="parZc">
              <el-select v-model="temp.parZc" placeholder="请选择一级职称">
                <el-option v-for="item in titleOptions" :key="item.id" :disabled="item.id===temp.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="职称名称" prop="name">
              <el-input v-model="temp.name" placeholder="请填写科室名称" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="职称状态" prop="useState" label-width="110px">
              <el-select v-model="temp.useState" placeholder="请选择科室状态">
                <el-option v-for="item in titleStateOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="orderNo" label-width="110px">
              <el-input v-model="temp.orderNo" type="number" placeholder="请填写排序" @mousewheel.native.prevent />
            </el-form-item>
            <el-form-item v-show="temp.type==='1'" label="允许开通问诊" prop="inquiry" label-width="110px">
              <el-select v-model="temp.inquiry" placeholder="请选择是否允许开通问诊">
                <el-option v-for="item in inquiryOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
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
import map from '@/utils/map'
import { weightValidate } from '@/utils/validate'
import handleTemp from '@/mixin/handleTemp'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: { headline },
  mixins: [handleTemp],
  data() {
    return {
      listQuery: {
        name: '',
        useState: '',
        type: '',
        inquiry: ''
      },
      list: [
        {
          id: ''
        }
      ],
      titleStateOptions: map.getTitleState,
      titleTypeOptions: map.getTitleType,
      inquiryOptions: map.getInquiry,
      textMap: {
        update: '编辑职称',
        create: '新增职称'
      },
      temp: {
        type: '',
        name: '',
        parZc: '',
        id: '',
        useState: '',
        orderNo: '',
        inquiry: ''
      },
      rules: {
        type: [{ required: true, message: '请选择职称类别', trigger: 'change' }],
        name: [{ required: true, message: '请输入职称名称', trigger: 'blur' }],
        parZc: [{ required: true, message: '请选择父级职称', trigger: 'change' }],
        useState: [{ required: true, message: '请选择职称状态', trigger: 'change' }],
        orderNo: [{ validator: weightValidate, trigger: 'blur' }],
        inquiry: [{ required: true, message: '请选择是否允许开通问诊', trigger: 'change' }]
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
      getTitle: 'options/getTitle',
      updateTitle: 'options/updateTitle'
    }),
    getList(ifUpdate) {
      this.listLoading = true
      const params = this.tools.removeEmptyValue(Object.assign({}, this.listQuery))
      this.api.doctorApi.getTitleList(params).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          data.data.forEach(item => {
            item.parZc = item.parZc === '0' && ''
            item.children = item.subZcList
          })
          this.list = data.data
          if (ifUpdate) this.updateTitle(data.data)
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    titleEdit() {
      this.$loading().show()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      if (params.type === '0') {
        delete params['parZc']
        delete params['inquiry']
      }
      if (!params.orderNo) { params.orderNo = 0 }
      this.api.doctorApi.titleEdit(params).then(async(data) => {
        this.$loading().hide()
        if (data.responseFlag === '1') {
          this.dialogFormVisible = false
          this.$message.success('操作成功')
          this.getList(true)
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
          this.titleEdit()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
