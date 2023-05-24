(function (global, factory) {
      // 重写factory方法.让factory有独立的作用域
      var _factory = factory; factory = function(arkWeb) { return function(options) { return _factory(arkWeb)(options); }};
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@tencent/ark-web')) :
    typeof define === 'function' && define.amd ? define(['@tencent/ark-web'], factory) :
    (global.Ark = factory(global.WebArk));
})(this, (function (arkWeb) {
    /**
     * @fileoverview 前置脚本注入(polyfill)
     * @author alawnxu
     * @date 2022-07-30 22:20:00
     * @version 1.0.0
     * @description 这个是一个模块文件. 变量请采用: __VAR__ 方式命名
     * 
     * 在Ark引擎中默认支持了 JSON.Stringify 和 JSON.Parse @see {@link /Users/alawnxu/workspace/qq/Ark/src/libs/net/httpwrapper.cpp}
     * 其实同 Net.JSONToTable 和 Net.TableToJSON
     * 
     * 在这里就通过注入的方式注册进去吧
     * 
     * 涉及到这个Api的Ark. 游戏中心所有的Ark因为走了单独的构建,所以都会使用到这个Api
     * @see {@link https://git.woa.com/sq-gamecenter-frontend-team/gc-ark-hub/tree/master/com_tencent_gamecenter_game_download}
     * @see {@link https://git.woa.com/group-pro/bot-frontend/bot-ark/tree/master/com_tencent_bot_groupbot}
     */
    (function() {
        JSON.Stringify = JSON.Stringify || JSON.stringify;
        JSON.Parse = JSON.Parse || JSON.parse;
    })();

    /**
     * @fileoverview 前置脚本注入
     * @author alawnxu
     * @date 2022-04-09 23:26:29
     * @version 1.0.0
     * @description 这个是一个模块文件. 变量请采用: __VAR__ 方式命名
     */

    /**
     * 暴露出局部变量.方便后续的模块挂载
     */
    let GlobalAppTemplates = {};
    const ArkGlobalContext = {
      /**
       * @private
       * @param {string} id 视图ID
       * @param {string} template 视图模板
       */
      _setViewTemplate(id, template) {
        GlobalAppTemplates[id] = template;
      },
      /**
       * 获取所有的模板
       * @public
       * @returns
       */
      getViewTemplates() {
        return GlobalAppTemplates;
      },
      /**
       * 释放所有模板
       * @date 2022-08-08 11:14:36
       */
      clearTemplates() {
        GlobalAppTemplates = {};
      }
    };

    const ArkWindow = Object.create({});
        const apis = ["global","console","setTimeout","setInterval","clearInterval","clearTimeout","createAssigner","has","isObject","allKeys","keys","UrlParser","util","report","baseView","isPreview","isChannel","isAndroid","getAvatar","resetWidth","getDarkColorModel","getEasyModel","getThemeConfig","app"];
        apis.forEach(api => {
          let val;
          Object.defineProperty(ArkWindow, api, {
            get() {
              return val;
            },
            set(value) {
              val = value;
            }
          });
        });

    /**
     * @fileoverview 前置脚本注入(UI模块)
     * @author alawnxu
     * @date 2022-04-09 23:26:29
     * @version 1.0.0
     * @description 这个是一个模块文件. 变量请采用: __VAR__ 方式命名
     */

    const UI = new Proxy(arkWeb.UI, {
      get(target, propKey) {
        const func = target[propKey];
        if (typeof func === 'function') {

          /**
           * @description 这里之前传入global.app, 后面发现不太可行, 因为在Ark视图里面有注册了很多事件.这些事件的会直接调用里面声明的全局方法.这个时候就有可能不是在某一个对象上了.
           * @update 2022年07月30日22:48:18
           * @author alawnxu
           */
          return function (...params) {
            return target[propKey](...params, ArkWindow);
          };
        }
        return target[propKey];
      },
    });

    /**
     * @fileoverview 前置脚本注入(Net模块)
     * @author alawnxu
     * @date 2022-04-09 23:26:29
     * @version 1.0.0
     * @description 这个是一个模块文件. 变量请采用: __VAR__ 方式命名
     */

    const Net = new Proxy(arkWeb.Net, {
      get(target, propKey) {
        const func = target[propKey];
        if (typeof func === 'function') {

          /**
           * @description 这里之前传入global.app, 后面发现不太可行, 因为在Ark视图里面有注册了很多事件.这些事件的会直接调用里面声明的全局方法.这个时候就有可能不是在某一个对象上了.
           * @update 2022年07月30日22:48:18
           * @author alawnxu
           */
          return function (...params) {
            return target[propKey](...params, ArkWindow);
          };
        }
        return target[propKey];
      },
    });

    ArkGlobalContext._setViewTemplate('albumAddPic', `<View id="albumAddPic" style="share-container" metadatatype="albumData">
	<Texture id="bgColor" color="0xFFFFFFFF"></Texture>
    <Event>
        <OnResize value="app.OnResize" name="OnResize"></OnResize>
        <OnSetValue value="app.OnSetValue" name="OnSetValue"></OnSetValue>
        <OnClick value="app.OnClick" name="OnClick"></OnClick>
    </Event>
	<View style="share-app">
        <!--
            icons : {
                "空间相册":"album.png",
                "群相册":"album-group.png",
                "说说":"feed.png",
                "日志":"blog.png"
            }
        -->
        <Image id="js-app-icon" style="share-app-icon" value="images/album-group.png" stretch="1"></Image><!-- 图标见上 -->
        <Text id="js-app-name" style="share-app-name" textcolor="0xFF878b99" font="size.12" autosize="true" ellipsis="true" value="&#x7FA4;&#x76F8;&#x518C;"></Text>
    </View>
    <View style="share-main">

        <View style="share-event">
            <Text id="js-title" style="text" textcolor="0xFF03081A" font="size.17" multiline="true" ellipsis="true" value="&#x4E0A;&#x4F20;&#x4E86;&#x7167;&#x7247;/&#x89C6;&#x9891;"></Text>
        </View>

        <View id="js-desc-view" style="share-text" visible="true">
            <Text id="js-desc" style="text" textcolor="0xFF878b99" font="size.14" multiline="true" ellipsis="true" value=""></Text>
        </View>

        <!-- 单张照片 -->
        <View id="js-single-photo-wrap" style="share-image-single" radius="4,4,4,4" visible="false">
            <View id="js-single-photo-view" style="image-item" visible="false">
                <Texture color="0xFFEBEDF5"></Texture>
                <Image id="js-single-photo" stretch="2"></Image>
                <Image id="single-photo-play-icon" value="images/play.png" size="50,50" anchors="0" stretch="1" visible="false"></Image>
            </View>

            <Image id="js-single-mask" style="image-mask" value="images/mask.png" stretch="2" visible="false"></Image>

            <View id="js-single-image-count-container" style="image-count" visible="false">
                <View style="image-count-item">
                    <Image style="item-icon" value="images/icon-album.png" stretch="2"></Image>
                    <Text id="js-single-image-count" style="item-text" textcolor="0xFFFFFFFF" font="size.12" autosize="true" ellipsis="true" value=""></Text>
                </View>
            </View>
        </View>

    </View>
</View>
`);

    var global$4 = ArkWindow;

    (function(global) {
        global.console = {
            MAX_LOG_DEPTH: 10,
            _log: function(arg, depth) {
                var res = [];
                var type = typeof arg;
                if (type == 'object') {
                    var keyLen = 0;
                    for (var key in arg) {
                        keyLen = keyLen + 1;
                    }
                    if (keyLen == 0) {
                        res.push(ArkWindow.console._toString(arg));
                    } else {
                        var tmp = [];
                        for (var i = 0; i < depth; ++i) {
                            tmp.push('    ');
                        }
                        tmp = tmp.join('');
                        var tmp1 = tmp + '    ';
                        res.push('{');
                        var i = 0;
                        for (var key in arg) {
                            res.push('\n' + tmp1 + key + ' : ');
                            if (depth >= ArkWindow.console.MAX_LOG_DEPTH) {
                                res.push(ArkWindow.console._toString(arg[key]));
                            } else {
                                res.push(ArkWindow.console._log(arg[key], depth + 1));
                            }
                            i = i + 1;
                            if (i < keyLen) {
                                res.push(',');
                            }

                        }
                        res.push('\n' + tmp + '}');
                    }

                } else {
                    res.push(ArkWindow.console._toString(arg));
                }
                return res.join('');
            },
            _toString: function(arg) {
                var type = Object.prototype.toString.call(arg);
                if (type == '[object Null]') {
                    return 'Null';
                } else if (type == '[object Undefined]') {
                    return 'Undefined';
                } else if (arg && arg.toString && typeof arg.toString == 'function') {
                    return arg.toString();
                } else {
                    return 'Unknow Type';
                }
            },
            log: function() {
                return; // log 太多了 屏蔽了，发布的时候只打 warn
            },
            warn: function() {
                var res = [];
                for (var i = 0; i < arguments.length; ++i) {
                    res.push(ArkWindow.console._log(arguments[i], 0));
                }
                arkWeb.Console.Log('[com.tencent.groupphoto warn]:');
                arkWeb.Console.Log(res.join('\n'));
            },
            error: function() {
                var res = [];
                for (var i = 0; i < arguments.length; ++i) {
                    res.push(ArkWindow.console._log(arguments[i], 0));
                }
                arkWeb.Console.Log('[com.tencent.groupphoto error]:');
                arkWeb.Console.Log(res.join('\n'));
            }
        };


        var timerId = 0;
        var timerMap = {};

        function createTimer(func, ms) {
            var timer = arkWeb.Timer();
            var _timerId = timerId++;
            timerMap[_timerId] = timer;
            timer.SetInterval(ms);
            timer.AttachEvent("OnTimer", function(timer) {
                func(timer);
            });
            timer.Start();
            return _timerId;
        }

        global.setTimeout = function(func, ms) {
            return createTimer(function(timer) {
                func();
                timer.Stop();
            }, ms);
        };

        global.setInterval = function(func, ms) {
            return createTimer(function(timer) {
                func();
            }, ms);
        };

        global.clearTimeout = global.clearInterval = function(_timerId) {
            var timer = timerMap[_timerId];
            if (timer) {
                timer.Stop();
                delete timerMap[_timerId];
            }
        };
    })(global$4);


    ArkWindow.global = global$4;

    function createAssigner(keysFunc, defaults) {
        return function(obj) {
            var length = arguments.length;
            if (defaults) obj = Object(obj);
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index],
                    keys = keysFunc(source),
                    l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (!defaults || obj[key] === void 0) obj[key] = source[key];
                }
            }
            return obj;
        };
    }

    function has(obj, path) {
        return obj != null && Object.prototype.hasOwnProperty.call(obj, path);
    }
    function isObject(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    }
    function allKeys(obj) {
        if (!isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        return keys;
    }
    function keys(obj) {
        if (!isObject(obj)) return [];
        var keys = [];
        for (var key in obj)
            if (has(obj, key)) keys.push(key);
        return keys;
    }
    /*
     * UrlParser
     */
    function UrlParser(url) {
        this.url = url;

        this._schemeIndex = this.NOT_CALCULATED;
        this.scheme = this.parseScheme();
        this.authority = this.parseAuthority(this.url, this._schemeIndex);
        this.path = this.parsePath();
    }

    UrlParser.prototype.NOT_FOUND = -1;
    UrlParser.prototype.NOT_CALCULATED = -2;

    UrlParser.prototype.findSchemeSeparator = function() {
        if (this._schemeIndex === this.NOT_CALCULATED) {
            var pos = this.url.indexOf(':');
            if (pos < 0) {
                this._schemeIndex = this.NOT_FOUND;
            } else {
                this._schemeIndex = pos;
            }
        }
        return this._schemeIndex;
    };

    UrlParser.prototype.parseScheme = function() {
        var ssi = this.findSchemeSeparator();
        if (ssi === this.NOT_FOUND) {
            return "";
        }
        return this.url.substr(0, ssi);
    };

    UrlParser.prototype.parseAuthority = function(url, ssi) {
        if (url.length <= ssi + 2 ||
            url.charAt(ssi + 1) !== '/' ||
            url.charAt(ssi + 2) !== '/') {
            // no authority
            return "";
        }

        var start = ssi + 3;
        var end = start;
        while (end < url.length) {
            if (this.isSeperator(url.charAt(end))) {
                break;
            }
            end++;
        }
        var len = end - start;
        return url.substr(start, len);
    };

    UrlParser.prototype.parsePath = function() {
        var ssi = this.findSchemeSeparator();
        if (ssi > -1) {
            if (ssi + 1 === this.url.length) {
                // empty uri
                return "";
            }

            if (this.url.charAt(ssi + 1) !== '/') {
                // not parse opaque uri
                return "";
            }
        }
        return this.doParsePath(this.url, ssi);
    };

    UrlParser.prototype.doParsePath = function(url, ssi) {
        var pathStart = 0;
        if (url.length > ssi + 2 &&
            url.charAt(ssi + 1) === '/' &&
            url.charAt(ssi + 2) === '/') {
            pathStart = ssi + 3;
            while (pathStart < url.length) {
                if (this.isSeperator(url.charAt(pathStart))) {
                    break;
                }
                pathStart++;
            }
        } else {
            //path starts after scheme
            pathStart = ssi + 1;
        }

        //find end of path
        var pathEnd = pathStart;
        while (pathEnd < url.length) {
            if (this.isCharIn(url.charAt(pathEnd), "?#")) {
                break;
            }
            pathEnd++;
        }
        return url.substr(pathStart, pathEnd - pathStart);
    };

    UrlParser.prototype.isCharIn = function(char, string) {
        if (!string) {
            return false;
        }
        for (var i = 0; i < string.length; ++i) {
            if (char === string.charAt(i)) {
                return true;
            }
        }
        return false;
    };

    UrlParser.prototype.isSeperator = function(char) {
        var PATH_SEPERATOR = "/\\?#";
        return this.isCharIn(char, PATH_SEPERATOR);
    };


    ArkWindow.util = {
        fixurl: function(url, isHttp) {
            if (url == "local" || !url) {
                return url;
            }
            if (url.indexOf('miniapp://') == 0 || url.indexOf('res:') == 0 || ArkWindow.util.isLocalResUrl(url)) {
                return url;
            }
            if (url.indexOf('m.q.qq.com') == 0) {
                return "https://" + url;
            }
            if (url.indexOf('http:') == 0 || url.indexOf('https:') == 0) {
                return url;
            }
            if (isHttp) {
                return "http://" + url;
            } else {
                return "https://" + url;
            }
        },
        isLocalResUrl: function(url) {
            if (!url) {
                return false;
            }
            if (url && url.indexOf && url.indexOf('image/') == 0) {
                return true;
            } else {
                return false;
            }
        },
        createHttpRequest: function() {
            if (Net && Net.HttpRequest) {
                return Net.HttpRequest();
            }
            return Http.CreateHttpRequest();
        },
        httpDownload: function(url, callback) {
            var httpGet = ArkWindow.util.createHttpRequest();
            var httpStartTime = arkWeb.System.Tick();
            ArkWindow.console.log('start get resource ' + url + ' at ' + httpStartTime);
            httpGet.SetTimeout(5000);
            httpGet.AttachEvent("OnComplete", function(http) {
                var httpEndTime = arkWeb.System.Tick();
                ArkWindow.console.log('end get resource ' + url + ' at ' + httpEndTime);
                ArkWindow.console.log('get resource ' + url + ' cost: ' + (httpEndTime - httpStartTime));
                if (!http.IsSuccess()) {
                    callback({
                        code: http.GetStatusCode(),
                        msg: 'download url: ' + url + 'fail.'
                    });
                    return;
                } else {
                    callback(null, http.GetCachePath());
                }
            });
            httpGet.Get(url);
        },
        _setImageStyle: function(viewObject, view, url, width, height) {
            var viewRatio = view.width / view.height;
            var imageRatio = width / height;
            var anchors;
            var setWidth;
            var setHeight;
            var marginTop = 0;
            var marginLeft = 0;

            if (viewRatio > imageRatio) {
                // 容器的宽大于图片的宽，宽铺满，高度上下居中
                anchors = 5;
                setWidth = 0;
                setHeight = view.width / width * height;
                // marginTop = (view.height - setHeight) / 2;
            } else {
                // 高度铺满，宽居中
                anchors = 10;
                setHeight = 0;
                setWidth = width / height * view.height;
                // marginLeft = (view.width - setWidth) / 2;
            }

            ArkWindow.console.log(
                'setImageStyle anchor: ' +
                (view.anchors || anchors) +
                ', width: ' + setWidth +
                ', heihgt: ' + setHeight +
                ', url: ' + url
            );

            viewObject.SetAnchors(view.anchors || anchors);
            viewObject.SetSize(setWidth, setHeight);
            viewObject.SetMargin(marginLeft, marginTop, 0, 0);
            viewObject.SetValue(url);
        },
        _setImage: function(url, viewObject, view, isHttps, retryTime, callback) {
            retryTime -= 1;
            var imageUrl = ArkWindow.util.fixurl(url, isHttps);
            viewObject.AttachEvent('OnLoad', function(sender) {
                ArkWindow.console.log('viewObject OnLoad');

                viewObject.DetachEvent("OnError");
                viewObject.DetachEvent("OnLoad");

                callback();
            });

            var storageData = arkWeb.Storage.Load(imageUrl);
            var storagePath = storageData && storageData.path;

            ArkWindow.console.log('storage data:');
            ArkWindow.console.log(storageData);

            if (storagePath) {
                ArkWindow.console.log('use storage');
                viewObject.AttachEvent("OnError", function(sender) {
                    ArkWindow.console.log('viewObject OnError');
                    viewObject.DetachEvent("OnError");
                    viewObject.DetachEvent("OnLoad");
                    arkWeb.Storage.Save(imageUrl, {});
                    if (retryTime) {
                        ArkWindow.util._setImage(url, viewObject, view, isHttps, retryTime, callback);
                    } else {
                        callback({
                            code: -1,
                            msg: 'load netwrok image error'
                        });
                    }
                });

                ArkWindow.util._setImageStyle(viewObject, view, storagePath, storageData.width, storageData.height);
            } else {
                ArkWindow.util.httpDownload(imageUrl, function(err, path) {
                    if (err) {
                        if (retryTime) {
                            ArkWindow.util._setImage(url, viewObject, view, isHttps, retryTime, callback);
                        } else {
                            callback(err);
                        }
                    } else {
                        viewObject.AttachEvent("OnError", function(sender) {
                            viewObject.DetachEvent("OnError");
                            viewObject.DetachEvent("OnLoad");
                            arkWeb.Storage.Save(imageUrl, {});
                            if (retryTime) {
                                ArkWindow.util._setImage(url, viewObject, view, isHttps, retryTime, callback);
                            } else {
                                callback({
                                    code: -1,
                                    msg: 'load image error'
                                });
                            }
                        });

                        var img = UI.Image();
                        img.AttachEvent("OnError", function(sender) {
                            ArkWindow.console.log(url + ' OnError');

                            // 失败了只能设置默认宽高
                            ArkWindow.util._setImageStyle(viewObject, view, path, 250, 250);
                        });

                        img.AttachEvent("OnLoad", function(sender) {
                            ArkWindow.console.log(url + ' OnLoad');

                            var size = sender.GetSize();
                            ArkWindow.console.log('width: ' + size.width + ' height: ' + size.height);

                            arkWeb.Storage.Save(imageUrl, {
                                path: path,
                                width: size.width,
                                height: size.height
                            });

                            ArkWindow.util._setImageStyle(viewObject, view, path, size.width, size.height);
                        });

                        img.SetValue(path);
                    }
                });
            }
        },
        /*
            设置图片元素的图片链接
        */
        setImage: function(url, viewObject, view, callback) {
            callback = callback || function() {};

            if (ArkWindow.util.isLocalResUrl(url)) {
                ArkWindow.console.log('set local image: ' + url);
                viewObject.AttachEvent('OnLoad', function() {
                    viewObject.DetachEvent("OnError");
                    viewObject.DetachEvent("OnLoad");
                    callback();
                });
                viewObject.AttachEvent("OnError", function(sender) {
                    viewObject.DetachEvent("OnError");
                    viewObject.DetachEvent("OnLoad");
                    callback({
                        code: -1,
                        msg: 'load local image error'
                    });
                });
                viewObject.SetValue(url);
            } else {
                ArkWindow.console.log('set netwrok image: ' + url);
                //先用2次http，如果失败再用2次https
                ArkWindow.util._setImage(url, viewObject, view, false, 2, function(err) {
                    if (err) {
                        ArkWindow.util._setImage(url, viewObject, view, true, 2, function(err) {
                            callback(err);
                        });
                    } else {
                        callback();
                    }
                });
            }

        },
        isiOS: function() {
            return arkWeb.System.GetOS() == "iOS";
        },
        isAndroid: function() {
            return arkWeb.System.GetOS() == "Android";
        },
        isWindows: function() {
            return arkWeb.System.GetOS() == "Windows";
        },
        isMac: function() {
            return arkWeb.System.GetOS() == "Mac";
        },
        compareVersion: function(target, cmd) {
            var _compare = function(tokens1, tokens2, p) {
                if (!tokens1[p] && !tokens2[p]) {
                    return 0;
                }
                return ((tokens1[p] || 0) - (tokens2[p] || 0)) || _compare(tokens1, tokens2, p + 1);
            };
            if (arkWeb.QQ && arkWeb.QQ.GetVersion) {

                var r = _compare(arkWeb.QQ.GetVersion().split('.'), (target + '').split('.'), 0);
                r = r < 0 ? -1 : r > 0 ? 1 : 0;
                switch (cmd) {
                    case 'eq':
                        return r === 0;
                    case 'neq':
                        return r !== 0;
                    case 'lt':
                        return r < 0;
                    case 'nlt':
                        return r >= 0;
                    case 'gt':
                        return r > 0;
                    case 'ngt':
                        return r <= 0;
                    default:
                        return r;
                }
            } else {
                return false;
            }

        },
        /*
        检测当前QQ版本号是否低于指定版本号，现在支持iOS平台和Android平台
        iOSTargetVersionStr iOS需要判断的版本号，字符串，三位，传入格式如"8.0.0“
        androidTargetVersionStr android需要判断的版本号，字符串，三位，传入格式如”8.0.0“
        */
        isCurrentQQVersionBelowTargetVersion: function(iOSTargetVersionStr, androidTargetVersionStr) {
            if (ArkWindow.util.isiOS()) {
                return ArkWindow.util.compareVersion(iOSTargetVersionStr, 'lt');
            } else if (ArkWindow.util.isAndroid()) {
                return ArkWindow.util.compareVersion(androidTargetVersionStr, 'lt');
            } else {
                return false;
            }
        },
        getAvatar: function(uin, size, platform) {
            if (!uin) {
                return '';
            }
            size = size || 100;
            platform = platform || 'qq';
            if (platform != 'qq' || platform != 'qzone') {
                platform = 'qq';
            }
            if (platform == 'qq') {
                if (size != 40 || size != 100 || size != 140) {
                    size = 100;
                }
                return 'q.qlogo.cn/openurl/' + uin + '/' + uin + '/' + size + '?rf=qz_hybrid&c=' + ArkWindow.util.base62().encode('qz_hybrid@' + uin);
            } else if (platform == 'qzone') {
                if (size != 30 || size != 50 || size != 100) {
                    size = 100;
                }
                return 'qlogo' + (uin % 4 + 1) + '.store.qq.com/qzone/' + uin + '/' + uin + '/' + size;
            }

        },
        base62: function() {
            return {
                decode: function(a) {
                    return ArkWindow.util.base64().decode(a.replace(/ic/g, '/').replace(/ib/g, '+').replace(/ia/g, 'i'));
                },
                encode: function(a) {
                    return ArkWindow.util.base64().encode(a).replace(/[=i\+\/]/g, function(m) {
                        switch (m) {
                            case '=':
                                return '';
                            case 'i':
                                return 'ia';
                            case '+':
                                return 'ib';
                            case '/':
                                return 'ic';
                            default:
                                return '';
                        }
                    });
                }
            };
        },

        base64: function() {
            // constants
            var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            var b64tab = function(bin) {
                var t = {};
                for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
                return t;
            }(b64chars);
            var fromCharCode = String.fromCharCode;
            // encoder stuff
            var cb_utob = function(c) {
                if (c.length < 2) {
                    var cc = c.charCodeAt(0);
                    return cc < 0x80 ? c :
                        cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6)) +
                            fromCharCode(0x80 | (cc & 0x3f))) :
                        (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f)) +
                            fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) +
                            fromCharCode(0x80 | (cc & 0x3f)));
                } else {
                    var cc = 0x10000 +
                        (c.charCodeAt(0) - 0xD800) * 0x400 +
                        (c.charCodeAt(1) - 0xDC00);
                    return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07)) +
                        fromCharCode(0x80 | ((cc >>> 12) & 0x3f)) +
                        fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) +
                        fromCharCode(0x80 | (cc & 0x3f)));
                }
            };
            var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
            var utob = function(u) {
                return u.replace(re_utob, cb_utob);
            };
            var cb_encode = function(ccc) {
                var padlen = [0, 2, 1][ccc.length % 3],
                    ord = ccc.charCodeAt(0) << 16 |
                    ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8) |
                    ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
                    chars = [
                        b64chars.charAt(ord >>> 18),
                        b64chars.charAt((ord >>> 12) & 63),
                        padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
                        padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
                    ];
                return chars.join('');
            };
            var btoa = function(b) {
                return b.replace(/[\s\S]{1,3}/g, cb_encode);
            };
            var _encode = function(u) {
                return btoa(utob(u))
            };

            var encode = function(u, urisafe) {
                return !urisafe ?
                    _encode(u) :
                    _encode(u).replace(/[+\/]/g, function(m0) {
                        return m0 == '+' ? '.' : '*';
                    }).replace(/=/g, '');
            };
            var encodeURI = function(u) {
                return encode(u, true)
            };
            // decoder stuff
            var re_btou = new RegExp([
                '[\xC0-\xDF][\x80-\xBF]',
                '[\xE0-\xEF][\x80-\xBF]{2}',
                '[\xF0-\xF7][\x80-\xBF]{3}'
            ].join('|'), 'g');
            var cb_btou = function(cccc) {
                switch (cccc.length) {
                    case 4:
                        var cp = ((0x07 & cccc.charCodeAt(0)) << 18) |
                            ((0x3f & cccc.charCodeAt(1)) << 12) |
                            ((0x3f & cccc.charCodeAt(2)) << 6) |
                            (0x3f & cccc.charCodeAt(3)),
                            offset = cp - 0x10000;
                        return (fromCharCode((offset >>> 10) + 0xD800) +
                            fromCharCode((offset & 0x3FF) + 0xDC00));
                    case 3:
                        return fromCharCode(
                            ((0x0f & cccc.charCodeAt(0)) << 12) |
                            ((0x3f & cccc.charCodeAt(1)) << 6) |
                            (0x3f & cccc.charCodeAt(2))
                        );
                    default:
                        return fromCharCode(
                            ((0x1f & cccc.charCodeAt(0)) << 6) |
                            (0x3f & cccc.charCodeAt(1))
                        );
                }
            };
            var btou = function(b) {
                return b.replace(re_btou, cb_btou);
            };
            var cb_decode = function(cccc) {
                var len = cccc.length,
                    padlen = len % 4,
                    n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) |
                    (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) |
                    (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) |
                    (len > 3 ? b64tab[cccc.charAt(3)] : 0),
                    chars = [
                        fromCharCode(n >>> 16),
                        fromCharCode((n >>> 8) & 0xff),
                        fromCharCode(n & 0xff)
                    ];
                chars.length -= [0, 0, 2, 1][padlen];
                return chars.join('');
            };
            var atob = function(a) {
                return a.replace(/[\s\S]{1,4}/g, cb_decode);
            };
            var _decode = function(a) {
                return btou(atob(a))
            };
            var decode = function(a) {
                return _decode(
                    a.replace(/[\.\*]/g, function(m0) {
                        return m0 == '.' ? '+' : '/'
                    })
                    .replace(/[^A-Za-z0-9\+\/]/g, '')
                );
            };

            var Base64 = {
                atob: atob,
                btoa: btoa,
                fromBase64: decode,
                toBase64: encode,
                utob: utob,
                encode: encode, //这个方法是正宗的base64算法
                encodeURI: encodeURI, //这个是根据我们后台变种的base64算法
                btou: btou,
                decode: decode
            };

            return Base64;
        },
        Report: function(id, index, action) {
            if (arkWeb.QQ && arkWeb.QQ.Report) {
                arkWeb.QQ.Report(id, index, action);
            } else {
                ArkWindow.console.log('QQ does not have Report method');
            }
        },
        ReportEx: function(type, data) {
            if (arkWeb.QQ && arkWeb.QQ.ReportEx) {
                arkWeb.QQ.ReportEx(type, data);
            } else {
                ArkWindow.console.log('QQ does not have ReportEx method');
            }
        },
        /*获取小程序url，因为url涉及版本兼容问题，所以收归到一个统一的方法*/
        getMiniAppUrl: function(url, scene, view) {
            // 获取scene值，如果传进来了scene，优先用传进来的，如果没传，判断AIO类型，单聊用1007，群聊用1008
            var sceneValue = 1007;
            if (typeof scene == "number" || scene) {
                sceneValue = scene;
            } else if (arkWeb.QQ.GetContainerInfo) {
                var info = arkWeb.QQ.GetContainerInfo(view.GetRoot());
                if (info) {
                    var typeStr = info.ChatType;
                    if (typeStr) {
                        var type = parseInt(typeStr, 10);
                        if (type <= 2) {
                            sceneValue = 1007;
                        } else if (type > 2) {
                            sceneValue = 1008;
                        }
                    }
                }
            }


            // 8.1.0以上版本正式QQ 都用这个schema打开，这个schema仅在ark场景适用
            var jmpUrl = "miniapp://open/" + sceneValue + "?url=" + Net.UrlEncode(url);

            // 安卓800 ios803以下不支持小程序，打开兜底页
            if (ArkWindow.util.isCurrentQQVersionBelowTargetVersion("8.0.3", "8.0.0")) {
                ArkWindow.console.log('may be regular QQ but version not support miniapp');
                jmpUrl = "https://m.q.qq.com/update";
            }

            // QQ8.1.0版本开始改用schema打开，8.1.0版本以前用http url打开
            if (ArkWindow.util.isCurrentQQVersionBelowTargetVersion("8.1.0", "8.1.0")) {
                ArkWindow.console.log("may be regular QQ but version lower then 810, use http url");
                jmpUrl = url;
            }

            // QQ极速版版本号从4.0.0开始，由于ark没有方法判断是否极速版，所以暂时把5.0.0以下的当作极速版
            if (ArkWindow.util.isCurrentQQVersionBelowTargetVersion("5.0.0", "5.0.0")) {
                ArkWindow.console.log("may be quick QQ, can open miniapp");
                jmpUrl = url;
            }

            ArkWindow.console.log("opening miniapp, url: " + jmpUrl);

            return jmpUrl;
        },
        isExistBoldTitle: function(key, array) {
            var titleLen = 0;
            for (var i = 0, len = array.length; i < len; i++) {
                if (array[i].title === key) {
                    titleLen++;
                }
            }
            return titleLen;
        },
        toUrlParams: function(obj) {
            var arr = [];
            var k;
            for (k in obj) {
                if (obj.hasOwnProperty(k))
                    arr.push(encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]));
            }
            return arr.join("&");
        },
        extend: createAssigner(allKeys),
        extendOwn: createAssigner(keys),

        verifyDomain: function(url, domains) {
            if (!url) {
                return false;
            }
            if (!domains || domains.length === 0) {
                return true;
            }

            function verifyHost(host, pattern) {
                if (!pattern) {
                    return true;
                }
                if (!host) {
                    return false;
                }

                if (pattern.charAt(0) !== '*') {
                    // full match
                    return host === pattern;
                }

                // remove prefix '*'
                pattern = pattern.substr(1);
                if (pattern.length > host.length) {
                    return false;
                }
                host = host.substr(host.length - pattern.length);
                return host === pattern;
            }

            function verifyPath(path, pattern) {
                if (!pattern) {
                    return true;
                }
                if (!path) {
                    return false;
                }

                if (pattern.charAt(pattern.length - 1) !== '*') {
                    return path === pattern;
                }
                // remove suffix '*'
                pattern = pattern.substr(0, pattern.length - 1);
                if (pattern.length > path.length) {
                    return false;
                }
                return path.substr(0, pattern.length) === pattern;
            }

            function verify(parser, domain) {
                var index = domain.indexOf('/');
                var hostPattern = null;
                var pathPattern = null;
                if (index >= 0) {
                    hostPattern = domain.substr(0, index);
                    pathPattern = domain.substr(index);
                } else {
                    hostPattern = domain;
                    pathPattern = null;
                }
                return verifyHost(parser.authority, hostPattern) &&
                    verifyPath(parser.path, pathPattern);
            }

            var parser = new UrlParser(url);
            if (typeof(domains) === 'string') {
                return verify(parser, domains);
            } else {
                // is array
                if (domains.length === 0) {
                    return true;
                }
                for (var i in domains) {
                    if (domains.hasOwnProperty(i)) {
                        if (verify(parser, domains[i])) {
                            return true;
                        }
                    }
                }
                return false;
            }
        }

    };

    ArkWindow.createAssigner = createAssigner;
    ArkWindow.has = has;
    ArkWindow.isObject = isObject;
    ArkWindow.allKeys = allKeys;
    ArkWindow.keys = keys;
    ArkWindow.UrlParser = UrlParser;

    /**
     * 数据上报模块
     * 依赖 util.js
     */
    ArkWindow.report = {
        // 上报罗盘
        compass: function(data, table) {
            var http = Net.HttpRequest();
            var version = "";
            var os = arkWeb.System.GetOS();
            var uin = "";
            if (typeof arkWeb.QQ != "undefined" && arkWeb.QQ.GetVersion) {
                version = arkWeb.QQ.GetVersion();
            }
            if (typeof arkWeb.QQ != "undefined" && arkWeb.QQ.GetUIN) {
                uin = arkWeb.QQ.GetUIN();
            }
            var param = ArkWindow.util.extendOwn({
                uin: uin,
                touin: uin,
                appid: "",
                refer: "",
                actiontype: "",
                sub_actiontype: "",
                reserves_action: "",
                reserves2: "",
                reserves3: "",
                reserves4: "",
                device_platform: os,
                qqversion: version,
                timestamp: Date.now()
            }, data);

            ArkWindow.console.log("reportCompass Data");
            ArkWindow.console.log(param);

            var url = "https://h5.qzone.qq.com/report/compass/" + table + "?" + ArkWindow.util.toUrlParams(param);
            http.Get(url);
        }

    };

    var global$3 = ArkWindow;
    (function() {
        var appView = "baseView";
        global$3[appView] = {
            appView: appView,
            ViewModel: {
                New: function(view) {
                    ArkWindow.console.log(appView + " New");
                    var model = Object.create(this);
                    model.Initialize(view);
                    return model;
                },
                Initialize: function(view) {
                    ArkWindow.console.log(appView + " Initialize");
                    this.view = view;
                    // 兜底数据
                    this.metaData = {};
                    var viewSize = this.view.GetSize();
                    this.OnResize(viewSize.width, viewSize.height);
                    this.Update();
                },
                Deinitialize: function() {
                    ArkWindow.console.log(appView + " Deinitialize");
                },
                OnResize: function() {
                    ArkWindow.console.log(appView + " OnResize");
                    this.Update();
                },
                OnSetValue: function(sender, value) {
                    ArkWindow.console.log(appView + " OnSetValue");
                    this.metaData = value.albumData || this.metaData;
                    this.Update();

                    if (this.metaData.reportCompass) {
                        ArkWindow.report.compass({
                            actiontype: this.metaData.reportCompass.actiontype,
                            subactiontype: this.metaData.reportCompass.subactiontype,
                            reserves: this.metaData.reportCompass.reserves.expose
                        }, this.metaData.reportCompass.table);
                    }
                },
                Update: function() {
                    this.refviews = {};
                    ArkWindow.console.log(appView + " Update");

                    if (this.view.hasUpdate) {
                        return
                    }

                    if (!this.metaData.title) {
                        ArkWindow.console.log(appView + " metaData invaild");
                        return
                    }

                    this.view.hasUpdate = true;

                    // 适配主题
                    this.OnConfigChange();

                    // 调整视图
                    var pics = this.metaData.pics;
                    var count = this.metaData.count;

                    var titleNode = this.view.GetUIObject("js-title");
                    // var subTitleNode = this.view.GetUIObject("js-sub-title");
                    var singlePhotoWrapNode = this.view.GetUIObject("js-single-photo-wrap");
                    var singlePhotoViewNode = this.view.GetUIObject("js-single-photo-view");
                    var singlePhotoNode = this.view.GetUIObject("js-single-photo");
                    var singlePhotoPlayIconNode = this.view.GetUIObject("single-photo-play-icon");

                    var singleMaskNode = this.view.GetUIObject("js-single-mask");
                    var singleImageCountContainerNode = this.view.GetUIObject("js-single-image-count-container");
                    var singleImageCountNode = this.view.GetUIObject("js-single-image-count");
                    /* 正则替换一下，老版本后台下发的 title 是 《群新建相册》新增1个影像
                     * 改为 上传了1张新照片
                     *     群相册：《群新建相册》
                     *
                     * 仅照片时展示照片
                     * 仅视频时展示视频
                     * 都有时展示 照片/视频
                     */

                    var titleReg = this.metaData.title.match(/《([^》]*)》/);
                    var albumName = titleReg && titleReg[0];

                    // 仅照片时为张，其他都为个
                    var quantifier = '';
                    var pics0IsVideo = pics[0] && pics[0].isVideo;
                    var pics1IsVideo = pics[1] && pics[1].isVideo;
                    var viewWidth = this.view.GetSize().width - 24; // share-container padding-left + padding-right
                    var viewHeight = singlePhotoViewNode.GetSize().height;

                    // 后台只给了前两个的数据，大于两个之后的数据不知道是视频还是图片
                    if (count > 0 && count <= 2) {
                        if (!pics0IsVideo && !pics1IsVideo) {
                            quantifier = count + '张照片';
                        } else if (pics0IsVideo && pics1IsVideo) {
                            quantifier = count + '个视频';
                        } else {
                            quantifier = count + '个照片/视频';
                        }
                    } else {
                        quantifier = count + '个照片/视频';
                    }

                    titleNode.SetValue("上传了" + quantifier + "\n" + "群相册:" + albumName);
                    // subTitleNode.SetValue("群相册:" + albumName);

                    singlePhotoWrapNode.SetVisible(true);
                    singlePhotoWrapNode.SetStyle('share-image-single');
                    singlePhotoViewNode.SetVisible(true);

                    viewHeight = singlePhotoViewNode.GetSize().height || viewHeight;

                    // 设置图片链接
                    ArkWindow.util.setImage(pics[0].url, singlePhotoNode, {
                        width: viewWidth,
                        height: viewHeight
                    }, function() {
                        // 播放按钮
                        if (pics0IsVideo) {
                            singlePhotoPlayIconNode.SetVisible(true);
                        }
                    });

                    if (this.metaData.total && this.metaData.total > 0) {
                        singleMaskNode.SetVisible(true);
                        singleImageCountContainerNode.SetVisible(true);
                        singleImageCountNode.SetVisible(true);
                        singleImageCountNode.SetValue(this.metaData.total + '个影像');
                    } else {
                        singleMaskNode.SetVisible(false);
                        singleImageCountContainerNode.SetVisible(false);
                        singleImageCountNode.SetVisible(false);
                    }
                },
                OnClick: function(sender, x, y, button, keyState) {
                    // 点击事件
                    ArkWindow.console.log(appView + " OnClick");

                    var h5Url = ArkWindow.util.fixurl(this.metaData.h5Url);

                    if (ArkWindow.util.isAndroid() || ArkWindow.util.isiOS()) {
                        h5Url = ArkWindow.util.fixurl(this.metaData.h5UrlMobile);
                    } else {
                        var clientkey = '';
                        var clientuin = '';
                        if (arkWeb.QQ && arkWeb.QQ.GetClientKey) {
                            clientkey = 'clientkey=' + arkWeb.QQ.GetClientKey();
                            clientuin = '&clientuin=' + arkWeb.QQ.GetUIN();
                        }

                        h5Url += ((h5Url.indexOf('?') === -1) ? '?' : '&') + clientkey + clientuin;

                        var isvalid = ArkWindow.util.verifyDomain(h5Url, '*.qzone.qq.com');
                        ArkWindow.console.log('h5url is valid: ' + isvalid);
                        if (!isvalid) {
                            h5Url = '';
                        }
                    }

                    if (h5Url) {
                        ArkWindow.console.log("OpenUrl: " + h5Url);
                        arkWeb.QQ.OpenUrl(h5Url);
                    }

                    if (this.metaData.reportCompass) {
                        ArkWindow.console.log("reportCompass Data");
                        ArkWindow.report.compass({
                            actiontype: this.metaData.reportCompass.actiontype,
                            subactiontype: this.metaData.reportCompass.subactiontype,
                            reserves: this.metaData.reportCompass.reserves.click
                        }, this.metaData.reportCompass.table);
                    }
                },
                OnConfigChange() {
                    var view = this.view;
                    var themeConfig = global$3.getThemeConfig(view);
                    var bgTexture = this.view.GetTexture('bgColor');
                    bgTexture.SetValue(themeConfig.THEME_COLOR_BACKGROUND);
                    var jsTitle = this.view.GetUIObject('js-title');
                    var jsDesc = this.view.GetUIObject('js-desc');
                    var title = this.view.GetUIObject('js-app-name');

                    title.SetTextColor(themeConfig.THEME_COLOR_SOURCE);
                    jsDesc.SetTextColor(themeConfig.THEME_COLOR_TITLE);
                    jsTitle.SetTextColor(themeConfig.THEME_COLOR_TITLE);

                    this.refviews.bgTexture = bgTexture;
                    this.refviews.title = title;
                    this.refviews.jsDesc = jsDesc;
                    this.refviews.jsTitle = jsTitle;
                }
            }
        };
    })();

    var global$2 = ArkWindow;
    (function(global) {

        var isAndroid = function() {
            if (arkWeb.System) {
                return arkWeb.System.GetOS() == "Android";
            }
            return false;
        };

        var isChannel = function(view) {
            var view = view;
            var rootView = view.GetRoot();
            var containerInfo = {
                ChatType: -1
            };
            if (typeof arkWeb.QQ.GetContainerInfo === 'function') {
                containerInfo = arkWeb.QQ.GetContainerInfo(rootView);
            }
            var chatType = containerInfo.ChatType;
            ArkWindow.console.error('chatType', chatType);
            if (chatType == 7) {
                return true;
            }
            return false;
        };

        var isPreview = function(view) {
            var rootView = view.GetRoot();
            var containerInfo = {
                ChatType: -1
            };
            if (typeof arkWeb.QQ.GetContainerInfo === 'function') {
                containerInfo = arkWeb.QQ.GetContainerInfo(rootView);
            }
            var chatType = containerInfo.ChatType;
            if (!chatType || chatType == -1) {
                ArkWindow.console.error('isPreview', true);
                return true;
            }
            return false;
        };

        var getAvatar = function(guildId) {
            return 'https://groupprohead-76292.picgzc.qpic.cn/' + guildId + '/140?t=' + Math.random();
        };

        var resetWidth = function(width) {
            ArkWindow.console.error('resetWidth:' + width);
            return Math.floor(width * 96 / 100);
        };

        global.isPreview = isPreview;
        global.isChannel = isChannel;
        global.isAndroid = isAndroid;
        global.getAvatar = getAvatar;
        global.resetWidth = resetWidth;
    })(global$2);

    var global$1 = ArkWindow;

    (function(global) {
        var COLOR_LIGHT_BLUE = 0xFF0099FF;

        var COLOR_GRAY_GUILD = 0x0B485560;
        var COLOR_GUILD_TITLE = 0xFF222222;
        var COLOR_GUILD_SUMMARY = 0xFFB2B2B2;

        var COLOR_SCHEME_DEFAULT = {
            name: 'COLOR_SCHEME_DEFAULT',
            THEME_COLOR_BACKGROUND: 0xFFFFFFFF,
            THEME_COLOR_TITLE: 0xFF03081A,
            THEME_COLOR_SUMMARY: 0xFF878B99,
            THEME_COLOR_SOURCE: 0xFF878B99,
            THEME_COLOR_TAG: 0xFFFFFFFF,
            THEME_COLOR_TAG_BACKGROUND: 0x21000000,
            THEME_COLOR_SEPERATOR: 0x7FE5E5E5,
        };

        // default night
        var COLOR_SCHEME_NIGHT = {
            name: 'COLOR_SCHEME_NIGHT',
            THEME_COLOR_BACKGROUND: 0xFF1F1F1F,
            THEME_COLOR_TITLE: 0xFFFFFFFF,
            THEME_COLOR_SUMMARY: 0xFF8D8D93,
            THEME_COLOR_SOURCE: 0xFF8D8D93,
            THEME_COLOR_TAG: 0xFF8D8D93,
            THEME_COLOR_TAG_BACKGROUND: 0x21FFFFFF,
            THEME_COLOR_SEPERATOR: 0X7F1A1A1A,
        };

        var COLOR_SCHEME_CONCISE_WHITE = {
            name: 'COLOR_SCHEME_CONCISE_WHITE',
            THEME_COLOR_BACKGROUND: 0xFFFFFFFF,
            THEME_COLOR_TITLE: 0xFF000000,
            THEME_COLOR_SUMMARY: 0xFF999999,
            THEME_COLOR_SOURCE: 0xFF999999,
            THEME_COLOR_TAG: 0xFFFFFFFF,
            THEME_COLOR_TAG_BACKGROUND: 0x21000000,
            THEME_COLOR_SEPERATOR: 0x7FE5E5E5,
        };

        // concise night
        var COLOR_SCHEME_CONCISE_NIGHT = {
            name: 'COLOR_SCHEME_CONCISE_NIGHT',
            THEME_COLOR_BACKGROUND: 0xFF262626,
            THEME_COLOR_TITLE: 0xFFFFFFFF,
            THEME_COLOR_SUMMARY: 0xFF999999,
            THEME_COLOR_SOURCE: 0xFF999999,
            THEME_COLOR_TAG: 0xFF999999,
            THEME_COLOR_TAG_BACKGROUND: 0x21FFFFFF,
            THEME_COLOR_SEPERATOR: 0X7F1A1A1A,
        };

        var COLOR_SCHEME_GUILD = {
            name: 'COLOR_SCHEME_GUILD',
            THEME_COLOR_BACKGROUND: COLOR_GRAY_GUILD,
            THEME_COLOR_BOTTOM: 0,
            THEME_COLOR_BORDER: COLOR_LIGHT_BLUE,
            THEME_COLOR_TITLE: COLOR_GUILD_TITLE,
            THEME_COLOR_SUMMARY: COLOR_GUILD_SUMMARY,
            THEME_COLOR_SOURCE: COLOR_GUILD_SUMMARY,
        };

        // 频道夜间模式
        var COLOR_SCHEME_GUILD_NIGHT = {
            name: 'COLOR_SCHEME_GUILD_NIGHT',
            THEME_COLOR_BACKGROUND: 0xFF2D2D35,
            THEME_COLOR_BOTTOM: 0xFF2D2D35,
            THEME_COLOR_BORDER: COLOR_LIGHT_BLUE,
            THEME_COLOR_TITLE: 0xFFE8E9EA,
            THEME_COLOR_SUMMARY: 0xFF838387,
            THEME_COLOR_SOURCE: 0xFF838387,
        };

        var getDarkColorModel = function(config) {
            var themeConfig = config;
            if (themeConfig) {
                var themeId = themeConfig.theme.themeId;
                if (themeId === '1102' || themeId === '2920' || themeId === '1103' || themeId === 1102 || themeId === 2920 || themeId === 1103) {
                    return true;
                }
                return false;
            }
            return false;
        };
        var getEasyModel = function(config) {
            var themeConfig = config;
            if (themeConfig && themeConfig.theme) {
                var model = themeConfig.theme.mode;
                if (model === 'concise') {
                    return true;
                }
                return false;
            }
            return false;
        };

        var getThemeConfig = function(view) {
            var config = ArkWindow.app.config;
            if (global.isChannel(view)) {
                if (getDarkColorModel(config)) {
                    return COLOR_SCHEME_GUILD_NIGHT;
                }
                return COLOR_SCHEME_GUILD;
            }

            if (getEasyModel(config)) {
                if (getDarkColorModel(config)) {
                    return COLOR_SCHEME_CONCISE_NIGHT;
                }
                return COLOR_SCHEME_CONCISE_WHITE;
            }

            if (getDarkColorModel(config)) {
                return COLOR_SCHEME_NIGHT;
            }
            return COLOR_SCHEME_DEFAULT;
        };

        global.getDarkColorModel = getDarkColorModel;
        global.getEasyModel = getEasyModel;
        global.getThemeConfig = getThemeConfig;
    })(global$1);

    var global = ArkWindow;

    ArkWindow.app = {
        viewModels: new Map(),
        config: {},
        GetModel: function(view) {
            ArkWindow.console.log('app GetModel');
            var viewRoot = view.GetRoot();
            return ArkWindow.app.viewModels.get(viewRoot);
        },
        OnCreateView: function(view, template) {
            ArkWindow.console.log('app OnCreateView: ' + template);

            var viewRoot = view.GetRoot();

            if (global[template] && global[template].ViewModel && global[template].ViewModel.New) {
                ArkWindow.app.viewModels.set(view, global[template].ViewModel.New(viewRoot));
            } else {
                // 统一模版
                ArkWindow.app.viewModels.set(view, global.baseView.ViewModel.New(viewRoot));
            }
        },
        OnDestroyView: function(view, template) {
            ArkWindow.console.log('app OnDestroyView');
            var model = ArkWindow.app.GetModel(view);
            model.Deinitialize();
            ArkWindow.app.viewModels.delete(view);
        },
        OnResize: function(sender, srcWidth, srcHeight, dstWidth, dstHeight) {
            ArkWindow.console.log('app OnResize');
            var model = ArkWindow.app.GetModel(sender);

            if (model) {
                model.width = dstWidth;
                model.height = dstHeight;
                model.OnResize && model.OnResize(sender, srcWidth, srcHeight, dstWidth, dstHeight);
            }
        },
        OnSetValue: function(sender, value) {
            ArkWindow.console.warn('app OnSetValue');
            ArkWindow.console.warn(value);
            var model = ArkWindow.app.GetModel(sender);
            model && model.OnSetValue && model.OnSetValue(sender, value);
        },
        OnClick: function(sender, x, y, button, keyState) {
            ArkWindow.console.log('app OnClick');
            var model = ArkWindow.app.GetModel(sender);
            model && model.OnClick && model.OnClick(sender, x, y, button, keyState);
        },
        OnStartup: function(config) {
            ArkWindow.console.log('app OnStartup');
            ArkWindow.app.config = config;
        },
        OnConfigChange: function(config) {
            ArkWindow.console.log('app OnConfigChange');
            ArkWindow.app.config = config || ArkWindow.app.config;
            ArkWindow.app.viewModels.forEach(function(a, view) {
                var model = ArkWindow.app.GetModel(view);
                model && model.OnConfigChange && model.OnConfigChange(ArkWindow.app.config);
            });
        }
    };

    const uniqueApplicationId = (function() {
      function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      }
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    })();

    /**
     * 有很多地方会用到这里数据.所以这里最好还是挂载到app上.
     * @returns
     * @update 2022-07-30 22:47:10
     * @author alawnxu
     * @description 这里之前挂载app上.不过后面发现不可行.因为在Ark视图里面有注册了很多事件.这些事件的会直接调用里面声明的全局方法.这个时候就有可能不是在某一个对象上了.
     */
     ArkWindow.getExtendObject = function () {
      var appKey = '76b2ac86c9c9689899c413b9bebedbf8';
     

      return {
        appid: 'com.tencent.groupphoto',
        appKey,
        images: [{"name":"images/album-group.png","url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTYzM0QxMDBGNEEwMTFFOTg5NEM5RUQxMzYwOTEzRDAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTYzM0QxMDFGNEEwMTFFOTg5NEM5RUQxMzYwOTEzRDAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxOTM5ODlGNUYzMDgxMUU5ODk0QzlFRDEzNjA5MTNEMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxOTM5ODlGNkYzMDgxMUU5ODk0QzlFRDEzNjA5MTNEMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoQ/u3IAAASLSURBVHja7FddaBxVGD13dneyiVll0yptam1DaWoNMQgi/lUrUh+Sl4KQB4VtAwqKDyolbVAb14LaYkqpUXxQLATxoYKPPvsmiBWlNrbBUkWU+Fearmmdn3s/v/szM7tN2yRNUytk4O795s6dueeec75vZgUR4Xo6PFxnxxKg/x2gfBIIIRZ1ITpW9fHL2T0IwgqiEJDxGOi2YdFfDc11l1z5a7b1n6f2IAx3Ieb14wgMiuPv9JWh/0ayIKgYMJqdMLAtiiuXlGzRD8mshJodB0qzFIdYMCDW2vvwLez0BB5k2T8fGMR+9t/s1TWKxhAFmWQanJRjCwb0/l68wbB2Kc4BT4i+QyNo4+GXZr1RrB1GfJSBRBXDlgazojw8Y1ri7rlk2bv7aGNO4lsGVNCzPaZJeIj8AnoqL4rvF5SFDse8TE0BDkqpCkoSFOlNkm4FZv/gNS+Mo1XaqpTaolgrRdwUDCgl2RKStnywj7bO2MDJ8k00kdtOP7asnOs6c5LsUJWKU4rGeYkOGO/Y+drLRjZ7/6mmdtwxMCD+MWCOLy9BnT7CW17PZz9h2bJucfOftasi2ekYg7FUHZoRfV/KDvfSNC0hdYS/YjBL87O7ocR6SIZL3hr8dWb3VWFo/8u0OiZ1XIBaPD1Hs6LZAbGhBZIxY3IhzjXfIG4feLTYDCGP8qCvr5nmIURToVusCyYux9CsaR/EasQT1EIWvgGuXC+YHTIAdW+mt5w/hxF+eivj9R1K+yDF54E8wFHfFZv6zSHarKTq17Io5TKLf2QqGVn50ka4te2zfsTUC8WP1sVKwvYmpl4az/VeEaDDhykXhfHbNqOIN20zi1TiIwuGHEgdQ0TYtHGn9oxmxNKmWxJbYAfoWJc/b0DjX6hneaHuehakqz/1sXTMaWA9q99BufkHC6ChGXZ4kjY7OqFOPD8vU1d30PI4khNs3DJXYpfWtpk01zGcj9xYa9MkntrcA7/wt9sm2V7AmZqyOCdqyPmdomt6ck5pHwbR6+ydspWCUv8YqWx1RiJlUrE3db4K35u2jEhcnKWULZT45bp3TgwNPRPeRZ74ihnwUlYsJbYQOlaSwqj7VeUj2H7fI/q9ZplItpqmvKiLHXs5nYf5e0XX+S8vy5AkMcrvKy/xikoKnzY2706mnsr6xzYM8lqOAVMI65hJx5FlnR6TvJMgHiUicUlT73g6eJIr8gOJNAZUQ3WuS3Nn6DtXfoxVN36dpXaaTXXpnoxT3bkFfw++8bddVLLXnkPrmSA8wdK06zosnETGh55ITew5k+ufoj+NFx66G6Xi75kkqYnrZUPjeIOUmESp1IkNf9QaGJoKosd5vXaQ1TOVJGVHZAw51h5eN4KS/1sjG4aJC4viBTWpniVFK1CrPTHzb5AHXy8knAWs0Wyz5rXmli6+pXQS9695z91AlgKV8o70tZE+NGUkYye9ln0CpwytLRb09+2nfDEULhEgMoDG3GQrtq7WfV2vIJ+LMjDkipVyDDX4xY3p4tjgM/5UIfEJ8m0fzfDQ0l/pJUBLgBbp+FeAAQB4itotsAiWJwAAAABJRU5ErkJggg=="},{"name":"images/album.png","url":"data:image/png;base64,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"},{"name":"images/blank-delete.png","url":"https://ark-release-1251316161.file.myqcloud.com/com.tencent.groupphoto/images/blank-delete.png"},{"name":"images/blank-nodata.png","url":"https://ark-release-1251316161.file.myqcloud.com/com.tencent.groupphoto/images/blank-nodata.png"},{"name":"images/blog.png","url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAAGWB6gOAAAABGdBTUEAALGPC/xhBQAABXFJREFUWAnNmD2IZEUQx+vN164iaiTCXXB6BoKg4kWXqFygqR8IamTgF2dkaqKBgWJ8sqAYnAiCKBhoIAYiJhrJiieCXCCCyH3t3d7s7Ox8tL9/dfe8eTNv3t15h2yx73V3dXX1v6qr6vVsESBboJaPP77T7LfCxs+87sPIPL9utteyzqsnnNnx97k1sxHdm6NMUadziRllTxcWjr9n9uMRixKn0HMWraOuRQl2s3WYRZEkfMv4WlJqNgXfHrO0nZ5Zi5WC47RxIITfWyFsFmH4+Ath8NBjIXx30KcQS3QeY4bsOQnWe/sTFBVmfR6oFDqHG87CnPBIQG0R8dZgSprnmig6x7Dp2Gz3stlY4COVQic5ij8YbvZs8sq7eOsmtmUBVAoNgCccu5zZ6VMR9BQ3QCVwCY0Roll780uzHutbUUcptNNGkyaIjNuSdXJkrSYJTpjR1olKTQM0baFlzCM/jbII7pLfy2F976qE6pdWuSWkzP/iMOeMwx99gggB1wTHD4dmG8foj23a37bWa9+Y3fKs2eGXWbXopaxoa0APO/sfYCNd2biNyX8dsjC4bAFFvTM/wPvb7K4Xa9ydFelsRDqfILfjHv7aT25YsTaw0bcHmIQ/VH6UtGyazk+Uo1NuXiN9Du2CsGXd50FCOtmgP0Mj8WVFu7C0eIztanWEQiZXSEHm0c3+UW9ZUR9EWqBAcSULbQzTiFgaEt2w449nl9VeR7v/EC07e9E8VQoVgtwqlTs8nvelZ6qKfn6D6v8h6fE0x0xIB9JDhfXEI/SDhd0dK176iui81ey+zxviaPMj8LDLYCPFC0P0hNFRT43pzrZ1tr6nEhFMY5D2ShxlTyYpCEWKlZwepMr0whkLKFHC2o5HYjTVheNrhSJFcBmUFUUqrppLBTTrqioaabekRKkgoi3u/cm6D/9idgnxrmRgpiLrMrwWFC2YJmWkS+cplFDObZ286dBKLBXiekU5UR06C6auKW7HN8NzTys1rxCYo+poxFZaq2R1h6ukyAzG/DlPfCV0o2kZkYQrmY8WbeD+05z6yQ3qQlVEe9qWx9HQnSmj7+bm1rUyKKmqaJyqoyvIChMaV554ml+gqqI20kNYF5HSp8wX0wqNQOgRb0+dKu2/MlJ1fRXtNY1umGnXtGuDcPXQGgSbp3SSiRaKQmZXE2G1Q68TEEC8mqdWF0ZVdtXODEwZ6RWerfwWzFg8z9RlYM2APrubEOam4ERoH/0ndnNUyzH50d3n5PsOJIwAxhNGQz4eQ2sffyemtGS7x8zu5+shWigfYjUD6uvChRXKz5xnGYxXAgZKXuUdgKaXLuAdAeEBiIMSoG1k+IlgbeQmXInkxZYYy9QMKH+ZKiCkhA28MNDmm49OiS+WAE0TGAFSv8v1zI3ydTvxSFXul0/sCh7yD9M8APq5KmVQs5oJNgAVYWDtI79acftF2/v6HgtbrFG1lwECz3wZQ9JdpWYP6XPipslFKPXaqjaPYWfvUZ7X3vqU0goPb+kWu/4AHmsjr9KtLyp/NsFDNbHDjFMzIH0EZJl+tOUjUuve0foEzj3AsMsjAALklNZpXqSlExDnbHNm9dUMKN8lfA3KlSU6IgeUXONgxWIsMHKqrgUum8BnA9yzzP93D8nCuH/MMjbS2B8BUz/xdLUXqRUYDTNY8Z1gupxQ19MVPLSw0L/foBGgbHVT34EnWTXykMtrUE9XB0jWSlE+MlcKcz6eMk8yTsxX+gi4QVK2mpoB6YfjLF7oK1hzhlXAsJnHFvMzvnjaWMDSGfqVy5maqKVmQA8e5H8Wf8ZbkvScnTvCmV6B1oDWwayQkYjS/47neK2mfXf9mDNnNer/c2bfAfoXzrh/QUOxNukAAAAASUVORK5CYII="},{"name":"images/dynamic.png","url":"data:image/png;base64,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"},{"name":"images/feed.png","url":"data:image/png;base64,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"},{"name":"images/icon-album.png","url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAYJJREFUSA3tlrFKA0EQhnOiKFik0BcQgmCjoKXYWdsJ+gr2voRlaus8QjpB0qjgC1ilsrCz1ajnN7c3sDs3p+dxCEoG/szOv//8c9lLcun15vGvTiDP8wGYgBnoIsRH/AbuQZWbXQyyHhMdmOlCMqoZaTHmOlq/ZVm2JF52YN7RgIoNA4tZC5Wd9sQtrRtgD7w0srEH/8P6VIfQd2V7da/tO/SO/pgh60A+kds6wOY29/ACk2swtmZf1XoPE409Bqd+gFuRJvLY2a+lkkFa1KrDxgdpP9JuUesPhAyv3LfQFl61L8mxwFkPEzEFmiF4AmtgE7wCN2xvUbvKQE5Jq7YJrg92lGctF+CGapLsKgN5mAhrCqTyTp89H7fFE8JduuIaEv255+PKHeEjXN8V15Dol8EUJOHKE0UojlzhNyStJ9bLbTGikStqQOKTgbvYz21DoN8r0e66ooYk/WdiUoY89oqwz74b2INy7x7xe7luk2Jv8a0GA373L0b1EubMHziBT4MMq36WRI7yAAAAAElFTkSuQmCC"},{"name":"images/icon-user.png","url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAXJJREFUSA3tljFKA0EYhbMxxijYGeuEtDGFhVgKdirewBvYGXsPkcobaOEBFCxFFBENNh7AQgTTCClC1u8PrKzDsvNmiY1k4GNnZ968t7OZnUmp9N9LFDrBOI6XGNOBAbxGUTQO9ZD0BC3DKYwgKR9UDiSDEBGmFbhPUjKuxyF+Xi0B3YyQdNOQm6bXCEFZEaHZ8egW6N/2aCbdauCaYNYWNPIM5wWzqqCRA0eCmaKRA1+EQEUjB156Am121x6N3s2Sr0I//R049RPdTVQSsAJnTtAX94cgb5GyMHkuzFepr8MnPLGXDpO+P7sSWoO5IgHeGWJs39ce7MIm2Ba2CDHYidGHGzhnto9cixULgiOwE0Etdwi3ghMZ1IRnNSVD16OtIgUjbMB7hklo0wUD8n8yE8BDqHOOvps7Swbu5wwu0mVvyhbYT3GPJ1uJ0yx1zDbShm5gK905pfovT3clXRFi/8iks014oDc0t4JuJin+Br4Bt1E7J/VYLhUAAAAASUVORK5CYII="},{"name":"images/mask.png","url":"data:image/png;base64,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"},{"name":"images/play.png","url":"https://ark-release-1251316161.file.myqcloud.com/com.tencent.groupphoto/images/play.png"},{"name":"images/qzone-logo.png","url":"data:image/png;base64,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"}],
        fonts: {"size.12":{"fontFamily":"Helvetica,sans-serif,Microsoft YaHei","size":12,"bold":false},"bold.12":{"fontFamily":"Helvetica,sans-serif,Microsoft YaHei","size":12,"bold":true},"size.14":{"fontFamily":"Helvetica,sans-serif,Microsoft YaHei","size":14,"bold":false},"size.17":{"fontFamily":"Helvetica,sans-serif,Microsoft YaHei","size":17,"bold":false},"bold.17":{"fontFamily":"Helvetica,sans-serif,Microsoft YaHei","size":17,"bold":true},"size.30":{"fontFamily":"Helvetica,sans-serif,Microsoft YaHei","size":30,"bold":false},"size.40":{"fontFamily":"Helvetica,sans-serif,Microsoft YaHei","size":40,"bold":false},"size.50":{"fontFamily":"Helvetica,sans-serif,Microsoft YaHei","size":50,"bold":false}},
        appVersion: "1.0.0.49",
        buildVersion: "20220922180424",
        styles: {"text":{"flexGrow":"1"},"share-container":{"display":"flex","flexDirection":"column","width":"248","height":"auto","maxHeight":"1200","padding":"10 12 0 12"},"share-app":{"display":"flex","alignItems":"center"},"share-app-icon":{"width":"18","height":"18","flexShrink":"0","marginRight":"2"},"share-app-name":{"flex":"1"},"share-main":{"display":"flex","flexDirection":"column"},"share-event":{"display":"flex","marginTop":"6","height":"auto","maxHeight":"50"},"share-text":{"display":"flex","marginTop":"6","height":"auto","maxHeight":"51"},"share-image-single":{"display":"flex","margin":"3 0 12 0","height":"182"},"share-image-multi":{"position":"relative","display":"flex","margin":"3 0 12 0","height":"182"},"image-item":{"flex":"1"},"image-mask":{"position":"absolute","left":"0","right":"0","bottom":"0","height":"25"},"image-more":{"position":"absolute","right":"6","bottom":"6"},"image-count":{"display":"flex","position":"absolute","right":"8","bottom":"5"},"image-count-item":{"display":"flex","flex":"1","alignItems":"center"},"item-icon":{"display":"none","width":"14","height":"14","marginRight":"3"},"item-text":{},"share-video":{"position":"relative","display":"flex","alignItems":"center","height":"128","marginTop":"6"},"video-src":{"width":"100%","height":"128"},"video-play":{"position":"absolute","top":"0","left":"0","right":"0","bottom":"0","display":"flex","alignItems":"center","justifyContent":"center"},"icon-play":{"width":"50","height":"50"},"share-action":{"display":"flex","alignItems":"center","justifyContent":"center","height":"50"},"share-app-foot":{"display":"flex","alignItems":"center","height":"30"},"split-line":{"display":"block","height":".5"}},
        applicationEvents: [{"eventName":"OnCreateView","callback":"app.OnCreateView"},{"eventName":"OnDestroyView","callback":"app.OnDestroyView"},{"eventName":"OnStartup","callback":"app.OnStartup"},{"eventName":"OnConfigChange","callback":"app.OnConfigChange"}],
        applicationId: appKey + '_' + uniqueApplicationId,
        urlWhiteList: [".qq.com",".gtimg.cn",".qpic.cn",".qlogo.cn","h5.qzone.qq.com",".gtimg.com"]
      };
    };

    /**
     * 释放资源
     * @description 使用_命名,防止被重写
     */
    ArkWindow._destroyResource_ = function () {
      ArkGlobalContext.clearTemplates();
    };

    function createApp(options) {
      const templates = ArkGlobalContext.getViewTemplates();
      return new arkWeb.WebARKView({
        /**
         * 这里之前是导出的唯一的对象.不过后面发现不可行.因为在Ark视图里面有注册了很多事件.这些事件的会直接调用里面声明的全局方法.这个时候就有可能不是在某一个对象上了.
         * @author alawnxu
         * @date 2022-07-30 22:41:12
         * @see
         * com.tencent.qq_vip_collect_card_template
         * <Event>
         *  <OnSetValue value="gameLogic.OnSetData" />
         * </Event>
         * 
         * 而游戏中心的大部分都是:
         * com.tencent.gamecenter.gshare
         * <Event>
         *  <OnSetValue value="Vark.onSetMetaData" />
         * </Event>
         * 
         * 还有多个的:
         * com.tencent.mobileqq.reading
         * <OnSetValue value="bookUpdate.OnSetMetadata" name="OnSetValue"></OnSetValue>
         * <OnSetValue value="accountChange.OnSetMetadata" name="OnSetValue"></OnSetValue>
         * 
         * 而根据不同的模板调用不同的初始化方法在正常不过.所以这里统一导出ArkWindow
         */
        app: ArkWindow,
        templates,
        ...(options || {}),
      });
    }

    return createApp;

}));
