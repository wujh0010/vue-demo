<template>
  <div class="mainPage">
    404 Sorry,未找到相应的界面...

    <div>
      <Button type="primary" @click="handleHome">返回首页</Button>
    </div>
  </div>
</template>

<script>
  import {Button} from 'element-ui'
  export default {
    name: "Error",
    components:{
      Button
    },
    methods:{
      handleHome:function(){
        this.$router.push('/parent')
      }
    }
  }
</script>

<style scoped>
  .mainPage {
    width: 1232px;
    margin: 0 auto;
    color: #999;
    font-size: 30px;
    text-align: center;
    padding-top: 200px;
  }
</style>