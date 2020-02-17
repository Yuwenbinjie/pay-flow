const path = require('path')
const fs = require('fs')
const merge = require('webpack-merge')
const webpack = require('webpack')
const shajs = require('sha.js')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

const confDev = require('./config.dev.js')
const confProd = require('./config.prod.js')

//根据不同环境获取const配置
let configConst = require('./const.js')
configConst = Object.assign(configConst,configConst[process.env.NODE_ENV])

//动态插入打包好的dll包
const dllFiles = fs.readdirSync(path.resolve(__dirname, '../dist', configConst.base, 'dll'))
let dllPlugins = []
dllFiles.forEach(file => {
    if(/.*\.dll\.js/.test(file)){
        dllPlugins.push(
            new AddAssetHtmlPlugin({
                // dll文件位置
                filepath: path.resolve(__dirname,'../dist',configConst.base,'dll',file),
                // dll 引用路径
                publicPath: path.join('../', configConst.base, 'dll'),
                // dll最终输出的目录
                outputPath: path.join('../', configConst.base, 'dll'),
            }) 
        )
    }
    if(/.*\.manifest\.json/.test(file)){
        dllPlugins.push(
            new webpack.DllReferencePlugin({
                manifest:  require(path.resolve(__dirname, '../dist', configConst.base, 'dll', file))
            })
        )
    }
})

let conf = {
    configureWebpack: {
        externals: {
            //不打包前后台公共组件
            JztNavCommon: 'JztNavCommon',
            JztManagementCommon: 'JztManagementCommon',
        },
        plugins: [
            new webpack.DefinePlugin({
                '$erpLoginUrl': JSON.stringify(configConst.erpLoginUrl),
                '$apiUrl': JSON.stringify(configConst.apiUrl),
            })
        ].concat(dllPlugins),
        optimization: {
            runtimeChunk: {
                name: 'manifest'
            },
            splitChunks: {
                cacheGroups: {
                    nodeModules: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'initial',
                        enforce: true
                    },

                    'nodeModules-chunk': {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors-chunk',
                        chunks: 'async'
                    },
                    components: {
                        reuseExistingChunk: true,
                        test: m => {
                            if (m.constructor.name != "NormalModule") return false
                            return /[\\/]src\/components\/.+\.vue/.test(m.nameForCondition())
                        },
                        name: 'components',
                        chunks: 'all'
                    },
                    main: {
                        reuseExistingChunk: true,
                        test: m => {
                            return (m.constructor.name != "CssModule") && /[\\/]src[\\/]/.test(m.identifier())
                        },
                        name: m => {
                            let relativePath = path.relative(`/${configConst.base}`, m.nameForCondition())
                            let name = relativePath.split('.')[0].replace(/\//g, '_')
                            return 'main-' + shajs('sha256').update(name).digest('hex').slice(0, 4)
                        },
                        chunks: 'async'
                    }
                }
            }
        }
    }
}

module.exports = (()=>{
    let env = process.env.NODE_ENV
    let envConf = env === 'production' ? confProd : confDev
    configureWebpack = merge(conf.configureWebpack,envConf.configureWebpack)
    return Object.assign(conf,envConf,{configureWebpack})
})()