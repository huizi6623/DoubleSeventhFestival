var lamp = {
    elem: $(".b_background"),
    bright: function(){
        this.elem.addClass("lamp-bright") ;
    },
    dark: function(){
        this.elem.removeClass("lamp-bright") ;
    }
} ;

var bird = {
    elem: $(".bird") ,
    fly: function(){
        this.elem.transition({
            right: $("#content").width()
        }, 15000, "linear") ;
    }
} ;

function audioPlay(){
    var audioConfig = {
        enable: true ,
        playUrl: "../music/happy.wav",
        cycleUrl: "../music/circulation.wav"
    } ;

    function Html5Audio(url, isloop){
        var audio = new Audio() ;
        audio.loop = isloop || false ;
        audio.src = url ;
        audio.play() ;
        return {
            end: function(callback){
                audio.addEventListener("enden", function(){
                    callback() ;
                }, false) ;
            }
        } ;
    }

    var audio1 = Html5Audio(audioConfig.playUrl) ;
    audio1.end(function(){
        Html5Audio(audioConfig.cycleUrl, true) ;
    }) ;
}

function snowflake(){
    var snowflakeURL = [
        "../images/snowflake/snowflake1.png",
        "../images/snowflake/snowflake2.png",
        "../images/snowflake/snowflake3.png",
        "../images/snowflake/snowflake4.png",
    ] ;
    var $flakeContainer = $("#snowflake") ;

    function getImageName(){
        return snowflakeURL[Math.floor(Math.random() * snowflakeURL.length)] ;
    }

    function createSnowBox(){
        var url = getImageName() ;
        return $("<div class='snowbox'></div>").css({
            backgroundImage: "url(" + url + ")"
        }).addClass("snowRoll") ;
    }

    setInterval(function(){
        var startPositionLeft = Math.random() * visualWidth ,
            startOpacity = 1 ,
            endPositionTop = visualHeight ,
            endPositionLeft = startPositionLeft - 200 + Math.random() * 500 ,
            duration = visualHeight * 10 + Math.random() * 5000 ;

        var randomStart = Math.random() ;
        randomStart = randomStart < 0.5 ? startOpacity : randomStart ;

        var $flake = createSnowBox() ;

        $flake.css({
            left: startPositionLeft,
            opacity:randomStart
        }) ;

        $flakeContainer.append($flake) ;

        $flake.transition({
            top: endPositionTop,
            left: endPositionLeft,
            opacity: 0.7
        }, duration, "ease-out", function(){
            $(this).remove() ;
        });
    }, 200) ;

}

function Door() {
    var doorLeft = $(".door-left");
    var doorRight = $(".door-right") ;

    function doorAction(left, right, time){
        var dfd = $.Deferred() ;
        var count = 2 ;

        var complete = function(){
            if(count == 1){
                dfd.resolve();
                return ;
            }
            count -- ;
        };

        doorLeft.transition({
            left: left
        }, time, complete) ;

        doorRight.transition({
            left: right
        }, time, complete) ;

        return dfd ;
    }

    return {
        openDoor: function(){
            return doorAction("-50%", "100%", 2000) ;
        },
        shutDoor: function(){
            return doorAction("0%", "50%", 2000) ;
        }
    }
}

//获取数据
var getValue = function(className){
    var $elem = $("" + className + "") ;
    return {
        height: $elem.height() ,
        top: $elem.position().top
    } ;
} ;

function BoyWalk(){
    var container = $("#content") ;
    var visualWidth = container.width() ;
    var visualHeight = container.height() ;
    var $boy = $("#boy") ;
    var boyHeight = $boy.height() ;

//路的Y轴
    var pathY = function(){
        var data = getValue(".a_background_middle") ;
        return data.top + data.height / 2 ;
    }() ;

    $boy.css({
        top: pathY - boyHeight + 25
    }) ;

    //开始走路
    function slowWalk(){
        $boy.addClass("slowWalk") ;
    }

    //暂停走路
    function pauseWalk() {
        $boy.addClass('pauseWalk');
    }

    //恢复走路
    function restoreWalk(){
        $boy.removeClass("pauseWalk") ;
    }

    //计算移动距离
    function calculateDist(direction, proportion){
        return (direction == "x"?
            visualWidth : visualHeight) * proportion ;
    }

    //用transition做运动
    function startRun(options, runTime){
        var dfd = $.Deferred() ;
        //恢复走路
        restoreWalk() ;
        //运动的属性
        $boy.transition(
            options,
            runTime,
            "linear",
            function(){
                dfd.resolve() ;
            }) ;
        return dfd ;
    }

    //开始走路
    function walkRun(time, distX, distY) {
        time = time || 3000;
        //脚动作动画
        slowWalk();
        //开始走路
        var d1 = startRun({
            left: distX + "px",
            top: distY ? distY : undefined
        }, time);
        return d1;
    }

    var instanceX ;

    function walkToShop(runTime){
        var dfd = $.Deferred() ;
        var door = $(".door") ;

        var offsetDoor = door.offset() ;
        var doorOffsetLeft = offsetDoor.left ;

        var offsetBoy = $boy.offset() ;
        var boyOffsetLeft = offsetBoy.left ;

        instanceX = (doorOffsetLeft + door.width() / 2) - (boyOffsetLeft + $boy.width() / 2) ;

        var walkPlay = startRun({
            transform: "translateX(" + instanceX + "px),scale(0.3,0.3)",
            opacity: 0.1
        }, 2000) ;
        walkPlay.done(function(){
            $boy.css({
                opacity:0
            }) ;
            dfd.resolve();
        }) ;
        return dfd ;
    }

    function walkOutShop(runTime){
        var dfd = $.Deferred() ;
        restoreWalk() ;

        var walkPlay = startRun({
            transform: "translateX(" + instanceX + "px),scale(1,1)",
            opacity: 1
        }, runTime) ;

        walkPlay.done(function(){
            dfd.resolve() ;
        }) ;
        return dfd ;
    }

    function takeFlower(){
        var dfd = $.Deferred() ;
        setTimeout(function(){
            $boy.removeClass("slowWalk").addClass("slowFlowerWalk");
            dfd.resolve() ;
        }, 1000) ;
        return dfd ;
    }

    return {
        getInstanceX: function(){
            return instanceX ;
        },
        walkTo: function(time, proportionX, proportionY){
            var distX = calculateDist("x", proportionX) ;
            var distY = calculateDist("y", proportionY) ;
            return walkRun(time, distX, distY) ;
        },
        pauseWalk: function(){
            pauseWalk() ;
        },
        toShop: function(){
            return walkToShop.apply(null, arguments) ;
        },
        outShop: function(){
            return walkOutShop.apply(null, arguments) ;
        },
        takeFlower: function(){
            return takeFlower() ;
        },
        getWidth: function(){
            return $boy.width() ;
        },
        resetOriginal: function() {
            pauseWalk();
            // 恢复图片
            $boy.addClass('boyOriginal').removeClass('slowWalk slowFlowerWalk');
        },
        rotate: function(callback){
            restoreWalk();
            $boy.addClass("boy-rotate") ;
            if(callback){
                $boy.on(animationEnd, function() {
                    callback();
                    $(this).off();
                }) ;
            }
        }
    }
}

function Girl() {
    var container = $("#content") ;
    var visualWidth = container.width() ;
    var $girl = $(".girl") ;
    var girlHeight = $girl.height() ;

    var bridgeY = function(){
        var data = getValue(".c_background_middle") ;
        return data.top ;
    }() ;

    $girl.css({
        left: visualWidth / 2 ,
        top: bridgeY - girlHeight
    }) ;

    return {
        bridgeY: bridgeY,
        getOffset: function(){
            return $girl.offset() ;
        },
        getWidth: function(){
            return $girl.width() ;
        },
        getHeight: function(){
            return $girl.height() ;
        },
        rotate: function(){
            $girl.addClass("girl-rotate") ;
        }
    }
}


