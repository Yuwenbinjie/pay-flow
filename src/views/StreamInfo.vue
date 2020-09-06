<template>
    <div class="pay-dashboard">
        <p class="title-lv1">
            流信息
            <router-link to="/dashboard">
                <el-button
                    size="mini"
                    class="vm ml16"
                    plain
                >
                    返回
                </el-button>
            </router-link>
        </p>
        <div class="panel minW1100">
            <div
                class="flex"
                style="justify-content:space-between;"
            >
                <div
                    style="margin-right:2vw;"
                >
                    <div
                        id="liquidfill"
                        style="width:550px;height:600px;"
                    />
                </div>
                <div style="flex:auto;">
                    <el-card>
                        <div
                            slot="header"
                            class="clearfix"
                        >
                            <span class="l40 bold fs18">流信息详情</span>
                            <div class="pull-right">
                                <el-button
                                    icon="el-icon-money"
                                    type="success"
                                    round
                                    size="medium"
                                    @click="withdraw"
                                >
                                    提取
                                </el-button>
                                <el-button
                                    v-if="activeTabName=='fixedFlowrate'"
                                    icon="el-icon-circle-plus-outline"
                                    type="primary"
                                    round
                                    size="medium"
                                    @click="addAmount"
                                >
                                    加额
                                </el-button>
                                <el-button
                                    v-if="activeTabName=='installmentWithDP'||activeTabName=='installment'"
                                    icon="el-icon-coin"
                                    type="primary"
                                    round
                                    size="medium"
                                    @click="instalment"
                                >
                                    分期
                                </el-button>
                                <el-button
                                    icon="el-icon-switch-button"
                                    type="danger"
                                    round
                                    size="medium"
                                    @click="cancel"
                                >
                                    取消
                                </el-button>
                            </div>
                        </div>
                        <div>
                            <el-row class="t-c mb16">
                                <el-col :span="10">
                                    <el-tooltip :content="`点击复制：${info.sender}`">
                                        <el-button
                                            size="small"
                                            style="width:100%;"
                                            type="primary"
                                            class="senderText"
                                            :data-clipboard-text="info.sender"
                                            @click="copyText('senderText')"
                                            plain
                                        >
                                            发送：{{ info.sender | filterName }}
                                        </el-button>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="4">
                                    <i class="el-icon-d-arrow-right" />
                                </el-col>
                                <el-col :span="10">
                                    <el-tooltip :content="`点击复制：${info.recipient}`">
                                        <el-button
                                            size="small"
                                            style="width:100%;"
                                            type="primary"
                                            class="recipientText"
                                            :data-clipboard-text="info.recipient"
                                            @click="copyText('recipientText')"
                                            plain
                                        >
                                            接收：{{ info.recipient | filterName }}
                                        </el-button>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                            <p class="bold fs18 mb12">
                                基本信息
                            </p>
                            <el-row
                                class="mb16"
                            >
                                <el-col :span="24">
                                    <el-card shadow="never">
                                        <div v-if="activeTabName=='fixedFlowrate'">
                                            <p class="bold fs16">
                                                最大金额转账：<span class="normal break">{{ getMoney(info.maxAmount) }}</span> DAI
                                            </p>
                                            <p class="bold fs16 mt8">
                                                流动率：<span class="normal break">{{ getMoney(info.ratePerSecond) }}</span> DAI
                                            </p>
                                        </div>
                                        <div v-else>
                                            <p class="bold fs16">
                                                流金额：<span class="normal break">{{ getMoney(info.deposit) }}</span> DAI
                                            </p>
                                            <p class="bold fs16 mt8">
                                                已流动：<span class="normal break">{{ getMoney(info.deposit - senderBalance) }}</span> DAI
                                            </p>
                                        </div>
                                        <p
                                            v-if="activeTabName=='installmentWithDP'"
                                            class="bold fs16 mt8"
                                        >
                                            首付比例：<span class="normal break">{{ info.downPaymentRatio }}</span> %
                                        </p>
                                        <p
                                            v-if="activeTabName=='installmentWithDP'||activeTabName=='installment'"
                                            class="bold fs16 mt8"
                                        >
                                            分期数：<span class="normal break">{{ info.numberOfInstallments }}</span>
                                        </p>
                                        <p
                                            v-if="activeTabName=='installmentWithDP'||activeTabName=='installment'"
                                            class="bold fs16 mt8"
                                        >
                                            已分期数：<span class="normal break">{{ info.haveBeenNumberOfInstallment }}</span>
                                        </p>
                                        <!-- <p
                                            v-if="activeTabName=='installmentWithDP'||activeTabName=='installment'"
                                            class="bold fs16 mt8"
                                        >
                                            分期金额：<span class="normal break">{{ getMoney(info.oneOfInstallmentAmount) }}</span>
                                        </p> -->
                                        <p
                                            v-if="activeTabName=='installmentWithDP'||activeTabName=='installment'"
                                            class="bold fs16 mt8"
                                        >
                                            手续费：<span class="normal break">{{ getMoney(info.feesOfRecipientPer) }}</span> DAI
                                        </p>
                                        <p class="bold fs16 mt8">
                                            发送者余额：<span class="normal break">{{ getMoney(senderBalance) }}</span> DAI
                                        </p>
                                        <p class="bold fs16 mt8">
                                            接收者余额：<span class="normal break">{{ getMoney(recipientBalance) }}</span> DAI
                                        </p>
                                    </el-card>
                                </el-col>
                            </el-row>
                            <p class="bold fs18 mb12">
                                持续时间
                            </p>
                            <el-card shadow="never">
                                <div>
                                    <p class="bold">
                                        开始时间
                                    </p>
                                    <p class="bold fs18 my12">
                                        <i class="el-icon-watch" />
                                        <span>{{ info.startTime|filterDate }}</span>
                                    </p>
                                </div>
                                <div>
                                    <p class="bold mt20">
                                        结束时间
                                    </p>
                                    <p class="bold fs18 my12">
                                        <i class="el-icon-watch" />
                                        <span>
                                            {{ activeTabName=='fixedFlowrate'?info.maxStopTime:info.stopTime|filterDate }}
                                        </span>
                                    </p>
                                </div>
                            </el-card>
                        </div>
                    </el-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import echarts from 'echarts'
import 'echarts-liquidfill'
import Clipboard from 'clipboard'
import {setMoney, getMoney} from '@/utils/utils.js'
import {getInstance} from '../utils/connectContract'
import {mapState} from 'vuex'
let timer;
export default {
    name: 'StreamInfo',
    data() {
        return {
            streamId: '', //流ID
            info: {},
            senderBalance: 0, //发送者余额
            recipientBalance: 0, //接收者余额
        }
    },
    filters: {
        filterName(val) {
            if (val && val.length > 10) {
                return val.substr(0, 4) + '...' + val.substr(val.length - 4, 4)
            } else {
                return val
            }
        },
        filterDate(val) {
            let date = moment(parseInt(val, 10), 'X').format('YYYY-MM-DD HH:mm:ss')
            return date
        },
    },
    created(){
        // this.getInfo()//获取流信息
    },
    async mounted(){
        this.allInstance = await getInstance()
        await this.getInfo()//获取流信息
        let chart = echarts.init(document.getElementById('liquidfill'))
        timer = setInterval(async () =>{//每秒动态获取账户余额
            await this.getBalance()
            this.initChart(chart)
        }, 1000)
    },
    beforeDestroy() {
        clearInterval(timer)
    },
    computed: {
        ...mapState(['activeTabName']),
    },
    methods: {
        getMoney,
        copyText(cla){//复制文本
            let that = this
            let clipboard = new Clipboard(`.${cla}`);
            clipboard.on('success', function () {
                that.$message({
                    type: 'success',
                    message: '成功复制到剪切板!'
                })
                clipboard.destroy()
            });
            clipboard.on('error', function () {
                that.$message({
                    type: 'error',
                    message: '复制失败!'
                })
                clipboard.destroy()
            });
        },
        initChart(chart){
            let total = this.activeTabName == 'fixedFlowrate' ? this.info.maxAmount : this.info.deposit
            let flowedPer = (parseInt(total, 10) - parseInt(this.senderBalance, 10)) / parseInt(total, 10)
            let option = {
                title: {
                    text: '已流动金额',
                    // subtext: '',
                },
                series: [{
                    type: 'liquidFill',
                    data: [flowedPer, flowedPer],
                    radius: '90%',
                    name: '已流动'
                }],
                tooltip: {
                    show: true,
                    formatter: '{a}:' + flowedPer * 100 + '%'
                },
            }
            chart.setOption(option)
        },
        async getInfo(){//请求流详情数据
            this.streamId = this.$route.query.streamId
            // this.activeTabName = this.$route.query.activeTabName
            if (this.activeTabName == 'sablier'){
                this.info = await this.allInstance.sablierInstance.methods.getStream(this.streamId).call()
                // res = await this.allInstance.sablierInstance.getPastEvents('CreateStream', {filter:{streamId:this.streamId},fromBlock: 0})
            } else if (this.activeTabName == 'fixedFlowrate') {
                this.info = await this.allInstance.fixedFlowrateInstance.methods.getFixedFlowrateStream(this.streamId).call()
                // res = await this.allInstance.fixedFlowrateInstance.getPastEvents('CreateFixedFlowrateStream', {filter:{streamId:this.streamId},fromBlock: 0})
            } else if (this.activeTabName == 'installment') {
                this.info = await this.allInstance.installmentInstance.methods.getInstallmentStream(this.streamId).call()
                // res = await this.allInstance.installmentInstance.getPastEvents('CreateInstallmentStream', {filter:{streamId:this.streamId},fromBlock: 0})
            } else if (this.activeTabName == 'installmentWithDP') {
                this.info = await this.allInstance.installmentWithDPInstance.methods.getInstallmentWithDPStream(this.streamId).call()
                // res = await this.allInstance.installmentWithDPInstance.getPastEvents('CreateInstallmentWithDPStream', {filter:{streamId:this.streamId},fromBlock: 0})
            }
            // this.info = res[0].returnValues
        },
        async getBalance(){//获取发送/接收者余额
            let senderBalance
            let recipientBalance
            if (this.activeTabName == 'sablier'){
                senderBalance = await this.allInstance.sablierInstance.methods.balanceOf(this.streamId, this.info.sender).call()
                recipientBalance = await this.allInstance.sablierInstance.methods.balanceOf(this.streamId, this.info.recipient).call()
            } else if (this.activeTabName == 'fixedFlowrate') {
                senderBalance = await this.allInstance.fixedFlowrateInstance.methods
                    .fixedFlowrateBalanceOf(this.streamId, this.info.sender).call()
                recipientBalance = await this.allInstance.fixedFlowrateInstance.methods
                    .fixedFlowrateBalanceOf(this.streamId, this.info.recipient).call()
            } else if (this.activeTabName == 'installment') {
                senderBalance = await this.allInstance.installmentInstance.methods
                    .installmentBalanceOf(this.streamId, this.info.sender).call()
                recipientBalance = await this.allInstance.installmentInstance.methods
                    .installmentBalanceOf(this.streamId, this.info.recipient).call()
            } else if (this.activeTabName == 'installmentWithDP') {
                senderBalance = await this.allInstance.installmentWithDPInstance.methods
                    .installmentWithDPBalanceOf(this.streamId, this.info.sender).call()
                recipientBalance = await this.allInstance.installmentWithDPInstance.methods
                    .installmentWithDPBalanceOf(this.streamId, this.info.recipient).call()
            }
            this.senderBalance = senderBalance
            this.recipientBalance = recipientBalance
        },
        withdraw() {//提取金额
            this.$prompt('请输入提取的金额', '操作', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^([0-9]*|[0-9]*.[0-9]+)$/,
                inputErrorMessage: '金额输入格式不正确'
            }).then(async ({value}) => {
                let res
                if (this.activeTabName == 'sablier'){
                    res = await this.allInstance.sablierInstance.methods.withdrawFromStream(this.streamId, setMoney(value))
                        .send({gas: 3000000, from: this.info.sender})
                } else if (this.activeTabName == 'fixedFlowrate') {
                    res = await this.allInstance.fixedFlowrateInstance.methods.withdrawFromFlowrateStream(this.streamId, setMoney(value))
                        .send({gas: 3000000, from: this.info.sender})
                } else if (this.activeTabName == 'installment') {
                    res = await this.allInstance.installmentInstance.methods.withdrawInstallmentStream(this.streamId, setMoney(value))
                        .send({gas: 3000000, from: this.info.sender})
                } else if (this.activeTabName == 'installmentWithDP') {
                    res = await this.allInstance.installmentWithDPInstance.methods.withdrawInstallmentWithDPStream(this.streamId, setMoney(value))
                        .send({gas: 3000000, from: this.info.sender})
                }
                if (res) {
                    this.$message({
                        type: 'success',
                        message: '提取金额成功!'
                    })
                    await this.getInfo()//重新获取流信息
                } else {
                    this.$message({
                        type: 'error',
                        message: '提取金额失败!'
                    })
                }
            })
        },
        instalment() {//分期付款
            this.$confirm('本期需支付金额：' + getMoney(this.info.oneOfInstallmentAmount), '操作', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async () => {
                let res
                if (this.activeTabName == 'installment') {
                    await this.allInstance.testnetInstance.methods
                        .approve(this.allInstance.installmentInstance.options.address, setMoney(this.info.oneOfInstallmentAmount))
                        .send({gas: 3000000, from: this.info.sender})
                    await this.allInstance.testnetInstance.methods.mint(this.info.sender, setMoney(this.info.oneOfInstallmentAmount))
                        .send({gas: 3000000, from: this.info.sender})
                    res = await this.allInstance.installmentInstance.methods.transferWithInstallment(this.streamId)
                        .send({gas: 3000000, from: this.info.sender})
                } else if (this.activeTabName == 'installmentWithDP') {
                    await this.allInstance.testnetInstance.methods
                        .approve(this.allInstance.installmentWithDPInstance.options.address, setMoney(this.info.oneOfInstallmentAmount))
                        .send({gas: 3000000, from: this.info.sender})
                    await this.allInstance.testnetInstance.methods.mint(this.info.sender, setMoney(this.info.oneOfInstallmentAmount))
                        .send({gas: 3000000, from: this.info.sender})
                    res = await this.allInstance.installmentWithDPInstance.methods.transferWithDP(this.streamId)
                        .send({gas: 3000000, from: this.info.sender})
                }
                if (res) {
                    this.$message({
                        type: 'success',
                        message: '分期支付成功!'
                    })
                    await this.getInfo()//重新获取流信息
                } else {
                    this.$message({
                        type: 'error',
                        message: '分期支付失败!'
                    })
                }
            })
        },
        addAmount() {//增加最大金额
            this.$prompt('请输入增加的金额', '操作', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^([0-9]*|[0-9]*.[0-9]+)$/,
                inputErrorMessage: '金额输入格式不正确'
            }).then(async ({value}) => {
                await this.allInstance.testnetInstance.methods.approve(this.allInstance.fixedFlowrateInstance.options.address, setMoney(value))
                    .send({gas: 3000000, from: this.info.sender})
                await this.allInstance.testnetInstance.methods.mint(this.info.sender, setMoney(value))
                    .send({gas: 3000000, from: this.info.sender})
                let res = await this.allInstance.fixedFlowrateInstance.methods.transferWithFixedFlowrate(this.streamId, setMoney(value))
                    .send({gas: 3000000, from: this.info.sender})
                if (res) {
                    this.$message({
                        type: 'success',
                        message: '增加金额成功!'
                    })
                    await this.getInfo()//重新获取流信息
                } else {
                    this.$message({
                        type: 'error',
                        message: '增加金额失败!'
                    })
                }
            })
        },
        cancel() {//取消流
            this.$confirm('是否取消流进程?', '操作', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async () => {
                let res
                if (this.activeTabName == 'sablier'){
                    res = await this.allInstance.sablierInstance.methods.cancelStream(this.streamId)
                        .send({gas: 3000000, from: this.info.sender})
                } else if (this.activeTabName == 'fixedFlowrate') {
                    res = await this.allInstance.fixedFlowrateInstance.methods.cancelFlowrateStream(this.streamId)
                        .send({gas: 3000000, from: this.info.sender})
                } else if (this.activeTabName == 'installment') {
                    res = await this.allInstance.installmentInstance.methods.cancelInstallmentStream(this.streamId)
                        .send({gas: 3000000, from: this.info.sender})
                } else if (this.activeTabName == 'installmentWithDP') {
                    res = await this.allInstance.installmentWithDPInstance.methods.cancelInstallmentWithDPStream(this.streamId)
                        .send({gas: 3000000, from: this.info.sender})
                }
                if (res) {
                    clearInterval(timer)
                    this.$router.push('/dashboard')
                    this.$message({
                        type: 'success',
                        message: '取消成功!'
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: '取消失败!'
                    })
                }
            })
        },
    },
}
</script>
<style scoped>
.info-babel{
    width: 110px;
    display: inline-block;
    text-align: right;
}
</style>
