<template>
    <div>
        <p class="title-lv1">
            {{ pageTitle }}
        </p>
        <div class="panel pb16">
            <filter-panel
                :param-obj="params"
                :is-mark-page="isMarkPage"
                @search="query"
            />
        </div>
        <div
            v-if="isMarkPage"
            class="panel mt16 py16"
        >
            <div>待标注素材：{{ unmarked }}</div>
        </div>
        <div class="panel mt16">
            <div class="scroll-top">
                <div class="clearfix">
                    <j-button
                        v-if="isMarkPage"
                        type="primary"
                        class="w90"
                        @click="pack"
                    >
                        打包
                    </j-button>
                    <custom-columns
                        class="pull-right"
                        v-model="choose"
                        placement="bottomRight"
                        :total-columns="customData"
                        @on-change="setCustomColumns"
                    />
                    <div
                        class="clearfix pull-right mr12"
                        v-if="total>0"
                    >
                        <j-pagination
                            :total="total"
                            :page-index="params.pageNo"
                            :page-size="params.pageSize"
                            @on-change="changePage"
                            is-background
                            layout="sizer,prev,pager,next,jumper"
                        />
                    </div>
                </div>
            </div>
            <j-table
                :columns="customColumns"
                :row-selection="rowSelection"
                row-key="packageId"
                :fixed="true"
                class="qualificationTable"
                :custom-threshold="114"
                @on-sort-remote-change="sortChange"
                :default-checked-keys="checkedId"
                :data="data"
            >
                <template
                    slot="imgUrl"
                    slot-scope="props"
                >
                    <j-tooltip
                        v-for="(item,index) in props.row.reducedQualifications"
                        :key="index"
                        style="margin:2px 10px 2px 0px;"
                        placement="right"
                    >
                        <a class="img-wraper">
                            <img :src="item.imgUrl">
                        </a>
                        <div
                            slot="content"
                            class="img-wraper-tooltip"
                        >
                            <img :src="item.imgUrl">
                        </div>
                    </j-tooltip>
                </template>
                <template
                    slot="title"
                    slot-scope="props"
                >
                    <div
                        v-for="(item, index) in props.row.reducedQualifications"
                        :key="index"
                    >
                        {{ item.title }}
                    </div>
                </template>
                <template
                    slot="isValid"
                    slot-scope="props"
                >
                    {{ props.row.isValid | filterIsValidText }}
                    <span class="c-red">{{ !props.row.intact ? '(缺失)' : '' }}</span>
                </template>
                <template
                    slot="validTime"
                    slot-scope="props"
                >
                    <span v-if="props.row.validTimeStart">
                        {{ props.row.validTimeStart }}~{{ props.row.validTimeEnd }}
                    </span>
                    <span v-else-if="props.row.markStatus == 3">--</span>
                    <span v-else />
                </template>
                <template
                    slot="markInfo"
                    slot-scope="props"
                >
                    <div>
                        <div class="markInfoTitle">
                            资质ID：
                        </div>
                        <span class="markInfoValue">{{ renderId(props.row.reducedQualifications) }}</span>
                    </div>
                    <div>
                        <div class="markInfoTitle">
                            标注人：
                        </div>
                        <span class="markInfoValue">{{ props.row.markUser }}</span>
                    </div>
                    <div>
                        <div class="markInfoTitle">
                            标注时间：
                        </div>
                        <span class="markInfoValue">{{ props.row.markTime }}</span>
                    </div>
                </template>
                <template
                    slot="operation"
                    slot-scope="props"
                >
                    <j-button
                        v-if="props.row.markStatus==2"
                        type="primary"
                        class="mb8 w90"
                        @click="mark(props.row)"
                    >
                        标注
                    </j-button>
                    <j-button
                        v-if="props.row.markStatus==3"
                        type="primary"
                        class="mb8 w90"
                        @click="mark(props.row)"
                    >
                        编辑
                    </j-button>
                    <j-button
                        type="primary"
                        is-outline
                        v-if="props.row.reducedQualifications.length > 1 || !props.row.intact"
                        @click="unPack(props.row.packageId)"
                    >
                        取消打包
                    </j-button>
                </template>
            </j-table>
            <opt-modal
                :show-opt-modal="showOptModal"
                :row-obj="checkedRows[0]"
                @close-opt="closeOptModal"
            />
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import scroll from '@/utils/scroll.js'
import addColor from '@/utils/addColor.js'
import {columns, customData, defaultCheck, isValidOpt} from '@/components/constant/qualification.js'
import FilterPanel from '@/components/qualification/FilterPanel.vue'
import OptModal from '@/components/qualification/OptModal.vue'

export default {
    name: 'QualificationMark',
    components: {
        FilterPanel,
        OptModal
    },
    filters: {
        filterIsValidText(val) {
            let text = val ? _.filter(isValidOpt, {value: val})[0].label : ''
            return text

        },
    },
    data() {
        return {
            pageTitle: '资质标注',
            columns, //所有列
            customData, //自定义组件总列项
            customColumns: [], //筛选后的自定义列项
            data: [], //列表数据
            choose: defaultCheck,
            params: {
                createTimeStart: '',
                createTimeEnd: '',
                pin: '',
                type: [],
                validTimeStart: '',
                validTimeEnd: '',
                markUser: '',
                markTimeStart: '',
                martTimeEnd: '',
                // title: '',
                isValid: [],
                markStatus: 2,
                qualificationId: '',
                sortField: '',
                sortOrder: 0,
                pageNo: 1,
                pageSize: 20,
            },
            total: 0, //总素材
            unmarked: 0, //待审核素材
            rowSelection: {
                type: 'checkbox',
                getCheckboxProps: {
                    disabled: row => {return row.reducedQualifications.length > 1 || !row.intact}
                },
                onSelect: (checked, choosableCheckedRows) => {
                    // this.checkedId = _.map(choosableCheckedRows, 'packageId')
                    this.checkedRows = choosableCheckedRows
                },
                onSelectAll: (checked, choosableCheckedRows) => {
                    this.checkedRows = choosableCheckedRows
                }
            },
            checkedRows: [], //已选行
            isMarkPage: true, //区分标注和查看页面
            showOptModal: false, //标注/编辑侧滑框开关
        }
    },
    computed: {
        checkedId() {
            return _.map(this.checkedRows, 'packageId')
        }
    },
    mounted() {
        scroll('.scroll-top', 60)//引入滑动固定元素方法
    },
    created(){
        if (this.$route.path == '/qualificationLook'){
            this.isMarkPage = false
            this.pageTitle = '资质查看'
            this.rowSelection = {}
            this.params.pin = this.$route.query.pin || ''
            this.params.pageSize = 100
            this.params.markStatus = 1
            this.columns = _.filter(columns, (item)=>{//filter返回一个新数组，不会改变columns数组
                return item.key != 'operation'
            })
        }
        this.ajaxQuery()
        this.setCustomColumns(this.choose)
    },
    methods: {
        renderId(list) {
            let arr = _.map(list, 'qualificationId')
            return arr.join('、')
        },
        query(val){//点击查询
            this.params = _.cloneDeep(val)
            this.params.pageNo = 1
            this.ajaxQuery()
        },
        async ajaxQuery(){//post请求列表数据
            let res = await this.$post('/material/qualification/getQualification', this.params)
            if (res){
                this.data = res.packageList
                this.unmarked = res.unmarked
                this.total = res.total
                if (this.params.sortField){
                    setTimeout(addColor.bind(this, '.qualificationTable', this.data, 'pin'), 100)//获取排序后的数据进行着色
                }
                this.checkedRows = []//每次请求刷新已选行
            }
        },
        sortChange(order, key){//按pin排序
            this.params.sortField = key
            this.params.sortOrder = order == 'asc' ? 0 : 1//0是升序 1是降序
            this.ajaxQuery()
        },
        mark(row) {//打开 标注/编辑 组件
            this.showOptModal = true
            this.checkedRows = [row]
        },
        closeOptModal(){//关闭 标注/编辑 组件
            this.showOptModal = false
            this.ajaxQuery()
        },
        async pack(){//打包
            let newArr = _.uniqBy(this.checkedRows, 'pin')
            if (newArr.length > 1){
                this.$Notification({
                    message: '不同用户PIN下的资质无法打包！',
                    type: 'error',
                })
                return
            }
            if (this.checkedId.length > 1) {
                let res = await this.$post(
                    '/material/qualification/packQualification',
                    {qualificationIdList: this.checkedId}
                )
                if (res){
                    this.ajaxQuery()
                }
            } else if (this.checkedId.length == 1) {
                this.$Notification({
                    message: '单个素材不能打包！',
                    type: 'warn',
                })
            } else {
                this.$Notification({
                    message: '请先选择素材！',
                    type: 'warn',
                })
            }
        },
        async unPack(id){//取消打包
            let that = this
            this.$Modal.confirm({
                title: '操作确认',
                content: '您确认要取消打包吗?',
                async onOk() {
                    let res = await that.$post('/material/qualification/unpackQualification', {packageId: id})
                    if (res){
                        that.ajaxQuery()
                    }
                }
            })
        },
        changePage({pageIndex, pageSize}){
            this.params.pageNo = pageIndex
            this.params.pageSize = pageSize
            this.ajaxQuery()
        },
        /*
            customColumns:自定义后表格列
            columns(不变)：固定列(display:true)+自定义 总列
            checked：自定义列组件已选的数组
        */
        setCustomColumns(checked){//设置自定义列
            this.customColumns = this.columns.filter(item=>{
                return checked.indexOf(item.key) != -1 || !!item.display
            })
        },
    },
}
</script>
<style scoped>
.markInfoTitle{
    display: inline-block;
    width: 70px;
    text-align: right;
    line-height: 24px;
}
.markInfoValue{
    display: inline-block;
    width: 155px;
    vertical-align: top;
}
</style>
