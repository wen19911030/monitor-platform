<template>
  <el-card>
    <div slot="header">
      <span class="card-name">添加新项目</span>
    </div>
    <el-form ref="createForm" :model="createForm" label-width="80px" :rules="rules">
      <el-form-item label="项目名称">
        <el-input v-model="createForm.name"></el-input>
      </el-form-item>
      <el-form-item label="项目描述">
        <el-input type="textarea" v-model="createForm.desc" :rows="4"></el-input>
      </el-form-item>
      <el-form-item label="项目类型">
        <el-radio-group v-model="createForm.type">
          <el-radio label="public">公共</el-radio>
          <el-radio label="private">私有</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="通知方式">
        <el-checkbox-group v-model="createForm.noticeType">
          <el-checkbox label="email">邮箱</el-checkbox>
          <el-checkbox label="note" disabled>短信</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="onSubmit">立即创建</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="操作步骤" :visible.sync="dialogVisible" width="50%">
      <section>
        <p>将下列代码复制到html文件中<span class="tips">最好放在&lt;/head&gt;标签上方</span></p>
        <pre><code>
    &lt;script&gt;
      var _waq = _waq || [];
      _waq.push(['_setAccount', '{{accountId}}']);
      (function () {
        var w = document.createElement('script');
        w.src = 'http://47.102.141.180/sdk/waq.js';
        w.async = true;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(w, s);
      })();
    &lt;/script&gt;
          </code>
        </pre>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue';
import {createProject} from '../api/project';

export default Vue.extend({
  name: 'project-create',
  data() {
    return {
      createForm: {
        name: '决策工作台',
        desc: '用来风控人员进行决策分析',
        type: 'private',
        noticeType: ['email'],
      },
      accountId: '',
      dialogVisible: false,
      rules: {
        name: [
          {
            required: true,
            message: '请输入项目名称',
            trigger: 'blur',
          },
        ],
        type: [
          {
            required: true,
            message: '请选择项目类型',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    onSubmit() {
      const ref: any = this.$refs.createForm;
      ref.validate((valid: boolean) => {
        if (valid) {
          createProject(this.createForm.name, this.createForm.desc, this.createForm.type)
            .then((result: any) => {
              this.accountId = result._id;
              this.dialogVisible = true;
            })
            .catch((err: any) => {
              console.log(err);
            });
        } else {
          console.log('error submit!!');
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
