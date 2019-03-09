function Swipe(container){
    var swipe = {} ;  //滑动对象
    var element = container.find(":first") ;
    var slides = element.find(">");
    var width = container.width() ;
    var height = container.height() ;

    //设置li页面总宽度
    element.css({
        width : (slides.length * width) + "px" ,
        height : height + "px"
    }) ;

    //设置每一个页面li的宽度
    $.each(slides, function(index){
        var slide = slides.eq(index) ;
        slide.css({
            width : width + "px" ,
            height : height + "px"
        });
    });

    swipe.scrollTo = function(x , speed){
        element.css({
            'transition-timing-function': 'linear',
            'transition-duration': speed + 'ms',
            'transform': 'translate3d(-' + x + 'px,0px,0px)' //设置页面X轴移动
        });
        return this ;
    }

    return swipe ;
}


