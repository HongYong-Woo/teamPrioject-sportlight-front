const hostChannelRouter = [{
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
},{
    path: '/management/:id',
    component: () => import('../pages/host-channel/CourseManagementPage.vue'),
    children: [
        { name: 'ApplicantManagement', path: 'applicants', component: () => import('../pages/host-channel/ApplicantManagement.vue') },
        { name: 'CourseInfoManagement', path: 'courses', component: () => import('../pages/host-channel/CourseRegisterForm.vue') },
        { name: 'CourseScheduleManagement', path: 'schedules', component: () => import('../pages/host-channel/CourseScheduleManagement.vue') },
        { name: 'CourseQnaManagement', path: 'qnas', component: () => import('../pages/host-channel/CourseQnaManagement.vue') },
    ],
    beforeEnter: (to, from) => {
        // 클래스에 대한 관리 권한 확인
        const courseId = to.params.id;
        return true;
    },
}];

export default hostChannelRouter;
