import { createRouter, createWebHistory } from "vue-router";
import courseRouter from './course.js';
import communityRouter from './community.js';
import courseDetailRouter from "./courseDetail.js";
import hostChannelRouter from "./host-channel.js";
import applyCourseRouter from "./applyCourse.js";
import mypageRouter from './mypage.js';

const routes = [
    {
        path: '',
        component: () => import('../pages/MainPage.vue')
    },

    { path: '/join', component: () => import('../pages/auth/JoinPage.vue'), meta: { layout: 'empty' } },
    { path: '/mypage', component: () => import('../pages/MyPage.vue'), meta: { layout: 'default' } },
    { path: '/payment/success', component: () => import('../pages/payment/SuccessPage.vue'), meta: { layout: 'empty' }},
    { path: '/payment/fail', component: () => import('../pages/payment/FailPage.vue'), meta: { layout: 'empty' }},
    courseRouter, communityRouter, courseDetailRouter, hostChannelRouter, applyCourseRouter, ...mypageRouter,
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
