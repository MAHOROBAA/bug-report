import { createRouter, createWebHistory } from 'vue-router';

import Splash from '@/pages/splash/index.vue';
import Signup from '@/pages/signup/index.vue';
import Report from '@/pages/report/index.vue';
import Mypage from '@/pages/mypage/index.vue';
import TermsModal from '@/pages/signup/TermsModal.vue';
import GroupJoin from '@/pages/signup/GroupJoin.vue';
import GroupCreate from '@/pages/signup/GroupCreate.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/splash' },
    { path: '/splash', component: Splash },
    { path: '/signup', component: Signup },
    { path: '/report', component: Report },
    { path: '/mypage', component: Mypage },
    { path: '/signup/terms', component: TermsModal },
    { path: '/signup/groupjoin', component: GroupJoin },
    { path: '/signup/groupcreate', component: GroupCreate }
  ]
});

export default router;
