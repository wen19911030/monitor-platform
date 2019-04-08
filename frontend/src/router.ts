import Vue from 'vue';
import Router from 'vue-router';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';

NProgress.configure({showSpinner: false});

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '',
      component: () => import('@/components/content.vue'),
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('@/views/home.vue'),
          meta: {
            crumbs: [{name: 'home', value: '主页'}],
          },
        },
        {
          path: '/user/change-password',
          name: 'change-password',
          component: () => import('@/views/change-password.vue'),
          meta: {
            crumbs: [{name: '', value: '用户管理'}, {name: 'change-password', value: '修改密码'}],
          },
        },
        {
          path: 'project/list',
          name: 'project-list',
          component: () => import('@/views/project-list.vue'),
          meta: {
            crumbs: [{name: '', value: '项目管理'}],
          },
        },
        {
          path: 'project/create',
          name: 'project-create',
          component: () => import('@/views/project-create.vue'),
          meta: {
            crumbs: [{name: '', value: '创建项目'}],
          },
        },
        {
          path: 'project/detail/:id',
          name: 'project-detail',
          component: () => import('@/views/project-detail.vue'),
          meta: {
            crumbs: [{name: '', value: '项目详情'}],
          },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register.vue'),
    },
    {
      path: '/find-password',
      name: 'find-password',
      component: () => import('@/views/find-password.vue'),
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/404.vue'),
    },
    {
      path: '*',
      redirect: '/404',
    },
  ],
});

router.afterEach(() => {
  NProgress.done();
  NProgress.remove();
});

export default router;
