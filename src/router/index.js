import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    name: 'operateTools',
    redirect: '/operateTools/indexBanner',
    meta: { title: '运营管理', icon: 'list' },
    children: [
      {
        path: '/operateTools/indexBanner',
        component: () => import('@/views/operateTools/indexBanner'),
        name: 'operateTools-indexBanner',
        meta: { title: '首页轮播图' }
      },
      {
        path: '/operateTools/workbenchBanner',
        component: () => import('@/views/operateTools/workbenchBanner'),
        name: 'operateTools-workbenchBanner',
        meta: { title: '工作台轮播图' }
      },
      {
        path: '/operateTools/tag',
        component: () => import('@/views/operateTools/tag'),
        name: 'operateTools-tag',
        meta: { title: '标签管理' }
      },
      {
        path: '/operateTools/circle',
        component: () => import('@/views/operateTools/circle'),
        name: 'operateTools-circle',
        meta: { title: '圈子管理' }
      },
      {
        path: '/operateTools/pathway',
        component: () => import('@/views/operateTools/pathway'),
        name: 'operateTools-pathway',
        meta: { title: '临床路径' }
      },
      {
        path: '/operateTools/guideManagement',
        component: () => import('@/views/operateTools/guideManagement'),
        name: 'operateTools-guideManagement',
        meta: { title: '指南管理' }
      }
    ]
  },
  {
    path: '/userManage',
    component: Layout,
    name: 'userManage',
    meta: { title: '用户管理', icon: 'list' },
    children: [
      {
        path: 'medicalUser',
        component: () => import('@/views/userManage/medicalUser'),
        name: 'userManage-medicalUser',
        meta: { title: '医护用户信息' }
      }, {
        path: 'authentication',
        component: () => import('@/views/userManage/authentication'),
        name: 'userManage-authentication',
        meta: { title: '认证审核' }
      }
    ]
  },
  {
    path: '/infoManage',
    component: Layout,
    name: 'infoManage',
    meta: { title: '资讯管理', icon: 'list' },
    children: [
      {
        path: 'infoList',
        component: () => import('@/views/infoManage/infoList'),
        name: 'infoManage-infoList',
        meta: { title: '资讯列表' }
      }, {
        path: 'topicType',
        component: () => import('@/views/infoManage/topicType'),
        name: 'infoManage-topicType',
        meta: { title: '栏目分类' }
      },
      {
        path: 'infoEdit',
        component: () => import('@/views/infoManage/infoEdit'),
        name: 'infoManage-infoEdit',
        meta: { title: '编辑资讯' },
        hidden: true

      }
    ]
  },
  {
    path: '/medicalSkillManage',
    component: Layout,
    name: 'medicalSkillManage',
    meta: { title: '医术管理', icon: 'list' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/medicalSkillManage/index'),
        name: 'medicalSkillManage-index',
        meta: { title: '病例列表' }
      },
      {
        path: 'edit',
        component: () => import('@/views/medicalSkillManage/edit'),
        name: 'medicalSkillManage-edit',
        meta: { title: '病例审核' },
        hidden: true
      }
    ]
  },
  {
    path: '/medicalInfoManage',
    component: Layout,
    name: 'medicalInfoManage',
    meta: { title: '医疗信息管理', icon: 'list' },
    children: [
      {
        path: 'organList',
        component: () => import('@/views/medicalInfoManage/organList'),
        name: 'medicalInfoManage-organList',
        meta: { title: '医疗机构列表' }
      },
      {
        path: 'departmentManage',
        component: () => import('@/views/medicalInfoManage/departmentManage'),
        name: 'medicalInfoManage-departmentManage',
        meta: { title: '科室管理' }
      },
      {
        path: 'titleManage',
        component: () => import('@/views/medicalInfoManage/titleManage'),
        name: 'medicalInfoManage-titleManage',
        meta: { title: '职称管理' }
      }
    ]
  },
  {
    path: '/feedback',
    component: Layout,
    name: 'feedback',
    meta: { title: '反馈举报', icon: 'list' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/feedback/index'),
        name: 'feedback-index',
        meta: { title: '用户反馈' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = []

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
