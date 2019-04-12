<template>
  <div class="page project-detail">
    <el-card>
      <div slot="header">
        <span class="card-name">项目详情</span>
      </div>
    </el-card>
    <div class="flex-wrap">
      <el-card>
        <div slot="header">
          <span class="card-name">项目性能数据</span>
        </div>
      </el-card>
      <el-card>
        <div slot="header">
          <span class="card-name">项目错误报告</span>
          <router-link class="el-button el-button--primary pull-right" :to="`/upload-map/${id}`" style="margin-top: -9px;">更新map文件</router-link>
        </div>
        <el-table>

        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'project-detail',
  data() {
    return {
      id: '',
    };
  },
  created() {
    this.id = this.$route.params.id;
  },
});
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 15px;
  flex: 1;
  & + .el-card {
    margin-left: 15px;
  }
}
</style>
