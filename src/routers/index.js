import { createRouter, createWebHistory } from "vue-router";
import courseRouter from './course.js';
import communityRouter from './community.js';
import hostChannelRouter from './host-channel.js';

const routes = [
    {
        path: '',
        component: () => import('../pages/MainPage.vue')
    },
    courseRouter, communityRouter, hostChannelRouter,
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
