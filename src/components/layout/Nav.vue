<template>
    <div id="nav-left">
        <j-menu
            :width="width"
            :active-key="activeKey"
            :open-keys="openKeys"
            is-accordion
        >
            <j-menu-item item-key="home">
                <router-link to="/">
                    <div>
                        <j-icon type="home" />
                        <span>首页</span>
                    </div>
                </router-link>
            </j-menu-item>
            <j-submenu
                v-show="isAuth(1) || isAuth(0)"
                item-key="qualification"
            >
                <template slot="title">
                    <j-icon type="audit" />
                    <span>资质审核</span>
                </template>
                <j-menu-item
                    v-show="isAuth(1)"
                    item-key="qualificationMark"
                >
                    <router-link to="/qualificationMark">
                        <div>资质标注</div>
                    </router-link>
                </j-menu-item>
                <j-menu-item
                    v-show="isAuth(0)"
                    item-key="qualificationLook"
                >
                    <router-link to="/qualificationLook">
                        <div>资质查看</div>
                    </router-link>
                </j-menu-item>
            </j-submenu>
            <j-submenu
                v-show="isAuth(2)"
                item-key="report"
            >
                <template slot="title">
                    <j-icon type="file-text-o" />
                    <span>审核报表</span>
                </template>
                <j-menu-item
                    v-show="isAuth(2)"
                    item-key="erpReport"
                >
                    <router-link to="/erpReport">
                        <div>审核ERP报表</div>
                    </router-link>
                </j-menu-item>
            </j-submenu>
        </j-menu>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
    name: 'Nav',
    data() {
        return {
            width: 200,
            activeKey: 'home',
            openKeys: [],
            authList: [], //菜单权限码
            //keys格式遵循父标签嵌套子标签，只支持两层
            keys: [
                'home',
                {
                    'qualification': [
                        'qualificationMark',
                        'qualificationLook',
                    ]
                },
                {
                    'report': [
                        'erpReport',
                    ]
                },
            ]
        };
    },
    watch: {
        $route: {
            handler: function (){
                this.getActiveKey()
            },
            immediate: true,
        }
    },
    created() {
        this.getAuth()
    },
    methods: {
        isAuth(code) {
            return this.authList.includes(code)
        },
        async getAuth() {//获取权限信息
            let res = await this.$post('/material/qualification/authList')
            if (res) {
                // console.log(res)
                this.authList = res
                this.showTip('数据加载中，请稍后...')
                this.closeSplash()
                // sessionStorage.setItem('erp', res)
            } else {
                this.showTip('用户信息认证失败...')
                setTimeout(() => {
                    // eslint-disable-next-line
                    location.href = $erpLoginUrl + `/sso/login?ReturnUrl=http://${location.host}/checkSystem`
                }, 1000)
            }
        },
        showTip(info) {//loading蒙版提示
            $('#authTip').text(info)
        },
        closeSplash() {//关闭loading蒙版
            setTimeout(() => {
                $('#splash').fadeOut()
            }, 1000)
        },
        getActiveKey() {
            let path = this.$route.path
            try {
                this.keys.forEach(item => {
                    if (path.indexOf(item) !== -1) {
                        //判断第一层是否为当前打开标签
                        this.activeKey = item
                        this.openKeys = []
                        throw new TypeError()
                    }
                    if (typeof item === 'object'){
                        let openKeys = Object.keys(item)[0]
                        item[openKeys].forEach(item => {
                            if (path.indexOf(item) !== -1) {
                                //判断第2二层是否为当前打开标签
                                this.activeKey = item
                                this.openKeys = [openKeys]
                                throw new TypeError()
                            }
                        })
                    }
                })
            }
            catch (e){
                return
            }
        }
    }
};
</script>
