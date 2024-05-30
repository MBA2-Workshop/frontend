import { createRouter, createWebHistory } from 'vue-router';
import Signin from '../views/Signin.vue';
import Signup from '../views/Signup.vue';
import Pedagogie from '../views/Pedagogie.vue';

const routes = [
  {
    path: '/',
    name: 'Signin',
    component: Signin
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/pedagogie',
    name: 'Pedagogie',
    component: Pedagogie
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
