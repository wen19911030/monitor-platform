<template>
  <el-card>
    <div slot="header">
      <span class="card-name">
        错误列表
      </span>
    </div>
    <el-table :data="errorList">
      <el-table-column prop="projectId" label="项目编号" width="220">
      </el-table-column>
      <el-table-column label="错误页面" width="220">
        <template slot-scope="scope">
          <span>{{scope.row.detail.source}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发生时间">
        <template slot-scope="scope">
          <span>{{scope.row.happendTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="错误类型">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <router-link class="btn-view" :to="`/error-detail/${scope.row.projectId}/${scope.row.logId}`">详情</router-link>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import {queryErrorList} from '../api/jserror';

const errorArr: any[] = [];

export default Vue.extend({
  name: 'error-list',
  data() {
    return {
      errorList: errorArr,
      startTime: '',
      endTime: '',
      projectId: '',
      errorType: '',
      page: 1,
      size: 20,
      total: 0,
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    queryList() {
      queryErrorList(this.projectId, this.errorType, this.startTime, this.endTime, this.page, this.size)
        .then((result: any) => {
          if (Array.isArray(result.list)) {
            this.total = result.total || 0;
            this.errorList = result.list.map((item: any) => {
              item.createtime = dayjs(item.createtime).format('YYYY-MM-DD hh:MM:ss');
              item.happendTime = dayjs(item.happendTime).format('YYYY-MM-DD hh:MM:ss');
              return item;
            });
          } else {
            this.$message.warning('数据格式错误');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
