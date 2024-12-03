const mypageRouter = [
    {
      path: '/mypage',
      component: () => import('@/pages/MyPage.vue'),
    },
    {
      path: '/mypage/coupons',
      component: () => import('@/pages/mypage/MyCoupons.vue'),
    },
    {
      path: '/mypage/interests',
      component: () => import('@/pages/mypage/MyInterests.vue'),
    },
    {
      path: '/mypage/host-request',
      component: () => import('@/pages/mypage/HostRequest.vue'),
  },
    {
        path: '/mypage/host-request-register',
        component: () => import('@/pages/mypage/RegisterHostRequest.vue'),
    },
    {
      path: '/mypage/courses',
      component: () => import('@/pages/mypage/MyCourses.vue'),
  },
  {
    path: '/mypage/reviews',
    component: () => import('@/pages/mypage/MyReview.vue'),
},

  ];
  
  export default mypageRouter;