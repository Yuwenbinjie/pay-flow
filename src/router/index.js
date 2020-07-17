import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import StreamInfo from '../views/StreamInfo.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '*',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        display: '主页',
        component: Home,
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        display: '仪表盘',
        component: Dashboard,
    },
    {
        path: '/streamInfo',
        name: 'StreamInfo',
        display: '流信息',
        component: StreamInfo,
    },
]

const router = new VueRouter({
    routes
})

export default router
