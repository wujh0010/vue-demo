<template>
  <div>
    <Modal :value="true"
           :footer-hide="true"
           :closable="false"
           :mask-closable="false">
      <div class="loading_content">
        <i class="el-icon-loading"></i>
        <span class="content_title">正在加载...</span>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {Modal} from 'view-design'

  export default {
    name: "RequireAuth",
    data: function () {

      return {}
    },
    watch: {},
    computed: {},
    components: {
      Modal
    }
  }
</script>

<style scoped>
  .loading_content {
    color: #108ee9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 45px;
  }

  .content_title {
    font-size: 20px;
    padding-left: 8px;
  }
</style>