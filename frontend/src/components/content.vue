<template>
  <el-container class="layout">
    <el-aside class="wrap-nav" width="200px;">
      <h3 class="logo">监控管理平台</h3>
      <el-menu router class="el-menu-vertical" background-color="#26354b" text-color="#fff" :default-active="defaultActive" active-text-color="#ffd04b">
        <el-menu-item index="/">
          <svg-icon name="home"></svg-icon>
          <span class="nav-stair-title" slot="title">主页</span>
        </el-menu-item>
        <el-submenu index="/user">
          <template slot="title">
            <svg-icon name="icon-user"></svg-icon>
            <span class="nav-stair-title">用户管理</span>
          </template>
          <el-menu-item index="/user/change-password">修改密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="/project-list">
          <svg-icon name="project"></svg-icon>
          <span class="nav-stair-title" slot="title">项目管理</span>
        </el-menu-item>
        <el-menu-item index="/error-list">
          <svg-icon name="monitor"></svg-icon>
          <span class="nav-stair-title" slot="title">监控错误管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container class="con">
      <el-header class="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item, index) in crumbs" :key="index" :to="{name: item.name}" :class="{'can-click': item.name && index !== crumbs.length - 1}">{{item.value}}</el-breadcrumb-item>
        </el-breadcrumb>
        <ul class="flex-wrap">
          <li>
            <img src="../assets/images/icon-avator.png" alt="">
            <el-dropdown trigger="click">
            <div class="el-dropdown-link">
              <span>欢迎您：{{userInfo.username}}</span> <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="mid-flex"><router-link to="/user/change-password" tag="span">修改密码</router-link> </el-dropdown-item>
              <el-dropdown-item class="mid-flex"><span @click.stop.prevent="whiteOff">注销</span> </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          </li>
          <li @click.stop="singout"><img src="../assets/images/icon-off.png" alt=""></li>
        </ul>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Vue from 'vue';
import {writeOff} from '@/api/user';
export default Vue.extend({
  name: 'layout',
  data() {
    return {
      crumbs: [],
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  watch: {
    $route: {
      handler(to, from) {
        this.defaultActive = to.path;
        this.crumbs = to.name !== 'pagenotfind' ? to.meta.crumbs : [];
      },
      immediate: true,
    },
  },
  methods: {
    singout() {
      this.$store.dispatch('LOGOUT').finally(() => {
        this.$router.replace('/login');
      });
    },
    whiteOff() {
      this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          writeOff()
            .then((result) => {
              this.$message.success('账号注销成功');
              this.$store.commit('USERINFO', {});
              this.$router.push({path: '/login'});
            })
            .catch(console.error);
        })
        .catch(console.error);
    },
  },
});
</script>

<style lang="scss" scoped>
.layout {
  position: relative;
  display: flex;
  height: 100%;
  min-height: 100%;
  background-color: #f7f7f7;
  .wrap-nav {
    width: 200px;
    background-color: #26354b;
  }
  .con {
    flex: 1;
    display: flex;
    .header {
      height: 60px;
      background-color: #26354b;
    }
    .main {
      flex: 1;
      padding: 15px 10px;
      box-sizing: border-box;
    }
  }
}

@media screen and (max-width: 1279px) {
  body {
    overflow-x: auto;
  }
  #app .page-decision {
    width: 1279px;
  }
  #app .con,
  #app .main,
  #app .header {
    width: 1080px;
  }
}
.wrap-nav {
  color: #fff;
  .logo {
    margin: 15px 0 25px 20px;
    padding: 5px 0 5px 30px;
    font-size: 20px;
    color: #ffffff;
  }
  svg {
    margin-right: 5px;
  }
}
.header {
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-breadcrumb {
    float: left;
    line-height: 60px;
  }
  ul {
    height: 30px;
    li {
      float: left;
      color: #fff;
      display: flex;
      align-items: center;
      font-size: 14px;
      &:first-child {
        padding-right: 10px;
        img {
          width: 30px;
          margin-right: 5px;
        }
      }
      .el-dropdown {
        color: #fff;
        .el-dropdown-link {
          cursor: pointer;
        }
      }
      &:last-child {
        cursor: pointer;
        img {
          width: 22px;
        }
      }
      & + li {
        padding-left: 10px;
        &::before {
          position: relative;
          display: block;
          content: '';
          left: -10px;
          // margin-left: -10px;
          width: 1px;
          height: 20px;
          background: rgba(255, 255, 255, 0.7);
        }
        // border-left: 1px solid;
      }
    }
  }
}
.nav-stair-title {
  padding-left: 10px;
}
</style>
