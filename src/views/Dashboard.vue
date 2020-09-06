<template>
    <div class="pay-dashboard">
        <p class="title-lv1">
            仪表盘
        </p>
        <el-tabs
            v-model="activeTab"
            @tab-click="changeTab"
        >
            <el-tab-pane
                label="固定金额流"
                name="sablier"
            />
            <el-tab-pane
                label="固定流率流"
                name="fixedFlowrate"
            />
            <el-tab-pane
                label="分期流"
                name="installment"
            />
            <el-tab-pane
                label="首付分期流"
                name="installmentWithDP"
            />
        </el-tabs>
        <div class="panel minW1100">
            <div class="clearfix mb24">
                <el-button
                    type="primary"
                    round
                    icon="el-icon-s-promotion"
                    @click="creat"
                >
                    创建流
                </el-button>
                <creat-stream
                    :show-modal="showModal"
                    @close="closeModal"
                />
            </div>
            <el-table
                :data="data"
                border
            >
                <el-table-column
                    prop="streamId"
                    label="流ID"
                />
                <el-table-column
                    prop="sender"
                    label="发送者"
                />
                <el-table-column
                    prop="recipient"
                    label="接收者"
                />
                <el-table-column
                    v-if="activeTabName!='fixedFlowrate'"
                    prop="deposit"
                    label="流金额"
                    :formatter="formatMoney"
                />
                <el-table-column
                    prop="tokenAddress"
                    label="币种"
                />
                <el-table-column
                    v-if="activeTabName=='fixedFlowrate'"
                    prop="maxAmount"
                    label="最大金额"
                    :formatter="formatMoney"
                />
                <el-table-column
                    v-if="activeTabName=='fixedFlowrate'"
                    prop="ratePerSecond"
                    label="流动率"
                    :formatter="formatMoney"
                />
                <el-table-column
                    v-if="activeTabName=='installment'||activeTabName=='installmentWithDP'"
                    prop="numberOfInstallments"
                    label="分期数"
                />
                <el-table-column
                    v-if="activeTabName=='installment'||activeTabName=='installmentWithDP'"
                    prop="feesOfRecipientPer"
                    label="手续费"
                    :formatter="formatMoney"
                />
                <el-table-column
                    v-if="activeTabName=='installmentWithDP'"
                    prop="downPaymentRatio"
                    label="首付比例"
                >
                    <template slot-scope="scope">
                        <div>{{ scope.row.downPaymentRatio }} %</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="startTime"
                    label="开始时间"
                    :formatter="formatDate"
                />
                <el-table-column
                    v-if="activeTabName!='fixedFlowrate'"
                    prop="stopTime"
                    label="结束时间"
                    :formatter="formatDate"
                />
                <el-table-column
                    width="120"
                    label="操作"
                >
                    <template slot-scope="scope">
                        <router-link
                            v-if="!scope.row.isCancelStstus"
                            :to="{path: '/streamInfo',
                                  query: {streamId:scope.row.streamId, activeTabName:activeTabName}}"
                        >
                            <el-button
                                title="查看流"
                                type="primary"
                                round
                                plain
                            >
                                查看<i class="el-icon-right" />
                            </el-button>
                        </router-link>
                        <div
                            class="c-9"
                            v-else
                        >
                            已取消
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import {mapState} from 'vuex'
import {getMoney} from '@/utils/utils.js'
// import sablierInstance from '../utils/sablierInstance'
// import fixedFlowrateInstance from '../utils/fixedFlowrateInstance'
// import installmentInstance from '../utils/installmentInstance'
// import installmentWithDPInstance from '../utils/installmentWithDPInstance'
import {getInstance} from '../utils/connectContract'
import CreatStream from '@/components/qualification/CreatStream.vue'

export default {
    name: 'ErpReport',
    components: {
        CreatStream,
    },
    data() {
        return {
            data: [],
            showModal: false,
            cancelStreamArr: [],
            activeTab: '',
            allInstance: {}//获取的所有合约接口
        }
    },
    async created(){
        this.allInstance = await getInstance()
        this.ajaxQuery()
    },
    computed: {
        ...mapState(['sender', 'recipient', 'activeTabName']),
    },
    methods: {
        formatDate(row, column, val) {
            return moment(parseInt(val, 10), 'X').format('YYYY-MM-DD HH:mm:ss');
        },
        formatMoney(row, column, val) {
            return getMoney(val)
        },
        creat() {
            this.showModal = true
        },
        changeTab(){
            this.$store.commit('updateData', {key: 'activeTabName', value: this.activeTab})
            this.ajaxQuery()
        },
        closeModal() {
            this.showModal = false
            this.ajaxQuery()
        },
        async ajaxQuery(){//post请求列表数据
            this.activeTab = this.activeTabName
            if (this.activeTabName == 'sablier') {
                this.allInstance.sablierInstance.getPastEvents('CancelStream', {fromBlock: 0}, async (error, events) => {
                    this.cancelStreamArr = _.map(events, (o)=>{
                        return o.returnValues.streamId
                    })
                })
                this.allInstance.sablierInstance.getPastEvents('CreateStream', {fromBlock: 0}, async (error, events) => {
                    this.data = _.map(events, (o)=>{
                        o.returnValues.isCancelStstus = this.cancelStreamArr.includes(o.returnValues.streamId)
                        return o.returnValues
                    })
                })
            } else if (this.activeTabName == 'fixedFlowrate'){
                this.allInstance.fixedFlowrateInstance.getPastEvents('CancelFixedFlowrateStream', {fromBlock: 0}, async (error, events) => {
                    this.cancelStreamArr = _.map(events, (o)=>{
                        return o.returnValues.streamId
                    })
                })
                this.allInstance.fixedFlowrateInstance.getPastEvents('CreateFixedFlowrateStream',
                    {fromBlock: 0}, async (error, events) => {
                        this.data = _.map(events, (o)=>{
                            o.returnValues.isCancelStstus = this.cancelStreamArr.includes(o.returnValues.streamId)
                            return o.returnValues
                        })
                    // console.log(events)
                    })
            } else if (this.activeTabName == 'installment'){
                this.allInstance.installmentInstance.getPastEvents('CancelInstallmentStream', {fromBlock: 0}, async (error, events) => {
                    this.cancelStreamArr = _.map(events, (o)=>{
                        return o.returnValues.streamId
                    })
                })
                this.allInstance.installmentInstance.getPastEvents('CreateInstallmentStream', {fromBlock: 0}, async (error, events) => {
                    this.data = _.map(events, (o)=>{
                        o.returnValues.isCancelStstus = this.cancelStreamArr.includes(o.returnValues.streamId)
                        return o.returnValues
                    })
                })
            } else if (this.activeTabName == 'installmentWithDP'){
                this.allInstance.installmentWithDPInstance.getPastEvents('CancelInstallmentWithDPStream', {fromBlock: 0}, async (error, events) => {
                    this.cancelStreamArr = _.map(events, (o)=>{
                        return o.returnValues.streamId
                    })
                })
                this.allInstance.installmentWithDPInstance.getPastEvents('CreateInstallmentWithDPStream',
                    {fromBlock: 0}, async (error, events) => {
                        this.data = _.map(events, (o)=>{
                            o.returnValues.isCancelStstus = this.cancelStreamArr.includes(o.returnValues.streamId)
                            return o.returnValues
                        })
                    })
            }

        },
    },
}
</script>
