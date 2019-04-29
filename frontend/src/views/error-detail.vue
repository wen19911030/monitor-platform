<template>
  <div class="panel panel-error-detail">
    <el-card>
      <div slot="header">
        <span class="card-name">错误详情</span>
      </div>
      <ul class="flex-wrap">
        <li class="flex-wrap">
          <span class="title">项目名称</span>
          <span class="content">{{deatil.project.projectName}}</span>
        </li>
        <li class="flex-wrap">
          <span class="title">项目创建人员</span>
          <span class="content">{{deatil.project.creator}}</span>
        </li>
        <li class="flex-wrap">
          <span class="title">报错原因</span>
          <span class="content">{{deatil.log.data && deatil.log.data.logInfo && deatil.log.data.logInfo.desc}}</span>
        </li>
        <li class="flex-wrap">
          <span class="title">报错时间</span>
          <span class="content">{{deatil.log.happendTime}}</span>
        </li>
      </ul>
    </el-card>
    <el-card>
      <div slot="header">
        <span class="card-name">浏览器信息</span>
      </div>
      <ul class="flex-wrap">
        <li class="flex-wrap">
          <span class="title">页面url</span>
          <span class="content">{{deatil.log.url}}</span>
        </li>
        <li class="flex-wrap">
          <span class="title">页面标题</span>
          <span class="content">{{deatil.log.title}}</span>
        </li>
        <li class="flex-wrap">
          <span class="title">浏览器尺寸</span>
          <span class="content">高度：{{deatil.log.screenH}}；宽度：{{deatil.log.screenW}}</span>
        </li>
        <li class="flex-wrap">
          <span class="title">浏览器版本</span>
          <span class="content">{{languageInfo}}</span>
        </li>
      </ul>
    </el-card>
    <el-card>
      <div slot="header">
        <span class="card-name">代码信息</span>
      </div>
      <ul class="flex-wrap">
        <li class="flex-wrap">
          <span class="title">代码source</span>
          <span class="content">{{deatil.error.detail && deatil.error.detail.source}}</span>
        </li>
        <li class="flex-wrap">
          <span class="title">代码定位</span>
          <span class="content">line：{{deatil.error.detail && deatil.error.detail.line}}, column：{{deatil.error.detail && deatil.error.detail.column}}</span>
        </li>
        <li class="flex-wrap">
          <span class="title">错误代码</span>
          <span class="content" v-html="deatil.error.detail && deatil.error.detail.code"></span>
        </li>
        <li class="flex-wrap">
          <span class="title">错误stack</span>
          <span class="content">{{deatil.log.data && deatil.log.data.logInfo && deatil.log.data.logInfo.stack}}</span>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import {queryErrorDetail} from '../api/jserror';
export default Vue.extend({
  name: 'error-detail',
  props: ['id'],
  data() {
    return {
      deatil: {
        project: {},
        error: {},
        log: {},
      },
      languageInfo: '',
    };
  },
  created() {
    const pId = this.$route.params.pId;
    const logId = this.$route.params.logId;
    this.queryDetail(pId, logId);
  },
  methods: {
    queryDetail(pId: string, logId: string) {
      queryErrorDetail(pId, logId)
        .then((result: any) => {
          const {project, error, log} = result;
          this.deatil.project = project;
          this.deatil.error = error;
          log.happendTime = dayjs(log.happendTime).format('YYYY-MM-DD hh:MM:ss');
          this.deatil.log = log;
          const deviceInfo = (this.deatil.log as any).data.logInfo.deviceInfo;
          Object.keys(deviceInfo).forEach((key) => {
            this.languageInfo += `${key}: ${deviceInfo[key]}  ,  `;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
});
</script>

<style lang="scss" scoped>
.el-card {
  overflow: visible;
  margin-bottom: 20px;
}
ul {
  flex-wrap: wrap;
  li {
    width: 47%;
    // height: ;
    border-bottom: 1px solid #ebf0fa;
    align-items: center;
    box-sizing: border-box;
    font-size: 14px;
    margin-bottom: 15px;
    &:nth-child(2n) {
      margin-left: 6%;
    }
    .title {
      width: 8em;
      color: #60aeff;
    }
    .content {
      flex: 2;
      color: #333;
    }
  }
}
</style>
