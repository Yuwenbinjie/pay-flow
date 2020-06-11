export const columns = [
    {
        key: 'reportDate',
        title: '审核时间',
    },
    {
        key: 'queryTypeName',
        title: '查询类型',
    },
    {
        key: 'erp',
        title: '审核人',
    },
    {
        title: '通过量',
        children: [{
            key: 'pass',
            title: '普通通过',
        }, {
            key: 'passAndMark',
            title: '打标通过',
        }]
    },
    {
        title: '驳回量（占比）',
        children: [{
            key: 'rejectTwo',
            title: '图片违规',
            render: (val, row)=>{
                return `${val}(${row.rejectTwoPer}%)`
            }
        }, {
            key: 'rejectFour',
            title: '文案违规',
            render: (val, row)=>{
                return `${val}(${row.rejectFourPer}%)`
            }
        }, {
            key: 'rejectEight',
            title: '缺少资质',
            render: (val, row)=>{
                return `${val}(${row.rejectEightPer}%)`
            }
        }, {
            key: 'rejectOne',
            title: '其他原因',
            render: (val, row)=>{
                return `${val}(${row.rejectOnePer}%)`
            }
        }]
    },
    {
        key: 'offline',
        title: '下线量',
    },
    {
        key: 'total',
        title: '操作总量',
    },
    {
        key: 'rejectPer',
        title: '驳回率',
    }
]
