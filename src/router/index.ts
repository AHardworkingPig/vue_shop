import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

const Login = () => import('@/views/Login.vue');
const Home = () => import('@/views/Home.vue');
const Welcome = () => import('@/views/Welcome.vue');
const Users = () => import('@/components/user/Users.vue');

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
    redirect: '/welcome',
    component: Home,
    children: [
      {
        path: '/welcome',
        component: Welcome,
      },
      {
        path: '/users',
        component: Users,
      },
    ],
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
