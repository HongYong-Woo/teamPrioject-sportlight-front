const courseDetailRouter = {
    path: '/course/:id',
    name: 'CourseDetail',
    component: () => import('../pages/course/CourseDetailPage.vue'),
    props: true
}

export default courseDetailRouter;