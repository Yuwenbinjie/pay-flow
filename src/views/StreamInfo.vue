<template>
    <div class="pay-dashboard">
        <p class="title-lv1">
            流信息
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
                                    <el-tag
                                        style="width:100%;"
                                        effect="plain"
                                    >
                                        发送：{{ sender | filterName }}
                                    </el-tag>
                                </el-col>
                                <el-col :span="4">
                                    <i class="el-icon-d-arrow-right" />
                                </el-col>
                                <el-col :span="10">
                                    <el-tag
                                        style="width:100%;"
                                        effect="plain"
                                    >
                                        接收：{{ recipient | filterName }}
                                    </el-tag>
                                </el-col>
                            </el-row>
                            <p class="bold fs18 mb12">
                                Information
                            </p>
                            <el-row
                                class="mb16"
                            >
                                <el-col :span="24">
                                    <el-card shadow="never">
                                        <div v-if="activeTabName=='fixedFlowrate'">
                                            <p class="bold fs16">
                                                最大金额转账：<span class="normal break">{{ info.maxAmount }}</span> DAI
                                            </p>
                                            <p class="bold fs16 mt8">
                                                流动率：<span class="normal break">{{ info.ratePerSecond }}</span> DAI
                                            </p>
                                        </div>
                                        <div v-else>
                                            <p class="bold fs16">
                                                流金额：<span class="normal break">{{ info.deposit }}</span> DAI
                                            </p>
                                            <p class="bold fs16 mt8">
                                                已流动：<span class="normal break">{{ info.deposit - senderBalance }}</span> DAI
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
                                            当前期数：<span class="normal break">{{ info.haveBeenNumberOfInstallment }}</span>
                                        </p>
                                        <p
                                            v-if="activeTabName=='installmentWithDP'||activeTabName=='installment'"
                                            class="bold fs16 mt8"
                                        >
                                            分期金额：<span class="normal break">{{ info.installmentAmountWithFees }}</span>
                                        </p>
                                        <p
                                            v-if="activeTabName=='installmentWithDP'||activeTabName=='installment'"
                                            class="bold fs16 mt8"
                                        >
                                            手续费：<span class="normal break">{{ info.feesOfRecipientPer }}</span> DAI
                                        </p>
                                        <p class="bold fs16 mt8">
                                            发送者余额：<span class="normal break">{{ senderBalance }}</span> DAI
                                        </p>
                                        <p class="bold fs16 mt8">
                                            接收者余额：<span class="normal break">{{ recipientBalance }}</span> DAI
                                        </p>
                                    </el-card>
                                </el-col>
                            </el-row>
                            <!-- <el-row
                                :gutter="16"
                                class="mb16"
                            >
                                <el-col :span="12">
                                    <el-card shadow="never">
                                        <p class="bold fs18">
                                            Total
                                        </p>
                                        <p class="mt8 mb16">
                                            value of stream
                                        </p>
                                        <span class="bold fs16 break">{{ info.deposit }}  DAI</span>
                                    </el-card>
                                </el-col>
                                <el-col :span="12">
                                    <el-card shadow="never">
                                        <p class="bold fs18">
                                            Streamed
                                        </p>
                                        <p class="mt8 mb16">
                                            100% out of total
                                        </p>
                                        <span class="bold fs16 break">{{ info.deposit - balance }}  DAI</span>
                                    </el-card>
                                </el-col>
                            </el-row> -->
                            <p class="bold fs18 mb12">
                                Duration
                            </p>
                            <el-card shadow="never">
                                <div>
                                    <p class="bold">
                                        Started on
                                    </p>
                                    <p class="bold fs18 my12">
                                        <i class="el-icon-watch" />
                                        <span>{{ info.startTime|filterDate }}</span>
                                    </p>
                                </div>
                                <div>
                                    <p class="bold mt20">
                                        Ended on
                                    </p>
                                    <p class="bold fs18 my12">
                                        <i class="el-icon-watch" />
                                        <span>
                                            {{ activeTabName=='fixedFlowrate'?info.maxStopTime:info.stopTime|filterDate }}
                                        </span>
                                    </p>
                                </div>
                                <!-- <p>
                                    This stream was started on
                                    <span class="bold">{{ info.startTime|filterDate }}</span>
                                    and ended on
                                    <span class="bold">{{ info.stopTime|filterDate }}</span>.
                                </p> -->
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
import testnetInstance from '@/utils/testNetInstance'
import sablierInstance from '../utils/sablierInstance'
import fixedFlowrateInstance from '../utils/fixedFlowrateInstance'
import installmentInstance from '../utils/installmentInstance'
import installmentWithDPInstance from '../utils/installmentWithDPInstance'
import {mapState} from 'vuex'
let timer;
export default {
    name: 'StreamInfo',
    data() {
        return {
            streamId: '', //流ID
            activeTabName: 'sablier', //流类型
            info: {},
            senderBalance: 0, //发送者余额
            recipientBalance: 0, //接收者余额
        }
    },
    filters: {
        filterName(val) {
            if (val.length > 10) {
                return val.substr(0, 4) + '...' + val.substr(val.length - 4, 4)
            } else {
                return val
            }
        },
        filterDate(val) {
            let date = moment(parseInt(val, 10)).format('dddd, MMM Do YYYY, h:mm:ss a')
            return date
        },
    },
    created(){
        // this.getInfo()//获取流信息

    },
    async mounted(){
        await this.getInfo()//获取流信息
        // if (this.activeTabName != 'fixedFlowrate') {
        let chart = echarts.init(document.getElementById('liquidfill'))
        timer = setInterval(async () =>{//每秒动态获取账户余额
            await this.getBalance()
            this.initChart(chart)
        }, 1000)
        // }//生成图表
    },
    beforeDestroy() {
        clearInterval(timer)
    },
    computed: {
        ...mapState(['sender', 'recipient']),
    },
    methods: {
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
            this.activeTabName = this.$route.query.activeTabName
            if (this.activeTabName == 'sablier'){
                this.info = await sablierInstance.methods.getStream(this.streamId).call()
            } else if (this.activeTabName == 'fixedFlowrate') {
                this.info = await fixedFlowrateInstance.methods.getFixedFlowrateStream(this.streamId).call()
            } else if (this.activeTabName == 'installment') {
                this.info = await installmentInstance.methods.getInstallmentStream(this.streamId).call()
            } else if (this.activeTabName == 'installmentWithDP') {
                this.info = await installmentWithDPInstance.methods.getInstallmentWithDPStream(this.streamId).call()
                // installmentWithDPInstance.getPastEvents('CreateInstallmentWithDPStream',
                //     {filter: {streamId: this.streamId}, fromBlock: 0}, async (error, events) => {
                //         console.log(events[0].returnValues)
                //     })
            }
        },
        async getBalance(){//获取发送/接收者余额
            let senderBalance
            let recipientBalance
            if (this.activeTabName == 'sablier'){
                senderBalance = await sablierInstance.methods.balanceOf(this.streamId, this.info.sender).call()
                recipientBalance = await sablierInstance.methods.balanceOf(this.streamId, this.info.recipient).call()
            } else if (this.activeTabName == 'fixedFlowrate') {
                senderBalance = await fixedFlowrateInstance.methods
                    .fixedFlowrateBalanceOf(this.streamId, this.info.sender).call()
                recipientBalance = await fixedFlowrateInstance.methods
                    .fixedFlowrateBalanceOf(this.streamId, this.info.recipient).call()
            } else if (this.activeTabName == 'installment') {
                senderBalance = await installmentInstance.methods
                    .installmentBalanceOf(this.streamId, this.info.sender).call()
                recipientBalance = await installmentInstance.methods
                    .installmentBalanceOf(this.streamId, this.info.recipient).call()
            } else if (this.activeTabName == 'installmentWithDP') {
                senderBalance = await installmentWithDPInstance.methods
                    .installmentWithDPBalanceOf(this.streamId, this.info.sender).call()
                recipientBalance = await installmentWithDPInstance.methods
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
                    res = await sablierInstance.methods.withdrawFromStream(this.streamId, value)
                        .send({gas: 3000000, from: this.sender})
                } else if (this.activeTabName == 'fixedFlowrate') {
                    res = await fixedFlowrateInstance.methods.withdrawFromFlowrateStream(this.streamId, value)
                        .send({gas: 3000000, from: this.sender})
                } else if (this.activeTabName == 'installment') {
                    res = await installmentInstance.methods.withdrawInstallmentStream(this.streamId, value)
                        .send({gas: 3000000, from: this.sender})
                } else if (this.activeTabName == 'installmentWithDP') {
                    res = await installmentWithDPInstance.methods.withdrawInstallmentWithDPStream(this.streamId, value)
                        .send({gas: 3000000, from: this.sender})
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
            this.$confirm('本期需支付金额：' + this.info.installmentAmountWithFees, '操作', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async () => {
                let res
                if (this.activeTabName == 'installment') {
                    await testnetInstance.methods
                        .approve(installmentInstance.options.address, this.info.installmentAmountWithFees)
                        .send({gas: 3000000, from: this.sender})
                    await testnetInstance.methods.mint(this.sender, this.info.installmentAmountWithFees)
                        .send({gas: 3000000, from: this.sender})
                    res = await installmentInstance.methods.transferWithInstallment(this.streamId)
                        .send({gas: 3000000, from: this.sender})
                } else if (this.activeTabName == 'installmentWithDP') {
                    await testnetInstance.methods
                        .approve(installmentWithDPInstance.options.address, this.info.installmentAmountWithFees)
                        .send({gas: 3000000, from: this.sender})
                    await testnetInstance.methods.mint(this.sender, this.info.installmentAmountWithFees)
                        .send({gas: 3000000, from: this.sender})
                    res = await installmentWithDPInstance.methods.transferWithDP(this.streamId)
                        .send({gas: 3000000, from: this.sender})
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
                await testnetInstance.methods.approve(fixedFlowrateInstance.options.address, value)
                    .send({gas: 3000000, from: this.sender})
                await testnetInstance.methods.mint(this.sender, value)
                    .send({gas: 3000000, from: this.sender})
                let res = await fixedFlowrateInstance.methods.transferWithFixedFlowrate(this.streamId, value)
                    .send({gas: 3000000, from: this.sender})
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
                    res = await sablierInstance.methods.cancelStream(this.streamId)
                        .send({gas: 3000000, from: this.sender})
                } else if (this.activeTabName == 'fixedFlowrate') {
                    res = await fixedFlowrateInstance.methods.cancelFlowrateStream(this.streamId)
                        .send({gas: 3000000, from: this.sender})
                } else if (this.activeTabName == 'installment') {
                    res = await installmentInstance.methods.cancelInstallmentStream(this.streamId)
                        .send({gas: 3000000, from: this.sender})
                } else if (this.activeTabName == 'installmentWithDP') {
                    res = await installmentWithDPInstance.methods.cancelInstallmentWithDPStream(this.streamId)
                        .send({gas: 3000000, from: this.sender})
                }
                if (res) {
                    clearInterval(timer)
                    this.$message({
                        type: 'success',
                        message: '取消成功!'
                    })
                    await this.getInfo()//重新获取流信息
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
