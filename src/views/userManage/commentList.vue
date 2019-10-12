<template>
  <div class="app-container">
    <el-row type="flex" justify="space-between">
      <el-col :span="5">
        <div class="rate-box">
          <div>
            <p>好评率</p>
            <p class="rate">%</p>
          </div>
        </div>
        <div class="doctor-image">
          <el-avatar :src="url" shape="square" :size="160" fit="cover" @error="errorHandler">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png">
          </el-avatar>
          <p class="name">{{ record.name }}</p>
          <p>{{ record.hospitalName }}</p>
          <p>
            <span>{{ record.departmentName }}</span>
            <span>{{ record.zcName }}</span>
          </p>
        </div>
      </el-col>
      <el-col :span="19">
        <aside>
          <el-radio v-for="(item,index) in radioGroup" :key="index" v-model="radio" :label="item.code" @change="radioChange">{{ item.name }}</el-radio>
        </aside>
        <div class="comment-container">
          <el-row v-for="(item,index) in list" :key="index" class="comment-list">
            <el-col :span="21">
              <el-row>
                <el-col :span="4">{{ item.fromUser }}</el-col>
                <el-col :span="20">
                  <el-rate
                    v-model="item.evaluateValue"
                    disabled
                    text-color="#ff9900"
                  />
                </el-col>
              </el-row>
              <p>kkkk</p>
              <p class="datetime">{{ item.createTime|formatToTime }}</p>
            </el-col>
            <el-col :span="3" class="text-right">
              <el-checkbox v-model="item.isDelete" @change="checkboxChange(item,$event)">隐藏</el-checkbox>
            </el-col>
          </el-row>
        </div>
        <pagination v-show="total>0" :total="total" :limit.sync="listQuery.size" :page.sync="listQuery.current" @pagination="getList" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      listQuery: {
        userId: '',
        current: 1,
        size: 4,
        condition: '5'
      },
      record: {},
      list: null,
      total: 0,
      radioGroup: [
        {
          name: '全部',
          code: '5'
        },
        {
          name: '三星以下',
          code: '3'
        }
      ],
      radio: '5',
      checkedValue: 1
    }
  },
  created() {
  },
  mounted() {
    this.getList()
  },
  methods: {
    radioChange(val) {
      this.listQuery.condition = val
      this.getList()
    },
    checkboxChange(item, e) {
      this.updateEvaluate(item.id, e)
    },
    errorHandler() {
      return true
    },
    getList() {
      this.tools.$loading()
      const params = Object.assign({}, this.listQuery, { userId: this.$route.query.id })
      this.api.doctorApi.getInquiryEvaluateList(params).then(data => {
        this.tools.$loading().hide()
        if (data.responseFlag === '1') {
          this.record = data.data
          this.list = data.data.evaluates.records
          this.total = data.data.evaluates.total
          this.list.forEach(item => {
            item.isDelete = item.isDelete === '1'
          })
        }
      }).catch(() => {
        this.tools.$loading().hide()
      })
    },
    updateEvaluate(id, isDelete) {
      this.tools.$loading()
      this.api.doctorApi.updateEvaluate({
        id: id,
        isDelete: isDelete ? '1' : '0'
      }).then(data => {
        this.tools.$loading().hide()
        if (data.responseFlag === '1') {
          this.$message.success('操作成功')
          this.getList()
        }
      }).catch(() => {
        this.tools.$loading().hide()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";
  .app-container{
    p{
      margin: 0;
    }
    .rate-box{
      width: 160px;
      height: 160px;
      background-color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
      text-align: center;
      .rate{
        font-size: 30px;
        font-weight: 600;
        margin-top: 20px;
      }
    }
    .doctor-image{
      width: 160px;
      margin-top: 30px;
      text-align: center;
      line-height: 2;
      color: #888;
      .name{
        font-size: 18px;
        color: #1a1a1a;
      }
    }
    .comment-container{
      padding: 0 20px;
      margin-top: -20px;
      .comment-list{
        padding: 20px 0;
        border-bottom: 1px solid #eee;
        p{
          padding-top: 8px;
        }
        .datetime{
          color: #999;
        }
      }
    }

  }

</style>
