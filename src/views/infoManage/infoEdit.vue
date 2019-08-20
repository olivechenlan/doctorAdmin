<template>
  <div class="app-container">
    <headline :list-title="pageTitle" />
    <el-form ref="dataForm" :model="temp" label-width="110px" :rules="rules" class="form-container">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="资讯栏目" prop="type">
            <el-select v-model="temp.type" placeholder="请选择所属栏目">
              <el-option v-for="item in topicOptions" :key="item.type" :label="item.name" :value="item.type" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="temp.status" placeholder="请选择状态">
              <el-option v-for="item in stateOptions" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>

          <el-form-item label="声明" prop="statement">
            <el-select v-model="temp.statement" placeholder="请选择声明">
              <el-option v-for="item in statementOptions" :key="item.id" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
          <el-form-item label="图片" prop="listImg">
            <upload-image :src="temp.listImg" @getChange="getFile($event,'listImg')" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="资讯标题" prop="title">
            <el-input v-model="temp.title" placeholder="请填写资讯标题" />
          </el-form-item>
          <el-form-item label="来源" prop="fromSource">
            <el-input v-model="temp.fromSource" placeholder="请填写文章来源及作者相关信息" />
          </el-form-item>
          <el-form-item label="是否置顶" prop="weight">
            <el-select v-model="temp.weight" placeholder="请选择是否置顶" @change="weightChange">
              <el-option v-for="item in isTopOptions" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item v-show="temp.weight>0" label="置顶开始时间" prop="startTime">
            <el-date-picker v-model="temp.startTime" :picker-options="startTimeOptions" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择上架时间" style="width: 100%" />
          </el-form-item>
          <el-form-item v-show="temp.weight>0" label="置顶结束时间" prop="endTime">
            <el-date-picker v-model="temp.endTime" :disabled="!temp.startTime" :picker-options="endTimeOptions" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择下架时间" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="内容" prop="intoUrl">
        <Tinymce ref="editor" v-model="temp.content" :height="400" @getTemp="getTemp" />
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
import { isTimeValidate } from '@/utils/validate'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: { Tinymce, headline, uploadImage },

  data() {
    const timeRangeValidate = (rule, value, callback) => {
      isTimeValidate(rule, value, callback, this.temp.startTime)
    }
    return {
      imageNum: 9,
      videoNum: 1,
      urlNum: 0,
      imgPrefix: 'service.jktz.gov.cn',
      pageTitle: '',
      stateOptions: map.getBannerStatus,
      isTopOptions: map.getIsTop,
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
        weight: [{ required: true, message: '请选择是否置顶', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters(['topicOptions'])
  },
  watch: {
    'temp.startTime'(val) {
      const today = this.dayjs().startOf('day')
      if (val) {
        const startDate = this.dayjs(val).startOf('day')
        const that = this
        const lastTime =
          startDate.isBefore(today) ? today : startDate
        this.endTimeOptions = {
          disabledDate(time) {
            return that.dayjs(time) < lastTime
          }
        }
      }
    }
  },

  created() {
  },
  async mounted() {
    await this.initData()
  },
  methods: {
    ...mapActions({
      getTopic: 'options/getTopic'
    }),
    async initData() {
      const that = this
      this.getTopic()
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
    async getStatement() {
      await this.api.doctorApi.getDictionary('statement').then(data => {
        if (data.responseFlag === '1') {
          this.statementOptions = data.data
        }
      }).catch(() => {})
    },
    weightChange(val) {
      if (val === 0) {
        this.temp.startTime = ''
        this.temp.endTime = ''
      }
    },
    getTemp(val) {
      this.urlNum = val.urlNum
      this.temp.intoType = val.intoType
    },
    uploadUrl(url) {
      this.tools.$loading()
      return new Promise((resolve, reject) => {
        this.api.uploadApi.uploadUrl({ url }).then(data => {
          if (data.code === '1') {
            resolve(data.data.url)
          } else {
            this.tools.$loading().hide()
            this.$message.error(data.msg)
          }
        }).catch(() => {
          this.tools.$loading().hide()
        })
      })
    },
    async handleContent() {
      const intoUrl = []
      if (this.temp.content.split(' src=').length > 0) {
        const imgArrayTemp = this.temp.content.split(' src=')
        for (const i in imgArrayTemp) {
          if (imgArrayTemp[i].indexOf('http') === 1) {
            const endString = imgArrayTemp[i].substr(0, 1)
            const tempItemArray = imgArrayTemp[i].split(endString)
            if (tempItemArray[1].indexOf(this.imgPrefix) < 0) tempItemArray[1] = await this.uploadUrl(tempItemArray[1])
            intoUrl.push(tempItemArray[1])
            imgArrayTemp[i] = tempItemArray.join(endString)
          }
        }
        this.temp.content = imgArrayTemp.join(' src=')
      }
      this.temp.intoUrl = intoUrl
    },
    infoEdit() {
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
      params.startTime = params.startTime ? this.dayjs(params.startTime).format('YYYY-MM-DDTHH:mm:ss') : ''
      params.endTime = params.endTime ? this.dayjs(params.endTime).format('YYYY-MM-DDTHH:mm:ss') : ''
      this.api.doctorApi[method](params).then(async(data) => {
        this.tools.$loading().hide()
        if (data.responseFlag === '1') {
          this.$router.back()
        } else {
          this.$message.error(data.responseMessage)
        }
      }).catch(() => {
        this.tools.$loading().hide()
      })
    },
    updateData() {
      this.rules.startTime[0].required = this.temp.weight > 0
      this.rules.endTime[0].required = this.temp.weight > 0
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          if (this.temp.intoType === '2' && this.urlNum > this.imageNum) {
            this.$message.error(`您已上传${this.urlNum}张图片,最多只能上传${this.imageNum}张,请重试`)
            return
          }
          if (this.temp.intoType === '1' && this.urlNum > this.videoNum) {
            this.$message.error(`您已上传${this.urlNum}段视频,最多只能上传${this.videoNum}段,请重试`)
            return
          }
          await this.handleContent()
          this.infoEdit()
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
