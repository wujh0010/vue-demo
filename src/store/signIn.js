import store from './index'
import {SchoolInfoResource} from '../api/resource'

// 获取  签到数据
export const getSignIn = (param) => {
  store.dispatch('signIn/GET_SIGN_IN', param)
}

// export const login = (param) => {
//   store.dispatch('auth/LOG_IN', param)
// }



// state 数据及同步异步修改
const state = {
  isLoading: true,
  isSaving: false,
  isDeleting: false,
  signInList: [],
  signInSetting: {}
}
const mutations = {
  GET_SIGN_IN: function (state) {
    Object.assign(state, {isLoading: true})
  },
  RECEIVED_SIGN_IN: function (state, param) {
    console.log('received get')
    Object.assign(state, {
      isLoading: false,
      signInSetting: param
    })
  },
  SAVE_SIGN_IN: function (state, param) {
    console.log(param)

    Object.assign(state, {isSaving: true})
  },
  SAVE_SIGN_IN_SUCCESS: function (state, param) {
    const {signInList} = state
    param.forEach(o => {
      let item = signInList.find(a => a.id === o.id)
      if (item)
        Object.assign(item, o)
      else
        signInList.push(o)
    })
    Object.assign(state, {
      isSaving: false,
      signInList: [...signInList]
    })
  },
  DELETE_SIGN_IN: function (state, param) {
    console.log(param)

    Object.assign(state, {isDeleting: true})
  },
  DELETE_SIGN_IN_SUCCESS: function (state, param) {
    const {signInList} = state
    Object.assign(state, {
      isDeleting: false,
      signInList: signInList.filter(o => !param.find(a => a.id === o.id))
    })
  }
}
const actions = {
  // 获取
  GET_SIGN_IN: function (context, param) {
    context.commit('GET_SIGN_IN', param)
    //  异步获取数据
    SchoolInfoResource.get(param)
      .then(data => {
        console.log(data)
        const {signInConfig} = data
        if (signInConfig.length) {
          let config = signInConfig[0].config
          try {
            config = JSON.parse(config)
          } catch (e) {
            console.log(e)
          }

          context.commit('RECEIVED_SIGN_IN', config)
        }
      })
      .catch(err => console.log(err))
  },

  // 保存 || update
  SAVE_SIGN_IN: function (context, param) {
    context.commit('SAVE_SIGN_IN', param)
    //  异步获取数据
  },

  // 删除
  DELETE_SIGN_IN: function (context, param) {
    context.commit('DELETE_SIGN_IN', param)
    //  异步获取数据
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