import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
// import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
// import {login} from './store/auth'

// Vue.use(ViewUI);

Vue.config.productionTip = false
global.cloudMain = '192.168.1.7:8082'



new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
