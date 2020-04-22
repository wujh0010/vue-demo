<template>
  <div style="width: 1232px;margin: 0 auto;">
    <div>
      <Tabs v-model="activeMenu">
        <TabPane v-for="o in menuList"
                 :key="o.id"
                 :label="o.name"
                 :name="o.tag"/>

      </Tabs>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import {Tabs} from 'view-design'

  export default {
    name: "SystemSettingPage",
    data: function () {
      let activeMenu = 'attendance'
      if(this.$route.path.includes('shareFile'))
        activeMenu = 'shareFile'

      return {
        activeMenu,
        menuList: [
          {id: 1, name: '分享文件设置', tag: 'shareFile'},
          {id: 2, name: '教师签到设置', tag: 'attendance'},
        ]
      }
    },
    methods: {},
    components: {
      Tabs,
      TabPane: Tabs.Pane,
    },
    watch: {
      activeMenu: function (val) {
        this.$router.push(`/system-setting/${val}`)
      }
    }
  }
</script>

<style scoped>

</style>