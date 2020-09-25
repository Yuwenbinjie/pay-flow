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
            {{ $t('createstream.create.create') }}
        </div>
        <div class="px20">
            <el-form
                ref="createForm"
                label-position="top"
                label-width="80px"
                :model="params"
            >
                <el-form-item :label="$t('createstream.create.types')">
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
                <el-form-item :label="$t('createstream.create.who')">
                    <el-input v-model="params.recipient" />
                </el-form-item>
                <el-form-item
                    v-if="activeTab!='fixedFlowrate'"
                    :label="$t('createstream.create.deposit')"
                >
                    <el-input
                        type="number"
                        v-model="params.deposit"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeTab=='fixedFlowrate'"
                    :label="$t('createstream.create.maxAmount')"
                >
                    <el-input
                        type="number"
                        v-model="params.maxAmount"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeTab=='fixedFlowrate'"
                    :label="$t('createstream.create.ratepersecond')"
                >
                    <el-input
                        type="number"
                        v-model="params.ratePerSecond"
                    />
                </el-form-item>
                <el-form-item :label="$t('createstream.create.token')">
                    <!-- <el-autocomplete style="width:100%" valueKey="label" :fetch-suggestions="querySearch" v-model="params.tokenAddress" /> -->
                    <el-select
                        style="width:100%"
                        v-model="params.tokenAddress"
                        :placeholder="$t('createstream.create.choose')"
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
                    :label="$t('createstream.create.time')"
                >
                    <el-date-picker
                        v-model="dateTime"
                        align="right"
                        style="width:100%"
                        type="datetimerange"
                        :range-separator="$t('createstream.create.to')"
                        :start-placeholder="$t('createstream.create.startTime')"
                        :end-placeholder="$t('createstream.create.stopTime')"
                        :picker-options="pickerOptions"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeTab=='fixedFlowrate'"
                    :label="$t('createstream.create.startTime')"
                >
                    <el-date-picker
                        v-model="params.startTime"
                        align="right"
                        style="width:100%"
                        type="datetime"
                        placeholder="$t('createstream.create.choosetime')"
                        :picker-options="pickerOptions"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeTab=='installment'||activeTab=='installmentWithDP'"
                    :label="$t('createstream.create.numbeOfInstallments')"
                >
                    <el-input
                        type="number"
                        v-model="params.numberOfInstallments"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeTab=='installment'||activeTab=='installmentWithDP'"
                    :label="$t('createstream.create.fees')"
                >
                    <el-input
                        type="number"
                        v-model="params.feesOfRecipientPer"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeTab=='installmentWithDP'"
                    :label="$t('createstream.create.downpaymentRatio')"
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
                        {{ isOnlyClick? $t('createstream.create.creating'):$t('createstream.create.create') }}<i class="el-icon-right el-icon--right" />
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
                label: this.$t('dashboard.stream.fixedDeposit')
            }, {
                value: 'fixedFlowrate',
                label: this.$t('dashboard.stream.fixedFlowrate')
            }, {
                value: 'installment',
                label: this.$t('dashboard.stream.installment')
            }, {
                value: 'installmentWithDP',
                label: this.$t('dashboard.stream.installementWithDP')
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
                this.$alert(this.$t('createstream.create.createSuccess'), this.$t('streamInfo.function.operationHint'), {type: 'success'})
                this.closeModal()
            }

        },
        async validate(params){
            try {
                if (!params.recipient) throw new Error(this.$t('createstream.validate.recipient'))
                if (!params.tokenAddress) throw new Error(this.$t('createstream.validate.tokenAddress'))
                if (this.activeTab == 'fixedFlowrate'){
                    if (!params.maxAmount || params.maxAmount <= 0) throw new Error(this.$t('createstream.validate.maxAmount'))
                    if (!params.ratePerSecond || params.ratePerSecond <= 0) throw new Error(this.$t('createstream.validate.ratePerSecond'))
                    if (!params.startTime || params.startTime <= moment()) throw new Error(this.$t('createstream.validate.startTime'))
                } else {
                    if (!params.deposit || params.deposit <= 0) throw new Error(this.$t('createstream.validate.deposit'))
                    if (!this.dateTime || this.dateTime[0] <= moment()) throw new Error(this.$t('createstream.validate.dateTime'))
                }
                if (this.activeTab == 'installmentWithDP' || this.activeTab == 'installment'){
                    if (!params.numberOfInstallments || params.numberOfInstallments < 0) throw new Error(this.$t('createstream.validate.numberOfInstallments'))
                    if (!params.feesOfRecipientPer || params.feesOfRecipientPer < 0) throw new Error(this.$t('createstream.validate.feesOfRecipientPer'))
                    if ((moment(this.dateTime[1]).unix() - moment(this.dateTime[0]).unix()) % params.numberOfInstallments != 0){
                        throw new Error(this.$t('createstream.validate.remainder'))
                    }
                }
                if (this.activeTab == 'installmentWithDP'){
                    if (!params.downPaymentRatio || params.downPaymentRatio < 0 || params.downPaymentRatio > 100) throw new Error(this.$t('createstream.validate.downPaymentRatio'))
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


