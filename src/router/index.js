import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import Error from '../Error.vue'
import HomeworkPage from '../pages/HomeworkPage.vue'
import SystemSettingPage from '../pages/admin/SystemSettingPage.vue'
import Navigation from '../components/Navigation'
import store from '../store'
import {login} from '../store/auth'
import requireAuth from '../requireAuth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    exact: true,
    name: 'loginPage',
    component: LoginPage
  },
  {
    path: '/parent',
    exact: true,
    name: 'homePage',
    component: requireAuth(HomePage)
  },
  {
    path: '/',
    name: 'navigation',
    component: requireAuth(Navigation),
    children: [
      {
        path: 'system-setting',
        name: 'systemSetting',
        component: SystemSettingPage,
        children: [
          {
            path: 'shareFile',
            component: () => import('../components/system-setting/ShareFile.vue')
          },
          {
            path: 'attendance',
            component: () => import('../components/system-setting/AttendanceSetting.vue')
          },

        ]
      },
      {
        path: 'homework',
        name: 'homework',
        component: HomeworkPage
      },
      {
        path:'*',
        component:Error
      }
    ]
  },
  ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 除 登录页，其他界面功能，必须在 用户登录后，才能进入界面
router.beforeEach((to, from, next) => {
  if (store.state.auth.isLoginSuccess)
    next()
  else {
    const {path, name} = to
    console.log(path)
    if (path === '/login' && name === 'loginPage')
      next()
    else {
      if (localStorage.loginData) {
        login(JSON.parse(localStorage.loginData))
        if (path === '/')
          next('/parent')
        else
          next()
      } else
        next('/login')
    }
  }
})

export default router
