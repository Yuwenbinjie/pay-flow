import _ from 'lodash'
export const columns = [
    {
        key: 'imgUrl',
        title: '资质图片',
        width: 190,
        display: true,
    },
    {
        key: 'title',
        title: '资质标题',
        width: 180,
        display: true,
    },
    {
        key: 'type',
        title: '资质类型',
        width: 120,
        render: (val)=>{
            let text = val ? _.filter(qualificationTypeOpt, {value: val})[0].label : ''
            return text
        }
    },
    {
        key: 'validTime',
        title: '有效时间',
        width: 180,
    },
    {
        key: 'brandName',
        title: '品牌商品名',
        width: 130,
        render: (val, row)=>{
            if (row.markStatus == 3 && !val){
                return '--'
            } else {
                return val
            }
        }
    },
    {
        key: 'remark',
        title: '备注文案',
        width: 130,
        render: (val, row)=>{
            if (row.markStatus == 3 && !val){
                return '--'
            } else {
                return val
            }
        }
    },
    {
        key: 'isValid',
        title: '是否有效',
        width: 120,
    },
    {
        key: 'invalidReason',
        title: '无效原因',
        width: 130,
        render: (val, row)=>{
            if (row.markStatus == 3 && !val){
                return '--'
            } else {
                return val
            }
        }
    },
    {
        key: 'pin',
        title: '用户pin',
        width: 130,
        display: true,
        sort: {
            enable: true,
            remote: true
        }
    },
    {
        key: 'createTime',
        title: '创建时间',
        width: 170,
        display: true,
    },
    {
        key: 'markInfo',
        title: '资质信息',
        width: 250,
        display: true,
    },
    {
        key: 'operation',
        title: '操作',
        width: 120,
        display: true,
        fixed: 'right',
    },
    {
        key: 'markStatus',
        title: '标注状态',
        width: 120,
        display: true,
        render: (val)=>{
            let obj = _.filter(markStatusOpt, {value: val})
            return obj[0].label
        }
    },
]

// 自定义列
let children = columns.filter(o=>{
    return !o.display
}).map(o=>{
    return {
        label: o.key,
        text: o.title
    }
})
export const customData = [
    {
        title: '标注数据',
        hasAll: true,
        children: children

    },
]
export const defaultCheck = children.map(o=>{
    return o.label
})

//筛选条件组件
export const qualificationTypeOpt = [//资质类型
    {
        value: 1,
        label: '模特免责声明',
    },
    {
        value: 2,
        label: '商图免责声明',
    },
    {
        value: 3,
        label: '肖像授权',
    },
    {
        value: 4,
        label: '影视剧作授权',
    },
    {
        value: 5,
        label: '游戏授权',
    },
    {
        value: 6,
        label: '首发证明',
    },
    {
        value: 7,
        label: '官方授权证明',
    },
    {
        value: 8,
        label: '京东合作授权',
    },
    {
        value: 9,
        label: '活动立项证明',
    },
    {
        value: 10,
        label: '广告审查表',
    },
    {
        value: 11,
        label: '特殊化妆品行政许可批件',
    },
    {
        value: 12,
        label: '奖项证明',
    },
    {
        value: 13,
        label: '检验报告',
    },
    {
        value: 14,
        label: '专利证明',
    },
    {
        value: 15,
        label: '3C认证',
    },
    {
        value: 16,
        label: '进口报关单',
    },
    {
        value: 17,
        label: '出口报关单',
    },
    {
        value: 18,
        label: '营业执照',
    },
    {
        value: 19,
        label: '资格授权证明',
    },
    {
        value: 20,
        label: '数据证明',
    },
    {
        value: 21,
        label: '其它文件',
    },
]
export const isValidOpt = [//筛选：是否有效
    {
        value: 2,
        label: '有效',
    },
    {
        value: 3,
        label: '无效',
    },
    {
        value: 4,
        label: '过期',
    },
]

export const markValidOpt = [//标注：是否有效
    {
        value: 2,
        label: '有效',
    },
    {
        value: -2,
        label: '无效',
    },
]

export const markStatusOpt = [//标注状态
    {
        value: 1,
        label: '全部',
    },
    {
        value: 2,
        label: '待标记',
    },
    {
        value: 3,
        label: '已标记',
    },
]