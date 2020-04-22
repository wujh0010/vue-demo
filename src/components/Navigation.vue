<template>
  <div>
    <div class="navigation_content">
      <div>{{auth ?auth.user.realname:''}}</div>

      <div>智慧教学</div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "Navigation",
    data:function () {
      console.log(this.$router)
      console.log(this.$store)
      return {
        auth:this.$store.state.auth
      }
    }
  }
</script>

<style scoped>
  .navigation_content {
    background-color: #007464;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    color: #ffffff;
  }
</style>