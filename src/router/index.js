import { createRouter, createWebHistory } from 'vue-router';
import Signin from '../views/Signin.vue';
import Signup from '../views/Signup.vue';
import Pedagogie from '../views/Pedagogie.vue';
import SetPassword from '../views/SetPassword.vue';

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
  },
  {
    path: '/set-password',
    name: 'SetPassword',
    component: SetPassword
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
