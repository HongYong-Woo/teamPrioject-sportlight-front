const courseRouter = {
    path: '/community',
    component: () => import('../pages/community/IndexPage.vue'),
    children: [
        {path: '', redirect: '/community/list'},
        {path: 'list', component: () => import('../pages/community/ListPage.vue')}
    ]
}

export default courseRouter;