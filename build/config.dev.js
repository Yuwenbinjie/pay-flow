const configConst = require('./const.js')

module.exports = {
    devServer: {
        contentBase: '/dist',
        hot: true,
        disableHostCheck: true,
        open: true,
        //openPage: '',
        overlay: true,
        host: 'localhost.jd.com',
        proxy: {
            '/public/*': {
                target: 'https://jzt.jd.com/',
                secure: false,
                changeOrigin: true,
            },
            '/brand/*': {
                target: 'http://pts-api.jd.com/mock/5cad5fa09814c918a15133c3',
                secure: false,
                changeOrigin: true,
            },
        }
    }
}