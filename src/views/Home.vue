<template>
    <div id="pay-home">
        <div class="pay-home1">
            <div style="padding-top:200px;">
                <div class="fs50 bold">
                    {{ $t('home.h1') }}
                </div>
                <div class="fs20 mt40">
                    {{ $t('home.h2') }}
                </div>
                <el-button
                    class="mt64"
                    round
                    plain
                >
                    <router-link to="/dashboard">
                        <span class="c-blue2">{{ $t('home.startBtn') }}</span>
                    </router-link>
                </el-button>
            </div>
        </div>
        <div class="pay-home2">
            <div class="bold fs24 py40">
                {{ $t('home.introduce.title') }}
            </div>
            <div class="bg_home2" />
            <div>
                <el-row :gutter="30">
                    <el-col :span="6">
                        <div class="bold fs18 mb16">
                            {{ $t('home.introduce.sablierTitle') }}
                        </div>
                        <div class="t-l">
                            {{ $t('home.introduce.sablierVal') }}
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="bold fs18 mb16">
                            {{ $t('home.introduce.fixedTitle') }}
                        </div>
                        <div class="t-l">
                            {{ $t('home.introduce.fixedVal') }}
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="bold fs18 mb16">
                            {{ $t('home.introduce.installmentTitle') }}
                        </div>
                        <div class="t-l">
                            {{ $t('home.introduce.installmentVal') }}
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="bold fs18 mb16">
                            {{ $t('home.introduce.installmentDPTitle') }}
                        </div>
                        <div class="t-l">
                            {{ $t('home.introduce.installmentDPVal') }}
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
                        {{ $t('home.footer.contactTitle') }}
                    </div>
                    <div class="t-l">
                        <p>Email：lichenguang62@gmail.com</p>
                        <a
                            href="https://github.com/Machael-lcg/streamPay"
                            target="_blank"
                            class="c-white block"
                        >
                            Github：https://github.com/Machael-lcg/streamPay
                        </a>
                        <a
                            href="https://discord.gg/9sQCNK4"
                            target="_blank"
                            class="c-white block"
                        >
                            Discord：https://discord.gg/9sQCNK4
                        </a>
                        <p>Wechat：streampay</p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <img
                        src="../assets/imgs/wx1.jpeg"
                        class="wx_pic"
                    >
                    <p class="mt8">
                        {{ $t('home.footer.focusText') }}
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
    background: url(../assets/imgs/bg_p1.jpg) 0 -70px no-repeat;
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

