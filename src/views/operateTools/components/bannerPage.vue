<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="标题">
        <el-input v-model="listQuery.title" placeholder="请填写标题" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listQuery['adStatus']" placeholder="请选择状态">
          <el-option label="全部" value="" />
          <el-option v-for="(item,index) in stateOptions" :key="index" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </el-form-item>
    </el-form>
    <headline list-title="轮播图列表" button-name="新增轮播图" @handleAction="handleCreate" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="图片" min-width="100" align="center">
        <template slot-scope="{row}">
          <div class="image-column">
            <img :src="row.adImgUrl" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" min-width="120" align="center" />
      <el-table-column label="链接地址" prop="adLink" min-width="150" align="center" />
      <el-table-column label="是否启用" min-width="80" align="center">
        <template slot-scope="{row}">
          {{ row.adStatus|formatTo('getBannerStatus') }}
        </template>
      </el-table-column>
      <el-table-column label="是否上架" min-width="80" align="center">
        <template slot-scope="{row}">
          {{ row|formatToState }}
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="remarks" min-width="140" align="center" />
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
      <el-table-column label="操作" align="center" width="90" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1000px" top="3%" custom-class="form-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="80px">
        <el-row type="flex" justify="space-between" class="row-bg" :gutter="20">
          <el-col :span="11">
            <el-form-item label="标题" prop="title">
              <el-input v-model="temp.title" placeholder="请填写标题" />
            </el-form-item>
            <el-form-item label="上架时间" prop="startTime">
              <el-date-picker v-model="temp.startTime" :picker-options="startTimeOptions" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择上架时间" style="width: 100%" />
            </el-form-item>
            <el-form-item label="状态" prop="adStatus">
              <el-select v-model="temp.adStatus" placeholder="请选择状态">
                <el-option v-for="item in stateOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="链接地址" prop="adLink">
              <el-input v-model="temp.adLink" placeholder="请填写链接地址" />
            </el-form-item>
            <el-form-item label="下架时间" prop="endTime">
              <el-date-picker v-model="temp.endTime" :disabled="!temp.startTime" :picker-options="endTimeOptions" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择下架时间" style="width: 100%" />
            </el-form-item>

            <el-form-item label="排序" prop="adWeight">
              <el-input v-model="temp.adWeight" type="number" placeholder="请填写排序" @mousewheel.native.prevent />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="图片" prop="adImgUrl">
          <upload-image :src="temp.adImgUrl" @getChange="getImage" />
        </el-form-item>
        <el-form-item label="描述" prop="remarks">
          <el-input v-model="temp.remarks" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="" />
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
import uploadImage from '@/components/uploadFile/uploadImage'
import map from '@/utils/map'
import { isTimeValidate, weightValidate } from '@/utils/validate'
export default {
  components: { uploadImage, headline },
  filters: {
    formatToState(row) {
      const vm = window.$vue
      const startTime = vm.dayjs(row.startTime)
      const endTime = vm.dayjs(row.endTime)
      const nowTime = vm.dayjs()
      let isTimesValid = ''
      if (startTime.isValid() && endTime.isValid()) {
        isTimesValid = row.adStatus === '1' && nowTime.isAfter(startTime) && nowTime.isBefore(endTime)
      } else {
        isTimesValid = false
      }
      return isTimesValid ? '上架' : '下架'
    }
  },
  props: {
    adType: {
      type: String,
      default: ''
    }
  },
  data() {
    const timeRangeValidate = (rule, value, callback) => {
      isTimeValidate(rule, value, callback, this.temp.startTime)
    }
    return {
      listQuery: {
        adStatus: '',
        adType: '',
        title: ''
      },
      stateOptions: map.getBannerStatus,
      textMap: {
        update: '编辑轮播图',
        create: '新增轮播图'
      },

      list: null,
      total: 0,
      listLoading: true,
      temp: {
        rotationChartId: '',
        title: '',
        adImgUrl: '',
        isAdvert: '0',
        adLink: '',
        adWeight: '',
        adType: '',
        adStatus: '',
        startTime: '',
        endTime: '',
        remarks: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        startTime: [{ required: true, message: '请选择上架时间', trigger: 'change' }],
        endTime: [{ required: true, validator: timeRangeValidate, trigger: 'change' }],
        adStatus: [{ required: true, message: '请选择状态', trigger: 'change' }],
        adImgUrl: [{ required: true, message: '请上传图片', trigger: 'change' }],
        adWeight: [{ validator: weightValidate, trigger: 'blur' }]
      },
      startTimeOptions: {},
      endTimeOptions: {}
    }
  },
  watch: {
    'temp.startTime'(nval, oval) {
      const that = this
      const lastTime =
        this.dayjs(nval).isBefore(this.dayjs())
          ? this.dayjs().subtract(1, 'day')
          : this.dayjs(nval).subtract(1, 'day')
      this.endTimeOptions = {
        disabledDate(time) {
          return that.dayjs(time) < lastTime
        }
      }
    }
  },
  created() {
  },
  mounted() {
    const that = this
    this.listQuery.adType = this.adType
    this.getList()
    this.startTimeOptions = {
      disabledDate(time) {
        return that.dayjs(time) < that.dayjs().subtract(1, 'day')
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      const params = this.tools.removeEmptyValue(Object.assign({}, this.listQuery))
      this.api.doctorApi.getBannerList(params).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          this.list = data.data
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    getImage(image) {
      this.temp.adImgUrl = image
      this.$refs.dataForm.validateField('adImgUrl')
    },
    handleFilter() {
      this.getList()
    },
    resetTemp() {
      this.temp = this.$options.data().temp
      !!this.$refs.dataForm && this.$refs.dataForm.resetFields()
    },
    handleCreate() {
      this.resetTemp()
      this.temp.startTime = this.dayjs().format('YYYY-MM-DD HH:mm:ss')
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.resetTemp()
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    bannerEdit() {
      this.tools.$loading()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      params.startTime = this.dayjs(params.startTime).format('YYYY-MM-DDTHH:mm:ss')
      params.endTime = this.dayjs(params.endTime).format('YYYY-MM-DDTHH:mm:ss')
      if (!params.adWeight) params.adWeight = 0
      let method = ''
      if (this.dialogStatus === 'create') {
        method = 'bannerAdd'
        params.adType = this.adType
        delete params['rotationChartId']
      }
      if (this.dialogStatus === 'update') method = 'bannerEdit'
      this.api.doctorApi[method](params).then(data => {
        this.tools.$loading().hide()
        if (data.responseFlag === '1') {
          this.dialogFormVisible = false
          this.$message.success('操作成功')
          this.getList()
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
          this.bannerEdit()
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
</style>
