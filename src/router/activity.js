const activityRouter = [
    {
        path: '/activitylist',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/activityaList.vue'),
        meta: {title: '活动列表'}
    },
    {
        path: '/activityacreate',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/activityaCreate.vue'),
        meta: {title: '创建活动'}
    },
    {
        path: '/activityaupdate',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/activityaUpdate.vue'),
        meta: {title: '修改活动'}
    }
]
export  default activityRouter