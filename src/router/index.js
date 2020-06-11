import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import QualificationMark from '../views/QualificationMark.vue'
import ErpReport from '../views/ErpReport.vue'

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
        component: QualificationMark,
    },
    {
        path: '/erpReport',
        name: 'ErpReport',
        display: '审核ERP报表',
        component: ErpReport,
    },
]

const router = new VueRouter({
    routes
})

export default router
