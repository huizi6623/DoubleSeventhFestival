//动画结束事件
var animationEnd = (function() {
    var explorer = navigator.userAgent;
    if (~explorer.indexOf('WebKit')) {    //~按位取反
        return 'webkitAnimationEnd';
    }
    return 'animationend';
})();

var instanceX ;
var container = $("#content") ;
var swipe = Swipe(container) ;
var visualWidth = container.width() ;
var visualHeight = container.height() ;

//灯动画 //
///////////
var lamp = {
    elem: $('.b_background'),
    bright: function() {
        this.elem.addClass('lamp-bright');
    },
    dark: function() {
        this.elem.removeClass('lamp-bright');
    }
};

/////////
//右边飞鸟 //
/////////
var bird = {
    elem: $(".bird"),
    fly: function() {
        this.elem.addClass('birdFly')
        this.elem.transition({
            right: container.width()
        }, 15000, 'linear');
    }
};

///////////
//loge动画 //
///////////
var logo = {
    elem: $('.logo'),
    run: function() {
        this.elem.addClass('logolightSpeedIn')
            .on(animationEnd, function() {
                $(this).addClass('logoshake').off();
            });
    }
};

var snowflakeURl = [
    'http://img.mukewang.com/55adde120001d34e00410041.png',
    'http://img.mukewang.com/55adde2a0001a91d00410041.png',
    'http://img.mukewang.com/55adde5500013b2500400041.png',
    'http://img.mukewang.com/55adde62000161c100410041.png',
    'http://img.mukewang.com/55adde7f0001433000410041.png',
    'http://img.mukewang.com/55addee7000117b500400041.png'
]

///////
//飘雪花 //
///////
function snowflake() {
    // 雪花容器
    var $flakeContainer = $('#snowflake');

    // 随机六张图
    function getImagesName() {
        return snowflakeURl[[Math.floor(Math.random() * 6)]];
    }
    // 创建一个雪花元素
    function createSnowBox() {
        var url = getImagesName();
        return $('<div class="snowbox" />').css({
            'width': 41,
            'height': 41,
            'position': 'absolute',
            'backgroundSize': 'cover',
            'zIndex': 100000,
            'top': '-41px',
            'backgroundImage': 'url(' + url + ')'
        }).addClass('snowRoll');
    }
    // 开始飘花
    setInterval(function() {
        // 运动的轨迹
        var startPositionLeft = Math.random() * visualWidth - 100,
            startOpacity    = 1,
            endPositionTop  = visualHeight - 40,
            endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
            duration        = visualHeight * 10 + Math.random() * 5000;

        // 随机透明度，不小于0.5
        var randomStart = Math.random();
        randomStart = randomStart < 0.5 ? startOpacity : randomStart;

        // 创建一个雪花
        var $flake = createSnowBox();

        // 设计起点位置
        $flake.css({
            left: startPositionLeft,
            opacity : randomStart
        });

        // 加入到容器
        $flakeContainer.append($flake);

        // 开始执行动画
        $flake.transition({
            top: endPositionTop,
            left: endPositionLeft,
            opacity: 0.7
        }, duration, 'ease-out', function() {
            $(this).remove() //结束后删除
        });

    }, 200);
}

// 音乐配置
var audioConfig = {
    enable: true, // 是否开启音乐
    playURl: '../music/happy.wav', // 正常播放地址
    cycleURL: '../music/circulation.wav' // 正常循环播放地址
};

/////////
//背景音乐 //
/////////
function Hmlt5Audio(url, isloop) {
    var audio = new Audio(url);
    audio.autoPlay = true;
    audio.loop = isloop || false;
    audio.play();
    return {
        end: function(callback) {
            audio.addEventListener('ended', function() {
                callback();
            }, false);
        }
    };
}

function audioPlay(){
    var audio1 = Hmlt5Audio(audioConfig.playURl);
    audio1.end(function() {
        Hmlt5Audio(audioConfig.cycleURL, true);
    });
}

//页面滚动到指定的位置
function scrollTo(time , proportionX){
    var distX = container.width() * proportionX ;
    swipe.scrollTo(distX , time) ;
}

//获取数据
var getValue = function(className){
    var $elem = $("" + className + "") ;
    return {
        height : $elem.height() ,
        top : $elem.position().top
    } ;
} ;

var bridgeY = function() {
    var data = getValue(".c_background_middle") ;
    return data.top ;
} ;

var girl = {
    elem : $(".girl") ,
    getHeight : function(){
        return this.elem.height() ;
    },
    setOffset : function(){
        this.elem.css({
            left : visualWidth / 2 ,
            top : bridgeY() - this.getHeight()
        });
    },
    //转身
    rotate : function(){
        this.elem.addClass("girl-rotate") ;
    },
    getOffset : function(){
        return this.elem.offset() ;
    },
    getWidth : function(){
        return this.elem.width() ;
    }
} ;

girl.setOffset() ;

function doorAction(left, right, time) {
    var $door = $('.door');
    var doorLeft = $('.door-left');
    var doorRight = $('.door-right');
    var defer = $.Deferred();
    var count = 2;
    // 等待开门完成
    var complete = function() {
        if (count == 1) {
            defer.resolve();
            return;
        }
        count--;
    };
    doorLeft.transition({
        'left': left
    }, time, complete);
    doorRight.transition({
        'left': right
    }, time, complete);
    return defer;
}

// 开门
function openDoor() {
    return doorAction('-50%', '100%', 2000);
}

// 关门
function shutDoor() {
    return doorAction('0%', '50%', 2000);
}

function BoyWalk() {
    var swipe = Swipe(container) ;

//路的Y轴
    var pathY = function() {
        var data = getValue(".a_background_middle") ;
        return data.top + data.height / 2 ;
    }() ;

    var $boy = $("#boy") ;
    var boyHeight = $boy.height() ;

//修正小男孩的正确位置
    $boy.css({
        top : pathY - boyHeight + 25
    }) ;

    //暂停走路
    function pauseWalk(){
        $boy.stop().removeClass("slowWalk").addClass("pauseWalk") ;
    }

//恢复走路
    function restoreWalk() {
        $boy.removeClass('pauseWalk') ;
    }

//css3的动作变化
    function slowWalk() {
        $boy.addClass("slowWalk") ;
    }

//计算移动距离
    function calculateDist(direction , proportion) {
        return (direction == "x" ? visualWidth : visualHeight) * proportion ;
    }

//用transition做运动
    function startRun(options , runTime){
        var dfdPlay = $.Deferred() ;
        //恢复走路
        restoreWalk() ;
        //运动的属性
        $boy.transition(
            options,
            runTime ,
            'linear',
            function(){
                dfdPlay.resolve() ;
            }
        );
        return dfdPlay ;
    }

//开始走路
    function walkRun(time , distX , distY) {
        time = time || 3000 ;
        slowWalk() ;  //脚动作
        var d1 = startRun({
            "left" : distX + 'px' ,
            "top" : distY ? distY : undefined
        } , time) ;
        return d1 ;
    }

    function walkToShop(runTime){
        var defer = $.Deferred() ;
        var doorObj = $(".door") ;
        //门的坐标
        var offsetDoor = doorObj.offset() ;
        var doorOffsetLeft = offsetDoor.left ;
        //小孩当前的坐标
        var offsetBoy = $boy.offset() ;
        var boyOffsetLeft = offsetBoy.left ;

        //当前需要移动的坐标
        instanceX = (doorOffsetLeft + doorObj.width() / 2) -
            (boyOffsetLeft + $boy.width() / 2) ;

        slowWalk() ;
        //开始走路
        var walkPlay = startRun({
            transform : "translateX(" + instanceX + "px),scale(0.3,0.3)" ,
            opacity : 0.1
        } , runTime) ;

        //走路完毕
        walkPlay.done(function(){
            $boy.css({
                opacity: 0
            })
            defer.resolve() ;
        })
        return defer ;
    }

    // 走出店
    function walkOutShop(runTime) {
        var defer = $.Deferred();
        //开始走路
        var walkPlay = startRun({
            transform: "translateX(" + instanceX + "px),scale(1,1)",
            opacity: 1
        }, runTime);
        //走路完毕
        walkPlay.done(function() {
            defer.resolve();
        });
        return defer;
    }

    //取花
    function takeFlower(){
        var defer = $.Deferred() ;
        setTimeout(function(){
            $boy.addClass("slowFlowerWalk") ;
            defer.resolve() ;
        } , 1000 ) ;
        return defer ;
    }

    return {
        walkTo : function (time , proportionX , proportionY) {
            var distX = calculateDist("x" , proportionX) ;
            var distY = calculateDist("y" , proportionY) ;
            return walkRun(time , distX , distY) ;
        },
        // 走进商店
        toShop: function(time) {
            return walkToShop(time);
        },
        // 走出商店
        outShop: function(time) {
            return walkOutShop(time);
        },
        takeFlower : function(){
            return takeFlower() ;
        },
        stopWalk : function() {
            pauseWalk() ;
        },
        setColor : function (value) {
            $boy.css("background-color" , value) ;
        },
        getWidth : function(){
            return $boy.width() ;
        },
        resetOriginal : function(){
            this.stopWalk() ;
            $boy.removeClass("slowWalk slowFlowerWalk").addClass("boyOriginal") ;
        },
        setFlowerWalk : function() {
            $boy.addClass("slowFlowerWalk") ;
        },
        rotate : function(callback){
            restoreWalk() ;
            $boy.addClass("boy-rotate") ;
            if(callback){
               $boy.on(animationEnd , function(){
                   callback() ;
                   $(this).off() ;
               })
            }
        }
    }
}

