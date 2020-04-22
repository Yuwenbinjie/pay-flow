<template>
    <j-modal
        :is-show="showOptModal"
        :is-right="true"
        @on-ok="saveOptModal"
        @on-cancel="cancelOpt"
    >
        <template slot="modal-body">
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
        </template>
    </j-modal>
</template>

<script>
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
    methods: {
        cancelOpt() {
            this.$emit('close-opt');
        },
        saveOptModal() {
            this.$emit('close-opt');
            //   this.$emit("save-opt");
        }
    }
};
</script>


<style>
</style>
