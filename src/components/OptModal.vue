<template>
    <j-modal
        :is-show="showOptModal"
        :is-right="true"
        :is-mask-closable="false"
        :is-esc-closable="false"
        @on-cancel="cancelOpt"
    >
        <template slot="modal-title">
            {{ title }}
        </template>
        <template slot="modal-body">
            <div class="mb48">
                <span class="inline-block w120">资质类型<span class="c-red ml8">*</span></span>
                <j-select
                    class="w200"
                    type="default"
                    :options="qualificationOptions"
                    v-model="type"
                />
                <j-alert
                    class="mt8"
                    type="error"
                    title="请选择资质类型"
                    v-if="qualificationError"
                />
            </div>
            <div class="mb48">
                <span class="inline-block w120">有效时间</span>
                <j-date-picker
                    class="inline-block"
                    type="daterange"
                    style="width: 200px"
                    v-model="date"
                    @on-change="selectedDate"
                    :is-range-input="true"
                    is-clearable
                />
            </div>
            <div class="mb48">
                <span class="inline-block w120">品牌商品名</span>
                <j-input
                    class="w200"
                    v-model.trim="brandName"
                />
            </div>
            <div class="mb48">
                <span class="vt inline-block w120">备注文案</span>
                <j-input
                    class="vt inline-block w400"
                    type="textarea"
                    is-autosize
                    :rows="{min: 5}"
                    v-model.trim="remark"
                />
            </div>
            <div class="mb48">
                <span class="inline-block w120">是否有效</span>
                <j-select
                    class="w200"
                    type="default"
                    :options="validOptions"
                    v-model="isValid"
                />
            </div>
            <div class="mb48 invalid">
                <span class="inline-block w120">
                    无效原因
                    <j-tooltip
                        class-name="w160 tip"
                        placement="topLeft"
                        :content="tip1"
                        theme="light"
                        >
                        <j-icon type="help2" />
                    </j-tooltip>
                </span>
                <j-input
                    class="vt inline-block w400"
                    type="textarea"
                    is-autosize
                    :rows="{min: 5}"
                    v-model.trim="invalidReason"
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
                class="full-right mr16"
                @click="cancelOpt"
            >
                取消
            </j-button>
            <j-button
                size="medium"
                class="full-right mr16"
                type="primary"
                @click="saveOptModal"
            >
                确定
            </j-button>
        </template>
    </j-modal>
</template>

<script>
import {qualificationOptions, validOptions} from '@/constant/OptModal'

export default {
    name: 'OptModal',
    props: {
        showOptModal: {
            type: Boolean,
            default() {
                return false;
            }
        },
        // 包Id
        packageId: {
            type: String,
            default() {
                return '';
            }
        },
        // 判断操作为 标注 or 编辑
        isEdit: {
            type: Boolean,
            default() {
                return false;
            }
        }
    },
    data() {
        return {
            qualificationOptions,
            validOptions,
            date: '',
            title: '',
            type: null,
            remark: '',
            brandName: '',
            isValid: 0,
            invalidReason: '',
            tip1: '当是否有效选择了“无效”时，无效原因必填',
            // 校验
            qualificationError: false,
            invalidError: false
        }
    },
     watch: {
        type(val) {
            val ? this.qualificationError = false : ''
        },
        invalidReason(val) {
            val ? this.invalidError = false : ''
        },
        isValid(val) {
            val == 0 ? this.invalidError = false : ''
        }
    },
    methods: {
        paramsInit() {
            this.date = ''
            this.type = null
            this.brandName = ''
            this.isValid = 0
            this.markStartTime = ''
            this.markEndTime = ''
            this.invalidReason = ''
            this.qualificationError = false
            this.invalidError = false
        },
        cancelOpt() {
            this.paramsInit()
            this.$emit('close-opt');
        },
        async saveOptModal() {
            if (!this.type) {
                this.qualificationError = true
            }
            if (this.isValid == 1 && !this.invalidReason) {
                this.invalidError = true
            }
            if (this.qualificationError == false && this.invalidError == false) {
                let params = {
                    brandName: this.brandName,
                    type: this.type,
                    isValid: this.isValid,
                    packageId: this.packageId,
                    invalidReason: this.invalidReason,
                    startTime: this.date.start,
                    markEndTime: this.date.end,
                    remark: this.remark,
                }
                let res = await this.$post('qualification/markQualificationPackage', params)
                if (res) {
                    this.paramsInit()
                    this.$emit("save-opt");
                }
            }

        }
    },
    mounted() {
        this.title = this.isEdit ? '编辑' : '标注'
    },
};
</script>


<style>
.invalid .jad-tooltip{
    vertical-align: middle;
}

.tip .jad-tooltip-inner.jad-tooltip-light-inner {
    text-align: left
}
</style>
