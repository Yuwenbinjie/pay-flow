<template>
    <div>
        <p class="title-lv1">
            审核ERP报表
        </p>
        <div class="panel pb16">
            <div class="filter-inline">
                <div class="filter-title">
                    审核人员
                </div>
                <j-input
                    class="w200"
                    v-model="params.pin"
                    placeholder="可输入多个ERP，用','分隔"
                />
            </div>
            <div class="filter-inline">
                <div class="filter-title">
                    审核时间
                </div>
                <j-date-picker
                    class="w200 inline-block"
                    type="daterange"
                    :options="{rangeLimit:92}"
                    :is-linked="false"
                    is-show-clear
                    @on-change="changeReportDate"
                />
            </div>
            <div class="filter-inline">
                <div class="filter-title">
                    查询类型
                </div>
                <j-select
                    class="w200"
                    v-model="params.queryTypeList"
                    type="default"
                    is-multiple
                    is-show-checkbox
                    is-search
                    :options="queryTypeOpt"
                >
                    <span
                        slot="multi-tag"
                        slot-scope="{selectVal}"
                    >
                        已选择{{ selectVal.length }}个类型
                    </span>
                </j-select>
            </div>
            <div class="filter-inline">
                <div class="filter-title">
                    数据分类
                </div>
                <div class="w200 inline-block">
                    <j-radio
                        class="ml16"
                        v-model="params.reportType"
                        :label="0"
                        text="分日"
                    />
                    <j-radio
                        v-model="params.reportType"
                        :label="1"
                        text="汇总"
                    />
                </div>
            </div>
            <j-button
                type="primary"
                style="margin-left:20px;"
                @click="query"
            >
                查询
            </j-button>
        </div>
        <div class="panel mt16">
            <div class="clearfix mb16">
                <j-button
                    type="primary"
                    @click="download"
                >
                    下载报表
                </j-button>
            </div>
            <j-table
                :columns="columns"
                :fixed="true"
                :custom-threshold="60"
                :data="data"
            />
            <div
                class="clearfix mt16"
                v-if="total>0"
            >
                <j-pagination
                    class="pull-right"
                    :total="total"
                    :page-index="params.page"
                    :page-size="params.pageSize"
                    @on-change="changePage"
                    is-background
                    layout="sizer,prev,pager,next,total,jumper"
                />
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import {columns} from '@/components/constant/erpReport.js'

export default {
    name: 'ErpReport',
    data() {
        return {
            columns, //所有列
            data: [], //列表数据
            queryTypeOpt: [],
            params: {
                erp: '',
                startReportDate: '',
                endReportDate: '',
                queryTypeList: [], //查询类型
                reportType: 0, //数据分类:默认分日
                page: 1,
                pageSize: 10,
            },
            total: 0, //总素材
        }
    },
    created(){
        this.ajaxQuery()
        this.getQueryTypeOpt()
    },
    methods: {
        async getQueryTypeOpt(){//获取查询类型
            let res = await this.$post('/material/manage/getQueryTypeList')
            if (res){
                this.queryTypeOpt = _.map(res, item=>{
                    return {
                        value: item.id,
                        label: item.name,
                    }
                })
            }
        },
        query(){//点击查询
            this.params.page = 1
            this.ajaxQuery()
        },
        async ajaxQuery(){//post请求列表数据
            if (!this.checkedErp()) {
                return
            }
            let res = await this.$post('/material/report/query', this.params)
            if (res){
                this.data = res.datas || []
                this.total = res.paginator.items
            }
        },
        checkedErp() {//校验审核人员格式
            this.params.erp = this.params.erp.trim()
            this.params.erp = this.params.erp.replace(/，/g, ',');//将中文逗号替换为英文逗号
            this.params.erp = this.params.erp.replace(/,$/g, '');//将末尾逗号删除

            let isOK = (/^[0-9,]*$/).test(this.params.erp)
            let erpArr = this.params.erp.split(',')
            let newArr = _.uniq(erpArr)//去重后的数组
            if (!isOK || newArr.length < erpArr.length){//如果有重复
                this.$Notification({
                    message: '审核人员只允许填写数字与英文逗号，且不可以重复!',
                    type: 'error',
                })
                return false
            }
            return true
        },
        changeReportDate(val){
            this.params.startReportDate = val.start || ''
            this.params.endReportDate = val.end || ''
        },
        changePage({pageIndex, pageSize}){
            this.params.page = pageIndex
            this.params.pageSize = pageSize
            this.ajaxQuery()
        },
        download(){//下载报表
            if (!this.data.length) {
                this.$Notification({
                    message: '暂无数据可以导出，请修改筛选条件!',
                    type: 'warn',
                })
                return
            }
            let param = _.cloneDeep(this.params)
            // param.firstCateIds = param.firstCateIdList.join(',')
            // eslint-disable-next-line
            location.href = `${$apiUrl}/material/report/export?`
            + `startReportDate=${param.startReportDate}&endReportDate=${param.endReportDate}`
            + `&erp=${param.erp}&queryTypeList=${param.queryTypeList}&reportType=${param.reportType}`
        },
    },
}
</script>
