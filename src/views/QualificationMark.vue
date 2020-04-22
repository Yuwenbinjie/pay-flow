<template>
    <div class="home">
        <p class="title-lv1">
            资质标注
        </p>
        <img
            alt="Vue logo"
            src="../assets/imgs/logo.png"
        >
        <j-button @click="showOptModal">打开modal</j-button>
        <HelloWorld msg="Welcome to Your Vue.js App" />
        <opt-modal
            :show-opt-modal="isShowOptModal"
            @close-opt="isShowOptModal = false"
        >
        </opt-modal>
    </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import OptModal from '@/components/OptModal.vue'

export default {
    name: 'Home',
    components: {
        HelloWorld,
        OptModal,
    },
    data() {
        return {
            isShowOptModal: false
        } 
    },
    methods: {
        showOptModal() {
            this.isShowOptModal = true
        }
    }
}
</script>
