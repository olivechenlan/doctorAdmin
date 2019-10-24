<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="指南名称">
        <el-input v-model="listQuery.guideName" placeholder="请填写指南名称" />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="listQuery.majorType" placeholder="请选择分类" @change="changeType($event,'listQuery')">
          <el-option label="全部" value="" />
          <el-option v-for="item in typeOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="专业">
        <el-select v-model="listQuery.guideMajorId" :disabled="!listQuery.majorType" placeholder="请选择专业">
          <el-option label="全部" value="" />
          <el-option v-for="item in majorOptions.listQuery" :key="item.uuid" :label="item.majorName" :value="item.uuid" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <headline list-title="指南列表" button-name="新增指南" @handleAction="handleCreate" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      class="table-wrap"
    >
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column label="标题名称" prop="guideName" min-width="160" align="center" />
      <el-table-column label="所属专业" prop="majorName" min-width="150" align="center" />
      <el-table-column label="分类" min-width="120" align="center">
        <template slot-scope="{row}">
          {{ row.majorType|formatTo('getGuideType') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" @click="handlePreview(row)">
            预览
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :limit.sync="listQuery.size" :page.sync="listQuery.current" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800px" top="3%" custom-class="form-container">
      <el-form ref="dataForm" :model="temp" label-width="80px" :rules="rules">
        <el-row type="flex" justify="space-between" class="row-bg">
          <el-col :span="11">
            <el-form-item label="指南名称" prop="guideName">
              <el-input v-model="temp.guideName" placeholder="请填写症状名称" />
            </el-form-item>
            <el-form-item label="所属专业" prop="guideMajorId">
              <el-select v-model="temp.guideMajorId" :disabled="!temp.majorType" placeholder="请选择所属专业">
                <el-option v-for="item in majorOptions.temp" :key="item.uuid" :label="item.majorName" :value="item.uuid" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="分类" prop="majorType">
              <el-select v-model="temp.majorType" placeholder="请选择分类" @change="changeType($event,'temp')">
                <el-option v-for="item in typeOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="上传附件" prop="fileUrl">
          <uploadPdf :src="temp.fileUrl" @getChange="getFile($event,'fileUrl')" />
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
import Pagination from '@/components/Pagination'
import map from '@/utils/map'
import uploadPdf from '@/components/uploadFile/uploadPdf'
import handleTemp from '@/mixin/handleTemp'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    headline, uploadPdf, Pagination
  },
  mixins: [handleTemp],
  data() {
    return {
      listQuery: {
        current: 1,
        size: 10,
        guideName: '',
        majorType: '',
        guideMajorId: ''
      },
      typeOptions: map.getGuideType,
      textMap: {
        update: '编辑指南',
        create: '新增指南'
      },
      temp: {
        guideId: '',
        guideName: '',
        guideMajorId: '',
        majorType: '',
        fileUrl: ''
      },
      rules: {
        guideName: [{ required: true, message: '请输入指南名称', trigger: 'blur' }],
        guideMajorId: [{ required: true, message: '请选择所属专业', trigger: 'change' }],
        majorType: [{ required: true, message: '请选择分类', trigger: 'change' }],
        fileUrl: [{ required: true, message: '请上传附件', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters(['guideMajorOptions']),
    majorOptions() {
      const guideMajor = this.guideMajorOptions
      const options = {}
      if (this.temp.majorType) options.temp = guideMajor[this.temp.majorType - 1]
      if (this.listQuery.majorType) options.listQuery = guideMajor[this.listQuery.majorType - 1]
      return options
    }
  },
  watch: {
  },
  created() {},
  mounted() {
    this.getList()
    this.getGuideMajor()
  },
  methods: {
    ...mapActions({
      getGuideMajor: 'options/getGuideMajor'
    }),
    getList() {
      this.listLoading = true
      const params = this.tools.removeEmptyValue(Object.assign({}, this.listQuery))
      this.api.doctorApi.getGuideList(params).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          this.list = data.data.records
          this.total = data.data.total
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    changeType(e, param) {
      this.$set(this[param], 'guideMajorId', '')
      this[param]['majorType'] = e
    },
    handlePreview(row) {
      if (!row.fileUrl) {
        this.$message.error('请先上传PDF形式的附件')
        return
      }
      window.open(row.fileUrl, '_blank')
    },
    pathwayEdit() {
      this.$loading().show()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      delete params['majorType']
      let method = ''
      if (this.dialogStatus === 'create') {
        method = 'guideAdd'
        delete params['guideId']
      }
      if (this.dialogStatus === 'update') { method = 'guideEdit' }
      this.api.doctorApi[method](params).then(data => {
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
          this.pathwayEdit()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
