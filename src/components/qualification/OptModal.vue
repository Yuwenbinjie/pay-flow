<template>
    <j-modal
        :is-show="showOptModal"
        :is-right="true"
        :is-mask-closable="false"
        @on-cancel="cancelOpt"
    >
        <template slot="modal-title">
            {{ title }}
        </template>
        <template slot="modal-body">
            <div class="mb32 mt16">
                <span class="form-title">
                    资质类型 <span class="c-red">*</span>
                </span>
                <j-select
                    class="w230"
                    type="default"
                    :options="qualificationTypeOpt"
                    v-model="params.type"
                    is-search
                />
                <j-alert
                    class="mt8"
                    type="error"
                    title="请选择资质类型"
                    v-if="qualificationError"
                />
            </div>
            <div class="mb32">
                <span class="form-title">有效时间</span>
                <j-date-picker
                    class="inline-block w230 vm"
                    type="daterange"
                    :value="[params.validTimeStart,params.validTimeEnd]"
                    @on-change="selectedValidTime"
                    :is-range-input="true"
                    is-show-clear
                />
            </div>
            <div class="mb32">
                <span class="form-title">品牌商品名</span>
                <j-input
                    class="w230"
                    v-model.trim="params.brandName"
                />
            </div>
            <div class="mb32">
                <span class="form-title">备注文案</span>
                <j-input
                    class="vt inline-block w400"
                    type="textarea"
                    is-autosize
                    :rows="{min: 5}"
                    v-model.trim="params.remark"
                />
            </div>
            <div class="mb32">
                <span class="form-title">
                    是否有效 <span class="c-red">*</span>
                </span>
                <j-select
                    class="w230"
                    type="default"
                    :options="markValidOpt"
                    v-model="params.markValid"
                />
            </div>
            <div class="mb32 invalid">
                <span class="form-title">
                    无效原因
                    <j-tooltip
                        class="vm"
                        content="当是否有效选择了“无效”时，无效原因必填"
                    >
                        <j-icon
                            font-size="14"
                            type="help2"
                        />
                    </j-tooltip>
                </span>
                <j-input
                    class="vt inline-block w400"
                    type="textarea"
                    is-autosize
                    :is-disabled="params.markValid==2"
                    :rows="{min: 5}"
                    v-model.trim="params.invalidReason"
                />
                <j-alert
                    class="mt8"
                    type="error"
                    title="请填写无效原因"
                    v-if="invalidError"
                />
            </div>
        </template>
        <template slot="modal-footer">
            <j-button
                size="medium"
                class="mr24"
                @click="cancelOpt"
            >
                取消
            </j-button>
            <j-button
                size="medium"
                type="primary"
                @click="save"
            >
                确定
            </j-button>
        </template>
    </j-modal>
</template>

<script>
import {qualificationTypeOpt, markValidOpt} from '@/components/constant/qualification.js'

export default {
    name: 'OptModal',
    props: {
        showOptModal: {
            type: Boolean,
            default() {
                return false;
            }
        },
        rowObj: {
            type: Object,
            default() {
                return {}
            }
        },
    },
    data() {
        return {
            qualificationTypeOpt,
            markValidOpt,
            title: '资质标注',
            isEdit: false,
            params: {},
            // 校验
            qualificationError: false,
            invalidError: false
        }
    },
    watch: {
        showOptModal(val){
            if (val) {
                if (this.rowObj.markStatus == 2){
                    this.isEdit = false
                    this.title = '资质标注'
                } else {
                    this.isEdit = true
                    this.title = '资质编辑'
                }
                if (!this.isEdit){//标注：初始数据
                    this.params = {
                        packageId: this.rowObj.packageId,
                        type: null,
                        validTimeStart: '',
                        validTimeEnd: '',
                        remark: '',
                        brandName: '',
                        markValid: 2,
                        invalidReason: '',
                    }
                } else {//编辑：回显数据
                    this.params = {
                        packageId: this.rowObj.packageId,
                        type: this.rowObj.type,
                        validTimeStart: this.rowObj.validTimeStart,
                        validTimeEnd: this.rowObj.validTimeEnd,
                        remark: this.rowObj.remark,
                        brandName: this.rowObj.brandName,
                        markValid: this.rowObj.markValid,
                        invalidReason: this.rowObj.invalidReason,
                    }
                }
                this.qualificationError = false
                this.invalidError = false
            }
        },
        'params.type': {
            handler(val) {
                val ? this.qualificationError = false : ''
            },
            deep: true,
        },
        'params.invalidReason': {
            handler(val) {
                val ? this.invalidError = false : ''
            },
            deep: true,
        },
        'params.markValid': {
            handler(val) {
                val == 2 ? this.invalidError = false : ''
                this.params.invalidReason = ''
            },
            deep: true,
        }
    },
    methods: {
        selectedValidTime(obj) {
            this.params.validTimeStart = obj.start
            this.params.validTimeEnd = obj.end
        },
        async save() {
            if (!this.checkedParam()) {
                return
            }
            let res = await this.$post('/qualification/markQualificationPackage', this.params)
            if (res) {
                this.cancelOpt()
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
        cancelOpt() {
            this.$emit('close-opt');
        },
    },
};
</script>


