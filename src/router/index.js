import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';
import LoginPage from '@/views/LoginPage.vue';
import ManagerMainPage from '@/views/ManagerMainPage.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: {
      isLoginRoute: true,
    },
  },
  {
    path: '/',
    name: 'ManagerMain',
    component: ManagerMainPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      next('/login');
      return;
    }
  }
  if (to.matched.some((record) => record.meta.isLoginRoute)) {
    if (store.getters.isLoggedIn) {
      next('/');
      return;
    }
  }
  next();
});

export default router;
