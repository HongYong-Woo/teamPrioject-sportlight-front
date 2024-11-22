const courseRouter = {
    path: '/hostchannel',
    component: () => import('../pages/host-channel/HostChannelPage.vue'),
    children: [
        {path: '', redirect: '/hostchannel/main'},
        {path: 'main', component: () => import('../pages/host-channel/HostChannelMain.vue')},
        {path: 'courses', component: () => import('../pages/host-channel/HostCourseList.vue')},
        {path: 'adjustments/register', component: () => import('../pages/host-channel/AdjustmentRegisterForm.vue')},
        {path: 'adjustments', component: () => import('../pages/host-channel/AdjustmentList.vue')},
        {path: 'payments', component: () => import('../pages/host-channel/HostPaymentList.vue')},
    ]
}

export default courseRouter;
