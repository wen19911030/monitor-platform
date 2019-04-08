import Vue from 'vue';
import Vuex from 'vuex';

import {login, logout, getInfo, register} from '@/api/user.ts';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false, // 请求正在加载
  },
  mutations: {
    SHOW_LOADING(state) {
      state.isLoading = true;
    },
    CLOSE_LOADING(state) {
      state.isLoading = false;
    },
  },
  actions: {
    LOGIN({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo.username.trim(), userInfo.userpwd.trim())
          .then((result) => {
            commit('USERINFO', result.data);
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
});
