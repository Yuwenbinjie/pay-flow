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
        width: 120,
        display: true,
    },
    {
        key: 'type',
        title: '资质类型',
        width: 130,
        render: (val)=>{
            let obj = _.filter(qualificationTypeOpt, {value: val})
            return obj[0].label
        }
    },
    {
        key: 'validTime',
        title: '有效时间',
        width: 120,
    },
    {
        key: 'brandName',
        title: '品牌商品名',
        width: 120,
    },
    {
        key: 'remark',
        title: '备注文案',
        width: 120,
    },
    {
        key: 'isValid',
        title: '是否有效',
        width: 120,
        // render: (val)=>{
        //     let obj = _.filter(isValidOpt, {value: val})
        //     return obj[0].label
        // }
    },
    {
        key: 'invalidReason',
        title: '无效原因',
        width: 120,
    },
    {
        key: 'pin',
        title: '用户pin',
        width: 120,
        display: true,
        sort: {
            enable: true,
            remote: true
        }
    },
    {
        key: 'createTime',
        title: '创建时间',
        width: 120,
        display: true,
    },
    {
        key: 'markInfo',
        title: '资质信息',
        width: 240,
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
        label: '模特/手绘免责声明',
    },
    {
        value: 2,
        label: '首发证明',
    },
    {
        value: 3,
        label: '专利',
    },
    {
        value: 4,
        label: '明星肖像授权',
    },
    {
        value: 5,
        label: '品牌授权',
    },
    {
        value: 6,
        label: '广告审查表',
    },
    {
        value: 7,
        label: '特殊化妆品行政许可批件',
    },
    {
        value: 8,
        label: '质检报告',
    },
    {
        value: 9,
        label: '营业执照',
    },
    {
        value: 10,
        label: '进口报关单',
    },
    {
        value: 11,
        label: '出口报关单',
    },
    {
        value: 12,
        label: '数据认证报告',
    },
    {
        value: 13,
        label: '首发承诺函',
    },
    {
        value: 14,
        label: '活动立项证明',
    },
    {
        value: 15,
        label: '中华老字号',
    },
    {
        value: 16,
        label: '非物质文化遗产',
    },
    {
        value: 17,
        label: '央行批准文件',
    },
]
export const isValidOpt = [//是否有效
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
        label: '其他',
    },
    {
        value: 5,
        label: '过期',
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