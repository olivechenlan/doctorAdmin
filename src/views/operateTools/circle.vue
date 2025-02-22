<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="圈子名称">
        <el-input v-model="listQuery.name" placeholder="请填写圈子名称" clearable />
      </el-form-item>
      <el-form-item label="圈子类型">
        <el-select v-model="listQuery.type" placeholder="请选择圈子类型">
          <el-option label="全部" value="" />
          <el-option v-for="item in typeOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <headline list-title="圈子列表" button-name="新增圈子" @handleAction="handleCreate" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      class="table-wrap"
    >
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="圈子名称" prop="name" min-width="140" align="center" />
      <el-table-column label="主图" min-width="120" align="center">
        <template slot-scope="{row}">
          <div class="image-column">
            <img :src="row.iconUrl" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type|formatTo('getCircleType') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关注人数" prop="follows" width="90" align="center" />
      <el-table-column label="简介" prop="groupInfo" min-width="150" align="center" />
      <el-table-column label="创建人" prop="fromName" width="120" align="center" />
      <el-table-column label="创建时间" width="160" align="center">
        <template slot-scope="{row}">
          {{ row.createTime|formatToTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.type==='3'" type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :limit.sync="listQuery.size" :page.sync="listQuery.current" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800px" top="3%" custom-class="form-container">
      <el-form ref="dataForm" :model="temp" label-width="80px" :rules="rules">
        <el-row type="flex" justify="space-between" class="row-bg">
          <el-col :span="11">
            <el-form-item label="圈子主图" prop="iconUrl">
              <upload-image :src="temp.iconUrl" @getChange="getFile($event,'iconUrl')" />
            </el-form-item>
            <el-form-item label="圈子名称" prop="name">
              <el-input v-model="temp.name" placeholder="请填写圈子名称" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="圈子类别" prop="type">
              <el-select v-model="temp.type" placeholder="请选择圈子类别">
                <el-option v-for="item in typeOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item v-show="temp.type==='2'" label="所属医院" prop="fromId">
              <el-select v-model="temp.fromId" placeholder="请选择所属医院">
                <el-option v-for="item in hospitalOptions" :key="item.hospitalId" :label="item.hospitalName" :value="item.hospitalId" />
              </el-select>
            </el-form-item>
            <el-form-item label="简介" prop="groupInfo">
              <el-input v-model="temp.groupInfo" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="" />
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
import map from '@/utils/map'
import uploadImage from '@/components/uploadFile/uploadImage'
import handleTemp from '@/mixin/handleTemp'
export default {
  filters: {},
  components: {
    headline, uploadImage, Pagination
  },
  mixins: [handleTemp],
  data() {
    return {
      listQuery: {
        name: '',
        type: '',
        current: 1,
        size: 10
      },
      typeOptions: map.getCircleType,
      hospitalOptions: [],
      textMap: {
        update: '编辑圈子',
        create: '新增圈子'
      },
      temp: {
        groupId: '',
        name: '',
        type: '',
        fromId: '',
        iconUrl: '',
        groupInfo: ''
      },
      rules: {
        name: [{ required: true, message: '请输入圈子名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择圈子类型', trigger: 'change' }],
        fromId: [{ required: true, message: '请选择所属医院', trigger: 'change' }]
      }
    }
  },
  watch: {
    'dialogFormVisible'(vnew, vold) {
      if (vnew) {
        this.getNotAddedHospital()
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
      const params = this.tools.removeEmptyValue(Object.assign({}, this.listQuery))
      this.api.doctorApi.getCircleList(params).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          this.list = data.data.records
          this.total = data.data.total
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = this.$options.data().temp
      this.rules.fromId[0].required = true
      !!this.$refs.dataForm && this.$refs.dataForm.resetFields()
    },
    getNotAddedHospital() {
      this.hospitalOptions = []
      if (this.dialogStatus === 'update') {
        this.hospitalOptions.push({
          hospitalId: this.temp.fromId,
          hospitalName: this.temp.fromName
        })
      }
      this.api.doctorApi.getNotAddedHospital({}).then(data => {
        if (data.responseFlag === '1') {
          data.data.forEach(item => {
            this.hospitalOptions.push({
              hospitalId: item.hospitalId,
              hospitalName: item.hospitalName
            })
          })
        }
      }).catch(() => {})
    },
    handleDelete(row) {
      this.$confirm('确定删除该圈子?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$loading().show()
        this.api.doctorApi.circleDelete(row.groupId).then(data => {
          this.$loading().hide()
          if (data.responseFlag === '1') {
            this.$message.success('删除成功!')
            this.getList()
          } else {
            this.$message.error(data.responseMessage)
          }
        }).catch(() => {
          this.$loading().hide()
        })
      }).catch(() => {
      })
    },
    circleEdit() {
      this.$loading().show()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      if (this.dialogStatus === 'create') { delete params['groupId'] }
      this.api.doctorApi.circleEdit(params).then(data => {
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
      if (this.dialogStatus === 'create' && this.temp.type === '1') {
        const ifCityExist = !!(this.list.find(item => item.fromId === '3310'))
        if (ifCityExist) {
          this.$message.error('市级圈子无法重复创建！')
          return
        }
        this.temp.fromId = '3310'
      }
      this.rules.fromId[0].required = this.temp.type === '2'
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
