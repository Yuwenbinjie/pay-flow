<template>
    <div class="pay-dashboard">
        <p class="title-lv1">
            仪表盘
        </p>
        <div class="panel">
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
                border>
                <el-table-column
                    prop="streamId"
                    label="流ID">
                </el-table-column>
                <el-table-column
                    prop="sender"
                    label="发送者">
                </el-table-column>
                <el-table-column
                    prop="recipient"
                    label="接收者">
                </el-table-column>
                <el-table-column
                    prop="deposit"
                    label="流金额">
                </el-table-column>
                <el-table-column
                    prop="tokenAddress"
                    label="币种">
                </el-table-column>
                <el-table-column
                    prop="startTime"
                    label="开始时间"
                    :formatter="formatterDate">
                </el-table-column>
                <el-table-column
                    prop="stopTime"
                    label="结束时间"
                    :formatter="formatterDate">
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <router-link to="/streamInfo" class="mr16">
                            <el-button icon="el-icon-link" title="查看链接" circle></el-button>
                        </router-link>
                        <router-link :to="{path: '/streamInfo', query: {streamId:scope.row.streamId}}">
                            <el-button icon="el-icon-right" title="查看流" circle></el-button>
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
import sablierInstance from '../utils/sablierInstance'
import testnetInstance from '../utils/testNetInstance'
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
        }
    },
    created(){
        this.ajaxQuery()
        // this.getQueryTypeOpt()
    },
    methods: {
        formatterDate(row, column, val) {
            return moment(parseInt(val)).format('YYYY-MM-DD');
        },
        creat() {
            this.showModal = true
        },
        closeModal() {
            this.showModal = false
            this.ajaxQuery()
        },
        async ajaxQuery(){//post请求列表数据
            sablierInstance.getPastEvents('CreateStream',{fromBlock:0},async (error,events) => {
                //如果有i个事件，分别循环打印出所有时间的以下信息
                this.data = _.map(events,'returnValues')
                console.log(this.data)
            })
        },
    },
}
</script>
