<template>
  <div id="app">
    <router-view/>
    <div
      v-show="isLoading"
      v-loading.fullscreen.lock="isLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      element-loading-customClass="loading-style"
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
  data() {
    return {};
  },
  computed: {
    isLoading(): boolean {
      return this.$store.state.isLoading;
    },
  },
});
</script>

<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
</style>
