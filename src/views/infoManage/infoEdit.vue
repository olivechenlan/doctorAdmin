<template>
  <div class="app-container">
    <headline :list-title="pageTitle" />
    <el-form ref="dataForm" :model="temp" label-width="80px" :rules="rules" class="form-container">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="资讯栏目" prop="type">
            <el-select v-model="temp.type" placeholder="请选择所属栏目">
              <el-option v-for="item in topicOptions" :key="item.type" :label="item.name" :value="item.type" />
            </el-select>
          </el-form-item>
          <el-form-item label="外部链接" prop="adLink">
            <el-input v-model="temp.adLink" placeholder="请填写外部链接" />
          </el-form-item>
          <el-form-item label="上架时间" prop="startTime">
            <el-date-picker v-model="temp.startTime" :picker-options="startTimeOptions" clearable type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择上架时间" style="width: 100%" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="temp.status" placeholder="请选择状态">
              <el-option v-for="item in stateOptions" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="图片" prop="listImg">
            <upload-image :src="temp.listImg" @getChange="getImage" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="资讯标题" prop="title">
            <el-input v-model="temp.title" placeholder="请填写资讯标题" />
          </el-form-item>
          <el-form-item label="来源" prop="fromSource">
            <el-input v-model="temp.fromSource" placeholder="请填写文章来源及作者相关信息" />
          </el-form-item>
          <el-form-item label="下架时间" prop="endTime">
            <el-date-picker v-model="temp.endTime" :disabled="!temp.startTime" :picker-options="endTimeOptions" clearable type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择下架时间" style="width: 100%" />
          </el-form-item>
          <el-form-item label="排序" prop="weight">
            <el-input v-model="temp.weight" type="number" placeholder="请填写排序" />
          </el-form-item>
          <el-form-item label="声明" prop="statement">
            <el-select v-model="temp.statement" placeholder="请选择声明">
              <el-option v-for="item in statementOptions" :key="item.id" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="内容" prop="intoUrl">
        <Tinymce ref="editor" v-model="temp.content" :temp="temp" :height="400" @getTemp="getTemp" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="updateData">
        提交
      </el-button>
      <el-button plain @click="$router.back()">
        返回
      </el-button>
    </div>
  </div>
</template>

<script>
import headline from '@/components/headline'
import uploadImage from '@/components/uploadFile/uploadImage'
import Tinymce from '@/components/Tinymce'
import map from '@/utils/map'
import { isTimeValidate, weightValidate } from '@/utils/validate'
export default {
  components: { Tinymce, headline, uploadImage },

  data() {
    const timeRangeValidate = (rule, value, callback) => {
      isTimeValidate(rule, value, callback, this.temp.startTime)
    }
    return {
      pageTitle: '',
      topicOptions: [],
      stateOptions: map.getBannerStatus,
      temp: {
        headInfoId: '',
        title: '',
        content: '',
        listImg: '',
        fromUser: '',
        fromSource: '',
        fileUrl: '',
        type: '',
        intoType: '',
        intoUrl: [],
        typeCode: '3310',
        status: '',
        startTime: '',
        endTime: '',
        statement: '',
        weight: ''
      },
      startTimeOptions: {},
      endTimeOptions: {},
      statementOptions: [],
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        type: [{ required: true, message: '请选择资讯栏目', trigger: 'change' }],
        startTime: [{ required: true, message: '请选择上架时间', trigger: 'change' }],
        endTime: [{ required: true, validator: timeRangeValidate, trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        weight: [{ validator: weightValidate, trigger: 'blur' }]
      }
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
  async mounted() {
    const that = this
    this.topicOptions = this.store.session('topicList') || []
    await this.getStatement()
    this.temp = this.store.session('info') || this.$options.data().temp
    this.temp.intoUrl = this.tools.isEmptyObject(this.temp.intoUrl) ? [] : this.temp.intoUrl.split(',')
    !!this.$refs.dataForm && this.$refs.dataForm.resetFields()
    this.startTimeOptions = {
      disabledDate(time) {
        return that.dayjs(time) < that.dayjs().subtract(1, 'day')
      }
    }
    this.pageTitle = this.tools.isEmptyObject(this.temp.headInfoId) ? '新增资讯' : '编辑资讯'
  },
  methods: {
    async getStatement() {
      await this.api.doctorApi.getDictionary('statement').then(data => {
        if (data.responseFlag === '1') {
          this.statementOptions = data.data
        }
      }).catch(() => {})
    },
    getTemp(value) {
      this.temp = value
    },
    getImage(image) {
      this.temp.listImg = image
    },
    infoEdit() {
      this.tools.$loading()
      const params = this.tools.saveValueFromObject(this.temp, this.$options.data().temp)
      let method = ''
      if (this.tools.isEmptyObject(this.temp.headInfoId)) {
        method = 'infoAdd'
        delete params['headInfoId']
        delete params['fromUser']
      } else {
        method = 'infoEdit'
      }
      params.intoUrl = params.intoUrl.join(',')
      params.startTime = this.dayjs(params.startTime).format('YYYY-MM-DDTHH:mm:ss')
      params.endTime = this.dayjs(params.endTime).format('YYYY-MM-DDTHH:mm:ss')
      if (!params.weight) { params.weight = 0 }
      this.api.doctorApi[method](params).then(async(data) => {
        this.tools.$loading().hide()
        if (data.responseFlag === '1') {
          this.$router.back()
        } else {
          this.$message.warning(data.responseMessage)
        }
      }).catch(() => {
        this.tools.$loading().hide()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.infoEdit()
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
