import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import store from '@/store'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  const isLogin = store.state.user.accessToken
  if (!isLogin) { // 未登录
    if (to.path !== '/login') {
      return next(`/login?redirect=${to.path}`)
    } else {
      next()
    }
  } else { // 已登录
    if (to.path === '/login') {
      return next({ path: '/' })
    }
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})
