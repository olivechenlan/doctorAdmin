<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col>
          <el-input v-model="listQuery.title" placeholder="请填写标题关键字" clearable class="filter-item filter-item-option" />
          <el-select v-model="listQuery.type" placeholder="请选择栏目" clearable class="filter-item filter-item-option">
            <el-option v-for="item in topicOptions" :key="item.type" :label="item.name" :value="item.type" />
          </el-select>
          <el-select v-model="listQuery.adStatus" placeholder="请选择状态" clearable class="filter-item filter-item-option">
            <el-option v-for="item in stateOptions" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-select v-model="listQuery.isTOP" placeholder="请选择是否置顶" clearable class="filter-item filter-item-option">
            <el-option v-for="item in isTopOptions" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
          <el-input v-model="listQuery.fromUser" placeholder="请填写创建人关键字" clearable class="filter-item filter-item-option" />
          <el-input v-model="listQuery.fromSource" placeholder="请填写来源关键字" clearable class="filter-item filter-item-option" />
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </el-col>
      </el-row>
    </div>
    <headline list-title="资讯列表" button-name="新增资讯" @handleAction="handleCreate" />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" type="index" width="100" align="center" />
      <el-table-column label="标题" prop="title" min-width="160" align="center" />
      <el-table-column label="缩略图" width="160" align="center">
        <template slot-scope="{row}">
          <div class="image-column">
            <img :src="row.listImg" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="栏目" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" prop="fromSource" width="150" align="center" />
      <el-table-column label="点击量" prop="author" width="100" align="center" />
      <el-table-column label="收藏数" prop="author" width="100" align="center" />
      <el-table-column label="发布时间" prop="startTime" width="160" align="center" />
      <el-table-column label="下架时间" prop="endTime" width="160" align="center" />
      <el-table-column label="创建人" prop="fromUser" width="100" align="center" />
      <el-table-column label="是否置顶" prop="isTop" width="100" align="center" />
      <el-table-column label="操作" align="center" width="100" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :limit.sync="listQuery.size" :page.sync="listQuery.current" @pagination="getList" />

    <el-dialog fullscreen :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="dialog-container">
      <el-form ref="dataForm" :model="temp" label-width="80px" :rules="rules">
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
              <el-date-picker v-model="temp.startTime" :picker-options="startTimeOptions" clearable type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择上架时间" style="width: 100%" @change="startTimeChange" />
            </el-form-item>
            <el-form-item label="状态" prop="adStatus">
              <el-select v-model="temp.adStatus" placeholder="请选择状态">
                <el-option v-for="item in stateOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item label="图片" prop="listImg">
              <upload-image :file-list="temp.fileList" @imageChange="getImage" />
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
                <el-option v-for="item in statement" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="内容">
          <Tinymce ref="editor" v-model="temp.content" :height="400" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer text-left">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
        <el-button plain @click="dialogFormVisible = false">
          返回
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import headline from '@/components/headline'
import uploadImage from '@/components/handleImage/upload'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
import map from '@/utils/map'
export default {
  components: { Pagination, Tinymce, headline, uploadImage },

  data() {
    const timeRangeValidate = (rule, value, callback) => {
      if (!value) callback('请选择下架时间')
      if (value) {
        if (value <= this.temp.startTime) {
          callback(new Error('下架时间必须大于上架时间'))
        } else {
          callback()
        }
      }
    }
    return {
      listQuery: {
        size: 15,
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
          name: '否',
          code: '0'
        }, {
          name: '是',
          code: '1'
        }
      ],
      stateOptions: map.getBannerStatus,
      list: null,
      total: 0,
      listLoading: true,
      textMap: {
        update: '编辑资讯',
        create: '新增资讯'
      },
      temp: {
        id: undefined,
        importance: 1,
        remarks: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      isPublish: 1,
      isHotTopic: 1,
      isRecommend: 1,
      startTimeOptions: {},
      endTimeOptions: {},
      statement: '',
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        type: [{ required: true, message: '请选择资讯栏目', trigger: 'change' }],
        startTime: [{ required: true, message: '请选择上架时间', trigger: 'change' }],
        endTime: [{ required: true, validator: timeRangeValidate, trigger: 'change' }],
        adStatus: [{ required: true, message: '请选择状态', trigger: 'change' }]
      }
    }
  },
  async created() {
    this.getList()
    await map.getTopic()
    this.topicOptions = this.store.session('topicList')
    this.statement = [{
      name: '该文章来源于网络,如侵权,我们将立即进行删除处理',
      id: '0'
    }, {
      name: '本文为原创内容，未经禾医助授权禁止转载',
      id: '1'
    }, {
      name: '本文发布已获授权，如需转载请联系首发平台',
      id: '2'
    }, {
      name: '其他',
      id: '3'
    }]
  },
  mounted() {
    const that = this
    this.startTimeOptions = {
      disabledDate(time) {
        return that.dayjs(time) < that.dayjs().subtract(1, 'day')
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      this.api.doctorApi.getInfoList(this.tools.removeEmptyValue(this.listQuery)).then(data => {
        this.listLoading = false
        if (data.responseFlag === '1') {
          this.list = data.data.records
          this.list.forEach(item => {
            item.fileList = item.listImg ? [{ name: '', url: item.listImg }] : []
            item.typeName = this.topicOptions.find(it => it.type === item.type).name
            item.createTime = item.createTime ? this.dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') : ''
            item.isTop = item.weight > 0 ? '是' : '否'
          })
          this.total = data.data.total
        }
      }).catch(err => {
        this.listLoading = false
      })
    },
    startTimeChange(value) {
      const that = this
      this.endTimeOptions = {
        disabledDate(time) {
          return that.dayjs(time) < that.dayjs(value)
        }
      }
    },
    resetTemp() {
      this.temp = this.$options.data().temp
      !!this.$refs.dataForm && this.$refs.dataForm.resetFields()
    },
    getImage(image) {
      this.temp.file = image
      this.temp.listImg = ''
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    deleteInfo() {
      this.$confirm('确定删除选中的资讯?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功!')
      }).catch(() => {
      })
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
