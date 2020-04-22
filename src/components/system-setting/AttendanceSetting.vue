<template>
  <div>
    <Tabs :value="activeMenu.toString()" @on-click="handleMenu">
      <TabPane v-for="item in menuList"
               :key="item.id"
               :label="item.name"
               :name="item.id.toString()"/>
    </Tabs>

    <section v-if="activeMenu===1" class="gpsSetting_item">
      <span>签到开关</span>
      <span>
        本开关为设置教师APP上的“签到”功能的开关，当开关为打开时。则教师APP上会增加签到按钮，并使用GPS地理位置签到的功能。地理位置签到可能因运营商或GPS定位等原因，存在一定的误差。如果同时打开“局域网签到”的功能，教师只需要满足地理位置或在局域网内任一条件，即视为签到成功。
      </span>
      <SwitchCom size="large"
                 :value="!!signInConfig.GPS"
                 @on-change="handleOnGpsSwitch">
        <span slot="open">允许</span>
        <span slot="close">关闭</span>
      </SwitchCom>
    </section>

    <section v-if="activeMenu === 2" class="gpsSetting_item">
      <span>签到开关</span>
      <span>
        本开关为设置教师APP上的“签到”功能的开关，当开关为打开时。则教师APP上会增加签到按钮，并使用学校wifi签到的功能。如果学校没有固定的IP地址和校园网wifi，则不能使用此设置。如果同时打开“地理位置签到”的功能，教师只需要满足地理位置或在局域网内任一条件，即视为签到成功。
      </span>
      <SwitchCom size="large"
                 :value="!!signInConfig.LAN"
                 @on-change="handleOnGpsSwitch">
        <span slot="open">允许</span>
        <span slot="close">关闭</span>
      </SwitchCom>
    </section>

    <Button @click="handleSubmit()">提交</Button>

    <div v-if="isLoading">true</div>
    <div v-else>false</div>
  </div>
</template>

<script>
  import {Tabs, Switch, Button} from 'view-design'
  import * as storeMethods from '../../store/signIn'
  import axios from 'axios'
  // let attendanceConfig = {
  //   'GPS': 0, // 位置签到设置    0：关闭  1：开启
  //   'LAN': 0, // 局域网签到设置  0：关闭  1：开启
  //   'IPList': [], // 允许局域网签到的IP地址
  //   'faceId': 1, // 人脸识别签到设置  0：关闭  1：开启
  //   'IMEI': 0, // 手机识别码签到设置  0：关闭  1：开启
  //   'num': 1, // 签到次数设置  1: 一天签到一次  2: 一天签到两次  3: 一天签到三次  4: 一天签到四次
  //   'weekday': [1, 2, 3, 4, 5], // 工作日设置 星期一到星期日分别为1到7
  //   'ranges': [
  //     {name: '第一次签到', time: ['8:00']},
  //     {name: '第二次签到', time: ['11:00', '13:00']}
  //   ], // 签到时间和名称设置
  //   'exemption': [] // 签到豁免时间设置
  // }
  export default {
    name: "AttendanceSetting",
    data: function () {
      console.log(this.$store.state)
      return {
        activeMenu: 1,
        menuList: [
          {id: 1, name: '位置签到设置'},
          {id: 2, name: '局域网签到设置'},
          {id: 3, name: '签到识别设置'},
          {id: 4, name: '签到次数设置'},
        ],
      }
    },
    methods: {
      // 切换 菜单
      handleMenu: function (e) {
        this.activeMenu = parseInt(e, 10)
      },

      // 切换  位置签到开关
      handleOnGpsSwitch: function () {
        let GPS = this.GPS_switch ? 0 : 1
        axios.post(`http://192.168.1.7:8080/api/schoolinfo`, {
          id: 6,
          signInConfig: JSON.stringify({signInConfig: {...this.signInConfig, GPS}})
        }).then(({data}) => {
          console.log(data)
        })
          .catch(err => console.log(err))
      },

      // 登录
      handleSubmit: function () {
        storeMethods.login({
          name:'c',
          password:"4A8A08F09D37B73795649038408B5F33",
          loginType:1
        })

        // let GPS = this.GPS_switch ? 0 : 1
        // axios.post(`http://192.168.1.7:8080/api/schoolinfo`, {
        //   id: 6,
        //   signInConfig: JSON.stringify({signInConfig: {...this.signInConfig, GPS}})
        // }).then(({data}) => {
        //   let signInConfig = JSON.parse(data.signInConfig[0].config)
        //   this.signInConfig = signInConfig.signInConfig
        // })
        //   .catch(err => console.log(err))
      }
    },
    mounted: function () {
      storeMethods.getSignIn({
        id: 6,
        withSignInConfig: 1
      })
    },
    watch: {
      activeMenu: function (val) {
        console.log(val)

      }
    },
    computed: {
      GPS_switch: function () {
        return this.signInConfig && this.signInConfig.GPS
      },
      isLoading: function () {
        return this.$store.state.signIn.isLoading
      },
      signInConfig: function () {
        return this.$store.state.signIn.signInSetting.signInConfig || {}
      }
    },
    components: {
      Tabs,
      TabPane: Tabs.Pane,
      SwitchCom: Switch,
      Button
    }
  }
</script>

<style scoped>
  .gpsSetting_item {
    display: grid;
    grid-template: 50px / 80px 1fr 80px;
    align-items: center;
  }
</style>