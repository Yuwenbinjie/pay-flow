import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import QualificationMark from '../views/QualificationMark.vue'
import QualificationLook from '../views/QualificationLook.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '*',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        display: '首页',
        component: Home,
    },
    {
        path: '/qualificationMark',
        name: 'QualificationMark',
        display: '资质标注',
        component: QualificationMark,
    },
    {
        path: '/qualificationLook',
        name: 'QualificationLook',
        display: '资质查看',
        component: QualificationLook,
    },
]

const router = new VueRouter({
    routes
})

export default router
