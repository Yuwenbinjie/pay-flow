<template>
    <div class="pay-dashboard">
        <p class="title-lv1">
            流信息
        </p>
        <div class="panel">
            <div class="flex" style="justify-content:space-between;">
                <div>
                    <div id="liquidfill" style="width:550px;height:500px;"></div>
                </div>
                <div style="flex:auto;margin-left:2vw;">
                    <el-card>
                        <div slot="header" class="clearfix">
                            <span class="l40 bold fs18">流信息详情</span>
                            <el-button icon="el-icon-switch-button" type="danger" round style="float: right">取消</el-button>
                        </div>
                        <div>
                            <el-row class="t-c mb16">
                                <el-col :span="10">
                                    <el-tag style="width:100%;" effect="plain">发送：{{sender | filterName}}</el-tag>
                                </el-col>
                                <el-col :span="4">
                                    <i class="el-icon-d-arrow-right"></i>
                                </el-col>
                                <el-col :span="10">
                                    <el-tag style="width:100%;" effect="plain">接收：{{recipient | filterName}}</el-tag>
                                </el-col>
                            </el-row>
                            <p class="bold fs18 mb12">Activity</p>
                            <el-row :gutter="16" class="mb16">
                                <el-col :span="12">
                                    <el-card shadow="never">
                                        <p class="bold fs18">Total</p>
                                        <p class="mt8 mb16">value of stream</p>
                                        <span class="bold fs16">{{info.deposit}}  DAI</span>
                                    </el-card>
                                </el-col>
                                <el-col :span="12">
                                    <el-card shadow="never">
                                        <p class="bold fs18">Streamed</p>
                                        <p class="mt8 mb16">100% out of total</p>
                                        <span class="bold fs16">{{info.remainingBalance}}  DAI</span>
                                    </el-card>
                                </el-col>
                            </el-row>
                            <p class="bold fs18 mb12">Duration</p>
                            <el-card shadow="never">
                                <p class="bold">Ended on</p>
                                <p class="bold fs18 my16">
                                    <i class="el-icon-watch"></i>
                                    <span>{{info.stopTime|filterDate}}</span>
                                </p>
                                <p>
                                    This stream was started on 
                                    <span class="bold">{{info.startTime|filterDate}}</span>
                                    and ended on 
                                    <span class="bold">{{info.stopTime|filterDate}}</span>.
                                </p>
                            </el-card>
                        </div>
                    </el-card>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import echarts from 'echarts'
import 'echarts-liquidfill'
import sablierInstance from '../utils/sablierInstance'
import testnetInstance from '../utils/testNetInstance'
import {mapState} from 'vuex'

export default {
    name: 'StreamInfo',
    data() {
        return {
            streamId: '', //流ID
            info: {},
        }
    },
    filters: {
        filterName(val) {
            if (val.length>10) {
                return val.substr(0,4) + '...' + val.substr(val.length-4,4)
            } else {
                return val
            }
        },
        filterDate(val) {
            let date = moment(parseInt(val)).format("dddd, MMM Do YYYY, h:mm:ss a")
            return date
        },
    },
    created(){
        // await this.getInfo()
    },
    async mounted(){
        await this.getInfo()//获取流信息
        this.initChart()//生成图表
    },
    computed: {
        ...mapState(['sender', 'recipient']),
    },
    methods: {
        initChart(){
            let remainderPer = parseInt(this.info.remainingBalance)/parseInt(this.info.deposit)
            console.log(remainderPer)
            let chart = echarts.init(document.getElementById('liquidfill'))
            let option = {
                series: [{
                    type: 'liquidFill',
                    data: [remainderPer, remainderPer],
                    radius: '90%',
                    name: '剩余流'
                }],
                tooltip: {
                    show: true,
                    formatter: '{a}:'+remainderPer*100+'%'
                },
            }
            chart.setOption(option)
        },
        async getInfo(){//请求流数据
            this.streamId = this.$route.query.streamId
            this.info = await sablierInstance.methods.getStream(this.streamId).call({
                gas:3000000,
                from:this.sender
            })
            console.log(this.info)
        },
    },
}
</script>
