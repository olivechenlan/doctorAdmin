<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="栏目关键字">
        <el-input v-model="listQuery.name" placeholder="请填写栏目关键字" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <headline list-title="栏目列表" button-name="新增栏目" @handleAction="handleCreate" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      class="table-wrap"
    >
      <el-table-column label="序号" type="index" width="90" align="center" />
      <el-table-column label="栏目名称" prop="name" min-width="200" align="center" />
      <el-table-column label="排序" prop="weight" min-width="100" align="center" />
      <el-table-column label="文章数" prop="textCount" width="120" align="center" />
      <el-table-column label="备注" prop="remarks" min-width="200" align="center" />
      <el-table-column label="操作" width="147" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.textCount<1" type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="form-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="80px">
        <el-form-item label="栏目名称" prop="name">
          <el-input v-model="temp.name" placeholder="请填写栏目名称" />
        </el-form-item>
        <el-form-item label="排序" prop="weight">
          <el-input v-model="temp.weight" placeholder="请填写序号" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button plain @click="dialogFormVisible = false">
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
import handleTemp from '@/mixin/handleTemp'
import { mapActions } from 'vuex'
export default {
  components: { headline },
  mixins: [handleTemp],
  data() {
    const nameValidate = (rule, value, callback) => {
      if (!value) callback(new Error('请填写栏目名称'))
      if (value) {
        if (value.length > 5) {
          callback(new Error('栏目名称只允许最多5个字，请重试'))
        } else {
          callback()
        }
      }
    }
    return {
      listQuery: {
        name: '',
        code: '3310'
      },
      textMap: {
        update: '编辑栏目',
        create: '新增栏目'
      },
      temp: {
        type: '',
        name: '',
        typeLevel: '1',
        code: '3310',
        weight: ''
      },
      rules: {
        name: [{ required: true, validator: nameValidate, trigger: 'blur' }]
      }
    }
  },
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    ...mapActions({
      updateTopic: 'options/updateTopic'
    }),
    getList(ifUpdate) {
      this.listLoading = true
      const params = this.tools.removeEmptyValue(Object.assign({}, this.listQuery))
      this.api.doctorApi.getTopicList(params).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          this.list = data.data
          if (ifUpdate) this.updateTopic(data.data)
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    topicDelete(row) {
      this.tools.$loading()
      this.api.doctorApi.topicDelete({
        type: row.type,
        code: row.code
      }).then(async data => {
        this.tools.$loading().hide()
        if (data.responseFlag === '1') {
          this.$message.success('删除成功!')
          this.getList(true)
        } else {
          this.$message.error(data.responseMessage)
        }
      }).catch(() => {
        this.tools.$loading().hide()
      })
    },
    handleDelete(row) {
      this.$confirm('确定删除该栏目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.topicDelete(row)
      }).catch(() => {
      })
    },
    circleEdit() {
      this.tools.$loading()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      if (!params.weight) { params.weight = 0 }
      let method = ''
      if (this.dialogStatus === 'update') method = 'topicEdit'
      if (this.dialogStatus === 'create') {
        method = 'topicAdd'
        delete params['type']
      }
      this.api.doctorApi[method](params).then(async data => {
        this.tools.$loading().hide()
        if (data.responseFlag === '1') {
          this.dialogFormVisible = false
          this.$message.success('操作成功')
          this.getList(true)
        } else {
          this.$message.error(data.responseMessage)
        }
      }).catch(() => {
        this.tools.$loading().hide()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.circleEdit()
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
