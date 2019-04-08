<template>
  <el-card class="project-list">
    <div slot="header">
      <span class="card-name">项目管理</span>
      <router-link class="el-button el-button--primary" to="/project/create">预警权限设置</router-link>
    </div>
    <el-table :data="projectList" border style="width: 100%">
      <el-table-column prop="name" label="名称" width="180">
      </el-table-column>
      <el-table-column prop="alerts" label="报警次数" width="180">
      </el-table-column>
      <el-table-column prop="username" label="创建用户">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <router-link class="btn-view" :to="`/project/detail/${scope.row.id}`">查看</router-link>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'home',
  data() {
    return {
      projectList: [
        {
          name: '决策工作台',
          alerts: 10,
          createTime: '2019-03-25 11:11:21',
        },
      ],
    };
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.card-name + a {
  float: right;
  margin-top: -9px;
}
</style>
