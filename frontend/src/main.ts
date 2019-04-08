import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';

import '@/plugins/element-ui.ts';

import '@/assets/css/reset.css';
import '@/assets/css/base.css';
import '@/assets/css/element-reset.scss';

import svgIcon from '@/components/svg-icon.vue';
Vue.component('svg-icon', svgIcon);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
