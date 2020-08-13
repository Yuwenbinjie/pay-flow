<template>
    <el-drawer
        :visible.sync="showModal"
        id="creatStream"
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
                label-position="top"
                label-width="80px"
                :model="params"
            >
                <el-form-item label="创建流类型">
                    <el-select
                        style="width:100%"
                        v-model="activeTabName"
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
                    <el-input v-model="params.deposit" />
                </el-form-item>
                <el-form-item
                    v-if="activeTabName=='fixedFlowrate'"
                    label="可承受最大金额转账"
                >
                    <el-input v-model="params.maxAmount" />
                </el-form-item>
                <el-form-item
                    v-if="activeTabName=='fixedFlowrate'"
                    label="流动率（每秒流动金额）"
                >
                    <el-input v-model="params.ratePerSecond" />
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
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
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
                        value-format="timestamp"
                        placeholder="选择开始日期时间"
                    />
                </el-form-item>
                <el-form-item
                    v-if="activeTabName=='installment'||activeTabName=='installmentWithDP'"
                    label="分期数"
                >
                    <el-input v-model="params.numberOfInstallments" />
                </el-form-item>
                <el-form-item
                    v-if="activeTabName=='installment'||activeTabName=='installmentWithDP'"
                    label="接收者收取的手续费"
                >
                    <el-input v-model="params.feesOfRecipientPer" />
                </el-form-item>
                <el-form-item
                    v-if="activeTabName=='installmentWithDP'"
                    label="首付比例"
                >
                    <el-input v-model="params.downPaymentRatio" />
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
import testnetInstance from '@/utils/testNetInstance'
import sablierInstance from '@/utils/sablierInstance'
import fixedFlowrateInstance from '@/utils/fixedFlowrateInstance'
import installmentInstance from '@/utils/installmentInstance'
import installmentWithDPInstance from '@/utils/installmentWithDPInstance'
export default {
    name: 'CreatStream',
    props: {
        showModal: {
            type: Boolean,
            default() {
                return false;
            }
        },
        activeTabName: {
            type: String,
            default() {
                return 'sablier';
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
            dateTime: [moment().valueOf(), moment().add(1, 'days').valueOf()],
            params: {
                recipient: '', //接收者
                deposit: '1000000000000000000', //流金额
                maxAmount: '10000000000', //可承受最大转账金额
                ratePerSecond: '50', //流动率
                tokenAddress: '', //币种
                startTime: moment().valueOf(), //开始时间
                numberOfInstallments: '3', //分期数
                feesOfRecipientPer: '50', //手续费
                downPaymentRatio: '10', //首付比例
            }
        }
    },
    computed: {
        ...mapState(['sender', 'recipient']),
    },
    watch: {
        showModal(val){
            if (val) {
                // console.log(this.sender, this.recipient)
                this.params.recipient = this.recipient
                this.params.tokenAddress = testnetInstance.options.address
            }
        },
    },
    methods: {
        async save() {
            // console.log(this.dateTime)
            //批准、铸币
            if (this.activeTabName == 'sablier') {
                await testnetInstance.methods.approve(sablierInstance.options.address, this.params.deposit).send({
                    gas: 3000000,
                    from: this.sender
                });
                await testnetInstance.methods.mint(this.sender, this.params.deposit).send({
                    gas: 3000000,
                    from: this.sender
                });
                let res = await sablierInstance.methods
                    .createStream(this.params.recipient, this.params.deposit,
                        this.params.tokenAddress, this.dateTime[0], this.dateTime[1])
                    .send({
                        gas: 3000000,
                        from: this.sender
                    })
                if (res) {
                    this.closeModal()
                }
            } else if (this.activeTabName == 'fixedFlowrate'){
                await testnetInstance.methods.approve(fixedFlowrateInstance.options.address,
                    this.params.maxAmount).send({
                    gas: 3000000,
                    from: this.sender
                });
                await testnetInstance.methods.mint(this.sender, this.params.maxAmount).send({
                    gas: 3000000,
                    from: this.sender
                });
                let res = await fixedFlowrateInstance.methods
                    .createFixedFlowrateStream(this.params.recipient, this.params.maxAmount,
                        this.params.tokenAddress, this.params.ratePerSecond, this.params.startTime)
                    .send({
                        gas: 3000000,
                        from: this.sender
                    })
                if (res) {
                    this.closeModal()
                }
            } else if (this.activeTabName == 'installment') {
                await testnetInstance.methods.approve(installmentInstance.options.address, this.params.deposit).send({
                    gas: 3000000,
                    from: this.sender
                });
                await testnetInstance.methods.mint(this.sender, this.params.deposit).send({
                    gas: 3000000,
                    from: this.sender
                });
                let res = await installmentInstance.methods
                    .createInstallmentStream(this.params.recipient, this.params.deposit,
                        this.params.tokenAddress, this.dateTime[0], this.dateTime[1],
                        this.params.numberOfInstallments, this.params.feesOfRecipientPer)
                    .send({
                        gas: 3000000,
                        from: this.sender
                    })
                if (res) {
                    this.closeModal()
                }
            } else if (this.activeTabName == 'installmentWithDP') {
                await testnetInstance.methods.approve(installmentWithDPInstance.options.address,
                    this.params.deposit).send({
                    gas: 3000000,
                    from: this.sender
                });
                await testnetInstance.methods.mint(this.sender, this.params.deposit).send({
                    gas: 3000000,
                    from: this.sender
                });
                let res = await installmentWithDPInstance.methods
                    .createInstallmentWithDPStream(this.params.recipient, this.params.deposit,
                        this.params.tokenAddress, this.dateTime[0], this.dateTime[1],
                        this.params.numberOfInstallments, this.params.feesOfRecipientPer,
                        this.params.downPaymentRatio)
                    .send({
                        gas: 3000000,
                        from: this.sender
                    })
                if (res) {
                    this.closeModal()
                }
            }

        },
        checkedParam(){
            let isOk = true
            if (!this.params.type) {
                this.qualificationError = true
                isOk = false
            }
            if (this.params.markValid == -2 && !this.params.invalidReason) {
                this.invalidError = true
                isOk = false
            }
            if (!isOk) {
                this.$Notification({
                    message: '必填项不可为空!',
                    type: 'error',
                })
            }
            return isOk
        },
        closeModal() {
            this.$emit('close');
        },
    },
};
</script>


