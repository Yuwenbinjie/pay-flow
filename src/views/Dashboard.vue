<template>
    <div class="pay-dashboard">
        <p class="title-lv1">
            仪表盘
        </p>
        <el-tabs
            v-model="activeTabName"
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
                    :active-tab-name="activeTabName"
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
                />
                <el-table-column
                    prop="tokenAddress"
                    label="币种"
                />
                <el-table-column
                    v-if="activeTabName=='fixedFlowrate'"
                    prop="maxAmount"
                    label="最大金额"
                />
                <el-table-column
                    v-if="activeTabName=='fixedFlowrate'"
                    prop="ratePerSecond"
                    label="流动率"
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
                />
                <el-table-column
                    v-if="activeTabName=='installmentWithDP'"
                    prop="downPaymentRatio"
                    label="首付比例"
                />
                <el-table-column
                    prop="startTime"
                    label="开始时间"
                    :formatter="formatterDate"
                />
                <el-table-column
                    v-if="activeTabName!='fixedFlowrate'"
                    prop="stopTime"
                    label="结束时间"
                    :formatter="formatterDate"
                />
                <el-table-column
                    width="120"
                    label="操作"
                >
                    <template slot-scope="scope">
                        <router-link
                            to="/streamInfo"
                            class="mr16"
                        >
                            <el-button
                                icon="el-icon-link"
                                title="查看链接"
                                circle
                            />
                        </router-link>
                        <router-link
                            :to="{path: '/streamInfo',
                                  query: {streamId:scope.row.streamId, activeTabName:activeTabName}}"
                        >
                            <el-button
                                icon="el-icon-right"
                                title="查看流"
                                circle
                            />
                        </router-link>
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
import sablierInstance from '../utils/sablierInstance'
import fixedFlowrateInstance from '../utils/fixedFlowrateInstance'
import installmentInstance from '../utils/installmentInstance'
import installmentWithDPInstance from '../utils/installmentWithDPInstance'
import CreatStream from '@/components/qualification/CreatStream.vue'

export default {
    name: 'ErpReport',
    components: {
        CreatStream,
    },
    data() {
        return {
            data: [],
            activeTabName: 'sablier',
            showModal: false,
        }
    },
    created(){
        this.ajaxQuery()
    },
    computed: {
        ...mapState(['sender', 'recipient']),
    },
    methods: {
        formatterDate(row, column, val) {
            return moment(parseInt(val, 10)).format('YYYY-MM-DD');
        },
        creat() {
            this.showModal = true
        },
        changeTab(){
            this.ajaxQuery()
        },
        closeModal() {
            this.showModal = false
            this.ajaxQuery()
        },
        async ajaxQuery(){//post请求列表数据
            if (this.activeTabName == 'sablier') {
                sablierInstance.getPastEvents('CreateStream', {fromBlock: 0}, async (error, events) => {
                    this.data = _.map(events, 'returnValues')
                    // console.log(this.data)
                })
            } else if (this.activeTabName == 'fixedFlowrate'){
                fixedFlowrateInstance.getPastEvents('CreateFixedFlowrateStream',
                    {fromBlock: 0}, async (error, events) => {
                        this.data = _.map(events, 'returnValues')
                    // console.log(events)
                    })
            } else if (this.activeTabName == 'installment'){
                installmentInstance.getPastEvents('CreateInstallmentStream', {fromBlock: 0}, async (error, events) => {
                    this.data = _.map(events, 'returnValues')
                })
            } else if (this.activeTabName == 'installmentWithDP'){
                installmentWithDPInstance.getPastEvents('CreateInstallmentWithDPStream',
                    {fromBlock: 0}, async (error, events) => {
                        this.data = _.map(events, 'returnValues')
                    })
            }

        },
    },
}
</script>
