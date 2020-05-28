<template>
    <div>
        <div
            v-if="isMarkPage"
            class="filter-inline"
        >
            <div class="filter-title">
                创建时间
            </div>
            <j-date-picker
                class="w200 inline-block"
                type="daterange"
                is-show-clear
                @on-change="changeCreateTime"
            />
        </div>
        <div class="filter-inline">
            <div class="filter-title">
                用户PIN
            </div>
            <j-input
                class="w200"
                v-model="paramObj.pin"
                placeholder="请输入用户pin"
            />
        </div>
        <div class="filter-inline">
            <div class="filter-title">
                资质类型
            </div>
            <j-select
                class="w200"
                v-model="paramObj.type"
                type="default"
                is-multiple
                is-show-checkbox
                is-search
                :options="qualificationTypeOpt"
            >
                <span
                    slot="multi-tag"
                    slot-scope="{selectVal}"
                >
                    已选择{{ selectVal.length }}个资质类型
                </span>
            </j-select>
        </div>
        <div class="filter-inline">
            <div class="filter-title">
                有效时间
            </div>
            <j-date-picker
                class="w200 inline-block"
                type="daterange"
                is-show-clear
                @on-change="changeValidTime"
            />
        </div>
        <div
            v-if="isMarkPage"
            class="filter-inline"
        >
            <div class="filter-title">
                标注人员
            </div>
            <j-input
                class="w200"
                v-model="paramObj.markUser"
                placeholder="请输入标注人员"
            />
        </div>
        <div
            v-if="isMarkPage"
            class="filter-inline"
        >
            <div class="filter-title">
                标注时间
            </div>
            <j-date-picker
                class="w200 inline-block"
                type="daterange"
                is-show-clear
                @on-change="changeMarkTime"
            />
        </div>
        <div class="filter-inline">
            <div class="filter-title">
                是否有效
            </div>
            <j-select
                class="w200"
                v-model="paramObj.isValid"
                type="default"
                is-multiple
                is-show-checkbox
                :options="isValidOpt"
            >
                <span
                    slot="multi-tag"
                    slot-scope="{selectVal}"
                >
                    已选择{{ selectVal.length }}个状态
                </span>
            </j-select>
        </div>
        <!-- <div class="filter-inline">
            <div class="filter-title">
                资质标题
            </div>
            <j-input
                class="w200"
                v-model="paramObj.title"
                placeholder="请输入资质标题"
            />
        </div> -->
        <div class="filter-inline">
            <div class="filter-title">
                标注状态
            </div>
            <j-select
                class="w200"
                v-model="paramObj.markStatus"
                type="default"
                :options="markStatusOpt"
            />
        </div>
        <div class="filter-inline">
            <div class="filter-title">
                资质ID
            </div>
            <j-input
                class="w200"
                v-model="paramObj.qualificationId"
                placeholder="可填多个，用','分隔"
            />
        </div>
        <j-button
            type="primary"
            style="margin-left:20px;"
            @click="search"
        >
            查询
        </j-button>
    </div>
</template>

<script>
import _ from 'lodash'
import {qualificationTypeOpt, isValidOpt, markStatusOpt} from '@/components/constant/qualification.js'
export default {
    name: 'FilterPanel',
    props: {
        paramObj: {
            type: Object,
            default: function (){
                return {}
            }
        },
        isMarkPage: {
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            qualificationTypeOpt,
            isValidOpt,
            markStatusOpt,
        }
    },
    methods: {
        changeCreateTime(val){
            this.paramObj.createTimeStart = val.start || ''
            this.paramObj.createTimeEnd = val.end || ''
        },
        changeValidTime(val){
            this.paramObj.validTimeStart = val.start || ''
            this.paramObj.validTimeEnd = val.end || ''
        },
        changeMarkTime(val){
            this.paramObj.markTimeStart = val.start || ''
            this.paramObj.markTimeEnd = val.end || ''
        },
        search(){
            if (!this.checkedId()) {
                return
            }
            this.$emit('search', this.paramObj)
        },
        checkedId() {//校验资质ID
            this.paramObj.qualificationId = this.paramObj.qualificationId.replace(/，/g, ',');//将中文逗号替换为英文逗号
            this.paramObj.qualificationId = this.paramObj.qualificationId.replace(/,$/g, '');//将末尾逗号删除
            this.paramObj.qualificationId = this.paramObj.qualificationId.trim()
            let isOK = (/^[0-9,]*$/).test(this.paramObj.qualificationId)
            let keyArr = this.paramObj.qualificationId.split(',')
            let newArr = _.uniq(keyArr)//去重后的数组
            if (!isOK || newArr.length < keyArr.length){//如果有重复
                this.$Notification({
                    message: '资质ID只允许填写数字与英文逗号，且不可以重复!',
                    type: 'error',
                })
                return false
            }
            return true
        },
    }
}
</script>
