<template>
    <div id="pay-header">
        <div class="pull-left">
            <div class="pull-left bold">
                <i class="icon-statistics vm fs32" />
                <span class="vm ml8 fs24">流付</span>
            </div>
            <div class="pull-left ml64 bold">
                <router-link
                    to="/home"
                    class="l32"
                >
                    <span class="c-white"><i class="el-icon-s-home" /> 主页</span>
                </router-link>
            </div>
        </div>
        <div class="pull-right">
            <el-button-group class="c-blue2">
                <el-button
                    round
                    class="w140"
                    icon="el-icon-s-marketing"
                >
                    <router-link to="/dashboard">
                        仪表盘
                    </router-link>
                </el-button>
                <el-button
                    class="w140"
                    icon="el-icon-notebook-2"
                >
                    <router-link to="/home">
                        介绍文档
                    </router-link>
                </el-button>
                <el-button
                    round
                    icon="el-icon-s-custom"
                >
                    {{ name | filterName }}
                </el-button>
            </el-button-group>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Header',
    data() {
        return {
            name: ''
        }
    },
    created() {
        this.getUser()
    },
    filters: {
        filterName(val) {
            if (val.length > 10) {
                return val.substr(0, 4) + '...' + val.substr(val.length - 4, 4)
            } else {
                return val
            }
        }
    },
    methods: {
        getUser() {
            this.web3.eth.getCoinbase((err, coinbase) => {
                if (err) {
                    // console.log('err')
                } else {
                    // console.log(coinbase)
                    this.name = coinbase
                }
            })
            this.web3.eth.getAccounts().then((val)=>{
                // console.log(val)
                this.name = val[0]
                this.$store.commit('updateData', {key: 'sender', value: val[0]})
                this.$store.commit('updateData', {key: 'recipient', value: val[1]})
            })
        }
    }
}
</script>

<style>
</style>
