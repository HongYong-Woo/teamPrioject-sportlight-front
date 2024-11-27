const courseRouter = {
    path: '/hostchannel',
    component: () => import('../pages/host-channel/HostChannelPage.vue'),
    children: [
        { path: '', redirect: 'main' }, // 상대 경로로 수정
        { name: 'HostChannelMain', path: 'main', component: () => import('../pages/host-channel/HostChannelMain.vue') },
        { name: 'HostCourseList', path: 'courses', component: () => import('../pages/host-channel/HostCourseList.vue') },
        { name: 'AdjustmentRegisterForm', path: 'adjustments/register', component: () => import('../pages/host-channel/AdjustmentRegisterForm.vue') },
        { name: 'AdjustmentList', path: 'adjustments', component: () => import('../pages/host-channel/AdjustmentList.vue') },
        { name: 'HostPaymentList', path: 'payments', component: () => import('../pages/host-channel/HostPaymentList.vue') },
        { name: 'CourseRegisterForm', path: 'courses/register', component: () => import('../pages/host-channel/CourseRegisterForm.vue') },
    ],
};

export default courseRouter;
