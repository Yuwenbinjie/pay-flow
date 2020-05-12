import $ from 'jquery'
import _ from 'lodash'

/*
ele:要排序着色的表格元素
data:排序后的数据
key:根据key列着色
*/
export default (ele, data, key)=>{
    let mark = true
    data[0].bgColor = true
    for (let i = 1; i < data.length; i++){
        if (data[i][key] != data[i - 1][key]){
            mark = !mark
        }
        data[i].bgColor = mark
    }
    // console.log(data)
    _.forEach(data, (item, index)=>{
        // console.log($(`${ele} .jad-table-fixed-right tbody tr`))
        $(`${ele} .jad-table-content tbody tr:eq(${index})`).css({
            background: item.bgColor ? 'rgba(30, 144, 255, 0.06)' : 'rgba(144, 240, 144, 0.06)'
        })
    })
}
