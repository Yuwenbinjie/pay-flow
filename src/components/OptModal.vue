<template>
    <j-modal
        :is-show="showOptModal"
        :is-right="true"
        :is-mask-closable="false"
        :is-esc-closable="false"
        @on-ok="saveOptModal"
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
                    v-model="params.type"
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
                    v-model="params.brandName"
                />
            </div>
            <div class="mb48">
                <span class="vt inline-block w120">备注文案</span>
                <j-input
                    class="vt inline-block w400"
                    type="textarea"
                    is-autosize
                    :rows="{min: 5}"
                    v-model="wordList"
                />
            </div>
            <div class="mb48">
                <span class="inline-block w120">是否有效<span class="c-red ml8">*</span></span>
                <j-select
                    class="w200"
                    type="default"
                    :options="validOptions"
                    v-model="params.isValid"
                />
            </div>
            <div class="mb48">
                <span class="inline-block w120">无效原因</span>
                <j-input
                    class="vt inline-block w400"
                    type="textarea"
                    is-autosize
                    :rows="{min: 5}"
                    v-model="params.invalidReason"
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
        }
    },
    data() {
        return {
            date: '',
            title: '123',
            qualificationOptions: qualificationOptions,
            validOptions: validOptions,
            params: {
                type: null,
                brandName: '',
                isValid: '',
                markStartTime: '',
                markEndTime: '',
                invalidReason: '',
            },
        }
    },
    methods: {
        cancelOpt() {
            this.date = ''
            this.params = {
                type: null,
                brandName: '',
                isValid: '',
                markStartTime: '',
                markEndTime: '',
                invalidReason: '',
            },
            this.$emit('close-opt');
        },
        saveOptModal() {
            this.params.markStartTime = this.date.start
            this.params.markEndTime = this.date.end
            console.log(this.params)
            this.date = ''
            this.params = {
                type: null,
                brandName: '',
                isValid: '',
                markStartTime: '',
                markEndTime: '',
                invalidReason: '',
            }
            this.$emit('close-opt');

            //   this.$emit("save-opt");
        }
    }
};
</script>


<style>
</style>
