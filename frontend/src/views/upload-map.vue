<template>
  <el-card>
    <div slot="header">
      <span class="card-name">上传map文件</span>
    </div>
    <div class="upload-container">
      <!-- <div tabindex="0" class="el-upload el-upload--text">
        <div class="el-upload-dragger"><i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </div><input type="file" name="file" class="el-upload__input" multiple @change.stop="change">
      </div>
      <ul class="el-upload-list el-upload-list--text"></ul> -->
      <el-upload ref="upload" class="upload-demo" drag action="/api/upload/jsmap" :before-upload="beforeUpload" :data="uploadData" :on-error="error" :on-success="success" :on-change="change" multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jsmap文件，且不超过5M</div>
      </el-upload>
    </div>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue';
import {uploadMap} from '../api/upload';

export default Vue.extend({
  name: 'upload-map',
  data() {
    return {
      id: '',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      uploadData: {
        username: this.$store.state.userInfo.username,
        id: this.$route.params.id,
      },
    };
  },
  created() {
    this.id = this.$route.params.id;
  },
  methods: {
    change(file: any, fileList: any) {
      console.log(file);
    },
    success(response: any, file: any, fileList: any) {
      console.log(response);
    },
    error(err: any, file: File, fileList: File[]) {
      console.log(file);
    },
    beforeUpload(file: any) {
      if (file.name.slice(-7) === '.js.map' && file.size < 5 * 1024 * 1024) {
        return true;
      }
      return false;
    },
  },
});
</script>

<style lang="scss" scoped>
.el-upload {
  position: relative;
  .el-upload__input {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: block;
    opacity: 0;
    z-index: 1;
  }
}
</style>
