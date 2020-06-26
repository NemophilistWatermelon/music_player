const log = console.log.bind(console)
'use strict'
class 音乐播放器 {
    constructor() {
        this.音乐播放界面 = $('.Music-contaienr')
        this.播放器 = $('.music-player audio')[0]
        this.是否暂停 = true
        this.歌词容器 = $('.music-lrc')[0]
        this.播放 = $('.music-pause')[0]
        this.上一首 = $('.music-cut-up')[0]
        this.下一首 = $('.music-cut-down')[0]
        this.提高声音 = $('.colume-up')[0]
        this.减少声音 = $('.colume-down')[0]
        this.音乐控制容器 = $('.music-control-wrapper')
        this.进度 = 0
        this.当前声音 = 1
        this.进度条 = $('.music-process')
        this.进度事件 = null
        this.控制声音递增递减区间 = 0.1



        this.声音显示框 = $('.music-volume-log')
        this.声音显示框父亲 = $('.music-volume')
        this.歌曲播放进度显示 = $('.music-play-process')

        this.歌词计数 = 0
        this.歌词 = null
        this.歌词Timer = null

        this.显示列表按钮 = $('.music-play-listBtn')
        this.当前列表显示状态 = false
        this.播放歌曲列表 = $('.music-play-list')

        this.进度条背景 = $('.music-process-back')
    }
    static 函数自动装车() {
        return new this
    }

    播放_or_暂停(target) {
        var __self = this
        target = target || __self.播放
        var 是否暂停 = __self.是否暂停
        if (target == __self.播放) {
            if (是否暂停) {
                __self.播放歌曲()
                    //  __self.错误显示('播放后状态', __self.是否暂停)
                __self.播放.innerText = ">"
            } else {
                __self.暂停歌曲()
                __self.播放.innerText = "||"
                log('暂停后状态', __self.是否暂停)
            }

        }
    }
    更新(event) {
        this.进度事件 = setInterval(event.bind(this), 2000)
    }
    防抖() {
        var fn = {}
        fn.fun_event = arguments[0]
        fn.event = arguments[1]
        fn.id = setTimeout(function() {
            this.fun_event()
            clearTimeout(fn.id)
        }.bind(fn), 300)

    }
    列表显示() {
        const 进度显示控制块 = this.显示列表按钮;
        const 播放列表 = this.播放歌曲列表
        const 播放列表出现与消失 = function() {
            var activeClass = 'self-right-move'
            this.toggleClass(activeClass)
        }
        const 滑块划出与收缩 = function(event) {
            滑块动画(71)
            播放列表出现与消失.call(播放列表)
        }

        const 滑块还原与变化 = function(bool, num) {
            switch (bool) {
                case true:
                    进度显示控制块.css({
                        'transform': `translate(${num}%, -50%)`,
                        'opacity': "1"
                    })
                    this.当前列表显示状态 = true
                    break;
                case false:
                    进度显示控制块.css({
                        'transform': `translate(36%, -50%)`,
                        'opacity': ".9"
                    })

                    this.当前列表显示状态 = false
                    break;
                default:
                    break;
            }
        }.bind(this)
        const 滑块动画 = (num) => {
            var 当前显示状态 = this.当前列表显示状态
            滑块还原与变化(!当前显示状态, num)
        }

        const 滑块绑定事件 = () => {
            进度显示控制块.on('click', this.防抖.bind(this, 滑块划出与收缩))
        }
        return function() {
            滑块绑定事件()
        }
    }
    绑定事件() {
        this.列表显示()()
        this.更新(this.进度更新)
        this.获取歌词()
        this.进度控制()
        var _self = this
        this.音乐控制容器.on('click', function(event) {
            var target = event.target;
            _self.播放_or_暂停(target)
            _self.声音控制.call(_self, target)
        })
    }
    点击进度(event) {
        var target = event.target
        var 按下位置 = event.offsetX;
        var 播放器 = this.播放器
        var 播放器总进度 = 播放器.duration
        var 播放器宽度 = this.音乐播放界面.css('width').split("px")[0]
        var 当前进度距离 = Number($(target).css('width').split("px")[0])
        log('当前进度距离', 当前进度距离)
        var 退的距离 = 按下位置 / 播放器宽度
        播放器.currentTime = 播放器总进度 * 退的距离
        this.进度条.css('width', parseInt((播放器.currentTime / 播放器总进度) * 100) + "%")
    }
    进度控制() {
        var 进度 = this.进度条
        var 背景进度 = this.进度条背景
        背景进度.on('click', this.点击进度.bind(this))
            // 进度.on('click', this.点击进度.bind(this))
    }
    播放歌曲() {
        clearInterval(this.进度事件)
            // this.歌词渲染()
        if (this.是否暂停 === true) {
            this.播放器.play()
            this.是否暂停 = false
            this.更新(this.进度更新)
            this.动态歌词渲染(this.歌词, this.是否暂停)
        }
    }
    暂停歌曲() {
        if (this.是否暂停 === false) {
            this.播放器.pause()
            this.动态歌词渲染(this.歌词, this.是否暂停)
            this.是否暂停 = true
            clearInterval(this.进度事件)
            clearInterval(this.歌词Timer)
        }
    }
    进度更新() {
        if (!this.是否暂停) {
            var 播放器 = this.播放器
            var currentTime = parseInt(播放器.currentTime)
            var 歌曲总时间 = parseInt(播放器.duration)
            this.进度 = (currentTime / 歌曲总时间) * 100
            if (this.进度 == "100%") {
                this.播放_or_暂停()
            }
            this.进度条.css('width', parseInt(this.进度) + "%")
            this.歌曲播放进度显示.text(parseInt(this.进度) + "%")
        }

    }
    删除显示声音的盒子动画(activeClass, second) {
        var time = null
        var _self = this
        time = setTimeout(function() {
            _self.声音显示框父亲.removeClass(activeClass)
            clearTimeout(time)
        }, second)
    }
    获取歌词(url) {
        var url = "./世界这么大还是遇见你.json"
        this.异步获取歌词(url).then(歌词 => {
            this.歌词 = 歌词;
            log("104 歌词获取完毕", this.歌词)
        })

    }
    异步获取歌词(url) {
        var _self = this
        return new Promise(function(resolve, reject) {
            $.ajax({
                method: 'get',
                url: url,
                dataType: "JSON",
                success(data) {
                    // log("歌词", JSON.stringify(data.data.lrclist) )
                    resolve(data.data.lrclist)
                },
                error(err) {
                    reject(err)
                }
            })
        })
    }
    播放器时间(event) {
        var target = event.target
        var currentTime = target.currentTime - 3.7
        var 歌词 = this.歌词
        var 歌词容器 = this.歌词容器
        var length = 歌词.length
            // log('当前播放时间', currentTime)
            // 不断进行歌词时间对比
            // 酷我音乐的 lrc 文件格式为 [{time:xxx, lineLyric:xxx}]
        for (var i = 0; i < length; i++) {
            if ((currentTime <= 歌词[i].time)) {
                var t = `
                    <p class="active">${歌词[i].lineLyric} </p>
                `
                    // log(歌词[i].lineLyric)
                $(歌词容器).html(t)
                    // 找到就退出
                break
            }
        }
        // log("匹配到的歌词", ...匹配到的歌词)
    }
    动态歌词渲染(歌词, 开关) {
        var _self = this
        _self.歌词 = 歌词
        if (!开关) {
            this.播放器.addEventListener("timeupdate", _self.播放器时间.bind(this), false)
        } else {
            this.播放器.removeEventListener("timeupdate", _self.播放器时间)
        }

    }
    声音显示(volume) {
        var activeClass = 'volume-animation'
        volume = parseInt(parseFloat(volume) * 100)
        if (volume == "1") {
            volume = `0%`
        } else {
            volume = `${volume}%`
        }

        this.声音显示框.text(volume)
        this.声音显示框父亲.addClass(activeClass)
        this.删除显示声音的盒子动画(activeClass, 2000)
    }
    声音控制(target) {
        var 播放器 = this.播放器
            // audio 有声界限
        var 最大声音 = 1
            // audio 无声界限
        var 最小声音 = 0.01
        var 输出 = (text, err) => this.错误显示(text, err)
        switch (target) {
            case this.提高声音:
                // 双方为真 即执行 否则 返回 false 退出
                !(this.当前声音 >= 最大声音) && (
                    () => {
                        播放器.volume = this.当前声音 += this.控制声音递增递减区间;
                        this.当前声音 = 播放器.volume
                        this.声音显示(this.当前声音)
                        return 播放器.volume;
                    })()
                break;
            case this.减少声音:
                !(this.当前声音 <= 最小声音) && (
                    () => {
                        播放器.volume = (this.当前声音 -= this.控制声音递增递减区间)
                        this.当前声音 = 播放器.volume
                        this.声音显示(this.当前声音)
                        return 播放器.volume;
                    })()
                break;
            default:
                return 播放器.volume;
        }

    }
    请求歌曲接口(歌曲ID) {
        var path = '/api/v1/id?=' + 歌曲ID
        return fetch(歌曲ID)
    }
    播放器的播放歌曲(歌曲ID) {
        var 歌曲Result = this.请求歌曲接口(歌曲ID)
        log(歌曲Result)
    }

}
// 播放歌曲列表
class MusicList extends 音乐播放器 {
    constructor() {
        super()
        this.musicList = this.播放歌曲列表
        this.isLike = false
    }
    static new() {
        return new this
    }
    init() {
        this.bindEvents()
    }
    bindEvent() {

        var { like } = this.list_func()
        const musicList_Action = (event) => {
            var target = event.target
            like.bind(target, this.isLike)()
        }
        this.musicList.on('click', musicList_Action)
    }

    list_func() {
        var m_list_self = this
        const like = function(isLike) {
            // like 
            if (!this.classList.contains('like')) {
                return
            }
            var likedClass = 'liked'
            if (!isLike) {
                this.classList.add(likedClass)
                m_list_self.isLike = true
            } else {
                this.classList.remove(likedClass)
                m_list_self.isLike = false
            }
        }

        return {
            like
        }
    }






    bindEvents() {
        this.bindEvent()
    }


}
const __main = function() {
    var music = 音乐播放器.函数自动装车()
    music.绑定事件()
    var musicList = MusicList.new()
    musicList.init()
}
__main()