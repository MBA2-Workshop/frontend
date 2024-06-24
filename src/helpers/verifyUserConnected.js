import { useUserStore } from '../store/user';
// import { useRoute, useRouter } from 'vue-router';
import axiosInstance from '../services/axiosInstance'

export default async function verifyUserConnected() {
  const userStore = useUserStore();
  // const route = useRoute();
  // const router = useRouter();

  // if (!localStorage.getItem('accessToken') && route.name !== 'Signin' && route.name !== 'Signup' && route.name !== 'SetPassword') {
  //   router.push({ name: 'Signin' });
  // } else if (localStorage.getItem('accessToken') && (route.name === 'Signin' || route.name === 'Signup' || route.name === 'SetPassword')) {
  //   router.push({ name: 'Pedagogie' });
  // }

  if (!userStore.user && localStorage.getItem('accessToken')) {
    try {
      const response = await axiosInstance.get('/user/user');
      userStore.setUser(response.data[0]);
    } catch (error) {
      console.error(error);
    }
  }
};
