<template>
  <div class="wrapper login-wrapper">
    <el-form class="login-form" autoComplete="off" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <h3 class="title">登录</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon name="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="off" placeholder="username" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon name="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="off" placeholder="password"></el-input>
        <span class="show-pwd" @click="showPwd">
          <svg-icon :name="eyeStatus" /></span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <div class="tips">
        <router-link to="/register" style="margin-right:20px;">注册新用户</router-link>
        <router-link to="/find-password">忘记密码</router-link>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import nodeRSA from 'node-rsa';
import {pubKey} from '@/assets/pub.key.ts';

const rsakey = new nodeRSA(pubKey);
rsakey.setOptions({encryptionScheme: 'pkcs1'});
export default Vue.extend({
  name: 'login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        userpwd: '',
      },
      loginRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
          {
            min: 4,
            max: 12,
            message: '长度在 4 到 12 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
          {
            min: 8,
            max: 15,
            message: '长度在 8 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
      loading: false,
      pwdType: 'password',
      eyeStatus: 'eye-open',
    };
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'text') {
        this.pwdType = 'password';
        this.eyeStatus = 'eye-open';
      } else {
        this.pwdType = 'text';
        this.eyeStatus = 'eye-close';
      }
    },
    handleLogin() {
      this.loading = true;
      const ref: any = this.$refs.loginForm;
      ref.validate((valid: boolean) => {
        if (valid) {
          this.loginForm.userpwd = rsakey.encrypt(this.loginForm.password, 'base64');
          this.$store
            .dispatch('LOGIN', this.loginForm)
            .then(() => {
              this.loading = false;
              this.$message({
                type: 'success',
                message: '登录成功',
              });
              this.$router.push({path: '/'});
            })
            .catch((err) => {
              console.error(err);
              this.loading = false;
            });
        } else {
          console.log('error submit!!');
          this.loading = false;
          return false;
        }
      });
    },
  },
});
</script>

<style lang="scss">
</style>
