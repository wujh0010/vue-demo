import store from './index'
import {authLogIn, getUserInfo} from '../api/UserInfoResource'
import {CloudResResource,CloudSchoolInfoResource} from '../api/resource'

// 用户登录
export const login = (param) => {
  store.dispatch('auth/LOG_IN', param)
}

const state = {
  isLogging: false,
  isAuthenticated: false,
  isLoginSuccess: false,
  user: null
}
const mutations = {
  LOG_IN: function (state) {
    state.isLogging = true
  },
  AUTHENTICATED_SUCCESS: function (state, param) {
    state.isLogging = false
    state.isAuthenticated = true
    state.user = param
  },
  LOGIN_SUCCESS:function (state, param) {
    state.isLoginSuccess = true
    console.log(param)
  }
}
const actions = {
  LOG_IN: async function (context, param) {
    context.commit('LOG_IN')
    /*
    * 第一次 登陆
    * */
    const auth = await authLogIn(param)

    // 两个全局变量设置值
    const {storageInfo} = auth.user.schoolInfo
    // let {local_ip} = storageInfo.serverInfo
    let {serverInfo} = storageInfo
    if (serverInfo.server_ip && storageInfo.port)
      global.schoolHost = `http://${serverInfo.server_ip}:${storageInfo.port}`
    if (serverInfo.cloudRes)
      global.cloudRes = serverInfo.cloudRes

    console.log(auth)
    localStorage.setItem('jwtToken', auth.jwtToken)

    let queryParam = {
      id: auth.user.id,
      getUserInfo: 1,
      loginType: auth.loginType,
      region: auth.user.schoolInfo.region,
      _host: global.schoolHost
    }
    let userInfo = await getUserInfo(queryParam)
    userInfo.schoolInfo = auth.user.schoolInfo
    console.log(userInfo)
    context.commit('AUTHENTICATED_SUCCESS', userInfo)
    localStorage.setItem('loginData', JSON.stringify(param))

    //  二次登陆，获取 基础数据
    // 1.获取 教材
    const textbookList = await CloudResResource.get({
      region: userInfo.schoolInfo.region,
      schoolId: userInfo.schoolInfo.id,
      syncTextbook: 1
    })

    const schoolData = await CloudSchoolInfoResource.get({
      region: userInfo.schoolInfo.region,
      withSchoolNames: 1,
      schoolId: userInfo.schoolInfo.id,
    })
    context.commit('stageGradeSubject/RECEIVED_TEXTBOOKS',{textbookList,schools:schoolData.schoolinfos,schoolInfo:userInfo.schoolInfo},{root:true})

    // 最后发送 登陆成功
    context.commit('LOGIN_SUCCESS', userInfo)
  }
}
const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}