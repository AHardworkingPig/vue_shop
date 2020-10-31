<template>
  <section class="welcome">
    <h3>Welcome</h3>
  </section>
</template>


<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  created() {
    // 修复路由跳转bug
    if (window.sessionStorage.getItem('activePath') !== null) {
      // @ts-ignore
      this.$parent.$parent.$parent.$parent.activePath = '';

      // @ts-ignore 关闭当前打开的subItem
      this.$parent.$parent.$parent.$parent.$refs.menu.close(
        // @ts-ignore
        // tslint:disable-next-line
        this.$parent.$parent.$parent.$parent.subMenuId
      );
      window.sessionStorage.setItem('activePath', '');
    }
  },
});
</script>