<template>
  <div>
    <Modal :value="true"
           :footer-hide="true"
           :closable="false"
           :mask-closable="false">
      <div class="mainContent">
        <Form ref="formInline"
              :model="formInline"
              :label-width="80"
              :rules="ruleInline">
          <FormItem prop="user" label="用户名：">
            <Input type="text"
                   v-model="formInline.user"
                   placeholder="用户名"/>
            <Icon type="ios-person-outline"
                  slot="prepend"></Icon>
            <!--</Input>-->
          </FormItem>
          <FormItem prop="password" label="密码：">
            <Input type="password"
                   v-model="formInline.password"
                   placeholder="密码"/>
            <Icon type="ios-lock-outline"
                  slot="prepend"></Icon>
            <!--</Input>-->
          </FormItem>
          <FormItem>
            <Button type="primary"
                    :disabled="!formInline.user||!formInline.password"
                    @click="handleSubmit">
              登录{{isLoginSuccess}}
            </Button>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {Modal, Input, Button, Form, FormItem} from 'view-design'
  import {hexMD5} from '../utils/md5'
  import * as storeMethods from '../store/auth'

  export default {
    name: "LoginPage",
    data: function () {
      return {
        formInline: {
          user: '',
          password: ''
        },
        ruleInline: {
          user: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      handleSubmit: function () {
        // 登录action
        storeMethods.login({
          name: this.formInline.user,
          password: hexMD5(this.formInline.password).toUpperCase(),
          loginType:1
        })
      }
    },
    watch: {
      isLoginSuccess: function (newVal, oldVal) {
        // 登录成功，跳转 首页
        if (newVal && !oldVal) {
          console.log('登录成功 。。。。。')
          this.$router.push(`/parent`)
        }
      }
    },
    computed: {
      // 检测 store 上的登录成功信息
      isLoginSuccess: function () {
        return this.$store.state.auth.isLoginSuccess
      }
    },
    components: {
      Modal,
      Input,
      Button,
      Form,
      FormItem
    }
  }
</script>

<style scoped>
  .mainContent {
    display: flex;
    justify-content: center;
  }
</style>