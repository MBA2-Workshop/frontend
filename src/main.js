import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store';
import './index.css'
import './assets/styles/global.css'

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app');
