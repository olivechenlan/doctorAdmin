import doctorApi from '@/network/api/doctorApi'
import store from 'store2'
import tools from './tools'

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
const getTitleState = getDepartmentState

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

const getDepartment = async(isRefresh) => {
  if (tools.isEmptyObject(store.session('departmentList')) || isRefresh) {
    await doctorApi.getDepartmentList({}).then(data => {
      if (data.responseFlag === '1') {
        data.data.forEach(item => {
          if (!item.subDeptList) item.subDeptList = []
          for (const i in item.subDeptList) {
            if (!item.subDeptList[i]) item.subDeptList[i] = []
          }
        })
        store.session.set('departmentList', data.data)
      }
    }).catch(() => {})
  }
}

const getTitle = async(isRefresh) => {
  if (tools.isEmptyObject(store.session('titleList')) || isRefresh) {
    await doctorApi.getTitleList({}).then(data => {
      if (data.responseFlag === '1') {
        store.session.set('titleList', data.data)
      }
    }).catch(() => {})
  }
}

const getHospital = async(isRefresh) => {
  if (tools.isEmptyObject(store.session('hospitalList')) || isRefresh) {
    await doctorApi.getHospitalList({}).then(data => {
      if (data.responseFlag === '1') {
        store.session.set('hospitalList', data.data)
      }
    }).catch(() => {})
  }
}

const getDefaultFromDepartment = (id) => {
  const departmentList = store.session('departmentList')
  for (const i in departmentList) {
    if (departmentList[i].departmentId === id) {
      return [id]
    } else {
      for (const j in departmentList[i].subDeptList) {
        if (departmentList[i].subDeptList[j].departmentId === id) {
          return [departmentList[i].departmentId, departmentList[i].subDeptList[j].departmentId]
        }
      }
    }
  }
}

const getDefaultFromTitle = (id) => {
  const titleList = store.session('titleList')
  for (const i in titleList) {
    if (titleList[i].id === id) {
      return [id]
    } else {
      for (const j in titleList[i].subZcList) {
        if (titleList[i].subZcList[j].id === id) {
          return [titleList[i].id, titleList[i].subZcList[j].id]
        }
      }
    }
  }
}

const getTopic = async(isRefresh) => {
  if (tools.isEmptyObject(store.session('topicList')) || isRefresh) {
    await doctorApi.getTopicList({
      code: '3310'
    }).then(data => {
      if (data.responseFlag === '1') {
        store.session.set('topicList', data.data)
      }
    }).catch(() => {})
  }
}

const getPathwayMajor = async(isRefresh) => {
  if (tools.isEmptyObject(store.session('pathwayMajor')) || isRefresh) {
    await doctorApi.getDictionary('CP_MAJOR').then(data => {
      if (data.responseFlag === '1') {
        store.session.set('pathwayMajor', data.data)
      }
    }).catch(() => {})
  }
}

const getGuideMajor = async() => {
  if (tools.isEmptyObject(store.session('guideMajor'))) {
    await doctorApi.getGuideMajor({}).then(data => {
      if (data.responseFlag === '1') {
        const majorGroup = [
          data.data.nklist,
          data.data.wklist,
          data.data.otherList
        ]
        store.session.set('guideMajor', majorGroup)
      }
    }).catch(() => {})
  }
}

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

export default {
  getArea, // 获取区域列表
  getDepartment, // 获取科室列表
  getTitle, // 获取职称列表
  getAuthenStatus, // 获取认证状态
  getHospital, // 获取医院列表
  getDefaultFromDepartment, // 获取默认科室
  getDefaultFromTitle, // 获取默认职称
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
  getTopic, // 获取栏目分类
  getFeedbackStatus, // 获取反馈状态
  getPathwayType, // 临床路径类型
  getPathwayMajor, // 获取临床路径所属专业
  getGuideMajor, // 获取指南专业
  getGuideType, // 获取指南分类
  getSkillCheckState, // 获取医术审核状态
  getMedicalSkillState, // 医术是否公开
  getIsTop // 是否置顶

}
