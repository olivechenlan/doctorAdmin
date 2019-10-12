
const getArea = [
  {
    name: '台州市',
    code: '331099'
  },
  {
    name: '椒江区',
    code: '331002'
  },
  {
    name: '黄岩区',
    code: '331003'
  },
  {
    name: '路桥区',
    code: '331004'
  },
  {
    name: '玉环市',
    code: '331021'
  },
  {
    name: '三门县',
    code: '331022'
  },
  {
    name: '天台县',
    code: '331023'
  },
  {
    name: '仙居县',
    code: '331024'
  },
  {
    name: '温岭市',
    code: '331081'
  },
  {
    name: '临海市',
    code: '331082'
  }
]

const getAuthenStatus = [
  {
    name: '未认证',
    code: '0'
  },
  {
    name: '已认证',
    code: '1'
  }
]

const checkStatus = [
  {
    name: '未通过',
    code: '3'
  },
  {
    name: '已通过',
    code: '2'
  }
]

const getHospitalKind = [
  {
    name: '公立医院',
    code: '1'
  },
  {
    name: '民营医院',
    code: '2'
  },
  {
    name: '社区诊所',
    code: '3'
  },
  {
    name: '其他',
    code: '9'
  }
]

const getHospitalType = [
  {
    name: '综合医院',
    code: '1'
  },
  {
    name: '肿瘤医院',
    code: '2'
  },
  {
    name: '眼科医院',
    code: '3'
  },
  {
    name: '口腔医院',
    code: '4'
  },
  {
    name: '妇幼保健',
    code: '5'
  },
  {
    name: '儿童医院',
    code: '6'
  },
  {
    name: '中医医院',
    code: '7'
  },
  {
    name: '骨伤医院',
    code: '8'
  },
  {
    name: '其他',
    code: '99'
  }
]

const getHospitalLevel = [
  {
    name: '三级甲等',
    code: '1'
  },
  {
    name: '三级乙等',
    code: '2'
  },
  {
    name: '三级丙等',
    code: '3'
  },
  {
    name: '二级甲等',
    code: '4'
  },
  {
    name: '二级乙等',
    code: '5'
  },
  {
    name: '二级丙等',
    code: '6'
  },
  {
    name: '一级甲等',
    code: '7'
  },
  {
    name: '一级丙等',
    code: '8'
  },
  {
    name: '一级丙等',
    code: '9'
  },
  {
    name: '其他',
    code: '99'
  }
]

const getDepartmentType = [
  {
    name: '一级科室',
    code: '0'
  },
  {
    name: '二级科室',
    code: '1'
  }
]

const getTitleType = [
  {
    name: '一级',
    code: '0'
  },
  {
    name: '二级',
    code: '1'
  }
]

const getDepartmentState = [
  {
    name: '已使用',
    code: '0'
  },
  {
    name: '未使用',
    code: '1'
  }
]

const getTitleState = [
  {
    name: '已使用',
    code: '0'
  },
  {
    name: '未使用',
    code: '1'
  }
]

const getBannerStatus = [
  {
    name: '未启用',
    code: '0'
  },
  {
    name: '已启用',
    code: '1'
  }
]

const getCircleType = [
  {
    name: '市级圈子',
    code: '1'
  },
  {
    name: '医院圈子',
    code: '2'
  },
  {
    name: '自定义圈子',
    code: '3'
  }
]

const getCheckStatus = [
  {
    name: '待审核',
    code: '1'
  },
  {
    name: '审核成功',
    code: '2'
  },
  {
    name: '被驳回',
    code: '3'
  }
]

const getFeedbackStatus = [
  {
    name: '未处理',
    code: '0'
  },
  {
    name: '已处理',
    code: '1'
  }
]

const getPathwayType = [
  {
    name: '普通',
    code: '1'
  },
  {
    name: '县级',
    code: '2'
  }
]

const getMedicalSkillState = [
  {
    name: '不公开',
    code: '0'
  },
  {
    name: '公开',
    code: '1'
  }
]

const getIsTop = [
  {
    name: '是',
    code: 1
  },
  {
    name: '否',
    code: 0
  }
]

const getGuideType = [
  {
    name: '内科',
    code: '1'
  },
  {
    name: '外科',
    code: '2'
  },
  {
    name: '其他',
    code: '3'
  }
]

const getSkillCheckState = [
  {
    name: '未审核',
    code: '0'
  },
  {
    name: '审核中',
    code: '1'
  },
  {
    name: '审核通过',
    code: '2'
  },
  {
    name: '审核不通过',
    code: '3'
  }
]

const getInquiry = [
  {
    name: '已开通',
    code: '1'
  },
  {
    name: '未开通',
    code: '0'
  }
]

const getIsHot = [
  {
    name: '是',
    code: '1'
  },
  {
    name: '不是',
    code: '0'
  }
]

export default {
  getArea, // 获取区域列表
  getAuthenStatus, // 获取认证状态
  checkStatus, // 获取审核状态
  getHospitalKind, // 获取医院性质
  getHospitalType, // 获取医院类型
  getHospitalLevel, // 获取医院等级
  getDepartmentType, // 获取科室类别
  getDepartmentState, // 获取科室状态
  getTitleState, // 获取职称状态
  getTitleType, // 获取职称类别
  getCircleType, // 获取圈子类型
  getCheckStatus, // 获取审核状态
  getBannerStatus, // 获取轮播图状态
  getFeedbackStatus, // 获取反馈状态
  getPathwayType, // 临床路径类型
  getGuideType, // 获取指南分类
  getSkillCheckState, // 获取医术审核状态
  getMedicalSkillState, // 医术是否公开
  getIsTop, // 是否置顶
  getInquiry, // 是否开通问诊
  getIsHot // 是否热门
}
