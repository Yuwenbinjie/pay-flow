import '@/assets/scss/reset.scss'
import '@/assets/scss/common.scss'

import Vue from 'vue'
import VueResource from 'vue-resource'
import router from './router'
import store from './store'
import App from './App.vue'
import $post from './utils/$post'

Vue.use(VueResource)

Vue.prototype.$post = $post
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
