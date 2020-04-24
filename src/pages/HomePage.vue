<template>
  <div class="mainContent_page">
    <header class="head_content">
      <Navigation />
    </header>
    <main class="main_content">
      <div class="route_item"
           v-for="item in routes"
           @click="handleEnterPage(item)"
           :style="{color:item.color,border:'1px solid',borderColor:item.color}"
           :key="item.id">
        {{item.name}}
      </div>
    </main>
    <footer class="footer_content">
    </footer>
  </div>
</template>

<script>
  import Navigation from '../components/Navigation'
  const routes = [
    {
      id: 1,
      name: '课外作业',
      color:'#F54236'
    },
    {
      id: 2,
      name: '同步课堂',
      color:'#108ee9'
    },
    {
      id: 3,
      name: '请假条',
      color:'#6C42B9'
    },
    {
      id: 4,
      name: '电子课本',
      color:'#F54236'
    },
    {
      id: 5,
      name: '优秀作业',
      color:'#FFC328'
    },
    {
      id: 6,
      name: '成绩分析',
      color:'#49A7F5'
    },
    {
      id: 7,
      name: '学生课表',
      color:'#FFA114'
    },
    {
      id: 8,
      name: '志愿填报',
      color:'#5CB760'
    },
    {
      id: 9,
      name: '分组作业',
      color:'#7E5A4E',
      url:'/homework'
    },
    {
      id: 10,
      name: '通知公告',
      color:'#4354B7'
    }
  ]
  export default {
    name: "HomePage",
    data: function () {
      return {
        routes
      }
    },
    methods: {

      handleEnterPage:function(item) {
        const {url} = item
        this.$router.push(url)
      }
    },
    components:{
      Navigation
    }
  }
</script>

<style scoped>
  .mainContent_page {
    /*width: 1232px;*/
    /*margin: 0 auto;*/
    background: #39452E;
    /*background-image: radial-gradient(circle, #61774F, #49593C, #39452E);*/
  }

  .head_content {
    height: 20vh;
  }

  .main_content {
    width: 1232px;
    margin: 0 auto;
    height: 60vh;
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    padding: 0 16px;
  }
  .route_item {
    width: 200px;
    height: 100px;
    border-radius: 4px;
    margin: 20px;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    box-sizing: border-box;
  }

  .route_item:hover{
    cursor: pointer;
    background: #108ee9;
    color: #ffffff !important;
    border-color: #108339 !important;
  }
  .footer_content {
    height: 20vh;
  }
</style>