<template>
    <j-breadcrumb
        class="wrapNav"
        separator="<j-icon class='jad-icon jad-icon-angle-right'></j-icon>"
    >
        <j-breadcrumb-item
            v-for="(level,index) in levels"
            :key="level.name"
        >
            <router-link
                v-if="index<(levels.length-1)"
                :to="level.path"
            >
                {{ level.name }}
            </router-link>
            <span v-else>{{ level.name }}</span>
        </j-breadcrumb-item>
    </j-breadcrumb>
</template>

<script>
export default {
    name: 'BreadCrumb',
    computed: {
        levels() {
            let routes = this.$router.options.routes
            let path = this.$route.path.split('/')
            let result = [
                {
                    name: '审核系统',
                    path: '/home',
                },
            ]
            path.forEach(item => {
                if (item != '' && item.indexOf(':') == -1) {
                    let route = routes.filter(i => i.path.includes('/' + item))[0]
                    if (route){
                        result.push({
                            name: route.display,
                            path: route.path,
                        })
                    }
                }
            })
            return result
        },
    },
}
</script>

<style>
.wrapNav {
  margin: 16px 0px 0px;
  font-size: 14px;
}
.wrapNav a{
  color: #333;
}
</style>
