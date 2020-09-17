<template>
    <el-drawer
        :visible.sync="showModal"
        id="creatStream"
        :wrapper-closable="false"
        @close="closeModal"
    >
        <div
            slot="title"
            class="bold fs20"
        >
            创建流
        </div>
        <div class="px20">
            <el-form
                ref="createForm"
                label-position="top"
                label-width="80px"
                :model="params"
            >
                <el-form-item label="创建流类型">
                    <el-select
                        style="width:100%"
                        v-model="activeTab"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="谁是收件人？（ENS名称或以太坊地址）">
                    <el-input v-model="params.recipient" />
                </el-form-item>
                <el-form-item
                    v-if="activeTab!='fixedFlowrate'"
                    label="流金额"
                >
                    <el-input
                        type="number"
                        v-model="params.deposit"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeTab=='fixedFlowrate'"
                    label="可承受最大金额转账"
                >
                    <el-input
                        type="number"
                        v-model="params.maxAmount"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeTab=='fixedFlowrate'"
                    label="流动率（每秒流动金额）"
                >
                    <el-input
                        type="number"
                        v-model="params.ratePerSecond"
                    />
                </el-form-item>
                <el-form-item label="币种">
                    <!-- <el-autocomplete style="width:100%" valueKey="label" :fetch-suggestions="querySearch" v-model="params.tokenAddress" /> -->
                    <el-select
                        style="width:100%"
                        v-model="params.tokenAddress"
                        placeholder="请选择币种"
                    >
                        <el-option
                            v-for="item in tokenAddressOpt"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="activeTab!='fixedFlowrate'"
                    label="起止时间"
                >
                    <el-date-picker
                        v-model="dateTime"
                        align="right"
                        style="width:100%"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeTab=='fixedFlowrate'"
                    label="开始时间"
                >
                    <el-date-picker
                        v-model="params.startTime"
                        align="right"
                        style="width:100%"
                        type="datetime"
                        placeholder="选择开始日期时间"
                        :picker-options="pickerOptions"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeTab=='installment'||activeTab=='installmentWithDP'"
                    label="分期数"
                >
                    <el-input
                        type="number"
                        v-model="params.numberOfInstallments"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeTab=='installment'||activeTab=='installmentWithDP'"
                    label="接收者收取的手续费（每期每秒每ETH收取的手续费，单位为1/10**18）"
                >
                    <el-input
                        type="number"
                        v-model="params.feesOfRecipientPer"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeTab=='installmentWithDP'"
                    label="首付比例"
                >
                    <el-input
                        type="number"
                        v-model="params.downPaymentRatio"
                    >
                        <template slot="append">
                            %
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        round
                        class="mt36 py16"
                        style="width:100%"
                        type="primary"
                        :disabled="isOnlyClick"
                        @click="save"
                    >
                        {{ isOnlyClick?'创建中...':'创建流' }}<i class="el-icon-right el-icon--right" />
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-drawer>
</template>

<script>
import {mapState} from 'vuex'
import moment from 'moment'
import {tokenAddressOpt} from '@/components/constant/tokenAddress'
import {setMoneyWeb3} from '@/utils/utils.js'
import {getInstance} from '@/utils/connectContract'
import bignumber from 'bignumber.js'
export default {
    name: 'CreatStream',
    props: {
        showModal: {
            type: Boolean,
            default() {
                return false;
            }
        },
    },
    data() {
        return {
            tokenAddressOpt,
            options: [{
                value: 'sablier',
                label: '固定金额流'
            }, {
                value: 'fixedFlowrate',
                label: '固定流率流'
            }, {
                value: 'installment',
                label: '分期流'
            }, {
                value: 'installmentWithDP',
                label: '首付分期流'
            }
            ],
            dateTime: [],
            params: {},
            pickerOptions: {
                disabledDate(time) {
                    return moment(time) <= moment().subtract(1, 'days');
                },
            },
            isOnlyClick: false, //创建流只可点击一次
            activeTab: '',
            approveAmount: 0,
        }
    },
    computed: {
        ...mapState(['user', 'recipient', 'activeTabName']),
    },
    async created(){
        this.allInstance = await getInstance()
    },
    watch: {
        showModal(val){
            if (val) {
                this.isOnlyClick = false
                this.activeTab = this.activeTabName
                this.initParam()
            }
        },
        activeTab(){
            this.initParam()
        }
    },
    methods: {
        initParam(){
            this.params = {
                recipient: '', //接收者
                deposit: '10000', //流金额
                maxAmount: '10000', //可承受最大转账金额
                ratePerSecond: '50', //流动率
                tokenAddress: '', //币种
                startTime: moment().add(5, 'minutes'), //开始时间
                numberOfInstallments: '3', //分期数
                feesOfRecipientPer: '0', //手续费
                downPaymentRatio: '10', //首付比例%
            }
            this.dateTime = [moment().add(5, 'minutes'), moment().add(1, 'days')]
            this.params.recipient = this.recipient
            this.approveAmount = 0
            // this.params.tokenAddress = this.allInstance.testnetInstance.options.address
        },
        async save() {
            let isOk = await this.validate(this.params)
            if (!isOk) return
            this.isOnlyClick = true
            let res
            //批准、铸币
            if (this.activeTab == 'sablier') {
                await this.allInstance.testnetInstance.methods.approve(this.allInstance.sablierInstance.options.address, setMoneyWeb3(this.params.deposit)).send({
                    gas: 500000,
                    from: this.user
                });
                // await this.allInstance.testnetInstance.methods.mint(this.user, setMoneyWeb3(this.params.deposit)).send({
                //     gas: 500000,
                //     from: this.user
                // });
                res = await this.allInstance.sablierInstance.methods
                    .createStream(this.params.recipient, setMoneyWeb3(this.params.deposit),
                        this.params.tokenAddress, moment(this.dateTime[0]).unix(), moment(this.dateTime[1]).unix())
                    .send({
                        gas: 500000,
                        from: this.user
                    })
            } else if (this.activeTab == 'fixedFlowrate'){
                await this.allInstance.testnetInstance.methods.approve(this.allInstance.fixedFlowrateInstance.options.address,
                    setMoneyWeb3(this.params.maxAmount)).send({
                    gas: 500000,
                    from: this.user
                });
                res = await this.allInstance.fixedFlowrateInstance.methods
                    .createFixedFlowrateStream(this.params.recipient, setMoneyWeb3(this.params.maxAmount),
                        this.params.tokenAddress, setMoneyWeb3(this.params.ratePerSecond), moment(this.params.startTime).unix())
                    .send({
                        gas: 500000,
                        from: this.user
                    })
            } else if (this.activeTab == 'installment') {
                if (this.params.feesOfRecipientPer != 0){
                    this.approveAmount = this.params.deposit * this.params.numberOfInstallments * (moment(this.dateTime[1]).unix() - moment(this.dateTime[0]).unix())
                    this.approveAmount = new bignumber(this.params.feesOfRecipientPer).multipliedBy(this.approveAmount)
                    this.approveAmount = new bignumber(this.approveAmount).plus(this.params.deposit).toString()
                } else {
                    this.approveAmount = this.params.deposit
                }
                await this.allInstance.testnetInstance.methods.approve(this.allInstance.installmentInstance.options.address, setMoneyWeb3(this.approveAmount)).send({
                    gas: 3000000,
                    from: this.user
                })
                res = await this.allInstance.installmentInstance.methods
                    .createInstallmentStream(this.params.recipient, setMoneyWeb3(this.params.deposit),
                        this.params.tokenAddress, moment(this.dateTime[0]).unix(), moment(this.dateTime[1]).unix(),
                        this.params.numberOfInstallments, setMoneyWeb3(this.params.feesOfRecipientPer))
                    .send({
                        gas: 500000,
                        from: this.user
                    })
            } else if (this.activeTab == 'installmentWithDP') {
                if (this.params.feesOfRecipientPer != 0){
                    this.approveAmount = this.params.deposit * ((100 - this.params.downPaymentRatio) / 100) * this.params.numberOfInstallments
                        * (moment(this.dateTime[1]).unix() - moment(this.dateTime[0]).unix())
                    this.approveAmount = new bignumber(this.params.feesOfRecipientPer).multipliedBy(this.approveAmount)
                    this.approveAmount = new bignumber(this.approveAmount).plus(this.params.deposit).toString()
                } else {
                    this.approveAmount = this.params.deposit
                }
                await this.allInstance.testnetInstance.methods.approve(this.allInstance.installmentWithDPInstance.options.address, setMoneyWeb3(this.approveAmount)).send({
                    gas: 3000000,
                    from: this.user
                })
                res = await this.allInstance.installmentWithDPInstance.methods
                    .createInstallmentWithDPStream(this.params.recipient, setMoneyWeb3(this.params.deposit),
                        this.params.tokenAddress, moment(this.dateTime[0]).unix(), moment(this.dateTime[1]).unix(),
                        this.params.numberOfInstallments, this.params.downPaymentRatio,
                        setMoneyWeb3(this.params.feesOfRecipientPer),)
                    .send({
                        gas: 500000,
                        from: this.user
                    })
            }
            if (res) {
                this.isOnlyClick = false
                this.$store.commit('updateData', {key: 'activeTabName', value: this.activeTab})
                this.$alert('创建成功!', '操作提示', {type: 'success'})
                this.closeModal()
            }

        },
        async validate(params){
            try {
                if (!params.recipient) throw new Error('收件人为必填项！')
                if (!params.tokenAddress) throw new Error('币种为必填项！')
                if (this.activeTab == 'fixedFlowrate'){
                    if (!params.maxAmount || params.maxAmount <= 0) throw new Error('最大金额为必填项，且需大于0！')
                    if (!params.ratePerSecond || params.ratePerSecond <= 0) throw new Error('流动率为必填项，且需大于0！')
                    if (!params.startTime || params.startTime <= moment()) throw new Error('开始时间为必填项，且需大于当前时间！')
                } else {
                    if (!params.deposit || params.deposit <= 0) throw new Error('流金额为必填项，且需大于0！')
                    if (!this.dateTime || this.dateTime[0] <= moment()) throw new Error('起止时间为必填项，且开始时间需大于当前时间！')
                }
                if (this.activeTab == 'installmentWithDP' || this.activeTab == 'installment'){
                    if (!params.numberOfInstallments || params.numberOfInstallments < 0) throw new Error('分期数为必填项，且需大于0！')
                    if (!params.feesOfRecipientPer || params.feesOfRecipientPer < 0) throw new Error('手续费为必填项，最小为0！')
                    if ((moment(this.dateTime[1]).unix() - moment(this.dateTime[0]).unix()) % params.numberOfInstallments != 0){
                        throw new Error('持续时间除分期数不得有余数！')
                    }
                }
                if (this.activeTab == 'installmentWithDP'){
                    if (!params.downPaymentRatio || params.downPaymentRatio < 0 || params.downPaymentRatio > 100) throw new Error('首付比例为必填项，且范围在0～100之间！')
                }
            }
            catch (err){
                this.$notify.error({title: err.message})
                return false
            }
            return true
        },
        closeModal() {
            this.$emit('close');
        },
    },
};
</script>


