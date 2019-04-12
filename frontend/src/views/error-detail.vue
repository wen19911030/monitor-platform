<template>
  <div class="panel panel-error-detail">
    <el-card>
      <div slot="header">
        <span class="card-name">错误详情</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="10">
          <span class="title">项目名称</span>
          <span class="content">{{deatil.project.projectName}}</span>
        </el-col>
        <el-col :span="10">
          <span class="title">项目创建人员</span>
          <span class="content">{{deatil.project.creator}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <span class="title">报错原因</span>
          <span class="content">{{deatil.log.data && deatil.log.data.logInfo && deatil.log.data.logInfo.desc}}</span>
        </el-col>
        <el-col :span="10">
          <span class="title">报错时间</span>
          <span class="content">{{deatil.log.happendTime}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <span class="title">错误类型</span>
          <span class="content">{{deatil.error.type}}</span>
        </el-col>
        <el-col :span="10">
          <span class="title">浏览器尺寸</span>
          <span class="content">高度：{{deatil.log.screenH}}；宽度：{{deatil.log.screenW}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <span class="title">浏览器信息</span>
          <span class="content">{{languageInfo}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <span class="title">页面url</span>
          <span class="content">{{deatil.log.url}}</span>
        </el-col>
        <el-col :span="10">
          <span class="title">页面标题</span>
          <span class="content">{{deatil.log.title}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <span class="title">代码source</span>
          <span class="content">{{deatil.error.detail && deatil.error.detail.source}}</span>
        </el-col>
        <el-col :span="10">
          <span class="title">代码定位</span>
          <span class="content">line：{{deatil.error.detail && deatil.error.detail.line}}, column：{{deatil.error.detail && deatil.error.detail.column}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <span class="title">错误代码</span>
          <span class="content" v-html="deatil.error.detail && deatil.error.detail.code"></span>
        </el-col>
        <el-col :span="10">
          <span class="title">错误stack</span>
          <span class="content">{{deatil.log.data && deatil.log.data.logInfo && deatil.log.data.logInfo.stack}}</span>
        </el-col>
      </el-row>
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
        .then((result) => {
          console.log(result);
          const {project, error, log} = result.data;
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
.el-row {
  margin-bottom: 15px;
  .title {
    display: inline-block;
    text-align: right;
    width: 100px;
    margin-right: 15px;
    color: #333;
  }
  .content {
    color: blue;
    position: absolute;
  }
}
.el-card {
  overflow: visible;
  padding-bottom: 280px;
}
</style>
