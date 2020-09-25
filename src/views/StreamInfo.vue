<template>
    <div class="pay-dashboard">
        <p class="title-lv1">
            {{ $t('streamInfo.streaminfo') }}
            <router-link to="/dashboard">
                <el-button
                    size="samll"
                    class="vm ml16"
                    circle
                    icon="el-icon-back"
                />
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
                            <span class="l40 bold fs18">{{ $t('streamInfo.details.info') }}</span>
                            <div class="pull-right">
                                <el-button
                                    icon="el-icon-money"
                                    type="success"
                                    round
                                    size="medium"
                                    @click="withdraw"
                                >
                                    {{ $t('streamInfo.details.withdrawl') }}
                                </el-button>
                                <el-button
                                    v-if="activeTabName=='fixedFlowrate'&&info.sender==user"
                                    icon="el-icon-circle-plus-outline"
                                    type="primary"
                                    round
                                    size="medium"
                                    @click="addAmount"
                                >
                                    {{ $t('streamInfo.details.addAmount') }}
                                </el-button>
                                <el-button
                                    v-if="(activeTabName=='installmentWithDP'||activeTabName=='installment')&&info.sender==user"
                                    icon="el-icon-coin"
                                    type="primary"
                                    round
                                    size="medium"
                                    @click="installment"
                                >
                                    {{ $t('streamInfo.details.installment') }}
                                </el-button>
                                <el-button
                                    icon="el-icon-switch-button"
                                    type="danger"
                                    round
                                    size="medium"
                                    @click="cancel"
                                >
                                    {{ $t('streamInfo.details.cancel') }}
                                </el-button>
                            </div>
                        </div>
                        <div>
                            <el-row class="t-c mb16">
                                <el-col :span="10">
                                    <el-tooltip :content="$t('streamInfo.info.copy',{who:info.sender})">
                                        <el-button
                                            size="small"
                                            style="width:100%;"
                                            type="primary"
                                            class="senderText"
                                            :data-clipboard-text="info.sender"
                                            @click="copyText('senderText')"
                                            plain
                                        >
                                            {{ $t('streamInfo.info.sender') }}：{{ info.sender | filterAdressName }}
                                        </el-button>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="4">
                                    <i class="el-icon-d-arrow-right" />
                                </el-col>
                                <el-col :span="10">
                                    <el-tooltip :content="$t('streamInfo.info.copy',{who:info.recipient})">
                                        <el-button
                                            size="small"
                                            style="width:100%;"
                                            type="primary"
                                            class="recipientText"
                                            :data-clipboard-text="info.recipient"
                                            @click="copyText('recipientText')"
                                            plain
                                        >
                                            {{ $t('streamInfo.info.recipient') }}：{{ info.recipient | filterAdressName }}
                                        </el-button>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
<!--                            <p class="bold fs18 mb12">-->
<!--                                {{ $t('streamInfo.details.basicInfo') }}-->
<!--                            </p>-->
                            <el-row
                                class="mb16"
                            >
                                <el-col :span="24">
                                    <el-card shadow="never">
                                        <div v-if="activeTabName=='fixedFlowrate'">
                                            <p class="bold fs16">
                                                {{ $t('streamInfo.info.maxAmount') }}：<span class="normal break">{{ getMoney(info.maxAmount) }}</span> {{ unit }}
                                            </p>
                                            <p class="bold fs16 mt8">
                                                {{ $t('streamInfo.info.havebeenStreamed') }}：<span class="normal break">{{ getMoney(info.maxAmount - senderBalance) }}</span> {{ unit }}
                                            </p>
                                            <p class="bold fs16 mt8">
                                                {{ $t('streamInfo.info.ratepersecond') }}：<span class="normal break">{{ getMoney(info.ratePerSecond) }}</span> {{ unit }}
                                            </p>
                                        </div>
                                        <div v-else>
                                            <p class="bold fs16">
                                                {{ $t('streamInfo.info.deposit') }}：<span class="normal break">{{ getMoney(info.deposit) }}</span> {{ unit }}
                                            </p>
                                            <p class="bold fs16 mt8">
                                                {{ $t('streamInfo.info.havebeenStreamed') }}：
                                                <span class="normal break">
                                                    {{ activeTabName=='sablier'?getMoney(info.deposit - senderBalance):getMoney(info.haveBeenPaidAmount - senderBalance) }}
                                                </span> {{ unit }}
                                            </p>
                                        </div>
                                        <p class="bold fs16 mt8">
                                            {{ $t('streamInfo.info.senderBalance') }}：<span class="normal break">{{ getMoney(senderBalance) }}</span> {{ unit }}
                                        </p>
                                        <p class="bold fs16 mt8">
                                            {{ $t('streamInfo.info.recipientBalance') }}：<span class="normal break">{{ getMoney(recipientBalance) }}</span> {{ unit }}
                                        </p>
                                        <p
                                            v-if="activeTabName=='installmentWithDP'"
                                            class="bold fs16 mt8"
                                        >
                                            {{ $t('streamInfo.info.downpayment') }}：<span class="normal break">{{ getMoney(info.downPaymentAmount) }}</span> {{ unit }}
                                        </p>
                                        <div v-if="activeTabName=='installmentWithDP'||activeTabName=='installment'">
                                            <p class="bold fs16 mt8">
                                                {{ $t('streamInfo.info.fees') }}：<span class="normal break">{{ getMoney(fees) }}</span> {{ unit }}
                                            </p>
                                            <p class="bold fs16 mt8">
                                                {{ $t('streamInfo.info.numbeOfInstallments') }}：<span class="normal break">{{ info.numberOfInstallments }}</span>
                                            </p>
                                            <p class="bold fs16 mt8">
                                                {{ $t('streamInfo.info.haveBeenNumberOfInstallment') }}：<span class="normal break">{{ info.haveBeenNumberOfInstallment }}</span>
                                            </p>
                                            <p class="bold fs16 mt8">
                                                {{ $t('streamInfo.info.nextOfInstallmentTime') }}：<span class="normal break">{{ nextOfInstallmentTime|filterDate }}</span>
                                            </p>
                                        </div>
                                    </el-card>
                                </el-col>
                            </el-row>
                            <p class="bold fs18 mb12">
                                {{ $t('streamInfo.info.duration') }}
                            </p>
                            <el-card shadow="never">
                                <div>
                                    <p class="bold">
                                        {{ $t('streamInfo.info.startTime') }}
                                    </p>
                                    <p class="bold fs18 my12">
                                        <i class="el-icon-watch" />
                                        <span>{{ info.startTime|filterDate }}</span>
                                    </p>
                                </div>
                                <div>
                                    <p class="bold mt20">
                                        {{ $t('streamInfo.info.stopTime') }}
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
import {setMoneyWeb3, getMoney, filterAdressName, filterTokenAddress} from '@/utils/utils.js'
import {getInstance} from '../utils/connectContract'
import {mapState} from 'vuex'
import bignumber from 'bignumber.js'
let timer;
export default {
    name: 'StreamInfo',
    data() {
        return {
            streamId: '', //流ID
            activeTabName: '', //tab
            info: {},
            infoCal: {}, //后端方法最多返回13个参数，多出的放入infoCal
            senderBalance: 0, //发送者余额
            recipientBalance: 0, //接收者余额
            unit: '', //币种单位
            nextOfInstallmentAmount: 0, //下次支付金额
            nextOfInstallmentTime: 0, //下次支付时间
            fees: 0, //总手续费
        }
    },
    filters: {
        filterAdressName,
        filterDate(val) {
            let date = moment(parseInt(val, 10), 'X').format('YYYY-MM-DD HH:mm:ss')
            return date
        },
    },
    created(){
        // this.getInfo()//获取流信息
    },
    async mounted(){
        this.streamId = this.$route.query.streamId//根据url参数获取流ID
        this.activeTabName = this.$route.query.activeTabName//根据url参数获取当前tab
        this.allInstance = await getInstance()
        await this.getInfo()//获取流信息
        this.unit = filterTokenAddress(this.info.tokenAddress)//获取币种单位
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
        ...mapState(['user']),
    },
    methods: {
        getMoney,
        copyText(cla){//复制文本
            let that = this
            let clipboard = new Clipboard(`.${cla}`);
            clipboard.on('success', function () {
                that.$message({
                    type: 'success',
                    message: 'Copy Success!'
                })
                clipboard.destroy()
            });
            clipboard.on('error', function () {
                that.$message({
                    type: 'error',
                    message: 'Copy Failure!'
                })
                clipboard.destroy()
            });
        },
        initChart(chart){
            let total
            if (this.activeTabName == 'sablier'){
                total = this.info.deposit
            } else if (this.activeTabName == 'fixedFlowrate') {
                total = this.info.maxAmount
            } else {
                total = this.info.haveBeenPaidAmount
            }
            let flowedPer = (getMoney(total) - getMoney(this.senderBalance)) / getMoney(total)
            let option = {
                title: {
                    text: this.$t('streamInfo.info.havebeenStreamed'),
                    // subtext: '',
                },
                series: [{
                    type: 'liquidFill',
                    data: [flowedPer, flowedPer],
                    radius: '90%',
                    name: this.$t('streamInfo.info.havebeenStreamed')
                }],
                tooltip: {
                    show: true,
                    formatter: '{a}:' + flowedPer * 100 + '%'
                },
            }
            chart.setOption(option)
        },
        async getInfo(){//请求流详情数据
            if (this.activeTabName == 'sablier'){
                this.info = await this.allInstance.sablierInstance.methods.getStream(this.streamId).call()
                // res = await this.allInstance.sablierInstance.getPastEvents('CreateStream', {filter:{streamId:this.streamId},fromBlock: 0})
            } else if (this.activeTabName == 'fixedFlowrate') {
                this.info = await this.allInstance.fixedFlowrateInstance.methods.getFixedFlowrateStream(this.streamId).call()
            } else if (this.activeTabName == 'installment') {
                this.info = await this.allInstance.installmentInstance.methods.getInstallmentStream(this.streamId).call()
                this.infoCal = await this.allInstance.installmentInstance.methods.getInstallmentStreamCal(this.streamId).call()
                this.fees = new bignumber(this.infoCal.installmentAmountWithFees).minus(this.info.deposit)//获取总手续费
                this.nextOfInstallmentTime = await Math.floor((this.info.stopTime - this.info.startTime) / this.info.numberOfInstallments)
                    * this.info.haveBeenNumberOfInstallment + Number(this.info.startTime)//获取下期支付时间
            } else if (this.activeTabName == 'installmentWithDP') {
                this.info = await this.allInstance.installmentWithDPInstance.methods.getInstallmentWithDPStream(this.streamId).call()
                this.infoCal = await this.allInstance.installmentWithDPInstance.methods.getInstallmentWithDPStreamCal(this.streamId).call()
                this.fees = new bignumber(this.info.deposit).minus(this.info.downPaymentAmount)
                this.fees = new bignumber(this.infoCal.installmentAmountWithFees).minus(this.fees)
                this.nextOfInstallmentTime = await Math.floor((this.info.stopTime - this.info.startTime) / this.info.numberOfInstallments)
                    * this.info.haveBeenNumberOfInstallment + Number(this.info.startTime)
            }
        },
        async getBalance(){//获取发送/接收者余额
            let senderBalance
            let recipientBalance
            let delta
            let remainder
            const now = Date.parse(new Date()) / 1000
            if (this.activeTabName == 'sablier'){
                let withdrawAmount
                if (now < this.info.startTime){
                    delta = 0
                } else if (now < this.info.stopTime){
                    delta = now - this.info.startTime
                } else {
                    delta = this.info.stopTime - this.info.startTime
                }
                recipientBalance = new bignumber(this.info.ratePerSecond).multipliedBy(delta)
                if (now >= this.info.stopTime){
                    remainder = await new bignumber(this.info.deposit).mod(delta)
                    recipientBalance = await new bignumber(recipientBalance).plus(remainder)
                }
                if (Number(this.info.deposit) > Number(this.info.remainingBalance)){
                    withdrawAmount = await new bignumber(this.info.deposit).minus(this.info.remainingBalance)
                    recipientBalance = await new bignumber(recipientBalance).minus(withdrawAmount)
                }
                senderBalance = await this.info.remainingBalance - recipientBalance
                // senderBalance = await this.allInstance.sablierInstance.methods.balanceOf(this.streamId, this.info.sender).call()
                // recipientBalance = await this.allInstance.sablierInstance.methods.balanceOf(this.streamId, this.info.recipient).call()
            } else if (this.activeTabName == 'fixedFlowrate') {
                if (now < this.info.startTime){
                    delta = 0
                } else if (now < this.info.maxStopTime){
                    delta = now - this.info.startTime
                } else {
                    delta = this.info.maxStopTime - this.info.startTime
                }
                recipientBalance = await new bignumber(this.info.ratePerSecond).multipliedBy(delta)
                if (now >= this.info.maxStopTime){
                    remainder = await new bignumber(this.info.maxAmount).mod(delta)
                    recipientBalance = await new bignumber(recipientBalance).plus(remainder)
                }
                senderBalance = await new bignumber(this.info.maxAmount).minus(recipientBalance)
                recipientBalance = await new bignumber(recipientBalance).minus(this.info.withdrawalAmount)
            } else if (this.activeTabName == 'installment') {
                if (now < this.info.startTime){
                    delta = 0
                } else if (now < this.info.stopTime){
                    delta = now - this.info.startTime
                } else {
                    delta = this.info.stopTime - this.info.startTime
                }
                recipientBalance = new bignumber(this.infoCal.ratePerSecond).multipliedBy(delta)
                if (delta >= this.infoCal.oneOfInstallmentTime){
                    remainder = new bignumber(this.infoCal.oneOfInstallmentAmount).mod(Number(this.infoCal.oneOfInstallmentTime))
                    let numberOfTime = Math.floor(delta / this.infoCal.oneOfInstallmentTime);

                    if (numberOfTime > this.info.haveBeenNumberOfInstallment){
                        numberOfTime = this.info.haveBeenNumberOfInstallment
                    }

                    remainder = new bignumber(numberOfTime).multipliedBy(remainder)
                    recipientBalance = new bignumber(recipientBalance).plus(remainder)
                }
                if (now >= this.info.stopTime){
                    let remainder_stop = (new bignumber(this.infoCal.installmentAmountWithFees).mod(Number(this.info.numberOfInstallments)))
                    recipientBalance = new bignumber(recipientBalance).plus(remainder_stop)
                }
                if (Number(recipientBalance) >= Number(this.info.haveBeenPaidAmount)){
                    recipientBalance = this.info.haveBeenPaidAmount
                }
                senderBalance = await new bignumber(this.info.haveBeenPaidAmount).minus(recipientBalance)
                recipientBalance = await new bignumber(recipientBalance).minus(this.info.withdrawalAmount)
            } else if (this.activeTabName == 'installmentWithDP') {
                if (now < this.info.startTime){
                    delta = 0
                } else if (now < this.info.stopTime){
                    delta = now - this.info.startTime
                } else {
                    delta = this.info.stopTime - this.info.startTime
                }
                recipientBalance = new bignumber(this.infoCal.ratePerSecond).multipliedBy(delta)
                if (now >= this.info.startTime){
                    recipientBalance = new bignumber(recipientBalance).plus(this.info.downPaymentAmount)
                }
                if (delta >= this.infoCal.oneOfInstallmentTime){
                    remainder = new bignumber(this.infoCal.oneOfInstallmentAmount).mod(Number(this.infoCal.oneOfInstallmentTime))
                    let numberOfTime = Math.floor(delta / this.infoCal.oneOfInstallmentTime);

                    if (numberOfTime > this.info.haveBeenNumberOfInstallment){
                        numberOfTime = this.info.haveBeenNumberOfInstallment
                    }

                    remainder = new bignumber(numberOfTime).multipliedBy(remainder)
                    recipientBalance = new bignumber(recipientBalance).plus(remainder)
                }
                if (now >= this.info.stopTime){
                    let remainder_stop = (new bignumber(this.infoCal.installmentAmountWithFees).mod(Number(this.info.numberOfInstallments)))
                    recipientBalance = new bignumber(recipientBalance).plus(remainder_stop)
                }
                if (Number(recipientBalance) >= Number(this.info.haveBeenPaidAmount)){
                    recipientBalance = this.info.haveBeenPaidAmount
                }
                senderBalance = await new bignumber(this.info.haveBeenPaidAmount).minus(recipientBalance)
                recipientBalance = await new bignumber(recipientBalance).minus(this.info.withdrawalAmount)
            }
            this.senderBalance = senderBalance
            this.recipientBalance = recipientBalance
        },
        withdraw() {//提取金额
            this.$prompt(this.$t('streamInfo.function.withdraw'), this.$t('streamInfo.function.operation'), {
                confirmButtonText: this.$t('streamInfo.function.confirm'),
                cancelButtonText: this.$t('streamInfo.function.cancel'),
                inputPattern: /^([0-9]*|[0-9]*.[0-9]+)$/,
                inputErrorMessage: this.$t('streamInfo.function.format'),
            }).then(async ({value}) => {
                let res
                if (this.activeTabName == 'sablier'){
                    res = await this.allInstance.sablierInstance.methods.withdrawFromStream(this.streamId, setMoneyWeb3(value))
                        .send({gas: 500000, from: this.user})
                } else if (this.activeTabName == 'fixedFlowrate') {
                    res = await this.allInstance.fixedFlowrateInstance.methods.withdrawFromFlowrateStream(this.streamId, setMoneyWeb3(value))
                        .send({gas: 500000, from: this.user})
                } else if (this.activeTabName == 'installment') {
                    res = await this.allInstance.installmentInstance.methods.withdrawInstallmentStream(this.streamId, setMoneyWeb3(value))
                        .send({gas: 500000, from: this.user})
                } else if (this.activeTabName == 'installmentWithDP') {
                    res = await this.allInstance.installmentWithDPInstance.methods.withdrawInstallmentWithDPStream(this.streamId, setMoneyWeb3(value))
                        .send({gas: 500000, from: this.user})
                }
                if (res) {
                    this.$alert(this.$t('streamInfo.function.withdrawlSuccess'), this.$t('streamInfo.function.operationHint'), {type: 'success'})
                    await this.getInfo()//重新获取流信息
                } else {
                    this.$alert(this.$t('streamInfo.function.withdrawlFailure'), this.$t('streamInfo.function.operationHint'), {type: 'error'})
                }
            })
        },
        async installment() {//分期付款
            const now = Date.parse(new Date()) / 1000;
            if (now > this.nextOfInstallmentTime){
                alert(this.$t('streamInfo.function.nextOfInstallmentTime'))
            } else {
                if (this.info.haveBeenNumberOfInstallment < this.info.numberOfInstallments - 1){
                    this.nextOfInstallmentAmount = await Math.floor(new bignumber(this.infoCal.installmentAmountWithFees).dividedToIntegerBy(this.info.numberOfInstallments))
                } else if (this.info.haveBeenNumberOfInstallment == this.info.numberOfInstallments - 1){
                    let remainder = await new bignumber(this.infoCal.installmentAmountWithFees).mod(this.info.numberOfInstallments)
                    this.nextOfInstallmentAmount = await new bignumber(this.infoCal.installmentAmountWithFees).dividedToIntegerBy(this.info.numberOfInstallments)
                    this.nextOfInstallmentAmount = await new bignumber(this.nextOfInstallmentAmount).plus(remainder)
                }
                this.$confirm(this.$t('streamInfo.function.pay') + getMoney(this.nextOfInstallmentAmount), this.$t('streamInfo.function.operation'), {
                    confirmButtonText: this.$t('streamInfo.function.confirm'),
                    cancelButtonText: this.$t('streamInfo.function.cancel'),
                }).then(async () => {
                    let res
                    if (this.activeTabName == 'installment') {
                        res = await this.allInstance.installmentInstance.methods.transferWithInstallment(this.streamId)
                            .send({gas: 500000, from: this.user})
                    } else if (this.activeTabName == 'installmentWithDP') {
                        res = await this.allInstance.installmentWithDPInstance.methods.transferWithDP(this.streamId)
                            .send({gas: 500000, from: this.user})
                    }
                    if (res) {
                        this.$alert(this.$t('streamInfo.function.paySuccess'), this.$t('streamInfo.function.operationHint'), {type: 'success'})
                        await this.getInfo()//重新获取流信息
                    } else {
                        this.$alert(this.$t('streamInfo.function.payFailure'), this.$t('streamInfo.function.operationHint'), {type: 'error'})
                    }
                })
            }
        },
        addAmount() {//增加最大金额
            this.$prompt(this.$t('streamInfo.function.addInput'), this.$t('streamInfo.function.operation'), {
                confirmButtonText: this.$t('streamInfo.function.confirm'),
                cancelButtonText: this.$t('streamInfo.function.cancel'),
                inputPattern: /^([0-9]*|[0-9]*.[0-9]+)$/,
                inputErrorMessage: this.$t('streamInfo.function.format'),
            }).then(async ({value}) => {
                await this.allInstance.testnetInstance.methods.approve(this.allInstance.fixedFlowrateInstance.options.address, setMoneyWeb3(value))
                    .send({gas: 500000, from: this.user})
                // await this.allInstance.testnetInstance.methods.mint(this.user, setMoneyWeb3(value))
                //     .send({gas: 500000, from: this.user})
                let res = await this.allInstance.fixedFlowrateInstance.methods.transferWithFixedFlowrate(this.streamId, setMoneyWeb3(value))
                    .send({gas: 500000, from: this.user})
                if (res) {
                    this.$alert(this.$t('streamInfo.function.addSuccess'), this.$t('streamInfo.function.operationHint'), {type: 'success'})
                    await this.getInfo()//重新获取流信息
                } else {
                    this.$alert(this.$t('streamInfo.function.addFailure'), this.$t('streamInfo.function.operationHint'), {type: 'error'})
                }
            })
        },
        cancel() {//取消流
            this.$confirm(this.$t('streamInfo.function.cancelStream'), this.$t('streamInfo.function.operation'), {
                confirmButtonText: this.$t('streamInfo.function.confirm'),
                cancelButtonText: this.$t('streamInfo.function.cancel'),
            }).then(async () => {
                let res
                if (this.activeTabName == 'sablier'){
                    res = await this.allInstance.sablierInstance.methods.cancelStream(this.streamId)
                        .send({gas: 500000, from: this.user})
                } else if (this.activeTabName == 'fixedFlowrate') {
                    res = await this.allInstance.fixedFlowrateInstance.methods.cancelFlowrateStream(this.streamId)
                        .send({gas: 500000, from: this.user})
                } else if (this.activeTabName == 'installment') {
                    res = await this.allInstance.installmentInstance.methods.cancelInstallmentStream(this.streamId)
                        .send({gas: 500000, from: this.user})
                } else if (this.activeTabName == 'installmentWithDP') {
                    res = await this.allInstance.installmentWithDPInstance.methods.cancelInstallmentWithDPStream(this.streamId)
                        .send({gas: 500000, from: this.user})
                }
                if (res) {
                    clearInterval(timer)
                    this.$alert(this.$t('streamInfo.function.cancelSuccess'), this.$t('streamInfo.function.operationHint'), {type: 'success', showClose: false}).then(()=>{
                        this.$router.push({path: '/cancelInfo', query: {streamId: this.streamId, activeTabName: this.activeTabName}})
                    })
                } else {
                    this.$alert(this.$t('streamInfo.function.cancelFailure'), this.$t('streamInfo.function.operationHint'), {type: 'error'})
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
