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
            <j-submenu item-key="qualification">
                <template slot="title">
                    <j-icon type="audit" />
                    <span>资质审核</span>
                </template>
                <j-menu-item
                    item-key="qualificationMark"
                >
                    <router-link to="/qualificationMark">
                        <div>资质标注</div>
                    </router-link>
                </j-menu-item>
                <j-menu-item
                    item-key="qualificationLook"
                >
                    <router-link to="/qualificationLook">
                        <div>资质查看</div>
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
            authObj: {
                brandMenuPrivilege: [],
            },
            //keys格式遵循父标签嵌套子标签，只支持两层
            keys: [
                'home',
                {
                    'qualification': [
                        'qualificationMark',
                        'qualificationLook',
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
        async getAuth() {//获取权限信息
            let res = await this.$post('/brand/admin/client/login')
            if (res) {
                this.pin = res.erp
                this.showTip('数据加载中，请稍后...')
                this.closeSplash()
                if (!res.entry) {
                    location.href = 'http://admin.nfa.jd.com/static/cannotenter.html'
                }
                sessionStorage.setItem('erp', res.erp)
            } else {
                this.showTip('用户信息认证失败...')
                setTimeout(() => {
                    // eslint-disable-next-line
                    location.href = $erpLoginUrl + `/sso/login?ReturnUrl=http://${location.host}/checkSystem`
                }, 1000)
            }
        },
        showTip(info) {
            $('#authTip').text(info)
        },
        closeSplash() {
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
