import Vue from 'vue';
import Vuex from 'vuex';

import {login, logout, getInfo, register} from '@/api/user.ts';
import {UserInfo} from '@/api/interface.ts';

Vue.use(Vuex);

const UserInfo: UserInfo = {
  username: '',
  email: '',
};

export default new Vuex.Store({
  state: {
    isLoading: false, // 请求正在加载
    userInfo: UserInfo,
  },
  mutations: {
    SHOW_LOADING(state) {
      state.isLoading = true;
    },
    CLOSE_LOADING(state) {
      state.isLoading = false;
    },
    UPDATE_USERINFO(state, result) {
      Object.assign(state.userInfo, result);
    },
  },
  actions: {
    LOGIN({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo.username.trim(), userInfo.userpwd.trim())
          .then((result) => {
            commit('UPDATE_USERINFO', result);
            resolve('ok');
          })
          .catch((err) => reject(err));
      });
    },
    REGISTER({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        register(userInfo.username.trim(), userInfo.userpwd.trim(), userInfo.email.trim())
          .then((result) => {
            commit('UPDATE_USERINFO', result.data);
            resolve(result);
          })
          .catch((err) => reject(err));
      });
    },
    GETINFO({commit}, flag) {
      return new Promise((resolve, reject) => {
        getInfo(flag)
          .then((data: any) => {
            if (data.username) {
              commit('UPDATE_USERINFO', data);
              resolve('ok');
            } else {
              reject(data);
            }
          })
          .catch((err) => reject(err));
      });
    },
    LOGOUT({commit}) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            commit('UPDATE_USERINFO', UserInfo);
            resolve('ok');
          })
          .catch((err) => reject(err));
      });
    },
  },
});
