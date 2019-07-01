import router from './router'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import doctorApi from '@/network/api/doctorApi'
import store from 'store2'
import dayjs from 'dayjs'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

const isTokenValid = async() => {
  const tokens = store.session('tokens')
  let isValid = ''
  if (!tokens) {
    isValid = false
  } else {
    if (dayjs().diff(tokens.time, 'hour') >= 3) {
      await doctorApi.refreshToken({
        refreshToken: tokens.refreshToken
      }).then(data => {
        if (data.responseFlag = '1') {
          store.session.set('tokens', Object.assign(tokens, { accessToken: data.data.accessToken, time: dayjs() }))
          isValid = true
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
