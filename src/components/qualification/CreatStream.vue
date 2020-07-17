<template>
    <el-drawer
        :visible.sync="showModal"
        @close="closeModal">
        <div slot="title" class="bold fs20">创建流</div>
        <div class="px20">
            <el-form label-position="top" label-width="80px" :model="params">
                <el-form-item label="谁是收件人？（ENS名称或以太坊地址）">
                    <el-input v-model="params.recipient"></el-input>
                </el-form-item>
                <el-form-item label="流金额">
                    <el-input v-model="params.deposit"></el-input>
                </el-form-item>
                <el-form-item label="币种">
                    <el-input v-model="params.address"></el-input>
                </el-form-item>
                <el-form-item label="起止时间">
                    <el-date-picker
                        v-model="dateTime"
                        align="right"
                        style="width:100%"
                        type="datetimerange"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button round class="mt36 py16" style="width:100%" type="primary" @click="save">
                        创建流<i class="el-icon-right el-icon--right"></i>
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-drawer>
</template>

<script>
import {mapState} from 'vuex'
import moment from 'moment'
import testnetInstance from '@/utils/testNetInstance'
import sablierInstance from '@/utils/sablierInstance'
export default {
    name: 'CreatStream',
    props: {
        showModal: {
            type: Boolean,
            default() {
                return false;
            }
        },
    },
    data() {
        return {
            dateTime: [moment().valueOf(), moment().add(1, 'days').valueOf()],
            params: {
                recipient: '',
                deposit: '1000000000000000000',
                address: '',
            }
        }
    },
    computed: {
        ...mapState(['sender', 'recipient']),
    },
    watch: {
        showModal(val){
            if (val) {
                console.log(this.sender,this.recipient)
                this.params.recipient = this.recipient
                this.params.address = testnetInstance.options.address
            }
        },
    },
    methods: {
        async save() {
            console.log(this.dateTime)
            //批准、铸币
            await testnetInstance.methods.approve(sablierInstance.options.address,this.params.deposit).send({
                gas:3000000,
                from:this.sender
            });
            await testnetInstance.methods.mint(this.sender,this.params.deposit).send({
                gas:3000000,
                from:this.sender
            });
            let res = await sablierInstance.methods
                .createStream(this.params.recipient, this.params.deposit, this.params.address, this.dateTime[0], this.dateTime[1])
                .send({
                    gas:3000000,
                    from:this.sender
                })
            if (res) {
                console.log(res)
                this.closeModal()
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
        closeModal() {
            this.$emit('close');
        },
    },
};
</script>


