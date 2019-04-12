import Vue from 'vue';
import Router, {Route} from 'vue-router';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import store from './store';

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
          path: '/project-list',
          name: 'project-list',
          component: () => import('@/views/project-list.vue'),
          meta: {
            crumbs: [{name: '', value: '项目管理'}],
          },
        },
        {
          path: '/project-create',
          name: 'project-create',
          component: () => import('@/views/project-create.vue'),
          meta: {
            crumbs: [{name: '', value: '创建项目'}],
          },
        },
        {
          path: '/project-detail/:id',
          name: 'project-detail',
          component: () => import('@/views/project-detail.vue'),
          meta: {
            crumbs: [{name: '', value: '项目详情'}],
          },
        },
        {
          path: '/upload-map/:id',
          name: 'upload-map',
          component: () => import('@/views/upload-map.vue'),
          meta: {
            crumbs: [{name: '', value: '项目详情'}],
          },
        },
        {
          path: '/error-list',
          name: 'error-list',
          component: () => import('@/views/error-list.vue'),
          meta: {
            crumbs: [{name: '', value: '错误列表'}],
          },
        },
        {
          path: '/error-detail/:pId/:logId',
          name: 'error-detail',
          component: () => import('@/views/error-detail.vue'),
          meta: {
            crumbs: [{name: '', value: '错误详情'}],
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

function isLoginCB(to: Route, next: (parm?: any) => void) {
  if (to.path === '/login') {
    next({path: '/'});
  } else {
    next();
  }
  NProgress.done();
}

const whiteList = ['/login', '/register', '/find-password']; // 不重定向白名单
router.beforeEach((to: Route, from: Route, next) => {
  NProgress.start();
  if (store.state.userInfo.username) {
    isLoginCB(to, next);
  } else {
    store
      .dispatch('GETINFO', 'needless')
      .then(() => {
        isLoginCB(to, next);
      })
      .catch(() => {
        NProgress.done();
        if (whiteList.includes(to.path)) {
          next();
        } else {
          next('/login');
        }
      });
  }
});

router.afterEach(() => {
  NProgress.done();
  NProgress.remove();
});

export default router;
