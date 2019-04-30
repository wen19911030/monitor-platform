<template>
  <div class="page project-detail">
    <el-card>
      <div slot="header">
        <span class="card-name">今日统计数据</span>
      </div>
      <ul class="analytics flex-wrap">
        <li><a href="" class="mid-flex"><span>PV</span><em>{{analyticsData.pv}}</em></a></li>
        <li><a href="" class="mid-flex"><span>UV</span><em>{{analyticsData.uv}}</em></a></li>
        <li><a href="" class="mid-flex"><span>IP</span><em>{{analyticsData.ip}}</em></a></li>
      </ul>
    </el-card>
    <div class="flex-wrap">
      <el-card>
        <div slot="header">
          <span class="card-name">性能数据</span>
        </div>
        <!-- 今日 -->
        <el-date-picker v-model="dates" type="daterange" align="right" unlink-panels range-separator="至" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" @change="queryPerformance">
        </el-date-picker>
        <ul class="performance">
          <li class="flex-wrap">
            <span class="title"> DNS 查询时间</span>
            <span class="conten">{{performanceData.lookupDomain}} ms</span>
          </li>
          <li class="flex-wrap">
            <span class="title">TCP 建立连接完成握手的时间</span>
            <span class="conten">{{performanceData.connect}} ms</span>
          </li>
          <li class="flex-wrap">
            <span class="title">内容加载完成的时间</span>
            <span class="conten">{{performanceData.request}} ms</span>
          </li>
          <li class="flex-wrap">
            <span class="title">解析 DOM 树结构的时间</span>
            <span class="conten">{{performanceData.domReady}} ms</span>
          </li>
          <li class="flex-wrap">
            <span class="title">执行 onload 回调函数的时间</span>
            <span class="conten">{{performanceData.loadEvent}} ms</span>
          </li>
          <li class="flex-wrap">
            <span class="title">页面加载完成的时间</span>
            <span class="conten">{{performanceData.loadPage}} ms</span>
          </li>
        </ul>
      </el-card>
      <el-card>
        <div slot="header">
          <span class="card-name">错误报告</span>
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
import {queryProjectPerformance, queryProjectAnalytics} from '@/api/project.ts';
export default Vue.extend({
  name: 'project-detail',
  data() {
    return {
      id: '',
      dates: ['2019-04-30', '2019-04-30'],
      performanceData: {},
      analyticsData: {},
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.queryPerformance();
    this.queryAnalytics();
  },
  methods: {
    queryPerformance() {
      queryProjectPerformance(this.id, this.dates[0], this.dates[1])
        .then((result) => {
          console.log(result);
          this.performanceData = result;
        })
        .catch(console.error);
    },
    queryAnalytics() {
      queryProjectAnalytics(this.id, this.dates[0], this.dates[1])
        .then((result) => {
          console.log(result);
          this.analyticsData = result;
        })
        .catch(console.error);
    },
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
.analytics {
  li {
    flex: 1;
    a {
      flex-direction: column;
    }
    span {
      font-size: 24px;
      color: #60aeff;
    }
    em {
      font-size: 36px;
      color: #333;
      font-style: normal;
    }
  }
}
.performance {
  margin-top: 15px;
  li {
    align-items: center;
    height: 34px;
    margin-bottom: 15px;
    border-bottom: 1px solid #ebf0fa;
    box-sizing: border-box;
    font-size: 14px;
    .title {
      width: 220px;
      color: #60aeff;
    }
    .content {
      flex: 1;
      color: #333;
    }
  }
}
</style>
