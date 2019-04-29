import Vue from 'vue';
import axios from 'axios';
import { Message } from 'element-ui';
import store from '@/store.ts';
import { list2, list3, list4 } from '@/assets/js/connect.list.ts';
import { __exportStar } from 'tslib';

const baseURL: string = process.env.VUE_APP_API_ROOT || '';
const reg = new RegExp(baseURL);
const CancelToken = axios.CancelToken;
const pending: string[] = []; // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const removePending = (config: any, f?: () => void) => {
  const url = config.url.split('?')[0].replace(reg, '');
  const i = pending.indexOf(url);
  if (i > -1) {
    if (typeof f === 'function') {
      f();
    } else {
      pending.splice(i, 1);
    }
  } else {
    pending.push(url);
  }
};

// 加载进度设置
let requestCount = 0;
const handleRequestLoading = () => {
  requestCount++;
  if (requestCount) {
    store.commit('SHOW_LOADING');
  }
};
const handleResponseLoading = () => {
  if (requestCount > 0) {
    requestCount--;
    if (!requestCount) {
      store.commit('CLOSE_LOADING');
    }
  }
};

const request = axios.create({
  baseURL,
  timeout: 5000,
});

const retry = {
  count: 2,
  delay: 1000,
};

request.interceptors.request.use(
  (config: any) => {
    const url = config.url.split('?')[0].replace(reg, '');
    handleRequestLoading();
    // 判断该请求是不是可以重复发送；
    const isCanRepeat = list2.some((item) => item.indexOf(url) > -1);
    if (!isCanRepeat) {
      // 取消请求
      config.cancelToken = new CancelToken((c) => {
        removePending(config, c);
      });
    }
    return config;
  },
  (error) => {
    console.log(error.config);
    handleResponseLoading();
    return Promise.reject(error);
  },
);

// Add a response interceptor
request.interceptors.response.use(
  (response) => {
    handleResponseLoading();
    removePending(response.config);
    const res = response.data;
    if (res.status !== 0) {
      // 用户未登录
      if (res.status === -1) {
        Message.warning(res.message);
        return Promise.reject(new Error('error'));
      }
      // 不需要在拦截器提示的，params参数里有interceptorHint信息，且等于needless
      if (!(response.config.params && response.config.params.interceptorHint === 'needless')) {
        Message.warning(res.message);
      }
      return Promise.reject(new Error('error'));
    }
    return res.data;
  },
  (error) => {
    if (axios.isCancel(error)) {
      handleResponseLoading();
      console.log('Request canceled');
    } else {
      const config = error.config;
      removePending(config);
      if (!config || !config.retry) {
        handleResponseLoading();
        Message.error(error.message);
        return Promise.reject(error);
      }
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount >= retry.count) {
        handleResponseLoading();
        Message.error(error.message);
        return Promise.reject(error);
      }
      config.__retryCount += 1;
      const backoff = new Promise((resolve) => {
        setTimeout(() => {
          handleResponseLoading();
          Vue.nextTick(() => {
            resolve();
          });
        }, config.delay || 1);
      });

      return backoff.then(() => {
        return request(config);
      });
    }
    return Promise.reject(error);
  },
);

export default request;
