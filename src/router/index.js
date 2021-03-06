import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router)
import systemRouter from './system'
import arrangeRouter from './arrange'
import EventRouter from "./EventPageEditing";
import activityRouter from './activity'; //活动管理
import ShortLinkGeneration from './ShortLinkGeneration'; //活动管理
import material from './material'; //活动管理
const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '*',
            redirect: '/404'
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "system" */ '@/views/Login.vue'),
            // component: () => import(/* webpackChunkName: "system" */ '@/views/EventPageEditing/EventPageEditing.vue'),

        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "common" */ '@/components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "home" */ '@/views/Index.vue'),
                    meta: { title: '系统首页' }
                },

                ...EventRouter, ...activityRouter, ...ShortLinkGeneration, ...material, ...systemRouter, ...arrangeRouter,

                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "system" */ '@/views/system/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "system" */ '@/views/system/403.vue'),
                    meta: { title: '403' }
                }
            ],
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
})
export default router