const courseRouter = {
    path: '/course',
    component: () => import('../pages/course/IndexPage.vue'),
    children: [
        {path: '', redirect: '/course/list'},
        {path: 'list', component: () => import('../pages/course/ListPage.vue')}
    ]
}

export default courseRouter;