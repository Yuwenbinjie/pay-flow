const path = require('path')

module.exports = {
    //项目路径
    base: 'checkSystem',
    //项目名称
    title: 'checkSystem-ui',
    //不同环境下配置
    development: {
        erpLoginUrl: '//test.ssa.jd.com',
        apiUrl: ''
    },
    production: {
        erpLoginUrl: '//ssa.jd.com',
        apiUrl: ''
    }
}