const EventRouter = [
    {
        path: '/EventPageEditing',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/EventPageEditing/EventPageEditing.vue'),
        meta: { title: '页面编辑' }
    },
    {
        path: '/EventPageList',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/EventPageEditing/EventPageList.vue'),
        meta: { title: '页面列表' }
    },
    {
        path: '/banner',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/banner/banner-list.vue'),
        meta: { title: '首页banner' }
    },
    {
        path: '/addBanner',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/banner/add-banner.vue'),
        meta: { title: '首页banner' }
    },
    {
        path: '/entrance',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/entrance/entrance-list.vue'),
        meta: { title: '大促入口列表' }
    },
    {
        path: '/addEntrance',
        component: () => import(/* webpackChunkName: "EventRouter" */ '@/views/entrance/add-entrance.vue'),
        meta: { title: '添加入口配置' }
    }
]
export default EventRouter