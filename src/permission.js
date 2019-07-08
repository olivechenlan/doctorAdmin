import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import doctorApi from '@/network/api/doctorApi'
import store from '@/store'
import dayjs from 'dayjs'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

const isTokenValid = async() => {
  const user = store.state.user
  let isValid = ''
  if (!(user.accessToken)) {
    isValid = false
  } else {
    if (dayjs().diff(user.refreshTime, 'hour') >= 3 || !user.refreshTime) {
      await doctorApi.refreshToken({
        refreshToken: user.refreshToken
      }).then(data => {
        if (data.responseFlag === '1') {
          isValid = true
          store.dispatch('user/toggleUserInfo', Object.assign({ refreshToken: user.refreshToken, refreshTime: dayjs() }, data.data))
        } else {
          isValid = false
        }
      }).catch(err => {
        isValid = false
      })
    } else {
      isValid = true
    }
  }
  return isValid
}

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  const isValid = await isTokenValid()

  if (isValid) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
