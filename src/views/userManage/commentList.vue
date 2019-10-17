<template>
  <div class="app-container">
    <el-row type="flex" justify="space-between">
      <el-col :span="5">
        <div class="rate-box">
          <div>
            <p>好评率</p>
            <p class="rate">{{ record.applauseRate }}%</p>
          </div>
        </div>
        <div class="doctor-image">
          <el-avatar :src="record.inquiryHead" shape="square" :size="160" fit="cover" @error="errorHandler">
            <img :src="emptyPic">
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
          <div v-show="!list" class="list-no-item">暂无相关数据</div>
          <el-row v-for="(item,index) in list" :key="index" class="comment-list">
            <el-col :span="21">
              <el-row type="flex" align="center">
                <el-col :span="4" class="name">{{ item.fromUser }}</el-col>
                <el-col :span="20">
                  <el-rate
                    v-model="item.evaluateValue"
                    disabled
                    text-color="#ff9900"
                  />
                </el-col>
              </el-row>
              <p>{{ item.content }}</p>
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
      emptyPic: require('@/assets/empty/noItem.png'),
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
      this.$loading().show()
      const params = Object.assign({}, this.listQuery, { userId: this.$route.query.id })
      this.api.doctorApi.getInquiryEvaluateList(params).then(data => {
        this.$loading().hide()
        if (data.responseFlag === '1') {
          this.record = data.data
          this.list = data.data.evaluates.records
          this.total = data.data.evaluates.total
          this.list.forEach(item => {
            item.isDelete = item.isDelete === '1'
          })
        }
      }).catch(() => {
        this.$loading().hide()
      })
    },
    updateEvaluate(id, isDelete) {
      this.$loading().show()
      this.api.doctorApi.updateEvaluate({
        id: id,
        isDelete: isDelete ? '1' : '0'
      }).then(data => {
        this.$loading().hide()
        if (data.responseFlag === '1') {
          this.$message.success('操作成功')
          this.getList()
        }
      }).catch(() => {
        this.$loading().hide()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";
  .app-container{
    font-size: 14px;
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
        color: #606266;
        padding: 15px 0;
        border-bottom: 1px solid #eee;
        p{
          padding-top: 8px;
        }
        .name{
          line-height: 21px;
        }
        .datetime{
          color: #999;
        }
      }
      .list-no-item{
        text-align: center;
        color: #999;
        margin-top: 60px;
      }
    }

  }

</style>
