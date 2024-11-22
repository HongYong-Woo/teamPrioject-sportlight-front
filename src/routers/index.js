import { createRouter, createWebHistory } from "vue-router";
import courseRouter from './course.js';
import communityRouter from './community.js';
import courseDetailRouter from "./courseDetail.js";

const routes = [
    {
        path: '',
        component: () => import('../pages/MainPage.vue')
    },
    courseRouter, communityRouter, courseDetailRouter
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;