import { createRouter, createWebHistory } from 'vue-router';
import { authStore } from '@/stores/authStore.js';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
      path: '/management',
      component:  import('@/layouts/DefaultLayout.vue'),
      children: [
        { path: '/', component: import('@/views/Dashboard.vue'), meta: { requiresAuth: true }},
        { path: '/user', component: import('@/views/User.vue'), meta: { requiresAuth: true }},
        { path: '/home', component: import('@/views/Home.vue'), meta: { requiresAuth: true } },
        { path: '/categories', component: import('@/views/Category.vue'),  meta: { requiresAuth: true } },
        { path: '/spend-type', component: import('@/views/SpendType.vue'), meta: { requiresAuth: true } },
        { path: '/spending', component: import('@/views/Spending.vue'), meta: { requiresAuth: true } },
        { path: '/template', component: import('@/views/Template.vue'), meta: { requiresAuth: true } },
      ]
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  router.beforeEach((to, from, next) => {
    const auth = authStore()
    console.log('AUTH : ',auth.isAuthenticated);
    // if (to.meta.requiresAuth && !auth.isAuthenticated) {
    //   // Nếu chưa đăng nhập mà đi vào trang cần login
    //   console.log('access login');
    //   next('/login')
    // } else if (auth.isAuthenticated) {
    //   // Nếu đã đăng nhập mà đi vào login thì redirect về dashboard
    //   console.log('Auth ok');
    //   next('/management')

    // } else {
    //   // Cho phép đi tiếp
    //   console.log('????');
    //   next('/login')

    // }
    if (to.path === '/login' && auth.isAuthenticated) {
      next('/management') // hoặc next({ name: 'Dashboard' })
    } else {
      next()
    }
  })
export default router;