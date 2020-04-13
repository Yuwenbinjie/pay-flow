<template>
    <div id="app">
        <j-layout>
            <!-- <j-header
                class-name="z100"
                :is-fixed="true">
                <ui-header />
            </j-header> -->
            <j-sider :is-fixed="true">
                <ui-nav />
            </j-sider>
            <j-content id="main">
                <div class="content-box">
                    <ui-bread-crumb />
                    <router-view class="minW1000" />
                </div>
            </j-content>
        </j-layout>
    </div>
</template>

<script>
import BreadCrumb from '@/components/layout/BreadCrumb'
import Nav from '@/components/layout/Nav'
export default {
    name: 'App',
    components: {
        uiNav: Nav,
        uiBreadCrumb: BreadCrumb,
    },
}
</script>
