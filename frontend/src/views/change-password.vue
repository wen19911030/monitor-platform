<template>
  <div class="wrapper password-wrapper">
    <el-card class="box-card">
      <div slot="header">
        <span class="card-name">修改密码</span>
      </div>
      <el-form class="password-form" status-icon auto-complete="off" :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-position="right" label-width="100px">
        <el-form-item label="旧密码" prop="pass">
          <el-input type="password" v-model="passwordForm.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input type="password" v-model="passwordForm.newPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="passwordForm.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleFunc()">
            确 定
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import nodeRSA from 'node-rsa';
import {pubKey} from '@/assets/pub.key.ts';
import {changePass} from '@/api/user';

const rsakey = new nodeRSA(pubKey);
rsakey.setOptions({encryptionScheme: 'pkcs1'});
export default Vue.extend({
  name: 'change-password',
  data() {
    const validatePass = (rule: any, value: string, callback: (parm1?: any) => void) => {
      const reg = /^\w{8,16}$/;
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!reg.test(value)) {
        callback(new Error('密码格式错误，只支持数字，字母和下划线，长度为8到16位'));
      } else {
        callback();
      }
    };
    const validatePass2 = (rule: any, value: string, callback: (parm1?: any) => void) => {
      const passwordForm: any = (this as any).passwordForm;
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== passwordForm.newPass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      passwordForm: {
        pass: '',
        newPass: '',
        checkPass: '',
      },
      passwordRules: {
        pass: [{validator: validatePass, trigger: 'blur'}],
        newPass: [{validator: validatePass, trigger: 'blur'}],
        checkPass: [{validator: validatePass2, trigger: 'blur'}],
      },
      loading: false,
    };
  },
  methods: {
    handleFunc() {
      this.loading = true;
      const ref: any = this.$refs.passwordForm;
      ref.validate((valid: boolean) => {
        if (valid) {
          const oldPass = rsakey.encrypt(this.passwordForm.pass, 'base64');
          const newPass = rsakey.encrypt(this.passwordForm.newPass, 'base64');
          changePass(oldPass, newPass)
            .then(() => {
              this.loading = false;
              this.$confirm(`密码更换成功，是否重新登录`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success',
              })
                .then(() => {
                  this.$store
                    .dispatch('LOGOUT')
                    .then(() => {
                      this.$router.push({path: '/login'});
                    })
                    .catch((err: any) => {
                      console.log(err);
                    });
                })
                .catch((err: any) => {
                  console.log(err);
                });
            })
            .catch((err: any) => {
              console.log(err);
              this.loading = false;
            });
        } else {
          this.loading = false;
          return false;
        }
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.el-form {
  width: 450px;
}
</style>
