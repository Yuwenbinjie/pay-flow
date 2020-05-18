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
            '/brand/admin': {
                // target: 'http://admin.jzt-api.jd.com',
                target: 'http://pts-api.jd.com/mock/5cad5fa09814c918a15133c3',
                secure: false,
                changeOrigin: true,
            },
            '/media': {
                target: 'http://admin.deal-api.jd.com',
                secure: false,
                changeOrigin: true,
            },
            '/qualification': {
                // target: 'http://pts-api.jd.com/mock/5ea1397f6823840101d39a57',
                target: 'http://admin.deal-api.jd.com',
                secure: false,
                changeOrigin: true,
            },
        }
    }
}