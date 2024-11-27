import { createRouter, createWebHistory } from "vue-router";
import courseRouter from './course.js';
import communityRouter from './community.js';
import courseDetailRouter from "./courseDetail.js";
import hostChannelRouter from "./host-channel.js"

const routes = [
    {
        path: '',
        component: () => import('../pages/MainPage.vue')
    },
    courseRouter, communityRouter, courseDetailRouter, hostChannelRouter,

    { path: '/join', component: () => import('../pages/auth/JoinPage.vue'), meta: { layout: 'empty' } },
    { path: '/find-id', component: () => import('../pages/auth/FindIdPage.vue'), meta: { layout: 'empty' } },
    { path: '/check-id', component: () => import('../pages/auth/CheckIdPage.vue'), meta: { layout: 'empty' } },
    { path: '/find-pwd', component: () => import('../pages/auth/FindPwdPage.vue'), meta: { layout: 'empty' } },
    { path: '/reset-pwd', component: () => import('../pages/auth/ResetPwdPage.vue'), meta: { layout: 'empty' } },
    { path: '/mypage', component: () => import('../pages/MyPage.vue'), meta: { layout: 'default' } },
      
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
