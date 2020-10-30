import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

const Login = () => import('@/views/Login.vue');
const Home = () => import('@/views/Home.vue');

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // login 放行
  if (to.path === '/login') {
    return next();
  }

  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');

  if (tokenStr === null) {
    return next('/login');
  }

  next();

});

export default router;
