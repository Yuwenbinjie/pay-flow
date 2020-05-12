import Vue from 'vue'
import _ from 'lodash'
/* global $apiUrl */
let url = $apiUrl
Vue.prototype.$onlyNotify = true

export default async (params, args) => {
    try {
        let res = await Vue.http.post(url + params, args, {credentials: true})
        //完成请求后重置Content-Type
        Vue.http.headers.patch['Content-Type'] = 'application/json;charset=UTF-8'
        handlerLogin(res)
        let data = res.status === 200 ? await res.json() : {msg: '请求异常，请重新尝试'}
        if (data && data.code === 1){
            return _.isNull(data.data) ? true : data.data
        } else {
            Vue.prototype.$Notification({
                message: errorMessageProcess(data),
                type: 'error',
            })
            return false
        }
    }
    catch (e){
        if (Vue.prototype.$onlyNotify) {
            Vue.prototype.$onlyNotify = false
            Vue.prototype.$Notification({
                message: '请求异常，请重新尝试',
                type: 'error',
            })
        }
        setTimeout(()=>{
            Vue.prototype.$onlyNotify = true
        }, 500)
        return false
    }
}
// eslint-disable-next-line require-jsdoc
function handlerLogin(res){//分情况处理code码
    let defaultRes = {body: {code: 0}};
    let {body} = res || defaultRes;
    if (body.code === -100) {//-100未登录
        setTimeout(() => {
            // eslint-disable-next-line
            window.location.href = $erpLoginUrl + `/sso/login?ReturnUrl=http://${location.host}/checkSystem`
        }, 1000)
    }
    if (body.code === -200){//-200没权限
        window.location.href = 'http://admin.x.jd.com/static/cannotenter.html'
    }
}

// eslint-disable-next-line require-jsdoc
function errorMessageProcess(res){//错误信息提示
    let errorMsg = '请求异常，请重新尝试'
    if (res.errors && res.errors.length === 1){
        errorMsg = res.errors[0].subMsg
    }
    else if (res.errors && res.errors.length > 1){
        let errorList = ''
        res.errors.forEach((item, index) => {
            errorList += `${index + 1}.${item.subMsg}\n`
        })
        errorMsg = errorList
    }
    else if ((!res.errors || !res.errors.length) && res.msg){
        errorMsg = res.msg
    }
    return errorMsg
}
