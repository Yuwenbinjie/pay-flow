<template>
    <div class="pay-dashboard">
        <p class="title-lv1">
            {{ $t('dashboard.dash') }}
        </p>
        <el-tabs
            v-model="activeTab"
            @tab-click="changeTab"
        >
            <el-tab-pane
                :label="$t('dashboard.stream.fixedDeposit')"
                name="sablier"
            />
            <el-tab-pane
                :label="$t('dashboard.stream.fixedFlowrate')"
                name="fixedFlowrate"
            />
            <el-tab-pane
                :label="$t('dashboard.stream.installment')"
                name="installment"
            />
            <el-tab-pane
                :label="$t('dashboard.stream.installementWithDP')"
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
                    {{ $t('dashboard.create') }}
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
                    :label="$t('dashboard.info.id')"
                />
                <el-table-column
                    prop="sender"
                    :label="$t('dashboard.info.sender')"
                >
                    <template slot-scope="scope">
                        <el-tooltip :content="scope.row.sender">
                            <div>{{ scope.row.sender | filterAdressName }}</div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="recipient"
                    :label="$t('dashboard.info.recipient')"
                >
                    <template slot-scope="scope">
                        <el-tooltip :content="scope.row.recipient">
                            <div>{{ scope.row.recipient | filterAdressName }}</div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="activeTab!='fixedFlowrate'"
                    prop="deposit"
                    :label="$t('dashboard.info.deposit')"
                    :formatter="formatMoneyWithUnit"
                />
                <el-table-column
                    v-if="activeTab=='fixedFlowrate'"
                    prop="maxAmount"
                    :label="$t('dashboard.info.maxAmount')"
                    :formatter="formatMoneyWithUnit"
                />
                <el-table-column
                    v-if="activeTab=='fixedFlowrate'"
                    prop="ratePerSecond"
                    :label="$t('dashboard.info.ratepersecond')"
                    :formatter="formatMoney"
                />
                <el-table-column
                    v-if="activeTab=='installment'||activeTab=='installmentWithDP'"
                    prop="numberOfInstallments"
                    :label="$t('dashboard.info.numbeOfInstallments')"
                />
                <el-table-column
                    v-if="activeTab=='installmentWithDP'"
                    prop="downPaymentRatio"
                    :label="$t('dashboard.info.downpaymentRatio')"
                >
                    <template slot-scope="scope">
                        <div>{{ scope.row.downPaymentRatio }} %</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="startTime"
                    :label="$t('dashboard.info.startTime')"
                    :formatter="formatDate"
                />
                <el-table-column
                    v-if="activeTab!='fixedFlowrate'"
                    prop="stopTime"
                    :label="$t('dashboard.info.stopTime')"
                    :formatter="formatDate"
                />
                <el-table-column
                    v-if="activeTab=='fixedFlowrate'"
                    prop="maxStopTime"
                    :label="$t('dashboard.info.maxStopTime')"
                    :formatter="formatDate"
                />
                <el-table-column
                    width="120"
                    :label="$t('dashboard.info.operation')"
                >
                    <template slot-scope="scope">
                        <router-link
                            v-if="!scope.row.isCancelStstus"
                            :to="{path: '/streamInfo',
                                  query: {streamId:scope.row.streamId, activeTabName:activeTab}}"
                        >
                            <el-button
                                :title="$t('dashboard.info.checkStream')"
                                type="primary"
                                size="medium"
                                round
                                plain
                            >
                                {{ $t('dashboard.info.checkStream') }}<i class="el-icon-right" />
                            </el-button>
                        </router-link>
                        <router-link
                            v-else
                            :to="{path: '/cancelInfo',
                                  query: {streamId:scope.row.streamId, activeTabName:activeTab}}"
                        >
                            <el-button
                                :title="$t('dashboard.info.cancel')"
                                type="danger"
                                size="medium"
                                round
                                plain
                            >
                                {{ $t('dashboard.info.cancel') }}<i class="el-icon-right" />
                            </el-button>
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
import {getMoney, filterAdressName, getMoneyWithUnit} from '@/utils/utils.js'
import {getInstance} from '../utils/connectContract'
import CreatStream from '@/components/qualification/CreatStream.vue'

export default {
    name: 'Dashboard',
    components: {
        CreatStream,
    },
    filters: {
        filterAdressName,
    },
    data() {
        return {
            data: [],
            showModal: false,
            cancelStreamArr: [],
            activeTab: 'sablier',
            allInstance: {}//获取的所有合约接口
        }
    },
    async created(){
        this.allInstance = await getInstance()
        this.activeTab = this.activeTabName
        this.ajaxQuery()
    },
    computed: {
        ...mapState(['user', 'recipient', 'activeTabName']),
    },
    methods: {
        formatDate(row, column, val) {
            return moment(parseInt(val, 10), 'X').format('YYYY-MM-DD HH:mm:ss');
        },
        formatMoney(row, column, val) {
            return getMoney(val)
        },
        formatMoneyWithUnit(row, column, val) {
            return getMoneyWithUnit(val, row.tokenAddress)
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
            this.data = []//每次清空数据
            let cancelRes = []//被取消的流
            let dataOfSender = []//返回当前用户作为发送者列表
            let dataOfRecipient = []//返回当前用户作为接收者列表
            if (this.activeTab == 'sablier') {
                cancelRes = await this.allInstance.sablierInstance.getPastEvents('CancelStream', {fromBlock: 0})
                dataOfSender = await this.allInstance.sablierInstance.getPastEvents('CreateStream', {filter: {sender: this.user}, fromBlock: 0})
                dataOfRecipient = await this.allInstance.sablierInstance.getPastEvents('CreateStream', {filter: {recipient: this.user}, fromBlock: 0})
            } else if (this.activeTab == 'fixedFlowrate'){
                cancelRes = await this.allInstance.fixedFlowrateInstance.getPastEvents('CancelFixedFlowrateStream', {fromBlock: 0})
                dataOfSender = await this.allInstance.fixedFlowrateInstance.getPastEvents('CreateFixedFlowrateStream', {filter: {sender: this.user}, fromBlock: 0})
                dataOfRecipient = await this.allInstance.fixedFlowrateInstance.getPastEvents('CreateFixedFlowrateStream', {filter: {recipient: this.user}, fromBlock: 0})
            } else if (this.activeTab == 'installment'){
                cancelRes = await this.allInstance.installmentInstance.getPastEvents('CancelInstallmentStream', {fromBlock: 0})
                dataOfSender = await this.allInstance.installmentInstance.getPastEvents('CreateInstallmentStream', {filter: {sender: this.user}, fromBlock: 0})
                dataOfRecipient = await this.allInstance.installmentInstance.getPastEvents('CreateInstallmentStream', {filter: {recipient: this.user}, fromBlock: 0})
            } else if (this.activeTab == 'installmentWithDP'){
                cancelRes = await this.allInstance.installmentWithDPInstance.getPastEvents('CancelInstallmentWithDPStream', {fromBlock: 0})
                dataOfSender = await this.allInstance.installmentWithDPInstance.getPastEvents('CreateInstallmentWithDPStream', {filter: {sender: this.user}, fromBlock: 0})
                dataOfRecipient = await this.allInstance.installmentWithDPInstance.getPastEvents('CreateInstallmentWithDPStream', {filter: {recipient: this.user}, fromBlock: 0})
            }
            let dataAll = _.concat(dataOfSender, dataOfRecipient)//连接后的数据
            this.cancelStreamArr = _.map(cancelRes, (o)=>{return o.returnValues.streamId})
            this.data = _.map(dataAll, (o)=>{
                o.returnValues.isCancelStstus = this.cancelStreamArr.includes(o.returnValues.streamId)
                return o.returnValues
            })
        },
    },
}
</script>
