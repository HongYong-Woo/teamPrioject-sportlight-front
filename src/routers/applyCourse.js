const applyCourseRouter = {
    path: '/course/apply',
    name: 'ApplyCourse',
    component: () => import('../pages/course/ApplyCoursePage.vue'),
    props: true
}

export default applyCourseRouter;