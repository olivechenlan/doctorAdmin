<template>
  <div class="app-container">
    <headline list-title="标签列表" button-name="新增标签" @handleAction="handleCreate" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      class="table-wrap"
    >
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column label="标签" prop="label" min-width="150" align="center" />
      <el-table-column label="描述" prop="remarks" min-width="200" align="center" />
      <el-table-column label="操作" width="148" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px" top="3%" custom-class="form-container">
      <el-form ref="dataForm" :model="temp" label-width="80px" :rules="rules">
        <el-row class="row-bg">
          <el-col :span="24">
            <el-form-item label="标签名称" prop="label">
              <el-input v-model="temp.label" placeholder="请填写标签名称" />
            </el-form-item>
            <el-form-item label="排序" prop="wegith">
              <el-input v-model="temp.wegith" type="number" placeholder="请填写排序" @mousewheel.native.prevent />
            </el-form-item>
            <el-form-item label="标签描述" prop="remarks">
              <el-input v-model="temp.remarks" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="" />
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
export default {
  components: {
    headline
  },
  mixins: [handleTemp],
  data() {
    return {
      typeOptions: map.getCircleType,
      hospitalOptions: [],
      textMap: {
        update: '编辑标签',
        create: '新增标签'
      },
      temp: {
        id: '',
        label: '',
        wegith: '',
        remarks: ''
      },
      rules: {
        label: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
        wegith: [{ validator: weightValidate, trigger: 'blur' }]
      }
    }
  },
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.api.doctorApi.getTag({}).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          this.list = data.data
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    tagEdit() {
      this.$loading().show()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      if (!params.wegith) params.wegith = '0'
      let method = ''
      if (this.dialogStatus === 'update') method = 'tagEdit'
      if (this.dialogStatus === 'create') {
        method = 'tagAdd'
        delete params['id']
      }
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
        if (valid) this.tagEdit()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
