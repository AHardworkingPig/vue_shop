<template>
  <section class="home">
    <el-button @click="logout">退出</el-button>
  </section>
</template>

<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
  },
});
</script>