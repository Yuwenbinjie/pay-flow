<template>
    <div id="pay-header">
        <div class="pull-left pt8">
            <div class="inline-block bold">
                <!-- <i class="icon-statistics vm fs32" /> -->
                <img
                    src="../../assets/imgs/logo.png"
                    class="logo_pic"
                >
                <span class="vt ml8 fs24">流付</span>
            </div>
            <div class="inline-block ml64 bold vb">
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
                    <router-link
                        class="c-blue2"
                        to="/dashboard"
                    >
                        DashBoard
                    </router-link>
                </el-button>
                <el-button
                    class="w140"
                    icon="el-icon-notebook-2"
                >
                    <router-link
                        class="c-blue2"
                        to="/home"
                    >
                        介绍文档
                    </router-link>
                </el-button>
                <el-button
                    round
                    icon="el-icon-s-custom"
                >
                    {{ name | filterAdressName }}
                </el-button>
            </el-button-group>
        </div>
    </div>
</template>

<script>
import Web3 from 'web3'
import {filterAdressName} from '@/utils/utils.js'
export default {
    name: 'Header',
    data() {
        return {
            name: ''
        }
    },
    created() {
        this.getUser()
        setTimeout(() =>{//防止页面持续刷新
            this.watchEnvChange()
        }, 2000)
    },
    filters: {
        filterAdressName,
    },
    methods: {
        getUser() {
            // this.web3.eth.getCoinbase((err, coinbase) => {
            //     this.name = coinbase
            // })
            this.web3.eth.getAccounts().then((val)=>{
                // console.log(val)
                this.name = val[0]
                this.$store.commit('updateData', {key: 'user', value: val[0]})
                this.$store.commit('updateData', {key: 'recipient', value: val[1]})
            })
        },
        watchEnvChange() {
            //监听账号的变化。
            window.ethereum.on('accountsChanged', (accounts) => {
                this.name = accounts[0];
                this.$store.commit('updateData', {key: 'user', value: accounts[0]})
                location.reload()
            });
            //监听网络
            window.ethereum.on('chainChanged', () => {
                location.reload()
            });
            //监听web3
            window.addEventListener('load', async () => {
                //新版web3检测metamask方式
                if (window.ethereum) {
                    // eslint-disable-next-line
                    window.web3 = new Web3(ethereum);
                    // eslint-disable-next-line
                    await ethereum.enable();
                }
                // 老版web3检测metamask方式
                else if (window.web3) {
                    // eslint-disable-next-line
                    window.web3 = new Web3(web3.currentProvider);
                }
                // metamask不存在
                else {
                    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
                    alert('检测到未安装metamask插件，此处用本地ganache替代');
                }
            });
        }
    },
}
</script>
<style scoped>
.logo_pic{
    width: 30px;
    height: 30px;
}
</style>
