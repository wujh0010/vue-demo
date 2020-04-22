import Loading from './Loading.vue'

//
const requireAuth = (component) => {
  return {
    render:function (h) {
      if(this.isLoginSuccess)
        return h(component)
      return h(Loading)
    },
    watch:{
      isLoginSuccess:function (newVal, oldVal) {
        console.log(newVal)
        console.log(oldVal)
      }
    },
    computed:{
      isLoginSuccess:function () {
        return this.$store.state.auth.isLoginSuccess
      }
    }
  }
}

export default requireAuth