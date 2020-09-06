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
                    v-if="activeTabName!='fixedFlowrate'"
                    label="流金额"
                >
                    <el-input
                        type="number"
                        v-model="params.deposit"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeTabName=='fixedFlowrate'"
                    label="可承受最大金额转账"
                >
                    <el-input
                        type="number"
                        v-model="params.maxAmount"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeTabName=='fixedFlowrate'"
                    label="流动率（每秒流动金额）"
                >
                    <el-input
                        type="number"
                        v-model="params.ratePerSecond"
                    />
                </el-form-item>
                <el-form-item label="币种">
                    <el-input v-model="params.tokenAddress" />
                </el-form-item>
                <el-form-item
                    v-if="activeTabName!='fixedFlowrate'"
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
                    v-if="activeTabName=='fixedFlowrate'"
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
                    v-if="activeTabName=='installment'||activeTabName=='installmentWithDP'"
                    label="分期数"
                >
                    <el-input
                        type="number"
                        v-model="params.numberOfInstallments"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeTabName=='installment'||activeTabName=='installmentWithDP'"
                    label="接收者收取的手续费"
                >
                    <el-input
                        type="number"
                        v-model="params.feesOfRecipientPer"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeTabName=='installmentWithDP'"
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
                        @click="save"
                    >
                        创建流<i class="el-icon-right el-icon--right" />
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-drawer>
</template>

<script>
import {mapState} from 'vuex'
import moment from 'moment'
import {setMoney} from '@/utils/utils.js'
import {getInstance} from '@/utils/connectContract'
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
            activeTab: '',
        }
    },
    computed: {
        ...mapState(['sender', 'recipient', 'activeTabName']),
    },
    async created(){
        this.allInstance = await getInstance()
    },
    watch: {
        showModal(val){
            if (val) {
                // console.log(this.activeTabName)
                // console.log(this.sender, this.recipient)
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
            this.params.tokenAddress = this.allInstance.testnetInstance.options.address
        },
        async save() {
            // console.log(this.dateTime)
            let isOk = await this.validate(this.params)
            if (!isOk) return
            this.$store.commit('updateData', {key: 'activeTabName', value: this.activeTab})
            //批准、铸币
            if (this.activeTabName == 'sablier') {
                await this.allInstance.testnetInstance.methods.approve(this.allInstance.sablierInstance.options.address, setMoney(this.params.deposit)).send({
                    gas: 3000000,
                    from: this.sender
                });
                await this.allInstance.testnetInstance.methods.mint(this.sender, setMoney(this.params.deposit)).send({
                    gas: 3000000,
                    from: this.sender
                });
                let res = await this.allInstance.sablierInstance.methods
                    .createStream(this.params.recipient, setMoney(this.params.deposit),
                        this.params.tokenAddress, moment(this.dateTime[0]).unix(), moment(this.dateTime[1]).unix())
                    .send({
                        gas: 3000000,
                        from: this.sender
                    })
                if (res) {
                    this.closeModal()
                }
            } else if (this.activeTabName == 'fixedFlowrate'){
                await this.allInstance.testnetInstance.methods.approve(this.allInstance.fixedFlowrateInstance.options.address,
                    setMoney(this.params.maxAmount)).send({
                    gas: 3000000,
                    from: this.sender
                });
                await this.allInstance.testnetInstance.methods.mint(this.sender, setMoney(this.params.maxAmount)).send({
                    gas: 3000000,
                    from: this.sender
                });
                let res = await this.allInstance.fixedFlowrateInstance.methods
                    .createFixedFlowrateStream(this.params.recipient, setMoney(this.params.maxAmount),
                        this.params.tokenAddress, setMoney(this.params.ratePerSecond), moment(this.params.startTime).unix())
                    .send({
                        gas: 3000000,
                        from: this.sender
                    })
                if (res) {
                    this.closeModal()
                }
            } else if (this.activeTabName == 'installment') {
                await this.allInstance.testnetInstance.methods.approve(this.allInstance.installmentInstance.options.address, setMoney(this.params.deposit)).send({
                    gas: 3000000,
                    from: this.sender
                });
                await this.allInstance.testnetInstance.methods.mint(this.sender, setMoney(this.params.deposit)).send({
                    gas: 3000000,
                    from: this.sender
                });
                let res = await this.allInstance.installmentInstance.methods
                    .createInstallmentStream(this.params.recipient, setMoney(this.params.deposit),
                        this.params.tokenAddress, moment(this.dateTime[0]).unix(), moment(this.dateTime[1]).unix(),
                        this.params.numberOfInstallments, setMoney(this.params.feesOfRecipientPer))
                    .send({
                        gas: 3000000,
                        from: this.sender
                    })
                if (res) {
                    this.closeModal()
                }
            } else if (this.activeTabName == 'installmentWithDP') {
                await this.allInstance.testnetInstance.methods.approve(this.allInstance.installmentWithDPInstance.options.address,
                    setMoney(this.params.deposit)).send({
                    gas: 3000000,
                    from: this.sender
                });
                await this.allInstance.testnetInstance.methods.mint(this.sender, setMoney(this.params.deposit)).send({
                    gas: 3000000,
                    from: this.sender
                });
                let res = await this.allInstance.installmentWithDPInstance.methods
                    .createInstallmentWithDPStream(this.params.recipient, setMoney(this.params.deposit),
                        this.params.tokenAddress, moment(this.dateTime[0]).unix(), moment(this.dateTime[1]).unix(),
                        this.params.numberOfInstallments, this.params.downPaymentRatio,
                        setMoney(this.params.feesOfRecipientPer),)
                    .send({
                        gas: 3000000,
                        from: this.sender
                    })
                if (res) {
                    this.closeModal()
                }
            }

        },
        async validate(params){
            try {
                if (!params.recipient) throw new Error('收件人为必填项！')
                if (!params.tokenAddress) throw new Error('币种为必填项！')
                if (this.activeTabName == 'fixedFlowrate'){
                    if (!params.maxAmount || params.maxAmount < 0) throw new Error('最大金额为必填项，且需大于0！')
                    if (!params.ratePerSecond || params.ratePerSecond < 0) throw new Error('流动率为必填项，且需大于0！')
                    if (!params.startTime || params.startTime <= moment()) throw new Error('开始时间为必填项，且需大于当前时间！')
                } else {
                    if (!params.deposit || params.deposit < 0) throw new Error('流金额为必填项，且需大于0！')
                    if (!this.dateTime || this.dateTime[0] <= moment()) throw new Error('起止时间为必填项，且开始时间需大于当前时间！')
                }
                if (this.activeTabName == 'installmentWithDP' || this.activeTabName == 'installment'){
                    if (!params.numberOfInstallments || params.numberOfInstallments < 0) throw new Error('分期数为必填项，且需大于0！')
                    if (!params.feesOfRecipientPer || params.feesOfRecipientPer < 0) throw new Error('手续费为必填项，最小为0！')
                    if ((moment(this.dateTime[1]).unix() - moment(this.dateTime[0]).unix()) % params.numberOfInstallments != 0){
                        throw new Error('起止时间除以分期数不得有余数！')
                    }
                }
                if (this.activeTabName == 'installmentWithDP'){
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


