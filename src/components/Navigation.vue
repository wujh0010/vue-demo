<template>
  <div>
    <div class="navigation_content"
         :style="{width:$route.path !== '/parent' ? '1232px' : '100%',margin:'0 auto'}">
      <div>
        <Dropdown placement="bottom-start"
                  @on-click="handleLoginOut"
        >

          <a href="javascript:void(0)">
            {{auth ?auth.user.realname:''}}
            <Icon type="arrow-down-b"></Icon>
          </a>
          <DropdownMenu  slot="list">
            <DropdownItem name="1">退出</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div>智慧教学</div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
  import {Dropdown,DropdownMenu,DropdownItem,Icon} from 'view-design'
  export default {
    name: "Navigation",
    data:function () {
      console.log(this.$router)
      console.log(this.$route)
      console.log(this.$store)
      return {
        auth:this.$store.state.auth
      }
    },
    methods:{
      handleLoginOut:function (key) {
        console.log(key)
        this.$store.commit('LOGIN_OUT',{},{root:true})
        this.$router.push('/login')
      }
    },
    components:{
      Dropdown,
      DropdownItem,
      DropdownMenu,
      Icon
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