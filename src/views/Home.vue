<template>
    <div id="pay-home">
        <div class="pay-home1">
            <div style="padding-top:200px;">
                <div class="fs50 bold">
                    连续的价值转移以实现实时支付
                </div>
                <div class="fs20 mt40">
                    通过对货币的编程，我们建立了实时支付的智能合约并将其部署在以太坊上
                </div>
                <el-button
                    class="mt64"
                    round
                    plain
                >
                    <router-link to="/dashboard">
                        <span class="c-blue2">开始使用</span>
                    </router-link>
                </el-button>
            </div>
        </div>
        <div class="pay-home2">
            <div class="bold fs24 py40">
                合约介绍
            </div>
            <div class="bg_home2" />
            <div>
                <el-row :gutter="30">
                    <el-col :span="6">
                        <div class="bold fs18 mb16">
                            固定金额流支付
                        </div>
                        <div class="t-l">
                            在开始时间至结束时间内，流会以流动率每秒流向接收者。
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="bold fs18 mb16">
                            固定流率流支付
                        </div>
                        <div class="t-l">
                            流在开始时间后每秒以特定的速率流向接收者，直到等于最大支付金额。无需设定结束时间，可增加最大支付金额，延长流的持续时间。
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="bold fs18 mb16">
                            分期流支付
                        </div>
                        <div class="t-l">
                            尝试使用分期流支付，随意设置分期期数，不再占用现金流。
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="bold fs18 mb16">
                            首付分期流支付
                        </div>
                        <div class="t-l">
                            为你的分期流支付添加首付比例，满足更多场景需求。
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="pay-home3">
            <el-row
                :gutter="16"
                class="mb16"
            >
                <el-col :span="12">
                    <div class="bold fs18 mb16">
                        联系我们
                    </div>
                    <div class="t-l">
                        <p>邮箱：lichenguang62@gmail.com</p>
                        <a
                            href="https://github.com/Machael-lcg/streamPay"
                            target="_blank"
                            class="c-white"
                        >
                            Github：https://github.com/Machael-lcg/streamPay
                        </a>
                        <a
                            href="https://discord.gg/9sQCNK4"
                            target="_blank"
                            class="c-white"
                        >
                            Discord：https://discord.gg/9sQCNK4
                        </a>
                        <p>微信：streampay</p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <img
                        src="../assets/imgs/wx1.jpeg"
                        class="wx_pic"
                    >
                    <p class="mt8">
                        扫一扫关注我们
                    </p>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Home'
}
</script>

<style scoped>
.pay-home1{
    background: url(../assets/imgs/bg_p1.jpg) 0 -70px;
    background-size: cover;
    padding: 0px 15vw;
    height: 100%;
}
.pay-home2{
    color: black;
    padding: 0px 15vw;
    height: 100%;
}
.bg_home2{
    height: 350px;
    background: url(../assets/imgs/bg_p3.png) no-repeat;
    background-size: 100% 100%;
}
.pay-home3{
    background: #333;
    padding: 40px 25vw;
    height: 110px;
}
.wx_pic{
    width: 80px;
    height: 80px;
}
</style>

