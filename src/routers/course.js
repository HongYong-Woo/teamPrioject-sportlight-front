const courseRouter = {
    path: '/course',
    name: 'CourseList',
    component: () => import('../pages/course/CoursePage.vue')
}

export default courseRouter;