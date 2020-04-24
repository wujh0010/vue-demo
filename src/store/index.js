import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import signIn from './signIn'
import stageGradeSubject from './stageGradeSubject'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    auth,
    signIn,
    stageGradeSubject:stageGradeSubject
  }
})