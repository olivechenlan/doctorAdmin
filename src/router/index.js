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
    redirect: '/home',
    children: [{
      path: 'home',
      name: '首页',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'list' }
    }]
  },
  {
    path: '/operateTools',
    component: Layout,
    name: '运营管理',
    meta: { title: '运营管理', icon: 'list' },
    children: [
      {
        path: 'indexBanner',
        component: () => import('@/views/operateTools/indexBanner'),
        name: '首页轮播图',
        meta: { title: '首页轮播图' }
      },
      {
        path: 'workbenchBanner',
        component: () => import('@/views/operateTools/workbenchBanner'),
        name: '工作台轮播图',
        meta: { title: '工作台轮播图' }
      },
      {
        path: 'tag',
        component: () => import('@/views/operateTools/tag'),
        name: '标签管理',
        meta: { title: '标签管理' }
      }, {
        path: 'circle',
        component: () => import('@/views/operateTools/circle'),
        name: '圈子管理',
        meta: { title: '圈子管理' }
      }
    ]
  },
  {
    path: '/userManage',
    component: Layout,
    name: '用户管理',
    meta: { title: '用户管理', icon: 'list' },
    children: [
      {
        path: 'medicalUser',
        component: () => import('@/views/userManage/medicalUser'),
        name: '医护用户信息',
        meta: { title: '医护用户信息' }
      }, {
        path: 'authentication',
        component: () => import('@/views/userManage/authentication'),
        name: '认证审核',
        meta: { title: '认证审核' }
      }
    ]
  },
  {
    path: '/infoManage',
    component: Layout,
    name: '资讯管理',
    meta: { title: '资讯管理', icon: 'list' },
    children: [
      {
        path: 'infoList',
        component: () => import('@/views/infoManage/infoList'),
        name: '资讯列表',
        meta: { title: '资讯列表' }
      }, {
        path: 'topicType',
        component: () => import('@/views/infoManage/topicType'),
        name: '栏目分类',
        meta: { title: '栏目分类' }
      }
    ]
  },
  {
    path: '/medicalInfoManage',
    component: Layout,
    name: '医疗信息管理',
    meta: { title: '医疗信息管理', icon: 'list' },
    children: [
      {
        path: 'organList',
        component: () => import('@/views/medicalInfoManage/organList'),
        name: '医疗机构列表',
        meta: { title: '医疗机构列表' }
      },
      {
        path: 'departmentManage',
        component: () => import('@/views/medicalInfoManage/departmentManage'),
        name: '科室管理',
        meta: { title: '科室管理' }
      },
      {
        path: 'titleManage',
        component: () => import('@/views/medicalInfoManage/titleManage'),
        name: '职称管理',
        meta: { title: '职称管理' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

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
