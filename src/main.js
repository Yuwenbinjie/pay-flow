import '@/assets/scss/reset.scss'
import '@/assets/scss/common.scss'
import '@/assets/scss/layout.scss'
import '@/assets/scss/font.scss'

import Vue from 'vue'
import VueResource from 'vue-resource'
import router from './router'
import JadPc from 'jad-pc'
import JadPro from 'jad-pc-pro'
import 'jad-pc/dist/jad.css'
import 'jad-pc-pro/style/index.scss'
import store from './store'
import App from './App.vue'
import $post from './utils/$post'

Vue.use(VueResource)
Vue.use(JadPc)
Vue.use(JadPro)

Vue.prototype.$post = $post
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
