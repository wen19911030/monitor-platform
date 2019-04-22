<template>
  <el-card class="project-list">
    <div slot="header">
      <span class="card-name">项目管理</span>
      <router-link class="el-button el-button--primary" to="/project-create">创建项目</router-link>
    </div>
    <el-table :data="projectList" border style="width: 100%">
      <el-table-column prop="_id" label="ID" width="220">
      </el-table-column>
      <el-table-column prop="projectName" label="名称" width="180" align="center">
      </el-table-column>
      <el-table-column prop="alerts" label="报警次数" width="80" align="center">
      </el-table-column>
      <el-table-column prop="projectType" label="类型" width="80" align="center">
      </el-table-column>
      <el-table-column prop="creator" label="创建用户" align="center">
      </el-table-column>
      <el-table-column prop="createtime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <router-link class="btn-view" :to="`/project-detail/${scope.row._id}`">查看</router-link>
          <router-link class="btn-view" :to="`/upload-map/${scope.row._id}`">上传</router-link>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import {queryProjectList} from '../api/project';
import {Project} from '../api/interface';

export default Vue.extend({
  name: 'home',
  data() {
    return {
      projectList: [],
      page: 1,
      size: 20,
      projectType: '',
      projectName: '',
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    queryList() {
      queryProjectList(this.projectName, this.projectType, this.page, this.size)
        .then((result: any) => {
          if (Array.isArray(result.data)) {
            this.projectList = result.data.map((item: Project) => {
              item.createtime = dayjs(item.createtime).format('YYYY-MM-DD hh:MM:ss');
              return item;
            });
          } else {
            this.$message.warning('数据格式错误');
          }
        })
        .catch((err: any) => console.log(err));
    },
  },
});
</script>

<style lang="scss" scoped>
.card-name + a {
  float: right;
  margin-top: -9px;
}
.btn-view {
  & + .btn-view {
    margin-left: 10px;
  }
}
</style>
