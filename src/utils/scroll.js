import $ from 'jquery'

/*
ele:要滑动固定的元素
headTop:距离顶部的距离
*/
export default (ele, headTop)=>{
    let eleOffset = $(ele).offset()
    // $(window).scroll(setScrollTop.bind(this, ele, eleOffset, headTop))
    $(window).scroll(function (){
        let top = eleOffset.top - $(window).scrollTop()
        if (top < headTop) {
            $(ele).css({top: headTop - top})
        } else {
            $(ele).css({top: '0px'})
        }
    })
}
