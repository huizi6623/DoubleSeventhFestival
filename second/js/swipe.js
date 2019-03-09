function Swipe(container){
    var element = container.find(":first") ;

    var swipe = {} ;

    var slides = element.find(">") ;

    var width = container.width() ;
    var height = container.height() ;

    element.css({
        width: (slides.length * width) + "px" ,
        height: height + "px"
    }) ;

    slides.each(function(index){
        var slide = slides.eq(index) ;
        slide.css({
            width: width + "px" ,
            height: height + "px"
        })
    }) ;

    swipe.scrollTo = function(speed, x){
        element.css({
            transition: "transform " + speed + "ms linear ",
            transform: "translate(-" + x + "px, 0px)"
        }) ;
        return this ;
    } ;

    return swipe ;
}
