console.log('main.js 시작')

import { createApp } from 'vue';
import App from './App.vue';
import './assets/styles/main.scss';
import router from './router/index.js';

const app = createApp(App)
console.log('app 생성됨')

app.use(router)
app.mount('#app')

// createApp(App).use(router).mount('#app');
// createApp(App).mount('#app');

console.log('mount 완료')
