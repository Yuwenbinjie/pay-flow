// import '@/assets/scss/reset.scss'
// import '@/assets/scss/common.scss'
// import '@/assets/scss/layout.scss'
// import '@/assets/scss/font.scss'

import Vue from 'vue'
import VueResource from 'vue-resource'
import router from './router'
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import App from './App.vue'
import web3 from './utils/web3'

Vue.use(VueResource)
Vue.use(ElementUI)

Vue.prototype.web3 = web3
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
