(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tencent/yoga-dom-layout'), require('wasmoon')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tencent/yoga-dom-layout', 'wasmoon'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.WebArk = {}, global.Yoga, global.wasmoon));
})(this, (function (exports, Yoga, wasmoon) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var Yoga__default = /*#__PURE__*/_interopDefaultLegacy(Yoga);
    var wasmoon__namespace = /*#__PURE__*/_interopNamespace(wasmoon);

    /* eslint-disable no-bitwise */
    function argbToRGBA(argb) {
        var color = typeof argb === 'string' ? Number(argb) : argb;
        var alpha = (color >>> 24) & 0xff;
        var red = (color >> 16) & 0xff;
        var green = (color >> 8) & 0xff;
        var blue = color & 0xff;
        return {
            red: red,
            alpha: alpha,
            green: green,
            blue: blue,
        };
    }
    function numberToColor(num) {
        var color = num.toString(16);
        return (color.length === 1 ? "0".concat(color) : color).toUpperCase();
    }
    /**
     * ARGB转RGBA颜色
     * @param argb
     */
    function argbToRGBAColor(argb) {
        var _a = argbToRGBA(argb), red = _a.red, green = _a.green, blue = _a.blue, alpha = _a.alpha;
        return "rgba(".concat(red, ", ").concat(green, ", ").concat(blue, ", ").concat(alpha / 255, ")");
    }
    /**
     * ARGB转16进制字符串
     * @param argb
     * #0xF0FAFBFC => FAFBFCF0
     */
    function argbToColor(argb) {
        var _a = argbToRGBA(argb), red = _a.red, green = _a.green, blue = _a.blue, alpha = _a.alpha;
        return "#".concat(numberToColor(red)).concat(numberToColor(green)).concat(numberToColor(blue)).concat(numberToColor(alpha));
    }
    /**
     * RGBA转ARGB
     * @param red
     * @param green
     * @param blue
     * @param alpha
     */
    function rgbaToARGB(red, green, blue, alpha) {
        return ((alpha & 0xff) << 24) | ((red & 0xff) << 16) | ((green & 0xff) << 8) | (blue & 0xff);
    }

    /**
     * @fileoverview xss攻击
     * @author alawnxu
     * @date 2022-04-08 19:19:03
     */
    /**
     * 将字符串中的特殊字符转换为实体
     * @param {String} str 待转换字符串
     */
    function encodeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\x60/g, '&#96;')
            .replace(/\x27/g, '&#39;')
            .replace(/\x22/g, '&quot;');
    }
    /**
     * 将字符串中的实体转换为原字符
     * @param {String} str 待转换字符串
     */
    function decodeHtml(str) {
        return String(str)
            .replace(/&quot;/g, '\x22')
            .replace(/&#0*39;/g, '\x27')
            .replace(/&#0*96;/g, '\x60')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&amp;/g, '&');
    }

    /**
     * ARK的dom节点的虚拟dom id
     */
    var ARK_DOM_ID_ATTR = 'ark-dom-id';
    /**
     * 图片加载中
     */
    var ARK_IMAGE_LOADING_CLASS = 'ark-img-loading';
    /**
     * 最大行数
     */
    var ARK_MAXLINE_CLASS = 'ark-text-maxline';
    /**
     * 字体超出后显示省略号
     */
    var ARK_ELLIPSIS_CLASS = 'ark-ellipsis';
    /**
     * Texture属性ID
     */
    var ARK_TEXTURE_ATTR = 'data-texture';
    /**
     * loading样式
     */
    var ARK_LOADING_CLASS = 'ark-loading';
    /**
     * ark根节点
     */
    var ROOT_ARK_VIEW_CLASS = 'ark-root-view';
    /**
     * 1px图片
     */
    var DEFAULT_REPLACE_PICTURE = 'data:image/png;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
    /**
     * 获取dom节点的大小
     * @description 这里的两个dom节点不用删除.因为会有很多没有挂载的节点需要获取宽度和高度
     */
    var getDomSize = (function () {
        var dom = null;
        var childNode = null;
        return function (node) {
            if (!node || !(node instanceof HTMLElement)) {
                return {
                    width: 0,
                    height: 0,
                };
            }
            var parentNode = node.parentNode;
            if (parentNode) {
                // const rect = node.getBoundingClientRect();
                var size_1 = {
                    width: node.offsetWidth,
                    height: node.offsetHeight,
                };
                return size_1;
            }
            if (!dom || !childNode) {
                dom = document.createElement('div');
                dom.style.cssText = 'width:0px;height:0px;overflow:hidden;position:absolute';
                document.body.appendChild(dom);
                childNode = document.createElement('div');
                childNode.style.cssText = 'width:5000px;height:5000px;position:absolute';
                dom.appendChild(childNode);
            }
            var cloneNode = node.cloneNode(true);
            childNode.appendChild(cloneNode);
            var lastChild = childNode.lastElementChild;
            // const rect = lastChild.getBoundingClientRect();
            var size = {
                width: lastChild.offsetWidth,
                height: lastChild.offsetHeight,
            };
            var timer = setTimeout(function () {
                cloneNode = null;
                lastChild.parentNode.removeChild(lastChild);
                if (timer) {
                    clearTimeout(timer);
                    lastChild = null;
                    timer = null;
                }
            });
            return size;
        };
    })();

    var BuildPlatformEnum;
    (function (BuildPlatformEnum) {
        BuildPlatformEnum["ELECTRON"] = "electron";
        BuildPlatformEnum["MINIPROGRAM"] = "miniprogram";
        BuildPlatformEnum["WEB"] = "web";
    })(BuildPlatformEnum || (BuildPlatformEnum = {}));

    var _a;
    /**
     * 不同平台对应的默认单位
     */
    var Unit = (_a = {},
        _a[BuildPlatformEnum.ELECTRON] = 'px',
        _a[BuildPlatformEnum.WEB] = 'px',
        _a[BuildPlatformEnum.MINIPROGRAM] = 'px',
        _a);
    /**
     * 根据平台获取对应的默认单位
     */
    function getUnit(platform) {
        if (platform === void 0) { platform = BuildPlatformEnum.ELECTRON; }
        var unit = platform === BuildPlatformEnum.MINIPROGRAM ? Unit[BuildPlatformEnum.MINIPROGRAM] : Unit[BuildPlatformEnum.ELECTRON];
        return unit;
    }

    var Calc = /** @class */ (function () {
        function Calc() {
        }
        /**
         * 计算ARK的样式计算属性
         * @param value
         * @returns
         */
        Calc.calculate = function (value) {
            return value;
        };
        /**
         * 获取值
         * @param value
         * @param platform 平台信息
         */
        Calc.getValue = function (value, platform) {
            if (platform === void 0) { platform = BuildPlatformEnum.ELECTRON; }
            var retValue = value;
            if (value.indexOf('calc') !== -1) {
                retValue = Calc.calculate(value);
            }
            var unit = getUnit(platform);
            return Number.isNaN(Number(retValue)) ? retValue : "".concat(retValue).concat(unit);
        };
        /**
         * 获取YG属性值
         * @param edge 如margin, padding, border-radius
         */
        Calc.getYGValue = function (value, platform) {
            if (platform === void 0) { platform = BuildPlatformEnum.ELECTRON; }
            return value
                .split(/,|\s/)
                .map(function (val) { return Calc.getValue(val, platform); })
                .join(' ');
        };
        return Calc;
    }());

    /**
     * @fileoverview 样式支持
     * @author alawnxu
     * @date 2022-04-14 11:28:42
     * @version 1.0.0
     * @see { CSS属性列表,不考虑前缀属性 @link https://www.w3schools.com/cssref/ }
     * @description Web标准的 flexbox 属性名使用的是小写+横线的命名方式，ark中使用的是对应的小驼峰命名，比如flex-direction在ark中对应的是flexDirection
     */
    /**
     * ARK长度单位
     */
    var ARK_UNITS = ['px', 'pt', '%', 'vw', 'vh', 'auto'];
    /**
     * ARK支持的CSS属性
     * @see #Ark/src/core/csslayout/csslayoutnode.cpp
     */
    var ARKCssPropertiesEnum;
    (function (ARKCssPropertiesEnum) {
        ARKCssPropertiesEnum["WIDTH"] = "width";
        ARKCssPropertiesEnum["MAX_WIDTH"] = "maxWidth";
        ARKCssPropertiesEnum["MIN_WIDTH"] = "minWidth";
        ARKCssPropertiesEnum["HEIGHT"] = "height";
        ARKCssPropertiesEnum["MAX_HEIGHT"] = "maxHeight";
        ARKCssPropertiesEnum["MIN_HEIGHT"] = "minHeight";
        ARKCssPropertiesEnum["DISPLAY"] = "display";
        ARKCssPropertiesEnum["FLEX_DIRECTION"] = "flexDirection";
        ARKCssPropertiesEnum["JUSTIFY_CONTENT"] = "justifyContent";
        ARKCssPropertiesEnum["ALIGN_ITEMS"] = "alignItems";
        ARKCssPropertiesEnum["ALIGN_CONTENT"] = "alignContent";
        ARKCssPropertiesEnum["ALIGN_SELF"] = "alignSelf";
        ARKCssPropertiesEnum["FLEX_GROW"] = "flexGrow";
        ARKCssPropertiesEnum["FLEX_SHRINK"] = "flexShrink";
        ARKCssPropertiesEnum["FLEX_BASIS"] = "flexBasis";
        ARKCssPropertiesEnum["FLEX"] = "flex";
        ARKCssPropertiesEnum["FLEX_WARP"] = "flexWrap";
        ARKCssPropertiesEnum["POSITION"] = "position";
        ARKCssPropertiesEnum["LEFT"] = "left";
        ARKCssPropertiesEnum["TOP"] = "top";
        ARKCssPropertiesEnum["RIGHT"] = "right";
        ARKCssPropertiesEnum["BOTTOM"] = "bottom";
        ARKCssPropertiesEnum["MARGIN"] = "margin";
        ARKCssPropertiesEnum["MARGIN_BOTTOM"] = "marginBottom";
        ARKCssPropertiesEnum["MARGIN_LEFT"] = "marginLeft";
        ARKCssPropertiesEnum["MARGIN_RIGHT"] = "marginRight";
        ARKCssPropertiesEnum["MARGIN_TOP"] = "marginTop";
        ARKCssPropertiesEnum["PADDING"] = "padding";
        ARKCssPropertiesEnum["PADDING_BOTTOM"] = "paddingBottom";
        ARKCssPropertiesEnum["PADDING_LEFT"] = "paddingLeft";
        ARKCssPropertiesEnum["PADDING_RIGHT"] = "paddingRight";
        ARKCssPropertiesEnum["PADDING_TOP"] = "paddingTop";
        ARKCssPropertiesEnum["BORDER_LEFT_WIDTH"] = "borderLeftWidth";
        ARKCssPropertiesEnum["BORDER_RIGHT_WIDTH"] = "borderRightWidth";
        ARKCssPropertiesEnum["BORDER_BOTTOM_WIDTH"] = "borderBottomWidth";
        ARKCssPropertiesEnum["BORDER_TOP_WIDTH"] = "borderTopWidth";
        /**
         * 自定义属性
         * @description 在ElectronArk中会使用到
         */
        ARKCssPropertiesEnum["LINE_HEIGHT"] = "lineHeight";
        ARKCssPropertiesEnum["LETTER_SPACING"] = "letterSpacing";
        ARKCssPropertiesEnum["BACKGROUND_COLOR"] = "backgroundColor";
        ARKCssPropertiesEnum["BORDER_RADIUS"] = "borderRadius";
        ARKCssPropertiesEnum["FONT_SIZE"] = "fontSize";
        ARKCssPropertiesEnum["FONT_STYLE"] = "fontStyle";
        ARKCssPropertiesEnum["FONT_FAMILY"] = "fontFamily";
        ARKCssPropertiesEnum["TEXT_ALIGN"] = "textAlign";
        ARKCssPropertiesEnum["COLOR"] = "color";
    })(ARKCssPropertiesEnum || (ARKCssPropertiesEnum = {}));
    var CSS = /** @class */ (function () {
        function CSS() {
        }
        /**
         * ARK的属性样式没有带单位.需要处理下
         * @param property
         * @param value
         * @param platform
         * @description 不能使用空格分割处理.因为这样可能会有计算属性被处理的情况
         * max-width: calc(var(--center-column-margin) + var(--center-column-width) + var(--rhs-margin) + var(--rhs-width));
         * max-width: calc(100px + 200px)
         * width: calc(100vw-2*(10pt+5pt) - 2*5)
         * @returns
         *
         * @TODO 先简单处理.目前的两个ARK没有用到计算属性
         */
        CSS.convertToCSSStyle = function (property, value, platform) {
            if (platform === void 0) { platform = BuildPlatformEnum.ELECTRON; }
            switch (property) {
                case ARKCssPropertiesEnum.WIDTH:
                case ARKCssPropertiesEnum.MAX_WIDTH:
                case ARKCssPropertiesEnum.MIN_WIDTH:
                case ARKCssPropertiesEnum.HEIGHT:
                case ARKCssPropertiesEnum.MAX_HEIGHT:
                case ARKCssPropertiesEnum.MIN_HEIGHT:
                case ARKCssPropertiesEnum.LEFT:
                case ARKCssPropertiesEnum.TOP:
                case ARKCssPropertiesEnum.RIGHT:
                case ARKCssPropertiesEnum.BOTTOM:
                case ARKCssPropertiesEnum.MARGIN_BOTTOM:
                case ARKCssPropertiesEnum.MARGIN_LEFT:
                case ARKCssPropertiesEnum.MARGIN_TOP:
                case ARKCssPropertiesEnum.MARGIN_RIGHT:
                case ARKCssPropertiesEnum.PADDING_BOTTOM:
                case ARKCssPropertiesEnum.PADDING_LEFT:
                case ARKCssPropertiesEnum.PADDING_TOP:
                case ARKCssPropertiesEnum.PADDING_RIGHT:
                case ARKCssPropertiesEnum.BORDER_RIGHT_WIDTH:
                case ARKCssPropertiesEnum.BORDER_LEFT_WIDTH:
                case ARKCssPropertiesEnum.BORDER_TOP_WIDTH:
                case ARKCssPropertiesEnum.BORDER_BOTTOM_WIDTH:
                case ARKCssPropertiesEnum.LINE_HEIGHT:
                case ARKCssPropertiesEnum.LETTER_SPACING:
                    return {
                        name: property,
                        value: Calc.getValue(value, platform),
                    };
                /**
                 * @description 处理margin和padding, 另外这里在Ark中如果是margin和padding. 值与值之间通过' '分割.所以这里不考虑calc()中有空格的情况
                 * @param value
                 */
                case ARKCssPropertiesEnum.MARGIN:
                case ARKCssPropertiesEnum.PADDING:
                    return {
                        name: property,
                        value: Calc.getYGValue(value, platform),
                    };
                default:
                    return {
                        name: property,
                        value: value,
                    };
            }
        };
        /**
         * 获取样式名称
         * @param {string} className
         * @param {string} appKey
         */
        CSS.getClassName = function (className, appKey) {
            return className ? className.split(' ').reduce(function (acc, cur) { return "".concat(acc, " ").concat(cur, "__").concat(appKey); }, '') : '';
        };
        return CSS;
    }());

    /* eslint-disable no-bitwise */
    /**
     * 驼峰转短杠
     * @author alawnxu
     * @date 2022-04-14 16:38:34
     */
    function toKebabCase(str) {
        return str.replace(/([A-Z])/g, function (_, char) { return "-".concat(char.toLowerCase()); });
    }
    /**
     * 短杠转驼峰
     * @author alawnxu
     * @date 2022-04-14 16:38:34
     */
    function toCamelCase(str) {
        return str.replace(/-(\w)/g, function (_, char) { return char.toUpperCase(); });
    }
    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0;
            var v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    /**
     * 根据font获取对应的字体样式
     * @param name 字体信息
     * @param fonts
     * @description 这里跟普通的样式有些区别.ARK的字体配置放到font.xml中.然后根据font.id去匹配设置
     */
    function getFontStyle(name, font, platform) {
        if (platform === void 0) { platform = BuildPlatformEnum.ELECTRON; }
        var bold = font.bold, size = font.size;
        var unit = getUnit(platform);
        var styles = [];
        // 抱歉.这里字体不能设置.继承父节点的family即可
        // if (fontFamily) {
        //   styles.push(`font-family:${fontFamily}`);
        // }
        if (bold) {
            styles.push("font-weight:bold");
        }
        if (size) {
            styles.push("font-size: ".concat(size).concat(unit));
        }
        return styles.join(';');
    }
    /**
     * 根据appKey和name生成class
     */
    function getFontClass(appKey, name) {
        return "ark_".concat(appKey, "_font_").concat(name.replace('.', '_'));
    }

    /* eslint-disable no-param-reassign */
    /**
     * 是否为Undefined
     */
    function isUndefined$1(value) {
        return typeof value === 'undefined';
    }
    /**
     * 判断是否为数字
     */
    function isFunction(value) {
        return typeof value === 'function';
    }
    /**
     * 判断是否为对象
     * @param value
     * @returns
     * @description
     * isObjectLike({}); => true
     * isObjectLike([1, 2, 3]); => true
     * isObjectLike(() => {}); => false
     * isObjectLike(null); => false
     */
    function isObjectLike(value) {
        return value != null && typeof value === 'object';
    }
    /**
     * 判断是否为数字
     * isNumber(3); => true
     * isNumber(Number.MIN_VALUE); => true
     * isNumber(Infinity); => true
     * isNumber('3'); => false
     */
    function isNumber(value) {
        return (typeof value === 'number' || (isObjectLike(value) && Object.prototype.toString.call(value) === '[object Number]'));
    }
    /**
     * 判断是否为NaN
     * @param value
     * @returns
     */
    function isNaN(value) {
        return isNumber(value) && value !== +value;
    }
    /**
     * 判断两个数值是否相等
     * @description 注意别比较嵌套类型的
     */
    function isEqualNumber(valueA, valueB) {
        if (valueA === valueB) {
            return true;
        }
        if (isNaN(valueA) && isNaN(valueB)) {
            return true;
        }
        return false;
    }
    /**
     * 保留小数后几位
     * @param
     * @param fractionDigits 小数点后的精度
     */
    function toFixed(num, fractionDigits) {
        if (!isNumber(num) || isNaN(num)) {
            return num;
        }
        return +num.toFixed(fractionDigits);
    }
    /**
     * 判断是否为Style字符串
     */
    function isStyle(str) {
        if (!str) {
            return false;
        }
        var arr = str.split(':');
        return arr.length >= 2 ? !!(arr[0].length && arr[1].length) : false;
    }
    /**
     * 判断是否为true字符串
     * @param str
     */
    function isTrueString(str) {
        return typeof str === 'string' ? str.toUpperCase() === 'TRUE' : false;
    }
    /**
     * 判断是否为false字符串
     * @param str
     */
    function isFalseString(str) {
        return typeof str === 'string' ? str.toUpperCase() === 'FALSE' : false;
    }
    /**
     * 判断是否为一个symbol对象
     */
    function isSymbol(value) {
        return (typeof value === 'symbol' || (isObjectLike(value) && Object.prototype.toString.call(value) === '[object Symbol]'));
    }
    var regHttp = /^https?:\/\//;
    /**
     * 判断是否为Http请求
     */
    function isHttp(url) {
        return regHttp.test(url);
    }
    /**
     * 转https请求
     */
    function toHttps(url) {
        return url.replace(/^http:\/\//, 'https://');
    }
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    /**
     * 获取uuid
     * @returns
     */
    function uuid() {
        return "".concat(S4() + S4(), "-").concat(S4(), "-").concat(S4(), "-").concat(S4(), "-").concat(S4()).concat(S4()).concat(S4());
    }

    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
    var reIsPlainProp = /^\w*$/;
    var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var INFINITY = 1 / 0;
    /**
     * 检查value是不是一个属性名称
     * @param value
     * @param object
     */
    function isKey(value, object) {
        if (Array.isArray(value)) {
            return false;
        }
        var type = typeof value;
        if (type === 'number' || type === 'symbol' || type === 'boolean' || value === null || isSymbol(value)) {
            return true;
        }
        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || (object != null && value in Object(object));
    }
    /**
     * 转换一个值为string类型的key
     * @param value
     */
    function toKey(value) {
        if (typeof value === 'string') {
            return value;
        }
        var result = "".concat(value);
        return result === '0' && 1 / value === -INFINITY ? '-0' : result;
    }
    /**
     * 将string转化为路径数组.中间以空格隔开
     * @param string
     * @returns
     */
    function stringToPath(string) {
        var result = [];
        if (string.charCodeAt(0) === 46 /* . */) {
            result.push('');
        }
        string.replace(rePropName, function (match, number, quote, subString) {
            result.push(quote ? subString.replace(reEscapeChar, '$1') : number || match);
            return match;
        });
        return result;
    }
    function castPath(value, object) {
        if (Array.isArray(value)) {
            return value;
        }
        return isKey(value, object) ? [value] : stringToPath(String(value));
    }
    /**
     * 获取指定某一个对象上的链式对象结果
     * @param obj
     * @param path
     */
    function pick(object, path, defaultValue) {
        var chains = castPath(path, object);
        var result = object;
        var index = -1;
        var length = chains.length;
        if (!length) {
            length = 1;
            result = undefined;
        }
        while (++index < length) {
            var value = result == null ? undefined : result[toKey(chains[index])];
            if (value === undefined) {
                index = length;
                value = defaultValue;
            }
            result = value;
        }
        return result;
    }

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __read$3(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spreadArray$3(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    /* eslint-disable no-console */
    var Logger = /** @class */ (function () {
        function Logger(tag, traceId) {
            this.tag = tag;
            this.traceId = traceId;
        }
        /**
         * 设置全局Logger配置
         * @param config
         */
        Logger.applyConfig = function (config) {
            if (typeof config === 'boolean') {
                Logger.ENABLE_DEBUG = config;
                Logger.ENABLE_INFO = config;
                Logger.ENABLE_WARN = config;
                Logger.ENABLE_ERROR = config;
                return;
            }
            if (typeof config === 'object') {
                if (typeof config.enableDebug !== 'undefined') {
                    Logger.ENABLE_DEBUG = config.enableDebug;
                }
                if (typeof config.enableInfo !== 'undefined') {
                    Logger.ENABLE_INFO = config.enableInfo;
                }
                if (typeof config.enableWarn !== 'undefined') {
                    Logger.ENABLE_WARN = config.enableWarn;
                }
                if (typeof config.enableError !== 'undefined') {
                    Logger.ENABLE_ERROR = config.enableError;
                }
            }
        };
        Logger.getLogger = function (tag, traceId) {
            return new Logger(tag, traceId);
        };
        /**
         * 输出调试日志信息
         * @param message 调试日志信息
         * @description
         * 1、向控制台输出一条调试日志信息
         */
        Logger.prototype.debug = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var tag = this.tag;
            var str = "[".concat(tag, "]");
            if (!Logger.ENABLE_DEBUG) {
                return;
            }
            if (console.debug) {
                console.debug.apply(console, __spreadArray$3([str], __read$3(params), false));
            }
            else {
                console.log.apply(console, __spreadArray$3([str], __read$3(params), false));
            }
        };
        /**
         * 输出普通日志信息
         * @param params 日志信息
         * @description
         * 1、向控制台输出一条日志信息
         */
        Logger.prototype.info = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var tag = this.tag;
            var str = "[".concat(tag, "]");
            if (!Logger.ENABLE_INFO) {
                return;
            }
            if (console.info) {
                console.info.apply(console, __spreadArray$3([str], __read$3(params), false));
            }
            else {
                console.log.apply(console, __spreadArray$3([str], __read$3(params), false));
            }
        };
        /**
         * 错误信息会上报到天机阁
         * @param message
         * @param traceId
         */
        Logger.prototype.error = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var tag = this.tag;
            var str = "[".concat(tag, "]");
            if (!Logger.ENABLE_ERROR) {
                return;
            }
            if (console.error) {
                console.error.apply(console, __spreadArray$3([str], __read$3(params), false));
            }
            else if (console.warn) {
                console.warn.apply(console, __spreadArray$3([str], __read$3(params), false));
            }
            else {
                console.log.apply(console, __spreadArray$3([str], __read$3(params), false));
            }
        };
        Logger.prototype.warn = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var tag = this.tag;
            var str = "[".concat(tag, "]");
            if (!Logger.ENABLE_WARN) {
                return;
            }
            if (console.warn) {
                console.warn.apply(console, __spreadArray$3([str], __read$3(params), false));
            }
            else {
                console.log.apply(console, __spreadArray$3([str], __read$3(params), false));
            }
        };
        /**
         * 是否输出ERROR日志到控制台
         */
        Logger.ENABLE_ERROR = true;
        /**
         * 是否输出INFO日志到控制台
         */
        Logger.ENABLE_INFO = true;
        /**
         * 是否输出WARN日志到控制台
         */
        Logger.ENABLE_WARN = true;
        /**
         * 是否输出DEBUG日志到控制台
         */
        Logger.ENABLE_DEBUG = true;
        return Logger;
    }());

    /**
     * 文本对齐方式
     * @enum UP 上对齐
     * @enum UP 左对齐
     * @enum UP 水平居中
     * @enum UP 右对齐
     * @enum UP 垂直居中
     * @enum UP 下对齐
     */
    var TextAlignEnum$1;
    (function (TextAlignEnum) {
        TextAlignEnum[TextAlignEnum["UP"] = 0] = "UP";
        TextAlignEnum[TextAlignEnum["LEFT"] = 0] = "LEFT";
        TextAlignEnum[TextAlignEnum["CENTER"] = 1] = "CENTER";
        TextAlignEnum[TextAlignEnum["RIGHT"] = 2] = "RIGHT";
        TextAlignEnum[TextAlignEnum["MIDDLE"] = 4] = "MIDDLE";
        TextAlignEnum[TextAlignEnum["BOTTOM"] = 8] = "BOTTOM";
    })(TextAlignEnum$1 || (TextAlignEnum$1 = {}));

    /**
     * @fileoverview 监控
     * @author alawnxu
     * @date 2022-04-25 20:52:18
     * @version 1.0.0
     */
    var logger$D = Logger.getLogger('Report');
    var TRACER_SPAN_NAME$1 = 'WebArk';
    var TracerMessageEnum;
    (function (TracerMessageEnum) {
        TracerMessageEnum["CLICK"] = "Click";
        TracerMessageEnum["MOUNT"] = "Mount";
        TracerMessageEnum["ERROR"] = "Error";
        TracerMessageEnum["SET_METADATA_ERROR"] = "SetMetaDataError";
    })(TracerMessageEnum || (TracerMessageEnum = {}));
    var NOOP$1 = function () {
        /* NOOP FUNCTION*/
    };
    var Report = /** @class */ (function () {
        function Report(monitor) {
            this.tracer = this.getTracer(monitor);
            this.metrics = this.getMetrics(monitor);
        }
        /**
         * 上报trace
         * @param tracer
         * @param receive
         */
        Report.prototype.log = function (receive) {
            try {
                var tracer = this.tracer;
                if (tracer && typeof tracer.log === 'function') {
                    tracer.log(receive);
                }
            }
            catch (e) {
                logger$D.error(e);
            }
        };
        /**
         * 上报error
         * @param tracer
         * @param receive
         */
        Report.prototype.error = function (receive) {
            try {
                var tracer = this.tracer;
                if (tracer && typeof tracer.log === 'function') {
                    tracer.error(receive);
                }
            }
            catch (e) {
                logger$D.error(e);
            }
        };
        /**
         * 上报值
         */
        Report.prototype.reportValue = function (event, value, labels) {
            try {
                var metrics = this.metrics;
                if (metrics && typeof metrics.reportValue === 'function') {
                    metrics.reportValue(event, value, labels);
                }
            }
            catch (e) {
                logger$D.error(e);
            }
        };
        /**
         * 上报Count
         */
        Report.prototype.reportCount = function (event, count, labels) {
            try {
                var metrics = this.metrics;
                if (metrics && typeof metrics.reportValue === 'function') {
                    metrics.reportCount(event, count, labels);
                }
            }
            catch (e) {
                logger$D.error(e);
            }
        };
        /**
         * 获取 tracer
         * @returns
         */
        Report.prototype.getTracer = function (monitor) {
            var tracer = {
                log: NOOP$1,
                error: NOOP$1,
            };
            try {
                var tag = "instance_".concat(Date.now(), "_").concat(parseInt(String(Math.random() * 10000000000), 10));
                if (typeof (monitor === null || monitor === void 0 ? void 0 : monitor.getTracer) === 'function') {
                    return monitor.getTracer(tag) || tracer;
                }
                return tracer;
            }
            catch (e) {
                logger$D.error('getTracer error.', e);
                return tracer;
            }
        };
        /**
         * 获取 metrics
         * @returns
         */
        Report.prototype.getMetrics = function (monitor) {
            var metrics = {
                reportValue: NOOP$1,
                reportCount: NOOP$1,
            };
            try {
                var tag = "instance_".concat(Date.now(), "_").concat(parseInt(String(Math.random() * 10000000000), 10));
                if (typeof (monitor === null || monitor === void 0 ? void 0 : monitor.getMetric) === 'function') {
                    return monitor.getMetric(tag) || metrics;
                }
                return metrics;
            }
            catch (e) {
                logger$D.error('getTracer error.', e);
                return metrics;
            }
        };
        return Report;
    }());

    function mitt(n){return {all:n=n||new Map,on:function(t,e){var i=n.get(t);i?i.push(e):n.set(t,[e]);},off:function(t,e){var i=n.get(t);i&&(e?i.splice(i.indexOf(e)>>>0,1):n.set(t,[]));},emit:function(t,e){var i=n.get(t);i&&i.slice().map(function(n){n(e);}),(i=n.get("*"))&&i.slice().map(function(n){n(t,e);});}}}

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics$2 = function(d, b) {
        extendStatics$2 = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics$2(d, b);
    };

    function __extends$2(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics$2(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __awaiter$2(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator$2(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __read$2(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spreadArray$2(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    /**
     * @fileoverview Animation基类
     * @author alawnxu
     * @date 2022-07-18 23:42:05
     * @version 1.0.0
     */
    var BaseAnimation = /** @class */ (function () {
        function BaseAnimation() {
        }
        return BaseAnimation;
    }());

    /**
     * @fileoverview 把App对象换成AppUtils
     * @author alawnxu
     * @date 2022-04-18 21:54:59
     * @version 1.0.0
     * @description 因为App设置为一个类的话.会导致对象一致被持有,从而导致无法释放
     */
    /**
     * ARK模式
     * @enum DEFAULT 普通模式
     * @enum CONCISE 精简模式
     */
    var ArkModeEnum;
    (function (ArkModeEnum) {
        ArkModeEnum["DEFAULT"] = "default";
        ArkModeEnum["CONCISE"] = "concise";
    })(ArkModeEnum || (ArkModeEnum = {}));
    /**
     * ARK App配置信息
     * @property app appName. 如: com.tencent.forum
     * @property view 展示的视图信息, 如: rank
     * @property theme ARK主题
     * @property ver 版本号
     */
    /**
     * 如果config中设置了autosize:1,那么由外层容器来控制ark元素的宽度和高度
     */
    var AutoSizeEnum;
    (function (AutoSizeEnum) {
        AutoSizeEnum[AutoSizeEnum["AUTO_SIZE"] = 1] = "AUTO_SIZE";
        AutoSizeEnum[AutoSizeEnum["CUSTOM"] = 0] = "CUSTOM";
    })(AutoSizeEnum || (AutoSizeEnum = {}));
    var logger$9$1 = Logger.getLogger('AppUtil');
    var AppUtil = /** @class */ (function () {
        function AppUtil() {
        }
        AppUtil.GetImages = function (app) {
            var extendObject = app.getExtendObject();
            var images = extendObject.images;
            return Array.isArray(images) ? images : [];
        };
        /**
         * 获取当前应用的样式信息
         * @date 2022-07-21 14:40:24
         * @description WebArk中会需要
         */
        AppUtil.GetStyles = function (app) {
            var extendObject = app.getExtendObject();
            return extendObject.styles || {};
        };
        AppUtil.GetAppKey = function (app) {
            var extendObject = app.getExtendObject();
            return extendObject.appKey || '';
        };
        AppUtil.GetAppid = function (app) {
            var extendObject = app.getExtendObject();
            return extendObject.appid || '';
        };
        /**
         * 获取字体配置
         */
        AppUtil.GetFonts = function (app) {
            var extendObject = app.getExtendObject();
            return extendObject.fonts || {};
        };
        /**
         * 获取当前ark应用的版本号
         */
        AppUtil.GetAppVersion = function (app) {
            var extendObject = app.getExtendObject();
            return extendObject.appVersion || 'unknown';
        };
        /**
         * 获取当前ark应用的Web构建版本号
         */
        AppUtil.GetBuildVersion = function (app) {
            var extendObject = app.getExtendObject();
            return extendObject.buildVersion || 'unknown';
        };
        /**
         * 获取applicationEvents
         */
        AppUtil.GetApplicationEvents = function (app) {
            var extendObject = app.getExtendObject();
            return Array.isArray(extendObject.applicationEvents) ? extendObject.applicationEvents : [];
        };
        /**
         * 获取applicationId
         */
        AppUtil.GetApplicationId = function (app) {
            var extendObject = app.getExtendObject();
            return extendObject.applicationId || extendObject.appKey;
        };
        /**
         * 获取Url白名单
         */
        AppUtil.GetUrlWhiteList = function (app) {
            var extendObject = app.getExtendObject();
            return Array.isArray(extendObject.urlWhiteList) ? extendObject.urlWhiteList : [];
        };
        /**
         * 检测URL的合法性
         */
        AppUtil.CheckUrlLegality = function (app, url) {
            if (typeof url !== 'string' || url.trim().length === 0) {
                return false;
            }
            return true;
        };
        /**
         * 获取初始化空节点的大小
         * @param app
         * @description 自定义拓展方法
         */
        AppUtil.GetEmptySize = function (app, metadata) {
            var method = 'app.GetEmptySize';
            var result = pick(app, method);
            if (typeof result === 'function') {
                try {
                    return result(metadata);
                }
                catch (e) {
                    logger$9$1.error('GetEmptySize fail.', e);
                    return null;
                }
            }
            return null;
        };
        return AppUtil;
    }());

    /**
     * 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     */
    var BaseEventListener = /** @class */ (function () {
        function BaseEventListener() {
            this.eventCallbackMap = new Map();
        }
        /**
         * 释放资源
         * @TODO 暂时不置空先
         */
        BaseEventListener.prototype.Release = function () {
            this.eventCallbackMap.clear();
        };
        /**
         * 监听事件
         * @param type 事件类型
         * @param handler 回调函数
         */
        BaseEventListener.prototype.AttachEvent = function (type, handler) {
            var handlers = this.eventCallbackMap.get(type);
            if (handlers && Array.isArray(handlers)) {
                handlers.push(handler);
                return;
            }
            this.eventCallbackMap.set(type, [handler]);
        };
        /**
         * 解绑事件
         * @param type 类型
         */
        BaseEventListener.prototype.DetachEvent = function (type, handler) {
            var handlers = this.eventCallbackMap.get(type);
            if (handlers) {
                var index = handlers.findIndex(function (item) { return item === handler; });
                if (index !== -1) {
                    handlers.splice(index, 1);
                }
                else {
                    handlers = [];
                }
            }
        };
        /**
         * 触发事件
         * @param type 类型
         * @param ...params 参数列表
         */
        BaseEventListener.prototype.FireEvent = function (type) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            var handlers = this.eventCallbackMap.get(type);
            if (!handlers) {
                return;
            }
            if (Array.isArray(handlers)) {
                handlers.forEach(function (handler) {
                    handler.apply(void 0, __spreadArray$2([], __read$2(params), false));
                });
            }
        };
        return BaseEventListener;
    }());

    /**
     * @fileoverview ark生命周期
     * @author alawnxu
     * @date 2022-07-31 10:54:10
     * @version 1.0.0
     */
    var LifeCycleEnum;
    (function (LifeCycleEnum) {
        LifeCycleEnum["ON_CREATE_VIEW"] = "OnCreateView";
        LifeCycleEnum["ON_DESTROY_VIEW"] = "OnDestroyView";
        LifeCycleEnum["ON_START_UP"] = "OnStartup";
        LifeCycleEnum["ON_CONFIG_CHANGE"] = "OnConfigChange";
        LifeCycleEnum["ON_EXIT"] = "OnExit";
        LifeCycleEnum["ON_ACTIVATE"] = "OnActivate";
        LifeCycleEnum["ON_SHARE"] = "OnShare";
        LifeCycleEnum["ON_SET_VALUE"] = "OnSetValue";
    })(LifeCycleEnum || (LifeCycleEnum = {}));

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     * @description 自定义拓展方法请以小写开头的驼峰命名.
     */
    /**
     * @fileoverview 应用管理
     * @author alawnxu
     * @date 2022-08-17 11:31:57
     * @version 1.0.0
     * @TODO 要注意内存溢出.
     */
    var logger$8$1 = Logger.getLogger('ApplicationManager');
    var ApplicationManager = /** @class */ (function () {
        function ApplicationManager() {
        }
        /**
         * 绑定application
         * @param applicationId 每次创建的应用的ID.唯一
         * @param application 应用信息
         */
        ApplicationManager.AddApplication = function (applicationId, application) {
            if (!application || !applicationId) {
                return false;
            }
            logger$8$1.debug('AddApplication applicationId:', applicationId, ', application:', application);
            ApplicationManager.applicationMap.set(applicationId, application);
            return true;
        };
        /**
         * 获取应用信息
         * @param applicationId 唯一的应用ID
         * @returns
         */
        ApplicationManager.GetApplication = function (applicationId) {
            if (!applicationId) {
                return null;
            }
            var application = ApplicationManager.applicationMap.get(applicationId);
            return application;
        };
        /**
         * 根据 applicationId 移除应用
         * @param applicationId 唯一的应用ID
         */
        ApplicationManager.RemoveApplication = function (applicationId) {
            if (!applicationId) {
                return false;
            }
            ApplicationManager.applicationMap.delete(applicationId);
        };
        ApplicationManager.applicationMap = new Map();
        return ApplicationManager;
    }());

    /**
     * @fileoverview EventListener
     * @author alawnxu
     * @date 2022-04-10 19:20:25
     * @version 1.0.0
     * @description 抽这层的原因是因为大部分事件触发类型非常多,所以放到这里单独维护
     */
    var logger$7$1 = Logger.getLogger('EventListener');
    var TARGET_PROPERTY = 'target';
    var EventListener = /** @class */ (function () {
        function EventListener(target, applicationId, catchErrorHandle) {
            this.eventMap = new Map();
            this.applicationId = applicationId;
            this.catchErrorHandle = catchErrorHandle;
            /**
             * 这里最好不要直接挂载实例上，可能会导致循环引用，如果 JSON.stringify 的话会导致死循环，从而内存溢出
             */
            Object.defineProperty(this, TARGET_PROPERTY, {
                value: target,
                enumerable: false,
                writable: true,
                configurable: false,
            });
        }
        EventListener.prototype.GetApp = function () {
            var application = ApplicationManager.GetApplication(this.applicationId);
            return application.GetApp();
        };
        EventListener.prototype.GetTarget = function () {
            return this[TARGET_PROPERTY];
        };
        /**
         * 新增事件绑定
         * @param name
         * @param script
         */
        EventListener.prototype.AddEventListener = function (name, script) {
            if (name && script) {
                this.eventMap.set(name, script);
                this.Attach(name);
            }
        };
        /**
         * 清理资源
         * @TODO 先不置空先, 由于时序问题, 盲目置空可能会抛异常
         */
        EventListener.prototype.Release = function () {
            this.Detach();
            this.eventMap.clear();
        };
        /**
         * 执行指定的方法
         * @param name 事件名称
         */
        EventListener.prototype.CallEventMethod = function (event) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            if (!event) {
                return;
            }
            var script = this.eventMap.get(event);
            if (!script) {
                return;
            }
            var app = this.GetApp();
            if (app.isLua) {
                script = "LuaBridge.".concat(script);
            }
            var result = pick(app, script);
            var eventStr = event;
            logger$7$1.debug("CallEventMethod event: ".concat(eventStr, ", script: ").concat(script));
            if (typeof result !== 'function') {
                logger$7$1.error("invalid event callback. event: ".concat(eventStr, ", script: ").concat(script));
                if (typeof this.catchErrorHandle === 'function') {
                    this.catchErrorHandle(eventStr, script, new Error('InvalidEventCallback'));
                }
                return;
            }
            try {
                result.apply(void 0, __spreadArray$2([], __read$2(params), false));
                logger$7$1.debug("CallEventMethod event: ".concat(eventStr, ", script: ").concat(script, " success."));
            }
            catch (e) {
                logger$7$1.error("CallEventMethod fail. event: ".concat(eventStr, ", script: ").concat(script, "."), e);
                if (typeof this.catchErrorHandle === 'function') {
                    this.catchErrorHandle(eventStr, script, e);
                }
            }
        };
        return EventListener;
    }());

    var logger$6$1 = Logger.getLogger('ApplicationEventListener');
    var ApplicationEventListener = /** @class */ (function (_super) {
        __extends$2(ApplicationEventListener, _super);
        function ApplicationEventListener() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 创建View
             * @param view 创建的视图
             * @param id 创建视图的索引
             */
            _this.OnCreateViewHandle = function (view, id) {
                _this.CallEventMethod(LifeCycleEnum.ON_CREATE_VIEW, view, id);
            };
            /**
             * 销毁View
             */
            _this.OnDestroyViewHandle = function (view) {
                _this.CallEventMethod(LifeCycleEnum.ON_DESTROY_VIEW, view);
            };
            /**
             * 启动
             * @param config 配置信息
             */
            _this.OnStartupHandle = function (config) {
                _this.CallEventMethod(LifeCycleEnum.ON_START_UP, config);
            };
            /**
             * 修改ark配置
             * @param config 配置信息
             */
            _this.OnConfigChangeHandle = function (config) {
                _this.CallEventMethod(LifeCycleEnum.ON_CONFIG_CHANGE, config);
            };
            /**
             * 退出
             */
            _this.OnExitHandle = function () {
                _this.CallEventMethod(LifeCycleEnum.ON_EXIT);
            };
            /**
             * 激活View
             * @param view 进入或移出可视区域的视图
             * @param active true进入可视区域，false移出可视区域
             */
            _this.OnActivateHandle = function (view, active) {
                _this.CallEventMethod(LifeCycleEnum.ON_ACTIVATE, view, active);
            };
            /**
             * 分享View
             * @param view 所要分享的视图
             * @param active true进入可视区域，false移出可视区域
             */
            _this.OnShareHandle = function (view, active) {
                _this.CallEventMethod(LifeCycleEnum.ON_SHARE, view, active);
            };
            return _this;
        }
        /**
         * 初始化事件绑定
         */
        ApplicationEventListener.prototype.Attach = function (name) {
            logger$6$1.debug('AttachEvent:', name);
            var target = this.GetTarget();
            switch (name) {
                case LifeCycleEnum.ON_CREATE_VIEW:
                    target.AttachEvent(LifeCycleEnum.ON_CREATE_VIEW, this.OnCreateViewHandle);
                    break;
                case LifeCycleEnum.ON_START_UP:
                    target.AttachEvent(LifeCycleEnum.ON_START_UP, this.OnStartupHandle);
                    break;
                case LifeCycleEnum.ON_EXIT:
                    target.AttachEvent(LifeCycleEnum.ON_EXIT, this.OnExitHandle);
                    break;
                case LifeCycleEnum.ON_DESTROY_VIEW:
                    target.AttachEvent(LifeCycleEnum.ON_DESTROY_VIEW, this.OnDestroyViewHandle);
                    break;
                case LifeCycleEnum.ON_ACTIVATE:
                    target.AttachEvent(LifeCycleEnum.ON_ACTIVATE, this.OnActivateHandle);
                    break;
                case LifeCycleEnum.ON_SHARE:
                    target.AttachEvent(LifeCycleEnum.ON_SHARE, this.OnShareHandle);
                    break;
                case LifeCycleEnum.ON_CONFIG_CHANGE:
                    target.AttachEvent(LifeCycleEnum.ON_CONFIG_CHANGE, this.OnConfigChangeHandle);
                    break;
            }
        };
        /**
         * 解除事件绑定
         */
        ApplicationEventListener.prototype.Detach = function () {
            logger$6$1.debug('AttachEvent');
            var target = this.GetTarget();
            target.DetachEvent(LifeCycleEnum.ON_CREATE_VIEW, this.OnCreateViewHandle);
            target.DetachEvent(LifeCycleEnum.ON_START_UP, this.OnStartupHandle);
            target.DetachEvent(LifeCycleEnum.ON_EXIT, this.OnExitHandle);
            target.DetachEvent(LifeCycleEnum.ON_DESTROY_VIEW, this.OnDestroyViewHandle);
            target.DetachEvent(LifeCycleEnum.ON_ACTIVATE, this.OnActivateHandle);
            target.DetachEvent(LifeCycleEnum.ON_SHARE, this.OnShareHandle);
            target.DetachEvent(LifeCycleEnum.ON_CONFIG_CHANGE, this.OnConfigChangeHandle);
        };
        return ApplicationEventListener;
    }(EventListener));

    /**
     * Http管理
     * @author alawnxu
     * @date 2022-07-11 21:09:11
     * @version 1.0.0
     * @description 主要用于当应用被卸载.所有的Http请求都会强制失效.不会触发 onComplete 事件
     */
    var logger$5$1 = Logger.getLogger('HttpManager');
    var HttpManager = /** @class */ (function () {
        function HttpManager() {
        }
        HttpManager.AddHttp = function (applicationId, http) {
            if (!applicationId || !http) {
                return false;
            }
            var https = HttpManager.httpNode.get(applicationId);
            logger$5$1.debug('AddHttp applicationId:', applicationId, http);
            if (Array.isArray(https)) {
                https.push(http);
            }
            else {
                https = [http];
            }
            HttpManager.httpNode.set(applicationId, https);
            logger$5$1.debug('AddHttp success:', applicationId, http);
        };
        /**
         * 清理单个Http
         * @description 当一个请求完成.可以清理掉
         */
        HttpManager.RemoveHttp = function (applicationId, http) {
            if (!applicationId || !http) {
                return;
            }
            logger$5$1.debug('RemoveHttp applicationId:', applicationId, http);
            var https = HttpManager.httpNode.get(applicationId);
            if (Array.isArray(https)) {
                var index = https.findIndex(function (_http) { return _http === http; });
                if (index !== -1) {
                    https.splice(index, 1);
                }
                HttpManager.httpNode.set(applicationId, https);
            }
            logger$5$1.debug('RemoveHttp success.', HttpManager.httpNode.get(applicationId));
        };
        /**
         * 当卸载的时候统一清理所有的
         * @param applicationId
         */
        HttpManager.CleanHttp = function (applicationId) {
            if (!applicationId) {
                return;
            }
            logger$5$1.debug('CleanHttp applicationId:', applicationId);
            HttpManager.httpNode.delete(applicationId);
            logger$5$1.debug('CleanHttp success.', HttpManager.httpNode);
        };
        HttpManager.httpNode = new Map();
        return HttpManager;
    }());

    var logger$4$1 = Logger.getLogger('Application');
    var Application = /** @class */ (function (_super) {
        __extends$2(Application, _super);
        function Application(app, templates) {
            var _this = _super.call(this) || this;
            /**
             * 是否已经卸载
             */
            _this.isUnmounted = false;
            _this.app = app;
            _this.appid = AppUtil.GetAppid(app);
            _this.applicationId = AppUtil.GetApplicationId(app);
            _this.templates = templates;
            _this.Init();
            _this.listener = new ApplicationEventListener(_this, _this.applicationId, _this.EventCatchErrorHandle.bind(_this));
            AppUtil.GetApplicationEvents(app).forEach(function (_a) {
                var eventName = _a.eventName, callback = _a.callback;
                _this.listener.AddEventListener(eventName, callback);
            });
            return _this;
        }
        /**
         * 指定应用是否已经卸载
         * @param applicationId 应用ID
         */
        Application.IsUnmounted = function (applicationId) {
            if (!applicationId) {
                return true;
            }
            var application = ApplicationManager.GetApplication(applicationId);
            if (!application) {
                return true;
            }
            return application.IsUnmounted();
        };
        /**
         * 获取当前应用对象
         */
        Application.prototype.GetApp = function () {
            return this.app;
        };
        /**
         * 获取应用ID
         */
        Application.prototype.GetApplicationId = function () {
            return this.applicationId;
        };
        /**
         * 更新配置
         * @param config
         * @author alawnxu
         */
        Application.prototype.SetConfig = function (config) {
            logger$4$1.debug('SetConfig:', config);
            this.FireEvent(LifeCycleEnum.ON_CONFIG_CHANGE, config);
        };
        /**
         * 创建根视图
         * @param templateId 视图ID
         * @param container 挂载的容器(@TODO 先这样写,理论上这里只是创建视图,但是不应该挂载的)
         * @returns
         */
        Application.prototype.CreateRootView = function (templateId, container) {
            logger$4$1.info('CreateRootView view:', templateId, 'container:', container);
            var rootView = this.CreateView(templateId, true, container);
            return rootView;
        };
        /**
         * 释放应用资源
         * @author alawnxu
         * @date 2022-08-01 11:24:48
         * @TODO 先不置空先, 由于时序问题, 盲目置空可能会抛异常
         */
        Application.prototype.Release = function () {
            logger$4$1.debug('Application Release:', this.app);
            if (this.isUnmounted) {
                return;
            }
            _super.prototype.Release.call(this);
            var applicationId = this.applicationId;
            this.isUnmounted = true;
            this.listener.Release();
            this.templates = {};
            HttpManager.CleanHttp(applicationId);
            ApplicationManager.RemoveApplication(applicationId);
        };
        /**
         * 获取所有的模板
         */
        Application.prototype.GetTemplates = function () {
            return this.templates;
        };
        /**
         * 会解析对应的配置xml以及注册全局事件
         * @description 在前端构建的时候已经解析出来.所以这里不用处理
         */
        Application.prototype.Load = function () {
            logger$4$1.info('Application.Load()');
            return true;
        };
        /**
         * 启动Application
         * @param appConfig
         * @description 这里没有Native那么复杂的应用管理.跑通事件能力就Ok了
         */
        Application.prototype.Run = function (appConfig) {
            logger$4$1.info('Application.Run()', appConfig);
            this.Startup(appConfig);
            return true;
        };
        /**
         * 启动应用
         * @param config
         */
        Application.prototype.Startup = function (appConfig) {
            logger$4$1.info('Application.StartUp(config) config:', appConfig);
            this.FireEvent(LifeCycleEnum.ON_START_UP, appConfig);
        };
        /**
         * 退出.移除根视图
         */
        Application.prototype.Exit = function () {
            logger$4$1.info('Application.Exit()');
            this.FireEvent(LifeCycleEnum.ON_EXIT);
        };
        /**
         * 是否已经卸载
         */
        Application.prototype.IsUnmounted = function () {
            return this.isUnmounted;
        };
        /**
         * ARK应用初始化
         */
        Application.prototype.Init = function () {
            logger$4$1.info('Application.init()');
        };
        return Application;
    }(BaseEventListener));

    /**
     * @fileoverview Rect
     * @date 2022-04-04 21:55:29
     * @version 1.0.0
     */
    var Rect = /** @class */ (function () {
        function Rect(left, top, width, height) {
            this.set(left, top, width, height);
        }
        Rect.prototype.set = function (left, top, width, height) {
            this.left = left || 0;
            this.top = top || 0;
            this.width = width || 0;
            this.height = height || 0;
        };
        Rect.prototype.isEmpty = function () {
            return !(this.width && this.height);
        };
        return Rect;
    }());

    /**
     * 默认的视图缩放比率
     */
    var DEFAULT_VIEW_SCALE = 1;
    function NOOP() {
        /* NOOP Function */
    }
    /**
     * 默认支持获取的pskey的domain
     */
    var DEFAULT_PSKEY_DOMAINS = ['qun.qq.com'];
    /**
     * QQ ARK消息的默认渲染宽度
     */
    var DEFAULT_QQ_RENDER_WIDTH = 750 >> 1;
    /**
     * QQ ARK消息的默认高度
     */
    var DEFAULT_QQ_RENDER_HEIGHT = 1500 >> 1;
    /**
     * 最小渲染宽度
     */
    var MIN_QQ_RENDER_WIDTH = 350 >> 1;
    /**
     * 最小渲染高度
     */
    var MIN_QQ_RENDER_HEIGHT = 60 >> 1;
    /**
     * QQ ARK消息的最大渲染宽度
     * @description com.tencent.qqlover.inviteark 这个Ark消息375有部分会超出,导致内容被截断
     */
    var MAX_QQ_RENDER_WIDTH = 800 >> 1;
    /**
     * QQ ARK消息的最大渲染高度
     */
    var MAX_QQ_RENDER_HEIGHT = 1500 >> 1;
    /**
     * Channel ARK消息的最大渲染宽度
     */
    var DEFAULT_CHANNEL_RENDER_WIDTH = 640 >> 1;
    /**
     * Channel ARK消息的最大渲染高度
     */
    var DEFAULT_CHANNEL_RENDER_HEIGHT = 2000 >> 1;

    /**
     * 判断元素是否完全在视窗之内
     * @param element
     * @returns
     * @description
     */
    function getElementVerticalInViewPortPercent(element) {
        var viewHeight = window.innerHeight || document.documentElement.clientHeight;
        var _a = element.getBoundingClientRect(), top = _a.top, bottom = _a.bottom, height = _a.height;
        if (top >= 0 && bottom <= viewHeight) {
            return 100;
        }
        if (top > viewHeight || bottom <= 0) {
            return 0;
        }
        var inViewPortHeight = top >= 0 ? viewHeight - top : bottom;
        return parseInt(String((inViewPortHeight / height) * 100), 10);
    }

    /**
     * @fileoverview 判断当前是否运行在 worker 环境中
     * @author alawnxu
     * @date 2022-08-08 20:21:47
     * @version 1.0.0
     */
    /**
     * 判断是否支持 WebWorker
     */
    var SupportedWebWorker = typeof Worker !== 'undefined';
    function inWorker() {
        if (typeof window !== 'undefined' &&
            typeof HTMLElement !== 'undefined' &&
            typeof IntersectionObserver !== 'undefined') {
            return false;
        }
        // @ts-ignore
        return typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
    }
    var Env = (function () {
        var isWorker = inWorker();
        return {
            isWorker: isWorker,
            isMainThread: !isWorker,
        };
    })();

    /**
     * 容器枚举
     * @enum PUBLIC_PLATFORM 公众平台消息
     * @enum FRIEND_CHAT 普通的好友消息
     * @enum GROUP_CHAT 群会话
     * @enum DISCUSSION_GROUP 讨论组
     * @enum GROUP_TMP_CHAT 群临时会话
     * @enum DISCUSSION_TMP_CHAT 讨论组临时会话
     * @enum CHANNEL 频道会话
     * @enum OTHER 其它(预览)
     */
    var ContainerInfoEnum;
    (function (ContainerInfoEnum) {
        ContainerInfoEnum[ContainerInfoEnum["PUBLIC_PLATFORM"] = 1] = "PUBLIC_PLATFORM";
        ContainerInfoEnum[ContainerInfoEnum["FRIEND_CHAT"] = 2] = "FRIEND_CHAT";
        ContainerInfoEnum[ContainerInfoEnum["GROUP_CHAT"] = 3] = "GROUP_CHAT";
        ContainerInfoEnum[ContainerInfoEnum["DISCUSSION_GROUP"] = 4] = "DISCUSSION_GROUP";
        ContainerInfoEnum[ContainerInfoEnum["GROUP_TMP_CHAT"] = 5] = "GROUP_TMP_CHAT";
        ContainerInfoEnum[ContainerInfoEnum["DISCUSSION_TMP_CHAT"] = 6] = "DISCUSSION_TMP_CHAT";
        ContainerInfoEnum[ContainerInfoEnum["CHANNEL"] = 7] = "CHANNEL";
        ContainerInfoEnum[ContainerInfoEnum["OTHER"] = -1] = "OTHER";
    })(ContainerInfoEnum || (ContainerInfoEnum = {}));
    /**
     * 默认QQ版本号
     */
    var DEFAULT_QQ_VERSION = '1.0.0';
    /**
     * 默认容器信息
     */
    var DEFAULT_CONTAINER_INFO = ContainerInfoEnum.GROUP_CHAT;
    var logger$3$2 = Logger.getLogger('BaseApplicationContext');
    var BaseApplicationContext = /** @class */ (function () {
        function BaseApplicationContext(_a) {
            var uin = _a.uin, tinyId = _a.tinyId, getPskey = _a.getPskey, domains = _a.domains, setCookie = _a.setCookie, loggerConfig = _a.logger, monitor = _a.monitor, debug = _a.debug, getQQVersion = _a.getQQVersion, getContainerInfo = _a.getContainerInfo, isMute = _a.isMute, httpProxy = _a.httpProxy;
            Logger.applyConfig(loggerConfig);
            this.domains = Array.isArray(domains) ? domains : DEFAULT_PSKEY_DOMAINS;
            this.setCookieHandle = setCookie;
            this.getPskeyHandle = getPskey;
            try {
                var userUin = typeof uin === 'string' ? uin : uin();
                this.uin = userUin || '';
            }
            catch (e) {
                this.uin = '';
            }
            try {
                var userTinyId = typeof tinyId === 'string' ? tinyId : tinyId();
                this.tinyId = userTinyId || '';
            }
            catch (e) {
                this.tinyId = '';
            }
            this.loggerConfig = loggerConfig;
            this.monitor = monitor;
            this.debug = Boolean(debug);
            this.containerInfoHandle = getContainerInfo;
            this.isMuteHandle = isMute;
            this.initQQVersion(getQQVersion);
            this.httpProxyHandle = typeof httpProxy === 'function' ? httpProxy : null;
        }
        /**
         * 获取 logger 配置
         */
        BaseApplicationContext.prototype.getLoggerConfig = function () {
            return this.loggerConfig;
        };
        /**
         * 获取用户的 uin
         */
        BaseApplicationContext.prototype.getUin = function () {
            return this.uin;
        };
        /**
         * 获取用户的 tinyId
         */
        BaseApplicationContext.prototype.getTinyId = function () {
            return this.tinyId;
        };
        /**
         * 获取 QQ 的版本号
         */
        BaseApplicationContext.prototype.getQQVersion = function () {
            return this.qqVersion;
        };
        /**
         * 获取 HttpProxy
         */
        BaseApplicationContext.prototype.getHttpProxy = function () {
            return this.httpProxyHandle;
        };
        /**
         * 获取当前容器信息
         * @date 2022-08-09 10:53:27
         */
        BaseApplicationContext.prototype.getContainerInfo = function (view) {
            var containerInfoHandle = this.containerInfoHandle;
            var containerInfo = {
                ChatType: DEFAULT_CONTAINER_INFO,
            };
            try {
                if (typeof containerInfoHandle === 'function') {
                    return containerInfoHandle(view) || containerInfo;
                }
            }
            catch (e) {
                logger$3$2.error('getContainerInfo fail.', e);
            }
            return containerInfo;
        };
        /**
         * 判断是否静音
         * @param true 静音模式模式下弹toast提示，120s间隔。 false 静音模式下不弹toast提示
         * @date 2022-08-09 12:30:36
         */
        BaseApplicationContext.prototype.isMute = function (isShowToast) {
            var isMuteHandle = this.isMuteHandle;
            try {
                if (typeof isMuteHandle === 'function') {
                    return isMuteHandle(isShowToast) || false;
                }
            }
            catch (e) {
                logger$3$2.error('isMute fail.', e);
            }
            return false;
        };
        /**
         * 获取pskey
         * @param domains
         */
        BaseApplicationContext.prototype.getPskeyAsync = function (domain) {
            return __awaiter$2(this, void 0, void 0, function () {
                var getPskey, domains, pskeyMap, e_1;
                return __generator$2(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            getPskey = this.getPskeyHandle;
                            if (typeof getPskey !== 'function') {
                                logger$3$2.error('getPskey() not function.');
                                return [2 /*return*/, new Map()];
                            }
                            domains = typeof domain === 'string' ? [domain.trim()] : Array.isArray(domain) ? domain : [];
                            if (!domains.length) {
                                return [2 /*return*/, new Map()];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, getPskey(domains)];
                        case 2:
                            pskeyMap = _a.sent();
                            if (pskeyMap && typeof pskeyMap.forEach === 'function' && typeof pskeyMap.get === 'function') {
                                return [2 /*return*/, pskeyMap];
                            }
                            logger$3$2.error('format error', pskeyMap);
                            return [2 /*return*/, new Map()];
                        case 3:
                            e_1 = _a.sent();
                            logger$3$2.error("getPskeyAsync() error. domain: ".concat(domain), e_1);
                            return [2 /*return*/, new Map()];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 获取监控实例
         */
        BaseApplicationContext.prototype.getReport = function () {
            return new Report(this.monitor);
        };
        /**
         * 设置cookie
         * @description Electron环境下无法种植cookie.需要通知主进程处理.所以这里通过setCookie通知主进程处理
         */
        BaseApplicationContext.prototype.setCookie = function (cookies) {
            logger$3$2.debug('setCookie:', cookies);
            var setCookieHandle = this.setCookieHandle;
            if (typeof setCookieHandle !== 'function') {
                logger$3$2.warn('SetCookie() not function.');
                return;
            }
            setCookieHandle(cookies);
        };
        /**
         * 是否为debug
         * @description DEBUG模式
         * 1、在canvas场景下会强制绘制边框
         */
        BaseApplicationContext.prototype.isDebug = function () {
            return this.debug;
        };
        BaseApplicationContext.prototype.initQQVersion = function (getQQVersion) {
            this.qqVersion = DEFAULT_QQ_VERSION;
            try {
                if (typeof getQQVersion === 'function') {
                    this.qqVersion = getQQVersion() || DEFAULT_QQ_VERSION;
                }
            }
            catch (e) {
                logger$3$2.error('getQQVersion fail.', e);
            }
        };
        BaseApplicationContext.DEFAULT_APPLICATION_CONTEXT_DATA = {
            uin: '',
            tinyId: '',
            getPskey: function () { return Promise.resolve(new Map()); },
            setCookie: function () { return Promise.resolve(); },
            logger: true,
            monitor: null,
            debug: false,
        };
        return BaseApplicationContext;
    }());

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html#createview
     */
    var ApplicationApi = /** @class */ (function () {
        /**
         * @param app ark app对象
         * @param templates 当前ARK app的模板对象
         */
        function ApplicationApi(app, templates) {
            this.app = app;
            this.templates = templates || {};
        }
        /**
         * 获取当前应用版本号
         * @returns 64位应用版本号，每16位表示一个子版本，比如0x0001000200030004 对应版本号1.2.3.4
         * @TODO 对位运算不是特别熟悉.这里直接通过字符串转算了
         * @description 这里会有问题. 长度会超出, 实际值可能会有偏差. 但是看所有的都是取下发的config的ver. 所以这里不用深究
         */
        ApplicationApi.prototype.GetApplicationVersion = function () {
            var app = this.app;
            var appVersion = AppUtil.GetAppVersion(app);
            var versions = appVersion.split('.').map(function (subVersion) {
                var v = parseInt(subVersion.trim(), 10).toString(16);
                var prefix = '';
                if (v.length < 4) {
                    prefix = new Array(4 - v.length).fill(0).join('');
                }
                return prefix + v;
            });
            return parseInt("0x".concat(versions.join('')), 16);
        };
        return ApplicationApi;
    }());

    var eventBus = mitt();

    /* eslint-disable @typescript-eslint/no-empty-interface */
    /**
     * @fileoverview Canvas能力
     * @author alawnxu
     * @date 2022-07-23 15:29:49
     * @version 1.0.0
     */
    var DashStyleEnum;
    (function (DashStyleEnum) {
        DashStyleEnum[DashStyleEnum["SOLID"] = 0] = "SOLID";
        DashStyleEnum[DashStyleEnum["DASH"] = 1] = "DASH";
        DashStyleEnum[DashStyleEnum["DOT"] = 2] = "DOT";
        DashStyleEnum[DashStyleEnum["DASH_DOT"] = 3] = "DASH_DOT";
        DashStyleEnum[DashStyleEnum["DASH_DOT_DOT"] = 4] = "DASH_DOT_DOT";
    })(DashStyleEnum || (DashStyleEnum = {}));
    var StrokeCapEnum;
    (function (StrokeCapEnum) {
        StrokeCapEnum[StrokeCapEnum["BUTT"] = 0] = "BUTT";
        StrokeCapEnum[StrokeCapEnum["ROUND"] = 1] = "ROUND";
        StrokeCapEnum[StrokeCapEnum["SQUARE"] = 2] = "SQUARE";
    })(StrokeCapEnum || (StrokeCapEnum = {}));
    var StrokeJoinEnum;
    (function (StrokeJoinEnum) {
        StrokeJoinEnum[StrokeJoinEnum["MITER"] = 0] = "MITER";
        StrokeJoinEnum[StrokeJoinEnum["ROUND"] = 1] = "ROUND";
        StrokeJoinEnum[StrokeJoinEnum["BEVEL"] = 2] = "BEVEL";
    })(StrokeJoinEnum || (StrokeJoinEnum = {}));
    var DrawModeEnum;
    (function (DrawModeEnum) {
        DrawModeEnum[DrawModeEnum["FILL"] = 0] = "FILL";
        DrawModeEnum[DrawModeEnum["STROKE"] = 1] = "STROKE";
        DrawModeEnum[DrawModeEnum["FILL_STROKE"] = 2] = "FILL_STROKE";
    })(DrawModeEnum || (DrawModeEnum = {}));
    var GlobalBlendModeEnum;
    (function (GlobalBlendModeEnum) {
        GlobalBlendModeEnum[GlobalBlendModeEnum["SOURCEOVER"] = 0] = "SOURCEOVER";
        GlobalBlendModeEnum[GlobalBlendModeEnum["DESTINATIONOVER"] = 1] = "DESTINATIONOVER";
        GlobalBlendModeEnum[GlobalBlendModeEnum["COPY"] = 2] = "COPY";
        GlobalBlendModeEnum[GlobalBlendModeEnum["SOURCEIN"] = 3] = "SOURCEIN";
        GlobalBlendModeEnum[GlobalBlendModeEnum["DESTINATIONIN"] = 4] = "DESTINATIONIN";
        GlobalBlendModeEnum[GlobalBlendModeEnum["SOURCEOUT"] = 5] = "SOURCEOUT";
        GlobalBlendModeEnum[GlobalBlendModeEnum["DESTINATIONOUT"] = 6] = "DESTINATIONOUT";
        GlobalBlendModeEnum[GlobalBlendModeEnum["SOURCEATOP"] = 7] = "SOURCEATOP";
        GlobalBlendModeEnum[GlobalBlendModeEnum["DESTINATIONATOP"] = 8] = "DESTINATIONATOP";
        GlobalBlendModeEnum[GlobalBlendModeEnum["XOR"] = 9] = "XOR";
        GlobalBlendModeEnum[GlobalBlendModeEnum["MULTIPLY"] = 10] = "MULTIPLY";
    })(GlobalBlendModeEnum || (GlobalBlendModeEnum = {}));

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     */
    /**
     * @enum ACTUAL_SIZE 实际尺寸显示	0
     * @enum FULL_IMAGE 按照Image元素尺寸等比放缩显示	1
     * @enum FILL 按照Image元素尺寸显示
     */
    var ImageStretchEnum;
    (function (ImageStretchEnum) {
        ImageStretchEnum[ImageStretchEnum["ACTUAL_SIZE"] = 0] = "ACTUAL_SIZE";
        ImageStretchEnum[ImageStretchEnum["FULL_IMAGE"] = 1] = "FULL_IMAGE";
        ImageStretchEnum[ImageStretchEnum["FILL"] = 2] = "FILL";
    })(ImageStretchEnum || (ImageStretchEnum = {}));
    var ImageInputModeEnum;
    (function (ImageInputModeEnum) {
        ImageInputModeEnum["FILL"] = "fill";
        ImageInputModeEnum["ASPECTFIT"] = "aspectfit";
        ImageInputModeEnum["ASPECTFILL"] = "aspectfill";
        ImageInputModeEnum["WIDTHFIX"] = "widthfix";
        ImageInputModeEnum["TOP"] = "top";
        ImageInputModeEnum["BOTTOM"] = "bottom";
        ImageInputModeEnum["CENTER"] = "center";
        ImageInputModeEnum["LEFT"] = "left";
        ImageInputModeEnum["RIGHT"] = "right";
    })(ImageInputModeEnum || (ImageInputModeEnum = {}));
    /**
     * mode: 同stretch.增加更加丰富的图片裁剪和缩放模式
     * @enum NULL 为默认值
     * @see {@link http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html#mode}
     */
    var ImageModeEnum;
    (function (ImageModeEnum) {
        ImageModeEnum[ImageModeEnum["NULL"] = -1] = "NULL";
        ImageModeEnum[ImageModeEnum["FILL"] = 0] = "FILL";
        ImageModeEnum[ImageModeEnum["ASPECTFIT"] = 1] = "ASPECTFIT";
        ImageModeEnum[ImageModeEnum["ASPECTFILL"] = 2] = "ASPECTFILL";
        ImageModeEnum[ImageModeEnum["WIDTHFIX"] = 3] = "WIDTHFIX";
        ImageModeEnum[ImageModeEnum["TOP"] = 4] = "TOP";
        ImageModeEnum[ImageModeEnum["BOTTOM"] = 5] = "BOTTOM";
        ImageModeEnum[ImageModeEnum["CENTER"] = 6] = "CENTER";
        ImageModeEnum[ImageModeEnum["LEFT"] = 7] = "LEFT";
        ImageModeEnum[ImageModeEnum["RIGHT"] = 8] = "RIGHT";
        ImageModeEnum[ImageModeEnum["TOP_LEFT"] = 9] = "TOP_LEFT";
        ImageModeEnum[ImageModeEnum["TOP_RIGHT"] = 10] = "TOP_RIGHT";
        ImageModeEnum[ImageModeEnum["BOTTOM_LEFT"] = 11] = "BOTTOM_LEFT";
        ImageModeEnum[ImageModeEnum["BOTTOM_RIGHT"] = 12] = "BOTTOM_RIGHT";
    })(ImageModeEnum || (ImageModeEnum = {}));

    /**
     * @fileoverview BaseObject
     * @author alawnxu
     * @date 2022-07-20 10:21:38
     * @version 1.0.0
     */
    var NodeTypeEnum;
    (function (NodeTypeEnum) {
        NodeTypeEnum["CANVAS"] = "Canvas";
        NodeTypeEnum["IMAGE"] = "Image";
        NodeTypeEnum["TEXT"] = "Text";
        NodeTypeEnum["VIEW"] = "View";
        NodeTypeEnum["TEXTURE"] = "Texture";
        NodeTypeEnum["VIDEO"] = "Video";
        NodeTypeEnum["AUDIO"] = "Audio";
    })(NodeTypeEnum || (NodeTypeEnum = {}));
    var BaseObject = /** @class */ (function (_super) {
        __extends$2(BaseObject, _super);
        function BaseObject() {
            var _this = _super.call(this) || this;
            _this.nodeType = _this.GetNodeType();
            return _this;
        }
        /**
         * 是否为某种类型
         * @param type
         * @return 返回true表示对象类型与传入类型匹配，返回false表示不匹配
         */
        BaseObject.prototype.IsType = function (type) {
            return this.nodeType === type;
        };
        /**
         * 获取类型
         */
        BaseObject.prototype.GetType = function () {
            return this.nodeType;
        };
        /**
         * 获取对象索引
         * @param
         */
        BaseObject.prototype.GetID = function () {
            return this.id;
        };
        /**
         * 获取对象索引
         * @param
         */
        BaseObject.prototype.SetID = function (id) {
            this.id = id;
        };
        /**
         * 释放资源
         */
        BaseObject.prototype.Release = function () {
            _super.prototype.Release.call(this);
        };
        return BaseObject;
    }(BaseEventListener));

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     */
    var UITexture = /** @class */ (function (_super) {
        __extends$2(UITexture, _super);
        function UITexture() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return UITexture;
    }(BaseObject));

    /**
     * @fileoverview ARKSize.用于声明一个元素的尺寸
     * @author alawnxu
     * @date 2022-07-15 16:10:46
     * @version 1.0.0
     */
    var ARKSize = /** @class */ (function () {
        /**
         * 构造函数
         * @param width
         * @param height
         * @description
         * new ARKSize() => new ARKSize(0, 0);
         * new ARKSize(10, 10);
         */
        function ARKSize(width, height) {
            this.SetWidth(width);
            this.SetHeight(height);
        }
        /**
         * 判断两个size是否相等
         * @param sizeA
         * @param sizeB
         */
        ARKSize.IsEqual = function (sizeA, sizeB) {
            if (sizeA === sizeB) {
                return true;
            }
            // 这里需要注意: NaN !== NaN
            if (sizeA && sizeB) {
                if (isEqualNumber(sizeA.GetWidth(), sizeB.GetWidth()) && isEqualNumber(sizeA.GetHeight(), sizeB.GetHeight())) {
                    return true;
                }
            }
            return false;
        };
        /**
         * 判断两个size是否不相等
         */
        ARKSize.IsNotEqual = function (sizeA, sizeB) {
            return !ARKSize.IsEqual(sizeA, sizeB);
        };
        ARKSize.prototype.GetWidth = function () {
            return this.width;
        };
        ARKSize.prototype.GetHeight = function () {
            return this.height;
        };
        /**
         * 通过提示来禁止修改 width 属性
         * @param width
         */
        ARKSize.prototype.SetWidth = function (width) {
            this.width = isNumber(width) ? width || 0 : 0;
        };
        /**
         * 通过提示来禁止修改 height 属性
         * @param height
         */
        ARKSize.prototype.SetHeight = function (height) {
            this.height = isNumber(height) ? height || 0 : 0;
        };
        ARKSize.prototype.SetSize = function (width, height) {
            this.width = width;
            this.height = height;
        };
        /**
         * 判断两个size是否相等
         * @description 这里只比较宽高.不比较指向
         */
        ARKSize.prototype.IsEqual = function (size) {
            return ARKSize.IsEqual(this, size);
        };
        ARKSize.prototype.IsNotEqual = function (size) {
            return !this.IsEqual(size);
        };
        /**
         * 判断是否为空
         */
        ARKSize.prototype.IsEmpty = function () {
            return (this.width === 0 && this.height === 0) || (isNaN(this.width) && isNaN(this.height));
        };
        /**
         * 是否非空
         */
        ARKSize.prototype.IsNotEmpty = function () {
            return !this.IsEmpty();
        };
        /**
         * 复制ArkSize
         */
        ARKSize.prototype.Copy = function () {
            return new ARKSize(this.width, this.height);
        };
        /**
         * 为了避免重复创建空的Rect对象.这里初始化唯一的实例
         */
        ARKSize.EmptySize = Object.freeze(new ARKSize(0, 0));
        return ARKSize;
    }());

    /**
     * @fileoverview UIObjectEventListener
     * @author alawnxu
     * @date 2022-04-10 19:20:25
     * @version 1.0.0
     */
    var logger$2$2 = Logger.getLogger('UIObjectEventListener');
    var UIObjectEventEnum;
    (function (UIObjectEventEnum) {
        UIObjectEventEnum["ON_SET_VALUE"] = "OnSetValue";
        UIObjectEventEnum["ON_CHANGE"] = "OnChange";
        UIObjectEventEnum["ON_RESIZE"] = "OnResize";
        UIObjectEventEnum["ON_MOVE"] = "OnMove";
        UIObjectEventEnum["ON_PARENT_CHANGED"] = "OnParentChanged";
        UIObjectEventEnum["ON_CHILD_CHANGE"] = "OnChildChange";
        UIObjectEventEnum["ON_FOCUS_CHANGED"] = "OnFocusChanged";
        UIObjectEventEnum["ON_CLICK"] = "OnClick";
        UIObjectEventEnum["ON_MOUSE_DOWN"] = "OnMouseDown";
        UIObjectEventEnum["ON_MOUSE_UP"] = "OnMouseUp";
        UIObjectEventEnum["ON_LOAD"] = "OnLoad";
        UIObjectEventEnum["ON_ERROR"] = "OnError";
        UIObjectEventEnum["ON_VISIBLE_CHANGED"] = "OnVisibleChanged";
    })(UIObjectEventEnum || (UIObjectEventEnum = {}));
    var UIObjectEventListener = /** @class */ (function (_super) {
        __extends$2(UIObjectEventListener, _super);
        function UIObjectEventListener() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * OnSetValue处理
             */
            _this.OnSetValueHandle = function (sender, value) {
                _this.CallEventMethod(UIObjectEventEnum.ON_SET_VALUE, sender, value);
            };
            /**
             * 点击事件的处理
             */
            _this.OnClickHandle = function (sender, x, y, button, keyState) {
                _this.CallEventMethod(UIObjectEventEnum.ON_CLICK, sender, x, y, button, keyState);
            };
            /**
             * 鼠标按键按下事件的处理
             */
            _this.OnMouseDownHandle = function (sender, x, y, button, keyState) {
                _this.CallEventMethod(UIObjectEventEnum.ON_MOUSE_DOWN, sender, x, y, button, keyState);
            };
            /**
             * 鼠标按键按下松开的处理
             */
            _this.OnMouseUpHandle = function (sender, x, y, button, keyState) {
                _this.CallEventMethod(UIObjectEventEnum.ON_MOUSE_UP, sender, x, y, button, keyState);
            };
            /**
             * OnError处理
             */
            _this.OnErrorHandle = function (sender) {
                _this.CallEventMethod(UIObjectEventEnum.ON_ERROR, sender);
            };
            /**
             * OnLoad处理
             */
            _this.OnLoadHandle = function (sender) {
                _this.CallEventMethod(UIObjectEventEnum.ON_LOAD, sender);
            };
            /**
             * OnChange处理
             */
            _this.OnChangeHandle = function (sender, left, top, right, bottom) {
                _this.CallEventMethod(UIObjectEventEnum.ON_CHANGE, sender, left, top, right, bottom);
            };
            return _this;
        }
        /**
         * 初始化绑定事件
         */
        UIObjectEventListener.prototype.Attach = function (name) {
            logger$2$2.debug('AttachEvent:', name);
            var target = this.GetTarget();
            switch (name) {
                case UIObjectEventEnum.ON_SET_VALUE:
                    target.AttachEvent(UIObjectEventEnum.ON_SET_VALUE, this.OnSetValueHandle);
                    break;
                case UIObjectEventEnum.ON_CHANGE:
                    target.AttachEvent(UIObjectEventEnum.ON_CHANGE, this.OnChangeHandle);
                    break;
                case UIObjectEventEnum.ON_CLICK:
                    target.AttachEvent(UIObjectEventEnum.ON_CLICK, this.OnClickHandle);
                    break;
                case UIObjectEventEnum.ON_MOUSE_DOWN:
                    target.AttachEvent(UIObjectEventEnum.ON_MOUSE_DOWN, this.OnMouseDownHandle);
                    break;
                case UIObjectEventEnum.ON_MOUSE_UP:
                    target.AttachEvent(UIObjectEventEnum.ON_MOUSE_UP, this.OnMouseUpHandle);
                    break;
                case UIObjectEventEnum.ON_ERROR:
                    target.AttachEvent(UIObjectEventEnum.ON_ERROR, this.OnErrorHandle);
                    break;
                case UIObjectEventEnum.ON_LOAD:
                    target.AttachEvent(UIObjectEventEnum.ON_LOAD, this.OnLoadHandle);
                    break;
            }
        };
        /**
         * 移除事件
         */
        UIObjectEventListener.prototype.Detach = function () {
            var target = this.GetTarget();
            target.DetachEvent(UIObjectEventEnum.ON_SET_VALUE, this.OnSetValueHandle);
            target.DetachEvent(UIObjectEventEnum.ON_CHANGE, this.OnChangeHandle);
            target.DetachEvent(UIObjectEventEnum.ON_CLICK, this.OnClickHandle);
            target.DetachEvent(UIObjectEventEnum.ON_MOUSE_DOWN, this.OnMouseDownHandle);
            target.DetachEvent(UIObjectEventEnum.ON_MOUSE_UP, this.OnMouseUpHandle);
            target.DetachEvent(UIObjectEventEnum.ON_ERROR, this.OnErrorHandle);
            target.DetachEvent(UIObjectEventEnum.ON_LOAD, this.OnLoadHandle);
        };
        return UIObjectEventListener;
    }(EventListener));

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     */
    var AnchorsEnum;
    (function (AnchorsEnum) {
        AnchorsEnum[AnchorsEnum["ANCHOR_LEFT"] = 1] = "ANCHOR_LEFT";
        AnchorsEnum[AnchorsEnum["ANCHOR_TOP"] = 2] = "ANCHOR_TOP";
        AnchorsEnum[AnchorsEnum["ANCHOR_RIGHT"] = 4] = "ANCHOR_RIGHT";
        AnchorsEnum[AnchorsEnum["ANCHOR_BOTTOM"] = 8] = "ANCHOR_BOTTOM";
    })(AnchorsEnum || (AnchorsEnum = {}));
    var DEFAULT_ANCHORS = AnchorsEnum.ANCHOR_LEFT | AnchorsEnum.ANCHOR_TOP;
    var DEFAULT_ALPHA = 255;
    var UIObject = /** @class */ (function (_super) {
        __extends$2(UIObject, _super);
        function UIObject(applicationId) {
            var _this = _super.call(this) || this;
            /**
             * 大小是否自适应
             */
            _this.autoSize = false;
            /**
             * 是否已经被释放
             */
            _this.released = false;
            /** UIObject唯一Hash */
            _this.hashId = '';
            _this.applicationId = applicationId;
            _this.size = new ARKSize();
            _this.autoSize = false;
            _this.listener = new UIObjectEventListener(_this, _this.applicationId, _this.EventCatchErrorHandle.bind(_this));
            _this.hashId = "".concat(String(new Date().getTime()), "_").concat(Math.random().toString(16));
            return _this;
        }
        /**
         * 获取App对象
         * @description 自定义拓展方法
         * @author alawnxu
         */
        UIObject.prototype.GetApp = function () {
            var application = ApplicationManager.GetApplication(this.applicationId);
            return application.GetApp();
        };
        /**
         * 获取应用ID
         */
        UIObject.prototype.GetApplicationId = function () {
            return this.applicationId;
        };
        /**
         * 注册事件
         * @param name 事件名称
         * @param script 脚本名称
         */
        UIObject.prototype.AddEventListener = function (name, script) {
            this.listener.AddEventListener(name, script);
        };
        /**
         * 释放资源
         * @TODO 先不置空先, 由于时序问题, 盲目置空可能会抛异常
         */
        UIObject.prototype.Release = function () {
            var _a;
            _super.prototype.Release.call(this);
            this.released = true;
            (_a = this.listener) === null || _a === void 0 ? void 0 : _a.Release();
        };
        /**
         * 处理SetValue
         * @param value
         */
        UIObject.prototype.DoSetValue = function (value) {
            this.FireEvent(UIObjectEventEnum.ON_SET_VALUE, this, value);
        };
        return UIObject;
    }(BaseObject));

    var ARKView = /** @class */ (function () {
        function ARKView() {
        }
        return ARKView;
    }());

    var UI$1 = /** @class */ (function () {
        function UI() {
        }
        return UI;
    }());

    /**
     * @fileoverview Canvas渐变基类
     * @author alawnxu
     * @date 2022-07-25 19:46:30
     * @version 1.0.0
     */
    var Gradient = /** @class */ (function () {
        function Gradient() {
        }
        return Gradient;
    }());

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     */
    var UIController = /** @class */ (function () {
        function UIController() {
        }
        return UIController;
    }());

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     */
    var UITemplate = /** @class */ (function () {
        function UITemplate() {
        }
        return UITemplate;
    }());

    var ARKPoint = /** @class */ (function () {
        /**
         * 构造函数
         * @param width
         * @param height
         * @description 默认位置为(0,0)
         * new ARKPoint() => new ARKPoint(0, 0);
         * new ARKPoint(10, 10);
         */
        function ARKPoint(x, y) {
            this.setX(x);
            this.setY(y);
        }
        /**
         * 两个点相减
         * @param pointA
         * @param pointB
         */
        ARKPoint.Subtract = function (pointA, pointB) {
            var pA = pointA || new ARKPoint();
            var pB = pointB || new ARKPoint();
            return new ARKPoint((pA.getX() || 0) - (pB.getX() || 0), (pA.getY() || 0) - (pB.getY() || 0));
        };
        /**
         * 两个点相加
         * @param pointA
         * @param pointB
         */
        ARKPoint.Add = function (pointA, pointB) {
            var pA = pointA || new ARKPoint();
            var pB = pointB || new ARKPoint();
            return new ARKPoint((pA.getX() || 0) + (pB.getX() || 0), (pA.getY() || 0) + (pB.getY() || 0));
        };
        /**
         * 判断point是否相等
         */
        ARKPoint.isEqual = function (pointA, pointB) {
            if (pointA === pointB) {
                return true;
            }
            if (pointA && pointB) {
                return isEqualNumber(pointA.getX(), pointB.getX()) && isEqualNumber(pointA.getY(), pointB.getY());
            }
            return false;
        };
        ARKPoint.isNotEqual = function (pointA, pointB) {
            return !this.isEqual(pointA, pointB);
        };
        ARKPoint.prototype.getX = function () {
            return this.x;
        };
        ARKPoint.prototype.setX = function (x) {
            this.x = isNumber(x) ? x || 0 : 0;
        };
        ARKPoint.prototype.getY = function () {
            return this.y;
        };
        ARKPoint.prototype.setY = function (y) {
            this.y = isNumber(y) ? y || 0 : 0;
        };
        /**
         * 不会修改 point 和 size
         * @param point
         * @param size
         */
        ARKPoint.AddSize = function (point, size) {
            if (!point && !size) {
                return null;
            }
            if (!point && size) {
                return new ARKPoint(size.GetWidth(), size.GetHeight());
            }
            var p = new ARKPoint(point.getX(), point.getY());
            return p.AddSize(size);
        };
        /**
         * 会修改当前的size
         * @param size
         */
        ARKPoint.prototype.AddSize = function (size) {
            if (!size) {
                return this;
            }
            this.x += size.GetWidth();
            this.y += size.GetHeight();
            return this;
        };
        ARKPoint.prototype.isEqual = function (point) {
            return ARKPoint.isEqual(this, point);
        };
        ARKPoint.prototype.isNotEqual = function (point) {
            return !ARKPoint.isEqual(this, point);
        };
        /**
         * 复制一个Point
         */
        ARKPoint.prototype.Copy = function () {
            return new ARKPoint(this.x, this.y);
        };
        /**
         * 为了避免重复创建空的Rect对象.这里初始化唯一的实例
         */
        ARKPoint.EmptyPoint = Object.freeze(new ARKPoint(0, 0));
        return ARKPoint;
    }());

    /* eslint-disable no-param-reassign */
    var ARKRect = /** @class */ (function () {
        /**
         * 构造函数
         * @param left
         * @param top
         * @param right
         * @param bottom
         * @example
         * new ARKRect(); => new ARKRect(0,0,0,0);
         * new ARKRect(1,2,3,4);
         * new ARKRect(pointA, pointB);
         */
        function ARKRect(left, top, right, bottom) {
            left = isUndefined$1(left) ? 0 : left || 0;
            top = isUndefined$1(top) ? 0 : top || 0;
            right = isUndefined$1(right) ? 0 : right || 0;
            bottom = isUndefined$1(bottom) ? 0 : bottom || 0;
            if (typeof left === 'number' &&
                typeof top === 'number' &&
                typeof right === 'number' &&
                typeof bottom === 'number') {
                this.SetRect(left, top, right, bottom);
            }
            else if (left instanceof ARKPoint && top instanceof ARKPoint) {
                this.SetRect(left.getX() || 0, left.getY() || 0, top.getX() || 0, top.getY() || 0);
            }
            else {
                // 避免有些 Ark 消息传一些乱七八糟的格式
                this.SetRect(parseInt(String(left), 10) || 0, parseInt(String(top), 10) || 0, parseInt(String(right), 10) || 0, parseInt(String(bottom), 10) || 0);
            }
        }
        ARKRect.CreateEmptyRect = function () {
            return new ARKRect(0, 0, 0, 0);
        };
        ARKRect.IsEmptyRect = function (rect) {
            return (rect &&
                (rect.getLeft() === 0 || isNaN(rect.getLeft())) &&
                (rect.getTop() === 0 || isNaN(rect.getTop())) &&
                (rect.getRight() === 0 || isNaN(rect.getRight())) &&
                (rect.getBottom() === 0 || isNaN(rect.getBottom())));
        };
        /**
         * 合并Rect
         * @param pRect1
         * @param pRect2
         */
        ARKRect.UnionRect = function (pRect1, pRect2) {
            if (isEqualNumber(pRect1.getLeft(), pRect1.getRight()) || isEqualNumber(pRect1.getTop(), pRect1.getBottom())) {
                if (isEqualNumber(pRect2.getLeft(), pRect2.getRight()) || isEqualNumber(pRect2.getTop(), pRect2.getBottom())) {
                    return ARKRect.CreateEmptyRect();
                }
                return pRect2.Copy();
            }
            if (isEqualNumber(pRect2.getLeft(), pRect2.getRight()) || isEqualNumber(pRect2.getTop(), pRect2.getBottom())) {
                if (isEqualNumber(pRect1.getLeft(), pRect1.getRight()) || isEqualNumber(pRect1.getTop(), pRect1.getBottom())) {
                    return ARKRect.CreateEmptyRect();
                }
                return pRect1.Copy();
            }
            var minLeft = pRect1.getLeft() < pRect2.getLeft() ? pRect1.getLeft() : pRect2.getLeft();
            var minTop = pRect1.getTop() < pRect2.getTop() ? pRect1.getTop() : pRect2.getTop();
            var maxRight = pRect1.getRight() > pRect2.getRight() ? pRect1.getRight() : pRect2.getRight();
            var maxBottom = pRect1.getBottom() > pRect2.getBottom() ? pRect1.getBottom() : pRect2.getBottom();
            if (minLeft < maxRight && minTop < maxBottom) {
                return new ARKRect(minLeft, minTop, maxRight, maxBottom);
            }
            return ARKRect.CreateEmptyRect();
        };
        /**
         * 获取相交区域
         * @param pRect1
         * @param pRect2
         * @returns
         */
        ARKRect.IntersectRect = function (pRect1, pRect2) {
            var maxLeft = pRect1.getLeft() > pRect2.getLeft() ? pRect1.getLeft() : pRect2.getLeft();
            var maxTop = pRect1.getTop() > pRect2.getTop() ? pRect1.getTop() : pRect2.getTop();
            var minRight = pRect1.getRight() < pRect2.getRight() ? pRect1.getRight() : pRect2.getRight();
            var minBottom = pRect1.getBottom() < pRect2.getBottom() ? pRect1.getBottom() : pRect2.getBottom();
            if (maxLeft < minRight && maxTop < minBottom) {
                return new ARKRect(maxLeft, maxTop, minRight, minBottom);
            }
            return ARKRect.CreateEmptyRect();
        };
        /**
         * 判断两个区域是否相等
         * @param pRect1
         * @parma pRect2
         */
        ARKRect.IsEqual = function (pRect1, pRect2) {
            if (pRect1 === pRect2) {
                return true;
            }
            if (!pRect1 || !pRect2) {
                return false;
            }
            return (isEqualNumber(pRect1.getLeft(), pRect2.getLeft()) &&
                isEqualNumber(pRect1.getTop(), pRect2.getTop()) &&
                isEqualNumber(pRect1.getRight(), pRect2.getRight()) &&
                isEqualNumber(pRect1.getBottom(), pRect2.getBottom()));
        };
        /**
         * 两个区域是否不相等
         * @param pRect1
         * @parma pRect2
         */
        ARKRect.IsNotEqual = function (pRect1, pRect2) {
            return !ARKRect.IsEqual(pRect1, pRect2);
        };
        /**
         * 添加point
         */
        ARKRect.AddPoint = function (rect, point) {
            rect.Copy().AddPoint(point);
            return rect;
        };
        ARKRect.prototype.SetRect = function (left, top, right, bottom) {
            this.setLeft(left);
            this.setTop(top);
            this.setRight(right);
            this.setBottom(bottom);
        };
        ARKRect.prototype.getLeft = function () {
            return this.left;
        };
        ARKRect.prototype.setLeft = function (left) {
            this.left = isNumber(left) ? left || 0 : 0;
        };
        ARKRect.prototype.getRight = function () {
            return this.right;
        };
        ARKRect.prototype.setRight = function (right) {
            this.right = isNumber(right) ? right || 0 : 0;
        };
        ARKRect.prototype.getTop = function () {
            return this.top;
        };
        ARKRect.prototype.setTop = function (top) {
            this.top = isNumber(top) ? top || 0 : 0;
        };
        ARKRect.prototype.getBottom = function () {
            return this.bottom;
        };
        ARKRect.prototype.setBottom = function (bottom) {
            this.bottom = isNumber(bottom) ? bottom || 0 : 0;
        };
        ARKRect.prototype.DeflateRect = function (rect) {
            this.left += rect.left || 0;
            this.top += rect.top || 0;
            this.right -= rect.right || 0;
            this.bottom -= rect.bottom || 0;
        };
        ARKRect.prototype.Width = function () {
            return this.right - this.left;
        };
        ARKRect.prototype.Height = function () {
            return this.bottom - this.top;
        };
        ARKRect.prototype.GetSize = function () {
            return new ARKSize(this.right - this.left, this.bottom - this.top);
        };
        ARKRect.prototype.TopLeft = function () {
            return new ARKPoint(this.left, this.top);
        };
        ARKRect.prototype.BottomRight = function () {
            return new ARKPoint(this.right, this.bottom);
        };
        ARKRect.prototype.MoveToY = function (y) {
            var height = this.Height();
            this.top = y;
            this.bottom = height + (y || 0);
        };
        ARKRect.prototype.MoveToX = function (x) {
            var width = this.Width();
            this.left = x;
            this.right = width + (x || 0);
        };
        ARKRect.prototype.MoveToXY = function (x, y) {
            this.MoveToX(x);
            this.MoveToY(y);
        };
        ARKRect.prototype.SetRectEmpty = function () {
            this.SetRect(0, 0, 0, 0);
        };
        /**
         * 判断传入坐标是否在视图范围内
         * @param point
         */
        ARKRect.prototype.PtInRect = function (point) {
            return (point.getX() >= this.left && point.getX() < this.right && point.getY() >= this.top && point.getY() < this.bottom);
        };
        /**
         * 减去point
         * @param point
         */
        ARKRect.prototype.SubtractPoint = function (point) {
            if (!point) {
                return;
            }
            this.OffsetRect(-point.getX(), -point.getY());
        };
        /**
         * 增加
         * @param point
         */
        ARKRect.prototype.AddPoint = function (point) {
            if (!point) {
                return this;
            }
            this.OffsetRect(point.getX(), point.getY());
        };
        /**
         * 移动Rect
         * @param x
         * @param y
         */
        ARKRect.prototype.OffsetRect = function (x, y) {
            this.left += x || 0;
            this.top += y || 0;
            this.right += x || 0;
            this.bottom += y || 0;
        };
        /**
         * 获取相交区域
         * @param pRect1
         * @param pRect2
         * @returns
         */
        ARKRect.prototype.IntersectRect = function (pRect1, pRect2) {
            var rect;
            if (isUndefined$1(pRect2)) {
                rect = ARKRect.IntersectRect(this, pRect1);
            }
            else {
                rect = ARKRect.IntersectRect(pRect1, pRect2);
            }
            var left = rect.left, top = rect.top, right = rect.right, bottom = rect.bottom;
            this.SetRect(left, top, right, bottom);
        };
        /**
         * 获取合并区域
         * @param pRect1
         * @param pRect2 可以为空.为空的时候用当前节点代替
         * @returns
         */
        ARKRect.prototype.UnionRect = function (pRect1, pRect2) {
            var rect;
            if (isUndefined$1(pRect2)) {
                rect = ARKRect.UnionRect(this, pRect1);
            }
            else {
                rect = ARKRect.UnionRect(pRect1, pRect2);
            }
            var left = rect.left, top = rect.top, right = rect.right, bottom = rect.bottom;
            this.SetRect(left, top, right, bottom);
        };
        ARKRect.prototype.IsEqual = function (pRect) {
            return ARKRect.IsEqual(this, pRect);
        };
        ARKRect.prototype.IsNotEqual = function (pRect) {
            return this.IsEqual(pRect);
        };
        ARKRect.prototype.IsEmpty = function () {
            return ARKRect.IsEmptyRect(this);
        };
        ARKRect.prototype.IsNotEmpty = function () {
            return !this.IsEmpty();
        };
        /**
         * 复制一个Rect
         */
        ARKRect.prototype.Copy = function () {
            return new ARKRect(this.left, this.top, this.right, this.bottom);
        };
        /**
         * 为了避免重复创建空的Rect对象.这里初始化唯一的实例
         */
        ARKRect.EmptyRect = Object.freeze(new ARKRect(0, 0, 0, 0));
        return ARKRect;
    }());

    /**
     * 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     */
    var logger$1$2 = Logger.getLogger('QQ');
    var QQ$1 = /** @class */ (function () {
        function QQ() {
        }
        /**
         * emit 处理
         * @description 可重写
         */
        QQ.prototype.emitter = function (type, data) {
            eventBus.emit(type, data);
        };
        /**
         * 上报
         * @param id 顶层视图的索引
         * @param index 上报的操作索引
         * @param action 上报的操作名称
         * @description 目前的几个ARK没有用到手Q的数据上报.这里先忽略,但是输出warning
         */
        QQ.prototype.Report = function (id, index, action) {
            logger$1$2.warn("QQ.Report() not implemented. id:".concat(id, ", index:").concat(index, ", action:").concat(action));
            this.emitter('Report', {
                id: id,
                index: index,
                action: action,
            });
        };
        /**
         * 上报
         * 上报数据到非ARK表，后续由业务自己处理数据提取等操作，用于默认报表无法满足需求，需要自定义上报的场景。目前支持上报到手Q 898报表、灯塔上报，新需求建议使用灯塔上报。
         * @param type 上报类型
         * @param data 上报数据，根据上报类型的不同有不同的数据类型
         */
        QQ.prototype.ReportEx = function (type, data) {
            logger$1$2.warn("QQ.ReportEx() not implemented. type:".concat(type, ", data:").concat(JSON.stringify(data)));
            this.emitter('ReportEx', {
                type: type,
                data: data,
            });
        };
        /**
         * 打开链接地址
         * @param url
         * @description 这里引擎处理不了,抛给业务自己跳转
         */
        QQ.prototype.OpenUrl = function (url) {
            this.emitter('openUrl', {
                url: url,
            });
        };
        /**
         * 打开链接地址
         * @param url
         * @description 这里引擎处理不了,抛给业务自己跳转
         */
        QQ.prototype.OpenView = function (owner, type, template, meta) {
            this.emitter('openView', {
                owner: owner,
                type: type,
                template: template,
                meta: meta,
            });
        };
        /**
         * 通知
         * @param appid 应用ID
         * @param name 名称
         * @param data 参数信息
         * @TODO WebQQ 暂时不支持 Notify 能力. 但是这里先抛出, 后面可以交给业务自己处理
         */
        QQ.prototype.Notify = function (appid, name, data) {
            logger$1$2.warn("QQ.Notify() not implemented. appid: ".concat(appid, ", name: ").concat(name, ", data: ").concat(data));
            this.emitter('Notify', {
                appid: appid,
                name: name,
                data: data,
            });
        };
        /**
         * 没看到文档上有定义这个方法.但是确实有些Ark中使用了这个方法
         * @see
         * com.tencent.biz.pubaccount.readinjoy
         * com.tencent.wezone.share
         */
        QQ.prototype.GetViewProperty = function (view) {
            logger$1$2.warn('GetViewProperty view:', view);
            return {};
        };
        /**
         * 输出到QQ日志. 没看到文档上有定义这个方法
         * @see
         * com.tencent.boodo.boodoshareaioark
         */
        QQ.prototype.Log = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            logger$1$2.info.apply(logger$1$2, __spreadArray$2([], __read$2(params), false));
            this.emitter('Log', {
                params: params,
            });
        };
        /**
         * 分享视图
         * @param template 模板索引
         * @param meta 元数据信息
         * @param config 分享配置(支持type指定分享类型，页卡或非页卡,也可以指定非页卡的宽高设置)
         * @description WebQQ不支持分享. 不过先把事件抛出去
         */
        QQ.prototype.ShareView = function (template, meta, config) {
            logger$1$2.warn("QQ.ShareView() not implemented. template: ".concat(template, ", meta: ").concat(meta, ", config: ").concat(config));
            this.emitter('ShareView', {
                template: template,
                meta: meta,
                config: config,
            });
        };
        /**
         * 显示状态栏
         * @param owner 持有视图
         * @param prompt 提示信息
         */
        QQ.prototype.ShowStatusBar = function (owner, prompt) {
            logger$1$2.warn("QQ.ShowStatusBar() not implemented. owner: ".concat(owner, ", prompt: ").concat(prompt));
            this.emitter('ShowStatusBar', {
                owner: owner,
                prompt: prompt,
            });
        };
        /**
         * 显示状态栏
         * @param owner 持有视图
         */
        QQ.prototype.HideStatusBar = function (owner) {
            logger$1$2.warn("QQ.HideStatusBar() not implemented. owner: ".concat(owner));
            this.emitter('HideStatusBar', {
                owner: owner,
            });
        };
        /**
         * 图片预览
         * @param urls 图片urls或者cache路径，组成数组
         * @param current 当前预览索引
         */
        QQ.prototype.PreviewImage = function (urls, current) {
            logger$1$2.warn("QQ.PreviewImage() not implemented. urls: ".concat(urls, ", current: ").concat(current));
            this.emitter('PreviewImage', {
                urls: urls,
                current: current,
            });
        };
        /**
         * 设置无障碍文本
         * @param urls 图片urls或者cache路径，组成数组
         * @param current 当前预览索引
         */
        QQ.prototype.SetTalkBackText = function (text, owner) {
            logger$1$2.warn("QQ.SetTalkBackText() not implemented. text: ".concat(text, ", owner: ").concat(owner));
            this.emitter('SetTalkBackText', {
                text: text,
                owner: owner,
            });
        };
        /**
         * 发送轻应用消息
         * @description 文档上没有写,但是有些Ark有使用
         * @see
         * com.tencent.gamecenter.act_464073
         */
        QQ.prototype.SendMessage = function (options, launchSelector, owner) {
            logger$1$2.warn("QQ.SendMessage() not implemented. options: ".concat(options, ", launchSelector: ").concat(launchSelector, ", owner: ").concat(owner));
            this.emitter('SendMessage', {
                options: options,
                launchSelector: launchSelector,
                owner: owner,
            });
        };
        return QQ;
    }());

    var Net$1 = /** @class */ (function () {
        function Net() {
        }
        /**
         * 将对象转为JSON字符串
         * @param obj
         * @description 不要相信开发者传过来的参数
         */
        Net.prototype.TableToJSON = function (obj) {
            if (typeof obj === 'string') {
                return obj;
            }
            return JSON.stringify(obj);
        };
        /**
         * 将JSON字符串转为对象
         * @param json
         * @description 不要相信开发者传过来的参数
         */
        Net.prototype.JSONToTable = function (json) {
            if (json && typeof json === 'object') {
                return json;
            }
            return JSON.parse(json);
        };
        /**
         * 把字符串转换为Url编码格式
         * @param plainText 待转换的string
         */
        Net.prototype.UrlEncode = function (plainText) {
            return encodeURIComponent(plainText);
        };
        /**
         * Url编码字符串转成普通字符串
         * @param encodedText Url编码的string
         */
        Net.prototype.UrlDecode = function (encodedText) {
            return decodeURIComponent(encodedText);
        };
        return Net;
    }());

    /**
     * @fileoverview 请求工具方法
     * @author alawnxu
     * @date 2022-08-19 10:47:26
     * @version 1.0.0
     */
    var HttpErrorCodeEnum;
    (function (HttpErrorCodeEnum) {
        HttpErrorCodeEnum[HttpErrorCodeEnum["ARK_HTTP_CLIENT_ERROR_OK"] = 0] = "ARK_HTTP_CLIENT_ERROR_OK";
        HttpErrorCodeEnum[HttpErrorCodeEnum["ARK_HTTP_CLIENT_ERROR_NOT_MODIFIED"] = 1] = "ARK_HTTP_CLIENT_ERROR_NOT_MODIFIED";
        HttpErrorCodeEnum[HttpErrorCodeEnum["ARK_HTTP_CLIENT_ERROR_OTHER"] = 2] = "ARK_HTTP_CLIENT_ERROR_OTHER";
        HttpErrorCodeEnum[HttpErrorCodeEnum["ARK_HTTP_CLIENT_ERROR_SERVER_CLOSE"] = 3] = "ARK_HTTP_CLIENT_ERROR_SERVER_CLOSE";
        HttpErrorCodeEnum[HttpErrorCodeEnum["ARK_HTTP_CLIENT_ERROR_WRITE_FAIL"] = 4] = "ARK_HTTP_CLIENT_ERROR_WRITE_FAIL";
        HttpErrorCodeEnum[HttpErrorCodeEnum["ARK_HTTP_CLIENT_ERROR_NETWORK_FAIL"] = 5] = "ARK_HTTP_CLIENT_ERROR_NETWORK_FAIL";
        HttpErrorCodeEnum[HttpErrorCodeEnum["ARK_HTTP_CLIENT_ERROR_FILE_NO_FOUND"] = 7] = "ARK_HTTP_CLIENT_ERROR_FILE_NO_FOUND";
        HttpErrorCodeEnum[HttpErrorCodeEnum["ARK_HTTP_CLIENT_ERROR_SERVER_ERROR"] = 8] = "ARK_HTTP_CLIENT_ERROR_SERVER_ERROR";
        HttpErrorCodeEnum[HttpErrorCodeEnum["ARK_HTTP_CLIENT_ERROR_CANCEL"] = 9] = "ARK_HTTP_CLIENT_ERROR_CANCEL";
        HttpErrorCodeEnum[HttpErrorCodeEnum["ARK_HTTP_CLIENT_ERROR_MD5_NOT_MATCH"] = 11] = "ARK_HTTP_CLIENT_ERROR_MD5_NOT_MATCH";
        HttpErrorCodeEnum[HttpErrorCodeEnum["ARK_HTTP_CLIENT_ERROR_DECOMPRESS_FAIL"] = 12] = "ARK_HTTP_CLIENT_ERROR_DECOMPRESS_FAIL";
        HttpErrorCodeEnum[HttpErrorCodeEnum["ARK_HTTP_CLIENT_ERROR_MOVE_FILE_FAIL"] = 13] = "ARK_HTTP_CLIENT_ERROR_MOVE_FILE_FAIL";
        HttpErrorCodeEnum[HttpErrorCodeEnum["ARK_HTTP_CLIENT_ERROR_TIMEOUT"] = 21] = "ARK_HTTP_CLIENT_ERROR_TIMEOUT";
        HttpErrorCodeEnum[HttpErrorCodeEnum["ARK_HTTP_CLIENT_ERROR_DNS_FAIL"] = 22] = "ARK_HTTP_CLIENT_ERROR_DNS_FAIL";
    })(HttpErrorCodeEnum || (HttpErrorCodeEnum = {}));
    var ErrorCodeStatusMap = new Map([
        [200, HttpErrorCodeEnum.ARK_HTTP_CLIENT_ERROR_OK],
        [301, HttpErrorCodeEnum.ARK_HTTP_CLIENT_ERROR_NOT_MODIFIED],
        [401, HttpErrorCodeEnum.ARK_HTTP_CLIENT_ERROR_SERVER_CLOSE],
        [402, HttpErrorCodeEnum.ARK_HTTP_CLIENT_ERROR_SERVER_CLOSE],
        [404, HttpErrorCodeEnum.ARK_HTTP_CLIENT_ERROR_FILE_NO_FOUND],
        [503, HttpErrorCodeEnum.ARK_HTTP_CLIENT_ERROR_SERVER_ERROR],
    ]);

    var HttpStatus = /** @class */ (function () {
        function HttpStatus() {
        }
        HttpStatus.GetErrorCode = function (status) {
            var errorCode = ErrorCodeStatusMap.get(status);
            return errorCode || HttpErrorCodeEnum.ARK_HTTP_CLIENT_ERROR_OTHER;
        };
        return HttpStatus;
    }());

    /**
     * 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     */
    /**
     * @fileoverview 请求
     * @author alawnxu
     * @date 2022-08-19 10:47:26
     * @version 1.0.0
     */
    /**
     * 有一些 Ark 消息很久了.用到的一些接口可能早已下架.这里需要过滤下
     * @description 比方说: 华佗监控
     */
    var BLACK_LIST = ['report.huatuo.qq.com'];
    /**
     * 默认超时时长
     * @description 默认不会超时
     */
    var DEFAULT_TIMEOUT = 0;
    var HttpEventEnum;
    (function (HttpEventEnum) {
        HttpEventEnum["ON_COMPLETE"] = "OnComplete";
    })(HttpEventEnum || (HttpEventEnum = {}));
    var SameSiteEnum;
    (function (SameSiteEnum) {
        SameSiteEnum["UNSPECIFIED"] = "unspecified";
        SameSiteEnum["NO_RESTRICTION"] = "no_restriction";
        SameSiteEnum["LAX"] = "lax";
        SameSiteEnum["STRICT"] = "strict";
    })(SameSiteEnum || (SameSiteEnum = {}));
    var HttpMethodEnum;
    (function (HttpMethodEnum) {
        HttpMethodEnum["GET"] = "Get";
        HttpMethodEnum["POST"] = "Post";
    })(HttpMethodEnum || (HttpMethodEnum = {}));
    var MimeTypeEnum;
    (function (MimeTypeEnum) {
        MimeTypeEnum["TEXT"] = "text/plain";
        MimeTypeEnum["JSON"] = "application/json";
        MimeTypeEnum["XML"] = "text/xml";
    })(MimeTypeEnum || (MimeTypeEnum = {}));
    var CONTENT_TYPE_HEADER = 'Content-Type';
    /**
     * 低优先级请求
     * @description 主要是各类数据上报
     */
    var LOW_PRIORITY_LIST = [
        'https://otheve.beacon.qq.com',
        'https://report.qqweb.qq.com',
        'https://h5.qzone.qq.com/report/compass',
        'https://report.vip.qq.com',
        'https://h5.qzone.qq.com/report/action',
        'https://report.gamecenter.qq.com',
        'https://h5.qianbao.qq.com/maya/report',
        'https://tianshu.qq.com/open/ts_report',
        'https://q.qq.com/os/store/tsReport',
    ];
    var logger$C = Logger.getLogger('Http');
    /**
     * 默认成功status
     */
    var DEFAULT_SUCCESS_STATUS_CODE = 200;
    var Http = /** @class */ (function (_super) {
        __extends$2(Http, _super);
        function Http(app) {
            var _this = _super.call(this) || this;
            _this.url = '';
            _this.data = '';
            _this.interval = DEFAULT_TIMEOUT;
            _this.headers = {};
            _this.method = HttpMethodEnum.POST;
            _this.isComplete = false;
            _this.isTimeout = false;
            _this.applicationId = AppUtil.GetApplicationId(app);
            HttpManager.AddHttp(_this.applicationId, _this);
            return _this;
        }
        /**
         * 异步Get请求
         * @param url 请求的链接地址
         * @description 返回的图片可能是http的.这里统一处理下
         */
        Http.prototype.Get = function (url) {
            var requestUrl = toHttps(url);
            if (!requestUrl) {
                logger$C.error('invalid url:', url);
                return;
            }
            this.url = requestUrl;
            this.data = '';
            this.method = HttpMethodEnum.GET;
            this.Send();
        };
        /**
         * 异步Post请求
         * @param url
         * @param data 请求数据，被自动转换为JSON格式发送
         * @description @description 虽然文档上明确说明了传递json.但是还是有一部分传递了string类型.这里需要做下兼容
         */
        Http.prototype.Post = function (url, data) {
            var requestUrl = toHttps(url);
            if (!requestUrl) {
                logger$C.error('invalid url:', url);
                return;
            }
            this.url = requestUrl;
            this.method = HttpMethodEnum.POST;
            if (typeof data === 'string') {
                this.data = data;
            }
            else {
                try {
                    this.data = JSON.stringify(data);
                }
                catch (e) {
                    logger$C.error('Parse error.', e);
                    this.data = String(data);
                }
            }
            this.Send();
        };
        /**
         * 判断请求是否成功
         */
        Http.prototype.IsSuccess = function () {
            var errorCode = this.errorCode;
            if (this.IsComplete() &&
                (errorCode === HttpErrorCodeEnum.ARK_HTTP_CLIENT_ERROR_OK ||
                    errorCode === HttpErrorCodeEnum.ARK_HTTP_CLIENT_ERROR_NOT_MODIFIED)) {
                return true;
            }
            return false;
        };
        /**
         * 判断请求是否完成
         */
        Http.prototype.IsComplete = function () {
            return this.isComplete;
        };
        /**
         * 获取返回的Http头中对应字段的值
         * @param name
         */
        Http.prototype.GetHeader = function (name) {
            var _a;
            return ((_a = this.headers) === null || _a === void 0 ? void 0 : _a[name]) || '';
        };
        /**
         * 获取请求的url
         */
        Http.prototype.GetUrl = function () {
            return this.url;
        };
        /**
         * 设置Http请求超时时间
         * @param interval 超时时间，单位毫秒
         */
        Http.prototype.SetTimeout = function (interval) {
            this.interval = parseInt(String(interval), 10) || 0;
        };
        /**
         * 设置发送的Http头中对应字段的值
         * @param name Http头字段名
         * @param value Http头字段值
         */
        Http.prototype.SetHeader = function (name, value) {
            this.headers[name] = value;
        };
        /**
         * 获取App对象
         */
        Http.prototype.GetAppData = function () {
            var applicationId = this.applicationId;
            var application = ApplicationManager.GetApplication(applicationId);
            return application.GetApp();
        };
        /**
         * 发送请求
         */
        Http.prototype.Send = function () {
            return __awaiter$2(this, void 0, void 0, function () {
                var _a, url, applicationId, interval, isBlackUrl, app, isLowPriorityUrl, doRequest;
                var _this = this;
                return __generator$2(this, function (_b) {
                    _a = this, url = _a.url, applicationId = _a.applicationId, interval = _a.interval;
                    isBlackUrl = BLACK_LIST.find(function (blackUrl) { return url.indexOf(blackUrl) !== -1; });
                    // 如果是在黑名单中. 则直接取消请求
                    if (isBlackUrl) {
                        logger$C.warn('isBlackUrl:', url);
                        return [2 /*return*/];
                    }
                    // 如果应用如果已经卸载.直接拒绝
                    if (Application.IsUnmounted(applicationId)) {
                        logger$C.warn('application is unmounted. applicationId:', applicationId);
                        return [2 /*return*/];
                    }
                    app = this.GetAppData();
                    if (!AppUtil.CheckUrlLegality(app, this.url)) {
                        logger$C.error('url not legality. url:', this.url);
                        return [2 /*return*/];
                    }
                    if (interval) {
                        this.timerId = setTimeout(function () {
                            _this.isComplete = true;
                            _this.isTimeout = true;
                            _this.Abort();
                        }, interval);
                    }
                    isLowPriorityUrl = LOW_PRIORITY_LIST.find(function (_url) { return _this.url.startsWith(_url); });
                    doRequest = function () { return __awaiter$2(_this, void 0, void 0, function () {
                        var _a, status_1, success, errorCode, e_1;
                        return __generator$2(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, this.Request()];
                                case 1:
                                    _a = _b.sent(), status_1 = _a.status, success = _a.success;
                                    errorCode = success ? HttpErrorCodeEnum.ARK_HTTP_CLIENT_ERROR_OK : HttpStatus.GetErrorCode(status_1);
                                    this.errorCode = errorCode;
                                    this.OnCompleteHandle();
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_1 = _b.sent();
                                    logger$C.error('request error.', e_1);
                                    this.CatchErrorHandle(e_1);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    if (isLowPriorityUrl) {
                        if (Env.isMainThread) {
                            window.requestIdleCallback(doRequest);
                        }
                        else {
                            // 这里就不 push 了. 直接延迟算了
                            setTimeout(function () {
                                doRequest();
                            });
                        }
                        return [2 /*return*/];
                    }
                    doRequest();
                    return [2 /*return*/];
                });
            });
        };
        /**
         * 错误处理
         */
        Http.prototype.CatchErrorHandle = function (e) {
            logger$C.error('request fail.', e);
            if ((e === null || e === void 0 ? void 0 : e.name) === 'AbortError' && this.isTimeout) {
                this.errorCode = HttpErrorCodeEnum.ARK_HTTP_CLIENT_ERROR_TIMEOUT;
            }
            else {
                this.errorCode = HttpErrorCodeEnum.ARK_HTTP_CLIENT_ERROR_OTHER;
            }
            this.OnCompleteHandle();
        };
        /**
         * 请求完成后的处理
         * @description 如果应用已经被卸载.那么不会再执行 onComplete 的回调
         */
        Http.prototype.OnCompleteHandle = function () {
            var applicationId = this.applicationId;
            this.isComplete = true;
            this.CleanTimer();
            HttpManager.RemoveHttp(applicationId, this);
            if (Application.IsUnmounted(applicationId)) {
                logger$C.warn('application is unmounted.');
                return;
            }
            this.FireEvent(HttpEventEnum.ON_COMPLETE, this);
        };
        /**
         * 清空
         */
        Http.prototype.CleanTimer = function () {
            if (this.timerId) {
                clearTimeout(this.timerId);
                this.timerId = null;
            }
        };
        return Http;
    }(BaseEventListener));

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     */
    var Storage$1 = /** @class */ (function () {
        function Storage() {
        }
        return Storage;
    }());

    /**
     * 默认时间间隔
     * @description 与Native端保持一致
     */
    var DEFAULT_INTERVAL = 1000;
    /**
     * @fileoverview 定时器
     * @author alawnxu
     * @date 2022-04-13 16:01:38
     * @version 1.0.0
     * @description 这里不管是Electron还是小程序都适用,所以可以直接在引擎内实现即可
     */
    var IntervalTimer = /** @class */ (function (_super) {
        __extends$2(IntervalTimer, _super);
        function IntervalTimer() {
            var _this = _super.call(this) || this;
            _this.interval = DEFAULT_INTERVAL;
            _this.timerId = null;
            return _this;
        }
        /**
         * 定时器时间间隔，单位毫秒
         * @param interval
         */
        IntervalTimer.prototype.SetInterval = function (interval) {
            if (this.interval !== interval) {
                this.interval = parseInt(String(interval), 10) || DEFAULT_INTERVAL;
                if (this.timerId) {
                    this.Stop();
                    this.Start();
                }
            }
        };
        /**
         * 启动定时器
         */
        IntervalTimer.prototype.Start = function () {
            var _this = this;
            var interval = this.interval;
            this.timerId = setInterval(function () {
                _this.FireEvent('OnTimer', _this);
                _this.Stop();
            }, interval);
        };
        /**
         * 停止定时器
         * @description 没有地方可以DetachEvent?
         */
        IntervalTimer.prototype.Stop = function () {
            if (this.timerId) {
                clearTimeout(this.timerId);
                this.timerId = null;
            }
        };
        return IntervalTimer;
    }(BaseEventListener));
    /**
     * 在ARK中暴露出来的是: var timer = Timer(); 所以这里暴露出一个方法
     * @returns
     */
    function Timer() {
        return new IntervalTimer();
    }

    /**
     * @fileoverview 设备信息
     * @author alawnxu
     * @date 2022-08-09 16:08:19
     * @version 1.0.0
     */
    var ConnectionTypeEnum;
    (function (ConnectionTypeEnum) {
        ConnectionTypeEnum["ETHERNET"] = "ethernet";
        ConnectionTypeEnum["WIFI"] = "wifi";
        ConnectionTypeEnum["CELLULAR"] = "cellular";
        ConnectionTypeEnum["OTHER"] = "other";
        ConnectionTypeEnum["NONE"] = "none";
    })(ConnectionTypeEnum || (ConnectionTypeEnum = {}));
    /**
     * 事件枚举可以查看这里
     * @see {@link https://arkapp.woa.com/ark-doc/internal/doc/qqapi-develop-reference.html#attachevent}
     */
    var DeviceEventsEnum;
    (function (DeviceEventsEnum) {
        DeviceEventsEnum["POSITION"] = "Position";
        DeviceEventsEnum["MOTION"] = "Motion";
        DeviceEventsEnum["ORIENTATION"] = "Orientation";
        DeviceEventsEnum["CONNECTION_TYPE_CHANGE"] = "ConnectionTypeChange";
    })(DeviceEventsEnum || (DeviceEventsEnum = {}));
    var Device$1 = /** @class */ (function (_super) {
        __extends$2(Device, _super);
        function Device() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Device;
    }(BaseEventListener));

    /**
     * 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     */
    /**
     * 拓展一个新的System
     */
    var SystemEnum;
    (function (SystemEnum) {
        SystemEnum["WINDOWS"] = "Windows";
        SystemEnum["ANDROID"] = "Android";
        SystemEnum["IOS"] = "iOS";
        SystemEnum["MAC"] = "Mac";
        SystemEnum["GUILD"] = "Guild";
    })(SystemEnum || (SystemEnum = {}));
    /**
     * 业务类型枚举
     * @enum GUILD 频道
     * @enum QQ
     */
    var BusinessTypeEnum;
    (function (BusinessTypeEnum) {
        BusinessTypeEnum["GUILD"] = "Guild";
        BusinessTypeEnum["QQ"] = "QQ";
    })(BusinessTypeEnum || (BusinessTypeEnum = {}));
    var System$1 = /** @class */ (function () {
        function System() {
        }
        /**
         * 返回程序经过的毫秒数
         */
        System.prototype.Tick = function () {
            return Date.now();
        };
        return System;
    }());

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     */
    var Console$1 = /** @class */ (function () {
        function Console() {
        }
        return Console;
    }());

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     */
    var Notification$1 = /** @class */ (function () {
        function Notification() {
        }
        return Notification;
    }());

    var Platform$1 = /** @class */ (function () {
        function Platform() {
        }
        return Platform;
    }());

    var LuaAdapter$1 = /** @class */ (function () {
        function LuaAdapter() {
        }
        return LuaAdapter;
    }());

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics$1 = function(d, b) {
        extendStatics$1 = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics$1(d, b);
    };

    function __extends$1(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics$1(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign$1 = function() {
        __assign$1 = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign$1.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter$1(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator$1(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
            desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    function __exportStar(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    }

    function __values$1(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read$1(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read$1(arguments[i]));
        return ar;
    }

    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    function __spreadArray$1(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values$1 === "function" ? __values$1(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }

    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    function __classPrivateFieldIn(state, receiver) {
        if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
        return typeof state === "function" ? receiver === state : state.has(receiver);
    }

    /**
     * @fileoverview 操作storage
     * @author alawnxu
     * @date 2022-04-15 11:08:02
     * @version 1.0.0
     */
    var logger$3$1 = Logger.getLogger('StorageUtil');
    var StorageUtil = /** @class */ (function () {
        function StorageUtil() {
        }
        /**
         * 存储
         * @param name 属性名称
         * @param value 属性值
         */
        StorageUtil.setItem = function (name, value) {
            try {
                if (Env.isWorker) {
                    logger$3$1.warn('not support localStorage');
                    return;
                }
                if (!window.localStorage) {
                    return;
                }
                window.localStorage.setItem(name, JSON.stringify(value));
                return true;
            }
            catch (e) {
                logger$3$1.warn("setItem fail. name: ".concat(name, ", value: ").concat(value));
                // setItem() may throw an exception if the storage is full.
                return false;
            }
        };
        /**
         * 获取某个属性
         * @param name 属性名称
         */
        StorageUtil.getItem = function (name) {
            var value = '';
            try {
                if (Env.isWorker) {
                    logger$3$1.warn('not support localStorage');
                    return '';
                }
                if (!window.localStorage) {
                    return value;
                }
                var str = window.localStorage.getItem(name);
                if (str) {
                    try {
                        return JSON.parse(str);
                    }
                    catch (e) {
                        logger$3$1.warn('ParseError');
                        return str;
                    }
                }
                return str || '';
            }
            catch (e) {
                logger$3$1.error("getItem error. name: ".concat(name, ", error: "), e);
                return value;
            }
        };
        /**
         * 移除某个属性
         * @param name 属性名称
         */
        StorageUtil.removeItem = function (name) {
            try {
                if (Env.isWorker) {
                    logger$3$1.warn('not support localStorage');
                    return;
                }
                if (!window.localStorage) {
                    return;
                }
                window.localStorage.removeItem(name);
            }
            catch (e) {
                logger$3$1.warn("removeItem fail. name: ".concat(name, ", error:"), e);
            }
        };
        /**
         * 清除所有数据
         */
        StorageUtil.clear = function () {
            try {
                if (Env.isWorker) {
                    logger$3$1.warn('not support localStorage');
                    return;
                }
                if (!window.localStorage) {
                    return;
                }
                window.localStorage.clear();
            }
            catch (e) {
                logger$3$1.warn("clear() fail. error:", e);
            }
        };
        return StorageUtil;
    }());

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    /* eslint-disable no-param-reassign */
    var BACKING_STORE_PIXEL_RATIO = 'backingStorePixelRatio';
    var WEBKIT_BACKING_STORE_PIXEL_RATIO = 'webkitBackingStorePixelRatio';
    var DEFAULT_DEVICE_PIXEL_RATIO$2 = 1;
    /**
     * 获取分辨率
     * @returns
     * @description 这个只能运行在 main thread 中。
     */
    function getRatio() {
        if (Env.isWorker) {
            return 1;
        }
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var backingStore = context[BACKING_STORE_PIXEL_RATIO] || context[WEBKIT_BACKING_STORE_PIXEL_RATIO] || 1;
        return (window.devicePixelRatio || DEFAULT_DEVICE_PIXEL_RATIO$2) / backingStore;
    }
    var ALL_PARAMS = 'all';
    /**
     * 需要重写的方法名称集合
     * @TODO font就自个控制吧
     */
    var WrapperMethods = {
        fillRect: ALL_PARAMS,
        clearRect: ALL_PARAMS,
        strokeRect: ALL_PARAMS,
        moveTo: ALL_PARAMS,
        lineTo: ALL_PARAMS,
        arc: [0, 1, 2],
        arcTo: ALL_PARAMS,
        bezierCurveTo: ALL_PARAMS,
        isPointInPath: ALL_PARAMS,
        isPointInStroke: ALL_PARAMS,
        quadraticCurveTo: ALL_PARAMS,
        rect: ALL_PARAMS,
        translate: ALL_PARAMS,
        createRadialGradient: ALL_PARAMS,
        createLinearGradient: ALL_PARAMS,
    };
    /**
     *
     * @author alawnxu
     * @date 2022-07-21 21:28:20
     */
    var CanvasUtil = /** @class */ (function () {
        function CanvasUtil() {
        }
        /**
         * 裁剪区域
         */
        CanvasUtil.clipRect = function (context, rect) {
            context.beginPath();
            context.rect(rect.getLeft(), rect.getTop(), rect.Width(), rect.Height());
            context.clip();
            context.closePath();
        };
        /**
         * 根据ratio重新设置Canvas尺寸.解决绘制模糊的BUG
         * @param canvas
         * @param context
         * @param devicePixelRatio 设备像素比
         * @description 需要注意的是不能在 Worker 中运行
         */
        CanvasUtil.wrapperCanvas = function (canvas, context, devicePixelRatio) {
            var width = canvas.width;
            var height = canvas.height;
            if (devicePixelRatio === 1) {
                return;
            }
            canvas.width = width * devicePixelRatio;
            canvas.height = height * devicePixelRatio;
            canvas.style.width = "".concat(width, "px");
            canvas.style.height = "".concat(height, "px");
            context.clearRect = (function (originMethod) {
                return function (x, y, w, h) {
                    originMethod.apply(context, [
                        x * devicePixelRatio,
                        y * devicePixelRatio,
                        w * devicePixelRatio,
                        h * devicePixelRatio,
                    ]);
                };
            })(context.clearRect);
        };
        /**
         * 重写某一个实例的canvas带有size的方法.解决绘制模糊的BUG
         * @param devicePixelRatio 设备像素比
         * @param context
         * @description 需要注意这里可能运行在 Worker 中, 所以这里强制传入 devicePixelRatio
         */
        CanvasUtil.wrapperCanvasRenderingContext2D = function (devicePixelRatio, context) {
            if (devicePixelRatio === 1) {
                return;
            }
            Object.keys(WrapperMethods).forEach(function (method) {
                context[method] = (function (originMethod) {
                    return function () {
                        var e_1, _a;
                        var params = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            params[_i] = arguments[_i];
                        }
                        var value = WrapperMethods[method];
                        if (value === ALL_PARAMS) {
                            params = params.map(function (a) { return a * devicePixelRatio; });
                        }
                        else if (Array.isArray(value)) {
                            try {
                                for (var value_1 = __values(value), value_1_1 = value_1.next(); !value_1_1.done; value_1_1 = value_1.next()) {
                                    var index = value_1_1.value;
                                    params[index] *= devicePixelRatio;
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (value_1_1 && !value_1_1.done && (_a = value_1.return)) _a.call(value_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                        }
                        originMethod.apply(context, params);
                    };
                })(context[method]);
            });
            CanvasUtil.wrapperStroke(devicePixelRatio, context);
            CanvasUtil.wrapperFillText(devicePixelRatio, context);
            CanvasUtil.wrapperStrokeText(devicePixelRatio, context);
            CanvasUtil.wrapperDrawImage(devicePixelRatio, context);
        };
        /**
         * 处理stroke
         * @param devicePixelRatio
         * @param context
         */
        CanvasUtil.wrapperStroke = function (devicePixelRatio, context) {
            context.stroke = (function (originMethod) {
                return function () {
                    var params = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        params[_i] = arguments[_i];
                    }
                    context.lineWidth *= devicePixelRatio;
                    originMethod.apply(context, params);
                    context.lineWidth /= devicePixelRatio;
                };
            })(context.stroke);
        };
        /**
         * 处理fillText
         * @param devicePixelRatio
         * @param context
         */
        CanvasUtil.wrapperFillText = function (devicePixelRatio, context) {
            context.fillText = (function (originMethod) {
                return function () {
                    var params = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        params[_i] = arguments[_i];
                    }
                    params[1] *= devicePixelRatio;
                    params[2] *= devicePixelRatio;
                    context.font = context.font.replace(/(\d+)(px|em|rem|pt)/g, function (w, m, u) {
                        return m * devicePixelRatio + u;
                    });
                    originMethod.apply(context, params);
                    context.font = context.font.replace(/(\d+)(px|em|rem|pt)/g, function (w, m, u) {
                        return m / devicePixelRatio + u;
                    });
                };
            })(context.fillText);
        };
        /**
         * 处理strokeText
         * @param devicePixelRatio
         * @param context
         */
        CanvasUtil.wrapperStrokeText = function (devicePixelRatio, context) {
            var _this = this;
            context.strokeText = (function (originMethod) {
                return function () {
                    var params = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        params[_i] = arguments[_i];
                    }
                    params[1] *= devicePixelRatio;
                    params[2] *= devicePixelRatio;
                    context.font = context.font.replace(/(\d+)(px|em|rem|pt)/g, function (w, m, u) {
                        return m * devicePixelRatio + u;
                    });
                    originMethod.apply(_this, params);
                    context.font = context.font.replace(/(\d+)(px|em|rem|pt)/g, function (w, m, u) {
                        return m / devicePixelRatio + u;
                    });
                };
            })(context.strokeText);
        };
        /**
         * 处理drawImage
         * @param devicePixelRatio
         * @param context
         */
        CanvasUtil.wrapperDrawImage = function (devicePixelRatio, context) {
            context.drawImage = (function (originMethod) {
                return function (image) {
                    var params = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        params[_i - 1] = arguments[_i];
                    }
                    params = params.map(function (a) { return a * devicePixelRatio; });
                    if (params.length === 4) {
                        if (params[2] === 0 || params[3] === 0) {
                            return;
                        }
                    }
                    originMethod.apply(context, __spreadArray([image], __read(params), false));
                };
            })(context.drawImage);
        };
        return CanvasUtil;
    }());

    /**
     * @fileoverview 通过Storage模拟cookie的存储
     * @author alawnxu
     * @date 2022-08-12 14:30:49
     * @version 1.0.0
     */
    var logger$2$1 = Logger.getLogger('CookieStorage');
    var CookieStorage = /** @class */ (function () {
        function CookieStorage() {
        }
        /**
         * 存储cookie
         * @param name cookie名称
         * @param value cookie值
         * @param expirationDate 为undefined的时候表示不过期
         */
        CookieStorage.setCookie = function (name, value, expirationDate) {
            logger$2$1.debug(name, value, expirationDate);
            StorageUtil.setItem(name, {
                value: value,
                expirationDate: expirationDate ? expirationDate.getTime() : 0,
            });
        };
        /**
         * 获取Cookie
         * @param name
         */
        CookieStorage.getCookie = function (name) {
            if (!name) {
                return '';
            }
            var key = typeof name === 'string' ? name.trim() : String(name);
            if (!key) {
                return '';
            }
            var res = StorageUtil.getItem(name);
            if (!res) {
                return '';
            }
            if (typeof res === 'string') {
                return res;
            }
            if (typeof res === 'object') {
                var value = res.value, expirationDate = res.expirationDate;
                if (expirationDate >= Date.now()) {
                    return value;
                }
            }
            return '';
        };
        return CookieStorage;
    }());
    /**
     * 获取cookie
     * @param {String} name
     */
    function getCookie(name) {
        var m = document.cookie.match(new RegExp("(^| )".concat(name, "=([^;]*)(;|$)")));
        return !m ? '' : decodeURIComponent(m[2]);
    }
    var SKEY_COOKIE_NAME = 'skey';
    var PSKEY_COOKIE_NAME = 'p_skey';
    /**
     * 获取Skey
     */
    function getSkeyCookie() {
        return getCookie(SKEY_COOKIE_NAME);
    }
    /**
     * 获取Pskey
     */
    function getPskeyCookie() {
        return getCookie(PSKEY_COOKIE_NAME);
    }

    var regMac = /(Mac|iPhone|iPod|iPad)/i;
    var regLinux = /Linux/i;
    var PlatformEnum;
    (function (PlatformEnum) {
        PlatformEnum["MAC"] = "Mac";
        PlatformEnum["LINUX"] = "Linux";
        PlatformEnum["WINDOWS"] = "Windows";
        PlatformEnum["UNKNOWN"] = "PC";
    })(PlatformEnum || (PlatformEnum = {}));
    var logger$1$1 = Logger.getLogger('Platform');
    function getPlatform() {
        try {
            if (regMac.test(navigator.platform)) {
                return PlatformEnum.MAC;
            }
            if (regLinux.test(navigator.platform)) {
                return PlatformEnum.LINUX;
            }
            return PlatformEnum.WINDOWS;
        }
        catch (e) {
            logger$1$1.error('navigator.platform not supported');
        }
        return PlatformEnum.UNKNOWN;
    }

    var ImageUtil = /** @class */ (function () {
        function ImageUtil() {
        }
        /**
         * 通过 ObjectURL 获取 blob
         * @param objectUrl
         * @description 类似从本地获取
         */
        ImageUtil.objectUrlToBlob = function (objectUrl) {
            return __awaiter(this, void 0, void 0, function () {
                var response, blob;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!objectUrl) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, fetch(objectUrl)];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.blob()];
                        case 2:
                            blob = _a.sent();
                            return [2 /*return*/, blob];
                    }
                });
            });
        };
        /**
         * 加载图片
         * @param url
         */
        ImageUtil.load = function (url) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (Env.isWorker) {
                    reject(new Error('ENV_ERROR'));
                    return;
                }
                var requestUrl = toHttps(url);
                // @TODO 这种写法有点不太优雅. 晚点再看看怎么通过 image 获取 blob
                fetch(requestUrl)
                    .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                    var blob, image, release;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, response.blob()];
                            case 1:
                                blob = _a.sent();
                                image = new Image();
                                release = function () {
                                    image.onload = null;
                                    image.onerror = null;
                                    image = null;
                                };
                                image.onload = function () { return __awaiter(_this, void 0, void 0, function () {
                                    var width, height;
                                    return __generator(this, function (_a) {
                                        width = image.width, height = image.height;
                                        resolve({
                                            blob: blob,
                                            width: width,
                                            height: height,
                                        });
                                        release();
                                        return [2 /*return*/];
                                    });
                                }); };
                                image.onerror = function (e) {
                                    reject(e);
                                    release();
                                };
                                image.src = url;
                                return [2 /*return*/];
                        }
                    });
                }); })
                    .catch(function (e) {
                    reject(e);
                });
            });
        };
        return ImageUtil;
    }());

    /**
     * @fileoverview 图片存储
     * @author alawnxu
     * @date 2022-09-07 22:17:57
     * @version 1.0.0
     * @description 这里暂时先用 objectUrl 存储, 后续看情况可以换成本地存储
     */
    // 默认图片过期时间
    var DEFAULT_IMAGE_EXPIRED_TIME = 30 * 60 * 1000;
    var ImageStorage = /** @class */ (function () {
        function ImageStorage() {
        }
        ImageStorage.set = function (url, objectUrl) {
            if (!url || !objectUrl) {
                return;
            }
            ImageStorage.storeMap.set(url, {
                objectUrl: objectUrl,
                createTime: Date.now(),
            });
            this.clearExpiredImage();
        };
        /**
         * 获取缓存的图片
         * @param url
         */
        ImageStorage.get = function (url) {
            if (!url) {
                return '';
            }
            var data = ImageStorage.storeMap.get(url);
            return (data === null || data === void 0 ? void 0 : data.objectUrl) || '';
        };
        /**
         * 清理过期的图片
         */
        ImageStorage.clearExpiredImage = function () {
            var _this = this;
            if (ImageStorage.timer) {
                return;
            }
            ImageStorage.timer = setTimeout(function () {
                ImageStorage.storeMap.forEach(function (data, url) {
                    var createTime = data.createTime, objectUrl = data.objectUrl;
                    if (Date.now() - createTime >= DEFAULT_IMAGE_EXPIRED_TIME) {
                        ImageStorage.storeMap.delete(url);
                        URL.revokeObjectURL(objectUrl);
                    }
                });
                ImageStorage.timer = null;
                _this.clearExpiredImage();
            }, DEFAULT_IMAGE_EXPIRED_TIME);
        };
        ImageStorage.storeMap = new Map();
        return ImageStorage;
    }());

    /**
     * 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     */
    /**
     * @fileoverview 针对 Web 版 Http 请求做的进一步封装
     * @author alawnxu
     * @date 2022-08-19 16:14:30
     * @version 1.0.0
     */
    var DEFAULT_STATUS_CODE = 0;
    var IMAGE_SUCCESS_STATUS_CODE = 200;
    var IMAGE_MIME_PREFIX = 'image/';
    var logger$B = Logger.getLogger('BaseHttp');
    var BaseHttp = /** @class */ (function (_super) {
        __extends(BaseHttp, _super);
        function BaseHttp(app) {
            var _this = _super.call(this, app) || this;
            _this.status = DEFAULT_STATUS_CODE;
            _this.responseText = '';
            _this.cachePath = '';
            /**
             * 请求的cookie数据
             */
            _this.cookies = [];
            _this.controller = new AbortController();
            _this.cookies = [];
            return _this;
        }
        /**
         * 获取缓存的路径
         */
        BaseHttp.prototype.GetCachePath = function () {
            return this.cachePath;
        };
        /**
         * 异步Post表单
         * @param name
         * @param url Url地址
         * @param file 上传文件在表单中的字段名（非文件名）
         * @param filePath 上传文件的路径，file与filePath必须同时使用
         * @param formData 额外的表单数据，
         * @description
         * file/filePath与formData至少有一个不为空，两者也可以同时存在, 无论是否上传文件，表单都会以`multipart/formdata`格式上传
         */
        BaseHttp.prototype.PostForm = function () {
            throw new Error('Method not implemented');
        };
        /**
         * 设置Cookie信息
         * @param cookie 要设置的cookie，格式为“name=value”
         * @TODO 这里可能会影响到原本业务设置的cookie?
         */
        BaseHttp.prototype.SetCookie = function (cookie) {
            var cookies = [];
            cookie.split(';').forEach(function (item) {
                var _a = __read(item.split('='), 2), name = _a[0], value = _a[1];
                if (!name) {
                    return;
                }
                // 这里需要过滤下前后空格. skey=xxx; x=12;
                cookies.push({
                    name: name.trim(),
                    value: value,
                });
            });
            this.cookies = cookies;
        };
        /**
         * 获取Http响应码，如200、404
         */
        BaseHttp.prototype.GetStatusCode = function () {
            return this.status;
        };
        /**
         * 取消当前请求
         */
        BaseHttp.prototype.Abort = function () {
            var controller = this.controller;
            if (!controller) {
                logger$B.warn('controller is null');
                return;
            }
            if (controller.signal.aborted) {
                logger$B.warn('request aborted.');
                return;
            }
            controller.abort();
            logger$B.info('request aborted.');
        };
        /**
         * 获取返回的数据
         * @param mimeType 数据类型(支持的类型包括：文本（text/plain），JSON（application/json），XML（text/xml） 如果不指定类型，取Http头中的Content-Type字段作为数据类型
         * @description 可将XML、JSON自动转换为table供脚本访问
         */
        BaseHttp.prototype.GetData = function (mimeType) {
            var responseText = this.responseText;
            var contentType = mimeType || this.GetHeader('Content-Type');
            if (!contentType) {
                return this.responseText;
            }
            if (contentType.toLowerCase().indexOf(MimeTypeEnum.JSON) !== -1) {
                try {
                    if (this.responseText && typeof this.responseText === 'object') {
                        return this.responseText;
                    }
                    return JSON.parse(this.responseText);
                }
                catch (e) {
                    logger$B.error('JSON.parse error.', e);
                    return {};
                }
            }
            // @TODO 请注意.这里没有经过测试.暂时没有场景
            if (contentType.toLowerCase().indexOf(MimeTypeEnum.XML) !== -1) {
                try {
                    return new DOMParser().parseFromString(responseText, 'text/xml');
                }
                catch (e) {
                    logger$B.error('XML Parser error.', e);
                    return null;
                }
            }
            return this.responseText;
        };
        /**
         * 发送请求
         * @description 自定义拓展方法
         */
        BaseHttp.prototype.Request = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, url, method, headers, data, objectUrl, isProxy, params, response, responseText, e_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this, url = _a.url, method = _a.method, headers = _a.headers, data = _a.data;
                            objectUrl = ImageStorage.get(url);
                            if (objectUrl) {
                                logger$B.debug('hit image cache:', url, objectUrl);
                                this.cachePath = objectUrl;
                                return [2 /*return*/, {
                                        status: IMAGE_SUCCESS_STATUS_CODE,
                                        success: true,
                                    }];
                            }
                            return [4 /*yield*/, this.SetApplicationCookie()];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, this.HttpProxy()];
                        case 2:
                            isProxy = _b.sent();
                            if (isProxy) {
                                return [2 /*return*/];
                            }
                            params = {
                                method: method,
                                headers: headers,
                                // 允许携带cookie.这里只用做浏览器端调试
                                credentials: 'include',
                            };
                            if (method === HttpMethodEnum.POST) {
                                params.body = data;
                            }
                            return [4 /*yield*/, fetch(url, params)];
                        case 3:
                            response = _b.sent();
                            if (!this.IsImage(response)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.ImageStorage(response)];
                        case 4:
                            _b.sent();
                            return [2 /*return*/, {
                                    status: response.status,
                                    success: response.ok,
                                }];
                        case 5:
                            _b.trys.push([5, 8, , 9]);
                            if (!response.ok) return [3 /*break*/, 7];
                            return [4 /*yield*/, response.text()];
                        case 6:
                            responseText = _b.sent();
                            this.responseText = responseText;
                            _b.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            e_1 = _b.sent();
                            this.responseText = '';
                            logger$B.error("response.text() fail.", e_1);
                            return [3 /*break*/, 9];
                        case 9:
                            this.status = response.status;
                            return [2 /*return*/, {
                                    status: response.status,
                                    success: response.ok,
                                }];
                    }
                });
            });
        };
        /**
         * proxy处理
         * @description 用作本地接口调试,数据模拟
         */
        BaseHttp.prototype.HttpProxy = function () {
            return __awaiter(this, void 0, void 0, function () {
                var applicationContext, httpProxy, proxy, _a, status_1, success, data;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            applicationContext = this.GetApplicationContext();
                            httpProxy = applicationContext.getHttpProxy();
                            if (!(typeof httpProxy === 'function')) return [3 /*break*/, 2];
                            proxy = httpProxy(this.GetUrl());
                            if (!(proxy && typeof proxy.then === 'function')) return [3 /*break*/, 2];
                            return [4 /*yield*/, proxy];
                        case 1:
                            _a = _b.sent(), status_1 = _a.status, success = _a.success, data = _a.data;
                            this.errorCode = HttpErrorCodeEnum.ARK_HTTP_CLIENT_ERROR_OK;
                            this.responseText = JSON.stringify(data);
                            return [2 /*return*/, {
                                    status: status_1,
                                    success: success,
                                }];
                        case 2: return [2 /*return*/, false];
                    }
                });
            });
        };
        /**
         * 设置Cookie
         * @description 这里需要等发送请求的时候再设置cookie.因为有些 Ark 消息在没有发送请求的时候就设置了 cookie.但是此时并不知道 requestUrl
         */
        BaseHttp.prototype.SetApplicationCookie = function () {
            return __awaiter(this, void 0, void 0, function () {
                var applicationContext, _a, url, cookies, urlObj, cookieUrl_1, e_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            applicationContext = this.GetApplicationContext();
                            _a = this, url = _a.url, cookies = _a.cookies;
                            urlObj = new URL(url);
                            cookieUrl_1 = urlObj.origin;
                            return [4 /*yield*/, applicationContext.setCookie(cookies.map(function (cookie) {
                                    return __assign({ url: cookieUrl_1 }, cookie);
                                }))];
                        case 1:
                            _b.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            e_2 = _b.sent();
                            logger$B.error('SetCookie error.', e_2);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 判断是否为图片
         * @see {@link https://www.iana.org/assignments/media-types/media-types.xhtml#image
         */
        BaseHttp.prototype.IsImage = function (response) {
            var contentType = this.GetHeader(CONTENT_TYPE_HEADER);
            if (contentType === null || contentType === void 0 ? void 0 : contentType.toLowerCase().startsWith(IMAGE_MIME_PREFIX)) {
                return true;
            }
            var responseContentType = response.headers.get(CONTENT_TYPE_HEADER);
            if (responseContentType === null || responseContentType === void 0 ? void 0 : responseContentType.toLowerCase().startsWith(IMAGE_MIME_PREFIX)) {
                return true;
            }
            return false;
        };
        /**
         * 存储图片
         * @description 后面酌情看下是否需要存本地
         * @description 如果失败了.那么直接用原来的url作为存储路径.因为后面还是会走 new Image() 的方式重新加载
         */
        BaseHttp.prototype.ImageStorage = function (response) {
            return __awaiter(this, void 0, void 0, function () {
                var blob, objectUrl, e_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            logger$B.debug('ImageStorage(response), response:', response);
                            return [4 /*yield*/, response.blob()];
                        case 1:
                            blob = _a.sent();
                            objectUrl = URL.createObjectURL(blob);
                            ImageStorage.set(this.url, objectUrl);
                            this.cachePath = objectUrl;
                            return [3 /*break*/, 3];
                        case 2:
                            e_3 = _a.sent();
                            logger$B.error('ImageStorage fail.', e_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return BaseHttp;
    }(Http));

    /**
     * yoga枚举
     * @author alawnxu
     * @date 2022-08-16 11:01:13
     * @version 1.0.0
     */
    var YogaConstant;
    (function (YogaConstant) {
        YogaConstant[YogaConstant["ALIGN_AUTO"] = 0] = "ALIGN_AUTO";
        YogaConstant[YogaConstant["ALIGN_COUNT"] = 8] = "ALIGN_COUNT";
        YogaConstant[YogaConstant["ALIGN_FLEX_START"] = 1] = "ALIGN_FLEX_START";
        YogaConstant[YogaConstant["ALIGN_CENTER"] = 2] = "ALIGN_CENTER";
        YogaConstant[YogaConstant["ALIGN_FLEX_END"] = 3] = "ALIGN_FLEX_END";
        YogaConstant[YogaConstant["ALIGN_STRETCH"] = 4] = "ALIGN_STRETCH";
        YogaConstant[YogaConstant["ALIGN_BASELINE"] = 5] = "ALIGN_BASELINE";
        YogaConstant[YogaConstant["ALIGN_SPACE_BETWEEN"] = 6] = "ALIGN_SPACE_BETWEEN";
        YogaConstant[YogaConstant["ALIGN_SPACE_AROUND"] = 7] = "ALIGN_SPACE_AROUND";
        YogaConstant[YogaConstant["DIMENSION_COUNT"] = 2] = "DIMENSION_COUNT";
        YogaConstant[YogaConstant["DIMENSION_WIDTH"] = 0] = "DIMENSION_WIDTH";
        YogaConstant[YogaConstant["DIMENSION_HEIGHT"] = 1] = "DIMENSION_HEIGHT";
        YogaConstant[YogaConstant["DIRECTION_COUNT"] = 3] = "DIRECTION_COUNT";
        YogaConstant[YogaConstant["DIRECTION_INHERIT"] = 0] = "DIRECTION_INHERIT";
        YogaConstant[YogaConstant["DIRECTION_LTR"] = 1] = "DIRECTION_LTR";
        YogaConstant[YogaConstant["DIRECTION_RTL"] = 2] = "DIRECTION_RTL";
        YogaConstant[YogaConstant["DISPLAY_COUNT"] = 2] = "DISPLAY_COUNT";
        YogaConstant[YogaConstant["DISPLAY_FLEX"] = 0] = "DISPLAY_FLEX";
        YogaConstant[YogaConstant["DISPLAY_NONE"] = 1] = "DISPLAY_NONE";
        YogaConstant[YogaConstant["EDGE_COUNT"] = 9] = "EDGE_COUNT";
        YogaConstant[YogaConstant["EDGE_LEFT"] = 0] = "EDGE_LEFT";
        YogaConstant[YogaConstant["EDGE_TOP"] = 1] = "EDGE_TOP";
        YogaConstant[YogaConstant["EDGE_RIGHT"] = 2] = "EDGE_RIGHT";
        YogaConstant[YogaConstant["EDGE_BOTTOM"] = 3] = "EDGE_BOTTOM";
        YogaConstant[YogaConstant["EDGE_START"] = 4] = "EDGE_START";
        YogaConstant[YogaConstant["EDGE_END"] = 5] = "EDGE_END";
        YogaConstant[YogaConstant["EDGE_HORIZONTAL"] = 6] = "EDGE_HORIZONTAL";
        YogaConstant[YogaConstant["EDGE_VERTICAL"] = 7] = "EDGE_VERTICAL";
        YogaConstant[YogaConstant["EDGE_ALL"] = 8] = "EDGE_ALL";
        YogaConstant[YogaConstant["EXPERIMENTAL_FEATURE_COUNT"] = 1] = "EXPERIMENTAL_FEATURE_COUNT";
        YogaConstant[YogaConstant["EXPERIMENTAL_FEATURE_WEB_FLEX_BASIS"] = 0] = "EXPERIMENTAL_FEATURE_WEB_FLEX_BASIS";
        YogaConstant[YogaConstant["FLEX_DIRECTION_COUNT"] = 4] = "FLEX_DIRECTION_COUNT";
        YogaConstant[YogaConstant["FLEX_DIRECTION_COLUMN"] = 0] = "FLEX_DIRECTION_COLUMN";
        YogaConstant[YogaConstant["FLEX_DIRECTION_COLUMN_REVERSE"] = 1] = "FLEX_DIRECTION_COLUMN_REVERSE";
        YogaConstant[YogaConstant["FLEX_DIRECTION_ROW"] = 2] = "FLEX_DIRECTION_ROW";
        YogaConstant[YogaConstant["FLEX_DIRECTION_ROW_REVERSE"] = 3] = "FLEX_DIRECTION_ROW_REVERSE";
        YogaConstant[YogaConstant["JUSTIFY_COUNT"] = 6] = "JUSTIFY_COUNT";
        YogaConstant[YogaConstant["JUSTIFY_FLEX_START"] = 0] = "JUSTIFY_FLEX_START";
        YogaConstant[YogaConstant["JUSTIFY_CENTER"] = 1] = "JUSTIFY_CENTER";
        YogaConstant[YogaConstant["JUSTIFY_FLEX_END"] = 2] = "JUSTIFY_FLEX_END";
        YogaConstant[YogaConstant["JUSTIFY_SPACE_BETWEEN"] = 3] = "JUSTIFY_SPACE_BETWEEN";
        YogaConstant[YogaConstant["JUSTIFY_SPACE_AROUND"] = 4] = "JUSTIFY_SPACE_AROUND";
        YogaConstant[YogaConstant["JUSTIFY_SPACE_EVENLY"] = 5] = "JUSTIFY_SPACE_EVENLY";
        YogaConstant[YogaConstant["LOG_LEVEL_COUNT"] = 6] = "LOG_LEVEL_COUNT";
        YogaConstant[YogaConstant["LOG_LEVEL_ERROR"] = 0] = "LOG_LEVEL_ERROR";
        YogaConstant[YogaConstant["LOG_LEVEL_WARN"] = 1] = "LOG_LEVEL_WARN";
        YogaConstant[YogaConstant["LOG_LEVEL_INFO"] = 2] = "LOG_LEVEL_INFO";
        YogaConstant[YogaConstant["LOG_LEVEL_DEBUG"] = 3] = "LOG_LEVEL_DEBUG";
        YogaConstant[YogaConstant["LOG_LEVEL_VERBOSE"] = 4] = "LOG_LEVEL_VERBOSE";
        YogaConstant[YogaConstant["LOG_LEVEL_FATAL"] = 5] = "LOG_LEVEL_FATAL";
        YogaConstant[YogaConstant["MEASURE_MODE_COUNT"] = 3] = "MEASURE_MODE_COUNT";
        YogaConstant[YogaConstant["MEASURE_MODE_UNDEFINED"] = 0] = "MEASURE_MODE_UNDEFINED";
        YogaConstant[YogaConstant["MEASURE_MODE_EXACTLY"] = 1] = "MEASURE_MODE_EXACTLY";
        YogaConstant[YogaConstant["MEASURE_MODE_AT_MOST"] = 2] = "MEASURE_MODE_AT_MOST";
        YogaConstant[YogaConstant["NODE_TYPE_COUNT"] = 2] = "NODE_TYPE_COUNT";
        YogaConstant[YogaConstant["NODE_TYPE_DEFAULT"] = 0] = "NODE_TYPE_DEFAULT";
        YogaConstant[YogaConstant["NODE_TYPE_TEXT"] = 1] = "NODE_TYPE_TEXT";
        YogaConstant[YogaConstant["OVERFLOW_COUNT"] = 3] = "OVERFLOW_COUNT";
        YogaConstant[YogaConstant["OVERFLOW_VISIBLE"] = 0] = "OVERFLOW_VISIBLE";
        YogaConstant[YogaConstant["OVERFLOW_HIDDEN"] = 1] = "OVERFLOW_HIDDEN";
        YogaConstant[YogaConstant["OVERFLOW_SCROLL"] = 2] = "OVERFLOW_SCROLL";
        YogaConstant[YogaConstant["POSITION_TYPE_COUNT"] = 2] = "POSITION_TYPE_COUNT";
        YogaConstant[YogaConstant["POSITION_TYPE_RELATIVE"] = 0] = "POSITION_TYPE_RELATIVE";
        YogaConstant[YogaConstant["POSITION_TYPE_ABSOLUTE"] = 1] = "POSITION_TYPE_ABSOLUTE";
        YogaConstant[YogaConstant["PRINT_OPTIONS_COUNT"] = 3] = "PRINT_OPTIONS_COUNT";
        YogaConstant[YogaConstant["PRINT_OPTIONS_LAYOUT"] = 1] = "PRINT_OPTIONS_LAYOUT";
        YogaConstant[YogaConstant["PRINT_OPTIONS_STYLE"] = 2] = "PRINT_OPTIONS_STYLE";
        YogaConstant[YogaConstant["PRINT_OPTIONS_CHILDREN"] = 4] = "PRINT_OPTIONS_CHILDREN";
        YogaConstant[YogaConstant["UNIT_COUNT"] = 4] = "UNIT_COUNT";
        YogaConstant[YogaConstant["UNIT_UNDEFINED"] = 0] = "UNIT_UNDEFINED";
        YogaConstant[YogaConstant["UNIT_POINT"] = 1] = "UNIT_POINT";
        YogaConstant[YogaConstant["UNIT_PERCENT"] = 2] = "UNIT_PERCENT";
        YogaConstant[YogaConstant["UNIT_AUTO"] = 3] = "UNIT_AUTO";
        YogaConstant[YogaConstant["WRAP_COUNT"] = 3] = "WRAP_COUNT";
        YogaConstant[YogaConstant["WRAP_NO_WRAP"] = 0] = "WRAP_NO_WRAP";
        YogaConstant[YogaConstant["WRAP_WRAP"] = 1] = "WRAP_WRAP";
        YogaConstant[YogaConstant["WRAP_WRAP_REVERSE"] = 2] = "WRAP_WRAP_REVERSE";
    })(YogaConstant || (YogaConstant = {}));

    /**
     * 节点管理
     * @author alawnxu
     * @date 2022-07-11 21:09:11
     * @version 1.0.0
     */
    var YogaNodeManager = /** @class */ (function () {
        function YogaNodeManager() {
        }
        YogaNodeManager.AddUIObject = function (node, uiObject) {
            if (!node || !uiObject) {
                return false;
            }
            YogaNodeManager.nodeMap.set(node, uiObject);
        };
        YogaNodeManager.GetUIObject = function (node) {
            if (!node) {
                return null;
            }
            return YogaNodeManager.nodeMap.get(node);
        };
        YogaNodeManager.RemoveUIObject = function (node) {
            if (!node) {
                return;
            }
            YogaNodeManager.nodeMap.delete(node);
        };
        YogaNodeManager.nodeMap = new Map();
        return YogaNodeManager;
    }());

    var YogaValueUndefined = {
        unit: YogaConstant.UNIT_UNDEFINED,
        value: 0,
    };
    /**
     * 测量文本和图片的大小，当执行 YGNodeCalculateLayout 的时候会触发该测量方法.
     *
     * @description
     * 当元素的宽度和高度模式是都是固定( YGMeasureModeExactly )的时候.则不会进测量逻辑.会直接使用确切的宽高(availableWidth - marginAxisRow)  但是会确保宽高在限制的阈值内
     *
     * 只有当元素的宽高不确定的时候.才需要走测量逻辑, 测量传入的可用宽高是去除了边框和边距的。这个方法接收四个参数：(与Native不一样. Native第一个参数是Node节点)
     * @param width
     * @param widthMode
     * @param height
     * @param heightMode
     *
     * 最后如果模式是确切的.则会使用确切值(availableWidth-marginAxisRow).否则才会使用测量值.
     *
     * 切换为全局的方法,防止uiObject被持有无法释放导致内存溢出
     *
     */
    function MeasureSize(yogaNode, width, widthMode, height) {
        var uiObject = YogaNodeManager.GetUIObject(yogaNode);
        if (!uiObject) {
            return { width: 0, height: 0 };
        }
        var size = {
            width: NaN,
            height: NaN,
        };
        var styleWidth = yogaNode.width;
        var styleHeight = yogaNode.height;
        switch (styleWidth.unit.value) {
            case YogaConstant.UNIT_PERCENT:
                size.width = (width / 100.0) * styleWidth.value;
                break;
            case YogaConstant.UNIT_POINT:
                size.width = styleWidth.value;
                break;
            default:
                break;
        }
        switch (styleHeight.unit.value) {
            case YogaConstant.UNIT_PERCENT:
                size.height = (height / 100.0) * styleHeight.value;
                break;
            case YogaConstant.UNIT_POINT:
                size.height = styleHeight.value;
                break;
            default:
                break;
        }
        if (uiObject.IsType(NodeTypeEnum.IMAGE)) {
            var sizeObj = uiObject.MeasureSize();
            if (Number.isNaN(size.width) && Number.isNaN(size.height)) {
                size.width = sizeObj.GetWidth();
                size.height = sizeObj.GetHeight();
            }
            else if (Number.isNaN(size.width)) {
                if (sizeObj.GetHeight() !== 0) {
                    size.width = (sizeObj.GetWidth() / sizeObj.GetHeight()) * size.height;
                }
                else {
                    size.width = 0;
                }
            }
            else if (Number.isNaN(size.height)) {
                if (sizeObj.GetWidth() !== 0) {
                    size.height = (sizeObj.GetHeight() / sizeObj.GetWidth()) * size.width;
                }
                else {
                    size.height = 0;
                }
            }
        }
        else if (uiObject.IsType(NodeTypeEnum.TEXT)) {
            var sizeObj = new ARKSize();
            // 如果已经计算出宽高,那么测量的时候按照给定的宽度和高度计算
            if (!Number.isNaN(size.width)) {
                sizeObj.SetWidth(size.width);
            }
            if (!Number.isNaN(size.height)) {
                sizeObj.SetHeight(size.height);
            }
            sizeObj = uiObject.MeasureSize(sizeObj);
            if (Number.isNaN(size.width)) {
                size.width = sizeObj.GetWidth();
            }
            if (Number.isNaN(size.height)) {
                size.height = sizeObj.GetHeight();
            }
        }
        return size;
    }

    /**
     * @fileoverview 属性计算
     * @author alawnxu
     * @date 2022-07-31 19:27:07
     * @version 1.0.0
     */
    var logger$A = Logger.getLogger('Calculate');
    var Calculate = /** @class */ (function () {
        function Calculate() {
        }
        /**
         * @TODO 晚点再实现
         */
        Calculate.cal = function (value) {
            logger$A.warn('value:', value);
            return YogaValueUndefined;
        };
        return Calculate;
    }());

    /**
     * @fileoverview Unit工具方法
     * @author alawnxu
     * @date 2022-07-31 19:27:07
     * @version 1.0.0
     */
    var CONVERT_RATE = 0.75;
    /**
     * 视窗宽度先写死750, windows设计宽度不太确定
     */
    var SCREEN_WIDTH = 750 >> 1;
    var SCREEN_HEIGHT = 1334 >> 1;
    function pointConvertToPixelValue(point) {
        var value = +point;
        if (!isNumber(value)) {
            return 0;
        }
        if (isNaN(value)) {
            return 0;
        }
        return value * CONVERT_RATE;
    }
    function viewPointWidthConvertToPixelValue(vw) {
        var value = +vw;
        if (!isNumber(value)) {
            return 0;
        }
        if (isNaN(value)) {
            return 0;
        }
        return (value / 100) * SCREEN_WIDTH;
    }
    function viewPointHeightConvertToPixelValue(vw) {
        var value = +vw;
        if (!isNumber(value)) {
            return 0;
        }
        if (isNaN(value)) {
            return 0;
        }
        return (value / 100) * SCREEN_HEIGHT;
    }

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     * @description 自定义拓展方法请以小写开头的驼峰命名.
     */
    /**
     * @fileoverview 转换值
     * @author alawnxu
     * @date 2022-07-31 19:27:07
     * @version 1.0.0
     */
    var logger$z = Logger.getLogger('ConvertToValue');
    var ConvertToValue = /** @class */ (function () {
        function ConvertToValue() {
        }
        /**
         * 将一个string值转换为Yoga Value
         * @param value
         * @example
         * ConvertToValue.stringToYogaValue('12px')
         * @description 默认为像素
         */
        ConvertToValue.stringToYogaValue = function (value) {
            if (isNumber(value)) {
                return {
                    unit: YogaConstant.UNIT_POINT,
                    value: value,
                };
            }
            if (typeof value !== 'string') {
                return YogaValueUndefined;
            }
            var valueStr = value.trim();
            if (!valueStr) {
                return YogaValueUndefined;
            }
            if (value.indexOf('calc') !== -1) {
                return Calculate.cal(value);
            }
            if (value === 'auto') {
                return {
                    unit: YogaConstant.UNIT_AUTO,
                    value: 10,
                };
            }
            if (value.endsWith('%')) {
                var percentValue = +value.substring(0, value.length - 1);
                if (isNaN(percentValue)) {
                    logger$z.warn('invalid percent value:', value);
                    percentValue = 0;
                }
                return {
                    unit: YogaConstant.UNIT_PERCENT,
                    value: percentValue,
                };
            }
            if (value.endsWith('pt')) {
                var pointValue = +value.substring(0, value.length - 2);
                if (isNaN(pointValue)) {
                    logger$z.warn('invalid point value:', value);
                    return YogaValueUndefined;
                }
                return {
                    unit: YogaConstant.UNIT_POINT,
                    value: pointConvertToPixelValue(pointValue),
                };
            }
            if (value.endsWith('vw')) {
                var viewPointWidth = +value.substring(0, value.length - 2);
                if (isNaN(viewPointWidth)) {
                    logger$z.warn('invalid vw value:', value);
                    return YogaValueUndefined;
                }
                return {
                    unit: YogaConstant.UNIT_POINT,
                    value: viewPointWidthConvertToPixelValue(viewPointWidth),
                };
            }
            if (value.endsWith('vh')) {
                var viewPointHeight = +value.substring(0, value.length - 2);
                if (isNaN(viewPointHeight)) {
                    logger$z.warn('invalid vh value:', value);
                    return YogaValueUndefined;
                }
                return {
                    unit: YogaConstant.UNIT_POINT,
                    value: viewPointHeightConvertToPixelValue(viewPointHeight),
                };
            }
            if (value.endsWith('px')) {
                var pixelWidth = +value.substring(0, value.length - 2);
                if (isNaN(pixelWidth)) {
                    logger$z.warn('invalid pixel value:', value);
                    return YogaValueUndefined;
                }
                return {
                    unit: YogaConstant.UNIT_POINT,
                    value: pixelWidth,
                };
            }
            var pixelValue = +value;
            if (isNaN(pixelValue)) {
                logger$z.warn('invalid value:', value);
                return YogaValueUndefined;
            }
            return {
                unit: YogaConstant.UNIT_POINT,
                value: pixelValue,
            };
        };
        return ConvertToValue;
    }());

    var logger$y = Logger.getLogger('YogaNode');
    var YogaNode = /** @class */ (function () {
        function YogaNode(yogaNode) {
            this.yogaNode = yogaNode;
        }
        YogaNode.prototype.setUnitProps = function (propName, propValue) {
            var Yoga = WebApplicationContext.Yoga;
            var _a = ConvertToValue.stringToYogaValue(propValue), unit = _a.unit, value = _a.value;
            var Constants = Yoga.Constants;
            switch (unit) {
                case YogaConstant.UNIT_AUTO:
                    this.yogaNode[propName] = {
                        value: value,
                        unit: Constants.unit.auto,
                    };
                    break;
                case YogaConstant.UNIT_PERCENT:
                    this.yogaNode[propName] = {
                        value: value,
                        unit: Constants.unit.percent,
                    };
                    break;
                case YogaConstant.UNIT_POINT:
                    this.yogaNode[propName] = {
                        value: value,
                        unit: Constants.unit.point,
                    };
                    break;
                default:
            }
        };
        YogaNode.prototype.setAlign = function (propName, align) {
            var Yoga = WebApplicationContext.Yoga;
            switch (align) {
                case YogaConstant.ALIGN_STRETCH:
                    this.yogaNode[propName] = Yoga.Constants.align.stretch;
                    break;
                case YogaConstant.ALIGN_FLEX_START:
                    this.yogaNode[propName] = Yoga.Constants.align['flex-start'];
                    break;
                case YogaConstant.ALIGN_FLEX_END:
                    this.yogaNode[propName] = Yoga.Constants.align['flex-end'];
                    break;
                case YogaConstant.ALIGN_CENTER:
                    this.yogaNode[propName] = Yoga.Constants.align.center;
                    break;
                case YogaConstant.ALIGN_AUTO:
                    this.yogaNode[propName] = Yoga.Constants.align.auto;
                    break;
                case YogaConstant.ALIGN_SPACE_BETWEEN:
                    this.yogaNode[propName] = Yoga.Constants.align['space-between'];
                    break;
                case YogaConstant.ALIGN_SPACE_AROUND:
                    this.yogaNode[propName] = Yoga.Constants.align['space-around'];
                    break;
                case YogaConstant.ALIGN_BASELINE:
                    this.yogaNode[propName] = Yoga.Constants.align.baseline;
                    break;
                default:
            }
        };
        YogaNode.prototype.setWidth = function (width) {
            this.setUnitProps(ARKCssPropertiesEnum.WIDTH, width);
        };
        YogaNode.prototype.setHeight = function (height) {
            this.setUnitProps(ARKCssPropertiesEnum.HEIGHT, height);
        };
        YogaNode.prototype.setMinWidth = function (minWidth) {
            this.setUnitProps(ARKCssPropertiesEnum.MIN_WIDTH, minWidth);
        };
        YogaNode.prototype.setMaxWidth = function (maxWidth) {
            this.setUnitProps(ARKCssPropertiesEnum.MAX_WIDTH, maxWidth);
        };
        YogaNode.prototype.setMinHeight = function (minHeight) {
            this.setUnitProps(ARKCssPropertiesEnum.MIN_HEIGHT, minHeight);
        };
        YogaNode.prototype.setMaxHeight = function (maxHeight) {
            this.setUnitProps(ARKCssPropertiesEnum.MAX_HEIGHT, maxHeight);
        };
        YogaNode.prototype.setMargin = function (edge, edgeValue) {
            switch (edge) {
                case YogaConstant.EDGE_LEFT:
                    this.setUnitProps(ARKCssPropertiesEnum.MARGIN_LEFT, edgeValue);
                    break;
                case YogaConstant.EDGE_TOP:
                    this.setUnitProps(ARKCssPropertiesEnum.MARGIN_TOP, edgeValue);
                    break;
                case YogaConstant.EDGE_RIGHT:
                    this.setUnitProps(ARKCssPropertiesEnum.MARGIN_RIGHT, edgeValue);
                    break;
                case YogaConstant.EDGE_BOTTOM:
                    this.setUnitProps(ARKCssPropertiesEnum.MARGIN_BOTTOM, edgeValue);
                    break;
                default:
            }
        };
        YogaNode.prototype.setPadding = function (edge, edgeValue) {
            switch (edge) {
                case YogaConstant.EDGE_LEFT:
                    this.setUnitProps(ARKCssPropertiesEnum.PADDING_LEFT, edgeValue);
                    break;
                case YogaConstant.EDGE_TOP:
                    this.setUnitProps(ARKCssPropertiesEnum.PADDING_TOP, edgeValue);
                    break;
                case YogaConstant.EDGE_RIGHT:
                    this.setUnitProps(ARKCssPropertiesEnum.PADDING_RIGHT, edgeValue);
                    break;
                case YogaConstant.EDGE_BOTTOM:
                    this.setUnitProps(ARKCssPropertiesEnum.PADDING_BOTTOM, edgeValue);
                    break;
                default:
            }
        };
        YogaNode.prototype.setPosition = function (edge, edgeValue) {
            var _this = this;
            var yogaValue = ConvertToValue.stringToYogaValue(edgeValue);
            var Yoga = WebApplicationContext.Yoga;
            var setProp = function (propName) {
                switch (yogaValue.unit) {
                    case YogaConstant.UNIT_PERCENT:
                        _this.yogaNode[propName] = {
                            value: yogaValue.value,
                            unit: Yoga.Constants.unit.percent,
                        };
                        break;
                    case YogaConstant.UNIT_POINT:
                        _this.yogaNode[propName] = {
                            value: yogaValue.value,
                            unit: Yoga.Constants.unit.point,
                        };
                        break;
                    default:
                }
            };
            switch (edge) {
                case YogaConstant.EDGE_LEFT:
                    setProp(ARKCssPropertiesEnum.LEFT);
                    break;
                case YogaConstant.EDGE_TOP:
                    setProp(ARKCssPropertiesEnum.TOP);
                    break;
                case YogaConstant.EDGE_RIGHT:
                    setProp(ARKCssPropertiesEnum.RIGHT);
                    break;
                case YogaConstant.EDGE_BOTTOM:
                    setProp(ARKCssPropertiesEnum.BOTTOM);
                    break;
                default:
            }
        };
        YogaNode.prototype.setBorder = function (edge, edgeValue) {
            var _this = this;
            var yogaValue = ConvertToValue.stringToYogaValue(edgeValue);
            var Yoga = WebApplicationContext.Yoga;
            var setProp = function (propName) {
                switch (yogaValue.unit) {
                    case YogaConstant.UNIT_POINT:
                        _this.yogaNode[propName] = {
                            value: yogaValue.value,
                            unit: Yoga.Constants.unit.point,
                        };
                        break;
                    default:
                }
            };
            switch (edge) {
                case YogaConstant.EDGE_LEFT:
                    setProp(ARKCssPropertiesEnum.BORDER_LEFT_WIDTH);
                    break;
                case YogaConstant.EDGE_TOP:
                    setProp(ARKCssPropertiesEnum.BORDER_TOP_WIDTH);
                    break;
                case YogaConstant.EDGE_RIGHT:
                    setProp(ARKCssPropertiesEnum.BORDER_RIGHT_WIDTH);
                    break;
                case YogaConstant.EDGE_BOTTOM:
                    setProp(ARKCssPropertiesEnum.BORDER_BOTTOM_WIDTH);
                    break;
                default:
            }
        };
        YogaNode.prototype.setPositionType = function (position) {
            var Yoga = WebApplicationContext.Yoga;
            switch (position) {
                case YogaConstant.POSITION_TYPE_RELATIVE:
                    this.yogaNode[ARKCssPropertiesEnum.POSITION] = Yoga.Constants.position.relative;
                    break;
                case YogaConstant.POSITION_TYPE_ABSOLUTE:
                    this.yogaNode[ARKCssPropertiesEnum.POSITION] = Yoga.Constants.position.absolute;
                    break;
                default:
            }
        };
        YogaNode.prototype.setDisplay = function (display) {
            var Yoga = WebApplicationContext.Yoga;
            switch (display) {
                case YogaConstant.DISPLAY_FLEX:
                    this.yogaNode[ARKCssPropertiesEnum.DISPLAY] = Yoga.Constants.display.flex;
                    break;
                case YogaConstant.DISPLAY_NONE:
                    this.yogaNode[ARKCssPropertiesEnum.DISPLAY] = Yoga.Constants.display.none;
                    break;
                default:
            }
        };
        YogaNode.prototype.setFlexDirection = function (flexDirection) {
            var Yoga = WebApplicationContext.Yoga;
            switch (flexDirection) {
                case YogaConstant.FLEX_DIRECTION_COLUMN:
                    this.yogaNode[ARKCssPropertiesEnum.FLEX_DIRECTION] = Yoga.Constants.flexDirection.column;
                    break;
                case YogaConstant.FLEX_DIRECTION_COLUMN_REVERSE:
                    this.yogaNode[ARKCssPropertiesEnum.FLEX_DIRECTION] = Yoga.Constants.flexDirection['column-reverse'];
                    break;
                case YogaConstant.FLEX_DIRECTION_ROW:
                    this.yogaNode[ARKCssPropertiesEnum.FLEX_DIRECTION] = Yoga.Constants.flexDirection.row;
                    break;
                case YogaConstant.FLEX_DIRECTION_ROW_REVERSE:
                    this.yogaNode[ARKCssPropertiesEnum.FLEX_DIRECTION] = Yoga.Constants.flexDirection['row-reverse'];
                    break;
                default:
            }
        };
        YogaNode.prototype.setJustifyContent = function (justifyContent) {
            var Yoga = WebApplicationContext.Yoga;
            switch (justifyContent) {
                case YogaConstant.JUSTIFY_CENTER:
                    this.yogaNode[ARKCssPropertiesEnum.JUSTIFY_CONTENT] = Yoga.Constants.justify.center;
                    break;
                case YogaConstant.JUSTIFY_FLEX_END:
                    this.yogaNode[ARKCssPropertiesEnum.JUSTIFY_CONTENT] = Yoga.Constants.justify['flex-end'];
                    break;
                case YogaConstant.JUSTIFY_SPACE_AROUND:
                    this.yogaNode[ARKCssPropertiesEnum.JUSTIFY_CONTENT] = Yoga.Constants.justify['space-around'];
                    break;
                case YogaConstant.JUSTIFY_FLEX_START:
                    this.yogaNode[ARKCssPropertiesEnum.JUSTIFY_CONTENT] = Yoga.Constants.justify['flex-start'];
                    break;
                case YogaConstant.JUSTIFY_SPACE_BETWEEN:
                    this.yogaNode[ARKCssPropertiesEnum.JUSTIFY_CONTENT] = Yoga.Constants.justify['space-between'];
                    break;
                case YogaConstant.JUSTIFY_SPACE_EVENLY:
                    this.yogaNode[ARKCssPropertiesEnum.JUSTIFY_CONTENT] = Yoga.Constants.justify['space-evenly'];
                    break;
                default:
            }
        };
        YogaNode.prototype.setAlignItems = function (alignItems) {
            this.setAlign(ARKCssPropertiesEnum.ALIGN_ITEMS, alignItems);
        };
        YogaNode.prototype.setAlignContent = function (alignContent) {
            this.setAlign(ARKCssPropertiesEnum.ALIGN_CONTENT, alignContent);
        };
        YogaNode.prototype.setAlignSelf = function (alignSelf) {
            this.setAlign(ARKCssPropertiesEnum.ALIGN_SELF, alignSelf);
        };
        YogaNode.prototype.setFlexWrap = function (flexWrap) {
            var Yoga = WebApplicationContext.Yoga;
            switch (flexWrap) {
                case YogaConstant.WRAP_NO_WRAP:
                    this.yogaNode[ARKCssPropertiesEnum.FLEX_WARP] = Yoga.Constants.wrap.nowrap;
                    break;
                case YogaConstant.WRAP_WRAP:
                    this.yogaNode[ARKCssPropertiesEnum.FLEX_WARP] = Yoga.Constants.wrap.wrap;
                    break;
                case YogaConstant.WRAP_WRAP_REVERSE:
                    this.yogaNode[ARKCssPropertiesEnum.FLEX_WARP] = Yoga.Constants.wrap['wrap-reverse'];
                    break;
                default:
            }
        };
        YogaNode.prototype.setFlexGrow = function (flexGrow) {
            this.yogaNode[ARKCssPropertiesEnum.FLEX_GROW] = flexGrow;
        };
        YogaNode.prototype.setFlexShrink = function (flexShrink) {
            this.yogaNode[ARKCssPropertiesEnum.FLEX_SHRINK] = flexShrink;
        };
        YogaNode.prototype.setFlexBasis = function (flexBasis) {
            this.setUnitProps(ARKCssPropertiesEnum.FLEX_BASIS, flexBasis);
        };
        YogaNode.prototype.getWidth = function () {
            return this.yogaNode.width;
        };
        YogaNode.prototype.getHeight = function () {
            return this.yogaNode.height;
        };
        /**
         * 清理测量函数的时候. 移除对应的 emval_handle_array 的元素. 防止内存泄漏
         */
        YogaNode.prototype.unsetMeasureFunc = function () {
            try {
                this.yogaNode.unsetMeasureFunc();
                this.removeEmvalHandleArrayElement();
            }
            catch (e) {
                logger$y.error('unsetMeasureFunc() error.', e);
            }
        };
        /**
         * 设置MeasureFunc的时候还需要清理 emval_handle_array 数组.否则会有内存泄漏的问题
         * @param measureFunc
         */
        YogaNode.prototype.setMeasureFunc = function (measureFunc) {
            var yogaNode = this.yogaNode;
            var Yoga = WebApplicationContext.Yoga;
            if (!Yoga) {
                return;
            }
            if (typeof measureFunc === 'function') {
                this.removeEmvalHandleArrayElement();
                this.measureFuncIndex = yogaNode.setMeasureFunc(measureFunc);
            }
        };
        YogaNode.prototype.markDirty = function () {
            this.yogaNode.markDirty();
        };
        YogaNode.prototype.free = function () {
            try {
                this.yogaNode.free();
            }
            catch (e) {
                logger$y.error('free() error.', e);
            }
        };
        YogaNode.prototype.freeRecursive = function () {
            try {
                this.yogaNode.freeRecursive();
            }
            catch (e) {
                logger$y.error('freeRecursive() error.', e);
            }
        };
        YogaNode.prototype.getParent = function () {
            return this.yogaNode.getParent();
        };
        YogaNode.prototype.insertChild = function (child, index) {
            this.yogaNode.insertChild(child.yogaNode, index);
        };
        YogaNode.prototype.calculateLayout = function (width, height, direction) {
            this.yogaNode.calculateLayout(width, height, direction);
        };
        YogaNode.prototype.removeChild = function (child) {
            this.yogaNode.removeChild(child.yogaNode);
        };
        YogaNode.prototype.getComputedLayout = function () {
            var _a = this.yogaNode.getComputedLayout(), left = _a.left, top = _a.top, width = _a.width, height = _a.height;
            return {
                left: left,
                top: top,
                right: left + width,
                bottom: top + height,
                width: width,
                height: height,
            };
        };
        /**
         * 释放内存
         * @description 这里需要注意的是 unsetMeasureFunc 并不能释放 eval_handle_array 的内存
         */
        YogaNode.prototype.release = function () {
            this.unsetMeasureFunc();
            this.free();
        };
        YogaNode.prototype.getYogaNode = function () {
            return this.yogaNode;
        };
        /**
         * 清理 emval_handle_array 数组
         */
        YogaNode.prototype.removeEmvalHandleArrayElement = function () {
            var Yoga = WebApplicationContext.Yoga;
            var measureFuncIndex = this.measureFuncIndex;
            if (!Yoga) {
                return;
            }
            // 其实这里不可能为 0. 因为 emval_handle_array 始终保存了至少5个元素
            if (!measureFuncIndex && measureFuncIndex !== 0) {
                return;
            }
            var RemoveEmval = Yoga.RemoveEmval;
            if (typeof RemoveEmval === 'function') {
                try {
                    RemoveEmval(measureFuncIndex);
                }
                catch (e) {
                    logger$y.error('remove emval_handle_array fail', e);
                }
            }
        };
        return YogaNode;
    }());

    /**
     * @fileoverview Yoga桥接器
     * @author alawnxu
     * @date 2022-08-16 11:59:53
     * @version 1.0.0
     */
    var logger$x = Logger.getLogger('YogaBridge');
    var YogaBridge = /** @class */ (function () {
        function YogaBridge(_a) {
            var Node = _a.Node, Config = _a.Config, Constants = _a.Constants, RemoveEmval = _a.RemoveEmval;
            this.Node = Node;
            this.Config = Config;
            this.Constants = Constants;
            this.RemoveEmval = RemoveEmval;
        }
        YogaBridge.init = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var YogaModule, e_1;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, Yoga__default["default"]];
                        case 1:
                            YogaModule = _a.sent();
                            return [2 /*return*/, new YogaBridge(YogaModule)];
                        case 2:
                            e_1 = _a.sent();
                            logger$x.error('initYoga error.', e_1);
                            return [2 /*return*/, Promise.reject(e_1)];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 创建一个默认配置的节点
         */
        YogaBridge.prototype.createNodeWithDefaultConfig = function () {
            var _a = this, Config = _a.Config, Node = _a.Node;
            var config = new Config();
            var node = Node.createWithConfig(config);
            return new YogaNode(node);
        };
        return YogaBridge;
    }());

    var WebApplicationContext = /** @class */ (function (_super) {
        __extends$1(WebApplicationContext, _super);
        function WebApplicationContext() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WebApplicationContext.initYoga = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var bridge;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (WebApplicationContext.Yoga) {
                                return [2 /*return*/, WebApplicationContext.Yoga];
                            }
                            return [4 /*yield*/, YogaBridge.init()];
                        case 1:
                            bridge = _a.sent();
                            WebApplicationContext.Yoga = bridge;
                            return [2 /*return*/, bridge];
                    }
                });
            });
        };
        /**
         * ark引擎的版本号
         */
        WebApplicationContext.engineVersion = 'v_20221121160742';
        return WebApplicationContext;
    }(BaseApplicationContext));

    /**
     * 尺寸大小保留的精度数
     */
    var FRACTION_DIGITS = 3;
    /**
     * 默认的主题ID
     * @description 白色
     */
    var DEFAULT_THEME = '1109';

    /**
     * @fileoverview display
     * @author alawnxu
     * @date 2022-06-29 15:19:28
     * @version 1.0.0
     * @description Ark只支持inline-block, block, inline, flex
     */
    var DisplayEnum;
    (function (DisplayEnum) {
        DisplayEnum["FLEX"] = "flex";
        DisplayEnum["NONE"] = "none";
        DisplayEnum["BLOCK"] = "block";
        DisplayEnum["INLINE"] = "inline";
        DisplayEnum["INLINE_BLOCK"] = "inline-block";
    })(DisplayEnum || (DisplayEnum = {}));
    var Display = /** @class */ (function () {
        function Display() {
        }
        /**
         * 转换为Yoga识别的display
         * @param display
         * @returns
         * @description 所有的默认都转化为flex布局
         */
        Display.toYoga = function (display) {
            switch (display) {
                case DisplayEnum.FLEX:
                    return YogaConstant.DISPLAY_FLEX;
                case DisplayEnum.NONE:
                    return YogaConstant.DISPLAY_NONE;
                default:
                    return YogaConstant.DISPLAY_FLEX;
            }
        };
        return Display;
    }());

    /**
     * @fileoverview AlignItems
     * @author alawnxu
     * @date 2022-06-29 15:19:28
     * @version 1.0.0
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/align-items }
     */
    var FlexAlignEnum;
    (function (FlexAlignEnum) {
        FlexAlignEnum["AUTO"] = "auto";
        FlexAlignEnum["FLEX_START"] = "flex-start";
        FlexAlignEnum["FLEX_END"] = "flex-end";
        FlexAlignEnum["CENTER"] = "center";
        FlexAlignEnum["SPACE_BETWEEN"] = "space-between";
        FlexAlignEnum["SPACE_AROUND"] = "space-around";
        FlexAlignEnum["STRETCH"] = "stretch";
        FlexAlignEnum["BASELINE"] = "baseline";
    })(FlexAlignEnum || (FlexAlignEnum = {}));
    var FlexAlign = /** @class */ (function () {
        function FlexAlign() {
        }
        /**
         * 转换为Yoga识别的align
         * @param align
         * @returns
         */
        FlexAlign.toYoga = function (align) {
            switch (align) {
                case FlexAlignEnum.STRETCH:
                    return YogaConstant.ALIGN_STRETCH;
                case FlexAlignEnum.FLEX_START:
                    return YogaConstant.ALIGN_FLEX_START;
                case FlexAlignEnum.FLEX_END:
                    return YogaConstant.ALIGN_FLEX_END;
                case FlexAlignEnum.CENTER:
                    return YogaConstant.ALIGN_CENTER;
                case FlexAlignEnum.AUTO:
                    return YogaConstant.ALIGN_AUTO;
                case FlexAlignEnum.SPACE_BETWEEN:
                    return YogaConstant.ALIGN_SPACE_BETWEEN;
                case FlexAlignEnum.SPACE_AROUND:
                    return YogaConstant.ALIGN_SPACE_AROUND;
                case FlexAlignEnum.BASELINE:
                    return YogaConstant.ALIGN_BASELINE;
                default:
                    return YogaConstant.ALIGN_STRETCH;
            }
        };
        return FlexAlign;
    }());

    /**
     * @fileoverview AlignItems
     * @author alawnxu
     * @date 2022-06-29 15:19:28
     * @version 1.0.0
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/align-items }
     */
    var AlignItems = /** @class */ (function () {
        function AlignItems() {
        }
        /**
         * 转换为Yoga识别的align-items
         * @param alignItems
         * @returns
         */
        AlignItems.toYoga = function (alignItems) {
            return FlexAlign.toYoga(alignItems);
        };
        return AlignItems;
    }());

    /**
     * @fileoverview FlexDirection
     * @author alawnxu
     * @date 2022-06-29 15:19:28
     * @version 1.0.0
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction }
     */
    var FlexDirectionEnum;
    (function (FlexDirectionEnum) {
        FlexDirectionEnum["COLUMN"] = "column";
        FlexDirectionEnum["COLUMN_REVERSE"] = "column-reverse";
        FlexDirectionEnum["ROW"] = "row";
        FlexDirectionEnum["ROW_REVERSE"] = "row-reverse";
    })(FlexDirectionEnum || (FlexDirectionEnum = {}));
    var FlexDirection = /** @class */ (function () {
        function FlexDirection() {
        }
        /**
         * 转换为Yoga识别的direction
         * @param direction
         * @returns
         */
        FlexDirection.toYoga = function (direction) {
            switch (direction) {
                case FlexDirectionEnum.COLUMN:
                    return YogaConstant.FLEX_DIRECTION_COLUMN;
                case FlexDirectionEnum.COLUMN_REVERSE:
                    return YogaConstant.FLEX_DIRECTION_COLUMN_REVERSE;
                case FlexDirectionEnum.ROW:
                    return YogaConstant.FLEX_DIRECTION_ROW;
                case FlexDirectionEnum.ROW_REVERSE:
                    return YogaConstant.FLEX_DIRECTION_ROW_REVERSE;
                default:
                    return YogaConstant.FLEX_DIRECTION_ROW;
            }
        };
        return FlexDirection;
    }());

    /**
     * @fileoverview JustifyContent
     * @author alawnxu
     * @date 2022-06-29 15:19:28
     * @version 1.0.0
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content}
     */
    var JustifyContentEnum;
    (function (JustifyContentEnum) {
        JustifyContentEnum["FLEX_START"] = "flex-start";
        JustifyContentEnum["FLEX_END"] = "flex-end";
        JustifyContentEnum["CENTER"] = "center";
        JustifyContentEnum["SPACE_BETWEEN"] = "space-between";
        JustifyContentEnum["SPACE_AROUND"] = "space-around";
        JustifyContentEnum["SPACE_EVENLY"] = "space-evenly";
    })(JustifyContentEnum || (JustifyContentEnum = {}));
    var JustifyContent = /** @class */ (function () {
        function JustifyContent() {
        }
        /**
         * 转换为Yoga识别的justifyContent
         * @param justifyContent
         * @returns
         */
        JustifyContent.toYoga = function (justifyContent) {
            switch (justifyContent) {
                case JustifyContentEnum.CENTER:
                    return YogaConstant.JUSTIFY_CENTER;
                case JustifyContentEnum.FLEX_END:
                    return YogaConstant.JUSTIFY_FLEX_END;
                case JustifyContentEnum.SPACE_AROUND:
                    return YogaConstant.JUSTIFY_SPACE_AROUND;
                case JustifyContentEnum.FLEX_START:
                    return YogaConstant.JUSTIFY_FLEX_START;
                case JustifyContentEnum.SPACE_BETWEEN:
                    return YogaConstant.JUSTIFY_SPACE_BETWEEN;
                case JustifyContentEnum.SPACE_EVENLY:
                    return YogaConstant.JUSTIFY_SPACE_EVENLY;
                default:
                    return YogaConstant.JUSTIFY_FLEX_START;
            }
        };
        return JustifyContent;
    }());

    /**
     * @fileoverview position
     * @author alawnxu
     * @date 2022-06-29 15:19:28
     * @version 1.0.0
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/position }
     */
    var PositionEnum;
    (function (PositionEnum) {
        PositionEnum["RELATIVE"] = "relative";
        PositionEnum["ABSOLUTE"] = "absolute";
        PositionEnum["STATIC"] = "static";
    })(PositionEnum || (PositionEnum = {}));
    var Position = /** @class */ (function () {
        function Position() {
        }
        /**
         * 转换为Yoga识别的position
         * @param position
         * @returns
         */
        Position.toYoga = function (position) {
            switch (position) {
                case PositionEnum.ABSOLUTE:
                    return YogaConstant.POSITION_TYPE_ABSOLUTE;
                default:
                    return YogaConstant.POSITION_TYPE_RELATIVE;
            }
        };
        return Position;
    }());

    /**
     * @fileoverview FlexWrap
     * @author alawnxu
     * @date 2022-06-29 15:19:28
     * @version 1.0.0
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap}
     */
    var FlexWrapEnum;
    (function (FlexWrapEnum) {
        FlexWrapEnum["WRAP"] = "wrap";
        FlexWrapEnum["NOWRAP"] = "nowrap";
        FlexWrapEnum["WRAP_REVERSE"] = "wrap_reverse";
    })(FlexWrapEnum || (FlexWrapEnum = {}));
    var FlexWrap = /** @class */ (function () {
        function FlexWrap() {
        }
        /**
         * 转换为Yoga识别的flexWrap
         * @param flexWarp
         * @returns
         */
        FlexWrap.toYoga = function (flexWarp) {
            switch (flexWarp) {
                case FlexWrapEnum.NOWRAP:
                    return YogaConstant.WRAP_NO_WRAP;
                case FlexWrapEnum.WRAP:
                    return YogaConstant.WRAP_WRAP;
                case FlexWrapEnum.WRAP_REVERSE:
                    return YogaConstant.WRAP_WRAP_REVERSE;
                default:
                    return YogaConstant.WRAP_NO_WRAP;
            }
        };
        return FlexWrap;
    }());

    var isUndefined = function (v) { return v === undefined; };
    var isNull = function (v) { return v === null; };
    var isValidStyle = function (v) {
        if (isUndefined(v)) {
            return false;
        }
        if (isNull(v)) {
            return false;
        }
        if (typeof v === 'string' && v.trim().length === 0) {
            return false;
        }
        return true;
    };

    /**
     * @fileoverview Margin
     * @author alawnxu
     * @date 2022-06-29 15:19:28
     * @version 1.0.0
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/margin }
     */
    var Margin = /** @class */ (function () {
        function Margin() {
        }
        Margin.parser = function (declaration) {
            if (!declaration) {
                return {
                    top: undefined,
                    right: undefined,
                    bottom: undefined,
                    left: undefined,
                };
            }
            var margins = declaration.split(' ');
            if (margins.length === 1) {
                return {
                    top: margins[0],
                    right: margins[0],
                    bottom: margins[0],
                    left: margins[0],
                };
            }
            if (margins.length === 2) {
                return {
                    top: margins[0],
                    right: margins[1],
                    bottom: margins[0],
                    left: margins[1],
                };
            }
            if (margins.length === 3) {
                return {
                    top: margins[0],
                    right: margins[1],
                    bottom: margins[2],
                    left: margins[1],
                };
            }
            if (margins.length === 4) {
                return {
                    top: margins[0],
                    right: margins[1],
                    bottom: margins[2],
                    left: margins[3],
                };
            }
        };
        return Margin;
    }());

    var Padding = /** @class */ (function () {
        function Padding() {
        }
        Padding.parser = function (declaration) {
            if (!declaration) {
                return {
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                };
            }
            var paddings = declaration.split(' ');
            if (paddings.length === 1) {
                return {
                    top: paddings[0],
                    right: paddings[0],
                    bottom: paddings[0],
                    left: paddings[0],
                };
            }
            if (paddings.length === 2) {
                return {
                    top: paddings[0],
                    right: paddings[1],
                    bottom: paddings[0],
                    left: paddings[1],
                };
            }
            if (paddings.length === 3) {
                return {
                    top: paddings[0],
                    right: paddings[1],
                    bottom: paddings[2],
                    left: paddings[1],
                };
            }
            if (paddings.length === 4) {
                return {
                    top: paddings[0],
                    right: paddings[1],
                    bottom: paddings[2],
                    left: paddings[3],
                };
            }
        };
        return Padding;
    }());

    /* eslint-disable prefer-destructuring */
    var FLEX_AUTO = 'auto';
    var FLEX_NONE = 'none';
    var Flex = /** @class */ (function () {
        function Flex() {
        }
        /**
         * @description flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
         * 快捷值: auto (1 1 auto)
         *        none (0 0 auto)
         */
        Flex.parser = function (declaration) {
            if (!declaration) {
                return null;
            }
            var props = [];
            var flexGrow = null;
            var flexShrink = null;
            var flexBasis = null;
            switch (declaration) {
                case FLEX_AUTO:
                    return {
                        flexGrow: 1,
                        flexShrink: 1,
                        flexBasis: 'auto',
                    };
                case FLEX_NONE:
                    return {
                        flexGrow: 0,
                        flexShrink: 0,
                        flexBasis: 'auto',
                    };
                default:
                    props = String(declaration).split(' ');
                    if (props.length > 0) {
                        flexGrow = parseInt(props[0], 10) || null;
                    }
                    if (props.length > 1) {
                        flexShrink = parseInt(props[1], 10) || null;
                    }
                    if (props.length > 2) {
                        flexBasis = props[2];
                    }
                    return {
                        flexGrow: flexGrow,
                        flexShrink: flexShrink,
                        flexBasis: flexBasis,
                    };
            }
        };
        return Flex;
    }());

    /**
     * @fileoverview AlignContent
     * @author alawnxu
     * @date 2022-06-29 15:19:28
     * @version 1.0.0
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/align-content }
     */
    var AlignContent = /** @class */ (function () {
        function AlignContent() {
        }
        AlignContent.toYoga = function (alignContent) {
            return FlexAlign.toYoga(alignContent);
        };
        return AlignContent;
    }());

    /**
     * @fileoverview AlignSelf
     * @author alawnxu
     * @date 2022-06-29 15:19:28
     * @version 1.0.0
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/align-self }
     */
    var AlignSelf = /** @class */ (function () {
        function AlignSelf() {
        }
        AlignSelf.toYoga = function (alignSelf) {
            return FlexAlign.toYoga(alignSelf);
        };
        return AlignSelf;
    }());

    /**
     * CSS布局节点
     * @author alawnxu
     * @date 2022-07-11 21:09:11
     * @version 1.0.0
     */
    var logger$w = Logger.getLogger('CSSLayoutNode');
    var CSSLayoutNode = /** @class */ (function () {
        function CSSLayoutNode(uiObject) {
            var _this = this;
            this.YGMeasureAutoSizeFunc = function (width, widthMode, height) {
                var yogaNode = _this.layoutNode.getYogaNode();
                return MeasureSize(yogaNode, width, widthMode, height);
            };
            this.styles = {};
            this.isBox = false;
            this.layoutNode = WebApplicationContext.Yoga.createNodeWithDefaultConfig();
            var yogaNode = this.layoutNode.getYogaNode();
            YogaNodeManager.AddUIObject(yogaNode, uiObject);
            /**
             * 如果是图片或者文本.需要测量
             */
            switch (uiObject.GetNodeType()) {
                case NodeTypeEnum.IMAGE:
                case NodeTypeEnum.TEXT:
                    this.layoutNode.setMeasureFunc(this.YGMeasureAutoSizeFunc);
                    break;
                default:
            }
        }
        CSSLayoutNode.prototype.GetUIObject = function () {
            var yogaNode = this.layoutNode.getYogaNode();
            return YogaNodeManager.GetUIObject(yogaNode);
        };
        CSSLayoutNode.prototype.GetApp = function () {
            var applicationId = this.GetUIObject().GetApplicationId();
            var application = ApplicationManager.GetApplication(applicationId);
            return application.GetApp();
        };
        /**
         * 获取样式值
         * @param name
         * @description 可以为空,为空的话会返回样式字符串.
         */
        CSSLayoutNode.prototype.GetStyle = function (name) {
            var _a;
            var styles = this.styles;
            if (!name || name.length === 0) {
                return Object.keys(styles)
                    .map(function (property) {
                    return "".concat(property, ":").concat(styles[property]);
                })
                    .join(';');
            }
            var value = (_a = this.styles) === null || _a === void 0 ? void 0 : _a[name];
            return value || '';
        };
        /**
         * 设置样式
         * @param styles
         * @description 支持通过className设置或者字符串.或者单个
         * @example
         * SetStyle('display:flex');
         * SetStyle('display', 'flex');
         * SetStyle('title');
         */
        CSSLayoutNode.prototype.SetStyle = function (name, value) {
            if (!name) {
                return false;
            }
            if (value === undefined) {
                return isStyle(name) ? this.SetStyleByStyleString(name) : this.SetStyleByClassName(name);
            }
            if (!name || !value) {
                return false;
            }
            this.styles[name] = value;
            this.LoadStyle();
            return true;
        };
        CSSLayoutNode.prototype.IsBox = function () {
            return this.isBox;
        };
        /**
         * 标记元素需要重新计算位置，只对叶子节点生效。
         * @returns
         */
        CSSLayoutNode.prototype.MarkDirty = function () {
            this.layoutNode.markDirty();
        };
        /**
         * 获取父节点
         * @returns
         * @description Yoga的JS版本并没有提供getContext能力.单独维护一个Map去存储的话很容易出现内存问题.所以这里通过UIObject本身的树形结构去获取父节点信息会更好
         */
        CSSLayoutNode.prototype.GetParent = function () {
            var parentLayoutNode = this.layoutNode.getParent();
            if (parentLayoutNode) {
                var parentUIObject = this.GetUIObject().GetParent();
                if (parentUIObject) {
                    return parentUIObject.GetCSSLayoutNode();
                }
            }
            return null;
        };
        /**
         * 自定义方法.获取根YogaNode
         * @returns
         * @deprecated
         */
        CSSLayoutNode.prototype.GetRoot = function () {
            var parentCssLayoutNode = this.layoutNode.getParent();
            if (!parentCssLayoutNode) {
                return this.layoutNode;
            }
            while (parentCssLayoutNode.getParent()) {
                parentCssLayoutNode = parentCssLayoutNode.getParent();
            }
            return parentCssLayoutNode;
        };
        /**
         * 插入一个子节点
         * @param child
         * @param index 子节点的索引
         */
        CSSLayoutNode.prototype.InsertChild = function (child, index) {
            logger$w.debug('InsertChild', 'parent:', this.GetUIObject(), 'child:', child.GetUIObject());
            this.layoutNode.insertChild(child.GetLayoutNode(), index);
        };
        /**
         * 移除一个子节点
         */
        CSSLayoutNode.prototype.RemoveChild = function (child) {
            var childLayoutNode = child.GetLayoutNode();
            if (childLayoutNode) {
                this.layoutNode.removeChild(child.GetLayoutNode());
            }
        };
        /**
         * 获取布局节点
         * @returns
         */
        CSSLayoutNode.prototype.GetLayoutNode = function () {
            return this.layoutNode;
        };
        /**
         * 计算布局
         * @TODO 这里需要加个告警. 这里宽高等后面再看看怎么设定。先设置为1000*1000,理论上不需要设置那么大的值
         * @description 这个方法很重,请谨慎调用该方法.
         */
        CSSLayoutNode.prototype.CalculateLayout = function () {
            try {
                this.layoutNode.calculateLayout(NaN, NaN, YogaConstant.DIRECTION_LTR);
            }
            catch (e) {
                logger$w.error('CalculateLayout fail', e);
                // 这个上报非常重要.如果出现死循环之后会走这里
                var app = this.GetApp();
                WebReport.error(app, TracerTagEnum.ARK_LAYOUT_ERROR, e);
            }
        };
        /**
         * 获取rect
         * @returns
         * @description Yoga的left,top,right,bottom是相对父元素的. 不过这里没关系.因为每次绘制的时候是translate的.所以还是相对父节点就可以了
         */
        CSSLayoutNode.prototype.GetLayoutRect = function () {
            var layoutNode = this.layoutNode;
            var _a = layoutNode.getComputedLayout(), left = _a.left, right = _a.right, top = _a.top, bottom = _a.bottom;
            return new ARKRect(left || 0, top || 0, right || 0, bottom || 0);
        };
        /**
         * 获取元素的大小
         * @returns
         * @description
         * 这里需要注意下.
         * 1、getComputedWidth() 和 getComputedHeight() 可能拿到的是NaN
         */
        CSSLayoutNode.prototype.GetLayoutSize = function () {
            var layoutNode = this.layoutNode;
            var _a = layoutNode.getComputedLayout(), width = _a.width, height = _a.height;
            return new ARKSize(width || 0, height || 0);
        };
        /**
         * 释放内存
         */
        CSSLayoutNode.prototype.Release = function () {
            var yogaNode = this.layoutNode.getYogaNode();
            this.layoutNode.release();
            YogaNodeManager.RemoveUIObject(yogaNode);
        };
        /**
         * 通过className设置样式
         * @param name
         */
        CSSLayoutNode.prototype.SetStyleByClassName = function (name) {
            var _this = this;
            var classList = name.split(' ');
            var app = this.GetApp();
            var styles = AppUtil.GetStyles(app);
            classList.forEach(function (className) {
                if (!className.trim()) {
                    return;
                }
                var properties = styles[className.trim()];
                if (properties) {
                    Object.keys(properties).forEach(function (propertyName) {
                        _this.styles[propertyName] = properties[propertyName];
                    });
                }
            });
            this.LoadStyle();
            return true;
        };
        /**
         * 通过样式字符串设置样式
         * @param styleStr
         */
        CSSLayoutNode.prototype.SetStyleByStyleString = function (styleStr) {
            var _this = this;
            var props = styleStr.split(';');
            var changed = false;
            props.forEach(function (attribute) {
                var _a = __read$1(attribute.split(':'), 2), propertyName = _a[0], propertyValue = _a[1];
                if ((propertyName === null || propertyName === void 0 ? void 0 : propertyName.trim()) && (propertyValue === null || propertyValue === void 0 ? void 0 : propertyValue.trim())) {
                    _this.styles[propertyName.trim()] = propertyValue.trim();
                    changed = true;
                }
            });
            changed && this.LoadStyle();
            return true;
        };
        /**
         * 加载样式
         */
        CSSLayoutNode.prototype.LoadStyle = function () {
            this.ResetStyle();
            var styles = this.styles;
            /**
             * 这里需要非常小心.如果没有显示的声明display属性.是不能设置为isBox:true的.不然这个时候的子节点如果没有设置style.而在AddObject的时候会被默认更新为 CSSLayoutNode.
             * 这样就会导致宽高以及布局有很大的问题.
             */
            var strDisplay = styles.display;
            if (strDisplay) {
                var display_1 = Display.toYoga(strDisplay);
                if (display_1 === YogaConstant.DISPLAY_FLEX) {
                    this.isBox = true;
                }
            }
            var node = this.layoutNode;
            var display = styles.display, width = styles.width, height = styles.height, minWidth = styles.minWidth, maxWidth = styles.maxWidth, minHeight = styles.minHeight, maxHeight = styles.maxHeight, flexDirection = styles.flexDirection, justifyContent = styles.justifyContent, alignContent = styles.alignContent, alignItems = styles.alignItems, flexWrap = styles.flexWrap, alignSelf = styles.alignSelf;
            isValidStyle(width) && node.setWidth(width);
            isValidStyle(height) && node.setHeight(height);
            isValidStyle(minWidth) && node.setMinWidth(minWidth);
            isValidStyle(maxWidth) && node.setMaxWidth(maxWidth);
            isValidStyle(minHeight) && node.setMinHeight(minHeight);
            isValidStyle(maxHeight) && node.setMaxHeight(maxHeight);
            isValidStyle(display) && node.setDisplay(Display.toYoga(styles.display));
            isValidStyle(flexDirection) && node.setFlexDirection(FlexDirection.toYoga(flexDirection));
            isValidStyle(justifyContent) && node.setJustifyContent(JustifyContent.toYoga(justifyContent));
            isValidStyle(alignItems) && node.setAlignItems(AlignItems.toYoga(alignItems));
            isValidStyle(alignContent) && node.setAlignContent(AlignContent.toYoga(alignContent));
            isValidStyle(alignSelf) && node.setAlignSelf(AlignSelf.toYoga(alignSelf));
            isValidStyle(flexWrap) && node.setFlexWrap(FlexWrap.toYoga(styles.flexWrap));
            this.SetFlex();
            this.SetMargin();
            this.SetPadding();
            this.SetPosition();
            this.SetBorder();
        };
        /**
         * 设置默认的样式
         */
        CSSLayoutNode.prototype.ResetStyle = function () {
            this.layoutNode.setFlexDirection(YogaConstant.FLEX_DIRECTION_ROW);
            this.layoutNode.setFlexWrap(YogaConstant.WRAP_NO_WRAP);
            this.layoutNode.setJustifyContent(YogaConstant.JUSTIFY_FLEX_START);
            this.layoutNode.setAlignItems(YogaConstant.ALIGN_STRETCH);
            this.layoutNode.setAlignContent(YogaConstant.ALIGN_STRETCH);
            this.layoutNode.setFlexGrow(0);
            this.layoutNode.setFlexShrink(1);
        };
        /**
         * 设置Margin
         */
        CSSLayoutNode.prototype.SetMargin = function () {
            var _a = this, styles = _a.styles, layoutNode = _a.layoutNode;
            var marginLeft = styles.marginLeft, marginRight = styles.marginRight, marginBottom = styles.marginBottom, marginTop = styles.marginTop;
            if (styles.margin) {
                var margin = Margin.parser(styles.margin);
                layoutNode.setMargin(YogaConstant.EDGE_LEFT, margin.left);
                layoutNode.setMargin(YogaConstant.EDGE_RIGHT, margin.right);
                layoutNode.setMargin(YogaConstant.EDGE_BOTTOM, margin.bottom);
                layoutNode.setMargin(YogaConstant.EDGE_TOP, margin.top);
            }
            isValidStyle(marginLeft) && layoutNode.setMargin(YogaConstant.EDGE_LEFT, marginLeft);
            isValidStyle(marginRight) && layoutNode.setMargin(YogaConstant.EDGE_RIGHT, marginRight);
            isValidStyle(marginBottom) && layoutNode.setMargin(YogaConstant.EDGE_BOTTOM, marginBottom);
            isValidStyle(marginTop) && layoutNode.setMargin(YogaConstant.EDGE_TOP, marginTop);
        };
        /**
         * 设置Margin
         */
        CSSLayoutNode.prototype.SetPadding = function () {
            var _a = this, styles = _a.styles, layoutNode = _a.layoutNode;
            var paddingLeft = styles.paddingLeft, paddingRight = styles.paddingRight, paddingBottom = styles.paddingBottom, paddingTop = styles.paddingTop;
            if (styles.padding) {
                var padding = Padding.parser(styles.padding);
                layoutNode.setPadding(YogaConstant.EDGE_LEFT, padding.left);
                layoutNode.setPadding(YogaConstant.EDGE_RIGHT, padding.right);
                layoutNode.setPadding(YogaConstant.EDGE_BOTTOM, padding.bottom);
                layoutNode.setPadding(YogaConstant.EDGE_TOP, padding.top);
            }
            isValidStyle(paddingLeft) && layoutNode.setPadding(YogaConstant.EDGE_LEFT, paddingLeft);
            isValidStyle(paddingRight) && layoutNode.setPadding(YogaConstant.EDGE_RIGHT, paddingRight);
            isValidStyle(paddingBottom) && layoutNode.setPadding(YogaConstant.EDGE_BOTTOM, paddingBottom);
            isValidStyle(paddingTop) && layoutNode.setPadding(YogaConstant.EDGE_TOP, paddingTop);
        };
        /**
         * 设置Flex
         */
        CSSLayoutNode.prototype.SetFlex = function () {
            var _a = this, styles = _a.styles, layoutNode = _a.layoutNode;
            var setFlexStyle = function (flexGrow, flexShrink, flexBasis) {
                var flexGrowValue = +flexGrow;
                if (isValidStyle(flexGrowValue)) {
                    // +'' => 0 (所以不要直接转)
                    if (!isNaN(flexGrowValue)) {
                        layoutNode.setFlexGrow(flexGrowValue);
                    }
                }
                if (isValidStyle(flexShrink)) {
                    // +'' => 0 (所以不要直接转)
                    var flexShrinkValue = +flexShrink;
                    if (!isNaN(flexShrinkValue)) {
                        layoutNode.setFlexShrink(flexShrinkValue);
                    }
                }
                if (isValidStyle(flexBasis)) {
                    if (flexBasis === 'auto') {
                        try {
                            layoutNode.setFlexBasis('auto');
                        }
                        catch (e) {
                            // @TODO 好像不支持 auto
                            logger$w.error(e);
                        }
                    }
                    else {
                        layoutNode.setFlexBasis(flexBasis);
                    }
                }
            };
            // 跟 Native 顺序保持一致
            setFlexStyle(styles.flexGrow, styles.flexShrink, styles.flexBasis);
            if (!styles.flex) {
                return;
            }
            var parser = Flex.parser(styles.flex);
            if (!parser) {
                return;
            }
            setFlexStyle(parser.flexGrow, parser.flexShrink, parser.flexBasis);
        };
        /**
         * 设置位置
         */
        CSSLayoutNode.prototype.SetPosition = function () {
            var _a = this, styles = _a.styles, layoutNode = _a.layoutNode;
            var left = styles.left, top = styles.top, right = styles.right, bottom = styles.bottom;
            if (isValidStyle(styles.position)) {
                var position = Position.toYoga(styles.position);
                layoutNode.setPositionType(position);
            }
            isValidStyle(left) && layoutNode.setPosition(YogaConstant.EDGE_LEFT, left);
            isValidStyle(right) && layoutNode.setPosition(YogaConstant.EDGE_RIGHT, right);
            isValidStyle(bottom) && layoutNode.setPosition(YogaConstant.EDGE_BOTTOM, bottom);
            isValidStyle(top) && layoutNode.setPosition(YogaConstant.EDGE_TOP, top);
        };
        CSSLayoutNode.prototype.SetBorder = function () {
            var _a = this, styles = _a.styles, layoutNode = _a.layoutNode;
            var borderLeftWidth = styles.borderLeftWidth, borderTopWidth = styles.borderTopWidth, borderBottomWidth = styles.borderBottomWidth, borderRightWidth = styles.borderRightWidth;
            isValidStyle(borderLeftWidth) && layoutNode.setBorder(YogaConstant.EDGE_LEFT, borderLeftWidth);
            isValidStyle(borderRightWidth) && layoutNode.setBorder(YogaConstant.EDGE_RIGHT, borderRightWidth);
            isValidStyle(borderBottomWidth) && layoutNode.setBorder(YogaConstant.EDGE_BOTTOM, borderBottomWidth);
            isValidStyle(borderTopWidth) && layoutNode.setBorder(YogaConstant.EDGE_TOP, borderTopWidth);
        };
        return CSSLayoutNode;
    }());

    /**
     * Ark布局基类
     * @author alawnxu
     * @date 2022-07-11 21:09:11
     * @version 1.0.0
     */
    var LayoutEnum;
    (function (LayoutEnum) {
        LayoutEnum["CSS_LAYOUT"] = "CSSLayout";
        LayoutEnum["DOCK_LAYOUT"] = "DockLayout";
        LayoutEnum["LIST_LAYOUT"] = "ListLayout";
        LayoutEnum["NORMAL_LAYOUT"] = "NormalLayout";
    })(LayoutEnum || (LayoutEnum = {}));
    var LayoutAttributeEnum;
    (function (LayoutAttributeEnum) {
        LayoutAttributeEnum["TYPE"] = "type";
    })(LayoutAttributeEnum || (LayoutAttributeEnum = {}));
    var Layout = /** @class */ (function () {
        function Layout() {
        }
        /**
         * 判断是不是CSS布局
         */
        Layout.prototype.isCSSLayout = function () {
            return this.GetName() === LayoutEnum.CSS_LAYOUT;
        };
        /**
         * 判断是不是普通布局
         */
        Layout.prototype.isNormalLayout = function () {
            return this.GetName() === LayoutEnum.NORMAL_LAYOUT;
        };
        /**
         * 设置对象的margin
         * @param child
         * @param rect
         */
        Layout.prototype.SetObjectMargin = function (child, rect) {
            child.SetMargin(rect.getLeft(), rect.getTop(), rect.getRight(), rect.getBottom(), false);
        };
        /**
         * 设置对象的rect
         * @param child
         * @param rect
         */
        Layout.prototype.SetObjectRect = function (child, rect) {
            child.SetRect(rect.getLeft(), rect.getTop(), rect.getRight(), rect.getBottom(), false);
        };
        Layout.tagName = 'LAYOUT';
        return Layout;
    }());

    /**
     * Ark布局: CSS布局
     * @author alawnxu
     * @date 2022-07-15 02:32:21
     * @version 1.0.0
     */
    var logger$v = Logger.getLogger('CSSLayout');
    var CSSLayout = /** @class */ (function (_super) {
        __extends$1(CSSLayout, _super);
        function CSSLayout() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CSSLayout.prototype.GetName = function () {
            return LayoutEnum.CSS_LAYOUT;
        };
        CSSLayout.prototype.InitParameters = function (element) {
            logger$v.debug('InitParameters:', element);
        };
        /**
         * View CSS布局
         * @param pView
         * @description 更新当前元素的布局以及子元素的布局
         */
        CSSLayout.prototype.DoLayout = function (pView) {
            if (!pView) {
                logger$v.warn('pView not null');
                return;
            }
            if (!pView.IsType(NodeTypeEnum.VIEW)) {
                logger$v.warn('must be WebView');
                return;
            }
            logger$v.debug('DoLayout', pView, pView.GetID());
            // @TODO 如果它父节点为null.且不是根节点.那是不是可以不用重新布局?
            pView.DoCSSLayout();
            pView.children.forEach(function (child) {
                child.DoCSSLayout();
            });
        };
        /**
         * 根据父元素的Rect信息刷新渲染区域
         * @param child 子节点信息
         * @param parentRect 父节点的区域信息
         */
        CSSLayout.prototype.UpdateRect = function (child) {
            logger$v.debug('CSSLayout UpdateRect:', child.GetID());
            if (!child) {
                logger$v.warn('child not null');
                return;
            }
            var parent = child.GetParent();
            this.DoLayout(parent);
        };
        /**
         * 更新Margin
         * @param child 子节点信息
         * @param parentRect 父节点的区域信息
         * @description CSSLayout不需要更新Margin
         */
        CSSLayout.prototype.UpdateMargin = function (child, parentRect) {
            logger$v.debug('UpdateMargin:', child, parentRect);
        };
        return CSSLayout;
    }(Layout));

    /**
     * 将形如2,2,2,2 => {left:2, top:2, right:2, bottom: 2}
     * @description 不满足格式则会返回null
     */
    function formatEdge(str) {
        var result = formatValueGroup(str);
        if (result.length === 4) {
            return {
                left: parseInt(result[0], 10) || 0,
                top: parseInt(result[1], 10) || 0,
                right: parseInt(result[2], 10) || 0,
                bottom: parseInt(result[3], 10) || 0,
            };
        }
        return null;
    }
    /**
     * 将形如2,2,2,2 => [2,2,2,2]
     * @description 不满足格式则会返回null
     */
    function formatValueGroup(str) {
        if (typeof str !== 'string' || !str) {
            return [];
        }
        return str
            .split(',')
            .map(function (value) { return value.trim(); })
            .filter(function (value) { return value.length > 0; });
    }

    var logger$u = Logger.getLogger('WebUIObject');
    var PARENT_PROPERTY = 'parent';
    var CSS_LAYOUT_NODE_PROPERTY = 'cssLayoutNode';
    var WebUIObject = /** @class */ (function (_super) {
        __extends$1(WebUIObject, _super);
        function WebUIObject(applicationId) {
            var _this = _super.call(this, applicationId) || this;
            /**
             * 锁定更新
             */
            _this.lockUpdate = 0;
            /**
             * 渲染区域
             */
            _this.renderRect = null;
            _this.isRoot = false;
            _this.position = ARKPoint.EmptyPoint;
            // 这里不能使用ARKRect.EmptyRect.因为需要动态修改renderRect的值
            _this.renderRect = new ARKRect();
            _this.children = [];
            _this.isRoot = false;
            _this.isVisible = true;
            _this.radius = ARKRect.EmptyRect;
            _this.margin = ARKRect.EmptyRect;
            _this.anchors = DEFAULT_ANCHORS;
            _this.alpha = DEFAULT_ALPHA;
            _this.enable = true;
            _this.metadataType = '';
            return _this;
        }
        /**
         * 是否为CSS模式
         */
        WebUIObject.prototype.IsCSSMode = function () {
            var cssLayoutNode = this.GetCSSLayoutNode();
            return Boolean(cssLayoutNode) && typeof cssLayoutNode.SetStyle === 'function';
        };
        /**
         * 获取CSS布局Node
         */
        WebUIObject.prototype.GetCSSLayoutNode = function () {
            return this[CSS_LAYOUT_NODE_PROPERTY];
        };
        /**
         * 自定义拓展方法
         * 设置父节点.这里不对外暴露.
         */
        WebUIObject.prototype.SetParent = function (parent) {
            // 在子节点中不能保存parent的引用，会导致循环引用，如果 JSON.stringify 的话会导致死循环，从而内存溢出
            Object.defineProperty(this, PARENT_PROPERTY, {
                value: parent,
                enumerable: false,
                writable: true,
                configurable: false,
            });
        };
        /**
         * 获取父视图
         */
        WebUIObject.prototype.GetParent = function () {
            return this[PARENT_PROPERTY];
        };
        /**
         * 获取左上角位置
         */
        WebUIObject.prototype.GetPos = function () {
            return this.position.Copy();
        };
        /**
         * 设置左上角位置
         * @param x UI元素相对父视图左上角位置的水平坐标
         * @param y	UI元素相对父视图左上角位置的垂直坐标
         * @description 非CSSLayout下生效
         */
        WebUIObject.prototype.SetPos = function (x, y) {
            var _a;
            var pos = new ARKPoint(x, y);
            if (Number.isNaN(pos.getX()) || Number.isNaN(pos.getY())) {
                logger$u.warn("warning: invalid size for SetPos, id=".concat(this.GetID(), ", type=GetType, pos=(").concat(pos.getX(), ", ").concat(pos.getY(), ")"));
                return;
            }
            if (this.IsCSSMode()) {
                return;
            }
            if (pos && ((_a = this.position) === null || _a === void 0 ? void 0 : _a.isNotEqual(pos))) {
                var oldPos = this.position.Copy();
                this.position = pos;
                this.DoMove(oldPos, pos.Copy());
                this.UpdateMargin();
            }
        };
        /**
         * 获取元素的宽度和高度
         * @description 这里没有调用cssLayoutNode.GetLayoutSize()的原因是不是所有的都是走的CSS布局。还有一部分走的旧版本的布局.
         * 所以比较好的做法时CSS布局或者其它布局更新后再更新实例Size
         */
        WebUIObject.prototype.GetSize = function () {
            return this.size.Copy();
        };
        /**
         * 设置元素大小
         * @param width UI元素的Width
         * @param height UI元素的Height
         * @description 如果不是CSSMode还是更新Rect
         */
        WebUIObject.prototype.SetSize = function (width, height) {
            if (isNaN(width) || isNaN(height)) {
                logger$u.warn("warning: invalid size for SetSize, id=".concat(this.GetID(), ", type=").concat(this.GetNodeType(), ", size=(").concat(width, ", ").concat(height, ")"));
                return;
            }
            if (this.IsCSSMode()) {
                logger$u.warn("warning: call SetSize for a flexbox ui object, id=".concat(this.GetID(), ", type=").concat(this.nodeType));
                return;
            }
            var size = new ARKSize(width, height);
            if (this.size.IsNotEqual(size)) {
                var oldSize = this.GetSize();
                this.size = size;
                this.DoResize(oldSize, this.size.Copy());
                this.UpdateMargin();
                this.UpdateRect();
            }
        };
        /**
         * 设置边距，最终结果受布局器（Layout）影响
         * @param left 左边距
         * @param top 上边距
         * @param right 右边距
         * @param bottom 下边距
         * @param update 是否需要更新布局.默认为true.内部调用的时候可能不需要更新布局.提供给外部的接口需要强制刷新
         * @description 非CSSLayout布局下生效
         * @TODO 这里后面最好还是分出去.不然维护很麻烦.
         */
        WebUIObject.prototype.SetMargin = function (left, top, right, bottom, update) {
            if (update === void 0) { update = true; }
            if (this.IsCSSMode()) {
                return;
            }
            var rect = new ARKRect(left, top, right, bottom);
            if (ARKRect.IsEqual(rect, this.margin)) {
                return;
            }
            this.margin = rect;
            if (update === false) {
                return;
            }
            this.UpdateRect();
        };
        /**
         * 获取边距
         * @description 非CSSLayout布局下生效
         */
        WebUIObject.prototype.GetMargin = function () {
            return this.margin;
        };
        /**
         * 获取相对顶层视图的矩形区域
         */
        WebUIObject.prototype.GetRootRect = function () {
            var rect = new ARKRect(0, 0, this.size.GetWidth(), this.size.GetHeight());
            var parentView = this.GetParent();
            if (parentView) {
                rect.AddPoint(this.position);
                rect.SubtractPoint(parentView.GetRelativePos());
                while (parentView.GetParent()) {
                    var pos = parentView.GetPos();
                    rect.AddPoint(pos);
                    parentView = parentView.GetParent();
                    rect.SubtractPoint(parentView.GetRelativePos());
                }
            }
            return rect;
        };
        /**
         * 获取Alpha值（0-255）
         */
        WebUIObject.prototype.GetAlpha = function () {
            return this.alpha;
        };
        /**
         * 设置Alpha (0-255)
         * @param alpha
         */
        WebUIObject.prototype.SetAlpha = function (alpha) {
            if (this.alpha !== alpha) {
                this.alpha = alpha;
                this.Update();
            }
        };
        /**
         * 获取元素的隐藏状态
         * @returns
         */
        WebUIObject.prototype.GetVisible = function () {
            return this.isVisible;
        };
        /**
         * 更新Visible状态
         * @param visible
         * @description 当Visible发生更新的时候需要重新布局
         */
        WebUIObject.prototype.SetVisible = function (visible) {
            logger$u.debug('SetVisible', visible);
            if (visible !== this.isVisible) {
                this.isVisible = visible;
                this.Update();
                this.DoVisibleChanged();
            }
        };
        /**
         * 判断元素是否可见.
         * @description 这里会去查找父元素是否可见
         */
        WebUIObject.prototype.CheckVisible = function () {
            var pObj = this;
            while (pObj) {
                if (!pObj.GetVisible()) {
                    return false;
                }
                pObj = pObj.GetParent();
            }
            return true;
        };
        /**
         * 获取可用性
         */
        WebUIObject.prototype.GetEnable = function () {
            return this.enable;
        };
        /**
         * 设置可用性
         * @description 如果View设置为禁用，它的所有子UI元素也不可用
         */
        WebUIObject.prototype.SetEnable = function (enable) {
            if (this.enable !== enable) {
                if (!enable) {
                    // @TODO
                }
                this.enable = enable;
                this.Update();
                this.DoEnabledChanged();
            }
        };
        /**
         * 设置对齐方式
         * @param Anchors属性（0-15）
         * @description 非CSSLayout时有效
         */
        WebUIObject.prototype.SetAnchors = function (anchors, update) {
            if (this.IsCSSMode()) {
                return;
            }
            if (this.anchors !== anchors) {
                this.anchors = anchors;
                if (update) {
                    this.UpdateMargin();
                }
            }
        };
        /**
         * 获取对齐方式
         */
        WebUIObject.prototype.GetAnchors = function () {
            return this.anchors;
        };
        /**
         * 获取Metadata
         */
        WebUIObject.prototype.GetMetadata = function () {
            throw new Error('Method not implemented.');
        };
        /**
         * 设置Metadata
         * @param metadata 参数为Key-Value键值对，当Key等于MetadataType时，把调用SetValue(Value)。
         */
        WebUIObject.prototype.SetMetadata = function (metadata) {
            logger$u.debug('SetMetadata:', metadata);
            throw new Error('Method not implemented.');
        };
        /**
         * 获取MetadataType
         */
        WebUIObject.prototype.GetMetadataType = function () {
            throw new Error('Method not implemented.');
        };
        /**
         * 设置MetadataType
         * @param type 元数据类型
         */
        WebUIObject.prototype.SetMetadataType = function (type) {
            logger$u.debug('SetMetadataType:', type);
            throw new Error('Method not implemented.');
        };
        /**
         * 判断当前UI元素是否为焦点（Windows）
         */
        WebUIObject.prototype.IsFocused = function () {
            throw new Error('Method not implemented.');
        };
        /**
         * 设置为焦点UI元素（Windows）
         * @param focus
         */
        WebUIObject.prototype.SetFocus = function (focus) {
            logger$u.debug('SetFocus:', focus);
            throw new Error('Method not implemented.');
        };
        /**
         * 获取同层级（同父亲）的下一个UI元素
         */
        WebUIObject.prototype.GetNextObject = function () {
            throw new Error('Method not implemented.');
        };
        /**
         * 获取同层级（同父亲）的上一个UI元素
         */
        WebUIObject.prototype.GetPrevObject = function () {
            throw new Error('Method not implemented.');
        };
        /**
         * 获取顶层视图
         * @description 如果是View节点.没有挂载的时候.返回当前节点, 挂载完成之后显示根节点
         */
        WebUIObject.prototype.GetRoot = function () {
            var parent = this.GetParent();
            if (!parent) {
                return this.IsType(NodeTypeEnum.VIEW) ? this : null;
            }
            return parent.GetRoot();
        };
        /**
         * 更新节点
         * @param rect
         */
        WebUIObject.prototype.Update = function () {
            var rect = new ARKRect(0, 0, this.size.GetWidth(), this.size.GetHeight());
            this.DoChange(rect);
        };
        /**
         * 设置圆角参数
         * @param left 左上边距 string
         * @param top 右上边距
         * @param right 右下边距
         * @param bottom 左下边距
         * @param update 是否需要更新布局.默认为true.内部调用的时候可能不需要更新布局.提供给外部的接口需要强制刷新
         * @description 兼容下left为字符串的场景. 有些Ark消息通过 SetRadius('2 2 2 2');设置了圆角信息
         * @see com.tencent.channel.robot
         */
        WebUIObject.prototype.SetRadius = function (left, top, right, bottom, update) {
            if (update === void 0) { update = true; }
            var radius = new ARKRect();
            if (typeof left === 'string') {
                var result = formatEdge(left);
                if (result === null) {
                    return;
                }
                radius.SetRect(result.left, result.top, result.right, result.bottom);
            }
            else if (isNumber(left) && isNumber(top) && isNumber(bottom) && isNumber(bottom)) {
                radius.SetRect(left, top, right, bottom);
            }
            else {
                logger$u.error("SetRadius() param error. left:".concat(left, ", top:").concat(top, ", right:").concat(right, ", bottom:").concat(bottom));
                return;
            }
            if (ARKRect.IsNotEqual(this.radius, radius)) {
                this.radius = radius;
                if (update === false) {
                    return;
                }
                this.Update();
            }
        };
        /**
         * 获取Radius
         */
        WebUIObject.prototype.GetRadius = function () {
            return this.radius;
        };
        /**
         * 设置样式
         * @param styles
         * @description 当为CSS布局的时候会调用.此时会修改layout为CSS布局
         * @description 支持通过className设置或者字符串.或者单个
         * @example
         * SetStyle('display:flex');
         * SetStyle('display', 'flex');
         * SetStyle('title');
         */
        WebUIObject.prototype.SetStyle = function (style) {
            if (!style) {
                return;
            }
            this.DoCreateLayoutNode();
            var cssLayoutNode = this.GetCSSLayoutNode();
            cssLayoutNode.SetStyle(style);
            // 如果没有显示设置 display:flex; 则不需要CSS布局. 此时当除非显示的指定Layout. 则默认为NormalLayout
            if (cssLayoutNode.IsBox() && this.IsType(NodeTypeEnum.VIEW)) {
                var pView = this;
                var layout = new CSSLayout();
                pView.SetLayout(layout);
                if (!pView.IsLockLayout()) {
                    this.DoCSSLayout();
                }
            }
            else {
                this.DoCSSLayout();
            }
        };
        /**
         * 获取指定属性名称的样式
         * @param name
         * @returns
         */
        WebUIObject.prototype.GetStyle = function (name) {
            var cssLayoutNode = this.GetCSSLayoutNode();
            if (cssLayoutNode) {
                return cssLayoutNode.GetStyle(name);
            }
            return '';
        };
        /**
         * 获取值
         * @TODO
         */
        WebUIObject.prototype.GetValue = function () {
            throw new Error('Method not implemented.');
        };
        /**
         * 设置值
         * @description 当调用SetValue方法设置值时，触发OnSetValue事件，提供一个改变值的机会
         */
        WebUIObject.prototype.SetValue = function (value) {
            logger$u.debug('SetValue:', value);
            this.DoSetValue(value);
        };
        /**
         * 元素选中状态
         */
        WebUIObject.prototype.GetSelected = function () {
            throw new Error('Method not implemented.');
        };
        /**
         * 设置元素选中状态
         */
        WebUIObject.prototype.SetSelected = function (selected) {
            logger$u.debug('SetSelected:', selected);
            throw new Error('Method not implemented.');
        };
        /**
         * 设置大小是否自动
         * @param autoSize. CSS模式下无效
         */
        WebUIObject.prototype.SetAutoSize = function (autoSize) {
            if (this.autoSize !== autoSize) {
                this.autoSize = autoSize;
                if (this.IsCSSMode())
                    return;
                if (this.autoSize) {
                    this.AutoSize();
                }
            }
        };
        /**
         * 获取大小是否自动
         */
        WebUIObject.prototype.GetAutoSize = function () {
            return this.autoSize;
        };
        /**
         * 判断传入坐标是否在视图范围内
         * @param x 横坐标
         * @param y 纵坐标
         */
        WebUIObject.prototype.HitTest = function (x, y) {
            if (!this.isVisible || this.alpha === 0) {
                return false;
            }
            var rect = this.GetRect();
            return rect.PtInRect(new ARKPoint(x, y));
        };
        /**
         * 获取相对父视图的矩形区域
         * @description 这里没有调用cssLayoutNode.GetLayoutRect()的原因是不是所有的都是走的CSS布局。还有一部分走的旧版本的布局.
         * 所以比较好的做法时CSS布局或者其它布局更新后再更新实例的position以及size信息.
         */
        WebUIObject.prototype.GetRect = function () {
            var _a = this, position = _a.position, size = _a.size;
            return new ARKRect(position, ARKPoint.AddSize(position, size));
        };
        /**
         * 设置相对父视图的矩形区域
         * @param left 左边距
         * @param top 上边距
         * @param right 右边距
         * @param bottom 下边距
         * @param update 是否需要更新布局.默认为true.内部调用的时候可能不需要更新布局.提供给外部的接口需要强制刷新
         * @description CSSLayout下无效
         */
        WebUIObject.prototype.SetRect = function (left, top, right, bottom, update) {
            if (update === void 0) { update = true; }
            if (this.IsCSSMode()) {
                return;
            }
            var bChange = false;
            var rect = new ARKRect(left, top, right, bottom);
            if (ARKPoint.isNotEqual(rect.TopLeft(), this.position)) {
                var oldPos = this.position.Copy();
                this.position = rect.TopLeft();
                this.DoMove(oldPos, this.position.Copy());
                bChange = true;
            }
            if (ARKSize.IsNotEqual(rect.GetSize(), this.size)) {
                var oldSize = this.size;
                this.size = rect.GetSize();
                this.DoResize(oldSize, this.size.Copy());
                bChange = true;
            }
            if (update === false) {
                return;
            }
            if (bChange) {
                this.UpdateMargin();
            }
        };
        /**
         * 强转对象为WebView
         * @description 自定义拓展方法
         */
        WebUIObject.prototype.AsWebView = function () {
            return this;
        };
        /**
         * 更新锁定
         * @TODO 这里判断条件记得再对比下
         * @TODO 待验证
         */
        WebUIObject.prototype.LockUpdate = function () {
            if (!this.lockUpdate) {
                this.renderRect.SetRectEmpty();
            }
            if (this.lockUpdate > 0) {
                return false;
            }
            this.lockUpdate++;
            return true;
        };
        /**
         * 解锁
         * @param redraw 是否重绘
         * @TODO 待验证
         */
        WebUIObject.prototype.UnlockUpdate = function (redraw) {
            this.DoChange(this.renderRect);
            if (this.lockUpdate) {
                this.lockUpdate--;
                if (!this.lockUpdate) {
                    if (redraw && !this.renderRect.IsNotEmpty()) {
                        this.DoChange(this.renderRect);
                        this.renderRect.SetRectEmpty();
                    }
                }
                return true;
            }
            return false;
        };
        /**
         * 是否锁定更新
         */
        WebUIObject.prototype.IsLockUpdate = function () {
            return false;
            // return this.lockUpdate;
        };
        /**
         * 当布局类型为CSS布局的时候会执行
         * @description 这里没有像Native那样对根节点的宽高做向上取证.很容易导致死循环(大小更新 -> 更新子节点 -> 通知父节点更新 -> 然后可能计算出小数 -> 更新)
         *
         * @TODO 如果父节点为null.且不是根节点.那是不是可以不用重新布局?
         */
        WebUIObject.prototype.DoCSSLayout = function () {
            // logger.debug('DoCSSLayout type:', this.GetNodeType(), ', id:', this.GetID());
            if (!this.IsCSSMode()) {
                logger$u.warn('DoCSSLayout: is not css mode');
                return;
            }
            // 如果还没有挂载到父节点之后.且是View标签.则不处理布局信息
            if (this.GetParent() === null) {
                var pView = WebView.AsWebView(this);
                if (!(pView === null || pView === void 0 ? void 0 : pView.IsRoot())) {
                    logger$u.debug('DoCSSLayout: not mounted. ignore layout. id:', this.GetID());
                    return;
                }
            }
            /**
             * 这里实际上有问题
             * @description 如果通过root.GetParent()去往上查找.如果当前节点的父元素没有被挂载.那么实际找到的是当前父元素.此时
             */
            var pCSSLayoutNode = this.GetCSSLayoutNode();
            while (pCSSLayoutNode.GetParent()) {
                pCSSLayoutNode = pCSSLayoutNode.GetParent();
            }
            if (pCSSLayoutNode === null || pCSSLayoutNode === void 0 ? void 0 : pCSSLayoutNode.IsBox()) {
                var pUIObj = pCSSLayoutNode.GetUIObject();
                if (pUIObj === null || pUIObj === void 0 ? void 0 : pUIObj.IsType(NodeTypeEnum.VIEW)) {
                    // 如果当前节点的布局被锁定.则不做处理.否则计算根元素的布局
                    var rootView = pUIObj;
                    if (!rootView.IsLockLayout()) {
                        /**
                         * CalculateLayout 会重新计算子元素位置.逻辑较重.需要尽可能的减少计算布局的操作。
                         * @description 同时会触发 MeasureFunc
                         */
                        pCSSLayoutNode.CalculateLayout();
                    }
                    else {
                        return;
                    }
                }
            }
            else {
                return;
            }
            // 当重新计算布局之后.获取当前元素的区域和大小.如果有更新.则需要刷新当前的元素的区域信息
            var cssLayoutNode = this.GetCSSLayoutNode();
            var rect = cssLayoutNode.GetLayoutRect();
            var size = cssLayoutNode.GetLayoutSize();
            var bChange = false;
            // 如果位置信息发生改变
            if (this.position.isNotEqual(rect.TopLeft())) {
                var ptOld = this.position;
                this.position = rect.TopLeft();
                this.DoMove(ptOld.Copy(), this.position.Copy());
                bChange = true;
            }
            // 大小发生改变
            // const beforeSize = this.size.Copy();
            if (ARKSize.IsNotEqual(size, this.size)) {
                var szOld = this.size;
                this.size = size;
                // @TODO 这里一定需要在查下.很容易出现死循环. 因为Resize的时候会重新布局当前元素. 而bChange的时候也会更新布局. 是不是考虑直接重刷?
                this.DoResize(szOld.Copy(), size.Copy());
                bChange = true;
            }
            // 如果有更新.则需要更新节点的所在的区域信息. @TODO 可以性能优化的点。这里UpdateRect可以优化。渲染次数太多
            if (bChange) {
                // logger.debug('DoCSSLayout: bChange', this.GetID(), size, beforeSize);
                this.UpdateRect();
            }
        };
        /**
         * 渲染
         * @param context
         * @param renderRect 渲染区域
         */
        WebUIObject.prototype.RenderTo = function (context, renderRect) {
            context.save();
            this.ClipRadius(context);
            var ret = this.DoRenderTo(context, renderRect);
            context.restore();
            return ret;
        };
        /**
         * 计算内容渲染区域的尺寸
         * @description 当且仅当图片和文本需要测量
         */
        WebUIObject.prototype.MeasureSize = function (size) {
            logger$u.debug('MeasureSize:', size);
            return new ARKSize();
        };
        /**
         * 更新相对位置
         */
        WebUIObject.prototype.RelativePosChange = function () {
            // EMPTY FUNCTION
        };
        /**
         * 释放资源
         */
        WebUIObject.prototype.Release = function () {
            _super.prototype.Release.call(this);
            logger$u.info('Release WebUIObject');
            if (Array.isArray(this.children)) {
                this.children.forEach(function (child) {
                    child.Release();
                });
            }
            var cssLayoutNode = this.GetCSSLayoutNode();
            if (cssLayoutNode) {
                cssLayoutNode.Release();
            }
            this.SetParent(null);
            this.children = [];
        };
        /**
         * 点击事件的处理
         * @param x 单击时相对UI元素的y坐标
         * @param y 单击时相对UI元素的y坐标
         * @param button 单击所使用鼠标按键的键值（在触屏设备上默认为1）
         * @param keyState 单击时同时按下的键盘按键的键值（Windows）
         */
        WebUIObject.prototype.DoClick = function (x, y, button, keyState) {
            this.Click(x, y, button, keyState);
            if (this.CheckEnable()) {
                // 这里不用像 Native 那般取判断事件是否绑定, 在序列化的时候已经有绑定好了事件
                this.FireEvent(UIObjectEventEnum.ON_CLICK, this, x, y, button, keyState);
            }
        };
        /**
         * 鼠标按键按下时的处理
         * @param x 单击时相对UI元素的y坐标
         * @param y 单击时相对UI元素的y坐标
         * @param button 单击所使用鼠标按键的键值（在触屏设备上默认为1）
         * @param keyState 单击时同时按下的键盘按键的键值（Windows）
         */
        WebUIObject.prototype.DoMouseDown = function (x, y, button, keyState) {
            if (this.CheckEnable()) {
                this.FireEvent(UIObjectEventEnum.ON_MOUSE_DOWN, this, x, y, button, keyState);
            }
        };
        /**
         * 鼠标按键按下时的处理
         * @param x 单击时相对UI元素的y坐标
         * @param y 单击时相对UI元素的y坐标
         * @param button 单击所使用鼠标按键的键值（在触屏设备上默认为1）
         * @param keyState 单击时同时按下的键盘按键的键值（Windows）
         */
        WebUIObject.prototype.DoMouseUp = function (x, y, button, keyState) {
            if (this.CheckEnable()) {
                this.FireEvent(UIObjectEventEnum.ON_MOUSE_UP, this, x, y, button, keyState);
            }
        };
        /**
         * 当节点的父节点发生改变的时候的处理
         * @param parent
         * @param attach 是否挂载
         * @TODO 事件触发
         *
         * @description 做几件事情:
         * 1、在父节点中插入或者移除节点
         * 2、子节点以及父节点重新布局(@TODO: 可以优化的点)
         * 3、RenderTree更新
         */
        WebUIObject.prototype.DoParentChanged = function (parent, attach) {
            this.DoCSSLayoutNodeChanged(parent, attach);
            this.UpdateRect();
            this.RenderTreeChange(Boolean(parent));
            this.FireEvent(UIObjectEventEnum.ON_PARENT_CHANGED, this, parent);
        };
        /**
         * 事件异常监控
         * @param name 异常事件名称
         * @param script 异常事件脚本
         * @param error 错误信息
         */
        WebUIObject.prototype.EventCatchErrorHandle = function (name, script, error) {
            var app = this.GetApp();
            WebReport.error(app, TracerTagEnum.ARK_EVENT_EXCEPTION, error, {
                eventName: name,
                eventScript: script,
            });
        };
        /**
         * 处理子节点更新
         */
        WebUIObject.prototype.DoChildChange = function (child) {
            this.FireEvent(UIObjectEventEnum.ON_CHILD_CHANGE, this, child);
        };
        /**
         * 处理Size的更新
         * @param oldSize
         * @param newSize
         * @description 需要清理圆角路径
         */
        WebUIObject.prototype.DoResize = function (oldSize, newSize) {
            // ClearRadiusPath();
            this.Resize(oldSize, newSize);
            this.FireEvent(UIObjectEventEnum.ON_RESIZE, this, oldSize.GetWidth(), oldSize.GetHeight(), newSize.GetWidth(), newSize.GetHeight());
        };
        /**
         * 更新渲染区域
         * @param rect
         */
        WebUIObject.prototype.DoChange = function (rect) {
            if (this.lockUpdate) {
                logger$u.debug('[DoChange]', rect);
                this.renderRect.UnionRect(rect);
            }
            else {
                this.Change(rect);
                this.FireEvent(UIObjectEventEnum.ON_CHANGE, this, rect.getLeft(), rect.getTop(), rect.getRight(), rect.getBottom());
            }
        };
        /**
         * 移动元素
         * @param oldPos
         * @param newPos
         * @TODO 待测试.
         */
        WebUIObject.prototype.DoMove = function (oldPos, newPos) {
            this.Move(oldPos, newPos);
            this.FireEvent(UIObjectEventEnum.ON_MOVE, this, oldPos.getX(), oldPos.getY(), newPos.getX(), newPos.getY());
        };
        /**
         * 更新渲染区域
         * @param rect
         */
        WebUIObject.prototype.Change = function (rect) {
            this.NotifyParentChanged(rect);
        };
        /**
         * 更新Size
         * @param oldSize
         * @param newSize
         * @TODO 这里的NotifyParentResize命名觉得不太规范.理论上这里是不是直接当前元素Resize就好了
         */
        WebUIObject.prototype.Resize = function (oldSize, newSize) {
            this.NotifyParentResize(oldSize, newSize);
        };
        /**
         * 借助layout更新元素的区域信息
         */
        WebUIObject.prototype.UpdateRect = function () {
            var parent = this.GetParent();
            if (!parent) {
                return;
            }
            var mParent = parent;
            var layout = mParent.GetLayout();
            var isLockLayout = mParent.IsLockLayout();
            // 如果父元素的布局已经被锁定.则不做处理
            if (isLockLayout || !layout) {
                return;
            }
            // @TODO CSSMode可以不用计算Rect
            var rect = parent.GetRect();
            rect === null || rect === void 0 ? void 0 : rect.MoveToXY(0, 0);
            layout.UpdateRect(this, rect);
        };
        /**
         * 更新Margin
         * @description
         * 1、非CSSLayout才会触发
         * 2、更新anchors会触发
         * 3、更新pos会触发
         * 4、更新大小时会触发
         * 5、更新rect时会触发
         */
        WebUIObject.prototype.UpdateMargin = function () {
            var parent = this.GetParent();
            if (!parent) {
                return;
            }
            var mParent = parent;
            var layout = mParent.GetLayout();
            var isLockLayout = mParent.IsLockLayout();
            if (layout && !isLockLayout) {
                var parentRect = mParent.GetRect();
                parentRect.MoveToXY(0, 0);
                layout.UpdateMargin(this, parentRect);
            }
        };
        /**
         * 当文本和图片更新后需要重新计算
         * @description 非CSSLayout不会处理
         */
        WebUIObject.prototype.DoCSSCustomUpdate = function () {
            var cssLayoutNode = this.GetCSSLayoutNode();
            if (this.IsCSSMode()) {
                cssLayoutNode.MarkDirty();
                this.UpdateRect();
            }
        };
        /**
         * 处理CSS布局的节点发生改变的情况
         * @param parent
         * @param attach
         * @returns
         */
        WebUIObject.prototype.DoCSSLayoutNodeChanged = function (parent, attach) {
            var e_1, _a;
            if (!parent || !parent.IsType(NodeTypeEnum.VIEW)) {
                return;
            }
            var parentCssLayoutNode = parent.GetCSSLayoutNode();
            /**
             * 这个地方需要非常...非常的注意.
             * @description 如果一个元素没有显示的设置 display:flex. 那么它将不是一个flex box.这个时候所有的元素不能插入到当前flex布局树中. 所有的子元素
             * 需要通过原始的那几种布局来实现.( NormalLayout、ListLayout... ); 而一旦它设置了样式.它默认又是 flex 布局. 只是不是一个flex box而已.
             */
            if (!(parentCssLayoutNode === null || parentCssLayoutNode === void 0 ? void 0 : parentCssLayoutNode.IsBox())) {
                return;
            }
            if (attach) {
                this.DoCreateLayoutNode();
                var cssLayoutNode_1 = this.GetCSSLayoutNode();
                // 只过滤出显示的. 而且需要过滤掉本身
                var index = 0;
                try {
                    for (var _b = __values$1(parent.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var child = _c.value;
                        if (child === this) {
                            break;
                        }
                        else if (child.GetVisible() && child !== this) {
                            index++;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                // 如果当前节点的父节点不是parent节点.则添加.
                if ((cssLayoutNode_1 === null || cssLayoutNode_1 === void 0 ? void 0 : cssLayoutNode_1.GetParent()) !== parentCssLayoutNode) {
                    parentCssLayoutNode.InsertChild(cssLayoutNode_1, index);
                }
                return;
            }
            var cssLayoutNode = this.GetCSSLayoutNode();
            // 否则如果是当前子节点.则移除.
            if ((cssLayoutNode === null || cssLayoutNode === void 0 ? void 0 : cssLayoutNode.GetParent()) === parentCssLayoutNode) {
                parentCssLayoutNode.RemoveChild(cssLayoutNode);
            }
        };
        /**
         * 通知父节点更新大小
         * @param oldSize
         * @param newSize
         * @TODO 后面再看下写法这里可以怎么优化
         */
        WebUIObject.prototype.NotifyParentResize = function (oldSize, newSize) {
            var parent = this.GetParent();
            if (!parent) {
                return;
            }
            var mParent = WebView.AsWebView(parent);
            if (!mParent) {
                logger$u.warn('parent is not WebView');
                return;
            }
            mParent.ChildResize(this.AsWebView(), oldSize, newSize);
        };
        /**
         * 通知父节点更新区域
         * @returns
         */
        WebUIObject.prototype.NotifyParentChanged = function (rect) {
            var parent = this.GetParent();
            if (!parent) {
                return;
            }
            var mParent = parent;
            if (!mParent) {
                logger$u.warn('parent is not WebView');
                return;
            }
            mParent.ChildChange(this.AsWebView(), rect);
        };
        /**
         * 移动元素
         */
        WebUIObject.prototype.NotifyParentMove = function (sourcePoint, destPoint) {
            var parent = this.GetParent();
            if (!parent) {
                return;
            }
            var mParent = parent;
            if (!mParent) {
                logger$u.warn('parent is not WebView');
                return;
            }
            mParent.ChildMove(this.AsWebView(), sourcePoint, destPoint);
        };
        /**
         * 自动处理大小
         */
        WebUIObject.prototype.AutoSize = function () {
            // EMPTY FUNCTION
        };
        /**
         * 绘制圆角
         */
        WebUIObject.prototype.ClipRadius = function (context) {
            if (!this.radius || this.radius.IsEmpty()) {
                return;
            }
            var _a = this, size = _a.size, radius = _a.radius;
            var renderRect = new ARKRect(0, 0, size.GetWidth(), size.GetHeight());
            var left = renderRect.getLeft();
            var top = renderRect.getTop();
            var right = renderRect.getRight();
            var bottom = renderRect.getBottom();
            context.beginPath();
            context.moveTo(left, top + radius.getLeft());
            context.arcTo(left, top, left + radius.getLeft(), top, radius.getLeft());
            context.arcTo(right, top, right, top + radius.getTop(), radius.getTop());
            context.arcTo(right, bottom, right - radius.getRight(), bottom, radius.getRight());
            context.arcTo(left, bottom, left, bottom - radius.getBottom(), radius.getBottom());
            context.closePath();
            context.clip();
        };
        /**
         * 检测元素是否可用
         * @returns boolean
         */
        WebUIObject.prototype.CheckEnable = function () {
            // @TODO
            return true;
        };
        /**
         * 默认处理
         * @description 子类会重写
         */
        WebUIObject.prototype.Click = function (x, y, button, keyState) {
            logger$u.debug('Click', x, y, button, keyState);
        };
        /**
         * 鼠标按下时的处理
         * @description 子类会重写
         */
        WebUIObject.prototype.MouseDown = function (x, y, button, keyState) {
            logger$u.debug('MouseDown', x, y, button, keyState);
        };
        WebUIObject.prototype.DoTouchStart = function () {
            throw new Error('Method not implemented.');
        };
        WebUIObject.prototype.DoTouchEnd = function () {
            throw new Error('Method not implemented.');
        };
        WebUIObject.prototype.DoTouchMove = function () {
            throw new Error('Method not implemented.');
        };
        WebUIObject.prototype.DoTouchCancel = function () {
            throw new Error('Method not implemented.');
        };
        WebUIObject.prototype.DoMouseMove = function () {
            throw new Error('Method not implemented.');
        };
        WebUIObject.prototype.DoDblClick = function () {
            throw new Error('Method not implemented.');
        };
        WebUIObject.prototype.DoMouseHover = function () {
            throw new Error('Method not implemented.');
        };
        WebUIObject.prototype.DoMouseEnter = function () {
            throw new Error('Method not implemented.');
        };
        WebUIObject.prototype.DoMouseLeave = function () {
            throw new Error('Method not implemented.');
        };
        WebUIObject.prototype.DoMouseWheel = function () {
            throw new Error('Method not implemented.');
        };
        WebUIObject.prototype.DoKeyDown = function () {
            throw new Error('Method not implemented.');
        };
        WebUIObject.prototype.DoKeyUp = function () {
            throw new Error('Method not implemented.');
        };
        /**
         * 移动节点
         * @param sourcePoint
         * @param destPoint
         */
        WebUIObject.prototype.Move = function (sourcePoint, destPoint) {
            this.NotifyParentMove(sourcePoint, destPoint);
        };
        /**
         * 当Visible发生改变时的处理
         * @TODO 事件触发
         */
        WebUIObject.prototype.DoVisibleChanged = function () {
            var isVisible = this.isVisible;
            var parent = this.GetParent();
            this.DoCSSLayoutNodeChanged(parent, isVisible);
            this.UpdateRect();
            this.FireEvent(UIObjectEventEnum.ON_VISIBLE_CHANGED, this);
        };
        /**
         * enable改变后的处理
         * @TODO 事件触发
         */
        WebUIObject.prototype.DoEnabledChanged = function () {
            // @TODO
        };
        /**
         * @TODO 事件触发
         */
        WebUIObject.prototype.RenderTreeChange = function (attach) {
            logger$u.debug('RenderTreeChange:', attach);
        };
        /**
         * 创建CSS布局节点
         * @description 当出现以下两种情况的时候会创建CSS布局
         * 1、当通过 SetStyle 设置样式的时候说明它是一个CSS布局
         * 2、当布局 DoCSSLayoutNodeChanged 节点发生更新的时候
         */
        WebUIObject.prototype.DoCreateLayoutNode = function () {
            var cssLayoutNode = this.GetCSSLayoutNode();
            if (!cssLayoutNode) {
                /**
                 * 这里不能挂载这个属性上，如果app动态挂载了 UIObject 的属性，那么可能会导致循环引用，如果 JSON.stringify 的话会导致死循环，从而内存溢出
                 */
                Object.defineProperty(this, CSS_LAYOUT_NODE_PROPERTY, {
                    value: new CSSLayoutNode(this),
                    enumerable: false,
                    writable: true,
                    configurable: false,
                });
            }
        };
        return WebUIObject;
    }(UIObject));

    /**
     * Ark布局: 普通布局
     * @author alawnxu
     * @date 2022-07-11 21:09:11
     * @version 1.0.0
     */
    var logger$t = Logger.getLogger('NormalLayout');
    var NormalLayout = /** @class */ (function (_super) {
        __extends$1(NormalLayout, _super);
        function NormalLayout() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NormalLayout.prototype.GetName = function () {
            return LayoutEnum.NORMAL_LAYOUT;
        };
        NormalLayout.prototype.InitParameters = function (element) {
            logger$t.debug('InitParameters:', element);
        };
        NormalLayout.prototype.DoLayout = function (view) {
            var e_1, _a;
            if (!view) {
                return;
            }
            var parentRect = view.GetRect();
            parentRect.MoveToXY(0, 0);
            try {
                for (var _b = __values$1(view.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    this.UpdateRect(child, parentRect);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        /**
         * 根据父元素的Rect信息刷新渲染区域
         * @param child 子节点信息
         * @param parentRect 父节点的区域信息
         */
        NormalLayout.prototype.UpdateRect = function (child, parentRect) {
            if (!child) {
                return;
            }
            var size = child.GetSize();
            var pos = child.GetPos();
            var margin = child.GetMargin();
            var anchors = child.GetAnchors();
            // 判断是否是右对齐(当anchors<4时都为0.或者倍数).而anchors的设计1,2,4,8.所以这里 anchors & AnchorsEnum.ANCHOR_RIGHT 表示设置了右对齐
            if (anchors & AnchorsEnum.ANCHOR_RIGHT) {
                // 判断是否为左对齐. &1. 只有当为奇数时才会为1.而只有当设置了右对齐的时候才会有.此时对宽度会有影响
                if (anchors & AnchorsEnum.ANCHOR_LEFT) {
                    // 宽度为父元素宽度减去两侧的边距
                    size.SetWidth(Math.max(0, parentRect.Width() - margin.getLeft() - margin.getRight()));
                    // 横坐标同左对齐
                    pos.setX(margin.getLeft() + parentRect.getLeft());
                }
                else {
                    // 右对齐.横坐标 = 父容器的左侧边界 - 元素大小 - 右边距. 只改变横坐标位置.对宽度无影响
                    pos.setX(parentRect.getRight() - size.GetWidth() - margin.getRight());
                }
            }
            else if (anchors & AnchorsEnum.ANCHOR_LEFT) {
                // 左对齐.对宽度没有影响
                pos.setX(margin.getLeft() + parentRect.getLeft());
            }
            else {
                // 水平方向没有设置对齐方式.
                var marginAxisRow = Math.abs(margin.getLeft()) + Math.abs(margin.getRight());
                if (marginAxisRow) {
                    // 设置了margin
                    pos.setX((margin.getLeft() * (parentRect.Width() - size.GetWidth())) / marginAxisRow + parentRect.getLeft());
                }
                else {
                    // 水平居中
                    pos.setX((parentRect.Width() - size.GetWidth()) / 2 + parentRect.getLeft());
                }
            }
            // 同理.判断是否设置了底部对齐. &8, 只有超过才会为不为0
            if (anchors & AnchorsEnum.ANCHOR_BOTTOM) {
                // 判断是否设置了顶部对齐.此时会影响高度
                if (anchors & AnchorsEnum.ANCHOR_TOP) {
                    size.SetHeight(Math.max(0, parentRect.Height() - margin.getTop() - margin.getBottom()));
                    pos.setY(margin.getTop() + parentRect.getTop());
                }
                else {
                    pos.setY(parentRect.getBottom() - size.GetHeight() - margin.getBottom());
                }
            }
            else if (anchors & AnchorsEnum.ANCHOR_TOP) {
                // 顶部对齐.只影响纵坐标
                pos.setY(margin.getTop() + parentRect.getTop());
            }
            else {
                // 没有设置垂直方向的对齐方式
                var marginAxisColumn = Math.abs(margin.getTop()) + Math.abs(margin.getBottom());
                if (marginAxisColumn) {
                    pos.setY((margin.getTop() * (parentRect.Height() - size.GetHeight())) / marginAxisColumn + parentRect.getTop());
                }
                else {
                    // 垂直居中
                    pos.setY((parentRect.Height() - size.GetHeight()) / 2 + parentRect.getTop());
                }
            }
            this.SetObjectRect(child, new ARKRect(pos, ARKPoint.AddSize(pos, size)));
        };
        /**
         * 更新Margin
         * @param child 子节点信息
         * @param parentRect 父节点的区域信息
         * @description CSSLayout不需要更新Margin
         */
        NormalLayout.prototype.UpdateMargin = function (child, parentRect) {
            if (!child) {
                return;
            }
            var parentSize = parentRect.GetSize();
            var pos = child.GetPos();
            var size = child.GetSize();
            /**
             * 无法理解会有这么明显的BUG.但是没办法.还是需要跟Native Ark保持一致.
             * @description 元素如果没有设置高度.那他的Bottom也不能就是 parentSize.GetHeight() - size.GetHeight() - pos.getY(); 这样的bottom就会变成了父节点的高度了. 这样计算高度的时候又会有问题.
             * 导致业务逻辑这边有需要 SetMargin() 去还原真实的margin
             */
            var right = parentSize.GetWidth() - size.GetWidth() - pos.getX();
            var bottom = parentSize.GetHeight() - size.GetHeight() - pos.getY();
            var rect = new ARKRect(pos.getX(), pos.getY(), right, bottom);
            this.SetObjectMargin(child, rect);
        };
        return NormalLayout;
    }(Layout));

    var logger$s = Logger.getLogger('WebView');
    var WebView = /** @class */ (function (_super) {
        __extends$1(WebView, _super);
        /**
         * 默认为普通布局
         */
        function WebView(applicationId) {
            var _this = _super.call(this, applicationId) || this;
            /**
             * 是否为悬浮视图
             * @description 非CSSLayout布局模式下生效
             */
            _this.isFloating = false;
            /**
             * 锁定布局
             * @description 这里记录的执行布局的次数
             */
            _this.lockLayout = 0;
            /**
             * @TODO 暂时还不知道作用
             */
            _this.opaque = false;
            _this.layout = new NormalLayout();
            _this.lockLayout = 0;
            _this.opaque = false;
            _this.textureList = [];
            _this.floatingViewList = [];
            _this.relativePos = ARKPoint.EmptyPoint;
            return _this;
        }
        WebView.isView = function (node) {
            return node.tagName === WebView.tagName;
        };
        /**
         * 强转为WebView
         * @param pObject
         */
        WebView.AsWebView = function (pObject) {
            if (pObject.IsType(NodeTypeEnum.VIEW)) {
                return pObject;
            }
            return null;
        };
        WebView.prototype.GetNodeType = function () {
            return NodeTypeEnum.VIEW;
        };
        /**
         * 获取值
         * @TODO
         */
        WebView.prototype.GetValue = function () {
            throw new Error('Method not implemented.');
        };
        /**
         * 设置元素值
         * @param value
         * @override
         * @description view.SetValue({img:"sample.png"}); 遍历Key-Value数组，当Key和子UI元素的id相等，调用子UI元素的SetValue方法，参数为Key对应的Value。
         */
        WebView.prototype.SetValue = function (value) {
            var _this = this;
            logger$s.info('SetValue:', value);
            _super.prototype.SetValue.call(this, value);
            if (!isObjectLike(value)) {
                return;
            }
            Object.keys(value).forEach(function (property) {
                var pChild = _this.GetChild(property);
                if (pChild) {
                    pChild.SetValue(value[property]);
                }
            });
        };
        /**
         * 判断是否为悬浮视图
         * @description 非CSSLayout下会用到
         */
        WebView.prototype.GetFloating = function () {
            return this.isFloating;
        };
        /**
         * 设置是否为悬浮视图
         * @description 非CSSLayout下会设置
         * @param isFloating
         */
        WebView.prototype.SetFloating = function (floating) {
            if (floating !== this.isFloating) {
                this.isFloating = floating;
                this.Update();
            }
        };
        /**
         * 获取子UI元素偏移值
         */
        WebView.prototype.GetRelativePos = function () {
            return this.relativePos.Copy();
        };
        /**
         * 设置子UI元素偏移值
         * @param x 偏移坐标的水平坐标
         * @param y 偏移坐标的垂直坐标
         * @description 设置偏移坐标，所有子UI元素的实际显示位置会叠加上偏移坐标
         */
        WebView.prototype.SetRelativePos = function (x, y) {
            this.relativePos = new ARKPoint(x, y);
        };
        /**
         * 添加子UI元素
         * @param child 添加的UI元素
         * @returns 是否成功添加
         * @TODO 待测试
         */
        WebView.prototype.AddChild = function (child) {
            logger$s.debug('AddChild', child);
            if (!child) {
                return false;
            }
            if (child.GetParent() === this) {
                return false;
            }
            // 防止死循环
            var pObj = this;
            while (pObj) {
                if (pObj === child) {
                    return false;
                }
                pObj = pObj.GetParent();
            }
            if (child.IsType(NodeTypeEnum.VIEW)) {
                if (WebView.AsWebView(child).IsRoot()) {
                    return false;
                }
            }
            // 添加节点
            this.AddObject(child);
            // @TODO 待测试
            var bFloating = false;
            var floatingRect = new ARKRect();
            if (child.IsType(NodeTypeEnum.VIEW)) {
                var pView = WebView.AsWebView(child);
                if (pView.GetFloating() || pView.GetFloatingRect(floatingRect)) {
                    var rootRect = pView.GetRootRect();
                    floatingRect.UnionRect(rootRect, floatingRect);
                    bFloating = true;
                }
            }
            if (bFloating) {
                var pRootView = this.GetRoot();
                if (pRootView) {
                    pRootView.RebuildFloating();
                    pRootView.DoChange(floatingRect);
                }
            }
            else {
                var childRect = child.GetRect();
                this.DoChange(childRect);
            }
            return true;
        };
        /**
         * 在指定位置添加子UI元素
         * @param pos
         * @param child 添加的UI元素
         * @returns 是否成功添加
         */
        WebView.prototype.InsertChild = function (pos, child) {
            if (!child || pos < 0) {
                return -1;
            }
            if (child.GetParent() === this) {
                return -1;
            }
            // 防止死循环
            var pObj = this;
            while (pObj) {
                if (pObj === child) {
                    return -1;
                }
                pObj = pObj.GetParent();
            }
            if (child.IsType(NodeTypeEnum.VIEW)) {
                if (WebView.AsWebView(child).IsRoot()) {
                    return -1;
                }
            }
            var insertIndex = this.InsertObject(pos, child);
            // @TODO 待测试
            var bFloating = false;
            var floatingRect = new ARKRect();
            if (child.IsType(NodeTypeEnum.VIEW)) {
                var pView = WebView.AsWebView(child);
                if (pView.GetFloating() || pView.GetFloatingRect(floatingRect)) {
                    var rootRect = pView.GetRootRect();
                    floatingRect.UnionRect(rootRect, floatingRect);
                    bFloating = true;
                }
            }
            if (bFloating) {
                var pRootView = this.GetRoot();
                if (pRootView) {
                    pRootView.RebuildFloating();
                    pRootView.DoChange(floatingRect);
                }
            }
            else {
                var childRect = child.GetRect();
                this.DoChange(childRect);
            }
            return insertIndex;
        };
        /**
         * 添加子节点
         * @param child
         * @description
         * 1、设置父节点信息
         * 2、在父节点中挂载子节点
         * 3、子节点布局
         * 4、触发子节点更新事件
         */
        WebView.prototype.AddObject = function (child) {
            var childParent = child.GetParent();
            if (childParent) {
                childParent.DeleteChild(child);
            }
            this.children.push(child);
            child.SetParent(this);
            // 挂载子节点
            child.DoParentChanged(this, true);
            // 如果是子节点是View节点.则进一步布局
            var pChild = WebView.AsWebView(child);
            if (pChild) {
                pChild.DoLayout();
            }
            // 触发子节点更新事件
            this.DoChildChange(child);
        };
        /**
         * 删除子元素
         * @param child 删除的UI元素
         * @returns boolean 是否删除成功
         * @TODO 待测试
         */
        WebView.prototype.DeleteChild = function (child) {
            logger$s.debug('DeleteChild:', child);
            if (!child) {
                return false;
            }
            if (child.GetParent() !== this) {
                return false;
            }
            var bFloating = false;
            var floatingRect = new ARKRect();
            if (child.IsType(NodeTypeEnum.VIEW)) {
                var pView = WebView.AsWebView(child);
                if (pView.GetFloating() || pView.GetFloatingRect(floatingRect)) {
                    var rootRect = pView.GetRootRect();
                    floatingRect.UnionRect(rootRect, floatingRect);
                    bFloating = true;
                }
            }
            this.DeleteObject(child);
            if (bFloating) {
                var pRootView = this.GetRoot();
                if (pRootView) {
                    pRootView.RebuildFloating();
                    pRootView.DoChange(floatingRect);
                }
            }
            else {
                var childRect = child.GetRect();
                this.DoChange(childRect);
            }
            return true;
        };
        /**
         * 删除节点
         * @param child
         */
        WebView.prototype.DeleteObject = function (child) {
            var index = this.children.findIndex(function (item) { return item === child; });
            if (index !== -1) {
                this.children.splice(index, 1);
            }
            child.DoParentChanged(this, false);
            child.SetParent(null);
            this.DoChildChange(child);
            // @TODO: 经常 Delete 之后还做些骚操作. 先不 Release 掉了,后面看下怎么处理
            // com.tencent.bot.query.rank
            // com.tencent.forum
            // child.Release();
        };
        /**
         * 添加子节点
         * @param child
         * @description
         * 1、设置父节点信息
         * 2、在父节点中挂载子节点
         * 3、子节点布局
         * 4、触发子节点更新事件
         * @TODO 待测试
         */
        WebView.prototype.InsertObject = function (pos, child) {
            if (pos < 0) {
                return -1;
            }
            var childParent = child.GetParent();
            if (childParent) {
                childParent.DeleteChild(child);
            }
            var insertIndex = pos;
            if (pos >= this.children.length - 1) {
                insertIndex = this.children.length;
                this.children.push(child);
            }
            else {
                this.children.splice(pos, 0, child);
            }
            child.SetParent(this);
            // 挂载子节点
            child.DoParentChanged(this, true);
            // 如果是子节点是View节点.则进一步布局
            var pChild = WebView.AsWebView(child);
            if (pChild) {
                pChild.DoLayout();
            }
            // 触发子节点更新事件
            this.DoChildChange(child);
            return insertIndex;
        };
        /**
         * 清空子节点
         * @returns boolean 是否清理成功
         * @TODO 待测试
         */
        WebView.prototype.ClearChildren = function () {
            logger$s.debug('ClearChildren:', this);
            if (!this.children.length) {
                return;
            }
            var bFloating = false;
            var floatingRect = new ARKRect();
            if (this.GetFloatingRect(floatingRect)) {
                var rootRect = this.GetRootRect();
                floatingRect.UnionRect(rootRect, floatingRect);
                bFloating = true;
            }
            // 锁定布局,等清理完成后统一重新布局.
            this.LockLayout();
            var len = this.children.length;
            for (var i = len - 1; i >= 0; i--) {
                var child = this.children[i];
                // 这里需要先把child移除掉.否则会死循环
                this.children.splice(i, 1);
                child.DoParentChanged(this, false);
                child.SetParent(null);
                child.Release();
            }
            this.children = [];
            this.UnlockLayout();
            this.DoChildChange(null);
            if (bFloating) {
                var pRootView = this.GetRoot();
                if (pRootView) {
                    pRootView.RebuildFloating();
                    pRootView.DoChange(floatingRect);
                }
            }
            else {
                this.Update();
            }
            return true;
        };
        /**
         * 根据id索引获取子UI元素，仅遍历当前层级
         * @param id 获取子UI元素的id
         * @TODO 待测试
         */
        WebView.prototype.GetChild = function (id) {
            var e_1, _a;
            if (!id) {
                return;
            }
            try {
                for (var _b = __values$1(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    if (child.GetID() === id) {
                        return child;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return null;
        };
        /**
         * 获取首个子UI元素
         * @TODO 待测试
         */
        WebView.prototype.GetFirstChild = function () {
            return this.children[0];
        };
        /**
         * 获取最后一个子UI元素
         * @TODO 待测试
         */
        WebView.prototype.GetLastChild = function () {
            return this.children[this.children.length - 1];
        };
        /**
         * 获取下一个子UI元素
         * @TODO 待测试
         */
        WebView.prototype.GetNextChild = function (child) {
            var _this = this;
            if (child && child.GetParent() === this) {
                var parent_1 = child.GetParent();
                var index = parent_1.children.findIndex(function (item) { return item === _this; });
                if (index + 1 >= parent_1.children.length) {
                    return null;
                }
                return parent_1.children[index + 1];
            }
            return null;
        };
        /**
         * 获取上一个子UI元素
         * @TODO 待测试
         */
        WebView.prototype.GetPrevChild = function (child) {
            var _this = this;
            if (child && child.GetParent() === this) {
                var parent_2 = child.GetParent();
                var index = parent_2.children.findIndex(function (item) { return item === _this; });
                if (index - 1 < 0) {
                    return null;
                }
                return parent_2.children[index - 1];
            }
            return null;
        };
        /**
         * 通过id索引获取子UI元素，逐层遍历
         * @param id 遍历获取子UI元素的id，不限于当前层级
         */
        WebView.prototype.GetUIObject = function (id) {
            var e_2, _a;
            if (!id) {
                return null;
            }
            try {
                for (var _b = __values$1(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    if (child.GetID() === id) {
                        return child;
                    }
                    if (child.IsType(NodeTypeEnum.VIEW)) {
                        var pChild = WebView.AsWebView(child).GetUIObject(id);
                        if (pChild) {
                            return pChild;
                        }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return null;
        };
        /**
         * 获取绑定的控制器
         */
        WebView.prototype.GetController = function () {
            throw new Error('Method not implemented.');
        };
        /**
         * 获取模版
         * @param template 模板索引
         */
        WebView.prototype.GetTemplate = function (template) {
            logger$s.debug(template);
            throw new Error('Method not implemented.');
        };
        /**
         * 新增Texture子节点
         */
        WebView.prototype.AddTexture = function (texture) {
            this.textureList = Array.isArray(this.textureList) ? this.textureList : [];
            if (texture) {
                texture.SetOwner(this);
                this.textureList.push(texture);
                if (texture.IsOpaque()) {
                    this.opaque = true;
                }
                this.Update();
                return true;
            }
            return false;
        };
        /**
         * 更新Texture
         */
        WebView.prototype.UpdateTexture = function (texture) {
            logger$s.debug('UpdateTexture:', texture);
            this.Update();
        };
        /**
         * 获取贴图
         * @param textureName 贴图名称
         */
        WebView.prototype.GetTexture = function (textureName) {
            var e_3, _a;
            var textureList = this.textureList;
            if (!textureList || textureList.length === 0) {
                return null;
            }
            if (!textureName) {
                return null;
            }
            try {
                for (var textureList_1 = __values$1(textureList), textureList_1_1 = textureList_1.next(); !textureList_1_1.done; textureList_1_1 = textureList_1.next()) {
                    var texture = textureList_1_1.value;
                    if (textureName === texture.GetID()) {
                        return texture;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (textureList_1_1 && !textureList_1_1.done && (_a = textureList_1.return)) _a.call(textureList_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return null;
        };
        /**
         * 删除Texture
         */
        WebView.prototype.DeleteTexture = function (textureName) {
            var textureList = this.textureList;
            if (!textureList || textureList.length === 0) {
                return false;
            }
            if (!textureName) {
                return false;
            }
            for (var index = 0; index < textureList.length; index++) {
                var texture = textureList[index];
                if (textureName === texture.GetID()) {
                    texture.SetOwner(null);
                    textureList.splice(index, 1);
                    this.Update();
                    return true;
                }
            }
            return false;
        };
        /**
         * 判断传入坐标是否在视图范围内
         * @param x 命中测试坐标的水平坐标
         * @param y 命中测试坐标的垂直坐标
         */
        WebView.prototype.HitTest = function (x, y) {
            if (this.isFloating) {
                return false;
            }
            return _super.prototype.HitTest.call(this, x, y);
        };
        /**
         * 锁定布局.
         * @description 一种性能优化的手段.当进行批量更新的时候可以先锁定.操作完成后执行一次布局即可
         * 目前已知的点是:
         * 1、ClearChildren(); 清空子节点的时候可以最后再更新布局
         * 2、Serializer 元素序列化的时候可以最后再更新布局.
         */
        WebView.prototype.LockLayout = function () {
            logger$s.debug('lockLayout:', this);
            if (this.lockLayout >= 1) {
                return false;
            }
            this.lockLayout++;
            return true;
        };
        /**
         * 解锁布局
         * @description 一种性能优化的手段.当进行批量更新的时候可以先锁定.操作完成后执行一次布局即可
         * 解除锁定的时候判断是否期间有进行过更新操作.如果有则最后执行一次布局
         */
        WebView.prototype.UnlockLayout = function (update) {
            logger$s.debug('UnlockLayout:', this);
            if (this.lockLayout) {
                this.lockLayout--;
                if (!this.lockLayout) {
                    var bLayout = isUndefined$1(update) ? true : update;
                    if (bLayout) {
                        this.DoLayout();
                    }
                }
                return true;
            }
            return false;
        };
        /**
         * 判断当前布局是否已经锁定
         * @description
         * 1、SetStyle(); 当设置样式的时候会判断是否锁定
         * 2、DoCSSLayout(); 重新布局的时候会判断是否锁定
         * 3、UpdateRect(); 区域更新的时候会有判定
         */
        WebView.prototype.IsLockLayout = function () {
            return Boolean(this.lockLayout);
        };
        /**
         * 获取是否具有层属性
         */
        WebView.prototype.GetLayered = function () {
            throw new Error('Method not implemented.');
        };
        /**
         * 设置是否具有层属性
         */
        WebView.prototype.SetLayered = function (layered) {
            logger$s.debug(layered);
            throw new Error('Method not implemented.');
        };
        /**
         * 更新节点
         * @TODO 待测试
         */
        WebView.prototype.Update = function () {
            _super.prototype.Update.call(this);
            this.UpdateFloating();
        };
        /**
         * 初始化Floating视图元素
         */
        WebView.prototype.CreateFloating = function () {
            var e_4, _a;
            try {
                for (var _b = __values$1(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    if (child.IsType(NodeTypeEnum.VIEW)) {
                        var pView = child.AsWebView();
                        // 如果是悬浮视图
                        if (pView.GetFloating()) {
                            this.floatingViewList.push(pView);
                        }
                        // 收集子节点的floatingViewList.一次性绘制
                        if (Array.isArray(pView.floatingViewList) && pView.floatingViewList) {
                            this.floatingViewList = this.floatingViewList.concat(pView.floatingViewList);
                            pView.floatingViewList = [];
                        }
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        /**
         * 清理floating
         */
        WebView.prototype.ClearFloating = function () {
            this.floatingViewList = [];
        };
        /**
         * 设置为根节点
         * @param isRoot
         */
        WebView.prototype.SetRoot = function (isRoot) {
            this.isRoot = isRoot;
        };
        /**
         * 判断是否为根节点
         * @returns
         */
        WebView.prototype.IsRoot = function () {
            return this.isRoot;
        };
        /**
         * 设定布局方式
         * @param layout
         */
        WebView.prototype.SetLayout = function (layout) {
            this.layout = layout;
        };
        /**
         * 获取布局方式
         * @returns
         */
        WebView.prototype.GetLayout = function () {
            return this.layout;
        };
        /**
         * 布局当前节点
         * @returns
         */
        WebView.prototype.DoLayout = function () {
            if (this.lockLayout || !this.layout) {
                return;
            }
            this.LockUpdate();
            this.layout.DoLayout(this);
            this.UnlockUpdate();
        };
        /**
         * 更新子节点的大小
         * @param child 需要更新的子节点
         * @param oldSize 之前的大小
         * @param newSize 现在的大小
         * @returns
         * @TODO 这个方法放这里还需要怀疑一下 待测试.而且这个地方没看懂. 而且是不是可以不用childResize.感觉交给了父元素处理.
         *       应该就Resize就好了
         */
        WebView.prototype.ChildResize = function (child, oldSize, newSize) {
            if (!this.IsType(NodeTypeEnum.VIEW)) {
                return;
            }
            var point = child.GetPos();
            // 根据位置信息获取旧的区域信息
            var oldRect = new ARKRect(point, ARKPoint.AddSize(point, oldSize));
            // 根据位置信息获取新的区域信息
            var newRect = new ARKRect(point, ARKPoint.AddSize(point, newSize));
            // 取并集
            var rc = ARKRect.UnionRect(oldRect, newRect);
            // 减去父节点的relative position
            rc.SubtractPoint(this.GetRelativePos());
            // 获取父元素的大小
            var size = this.GetSize();
            // 这里left.top为0.其实最好的写法是获取父元素的left和top.但是这里这样写也可以.因为后面会取两者的交集.也就是0一定是小于rc的left值的.所以会取rc.left,top同理
            var rcView = new ARKRect(0, 0, size.GetWidth(), size.GetHeight());
            // 取交集.因为在Ark消息中所有的节点超出父节点之后都需要隐藏
            rc.IntersectRect(rc, rcView);
            // 继续更新父节点的区域
            this.DoChange(rc);
        };
        /**
         * 更新子节点区域
         * @TODO 待测试
         * @description 这个方式可以是不是可以不写成 ChildChange,因为是修改当前节点的rect.待确定
         */
        WebView.prototype.ChildChange = function (child, rect) {
            if (!this.IsType(NodeTypeEnum.VIEW)) {
                return;
            }
            var point = child.GetPos();
            // 根据当前元素的位置更新rect的位置
            rect.AddPoint(point);
            // 但是同时需要减去父节点的relative position(?)
            rect.SubtractPoint(this.relativePos);
            var rcView = new ARKRect(0, 0, this.size.GetWidth(), this.size.GetHeight());
            // 取交集, 因为在Ark消息中所有的节点超出父节点之后都需要隐藏
            rect.IntersectRect(rect, rcView);
            // 继续更新父节点的区域信息
            this.DoChange(rect);
        };
        /**
         * 移动元素
         * @returns
         */
        WebView.prototype.ChildMove = function (child, oldPos, pos) {
            if (!this.IsType(NodeTypeEnum.VIEW)) {
                return;
            }
            logger$s.debug('ChildMove:', child, oldPos, pos);
            var size = child.GetSize();
            var sourceRect = new ARKRect(oldPos, ARKPoint.AddSize(oldPos, size));
            var destRect = new ARKRect(pos, ARKPoint.AddSize(pos, size));
            var rect = ARKRect.UnionRect(sourceRect, destRect);
            // 但是同时需要减去父节点的relative position(?)
            rect.SubtractPoint(this.relativePos);
            var rcView = new ARKRect(0, 0, this.size.GetWidth(), this.size.GetHeight());
            // 取交集, 因为在Ark消息中所有的节点超出父节点之后都需要隐藏
            rect.IntersectRect(rect, rcView);
            this.DoChange(rect);
        };
        /**
         * 更新位置
         * @override
         */
        WebView.prototype.RelativePosChange = function () {
            var e_5, _a;
            try {
                for (var _b = __values$1(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    child.RelativePosChange();
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_5) throw e_5.error; }
            }
        };
        /**
         * @TODO 待测试
         */
        WebView.prototype.IsOpaque = function () {
            return this.opaque;
        };
        /**
         * 设置metadata
         * @param metadata
         * @description 只能有一个key值
         */
        WebView.prototype.SetMetadata = function (metadata) {
            var _this = this;
            if (!metadata) {
                return;
            }
            if (!isObjectLike(metadata)) {
                return;
            }
            logger$s.debug('SetMetadata:', metadata, this.GetApp());
            var keys = Object.keys(metadata);
            if (keys.length !== 1) {
                return;
            }
            // 只有当 key 值等于当前 metadataType时候才需要设置
            if (this.metadataType !== keys[0]) {
                return;
            }
            _super.prototype.SetValue.call(this, metadata);
            // 继续处理二级属性
            var secondMetadata = metadata[keys[0]];
            if (!isObjectLike(secondMetadata)) {
                return;
            }
            Object.keys(secondMetadata).forEach(function (property) {
                var value = secondMetadata[property];
                var pObj = _this.GetUIObjectByMetadataType(property);
                if (pObj) {
                    pObj.SetValue(value);
                }
            });
        };
        /**
         * 获取DeleteChild值
         * @TODO 参数和返回值待补充
         */
        WebView.prototype.GetMetadata = function () {
            throw new Error('Method not implemented.');
        };
        /**
         * SetCSSNodeSize
         * @description 设置CSS节点大小.容器初始化的时候会调用
         */
        WebView.prototype.SetCSSNodeSize = function (width, height) {
            if (!this.IsRoot() || !this.IsCSSMode()) {
                return;
            }
            var styles = [];
            var size = this.size;
            if (isNumber(width) && !isNaN(width)) {
                if (size.GetWidth() !== width) {
                    styles.push("width: ".concat(width, "px"));
                }
            }
            if (isNumber(height) && !isNaN(height)) {
                if (size.GetHeight() !== height) {
                    styles.push("height: ".concat(height, "px"));
                }
            }
            var cssLayoutNode = this.GetCSSLayoutNode();
            if (styles.length) {
                cssLayoutNode.SetStyle(styles.join(';'));
                this.DoCSSLayout();
            }
        };
        /**
         * 获取当前点击时命中的元素
         * @description 获取点击的视图,这里的位置是相对于当前元素的左上角而言的
         */
        WebView.prototype.DoHitTest = function (offsetX, offsetY) {
            var pObj = this.ChildHitTest(offsetX, offsetY);
            if (pObj === null || pObj === void 0 ? void 0 : pObj.IsType(NodeTypeEnum.VIEW)) {
                var pView = pObj;
                // 获取相对当前节点的位置
                var ptChild = this.GetChildPos(new ARKPoint(offsetX, offsetY), pView);
                // 递归继续找子节点
                pObj = pView.DoHitTest(ptChild.getX(), ptChild.getY());
            }
            else {
                pObj = this;
            }
            return pObj;
        };
        /**
         * 获取点击的是哪个子元素
         * @param offsetX
         * @param offsetY
         */
        WebView.prototype.ChildHitTest = function (offsetX, offsetY) {
            var e_6, _a;
            var _b;
            var point = new ARKPoint(offsetX, offsetY);
            if (((_b = this.floatingViewList) === null || _b === void 0 ? void 0 : _b.length) && this.IsRoot()) {
                try {
                    for (var _c = __values$1(this.floatingViewList), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var pView = _d.value;
                        if (pView.CheckVisible()) {
                            var rootRect = pView.GetRootRect();
                            if (rootRect.PtInRect(point)) {
                                return pView;
                            }
                        }
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
            }
            // @TODO 暂时不处理 input 输入框
            var children = this.children;
            for (var index = children.length - 1; index >= 0; index--) {
                var child = children[index];
                if (child.IsType(NodeTypeEnum.VIEW)) {
                    var pView = child;
                    // 如果是 floating 元素.上面已经处理了
                    if (pView.GetFloating()) {
                        continue;
                    }
                }
                var ptRelativePos = ARKPoint.Add(point, this.relativePos);
                if (child.HitTest(ptRelativePos.getX(), ptRelativePos.getY())) {
                    return child;
                }
            }
            return null;
        };
        /**
         * 释放资源
         */
        WebView.prototype.Release = function () {
            _super.prototype.Release.call(this);
            if (Array.isArray(this.textureList)) {
                this.textureList.forEach(function (texture) {
                    texture.Release();
                });
                this.textureList = [];
                this.floatingViewList = [];
            }
        };
        /**
         * 渲染节点
         * @param context OffscreenCanvasRenderingContext2D
         * @param renderRect 渲染区域
         */
        WebView.prototype.DoRenderTo = function (context, renderRect) {
            if (!this.isVisible) {
                return false;
            }
            this.RenderBackground(context, renderRect);
            this.RenderContent(context, renderRect);
            this.RenderFloating(context, renderRect);
        };
        /**
         * 更新大小
         * @param oldSize
         * @param newSize
         * @description 重写父类的Resize方法. 这个方法并不会暴露出去
         * 当view的大小被更新之后.需要重新更新子元素的布局
         */
        WebView.prototype.Resize = function (oldSize, newSize) {
            this.LockUpdate();
            // 当元素的大小发生改变的时候.子元素需要重新布局.而父元素的布局更新则在DoCSSLayout->UpdateRect
            this.DoLayout();
            this.UnlockUpdate();
            if (this.isFloating) {
                this.NotifyRootResize(oldSize, newSize);
            }
            else {
                this.NotifyParentResize(oldSize, newSize);
            }
        };
        /**
         * 当元素的位置发生更新的时候
         * @param sourcePoint
         * @param destPoint
         * @description 需要更新子元素的相对位置
         */
        WebView.prototype.Move = function (sourcePoint, destPoint) {
            var e_7, _a;
            if (this.isFloating) {
                this.NotifyRootMove(sourcePoint, destPoint);
            }
            else {
                this.NotifyParentMove(sourcePoint, destPoint);
            }
            var floatingRect = new ARKRect();
            if (this.GetFloatingRect(floatingRect)) {
                var sourceRect = ARKRect.AddPoint(floatingRect, ARKPoint.Subtract(sourcePoint, destPoint));
                var rect = new ARKRect();
                rect.UnionRect(sourceRect, floatingRect);
                var rootView = this.GetRoot();
                if (rootView) {
                    rootView.DoChange(rect);
                }
            }
            try {
                for (var _b = __values$1(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    child.RelativePosChange();
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_7) throw e_7.error; }
            }
        };
        /**
         * 当元素区域发生更新时的处理
         * @param rect
         */
        WebView.prototype.Change = function (rect) {
            // 暂时不处理脏区域
            // if ((m_alpha != 0xff || m_bLayered) && m_bRefreshCache) {
            //   m_rcUpdate.UnionRect(m_rcUpdate, rect);
            // }
            if (this.isFloating) {
                this.NotifyRootChange(rect);
            }
            else {
                this.NotifyParentChanged(rect);
            }
        };
        /**
         * 重写父类的方法
         * @override
         * @description 与 Native 不一样的是: 这里采用的是事件冒泡. 但是这里不支持阻止事件冒泡
         */
        WebView.prototype.Click = function (x, y, button, keyState) {
            var parent = this.GetParent();
            if (parent) {
                parent.DoClick(x, y, button, keyState);
            }
        };
        /**
         * 重写父类的方法
         * @override
         * @description 与 Native 不一样的是: 这里采用的是事件冒泡. 但是这里不支持阻止事件冒泡
         */
        WebView.prototype.MouseDown = function (x, y, button, keyState) {
            var parent = this.GetParent();
            if (parent) {
                parent.DoMouseDown(x, y, button, keyState);
            }
        };
        /**
         * 获取当前的 point 在当前元素的位置
         * @param point 相对父节点的的点击位置
         * @param pObj
         * @returns
         */
        WebView.prototype.GetChildPos = function (point, pObj) {
            // 加上相对位置. 如果有设置相对父节点的偏移位置的话
            var ptRelative = ARKPoint.Add(point, this.relativePos);
            // 如果是视图.则判断是否为 floating 悬浮元素
            if (pObj.IsType(NodeTypeEnum.VIEW)) {
                var pView = pObj;
                if (pView.GetFloating()) {
                    var rcRoot = pView.GetRootRect();
                    return ARKPoint.Subtract(ptRelative, rcRoot.TopLeft());
                }
            }
            // 最后减去当前元素的位置即可。(简单理解吧: 当relativePos为(0,0)时，那么此时在当前元素中的就是就是 point - ptObj )
            var position = pObj.GetPos();
            return ARKPoint.Subtract(ptRelative, position);
        };
        /**
         * 渲染背景
         * @param context
         * @param renderRect
         */
        WebView.prototype.RenderBackground = function (context, renderRect) {
            var _this = this;
            if (!Array.isArray(this.textureList)) {
                return;
            }
            if (this.textureList.length === 0) {
                return;
            }
            this.textureList.forEach(function (texture) {
                if (texture.GetVisible()) {
                    var textureRect = new ARKRect(0, 0, _this.size.GetWidth(), _this.size.GetHeight());
                    // 超出的部分要隐藏.所以这里取下交集
                    var rect = ARKRect.IntersectRect(textureRect, renderRect);
                    if (rect.IsNotEmpty()) {
                        texture.RenderTo(context, rect, textureRect);
                    }
                }
            });
        };
        /**
         * 渲染View
         * @param context
         * @param renderRect 渲染区域
         */
        WebView.prototype.RenderContent = function (context, renderRect) {
            var e_8, _a;
            this.drawCanvas(context, renderRect);
            try {
                for (var _b = __values$1(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    var rect = child.GetRect();
                    rect.SubtractPoint(this.relativePos);
                    var clipRect = ARKRect.IntersectRect(renderRect, rect);
                    if (child.GetVisible() && child.GetAlpha() && clipRect.IsNotEmpty()) {
                        var pView = WebView.AsWebView(child);
                        // 如果是悬浮浮窗.在这里忽略.单独处理.类似层级上下文
                        if (pView === null || pView === void 0 ? void 0 : pView.GetFloating()) {
                            continue;
                        }
                        var offsetX = rect.getLeft();
                        var offsetY = rect.getTop();
                        context.save();
                        context.translate(offsetX, offsetY);
                        clipRect.OffsetRect(-offsetX, -offsetY);
                        child.RenderTo(context, clipRect);
                        context.restore();
                    }
                    else if (clipRect.IsEmpty()) {
                        // logger.error('DoRenderTo clipRect.isEmpty', rect, child.GetID());
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_8) throw e_8.error; }
            }
        };
        /**
         * 绘制View.
         * @param context
         * @TODO 这里其实不用绘制.但是为了方便调试.所以这里绘制一次
         */
        WebView.prototype.drawCanvas = function (context, renderRect) {
            var applicationContext = WebApplicationApi.getContext();
            if (applicationContext.isDebug()) {
                context.save();
                context.beginPath();
                context.rect(0, 0, renderRect.Width(), renderRect.Height());
                var backgroundColor = '';
                var cssLayoutNode = this.GetCSSLayoutNode();
                if (cssLayoutNode) {
                    backgroundColor = this.GetStyle(ARKCssPropertiesEnum.BACKGROUND_COLOR);
                }
                else {
                    backgroundColor = this.textureList.length ? argbToColor(this.textureList[0].GetColor()) : '';
                }
                if (backgroundColor) {
                    context.fillStyle = backgroundColor;
                }
                else {
                    context.fillStyle = 'transparent';
                }
                context.fill();
                context.stroke();
                context.restore();
            }
        };
        /**
         * 单独渲染Floating的View
         * @description 非CSSLayout会执行
         */
        WebView.prototype.RenderFloating = function (context, renderRect) {
            if (Array.isArray(this.floatingViewList) && this.floatingViewList.length) {
                this.floatingViewList.forEach(function (child) {
                    if (!child.CheckVisible()) {
                        return;
                    }
                    var rcView = child.GetRootRect();
                    var clipRect = ARKRect.IntersectRect(renderRect, rcView);
                    if (clipRect.IsNotEmpty()) {
                        context.save();
                        context.translate(rcView.getLeft(), rcView.getTop());
                        clipRect.OffsetRect(-rcView.getLeft(), -rcView.getTop());
                        child.RenderTo(context, clipRect);
                        context.restore();
                    }
                });
            }
        };
        /**
         * 更新Floating
         * @TODO 暂时不支持这个方法的作用
         */
        WebView.prototype.UpdateFloating = function () {
            var e_9, _a;
            var rootView = this.GetRoot();
            if (!rootView) {
                return;
            }
            try {
                for (var _b = __values$1(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    var pView = WebView.AsWebView(child);
                    if (pView) {
                        if (pView.GetFloating()) {
                            var rootRect = pView.GetRootRect();
                            rootView.DoChange(rootRect);
                        }
                        pView.UpdateFloating();
                    }
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_9) throw e_9.error; }
            }
        };
        /**
         * 通知根节点更新区域
         * @TODO 待测试
         */
        WebView.prototype.NotifyRootChange = function (rect) {
            var rootView = this.GetRoot();
            if (rootView && rootView !== this) {
                rootView.FloatingChildChange(this, rect);
            }
        };
        /**
         * 通知根节点移动
         * @TODO 待测试
         */
        WebView.prototype.NotifyRootMove = function (sourcePoint, destPoint) {
            var rootView = this.GetRoot();
            if (rootView) {
                rootView.FloatingChildMove(this, sourcePoint, destPoint);
            }
        };
        /**
         * 通知根节点更新大小
         * @TODO 待测试
         */
        WebView.prototype.NotifyRootResize = function (oldSize, newSize) {
            var rootView = this.GetRoot();
            if (rootView) {
                rootView.FloatingChildResize(this, oldSize, newSize);
            }
        };
        /**
         * 待测试
         */
        WebView.prototype.FloatingChildChange = function (child, rect) {
            var rootRect = child.GetRootRect();
            var rc = rect.Copy();
            rc.AddPoint(rootRect.TopLeft());
            var rcView = new ARKRect(0, 0, this.size.GetWidth(), this.size.GetHeight());
            rc.IntersectRect(rc, rcView);
            this.DoChange(rc);
        };
        /**
         * 待测试
         */
        WebView.prototype.FloatingChildMove = function (child, oldPoint, newPoint) {
            logger$s.debug('FloatingChildMove', child, oldPoint, newPoint);
        };
        /**
         * 待测试
         */
        WebView.prototype.FloatingChildResize = function (child, oldSize, newSize) {
            logger$s.debug('FloatingChildResize', child, oldSize, newSize);
        };
        /**
         * 待测试
         */
        WebView.prototype.RebuildFloating = function () {
            logger$s.debug('RebuildFloating');
        };
        /**
         * @TODO 待测试
         */
        WebView.prototype.GetFloatingRect = function (rect) {
            var e_10, _a;
            var bFloating = false;
            try {
                for (var _b = __values$1(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    var pView = WebView.AsWebView(child);
                    if (pView === null || pView === void 0 ? void 0 : pView.GetFloating()) {
                        bFloating = true;
                        if (pView.GetVisible()) {
                            var rootRect = pView.GetRootRect();
                            rect.UnionRect(rect, rootRect);
                        }
                        var rootChildRect = new ARKRect();
                        if (pView.GetFloatingRect(rootChildRect)) {
                            bFloating = true;
                            rect.UnionRect(rect, rootChildRect);
                        }
                    }
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_10) throw e_10.error; }
            }
            return bFloating;
        };
        /**
         * 通过metadataType 获取 UIObject
         * @param metadataType
         */
        WebView.prototype.GetUIObjectByMetadataType = function (metadataType) {
            var e_11, _a;
            if (!metadataType || typeof metadataType !== 'string') {
                return null;
            }
            try {
                for (var _b = __values$1(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    if (child.metadataType === metadataType) {
                        return child;
                    }
                    if (child.IsType(NodeTypeEnum.VIEW)) {
                        var pChild = child.GetUIObjectByMetadataType(metadataType);
                        if (pChild) {
                            return pChild;
                        }
                    }
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_11) throw e_11.error; }
            }
            return null;
        };
        WebView.tagName = 'VIEW';
        return WebView;
    }(WebUIObject));

    /**
     * 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     */
    var WebHttp = /** @class */ (function (_super) {
        __extends$1(WebHttp, _super);
        function WebHttp() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WebHttp.prototype.GetApplicationContext = function () {
            return WebApplicationApi.getContext();
        };
        return WebHttp;
    }(BaseHttp));

    /**
     * @fileoverview 图片资源加载
     * @author alawnxu
     * @date 2022-07-18 20:20:41
     * @version 1.0.0
     */
    var logger$r = Logger.getLogger('ImageLoader');
    var ImageLoader = /** @class */ (function () {
        function ImageLoader(url, applicationId) {
            this.url = url;
            this.loaded = false;
            this.applicationId = applicationId;
        }
        /**
         * 加载图片资源
         */
        ImageLoader.prototype.load = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var _this = this;
                return __generator$1(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var _a = _this, url = _a.url, applicationId = _a.applicationId;
                            var toBitmap = function (objectUrl) { return __awaiter$1(_this, void 0, void 0, function () {
                                var blob, bitmap, e_1;
                                return __generator$1(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 3, , 4]);
                                            return [4 /*yield*/, ImageUtil.objectUrlToBlob(objectUrl)];
                                        case 1:
                                            blob = _a.sent();
                                            return [4 /*yield*/, createImageBitmap(blob)];
                                        case 2:
                                            bitmap = _a.sent();
                                            this.loaded = true;
                                            this.bitmap = bitmap;
                                            resolve();
                                            return [3 /*break*/, 4];
                                        case 3:
                                            e_1 = _a.sent();
                                            logger$r.error(e_1);
                                            reject(e_1);
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); };
                            if (url.startsWith('blob:')) {
                                logger$r.debug('hit image cache. url:', url);
                                toBitmap(url);
                                return;
                            }
                            var application = ApplicationManager.GetApplication(applicationId);
                            var app = application.GetApp();
                            var httpGet = new WebHttp(app);
                            httpGet.AttachEvent(HttpEventEnum.ON_COMPLETE, function (http) {
                                if (http.IsSuccess()) {
                                    var cachePath = http.GetCachePath();
                                    toBitmap(cachePath);
                                }
                                else {
                                    reject(new Error('IMAGE_DOWNLOAD_ERROR'));
                                }
                                httpGet.DetachEvent(HttpEventEnum.ON_COMPLETE);
                            });
                            httpGet.Get(url);
                        })];
                });
            });
        };
        /**
         * 是否加载完成
         */
        ImageLoader.prototype.IsLoaded = function () {
            return this.loaded;
        };
        /**
         * 获取图片数据
         */
        ImageLoader.prototype.GetBitmap = function () {
            return this.bitmap;
        };
        /**
         * 释放资源
         */
        ImageLoader.prototype.Release = function () {
            if (this.bitmap) {
                this.bitmap.close();
            }
        };
        return ImageLoader;
    }());

    var logger$q = Logger.getLogger('WebTexture');
    var WebTexture = /** @class */ (function (_super) {
        __extends$1(WebTexture, _super);
        function WebTexture(applicationId) {
            var _this = _super.call(this) || this;
            _this.owner = null;
            _this.applicationId = applicationId;
            _this.value = '';
            _this.color = '';
            _this.visible = true;
            _this.loader = null;
            return _this;
        }
        WebTexture.prototype.GetNodeType = function () {
            return NodeTypeEnum.TEXTURE;
        };
        /**
         * 设置初始值
         * @description 初始的方法不会更新布局
         */
        WebTexture.prototype.InitValue = function (value) {
            this.value = value;
        };
        WebTexture.prototype.InitVisible = function (visible) {
            this.visible = visible;
        };
        WebTexture.prototype.InitColor = function (color) {
            this.color = color;
        };
        /**
         * 绘制Texture
         */
        WebTexture.prototype.RenderTo = function (context, renderRect, textureRect) {
            if (this.color) {
                context.save();
                context.beginPath();
                context.rect(renderRect.getLeft(), renderRect.getTop(), renderRect.Width(), renderRect.Height());
                context.closePath();
                context.clip();
                context.fillStyle = argbToColor(this.color);
                context.strokeStyle = 'transparent';
                context.fill();
                context.stroke();
                context.restore();
                return;
            }
            if (this.bitmap) {
                context.save();
                context.beginPath();
                context.rect(renderRect.getLeft(), renderRect.getTop(), renderRect.Width(), renderRect.Height());
                context.closePath();
                context.clip();
                context.drawImage(this.bitmap, 0, 0, textureRect.Width(), textureRect.Height());
                context.restore();
            }
        };
        WebTexture.prototype.SetOwner = function (owner) {
            var _a;
            this.owner = owner;
            if (this.owner) {
                if ((_a = this.value) === null || _a === void 0 ? void 0 : _a.trim()) {
                    this.Load(false);
                }
            }
        };
        WebTexture.prototype.GetApp = function () {
            var application = ApplicationManager.GetApplication(this.applicationId);
            return application.GetApp();
        };
        /**
         * 设置Texture
         * @param value
         */
        WebTexture.prototype.SetValue = function (value) {
            var e_1, _a;
            // 兼容下有些 Ark 用 SetValue 来设置颜色的BUG. 不知道怎么通过测试的
            // com.tencent.guild.robot.share
            if (typeof value === 'number') {
                this.color = value;
                return;
            }
            var app = this.GetApp();
            var images = AppUtil.GetImages(app);
            var imageSrc = value;
            try {
                for (var images_1 = __values$1(images), images_1_1 = images_1.next(); !images_1_1.done; images_1_1 = images_1.next()) {
                    var image = images_1_1.value;
                    if (image.name === value) {
                        imageSrc = image.url;
                        break;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (images_1_1 && !images_1_1.done && (_a = images_1.return)) _a.call(images_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (!imageSrc) {
                // destroy
                return;
            }
            if (imageSrc) {
                if (this.value !== imageSrc) {
                    this.DestroyLoader();
                    this.value = imageSrc;
                    this.Load(false);
                }
                return;
            }
            if (this.value !== imageSrc) {
                this.Destroy();
                this.value = '';
                this.Update();
            }
        };
        WebTexture.prototype.GetValue = function () {
            return this.value;
        };
        /**
         * 设置背景颜色
         * @param color
         */
        WebTexture.prototype.SetColor = function (color) {
            this.Destroy();
            this.color = color;
            this.Update();
        };
        /**
         * 获取背景色
         */
        WebTexture.prototype.GetColor = function () {
            return this.color;
        };
        /**
         * 释放资源
         */
        WebTexture.prototype.Release = function () {
            _super.prototype.Release.call(this);
            this.DestroyLoader();
        };
        /**
         * 设置显示或隐藏
         */
        WebTexture.prototype.SetVisible = function (visible) {
            if (this.visible !== visible) {
                this.visible = visible;
                this.Update();
            }
        };
        /**
         * 判断是否显示
         * @returns
         */
        WebTexture.prototype.GetVisible = function () {
            return this.visible;
        };
        WebTexture.prototype.IsOpaque = function () {
            return false;
        };
        /**
         * 加载图片资源
         * @param update
         */
        WebTexture.prototype.Load = function (bUpdate) {
            return __awaiter$1(this, void 0, void 0, function () {
                var e_2;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.CheckLoader();
                            if (this.owner) {
                                this.owner.LockUpdate();
                            }
                            if (!this.loader) return [3 /*break*/, 4];
                            if (!this.value) return [3 /*break*/, 4];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.loader.load()];
                        case 2:
                            _a.sent();
                            this.OnLoadEvent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_2 = _a.sent();
                            this.OnLoadEvent();
                            logger$q.error('load image fail.', e_2);
                            return [3 /*break*/, 4];
                        case 4:
                            if (this.owner) {
                                this.owner.UnlockUpdate(bUpdate);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        WebTexture.prototype.Destroy = function () {
            // @TODO
        };
        WebTexture.prototype.DestroyLoader = function () {
            if (this.loader) {
                this.loader.Release();
                this.loader = null;
            }
        };
        WebTexture.prototype.Update = function () {
            if (this.owner) {
                this.owner.UpdateTexture(this);
            }
        };
        /**
         * 图片加载事件处理
         */
        WebTexture.prototype.OnLoadEvent = function () {
            this.UpdateImageData();
        };
        /**
         * 更新图片信息
         */
        WebTexture.prototype.UpdateImageData = function () {
            if (this.loader) {
                this.bitmap = this.loader.GetBitmap();
            }
            logger$q.debug('loaded', this.bitmap);
            if (this.bitmap) {
                this.Update();
            }
        };
        /**
         * 生成loader
         */
        WebTexture.prototype.CheckLoader = function () {
            var _a = this, applicationId = _a.applicationId, owner = _a.owner, value = _a.value, loader = _a.loader;
            if (!loader && value && owner) {
                this.loader = new ImageLoader(value, applicationId);
            }
        };
        WebTexture.tagName = 'TEXTURE';
        return WebTexture;
    }(UITexture));

    /**
     * 节点序列化
     * @author alawnxu
     * @date 2022-07-14 21:09:11
     * @version 1.0.0
     */
    var BaseSerializer = /** @class */ (function () {
        function BaseSerializer(application, element) {
            this.application = application;
            this.element = element;
        }
        return BaseSerializer;
    }());

    /**
     * Object序列化
     * @author alawnxu
     * @date 2022-07-14 21:09:11
     * @version 1.0.0
     */
    var ObjectAttributesEnum;
    (function (ObjectAttributesEnum) {
        ObjectAttributesEnum["ID"] = "id";
    })(ObjectAttributesEnum || (ObjectAttributesEnum = {}));
    var ObjectSerializer = /** @class */ (function (_super) {
        __extends$1(ObjectSerializer, _super);
        function ObjectSerializer(application, element, pObject) {
            var _this = _super.call(this, application, element) || this;
            _this.pObject = pObject;
            return _this;
        }
        ObjectSerializer.prototype.read = function () {
            var _a = this, pObject = _a.pObject, element = _a.element;
            var id = element.getAttribute(ObjectAttributesEnum.ID);
            pObject.SetID(id);
        };
        return ObjectSerializer;
    }(BaseSerializer));

    /**
     * 事件标签序列化
     * @author alawnxu
     * @date 2022-07-25 23:51:32
     * @version 1.0.0
     */
    var EventAttributesEnum;
    (function (EventAttributesEnum) {
        EventAttributesEnum["VALUE"] = "value";
        EventAttributesEnum["NAME"] = "name";
    })(EventAttributesEnum || (EventAttributesEnum = {}));
    var EventSerializer = /** @class */ (function (_super) {
        __extends$1(EventSerializer, _super);
        function EventSerializer(application, element, pObject) {
            var _this = _super.call(this, application, element) || this;
            _this.element = element;
            _this.pObject = pObject;
            return _this;
        }
        EventSerializer.prototype.read = function () {
            var _this = this;
            var element = this.element;
            Array.from(element.childNodes).forEach(function (node) {
                if (node.nodeType !== 1) {
                    return;
                }
                var eventName = node.getAttribute(EventAttributesEnum.NAME);
                var callback = node.getAttribute(EventAttributesEnum.VALUE);
                if (typeof callback === 'string' && (callback === null || callback === void 0 ? void 0 : callback.trim())) {
                    _this.pObject.AddEventListener(eventName, callback);
                }
            });
        };
        EventSerializer.tagName = 'EVENT';
        return EventSerializer;
    }(BaseSerializer));

    /**
     * UIObject序列化
     * @author alawnxu
     * @date 2022-07-14 21:09:11
     * @version 1.0.0
     */
    var UIAttributesEnum;
    (function (UIAttributesEnum) {
        UIAttributesEnum["SIZE"] = "size";
        UIAttributesEnum["MARGIN"] = "margin";
        UIAttributesEnum["RADIUS"] = "radius";
        UIAttributesEnum["ANCHORS"] = "anchors";
        UIAttributesEnum["ALPHA"] = "alpha";
        UIAttributesEnum["VISIBLE"] = "visible";
        UIAttributesEnum["ENABLE"] = "enable";
        UIAttributesEnum["METADATATYPE"] = "metadatatype";
        UIAttributesEnum["CLASS_NAME"] = "style";
    })(UIAttributesEnum || (UIAttributesEnum = {}));
    var UIObjectSerializer = /** @class */ (function (_super) {
        __extends$1(UIObjectSerializer, _super);
        function UIObjectSerializer(application, element, pObject) {
            var _this = _super.call(this, application, element) || this;
            _this.pObject = pObject;
            return _this;
        }
        UIObjectSerializer.prototype.read = function () {
            var _a = this, pObject = _a.pObject, element = _a.element, application = _a.application;
            var serializer = new ObjectSerializer(application, element, pObject);
            serializer.read();
            // size
            var sizeValue = element.getAttribute(UIAttributesEnum.SIZE);
            var sizes = formatValueGroup(sizeValue);
            if (sizes.length === 2) {
                pObject.size = new ARKSize(parseInt(sizes[0], 10) || 0, parseInt(sizes[1], 10) || 0);
            }
            // margin
            var marginValue = element.getAttribute(UIAttributesEnum.MARGIN);
            var margin = formatEdge(marginValue);
            if (margin) {
                pObject.margin = new ARKRect(margin.left, margin.top, margin.right, margin.bottom);
            }
            // radius
            var radiusValue = element.getAttribute(UIAttributesEnum.RADIUS);
            var radius = formatEdge(radiusValue);
            if (radius) {
                pObject.SetRadius(radius.left, radius.top, radius.right, radius.bottom);
            }
            // alpha
            var alphaValue = element.getAttribute(UIAttributesEnum.ALPHA);
            if (alphaValue) {
                var alpha = parseInt(alphaValue, 10);
                pObject.alpha = isNaN(alpha) ? DEFAULT_ALPHA : alpha;
            }
            // visible
            var visibleValue = element.getAttribute(UIAttributesEnum.VISIBLE);
            if (visibleValue) {
                pObject.isVisible = !isFalseString(visibleValue);
            }
            // enable
            var enableValue = element.getAttribute(UIAttributesEnum.ENABLE);
            if (enableValue) {
                pObject.enable = !isFalseString(enableValue);
            }
            // anchors
            var anchorsValue = element.getAttribute(UIAttributesEnum.ANCHORS);
            if (anchorsValue) {
                var anchors = parseInt(anchorsValue, 10);
                pObject.anchors = isNaN(anchors) ? DEFAULT_ANCHORS : anchors;
            }
            // metadataType
            var metadataType = element.getAttribute(UIAttributesEnum.METADATATYPE);
            if (metadataType) {
                pObject.metadataType = metadataType;
            }
            // 如果没有className不要设置Style.否则布局会更新为CSSLayout
            var className = element.getAttribute(UIAttributesEnum.CLASS_NAME);
            if (className) {
                pObject.SetStyle(className);
            }
            // 事件处理
            Array.from(element.childNodes).forEach(function (node) {
                if (node.nodeType !== 1) {
                    return;
                }
                if (node.tagName.toUpperCase() === EventSerializer.tagName) {
                    var serial = new EventSerializer(application, node, pObject);
                    serial.read();
                }
            });
        };
        return UIObjectSerializer;
    }(BaseSerializer));

    var Attribute = /** @class */ (function () {
        function Attribute() {
        }
        /**
         * 读取boolean类型的xml属性
         * @description 为null表示参数无效
         */
        Attribute.readBooleanValue = function (value) {
            if (typeof value === 'string' && value) {
                if (value === 'true') {
                    return true;
                }
                if (value === 'false') {
                    return false;
                }
            }
            return null;
        };
        /**
         * 读取 number 类型的 xml 属性
         * @description 为 null 表示参数无效. 这里需要注意的 xmldom getAttribute 如果属性值不存在的时候是返回的空字符串
         */
        Attribute.readNumberValue = function (value) {
            if (typeof value === 'string' && value) {
                var num = Number(value);
                return isNaN(num) ? null : num;
            }
            return null;
        };
        return Attribute;
    }());

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     * @description 自定义拓展方法请以小写开头的驼峰命名.
     */
    /**
     * 图片标签序列化
     * @author alawnxu
     * @date 2022-07-14 21:09:11
     * @version 1.0.0
     */
    var ImageAttributesEnum;
    (function (ImageAttributesEnum) {
        ImageAttributesEnum["VALUE"] = "value";
        ImageAttributesEnum["STRETCH"] = "stretch";
        ImageAttributesEnum["MODE"] = "mode";
        ImageAttributesEnum["AUTOSIZE"] = "autosize";
    })(ImageAttributesEnum || (ImageAttributesEnum = {}));
    var ImageSerializer = /** @class */ (function (_super) {
        __extends$1(ImageSerializer, _super);
        function ImageSerializer(application, element, pObject) {
            var _this = _super.call(this, application, element) || this;
            _this.pObject = pObject;
            return _this;
        }
        ImageSerializer.prototype.read = function () {
            var _a = this, pObject = _a.pObject, element = _a.element, application = _a.application;
            var serializer = new UIObjectSerializer(application, element, pObject);
            serializer.read();
            var value = element.getAttribute('value');
            if (value) {
                // @TODO 后面再优化.这里不应该调用SetValue.因为初次加载不需要更新
                pObject.SetValue(value);
            }
            var stretch = Attribute.readNumberValue(element.getAttribute(ImageAttributesEnum.STRETCH));
            if (stretch !== null) {
                pObject.stretch = stretch;
            }
            var mode = element.getAttribute(ImageAttributesEnum.MODE);
            mode && pObject.SetMode(mode);
            // autosize
            var autoSize = Attribute.readBooleanValue(element.getAttribute(ImageAttributesEnum.AUTOSIZE));
            if (typeof autoSize === 'boolean') {
                pObject.autoSize = autoSize;
            }
            // value
            pObject.LockUpdate();
            pObject.Init();
            pObject.UnlockUpdate();
        };
        return ImageSerializer;
    }(BaseSerializer));

    var logger$p = Logger.getLogger('WebImage');
    var WebImage = /** @class */ (function (_super) {
        __extends$1(WebImage, _super);
        function WebImage(applicationId) {
            var _this = _super.call(this, applicationId) || this;
            /**
             * 非常重要的布局属性.当如果设置了display:flex.此时的 autosize 会自动失效
             */
            _this.autoSize = false;
            _this.stretch = ImageStretchEnum.FILL;
            _this.mode = ImageModeEnum.NULL;
            _this.bitmap = null;
            return _this;
        }
        WebImage.isImage = function (node) {
            return node.tagName === WebImage.tagName;
        };
        WebImage.prototype.GetNodeType = function () {
            return NodeTypeEnum.IMAGE;
        };
        WebImage.prototype.Init = function () {
            if (!this.url) {
                return;
            }
            this.Load();
        };
        /**
         * 这里加载实际上可以不用Init的时候就加载.
         * @TODO 后面再优化吧
         */
        WebImage.prototype.Load = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var loader, e_1;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.CheckLoader();
                            this.LockUpdate();
                            loader = this.loader;
                            if (!loader) return [3 /*break*/, 4];
                            if (!this.url) return [3 /*break*/, 4];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.loader.load()];
                        case 2:
                            _a.sent();
                            this.UnlockUpdate();
                            this.OnLoadEvent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            this.UnlockUpdate();
                            this.OnLoadEvent();
                            logger$p.error('load image fail.', e_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 测量Image渲染区域的大小
         */
        WebImage.prototype.MeasureSize = function () {
            /**
             * 如果有设置有效大小SetSize, 那么直接返回大小
             * @see {@link packages/ark-web/html/apps/com.tencent.gamecenter.sgameweekly/index.html}
             */
            var Yoga = WebApplicationContext.Yoga;
            if (this.size.GetWidth() &&
                this.size.GetHeight() &&
                this.size.GetWidth() !== Yoga.Constants.undefinedValue &&
                this.size.GetHeight() !== Yoga.Constants.undefinedValue) {
                return this.size;
            }
            return this.bitmap ? new ARKSize(this.bitmap.width, this.bitmap.height) : ARKSize.EmptySize;
        };
        /**
         * 重写父类的AutoSize方法
         * @override
         */
        WebImage.prototype.AutoSize = function () {
            var size = this.MeasureSize();
            if (size.IsNotEmpty()) {
                var oldSize = this.size;
                this.size = size;
                this.DoResize(oldSize, this.size);
                this.UpdateRect();
            }
        };
        /**
         * 设置图片的缩放模式
         * @param stretch 缩放模式（0-2）
         * @TODO 待测试
         */
        WebImage.prototype.SetStretch = function (stretch) {
            if (this.stretch !== stretch) {
                this.stretch = stretch;
                this.Update();
            }
        };
        /**
         * 获取图片缩放模式
         * @returns 缩放模式（0-2）
         */
        WebImage.prototype.GetStretch = function () {
            return this.stretch;
        };
        /**
         * 设置图片的缩放模式
         * @TODO 待测试
         */
        WebImage.prototype.SetMode = function (modeInput) {
            if (typeof modeInput !== 'string') {
                return;
            }
            var modeData = modeInput.split(' ');
            var mode = null;
            if (modeData.length === 1) {
                var _a = __read$1(modeData, 1), value = _a[0];
                if (value === ImageInputModeEnum.FILL) {
                    mode = ImageModeEnum.FILL;
                }
                else if (value === ImageInputModeEnum.ASPECTFIT) {
                    mode = ImageModeEnum.ASPECTFIT;
                }
                else if (value === ImageInputModeEnum.ASPECTFILL) {
                    mode = ImageModeEnum.ASPECTFILL;
                }
                else if (value === ImageInputModeEnum.WIDTHFIX) {
                    mode = ImageModeEnum.WIDTHFIX;
                }
                else if (value === ImageInputModeEnum.TOP) {
                    mode = ImageModeEnum.TOP;
                }
                else if (value === ImageInputModeEnum.BOTTOM) {
                    mode = ImageModeEnum.BOTTOM;
                }
                else if (value === ImageInputModeEnum.CENTER) {
                    mode = ImageModeEnum.CENTER;
                }
                else if (value === ImageInputModeEnum.LEFT) {
                    mode = ImageModeEnum.LEFT;
                }
                else if (value === ImageInputModeEnum.RIGHT) {
                    mode = ImageModeEnum.RIGHT;
                }
            }
            else if (modeData.length === 2) {
                var _b = __read$1(modeData, 2), value0 = _b[0], value1 = _b[1];
                if ((value0 === ImageInputModeEnum.TOP && value1 === ImageInputModeEnum.LEFT) ||
                    (value0 === ImageInputModeEnum.LEFT && value1 === ImageInputModeEnum.TOP)) {
                    mode = ImageModeEnum.TOP_LEFT;
                }
                else if ((value0 === ImageInputModeEnum.TOP && value1 === ImageInputModeEnum.RIGHT) ||
                    (value0 === ImageInputModeEnum.RIGHT && value1 === ImageInputModeEnum.TOP)) {
                    mode = ImageModeEnum.TOP_RIGHT;
                }
                else if ((value0 === ImageInputModeEnum.BOTTOM && value1 === ImageInputModeEnum.LEFT) ||
                    (value0 === ImageInputModeEnum.LEFT && value1 === ImageInputModeEnum.BOTTOM))
                    mode = ImageModeEnum.BOTTOM_LEFT;
                else if ((value0 === ImageInputModeEnum.BOTTOM && value1 === ImageInputModeEnum.RIGHT) ||
                    (value0 === ImageInputModeEnum.RIGHT && value1 === ImageInputModeEnum.BOTTOM))
                    mode = ImageModeEnum.BOTTOM_RIGHT;
            }
            if (mode && this.mode !== mode) {
                this.mode = mode;
                this.Update();
            }
        };
        /**
         * 获取图片的缩放模式
         */
        WebImage.prototype.GetMode = function () {
            return this.mode;
        };
        /**
         * 设置图片内容的路径
         * @TODO 先这样写.其实还会涉及到更新
         */
        WebImage.prototype.SetValue = function (url) {
            var e_2, _a;
            var images = AppUtil.GetImages(this.GetApp());
            var imageSrc = url;
            try {
                for (var images_1 = __values$1(images), images_1_1 = images_1.next(); !images_1_1.done; images_1_1 = images_1.next()) {
                    var image = images_1_1.value;
                    if (image.name === url) {
                        imageSrc = image.url;
                        break;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (images_1_1 && !images_1_1.done && (_a = images_1.return)) _a.call(images_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            if (!imageSrc) {
                // destroy
                return;
            }
            if (this.url !== imageSrc) {
                this.DestroyLoader();
                this.url = imageSrc;
                this.Load();
            }
        };
        /**
         * 获取图片内容的路径
         * @TODO 待完善和待测试
         */
        WebImage.prototype.GetValue = function () {
            return this.url;
        };
        /**
         * 释放资源
         */
        WebImage.prototype.Release = function () {
            _super.prototype.Release.call(this);
            this.DetachEvent(UIObjectEventEnum.ON_ERROR);
            this.DetachEvent(UIObjectEventEnum.ON_LOAD);
            this.DestroyLoader();
        };
        /**
         * 图片渲染
         * @param context
         * @param renderRect
         */
        WebImage.prototype.DoRenderTo = function (context, renderRect) {
            if (!this.bitmap) {
                var applicationContext = WebApplicationApi.getContext();
                if (applicationContext.isDebug()) {
                    if (!this.bitmap) {
                        context.save();
                        context.beginPath();
                        context.rect(0, 0, this.size.GetWidth(), this.size.GetHeight());
                        context.fillStyle = '#000';
                        context.fill();
                        context.stroke();
                        context.closePath();
                        context.restore();
                    }
                }
                return;
            }
            // 实际区域
            var size = new ARKSize(this.bitmap.width, this.bitmap.height);
            if (size.IsEmpty()) {
                return;
            }
            // 目标渲染区域
            var destRect = new ARKRect(0, 0, this.size.GetWidth(), this.size.GetHeight());
            if (this.mode === ImageModeEnum.NULL) {
                this.ApplyStretchMode(destRect, size);
            }
            else {
                this.ApplyMode(destRect, size);
            }
            // 处理 stretch 和 mode
            context.save();
            context.beginPath();
            context.rect(renderRect.getLeft(), renderRect.getTop(), renderRect.Width(), renderRect.Height());
            context.clip();
            context.drawImage(this.bitmap, destRect.getLeft(), destRect.getTop(), destRect.Width(), destRect.Height());
            context.closePath();
            context.restore();
        };
        WebImage.prototype.ApplyStretchMode = function (destRect, imageSize) {
            if (this.stretch === ImageStretchEnum.FILL) {
                return;
            }
            var size = this.size;
            var scaleSize = new ARKSize();
            switch (this.stretch) {
                case ImageStretchEnum.FULL_IMAGE:
                    if (size.IsNotEmpty()) {
                        scaleSize = imageSize.Copy();
                        if (imageSize.GetWidth() / size.GetWidth() > imageSize.GetHeight() / size.GetHeight()) {
                            if (imageSize.GetWidth() > size.GetWidth()) {
                                scaleSize.SetWidth(size.GetWidth());
                                scaleSize.SetHeight(imageSize.GetHeight() * (size.GetWidth() / imageSize.GetWidth()));
                            }
                        }
                        else if (imageSize.GetHeight() > size.GetHeight()) {
                            scaleSize.SetHeight(size.GetHeight());
                            scaleSize.SetWidth(imageSize.GetWidth() * (size.GetHeight() / imageSize.GetHeight()));
                        }
                    }
                    break;
                case ImageStretchEnum.ACTUAL_SIZE:
                    scaleSize = imageSize.Copy();
                    break;
                default:
                    break;
            }
            if (scaleSize.GetWidth() <= size.GetWidth()) {
                destRect.setLeft((size.GetWidth() - scaleSize.GetWidth()) / 2);
            }
            destRect.setRight(destRect.getLeft() + scaleSize.GetWidth());
            if (scaleSize.GetHeight() <= size.GetHeight()) {
                destRect.setTop((size.GetHeight() - scaleSize.GetHeight()) / 2);
            }
            destRect.setBottom(destRect.getTop() + scaleSize.GetHeight());
        };
        WebImage.prototype.ApplyMode = function (destRect, imageSize) {
            if (!imageSize.GetWidth() || !imageSize.GetHeight()) {
                destRect.SetRectEmpty();
                return;
            }
            var size = this.size;
            if (this.mode === ImageModeEnum.FILL) {
                return;
            }
            var bitmapRatio = imageSize.GetWidth() / imageSize.GetHeight();
            var canvasRatio = size.GetWidth() / size.GetHeight();
            var scaleSize = imageSize.Copy();
            switch (this.mode) {
                // image scaled
                // 保持纵横比缩放图片，使图片的长边能完全显示出来，也就是说，可以完整地将图片显示出来
                case ImageModeEnum.ASPECTFIT:
                    if (bitmapRatio > canvasRatio) {
                        scaleSize.SetWidth(size.GetWidth());
                        scaleSize.SetHeight(scaleSize.GetWidth() / bitmapRatio);
                    }
                    else {
                        scaleSize.SetHeight(size.GetHeight());
                        scaleSize.SetWidth(scaleSize.GetHeight() * bitmapRatio);
                    }
                    break;
                case ImageModeEnum.ASPECTFILL:
                    if (bitmapRatio > canvasRatio) {
                        scaleSize.SetHeight(size.GetHeight());
                        scaleSize.SetWidth(scaleSize.GetHeight() * bitmapRatio);
                    }
                    else {
                        scaleSize.SetWidth(size.GetWidth());
                        scaleSize.SetHeight(scaleSize.GetWidth() / bitmapRatio);
                    }
                    break;
                case ImageModeEnum.WIDTHFIX:
                    scaleSize.SetWidth(size.GetWidth());
                    scaleSize.SetHeight(imageSize.GetHeight() * (scaleSize.GetWidth() / imageSize.GetWidth()));
                    break;
                // image not scaled
                case ImageModeEnum.TOP:
                case ImageModeEnum.BOTTOM:
                case ImageModeEnum.CENTER:
                case ImageModeEnum.LEFT:
                case ImageModeEnum.RIGHT:
                case ImageModeEnum.TOP_LEFT:
                case ImageModeEnum.TOP_RIGHT:
                case ImageModeEnum.BOTTOM_LEFT:
                case ImageModeEnum.BOTTOM_RIGHT:
                default:
                    break;
            } // switch (m_stretchMode)
            if (this.mode < ImageModeEnum.TOP || this.mode === ImageModeEnum.CENTER) {
                destRect.setLeft((size.GetWidth() - scaleSize.GetWidth()) / 2);
                destRect.setRight(destRect.getLeft() + scaleSize.GetWidth());
                destRect.setTop((size.GetHeight() - scaleSize.GetHeight()) / 2);
                destRect.setBottom(destRect.getTop() + scaleSize.GetHeight());
            }
            else if (this.mode === ImageModeEnum.TOP) {
                destRect.setLeft((size.GetWidth() - scaleSize.GetWidth()) / 2);
                destRect.setRight(destRect.getLeft() + scaleSize.GetWidth());
                destRect.setTop(0);
                destRect.setBottom(scaleSize.GetHeight());
            }
            else if (this.mode === ImageModeEnum.BOTTOM) {
                destRect.setLeft((size.GetWidth() - scaleSize.GetWidth()) / 2);
                destRect.setRight(destRect.getLeft() + scaleSize.GetWidth());
                destRect.setBottom(size.GetHeight());
                destRect.setTop(destRect.getBottom() - scaleSize.GetHeight());
            }
            else if (this.mode === ImageModeEnum.LEFT) {
                destRect.setTop((size.GetHeight() - scaleSize.GetHeight()) / 2);
                destRect.setBottom(destRect.getTop() + scaleSize.GetHeight());
                destRect.setLeft(0);
                destRect.setRight(scaleSize.GetWidth());
            }
            else if (this.mode === ImageModeEnum.RIGHT) {
                destRect.setTop((size.GetHeight() - scaleSize.GetHeight()) / 2);
                destRect.setBottom(destRect.getTop() + scaleSize.GetHeight());
                destRect.setRight(size.GetWidth());
                destRect.setLeft(destRect.getRight() - scaleSize.GetWidth());
            }
            else if (this.mode === ImageModeEnum.TOP_LEFT) {
                destRect.setLeft(0);
                destRect.setTop(0);
                destRect.setRight(destRect.getLeft() + scaleSize.GetWidth());
                destRect.setBottom(destRect.getTop() + scaleSize.GetHeight());
            }
            else if (this.mode === ImageModeEnum.TOP_RIGHT) {
                destRect.setRight(size.GetWidth());
                destRect.setTop(0);
                destRect.setLeft(destRect.getRight() - scaleSize.GetWidth());
                destRect.setBottom(destRect.getTop() + scaleSize.GetHeight());
            }
            else if (this.mode === ImageModeEnum.BOTTOM_LEFT) {
                destRect.setLeft(0);
                destRect.setBottom(size.GetHeight());
                destRect.setRight(scaleSize.GetWidth());
                destRect.setTop(destRect.getBottom() - scaleSize.GetHeight());
            }
            else if (this.mode === ImageModeEnum.BOTTOM_RIGHT) {
                destRect.setRight(size.GetWidth());
                destRect.setBottom(size.GetHeight());
                destRect.setLeft(destRect.getRight() - scaleSize.GetWidth());
                destRect.setTop(destRect.getBottom() - scaleSize.GetHeight());
            }
        };
        /**
         * 生成loader
         */
        WebImage.prototype.CheckLoader = function () {
            var _a = this, url = _a.url, loader = _a.loader, applicationId = _a.applicationId;
            if (!loader && url) {
                this.loader = new ImageLoader(url, applicationId);
            }
        };
        /**
         * 删除loader
         */
        WebImage.prototype.DestroyLoader = function () {
            if (this.loader) {
                this.loader.Release();
                this.loader = null;
            }
        };
        /**
         * 图片加载事件处理
         */
        WebImage.prototype.OnLoadEvent = function () {
            this.UpdateImageData();
        };
        /**
         * 图片加载失败的处理
         */
        WebImage.prototype.OnErrorEvent = function () {
            this.FireEvent(UIObjectEventEnum.ON_ERROR, this);
        };
        /**
         * 更新图片信息
         */
        WebImage.prototype.UpdateImageData = function () {
            if (!this.loader) {
                return;
            }
            var bitmap = this.loader.GetBitmap();
            this.bitmap = bitmap;
            if (bitmap && this.autoSize) {
                this.AutoSize();
            }
            // 如果不是通过 UI.Image() 创建的元素.还需要更新布局信息
            var view = this.GetRoot();
            if (view) {
                this.Update();
                this.DoCSSCustomUpdate();
            }
            if (bitmap) {
                this.FireEvent(UIObjectEventEnum.ON_LOAD, this);
            }
            else {
                this.FireEvent(UIObjectEventEnum.ON_ERROR, this);
            }
        };
        /**
         * 获取图片信息
         */
        WebImage.prototype.GetBitmap = function () {
            return this.bitmap;
        };
        WebImage.tagName = 'IMAGE';
        return WebImage;
    }(WebUIObject));

    /**
     * @fileoverview FontWeight
     * @author alawnxu
     * @date 2022-06-29 15:19:28
     * @version 1.0.0
     * @see {@link https://www.runoob.com/tags/canvas-font.html }
     */
    /**
     * ark的文本对齐方式
     * @see {@link http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html#align}
     */
    var TextAlignEnum;
    (function (TextAlignEnum) {
        TextAlignEnum["LEFT"] = "left";
        TextAlignEnum["RIGHT"] = "right";
        TextAlignEnum["CENTER"] = "center";
    })(TextAlignEnum || (TextAlignEnum = {}));
    /**
     * 文本对齐方式
     * @enum LEFT 上对齐与左对齐
     * @enum HORIZONTAL_CENTER 水平居中
     * @enum RIGHT 右对齐
     * @enum VERTICAL_CENTER 垂直居中
     * @enum HORIZONTAL_N_VERTICAL_CENTER 水平和垂直居中
     * @enum BOTTOM 下对齐
     */
    var AlignEnum;
    (function (AlignEnum) {
        AlignEnum[AlignEnum["LEFT"] = 0] = "LEFT";
        AlignEnum[AlignEnum["HORIZONTAL_CENTER"] = 1] = "HORIZONTAL_CENTER";
        AlignEnum[AlignEnum["RIGHT"] = 2] = "RIGHT";
        AlignEnum[AlignEnum["VERTICAL_CENTER"] = 4] = "VERTICAL_CENTER";
        AlignEnum[AlignEnum["HORIZONTAL_N_VERTICAL_CENTER"] = 5] = "HORIZONTAL_N_VERTICAL_CENTER";
        AlignEnum[AlignEnum["RIGHT_N_VERTICAL_CENTER"] = 6] = "RIGHT_N_VERTICAL_CENTER";
        AlignEnum[AlignEnum["BOTTOM"] = 8] = "BOTTOM";
        AlignEnum[AlignEnum["BOTTOM_N_HORIZONTAL_CENTER"] = 9] = "BOTTOM_N_HORIZONTAL_CENTER";
        AlignEnum[AlignEnum["BOTTOM_RIGHT"] = 10] = "BOTTOM_RIGHT";
    })(AlignEnum || (AlignEnum = {}));
    var TextAlign = /** @class */ (function () {
        function TextAlign() {
        }
        // @TODO 其它集中需要再考虑下
        TextAlign.parser = function (declaration) {
            var align = parseInt(declaration, 10) || AlignEnum.LEFT;
            switch (align) {
                case AlignEnum.RIGHT:
                    return TextAlignEnum.RIGHT;
                case AlignEnum.HORIZONTAL_CENTER:
                    return TextAlignEnum.CENTER;
                default:
                    return TextAlignEnum.LEFT;
            }
        };
        TextAlign.numToAlignEnum = function (input) {
            switch (input) {
                case 0:
                    return AlignEnum.LEFT;
                case 1:
                    return AlignEnum.HORIZONTAL_CENTER;
                case 2:
                    return AlignEnum.RIGHT;
                case 4:
                    return AlignEnum.VERTICAL_CENTER;
                case 5:
                    return AlignEnum.HORIZONTAL_N_VERTICAL_CENTER;
                case 6:
                    return AlignEnum.RIGHT_N_VERTICAL_CENTER;
                case 8:
                    return AlignEnum.BOTTOM;
                case 9:
                    return AlignEnum.BOTTOM_N_HORIZONTAL_CENTER;
                case 10:
                    return AlignEnum.BOTTOM_RIGHT;
                default:
                    return 0;
            }
        };
        return TextAlign;
    }());

    var StaticTextLine = /** @class */ (function () {
        function StaticTextLine(_a) {
            var text = _a.text, font = _a.font, textAlign = _a.textAlign, rect = _a.rect, lineHeight = _a.lineHeight, width = _a.width;
            this.text = text;
            this.rect = rect;
            this.font = font;
            this.lineHeight = lineHeight;
            this.textAlign = textAlign || AlignEnum.LEFT;
            this.width = width;
        }
        /**
         * 渲染一行文本
         */
        StaticTextLine.prototype.RenderTo = function (context, color) {
            var _a = this, text = _a.text, font = _a.font, textAlign = _a.textAlign, rect = _a.rect, lineHeight = _a.lineHeight, width = _a.width;
            // logger.info('textAlign', textAlign);
            context.save();
            context.font = font.toString();
            context.fillStyle = color || '#000';
            context.textAlign = 'left';
            /**
             * @TODO 这里还得算位置
             */
            switch (textAlign) {
                case AlignEnum.LEFT:
                    context.fillText(text, rect.getLeft(), rect.getTop() + 0.75 * lineHeight);
                    break;
                case AlignEnum.HORIZONTAL_CENTER:
                    context.fillText(text, 0.5 * rect.getLeft() + 0.5 * rect.getRight() - 0.5 * width, rect.getTop() + 0.75 * lineHeight);
                    break;
                case AlignEnum.RIGHT:
                    context.fillText(text, rect.getRight() - width, rect.getTop() + 0.75 * lineHeight);
                    break;
                case AlignEnum.VERTICAL_CENTER:
                    context.fillText(text, rect.getLeft(), 0.5 * rect.getTop() + 0.5 * rect.getBottom() - 0.5 * lineHeight + 0.75 * lineHeight);
                    break;
                case AlignEnum.HORIZONTAL_N_VERTICAL_CENTER:
                    context.fillText(text, 0.5 * rect.getLeft() + 0.5 * rect.getRight() - 0.5 * width, 0.5 * rect.getTop() + 0.5 * rect.getBottom() - 0.5 * lineHeight + 0.75 * lineHeight);
                    break;
                case AlignEnum.RIGHT_N_VERTICAL_CENTER:
                    context.fillText(text, rect.getRight() - width, 0.5 * rect.getTop() + 0.5 * rect.getBottom() - 0.5 * lineHeight + 0.75 * lineHeight);
                    break;
                case AlignEnum.BOTTOM:
                    context.fillText(text, rect.getLeft(), rect.getBottom() - lineHeight + 0.75 * lineHeight);
                    break;
                case AlignEnum.BOTTOM_N_HORIZONTAL_CENTER:
                    context.fillText(text, 0.5 * rect.getLeft() + 0.5 * rect.getRight() - 0.5 * width, rect.getBottom() - lineHeight + 0.75 * lineHeight);
                    break;
                case AlignEnum.BOTTOM_RIGHT:
                    context.fillText(text, rect.getRight() - width, rect.getBottom() - lineHeight + 0.75 * lineHeight);
                    break;
                default:
                    break;
            }
            context.restore();
        };
        return StaticTextLine;
    }());

    /**
     * @fileoverview FontStyle
     * @author alawnxu
     * @date 2022-06-29 15:19:28
     * @version 1.0.0
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-style }
     */
    var FontStyleEnum;
    (function (FontStyleEnum) {
        FontStyleEnum["NORMAL"] = "normal";
        FontStyleEnum["ITALIC"] = "italic";
        FontStyleEnum["OBLIQUE"] = "oblique";
        FontStyleEnum["INHERIT"] = "inherit";
    })(FontStyleEnum || (FontStyleEnum = {}));
    var FontStyle = /** @class */ (function () {
        function FontStyle() {
        }
        FontStyle.prototype.parser = function (declaration) {
            switch (declaration) {
                case 'italic':
                    return FontStyleEnum.ITALIC;
                case 'oblique':
                    return FontStyleEnum.OBLIQUE;
                case 'inherit':
                    return FontStyleEnum.INHERIT;
                default:
                    return FontStyleEnum.NORMAL;
            }
        };
        return FontStyle;
    }());

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     * @description 自定义拓展方法请以小写开头的驼峰命名.
     */
    /**
     * 字体
     * @date 2022-06-29 11:05:51
     * @version 1.0.0
     *
     * @version 1.0.1
     * @date 2022-08-18 19:52:28
     * @author alawnxu
     * @description 优化为享元模式.因为目前PC端支持的Ark消息字体是固定的.所以设计为享元模式会比较合理
     */
    var DEFAULT_FONT_SIZE = '10px';
    var BoldEnum;
    (function (BoldEnum) {
        BoldEnum["NORMAL"] = "normal";
        BoldEnum["BOLD"] = "bold";
    })(BoldEnum || (BoldEnum = {}));
    var DEFAULT_FONT_FAMILY = 'system-ui';
    var Font = /** @class */ (function () {
        function Font(size, style, bold) {
            this.size = size;
            this.style = style;
            this.bold = bold;
        }
        Font.GetDefaultFont = function () {
            return Font.getInstance();
        };
        /**
         * 获取font实例
         */
        Font.getInstance = function (_a) {
            var _b = _a === void 0 ? {} : _a, fontStyle = _b.fontStyle, fontSize = _b.fontSize, fontBold = _b.fontBold;
            var size = fontSize || DEFAULT_FONT_SIZE;
            var style = fontStyle || FontStyleEnum.NORMAL;
            var bold = Boolean(fontBold) || false ? BoldEnum.BOLD : BoldEnum.NORMAL;
            var key = "".concat(style, ".").concat(bold, ".").concat(size);
            if (this.pool.get(key)) {
                return this.pool.get(key);
            }
            var font = new Font(size, style, bold);
            this.pool.set(key, font);
            return font;
        };
        Font.prototype.toString = function () {
            var _a = this, style = _a.style, size = _a.size, bold = _a.bold;
            var fontFamily = DEFAULT_FONT_FAMILY;
            return "".concat(style, " ").concat(bold, " ").concat(size, " ").concat(fontFamily);
        };
        Font.prototype.getFontStyle = function () {
            return this.style;
        };
        Font.prototype.getFontSize = function () {
            return this.size;
        };
        Font.pool = new Map();
        return Font;
    }());

    /* eslint-disable @typescript-eslint/prefer-for-of */
    /**
     * @author alawnxu
     * @description 文本
     * @date 2022-06-29 11:05:51
     * @version 1.0.0
     */
    var logger$o = Logger.getLogger('PlatformStaticText');
    var LayoutModeEnum;
    (function (LayoutModeEnum) {
        LayoutModeEnum[LayoutModeEnum["DISPLAY"] = 0] = "DISPLAY";
        LayoutModeEnum[LayoutModeEnum["ALL"] = 1] = "ALL";
    })(LayoutModeEnum || (LayoutModeEnum = {}));
    var PlatformStaticText = /** @class */ (function () {
        function PlatformStaticText() {
            this.lines = [];
            this.text = '';
            this.layoutMode = LayoutModeEnum.DISPLAY;
            /**
             * 是否允许多行
             */
            this.multiline = false;
            this.ellipsis = false;
            this.maxline = 0;
            this.layouted = false;
            this.margin = ARKRect.EmptyRect;
            this.size = ARKSize.EmptySize;
            this.color = 0xff000000;
            this.lineHeight = '';
            this.font = Font.GetDefaultFont();
            this.contentSize = new ARKSize();
            this.align = 0;
        }
        /**
         * 渲染文本
         * @description 这里有点意思.渲染的时候会重新布局一次.因为在渲染的时候会取渲染的区域与真实区域的交集.超出会隐藏文本.所以会重新布局
         * 也就是说.渲染的时候拿到的文本是真实的文本渲染尺寸。
         *
         * 分析下几种情况:
         * 1、文本本身的长度比渲染区域短. 这个时候取交集的话.会用文本本身的长度作为渲染宽度.
         * 2、文本本身的长度比渲染区域长. 这个时候取交集的话.超出渲染区域的应该需要自动截断.正常.但是这样会不会影响到其它元素的布局? 是不会的.
         * 3、考虑另外一种换行的情况.
         *    如果文本超出宽度需要换行.此时如果文本如果未设置最大行数.且父元素height:auto.应该需要自动撑高才行.那这里应该有问题.
         */
        PlatformStaticText.prototype.RenderTo = function (context) {
            this.Layout();
            var color = argbToColor(this.color);
            this.lines.forEach(function (line) {
                line.RenderTo(context, color);
            });
        };
        /**
         * 获取大小
         * @returns
         */
        PlatformStaticText.prototype.GetSize = function () {
            return this.size;
        };
        /**
         * 设置大小
         * @param size
         */
        PlatformStaticText.prototype.SetSize = function (size) {
            if (this.size.IsNotEqual(size)) {
                this.size = size;
                this.ClearLayout();
            }
        };
        /**
         * 获取文本内容大小
         * @description
         * 这里重新返回ARKSize的实例,防止被重写.
         */
        PlatformStaticText.prototype.GetContentSize = function () {
            var layoutMode = this.layoutMode;
            if (layoutMode !== LayoutModeEnum.ALL) {
                this.ClearLayout();
                this.layoutMode = LayoutModeEnum.ALL;
            }
            this.Layout();
            var width = this.contentSize.GetWidth();
            var height = this.contentSize.GetHeight();
            return new ARKSize(width, height);
        };
        PlatformStaticText.prototype.SetMargin = function (margin) {
            this.margin = margin;
        };
        PlatformStaticText.prototype.GetMargin = function () {
            return this.margin;
        };
        /**
         * 布局
         * @TODO 需要替换掉换行符.以及多余的空白
         * @description
         * 1、当重新获取 ContentSize() 的时候会重新布局
         * 2、当绘制 RenderTo() 的时候会重新布局
         */
        PlatformStaticText.prototype.Layout = function () {
            var _a = this, text = _a.text, lines = _a.lines, layouted = _a.layouted, font = _a.font, align = _a.align;
            if (typeof text !== 'string') {
                logger$o.warn('Layout: text is not string');
                return;
            }
            if (!text.length || lines.length) {
                return;
            }
            if (layouted) {
                return;
            }
            var context = PlatformStaticText.context;
            var lineAlign = TextAlign.numToAlignEnum(align);
            context.save();
            context.font = this.font.toString();
            this.layouted = true;
            this.ConstructIterator();
            var actualHeight = this.GetTextActualHeight(context);
            // 单行
            if (!this.multiline) {
                var rect_1 = this.GetClientRect();
                var content_1 = '';
                var lineWidth_1 = 0;
                // 如果区域有效
                if (rect_1.getLeft() < rect_1.getRight()) {
                    for (var i = 0; i < text.length; i++) {
                        // content += text[i];
                        lineWidth_1 = context.measureText(content_1 + text[i]).width;
                        if (lineWidth_1 >= rect_1.Width() && this.layoutMode === LayoutModeEnum.DISPLAY) {
                            break;
                        }
                        content_1 += text[i];
                    }
                }
                else {
                    lineWidth_1 = context.measureText(text).width;
                }
                this.contentSize.SetSize(lineWidth_1, actualHeight);
                if (lineWidth_1 > rect_1.Width()) {
                    for (var i = text.length; i > 0; i--) {
                        if (this.ellipsis) {
                            content_1 = "".concat(text.substring(0, i), "... ");
                        }
                        else {
                            content_1 = text.substring(0, i);
                        }
                        lineWidth_1 = context.measureText(content_1).width;
                        if (lineWidth_1 < rect_1.Width()) {
                            break;
                        }
                    }
                }
                var staticTextLine = new StaticTextLine({
                    text: content_1,
                    rect: this.GetClientRect(),
                    font: font,
                    lineHeight: actualHeight,
                    textAlign: lineAlign,
                    width: lineWidth_1,
                });
                this.lines.push(staticTextLine);
                context.restore();
                return;
            }
            // 多行
            var rect = this.GetClientRect();
            /**
             * 在多行文本的布局中.需要显示的固定文本的宽度
             * @description 如: width:xx, flex:1
             * 文本的高度可能固定，也可能为0(即没有设置)
             */
            if (rect.getRight() <= rect.getLeft()) {
                context.restore();
                // 不满足上述情况
                return;
            }
            var maxHeight = rect.Height();
            var content = '';
            var lineWidth = 0;
            var lineHeight = 0;
            var lineCount = 0;
            for (var i = 0; i < text.length; i++) {
                lineWidth = context.measureText(content + text[i]).width;
                lineHeight = actualHeight * (lineCount + 2);
                if (lineWidth >= rect.Width()) {
                    // 即将超出最大行数或固定高度
                    if ((this.maxline && lineCount >= this.maxline - 1) ||
                        (rect.getBottom() > rect.getTop() && lineHeight > maxHeight)) {
                        // 如要显示省略号
                        if (this.ellipsis) {
                            // 在content最后插入省略号
                            for (var j = content.length; j > 0; j--) {
                                content = "".concat(content.substring(0, j), "... ");
                                lineWidth = context.measureText(content).width;
                                if (lineWidth < rect.Width()) {
                                    break;
                                }
                            }
                        }
                        // 生成最后一行
                        var staticTextLine_1 = new StaticTextLine({
                            text: content,
                            rect: new ARKRect(rect.getLeft(), rect.getTop() + actualHeight * lineCount, rect.getRight(), rect.getTop() + actualHeight * (lineCount + 1)),
                            font: font,
                            lineHeight: actualHeight,
                            width: lineWidth,
                            textAlign: lineAlign,
                        });
                        this.lines.push(staticTextLine_1);
                        content = '';
                        break;
                    }
                    // 生成新的一行
                    var staticTextLine = new StaticTextLine({
                        text: content,
                        rect: new ARKRect(rect.getLeft(), rect.getTop() + actualHeight * lineCount, lineWidth, rect.getTop() + actualHeight * (lineCount + 1)),
                        font: font,
                        lineHeight: actualHeight,
                        width: lineWidth,
                        textAlign: lineAlign,
                    });
                    this.lines.push(staticTextLine);
                    content = text[i];
                    lineCount += 1;
                }
                else {
                    content += text[i];
                }
            }
            /**
             * 不存在宽度或高度溢出时，最后一行不会占满，单独输出最后一行
             * 此时要注意左右对齐情况
             */
            if (content) {
                var staticTextLine = new StaticTextLine({
                    text: content,
                    rect: new ARKRect(rect.getLeft(), rect.getTop() + actualHeight * lineCount, rect.getRight(), rect.getTop() + actualHeight * (lineCount + 1)),
                    font: font,
                    lineHeight: actualHeight,
                    width: lineWidth,
                    textAlign: lineAlign,
                });
                this.lines.push(staticTextLine);
            }
            if (this.lines.length > 1) {
                lineWidth = rect.Width();
            }
            this.contentSize.SetSize(lineWidth, this.lines.length * actualHeight);
            context.restore();
        };
        /**
         * 获取字体颜色
         * @returns
         */
        PlatformStaticText.prototype.GetTextColor = function () {
            return this.color;
        };
        /**
         * 设置字体颜色
         * @param color
         */
        PlatformStaticText.prototype.SetTextColor = function (color) {
            this.color = color;
        };
        /**
         * 获取文本内容
         */
        PlatformStaticText.prototype.GetText = function () {
            return this.text;
        };
        /**
         * 设置文本内容
         * @param text 文本
         * @returns
         */
        PlatformStaticText.prototype.SetText = function (text) {
            if (isUndefined$1(text)) {
                return;
            }
            if (this.text !== text) {
                this.text = text;
                this.ClearLayout();
            }
        };
        PlatformStaticText.prototype.GetFont = function () {
            return this.font;
        };
        /**
         * 设置字体.
         * @param font
         * @TODO 这里有BUG.如果设置的字体大小从小到大,外层容器大小会固定.此时如果再变大.这样就会有问题.会按照之前的尺寸计算现在的大小.导致内容被截断.由大变小也会导致缩不回来
         * 猜想：可以在實現AutoSize之後搭配AutoSize去解決。
         */
        PlatformStaticText.prototype.SetFont = function (font) {
            this.font = font;
            if (this.font) {
                this.ClearLayout();
            }
        };
        PlatformStaticText.prototype.GetLineHeight = function () {
            return this.lineHeight;
        };
        /**
         * 设置行高
         * @param lineHeight
         * @description 当行高被重新设置的时候.需要重新清理布局
         */
        PlatformStaticText.prototype.SetLineHeight = function (lineHeight) {
            if (!lineHeight) {
                return;
            }
            if (this.lineHeight !== lineHeight) {
                this.lineHeight = lineHeight;
                this.ClearLayout();
            }
        };
        /**
         * 设置是否超出显示省略号
         */
        PlatformStaticText.prototype.GetEllipsis = function () {
            return this.ellipsis;
        };
        /**
         * 设置是否超出省略号
         * @param ellipsis
         */
        PlatformStaticText.prototype.SetEllipsis = function (ellipsis) {
            if (this.ellipsis !== ellipsis) {
                this.ellipsis = ellipsis;
                this.ClearLayout();
            }
        };
        /**
         * 获取排列方式行数
         */
        PlatformStaticText.prototype.GetAlign = function () {
            return this.align;
        };
        /**
         * 设置对齐方式
         * @param nAlign 对齐方式
         */
        PlatformStaticText.prototype.SetAlign = function (nAlign) {
            if (nAlign !== this.align) {
                this.align = nAlign;
                this.ClearLayout();
            }
        };
        /**
         * 获取最大行数
         */
        PlatformStaticText.prototype.GetMaxline = function () {
            return this.maxline;
        };
        /**
         * 设置显示最大行数
         * @param maxline
         * @TODO 待测试
         */
        PlatformStaticText.prototype.SetMaxline = function (maxline) {
            if (this.maxline !== maxline) {
                this.maxline = Math.max(parseInt(String(maxline), 10) || 0, 1);
                this.ClearLayout();
            }
        };
        /**
         * 是否允许多行
         */
        PlatformStaticText.prototype.GetMultiline = function () {
            return this.multiline;
        };
        /**
         * 设置是否允许多行
         * @param multiline
         */
        PlatformStaticText.prototype.SetMultiline = function (multiline) {
            if (this.multiline !== multiline) {
                this.multiline = multiline;
                this.ClearLayout();
            }
        };
        /**
         * 清理布局
         */
        PlatformStaticText.prototype.ClearLayout = function () {
            this.lines = [];
            this.contentSize.SetSize(0, 0);
            this.layouted = false;
        };
        PlatformStaticText.prototype.ConstructIterator = function () {
            this.text = this.text.replace(/[\n\r\t]/g, '');
        };
        /**
         * 获取文本的高度
         * @TODO 需要进一步完善.这里还是优先取lineHeight.而且实际高度的获取还是跟浏览器端有一些差距
         * @returns
         */
        PlatformStaticText.prototype.GetTextHeight = function () {
            var _a = ConvertToValue.stringToYogaValue(this.lineHeight), unit = _a.unit, value = _a.value;
            if (unit === YogaConstant.UNIT_POINT) {
                return value;
            }
            return parseInt(this.font.getFontSize(), 10) * 1.2;
        };
        /**
         * 获取文本渲染的实际高度
         * @returns
         */
        PlatformStaticText.prototype.GetTextActualHeight = function (context) {
            var text = this.text;
            var metrics = context.measureText(text);
            var actualHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
            return actualHeight;
        };
        /**
         * @TODO 这里取数先这样取,后面再回过头来看是否合理
         */
        PlatformStaticText.prototype.GetClientRect = function () {
            var size = this.size;
            var clientRect = new ARKRect(0, 0, size.GetWidth(), size.GetHeight());
            return clientRect;
        };
        /**
         * 替换为单例,优化内存占用
         */
        PlatformStaticText.context = new OffscreenCanvas(0, 0).getContext('2d');
        return PlatformStaticText;
    }());

    var logger$n = Logger.getLogger('WebText');
    var DEFAULT_MULTILINE = false;
    var DEFAULT_ELLIPSIS = false;
    var DEFAULT_AUTOSIZE = false;
    var WebText = /** @class */ (function (_super) {
        __extends$1(WebText, _super);
        function WebText(applicationId) {
            var _this = _super.call(this, applicationId) || this;
            /**
             * 非常重要的布局属性.当如果设置了display:flex.此时的 autosize 会自动失效.
             */
            _this.autoSize = DEFAULT_AUTOSIZE;
            _this.ellipsis = DEFAULT_ELLIPSIS;
            _this.multiline = DEFAULT_MULTILINE;
            var defaultFont = Font.GetDefaultFont();
            _this.staticText = new PlatformStaticText();
            _this.staticText.SetFont(defaultFont);
            return _this;
        }
        WebText.isText = function (node) {
            return node.tagName === WebText.tagName;
        };
        WebText.prototype.GetNodeType = function () {
            return NodeTypeEnum.TEXT;
        };
        /**
         * 测量Text渲染区域的大小
         * @param size 当不为空的时候表示使用指定大小去测量.测量完成后需要重新清空回来
         * @description 只有CSSLayout的时候才会触发测量
         * @override
         */
        WebText.prototype.MeasureSize = function (size) {
            var staticText = this.staticText;
            var oldSize = this.staticText.GetSize();
            if (size === null || size === void 0 ? void 0 : size.IsNotEmpty()) {
                staticText.SetSize(size);
            }
            var measureSize = staticText.GetContentSize();
            staticText.SetSize(oldSize);
            return measureSize;
        };
        /**
         * 设置文字内容
         * @param color
         * @returns
         * @TODO 待测试
         */
        WebText.prototype.SetValue = function (value, isLua) {
            if (isUndefined$1(value) || isNull(value)) {
                return;
            }
            var text = String(value);
            if (isLua) {
                // Lua decodeURIComponent一下
                text = decodeURIComponent(value);
            }
            this.SetTextImpl(text);
            if (this.autoSize) {
                this.AutoSize();
            }
            this.Update();
            this.DoCSSCustomUpdate();
        };
        /**
         * 设置元素值
         * @param color ARGB格式的颜色数值
         */
        WebText.prototype.SetTextColor = function (color) {
            if (!color) {
                return;
            }
            var oldColor = this.staticText.GetTextColor();
            if (argbToColor(color) !== argbToColor(oldColor)) {
                this.staticText.SetTextColor(color);
                this.Update();
            }
        };
        WebText.prototype.GetValue = function () {
            return this.staticText.GetText();
        };
        /**
         * 获取文本颜色
         * @returns ARGB格式的颜色数值
         */
        WebText.prototype.GetTextColor = function () {
            var color = this.staticText.GetTextColor();
            return color;
            // throw new Error('GetTextColor: Method not implemented.');
        };
        /**
         * 设置对齐方式
         * @param align 对齐方式
         */
        WebText.prototype.SetAlign = function (align) {
            logger$n.info('align:', align);
            this.staticText.SetAlign(align);
        };
        /**
         * 获取对齐方式
         */
        WebText.prototype.GetAlign = function () {
            return this.staticText.GetAlign();
        };
        /**
         * 设置文字长度超出Text范围时是否截断显示省略号
         * @param ellipsis
         * @TODO 待测试
         */
        WebText.prototype.SetEllipsis = function (ellipsis) {
            logger$n.info('Ellipsis', ellipsis);
            if (ellipsis !== this.staticText.GetEllipsis()) {
                this.staticText.SetEllipsis(ellipsis);
                if (this.autoSize) {
                    this.AutoSize();
                }
                this.Update();
            }
        };
        /**
         * 获取文字长度超出Text范围时是否截断显示省略号
         * @returns boolean
         * @TODO 待测试
         */
        WebText.prototype.GetEllipsis = function () {
            return this.staticText.GetEllipsis();
        };
        /**
         * 设置最大行数
         * @param num
         */
        WebText.prototype.SetMaxline = function (maxline) {
            logger$n.debug('SetMaxline:', maxline);
            this.staticText.SetMaxline(maxline);
            if (this.autoSize) {
                this.AutoSize();
            }
            this.Update();
        };
        /**
         * 获取最大行数
         */
        WebText.prototype.GetMaxline = function () {
            return this.staticText.GetMaxline();
        };
        /**
         * 设置最大行数
         * @param num
         */
        WebText.prototype.SetLineHeight = function (lineHeight) {
            logger$n.debug('SetLineHeight:', lineHeight);
            var n_lineHeight = this.staticText.GetLineHeight();
            if (lineHeight !== n_lineHeight) {
                this.staticText.SetLineHeight(lineHeight);
                this.Update();
            }
        };
        /**
         * 获取最大行数
         */
        WebText.prototype.GetLineHeight = function () {
            return this.staticText.GetLineHeight();
        };
        /**
         * 计算文字内容渲染区域的尺寸
         */
        WebText.prototype.MeasureTextSize = function () {
            var staticText = this.staticText;
            var measureSize = staticText.GetContentSize();
            return measureSize;
        };
        /**
         * 设置字体
         * @param font
         * @TODO 待测试
         */
        WebText.prototype.SetFont = function (font) {
            this.SetFontImpl(font);
            if (this.autoSize) {
                this.AutoSize();
            }
            this.Update();
            // 当字体大小发生变化的时候, 这里还需要手动更新一次样式. 否则可能会超出. @see com.tencent.channelticket
            this.DoCSSCustomUpdate();
        };
        /**
         * 获取字体
         */
        WebText.prototype.GetFont = function () {
            logger$n.info('Font', this.staticText.GetFont());
            return this.fontName;
        };
        /**
         * 设置是否多行
         */
        WebText.prototype.SetMultiline = function (multiline) {
            if (multiline !== this.staticText.GetMultiline()) {
                this.staticText.SetMultiline(multiline);
                if (this.autoSize) {
                    this.AutoSize();
                }
                this.Update();
            }
        };
        /**
         * 获取是否多行
         */
        WebText.prototype.GetMultiline = function () {
            return this.staticText.GetMultiline();
        };
        /**
         * 设置大小
         * @description 并不作为接口给Ark应用调用.只是在序列化Text标签的时候会初始化Size大小
         */
        WebText.prototype.SetSizeImpl = function (size) {
            this.staticText.SetSize(size);
        };
        /**
         * 设置Text内容
         * @description 并不作为接口给Ark应用调用.只是在序列化Text标签的时候会调用一次
         */
        WebText.prototype.SetTextImpl = function (text) {
            if (isUndefined$1(text) || isNull(text)) {
                logger$n.warn('SetTextImpl: text is undefined');
                return;
            }
            this.staticText.SetText(text);
        };
        /**
         * 设置字体
         * @param fontName 这里拿到的是一个字符串。 font.12简写.后面需要转换下
         * @TODO
         */
        WebText.prototype.SetFontImpl = function (fontName) {
            logger$n.debug('SetFontImpl:', fontName);
            if (!fontName) {
                return;
            }
            this.fontName = fontName;
            var fontConfig = AppUtil.GetFonts(this.GetApp());
            var font = null;
            if (fontConfig === null || fontConfig === void 0 ? void 0 : fontConfig[fontName]) {
                var _a = fontConfig[fontName], size = _a.size, bold = _a.bold;
                var fontSize = parseInt(String(size), 10) || null;
                var fontBold = typeof bold === 'boolean' ? bold : false;
                font = Font.getInstance({
                    fontSize: fontSize ? "".concat(fontSize, "px") : null,
                    fontBold: fontBold,
                });
            }
            else {
                font = Font.GetDefaultFont();
            }
            this.staticText.SetFont(font);
        };
        /**
         * 自动大小
         */
        WebText.prototype.AutoSize = function () {
            var textSize = this.MeasureSize();
            if (this.size.IsNotEqual(textSize)) {
                var oldSize = this.GetSize();
                this.size = textSize;
                this.DoResize(oldSize, this.size.Copy());
                this.UpdateRect();
            }
        };
        /**
         * 释放资源
         */
        WebText.prototype.Release = function () {
            _super.prototype.Release.call(this);
        };
        /**
         * 渲染节点
         * @param context OffscreenCanvasRenderingContext2D
         * @param renderRect 渲染区域
         */
        WebText.prototype.DoRenderTo = function (context, renderRect) {
            var applicationContext = WebApplicationApi.getContext();
            if (applicationContext.isDebug()) {
                context.beginPath();
                context.rect(0, 0, renderRect.Width(), renderRect.Height());
                var backgroundColor = this.GetStyle(ARKCssPropertiesEnum.BACKGROUND_COLOR);
                context.fillStyle = backgroundColor || 'transparent';
                context.fill();
                context.stroke();
            }
            if (this.staticText) {
                this.staticText.RenderTo(context);
            }
        };
        /**
         * 更新大小
         * @param oldSize
         * @param newSize
         * @description 重写父类的Resize方法. 这个方法并不会暴露出去
         * 当Text的大小被更新之后.需要更新StaticText的大小
         */
        WebText.prototype.Resize = function (oldSize, newSize) {
            _super.prototype.Resize.call(this, oldSize, newSize);
            this.staticText.SetSize(newSize);
        };
        WebText.tagName = 'TEXT';
        return WebText;
    }(WebUIObject));

    /**
     * 文本标签序列化
     * @author alawnxu
     * @date 2022-07-14 21:09:11
     * @version 1.0.0
     */
    var logger$m = Logger.getLogger('TextSerializer');
    var TextAttributesEnum;
    (function (TextAttributesEnum) {
        TextAttributesEnum["TEXTCOLOR"] = "textcolor";
        TextAttributesEnum["ALIGN"] = "align";
        TextAttributesEnum["MULTILINE"] = "multiline";
        TextAttributesEnum["ELLIPSIS"] = "ellipsis";
        TextAttributesEnum["MAXLINE"] = "maxline";
        TextAttributesEnum["LINE_HEIGHT"] = "line-height";
        TextAttributesEnum["LINEHEIGHT"] = "lineheight";
        TextAttributesEnum["AUTOSIZE"] = "autosize";
        TextAttributesEnum["FONT"] = "font";
        TextAttributesEnum["VALUE"] = "value";
    })(TextAttributesEnum || (TextAttributesEnum = {}));
    var TextSerializer = /** @class */ (function (_super) {
        __extends$1(TextSerializer, _super);
        function TextSerializer(application, element, pObject) {
            var _this = _super.call(this, application, element) || this;
            _this.pObject = pObject;
            return _this;
        }
        TextSerializer.prototype.read = function () {
            var _a = this, pObject = _a.pObject, element = _a.element, application = _a.application;
            var serializer = new UIObjectSerializer(application, element, pObject);
            serializer.read();
            // 如果有设置大小. 则更新staticText的大小
            var size = pObject.GetSize();
            pObject.SetSizeImpl(size);
            // 内容. @TODO 这里还是合并会好点.
            var content = element.getAttribute(TextAttributesEnum.VALUE);
            if (typeof content === 'string') {
                pObject.SetTextImpl(content);
            }
            // 设置字体
            var font = element.getAttribute(TextAttributesEnum.FONT);
            pObject.SetFontImpl(font);
            // 设置字体颜色
            var textColor = element.getAttribute(TextAttributesEnum.TEXTCOLOR);
            pObject.SetTextColor(textColor);
            // 设置对齐方式
            var align = Attribute.readNumberValue(element.getAttribute(TextAttributesEnum.ALIGN));
            pObject.SetAlign(align);
            logger$m.info('align', align);
            // 超出显示省略号
            var ellipsis = Attribute.readBooleanValue(element.getAttribute(TextAttributesEnum.ELLIPSIS));
            pObject.SetEllipsis(ellipsis === null ? DEFAULT_ELLIPSIS : ellipsis);
            // 是否允许多行
            var multiline = Attribute.readBooleanValue(element.getAttribute(TextAttributesEnum.MULTILINE));
            pObject.SetMultiline(multiline === null ? DEFAULT_MULTILINE : multiline);
            // 最大行数
            var maxline = Attribute.readNumberValue(TextAttributesEnum.MAXLINE);
            pObject.SetMaxline(maxline === null ? 0 : maxline);
            // 行高
            var lineHeight = element.getAttribute(TextAttributesEnum.LINEHEIGHT);
            var lineHeightOld = element.getAttribute(TextAttributesEnum.LINE_HEIGHT);
            if (lineHeight || lineHeightOld) {
                pObject.SetLineHeight(lineHeight || lineHeightOld);
            }
            var autoSizeAttrValue = element.getAttribute(TextAttributesEnum.AUTOSIZE);
            var autoSize = Attribute.readBooleanValue(autoSizeAttrValue);
            /**
             * 默认为true.所以无效的时候不需要设置
             */
            if (autoSize !== null) {
                pObject.SetAutoSize(autoSize);
            }
        };
        return TextSerializer;
    }(BaseSerializer));

    var logger$l = Logger.getLogger('DockLayout');
    var DockLayout = /** @class */ (function (_super) {
        __extends$1(DockLayout, _super);
        function DockLayout() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DockLayout.prototype.GetName = function () {
            return LayoutEnum.DOCK_LAYOUT;
        };
        DockLayout.prototype.InitParameters = function (element) {
            logger$l.debug('InitParameters:', element);
        };
        DockLayout.prototype.DoLayout = function (view) {
            logger$l.info('DoLayout', view);
            throw new Error('Method not implemented.');
        };
        DockLayout.prototype.UpdateRect = function (child, parentRect) {
            logger$l.info('UpdateRect', child, parentRect);
            throw new Error('Method not implemented.');
        };
        /**
         * 更新Margin
         * @param child 子节点信息
         * @param parentRect 父节点的区域信息
         * @description DockLayout不需要更新Margin.交给NormalLayout即可
         */
        DockLayout.prototype.UpdateMargin = function (child, parentRect) {
            logger$l.debug('UpdateMargin:', child, parentRect);
        };
        return DockLayout;
    }(Layout));

    /**
     * List布局
     * @author alawnxu
     * @date 2022-07-24 21:44:02
     * @version 1.0.0
     */
    var logger$k = Logger.getLogger('ListLayout');
    var ListLayoutOrientationEnum;
    (function (ListLayoutOrientationEnum) {
        ListLayoutOrientationEnum["VERTICAL"] = "Vertical";
        ListLayoutOrientationEnum["HORIZONTAL"] = "Horizontal";
        ListLayoutOrientationEnum["REVERSE_VERTICAL"] = "ReverseVertical";
        ListLayoutOrientationEnum["REVERSE_HORIZONTAL"] = "ReverseHorizontal";
    })(ListLayoutOrientationEnum || (ListLayoutOrientationEnum = {}));
    var ListLayoutAttributeEnum;
    (function (ListLayoutAttributeEnum) {
        ListLayoutAttributeEnum["ORIENTATION"] = "orientation";
    })(ListLayoutAttributeEnum || (ListLayoutAttributeEnum = {}));
    var ListLayout = /** @class */ (function (_super) {
        __extends$1(ListLayout, _super);
        function ListLayout() {
            var _this = _super.call(this) || this;
            _this.normalLayout = new NormalLayout();
            return _this;
        }
        ListLayout.prototype.GetName = function () {
            return LayoutEnum.LIST_LAYOUT;
        };
        ListLayout.prototype.InitParameters = function (element) {
            var orientation = element.getAttribute(ListLayoutAttributeEnum.ORIENTATION);
            switch (orientation) {
                case ListLayoutOrientationEnum.VERTICAL:
                    this.orientation = ListLayoutOrientationEnum.VERTICAL;
                    break;
                case ListLayoutOrientationEnum.REVERSE_VERTICAL:
                    this.orientation = ListLayoutOrientationEnum.REVERSE_VERTICAL;
                    break;
                case ListLayoutOrientationEnum.REVERSE_HORIZONTAL:
                    this.orientation = ListLayoutOrientationEnum.REVERSE_HORIZONTAL;
                    break;
                default:
                    this.orientation = ListLayoutOrientationEnum.HORIZONTAL;
            }
        };
        /**
         * 布局
         * @param view
         * @description 确定基准布局外框后，内部计算同NormalLayout
         */
        ListLayout.prototype.DoLayout = function (view) {
            var e_1, _a;
            if (!view) {
                return;
            }
            var parentRect = view.GetRect();
            parentRect.MoveToXY(0, 0);
            try {
                for (var _b = __values$1(view.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    if (!child.GetVisible()) {
                        continue;
                    }
                    var size = child.GetSize();
                    var margin = child.GetMargin();
                    var rect = parentRect.Copy();
                    switch (this.orientation) {
                        case ListLayoutOrientationEnum.VERTICAL:
                            rect.setTop(parentRect.getTop());
                            rect.setBottom(parentRect.getTop() + size.GetHeight() + margin.getTop() + margin.getBottom());
                            parentRect.setTop(rect.getBottom());
                            break;
                        case ListLayoutOrientationEnum.HORIZONTAL:
                            rect.setLeft(parentRect.getLeft());
                            rect.setRight(parentRect.getLeft() + size.GetWidth() + margin.getLeft() + margin.getRight());
                            parentRect.setLeft(rect.getRight());
                            break;
                        case ListLayoutOrientationEnum.REVERSE_VERTICAL:
                            rect.setBottom(parentRect.getBottom());
                            parentRect.setTop(parentRect.getBottom() - size.GetHeight() - margin.getTop() - margin.getBottom());
                            parentRect.setBottom(rect.getTop());
                            break;
                        case ListLayoutOrientationEnum.REVERSE_HORIZONTAL:
                            rect.setRight(parentRect.getRight());
                            rect.setLeft(parentRect.getRight() - size.GetWidth() - margin.getLeft() - margin.getRight());
                            parentRect.setRight(rect.getLeft());
                            break;
                        default:
                    }
                    this.normalLayout.UpdateRect(child, rect);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        /**
         * 更新区域
         * @param child
         * @param parentRect
         * @returns
         */
        ListLayout.prototype.UpdateRect = function (child, parentRect) {
            logger$k.info('UpdateRect', child, parentRect);
            if (!child) {
                return;
            }
            var parent = child.GetParent();
            this.DoLayout(parent);
        };
        /**
         * 更新margin
         * @param child 子节点信息
         * @param parentRect 父节点的区域信息
         * @description ListLayout不需要更新margin.交给NormalLayout即可
         */
        ListLayout.prototype.UpdateMargin = function (child, parentRect) {
            logger$k.debug('UpdateMargin:', child, parentRect);
        };
        return ListLayout;
    }(Layout));

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     * @description 自定义拓展方法请以小写开头的驼峰命名.
     */
    /**
     * LayoutFactory
     * @author alawnxu
     * @date 2022-07-11 21:09:11
     * @version 1.0.0
     */
    var LayoutFactory = /** @class */ (function () {
        function LayoutFactory() {
        }
        /**
         * 根据布局类型获取布局方式
         * @param type
         * @see 默认为NormalLayout. {@link http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html}
         */
        LayoutFactory.GetLayout = function (type) {
            switch (type) {
                case LayoutEnum.LIST_LAYOUT:
                    return new ListLayout();
                case LayoutEnum.DOCK_LAYOUT:
                    return new DockLayout();
                default:
                    return new NormalLayout();
            }
        };
        return LayoutFactory;
    }());

    /**
     * Layout节点序列化
     * @author alawnxu
     * @date 2022-07-25 00:34:05
     * @version 1.0.0
     */
    var LayoutSerializer = /** @class */ (function (_super) {
        __extends$1(LayoutSerializer, _super);
        function LayoutSerializer(application, element, layout) {
            var _this = _super.call(this, application, element) || this;
            _this.element = element;
            _this.layout = layout;
            return _this;
        }
        LayoutSerializer.prototype.read = function () {
            var element = this.element;
            this.layout.InitParameters(element);
        };
        return LayoutSerializer;
    }(BaseSerializer));

    'use strict';

    /**
     * Ponyfill for `Array.prototype.find` which is only available in ES6 runtimes.
     *
     * Works with anything that has a `length` property and index access properties, including NodeList.
     *
     * @template {unknown} T
     * @param {Array<T> | ({length:number, [number]: T})} list
     * @param {function (item: T, index: number, list:Array<T> | ({length:number, [number]: T})):boolean} predicate
     * @param {Partial<Pick<ArrayConstructor['prototype'], 'find'>>?} ac `Array.prototype` by default,
     * 				allows injecting a custom implementation in tests
     * @returns {T | undefined}
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
     * @see https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.find
     */
    function find$1(list, predicate, ac) {
    	if (ac === undefined) {
    		ac = Array.prototype;
    	}
    	if (list && typeof ac.find === 'function') {
    		return ac.find.call(list, predicate);
    	}
    	for (var i = 0; i < list.length; i++) {
    		if (Object.prototype.hasOwnProperty.call(list, i)) {
    			var item = list[i];
    			if (predicate.call(undefined, item, i, list)) {
    				return item;
    			}
    		}
    	}
    }

    /**
     * "Shallow freezes" an object to render it immutable.
     * Uses `Object.freeze` if available,
     * otherwise the immutability is only in the type.
     *
     * Is used to create "enum like" objects.
     *
     * @template T
     * @param {T} object the object to freeze
     * @param {Pick<ObjectConstructor, 'freeze'> = Object} oc `Object` by default,
     * 				allows to inject custom object constructor for tests
     * @returns {Readonly<T>}
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
     */
    function freeze(object, oc) {
    	if (oc === undefined) {
    		oc = Object;
    	}
    	return oc && typeof oc.freeze === 'function' ? oc.freeze(object) : object
    }

    /**
     * Since we can not rely on `Object.assign` we provide a simplified version
     * that is sufficient for our needs.
     *
     * @param {Object} target
     * @param {Object | null | undefined} source
     *
     * @returns {Object} target
     * @throws TypeError if target is not an object
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
     * @see https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.assign
     */
    function assign(target, source) {
    	if (target === null || typeof target !== 'object') {
    		throw new TypeError('target is not an object')
    	}
    	for (var key in source) {
    		if (Object.prototype.hasOwnProperty.call(source, key)) {
    			target[key] = source[key];
    		}
    	}
    	return target
    }

    /**
     * All mime types that are allowed as input to `DOMParser.parseFromString`
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString#Argument02 MDN
     * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#domparsersupportedtype WHATWG HTML Spec
     * @see DOMParser.prototype.parseFromString
     */
    var MIME_TYPE = freeze({
    	/**
    	 * `text/html`, the only mime type that triggers treating an XML document as HTML.
    	 *
    	 * @see DOMParser.SupportedType.isHTML
    	 * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
    	 * @see https://en.wikipedia.org/wiki/HTML Wikipedia
    	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
    	 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring WHATWG HTML Spec
    	 */
    	HTML: 'text/html',

    	/**
    	 * Helper method to check a mime type if it indicates an HTML document
    	 *
    	 * @param {string} [value]
    	 * @returns {boolean}
    	 *
    	 * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
    	 * @see https://en.wikipedia.org/wiki/HTML Wikipedia
    	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
    	 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring 	 */
    	isHTML: function (value) {
    		return value === MIME_TYPE.HTML
    	},

    	/**
    	 * `application/xml`, the standard mime type for XML documents.
    	 *
    	 * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType registration
    	 * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
    	 * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
    	 */
    	XML_APPLICATION: 'application/xml',

    	/**
    	 * `text/html`, an alias for `application/xml`.
    	 *
    	 * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
    	 * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
    	 * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
    	 */
    	XML_TEXT: 'text/xml',

    	/**
    	 * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
    	 * but is parsed as an XML document.
    	 *
    	 * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType registration
    	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
    	 * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
    	 */
    	XML_XHTML_APPLICATION: 'application/xhtml+xml',

    	/**
    	 * `image/svg+xml`,
    	 *
    	 * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
    	 * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
    	 * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
    	 */
    	XML_SVG_IMAGE: 'image/svg+xml',
    });

    /**
     * Namespaces that are used in this code base.
     *
     * @see http://www.w3.org/TR/REC-xml-names
     */
    var NAMESPACE$3 = freeze({
    	/**
    	 * The XHTML namespace.
    	 *
    	 * @see http://www.w3.org/1999/xhtml
    	 */
    	HTML: 'http://www.w3.org/1999/xhtml',

    	/**
    	 * Checks if `uri` equals `NAMESPACE.HTML`.
    	 *
    	 * @param {string} [uri]
    	 *
    	 * @see NAMESPACE.HTML
    	 */
    	isHTML: function (uri) {
    		return uri === NAMESPACE$3.HTML
    	},

    	/**
    	 * The SVG namespace.
    	 *
    	 * @see http://www.w3.org/2000/svg
    	 */
    	SVG: 'http://www.w3.org/2000/svg',

    	/**
    	 * The `xml:` namespace.
    	 *
    	 * @see http://www.w3.org/XML/1998/namespace
    	 */
    	XML: 'http://www.w3.org/XML/1998/namespace',

    	/**
    	 * The `xmlns:` namespace
    	 *
    	 * @see https://www.w3.org/2000/xmlns/
    	 */
    	XMLNS: 'http://www.w3.org/2000/xmlns/',
    });

    var assign_1 = assign;
    var find_1 = find$1;
    var freeze_1 = freeze;
    var MIME_TYPE_1 = MIME_TYPE;
    var NAMESPACE_1 = NAMESPACE$3;

    var conventions = {
    	assign: assign_1,
    	find: find_1,
    	freeze: freeze_1,
    	MIME_TYPE: MIME_TYPE_1,
    	NAMESPACE: NAMESPACE_1
    };

    var find = conventions.find;
    var NAMESPACE$2 = conventions.NAMESPACE;

    /**
     * A prerequisite for `[].filter`, to drop elements that are empty
     * @param {string} input
     * @returns {boolean}
     */
    function notEmptyString (input) {
    	return input !== ''
    }
    /**
     * @see https://infra.spec.whatwg.org/#split-on-ascii-whitespace
     * @see https://infra.spec.whatwg.org/#ascii-whitespace
     *
     * @param {string} input
     * @returns {string[]} (can be empty)
     */
    function splitOnASCIIWhitespace(input) {
    	// U+0009 TAB, U+000A LF, U+000C FF, U+000D CR, U+0020 SPACE
    	return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : []
    }

    /**
     * Adds element as a key to current if it is not already present.
     *
     * @param {Record<string, boolean | undefined>} current
     * @param {string} element
     * @returns {Record<string, boolean | undefined>}
     */
    function orderedSetReducer (current, element) {
    	if (!current.hasOwnProperty(element)) {
    		current[element] = true;
    	}
    	return current;
    }

    /**
     * @see https://infra.spec.whatwg.org/#ordered-set
     * @param {string} input
     * @returns {string[]}
     */
    function toOrderedSet(input) {
    	if (!input) return [];
    	var list = splitOnASCIIWhitespace(input);
    	return Object.keys(list.reduce(orderedSetReducer, {}))
    }

    /**
     * Uses `list.indexOf` to implement something like `Array.prototype.includes`,
     * which we can not rely on being available.
     *
     * @param {any[]} list
     * @returns {function(any): boolean}
     */
    function arrayIncludes (list) {
    	return function(element) {
    		return list && list.indexOf(element) !== -1;
    	}
    }

    function copy(src,dest){
    	for(var p in src){
    		if (Object.prototype.hasOwnProperty.call(src, p)) {
    			dest[p] = src[p];
    		}
    	}
    }

    /**
    ^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
    ^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
     */
    function _extends(Class,Super){
    	var pt = Class.prototype;
    	if(!(pt instanceof Super)){
    		function t(){};
    		t.prototype = Super.prototype;
    		t = new t();
    		copy(pt,t);
    		Class.prototype = pt = t;
    	}
    	if(pt.constructor != Class){
    		if(typeof Class != 'function'){
    			console.error("unknown Class:"+Class);
    		}
    		pt.constructor = Class;
    	}
    }

    // Node Types
    var NodeType = {};
    var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
    var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
    var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
    var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
    var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
    var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
    var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
    var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
    var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
    var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
    var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
    var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

    // ExceptionCode
    var ExceptionCode = {};
    var ExceptionMessage = {};
    var INDEX_SIZE_ERR              = ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
    var DOMSTRING_SIZE_ERR          = ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
    var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
    var WRONG_DOCUMENT_ERR          = ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
    var INVALID_CHARACTER_ERR       = ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
    var NO_DATA_ALLOWED_ERR         = ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
    var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
    var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
    var NOT_SUPPORTED_ERR           = ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
    var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
    //level2
    var INVALID_STATE_ERR        	= ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
    var SYNTAX_ERR               	= ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
    var INVALID_MODIFICATION_ERR 	= ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
    var NAMESPACE_ERR            	= ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
    var INVALID_ACCESS_ERR       	= ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);

    /**
     * DOM Level 2
     * Object DOMException
     * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
     * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
     */
    function DOMException(code, message) {
    	if(message instanceof Error){
    		var error = message;
    	}else {
    		error = this;
    		Error.call(this, ExceptionMessage[code]);
    		this.message = ExceptionMessage[code];
    		if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
    	}
    	error.code = code;
    	if(message) this.message = this.message + ": " + message;
    	return error;
    };
    DOMException.prototype = Error.prototype;
    copy(ExceptionCode,DOMException);

    /**
     * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
     * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
     * The items in the NodeList are accessible via an integral index, starting from 0.
     */
    function NodeList() {
    };
    NodeList.prototype = {
    	/**
    	 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
    	 * @standard level1
    	 */
    	length:0,
    	/**
    	 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
    	 * @standard level1
    	 * @param index  unsigned long
    	 *   Index into the collection.
    	 * @return Node
    	 * 	The node at the indexth position in the NodeList, or null if that is not a valid index.
    	 */
    	item: function(index) {
    		return this[index] || null;
    	},
    	toString:function(isHTML,nodeFilter){
    		for(var buf = [], i = 0;i<this.length;i++){
    			serializeToString(this[i],buf,isHTML,nodeFilter);
    		}
    		return buf.join('');
    	},
    	/**
    	 * @private
    	 * @param {function (Node):boolean} predicate
    	 * @returns {Node[]}
    	 */
    	filter: function (predicate) {
    		return Array.prototype.filter.call(this, predicate);
    	},
    	/**
    	 * @private
    	 * @param {Node} item
    	 * @returns {number}
    	 */
    	indexOf: function (item) {
    		return Array.prototype.indexOf.call(this, item);
    	},
    };

    function LiveNodeList(node,refresh){
    	this._node = node;
    	this._refresh = refresh;
    	_updateLiveList(this);
    }
    function _updateLiveList(list){
    	var inc = list._node._inc || list._node.ownerDocument._inc;
    	if(list._inc != inc){
    		var ls = list._refresh(list._node);
    		//console.log(ls.length)
    		__set__(list,'length',ls.length);
    		copy(ls,list);
    		list._inc = inc;
    	}
    }
    LiveNodeList.prototype.item = function(i){
    	_updateLiveList(this);
    	return this[i];
    };

    _extends(LiveNodeList,NodeList);

    /**
     * Objects implementing the NamedNodeMap interface are used
     * to represent collections of nodes that can be accessed by name.
     * Note that NamedNodeMap does not inherit from NodeList;
     * NamedNodeMaps are not maintained in any particular order.
     * Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index,
     * but this is simply to allow convenient enumeration of the contents of a NamedNodeMap,
     * and does not imply that the DOM specifies an order to these Nodes.
     * NamedNodeMap objects in the DOM are live.
     * used for attributes or DocumentType entities
     */
    function NamedNodeMap() {
    };

    function _findNodeIndex(list,node){
    	var i = list.length;
    	while(i--){
    		if(list[i] === node){return i}
    	}
    }

    function _addNamedNode(el,list,newAttr,oldAttr){
    	if(oldAttr){
    		list[_findNodeIndex(list,oldAttr)] = newAttr;
    	}else {
    		list[list.length++] = newAttr;
    	}
    	if(el){
    		newAttr.ownerElement = el;
    		var doc = el.ownerDocument;
    		if(doc){
    			oldAttr && _onRemoveAttribute(doc,el,oldAttr);
    			_onAddAttribute(doc,el,newAttr);
    		}
    	}
    }
    function _removeNamedNode(el,list,attr){
    	//console.log('remove attr:'+attr)
    	var i = _findNodeIndex(list,attr);
    	if(i>=0){
    		var lastIndex = list.length-1;
    		while(i<lastIndex){
    			list[i] = list[++i];
    		}
    		list.length = lastIndex;
    		if(el){
    			var doc = el.ownerDocument;
    			if(doc){
    				_onRemoveAttribute(doc,el,attr);
    				attr.ownerElement = null;
    			}
    		}
    	}else {
    		throw new DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
    	}
    }
    NamedNodeMap.prototype = {
    	length:0,
    	item:NodeList.prototype.item,
    	getNamedItem: function(key) {
    //		if(key.indexOf(':')>0 || key == 'xmlns'){
    //			return null;
    //		}
    		//console.log()
    		var i = this.length;
    		while(i--){
    			var attr = this[i];
    			//console.log(attr.nodeName,key)
    			if(attr.nodeName == key){
    				return attr;
    			}
    		}
    	},
    	setNamedItem: function(attr) {
    		var el = attr.ownerElement;
    		if(el && el!=this._ownerElement){
    			throw new DOMException(INUSE_ATTRIBUTE_ERR);
    		}
    		var oldAttr = this.getNamedItem(attr.nodeName);
    		_addNamedNode(this._ownerElement,this,attr,oldAttr);
    		return oldAttr;
    	},
    	/* returns Node */
    	setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
    		var el = attr.ownerElement, oldAttr;
    		if(el && el!=this._ownerElement){
    			throw new DOMException(INUSE_ATTRIBUTE_ERR);
    		}
    		oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
    		_addNamedNode(this._ownerElement,this,attr,oldAttr);
    		return oldAttr;
    	},

    	/* returns Node */
    	removeNamedItem: function(key) {
    		var attr = this.getNamedItem(key);
    		_removeNamedNode(this._ownerElement,this,attr);
    		return attr;


    	},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR

    	//for level2
    	removeNamedItemNS:function(namespaceURI,localName){
    		var attr = this.getNamedItemNS(namespaceURI,localName);
    		_removeNamedNode(this._ownerElement,this,attr);
    		return attr;
    	},
    	getNamedItemNS: function(namespaceURI, localName) {
    		var i = this.length;
    		while(i--){
    			var node = this[i];
    			if(node.localName == localName && node.namespaceURI == namespaceURI){
    				return node;
    			}
    		}
    		return null;
    	}
    };

    /**
     * The DOMImplementation interface represents an object providing methods
     * which are not dependent on any particular document.
     * Such an object is returned by the `Document.implementation` property.
     *
     * __The individual methods describe the differences compared to the specs.__
     *
     * @constructor
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation MDN
     * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490 DOM Level 1 Core (Initial)
     * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-102161490 DOM Level 2 Core
     * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-102161490 DOM Level 3 Core
     * @see https://dom.spec.whatwg.org/#domimplementation DOM Living Standard
     */
    function DOMImplementation$2() {
    }

    DOMImplementation$2.prototype = {
    	/**
    	 * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given feature is supported.
    	 * The different implementations fairly diverged in what kind of features were reported.
    	 * The latest version of the spec settled to force this method to always return true, where the functionality was accurate and in use.
    	 *
    	 * @deprecated It is deprecated and modern browsers return true in all cases.
    	 *
    	 * @param {string} feature
    	 * @param {string} [version]
    	 * @returns {boolean} always true
    	 *
    	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
    	 * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
    	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
    	 */
    	hasFeature: function(feature, version) {
    			return true;
    	},
    	/**
    	 * Creates an XML Document object of the specified type with its document element.
    	 *
    	 * __It behaves slightly different from the description in the living standard__:
    	 * - There is no interface/class `XMLDocument`, it returns a `Document` instance.
    	 * - `contentType`, `encoding`, `mode`, `origin`, `url` fields are currently not declared.
    	 * - this implementation is not validating names or qualified names
    	 *   (when parsing XML strings, the SAX parser takes care of that)
    	 *
    	 * @param {string|null} namespaceURI
    	 * @param {string} qualifiedName
    	 * @param {DocumentType=null} doctype
    	 * @returns {Document}
    	 *
    	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
    	 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM Level 2 Core (initial)
    	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument  DOM Level 2 Core
    	 *
    	 * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
    	 * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
    	 * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
    	 */
    	createDocument: function(namespaceURI,  qualifiedName, doctype){
    		var doc = new Document();
    		doc.implementation = this;
    		doc.childNodes = new NodeList();
    		doc.doctype = doctype || null;
    		if (doctype){
    			doc.appendChild(doctype);
    		}
    		if (qualifiedName){
    			var root = doc.createElementNS(namespaceURI, qualifiedName);
    			doc.appendChild(root);
    		}
    		return doc;
    	},
    	/**
    	 * Returns a doctype, with the given `qualifiedName`, `publicId`, and `systemId`.
    	 *
    	 * __This behavior is slightly different from the in the specs__:
    	 * - this implementation is not validating names or qualified names
    	 *   (when parsing XML strings, the SAX parser takes care of that)
    	 *
    	 * @param {string} qualifiedName
    	 * @param {string} [publicId]
    	 * @param {string} [systemId]
    	 * @returns {DocumentType} which can either be used with `DOMImplementation.createDocument` upon document creation
    	 * 				  or can be put into the document via methods like `Node.insertBefore()` or `Node.replaceChild()`
    	 *
    	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType MDN
    	 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM Level 2 Core
    	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living Standard
    	 *
    	 * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
    	 * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
    	 * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
    	 */
    	createDocumentType: function(qualifiedName, publicId, systemId){
    		var node = new DocumentType();
    		node.name = qualifiedName;
    		node.nodeName = qualifiedName;
    		node.publicId = publicId || '';
    		node.systemId = systemId || '';

    		return node;
    	}
    };


    /**
     * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
     */

    function Node() {
    };

    Node.prototype = {
    	firstChild : null,
    	lastChild : null,
    	previousSibling : null,
    	nextSibling : null,
    	attributes : null,
    	parentNode : null,
    	childNodes : null,
    	ownerDocument : null,
    	nodeValue : null,
    	namespaceURI : null,
    	prefix : null,
    	localName : null,
    	// Modified in DOM Level 2:
    	insertBefore:function(newChild, refChild){//raises
    		return _insertBefore(this,newChild,refChild);
    	},
    	replaceChild:function(newChild, oldChild){//raises
    		_insertBefore(this, newChild,oldChild, assertPreReplacementValidityInDocument);
    		if(oldChild){
    			this.removeChild(oldChild);
    		}
    	},
    	removeChild:function(oldChild){
    		return _removeChild(this,oldChild);
    	},
    	appendChild:function(newChild){
    		return this.insertBefore(newChild,null);
    	},
    	hasChildNodes:function(){
    		return this.firstChild != null;
    	},
    	cloneNode:function(deep){
    		return cloneNode(this.ownerDocument||this,this,deep);
    	},
    	// Modified in DOM Level 2:
    	normalize:function(){
    		var child = this.firstChild;
    		while(child){
    			var next = child.nextSibling;
    			if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
    				this.removeChild(next);
    				child.appendData(next.data);
    			}else {
    				child.normalize();
    				child = next;
    			}
    		}
    	},
      	// Introduced in DOM Level 2:
    	isSupported:function(feature, version){
    		return this.ownerDocument.implementation.hasFeature(feature,version);
    	},
        // Introduced in DOM Level 2:
        hasAttributes:function(){
        	return this.attributes.length>0;
        },
    	/**
    	 * Look up the prefix associated to the given namespace URI, starting from this node.
    	 * **The default namespace declarations are ignored by this method.**
    	 * See Namespace Prefix Lookup for details on the algorithm used by this method.
    	 *
    	 * _Note: The implementation seems to be incomplete when compared to the algorithm described in the specs._
    	 *
    	 * @param {string | null} namespaceURI
    	 * @returns {string | null}
    	 * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
    	 * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
    	 * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
    	 * @see https://github.com/xmldom/xmldom/issues/322
    	 */
        lookupPrefix:function(namespaceURI){
        	var el = this;
        	while(el){
        		var map = el._nsMap;
        		//console.dir(map)
        		if(map){
        			for(var n in map){
    						if (Object.prototype.hasOwnProperty.call(map, n) && map[n] === namespaceURI) {
    							return n;
    						}
        			}
        		}
        		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
        	}
        	return null;
        },
        // Introduced in DOM Level 3:
        lookupNamespaceURI:function(prefix){
        	var el = this;
        	while(el){
        		var map = el._nsMap;
        		//console.dir(map)
        		if(map){
        			if(Object.prototype.hasOwnProperty.call(map, prefix)){
        				return map[prefix] ;
        			}
        		}
        		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
        	}
        	return null;
        },
        // Introduced in DOM Level 3:
        isDefaultNamespace:function(namespaceURI){
        	var prefix = this.lookupPrefix(namespaceURI);
        	return prefix == null;
        }
    };


    function _xmlEncoder(c){
    	return c == '<' && '&lt;' ||
             c == '>' && '&gt;' ||
             c == '&' && '&amp;' ||
             c == '"' && '&quot;' ||
             '&#'+c.charCodeAt()+';'
    }


    copy(NodeType,Node);
    copy(NodeType,Node.prototype);

    /**
     * @param callback return true for continue,false for break
     * @return boolean true: break visit;
     */
    function _visitNode(node,callback){
    	if(callback(node)){
    		return true;
    	}
    	if(node = node.firstChild){
    		do{
    			if(_visitNode(node,callback)){return true}
            }while(node=node.nextSibling)
        }
    }



    function Document(){
    	this.ownerDocument = this;
    }

    function _onAddAttribute(doc,el,newAttr){
    	doc && doc._inc++;
    	var ns = newAttr.namespaceURI ;
    	if(ns === NAMESPACE$2.XMLNS){
    		//update namespace
    		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value;
    	}
    }

    function _onRemoveAttribute(doc,el,newAttr,remove){
    	doc && doc._inc++;
    	var ns = newAttr.namespaceURI ;
    	if(ns === NAMESPACE$2.XMLNS){
    		//update namespace
    		delete el._nsMap[newAttr.prefix?newAttr.localName:''];
    	}
    }

    /**
     * Updates `el.childNodes`, updating the indexed items and it's `length`.
     * Passing `newChild` means it will be appended.
     * Otherwise it's assumed that an item has been removed,
     * and `el.firstNode` and it's `.nextSibling` are used
     * to walk the current list of child nodes.
     *
     * @param {Document} doc
     * @param {Node} el
     * @param {Node} [newChild]
     * @private
     */
    function _onUpdateChild (doc, el, newChild) {
    	if(doc && doc._inc){
    		doc._inc++;
    		//update childNodes
    		var cs = el.childNodes;
    		if (newChild) {
    			cs[cs.length++] = newChild;
    		} else {
    			var child = el.firstChild;
    			var i = 0;
    			while (child) {
    				cs[i++] = child;
    				child = child.nextSibling;
    			}
    			cs.length = i;
    			delete cs[cs.length];
    		}
    	}
    }

    /**
     * Removes the connections between `parentNode` and `child`
     * and any existing `child.previousSibling` or `child.nextSibling`.
     *
     * @see https://github.com/xmldom/xmldom/issues/135
     * @see https://github.com/xmldom/xmldom/issues/145
     *
     * @param {Node} parentNode
     * @param {Node} child
     * @returns {Node} the child that was removed.
     * @private
     */
    function _removeChild (parentNode, child) {
    	var previous = child.previousSibling;
    	var next = child.nextSibling;
    	if (previous) {
    		previous.nextSibling = next;
    	} else {
    		parentNode.firstChild = next;
    	}
    	if (next) {
    		next.previousSibling = previous;
    	} else {
    		parentNode.lastChild = previous;
    	}
    	child.parentNode = null;
    	child.previousSibling = null;
    	child.nextSibling = null;
    	_onUpdateChild(parentNode.ownerDocument, parentNode);
    	return child;
    }

    /**
     * Returns `true` if `node` can be a parent for insertion.
     * @param {Node} node
     * @returns {boolean}
     */
    function hasValidParentNodeType(node) {
    	return (
    		node &&
    		(node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.ELEMENT_NODE)
    	);
    }

    /**
     * Returns `true` if `node` can be inserted according to it's `nodeType`.
     * @param {Node} node
     * @returns {boolean}
     */
    function hasInsertableNodeType(node) {
    	return (
    		node &&
    		(isElementNode(node) ||
    			isTextNode(node) ||
    			isDocTypeNode(node) ||
    			node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ||
    			node.nodeType === Node.COMMENT_NODE ||
    			node.nodeType === Node.PROCESSING_INSTRUCTION_NODE)
    	);
    }

    /**
     * Returns true if `node` is a DOCTYPE node
     * @param {Node} node
     * @returns {boolean}
     */
    function isDocTypeNode(node) {
    	return node && node.nodeType === Node.DOCUMENT_TYPE_NODE;
    }

    /**
     * Returns true if the node is an element
     * @param {Node} node
     * @returns {boolean}
     */
    function isElementNode(node) {
    	return node && node.nodeType === Node.ELEMENT_NODE;
    }
    /**
     * Returns true if `node` is a text node
     * @param {Node} node
     * @returns {boolean}
     */
    function isTextNode(node) {
    	return node && node.nodeType === Node.TEXT_NODE;
    }

    /**
     * Check if en element node can be inserted before `child`, or at the end if child is falsy,
     * according to the presence and position of a doctype node on the same level.
     *
     * @param {Document} doc The document node
     * @param {Node} child the node that would become the nextSibling if the element would be inserted
     * @returns {boolean} `true` if an element can be inserted before child
     * @private
     * https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
     */
    function isElementInsertionPossible(doc, child) {
    	var parentChildNodes = doc.childNodes || [];
    	if (find(parentChildNodes, isElementNode) || isDocTypeNode(child)) {
    		return false;
    	}
    	var docTypeNode = find(parentChildNodes, isDocTypeNode);
    	return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
    }

    /**
     * Check if en element node can be inserted before `child`, or at the end if child is falsy,
     * according to the presence and position of a doctype node on the same level.
     *
     * @param {Node} doc The document node
     * @param {Node} child the node that would become the nextSibling if the element would be inserted
     * @returns {boolean} `true` if an element can be inserted before child
     * @private
     * https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
     */
    function isElementReplacementPossible(doc, child) {
    	var parentChildNodes = doc.childNodes || [];

    	function hasElementChildThatIsNotChild(node) {
    		return isElementNode(node) && node !== child;
    	}

    	if (find(parentChildNodes, hasElementChildThatIsNotChild)) {
    		return false;
    	}
    	var docTypeNode = find(parentChildNodes, isDocTypeNode);
    	return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
    }

    /**
     * @private
     * Steps 1-5 of the checks before inserting and before replacing a child are the same.
     *
     * @param {Node} parent the parent node to insert `node` into
     * @param {Node} node the node to insert
     * @param {Node=} child the node that should become the `nextSibling` of `node`
     * @returns {Node}
     * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
     * @throws DOMException if `child` is provided but is not a child of `parent`.
     * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
     * @see https://dom.spec.whatwg.org/#concept-node-replace
     */
    function assertPreInsertionValidity1to5(parent, node, child) {
    	// 1. If `parent` is not a Document, DocumentFragment, or Element node, then throw a "HierarchyRequestError" DOMException.
    	if (!hasValidParentNodeType(parent)) {
    		throw new DOMException(HIERARCHY_REQUEST_ERR, 'Unexpected parent node type ' + parent.nodeType);
    	}
    	// 2. If `node` is a host-including inclusive ancestor of `parent`, then throw a "HierarchyRequestError" DOMException.
    	// not implemented!
    	// 3. If `child` is non-null and its parent is not `parent`, then throw a "NotFoundError" DOMException.
    	if (child && child.parentNode !== parent) {
    		throw new DOMException(NOT_FOUND_ERR, 'child not in parent');
    	}
    	if (
    		// 4. If `node` is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
    		!hasInsertableNodeType(node) ||
    		// 5. If either `node` is a Text node and `parent` is a document,
    		// the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
    		// || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
    		// or `node` is a doctype and `parent` is not a document, then throw a "HierarchyRequestError" DOMException.
    		(isDocTypeNode(node) && parent.nodeType !== Node.DOCUMENT_NODE)
    	) {
    		throw new DOMException(
    			HIERARCHY_REQUEST_ERR,
    			'Unexpected node type ' + node.nodeType + ' for parent node type ' + parent.nodeType
    		);
    	}
    }

    /**
     * @private
     * Step 6 of the checks before inserting and before replacing a child are different.
     *
     * @param {Document} parent the parent node to insert `node` into
     * @param {Node} node the node to insert
     * @param {Node | undefined} child the node that should become the `nextSibling` of `node`
     * @returns {Node}
     * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
     * @throws DOMException if `child` is provided but is not a child of `parent`.
     * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
     * @see https://dom.spec.whatwg.org/#concept-node-replace
     */
    function assertPreInsertionValidityInDocument(parent, node, child) {
    	var parentChildNodes = parent.childNodes || [];
    	var nodeChildNodes = node.childNodes || [];

    	// DocumentFragment
    	if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    		var nodeChildElements = nodeChildNodes.filter(isElementNode);
    		// If node has more than one element child or has a Text node child.
    		if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
    			throw new DOMException(HIERARCHY_REQUEST_ERR, 'More than one element or text in fragment');
    		}
    		// Otherwise, if `node` has one element child and either `parent` has an element child,
    		// `child` is a doctype, or `child` is non-null and a doctype is following `child`.
    		if (nodeChildElements.length === 1 && !isElementInsertionPossible(parent, child)) {
    			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Element in fragment can not be inserted before doctype');
    		}
    	}
    	// Element
    	if (isElementNode(node)) {
    		// `parent` has an element child, `child` is a doctype,
    		// or `child` is non-null and a doctype is following `child`.
    		if (!isElementInsertionPossible(parent, child)) {
    			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one element can be added and only after doctype');
    		}
    	}
    	// DocumentType
    	if (isDocTypeNode(node)) {
    		// `parent` has a doctype child,
    		if (find(parentChildNodes, isDocTypeNode)) {
    			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one doctype is allowed');
    		}
    		var parentElementChild = find(parentChildNodes, isElementNode);
    		// `child` is non-null and an element is preceding `child`,
    		if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
    			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can only be inserted before an element');
    		}
    		// or `child` is null and `parent` has an element child.
    		if (!child && parentElementChild) {
    			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can not be appended since element is present');
    		}
    	}
    }

    /**
     * @private
     * Step 6 of the checks before inserting and before replacing a child are different.
     *
     * @param {Document} parent the parent node to insert `node` into
     * @param {Node} node the node to insert
     * @param {Node | undefined} child the node that should become the `nextSibling` of `node`
     * @returns {Node}
     * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
     * @throws DOMException if `child` is provided but is not a child of `parent`.
     * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
     * @see https://dom.spec.whatwg.org/#concept-node-replace
     */
    function assertPreReplacementValidityInDocument(parent, node, child) {
    	var parentChildNodes = parent.childNodes || [];
    	var nodeChildNodes = node.childNodes || [];

    	// DocumentFragment
    	if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    		var nodeChildElements = nodeChildNodes.filter(isElementNode);
    		// If `node` has more than one element child or has a Text node child.
    		if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
    			throw new DOMException(HIERARCHY_REQUEST_ERR, 'More than one element or text in fragment');
    		}
    		// Otherwise, if `node` has one element child and either `parent` has an element child that is not `child` or a doctype is following `child`.
    		if (nodeChildElements.length === 1 && !isElementReplacementPossible(parent, child)) {
    			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Element in fragment can not be inserted before doctype');
    		}
    	}
    	// Element
    	if (isElementNode(node)) {
    		// `parent` has an element child that is not `child` or a doctype is following `child`.
    		if (!isElementReplacementPossible(parent, child)) {
    			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one element can be added and only after doctype');
    		}
    	}
    	// DocumentType
    	if (isDocTypeNode(node)) {
    		function hasDoctypeChildThatIsNotChild(node) {
    			return isDocTypeNode(node) && node !== child;
    		}

    		// `parent` has a doctype child that is not `child`,
    		if (find(parentChildNodes, hasDoctypeChildThatIsNotChild)) {
    			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one doctype is allowed');
    		}
    		var parentElementChild = find(parentChildNodes, isElementNode);
    		// or an element is preceding `child`.
    		if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
    			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can only be inserted before an element');
    		}
    	}
    }

    /**
     * @private
     * @param {Node} parent the parent node to insert `node` into
     * @param {Node} node the node to insert
     * @param {Node=} child the node that should become the `nextSibling` of `node`
     * @returns {Node}
     * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
     * @throws DOMException if `child` is provided but is not a child of `parent`.
     * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
     */
    function _insertBefore(parent, node, child, _inDocumentAssertion) {
    	// To ensure pre-insertion validity of a node into a parent before a child, run these steps:
    	assertPreInsertionValidity1to5(parent, node, child);

    	// If parent is a document, and any of the statements below, switched on the interface node implements,
    	// are true, then throw a "HierarchyRequestError" DOMException.
    	if (parent.nodeType === Node.DOCUMENT_NODE) {
    		(_inDocumentAssertion || assertPreInsertionValidityInDocument)(parent, node, child);
    	}

    	var cp = node.parentNode;
    	if(cp){
    		cp.removeChild(node);//remove and update
    	}
    	if(node.nodeType === DOCUMENT_FRAGMENT_NODE){
    		var newFirst = node.firstChild;
    		if (newFirst == null) {
    			return node;
    		}
    		var newLast = node.lastChild;
    	}else {
    		newFirst = newLast = node;
    	}
    	var pre = child ? child.previousSibling : parent.lastChild;

    	newFirst.previousSibling = pre;
    	newLast.nextSibling = child;


    	if(pre){
    		pre.nextSibling = newFirst;
    	}else {
    		parent.firstChild = newFirst;
    	}
    	if(child == null){
    		parent.lastChild = newLast;
    	}else {
    		child.previousSibling = newLast;
    	}
    	do{
    		newFirst.parentNode = parent;
    	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
    	_onUpdateChild(parent.ownerDocument||parent, parent);
    	//console.log(parent.lastChild.nextSibling == null)
    	if (node.nodeType == DOCUMENT_FRAGMENT_NODE) {
    		node.firstChild = node.lastChild = null;
    	}
    	return node;
    }

    /**
     * Appends `newChild` to `parentNode`.
     * If `newChild` is already connected to a `parentNode` it is first removed from it.
     *
     * @see https://github.com/xmldom/xmldom/issues/135
     * @see https://github.com/xmldom/xmldom/issues/145
     * @param {Node} parentNode
     * @param {Node} newChild
     * @returns {Node}
     * @private
     */
    function _appendSingleChild (parentNode, newChild) {
    	if (newChild.parentNode) {
    		newChild.parentNode.removeChild(newChild);
    	}
    	newChild.parentNode = parentNode;
    	newChild.previousSibling = parentNode.lastChild;
    	newChild.nextSibling = null;
    	if (newChild.previousSibling) {
    		newChild.previousSibling.nextSibling = newChild;
    	} else {
    		parentNode.firstChild = newChild;
    	}
    	parentNode.lastChild = newChild;
    	_onUpdateChild(parentNode.ownerDocument, parentNode, newChild);
    	return newChild;
    }

    Document.prototype = {
    	//implementation : null,
    	nodeName :  '#document',
    	nodeType :  DOCUMENT_NODE,
    	/**
    	 * The DocumentType node of the document.
    	 *
    	 * @readonly
    	 * @type DocumentType
    	 */
    	doctype :  null,
    	documentElement :  null,
    	_inc : 1,

    	insertBefore :  function(newChild, refChild){//raises
    		if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
    			var child = newChild.firstChild;
    			while(child){
    				var next = child.nextSibling;
    				this.insertBefore(child,refChild);
    				child = next;
    			}
    			return newChild;
    		}
    		_insertBefore(this, newChild, refChild);
    		newChild.ownerDocument = this;
    		if (this.documentElement === null && newChild.nodeType === ELEMENT_NODE) {
    			this.documentElement = newChild;
    		}

    		return newChild;
    	},
    	removeChild :  function(oldChild){
    		if(this.documentElement == oldChild){
    			this.documentElement = null;
    		}
    		return _removeChild(this,oldChild);
    	},
    	replaceChild: function (newChild, oldChild) {
    		//raises
    		_insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
    		newChild.ownerDocument = this;
    		if (oldChild) {
    			this.removeChild(oldChild);
    		}
    		if (isElementNode(newChild)) {
    			this.documentElement = newChild;
    		}
    	},
    	// Introduced in DOM Level 2:
    	importNode : function(importedNode,deep){
    		return importNode(this,importedNode,deep);
    	},
    	// Introduced in DOM Level 2:
    	getElementById :	function(id){
    		var rtv = null;
    		_visitNode(this.documentElement,function(node){
    			if(node.nodeType == ELEMENT_NODE){
    				if(node.getAttribute('id') == id){
    					rtv = node;
    					return true;
    				}
    			}
    		});
    		return rtv;
    	},

    	/**
    	 * The `getElementsByClassName` method of `Document` interface returns an array-like object
    	 * of all child elements which have **all** of the given class name(s).
    	 *
    	 * Returns an empty list if `classeNames` is an empty string or only contains HTML white space characters.
    	 *
    	 *
    	 * Warning: This is a live LiveNodeList.
    	 * Changes in the DOM will reflect in the array as the changes occur.
    	 * If an element selected by this array no longer qualifies for the selector,
    	 * it will automatically be removed. Be aware of this for iteration purposes.
    	 *
    	 * @param {string} classNames is a string representing the class name(s) to match; multiple class names are separated by (ASCII-)whitespace
    	 *
    	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
    	 * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
    	 */
    	getElementsByClassName: function(classNames) {
    		var classNamesSet = toOrderedSet(classNames);
    		return new LiveNodeList(this, function(base) {
    			var ls = [];
    			if (classNamesSet.length > 0) {
    				_visitNode(base.documentElement, function(node) {
    					if(node !== base && node.nodeType === ELEMENT_NODE) {
    						var nodeClassNames = node.getAttribute('class');
    						// can be null if the attribute does not exist
    						if (nodeClassNames) {
    							// before splitting and iterating just compare them for the most common case
    							var matches = classNames === nodeClassNames;
    							if (!matches) {
    								var nodeClassNamesSet = toOrderedSet(nodeClassNames);
    								matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet));
    							}
    							if(matches) {
    								ls.push(node);
    							}
    						}
    					}
    				});
    			}
    			return ls;
    		});
    	},

    	//document factory method:
    	createElement :	function(tagName){
    		var node = new Element();
    		node.ownerDocument = this;
    		node.nodeName = tagName;
    		node.tagName = tagName;
    		node.localName = tagName;
    		node.childNodes = new NodeList();
    		var attrs	= node.attributes = new NamedNodeMap();
    		attrs._ownerElement = node;
    		return node;
    	},
    	createDocumentFragment :	function(){
    		var node = new DocumentFragment();
    		node.ownerDocument = this;
    		node.childNodes = new NodeList();
    		return node;
    	},
    	createTextNode :	function(data){
    		var node = new Text();
    		node.ownerDocument = this;
    		node.appendData(data);
    		return node;
    	},
    	createComment :	function(data){
    		var node = new Comment();
    		node.ownerDocument = this;
    		node.appendData(data);
    		return node;
    	},
    	createCDATASection :	function(data){
    		var node = new CDATASection();
    		node.ownerDocument = this;
    		node.appendData(data);
    		return node;
    	},
    	createProcessingInstruction :	function(target,data){
    		var node = new ProcessingInstruction();
    		node.ownerDocument = this;
    		node.tagName = node.target = target;
    		node.nodeValue= node.data = data;
    		return node;
    	},
    	createAttribute :	function(name){
    		var node = new Attr();
    		node.ownerDocument	= this;
    		node.name = name;
    		node.nodeName	= name;
    		node.localName = name;
    		node.specified = true;
    		return node;
    	},
    	createEntityReference :	function(name){
    		var node = new EntityReference();
    		node.ownerDocument	= this;
    		node.nodeName	= name;
    		return node;
    	},
    	// Introduced in DOM Level 2:
    	createElementNS :	function(namespaceURI,qualifiedName){
    		var node = new Element();
    		var pl = qualifiedName.split(':');
    		var attrs	= node.attributes = new NamedNodeMap();
    		node.childNodes = new NodeList();
    		node.ownerDocument = this;
    		node.nodeName = qualifiedName;
    		node.tagName = qualifiedName;
    		node.namespaceURI = namespaceURI;
    		if(pl.length == 2){
    			node.prefix = pl[0];
    			node.localName = pl[1];
    		}else {
    			//el.prefix = null;
    			node.localName = qualifiedName;
    		}
    		attrs._ownerElement = node;
    		return node;
    	},
    	// Introduced in DOM Level 2:
    	createAttributeNS :	function(namespaceURI,qualifiedName){
    		var node = new Attr();
    		var pl = qualifiedName.split(':');
    		node.ownerDocument = this;
    		node.nodeName = qualifiedName;
    		node.name = qualifiedName;
    		node.namespaceURI = namespaceURI;
    		node.specified = true;
    		if(pl.length == 2){
    			node.prefix = pl[0];
    			node.localName = pl[1];
    		}else {
    			//el.prefix = null;
    			node.localName = qualifiedName;
    		}
    		return node;
    	}
    };
    _extends(Document,Node);


    function Element() {
    	this._nsMap = {};
    };
    Element.prototype = {
    	nodeType : ELEMENT_NODE,
    	hasAttribute : function(name){
    		return this.getAttributeNode(name)!=null;
    	},
    	getAttribute : function(name){
    		var attr = this.getAttributeNode(name);
    		return attr && attr.value || '';
    	},
    	getAttributeNode : function(name){
    		return this.attributes.getNamedItem(name);
    	},
    	setAttribute : function(name, value){
    		var attr = this.ownerDocument.createAttribute(name);
    		attr.value = attr.nodeValue = "" + value;
    		this.setAttributeNode(attr);
    	},
    	removeAttribute : function(name){
    		var attr = this.getAttributeNode(name);
    		attr && this.removeAttributeNode(attr);
    	},

    	//four real opeartion method
    	appendChild:function(newChild){
    		if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
    			return this.insertBefore(newChild,null);
    		}else {
    			return _appendSingleChild(this,newChild);
    		}
    	},
    	setAttributeNode : function(newAttr){
    		return this.attributes.setNamedItem(newAttr);
    	},
    	setAttributeNodeNS : function(newAttr){
    		return this.attributes.setNamedItemNS(newAttr);
    	},
    	removeAttributeNode : function(oldAttr){
    		//console.log(this == oldAttr.ownerElement)
    		return this.attributes.removeNamedItem(oldAttr.nodeName);
    	},
    	//get real attribute name,and remove it by removeAttributeNode
    	removeAttributeNS : function(namespaceURI, localName){
    		var old = this.getAttributeNodeNS(namespaceURI, localName);
    		old && this.removeAttributeNode(old);
    	},

    	hasAttributeNS : function(namespaceURI, localName){
    		return this.getAttributeNodeNS(namespaceURI, localName)!=null;
    	},
    	getAttributeNS : function(namespaceURI, localName){
    		var attr = this.getAttributeNodeNS(namespaceURI, localName);
    		return attr && attr.value || '';
    	},
    	setAttributeNS : function(namespaceURI, qualifiedName, value){
    		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
    		attr.value = attr.nodeValue = "" + value;
    		this.setAttributeNode(attr);
    	},
    	getAttributeNodeNS : function(namespaceURI, localName){
    		return this.attributes.getNamedItemNS(namespaceURI, localName);
    	},

    	getElementsByTagName : function(tagName){
    		return new LiveNodeList(this,function(base){
    			var ls = [];
    			_visitNode(base,function(node){
    				if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
    					ls.push(node);
    				}
    			});
    			return ls;
    		});
    	},
    	getElementsByTagNameNS : function(namespaceURI, localName){
    		return new LiveNodeList(this,function(base){
    			var ls = [];
    			_visitNode(base,function(node){
    				if(node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)){
    					ls.push(node);
    				}
    			});
    			return ls;

    		});
    	}
    };
    Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
    Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


    _extends(Element,Node);
    function Attr() {
    };
    Attr.prototype.nodeType = ATTRIBUTE_NODE;
    _extends(Attr,Node);


    function CharacterData() {
    };
    CharacterData.prototype = {
    	data : '',
    	substringData : function(offset, count) {
    		return this.data.substring(offset, offset+count);
    	},
    	appendData: function(text) {
    		text = this.data+text;
    		this.nodeValue = this.data = text;
    		this.length = text.length;
    	},
    	insertData: function(offset,text) {
    		this.replaceData(offset,0,text);

    	},
    	appendChild:function(newChild){
    		throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR])
    	},
    	deleteData: function(offset, count) {
    		this.replaceData(offset,count,"");
    	},
    	replaceData: function(offset, count, text) {
    		var start = this.data.substring(0,offset);
    		var end = this.data.substring(offset+count);
    		text = start + text + end;
    		this.nodeValue = this.data = text;
    		this.length = text.length;
    	}
    };
    _extends(CharacterData,Node);
    function Text() {
    };
    Text.prototype = {
    	nodeName : "#text",
    	nodeType : TEXT_NODE,
    	splitText : function(offset) {
    		var text = this.data;
    		var newText = text.substring(offset);
    		text = text.substring(0, offset);
    		this.data = this.nodeValue = text;
    		this.length = text.length;
    		var newNode = this.ownerDocument.createTextNode(newText);
    		if(this.parentNode){
    			this.parentNode.insertBefore(newNode, this.nextSibling);
    		}
    		return newNode;
    	}
    };
    _extends(Text,CharacterData);
    function Comment() {
    };
    Comment.prototype = {
    	nodeName : "#comment",
    	nodeType : COMMENT_NODE
    };
    _extends(Comment,CharacterData);

    function CDATASection() {
    };
    CDATASection.prototype = {
    	nodeName : "#cdata-section",
    	nodeType : CDATA_SECTION_NODE
    };
    _extends(CDATASection,CharacterData);


    function DocumentType() {
    };
    DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
    _extends(DocumentType,Node);

    function Notation() {
    };
    Notation.prototype.nodeType = NOTATION_NODE;
    _extends(Notation,Node);

    function Entity() {
    };
    Entity.prototype.nodeType = ENTITY_NODE;
    _extends(Entity,Node);

    function EntityReference() {
    };
    EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
    _extends(EntityReference,Node);

    function DocumentFragment() {
    };
    DocumentFragment.prototype.nodeName =	"#document-fragment";
    DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
    _extends(DocumentFragment,Node);


    function ProcessingInstruction() {
    }
    ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
    _extends(ProcessingInstruction,Node);
    function XMLSerializer$1(){}
    XMLSerializer$1.prototype.serializeToString = function(node,isHtml,nodeFilter){
    	return nodeSerializeToString.call(node,isHtml,nodeFilter);
    };
    Node.prototype.toString = nodeSerializeToString;
    function nodeSerializeToString(isHtml,nodeFilter){
    	var buf = [];
    	var refNode = this.nodeType == 9 && this.documentElement || this;
    	var prefix = refNode.prefix;
    	var uri = refNode.namespaceURI;

    	if(uri && prefix == null){
    		//console.log(prefix)
    		var prefix = refNode.lookupPrefix(uri);
    		if(prefix == null){
    			//isHTML = true;
    			var visibleNamespaces=[
    			{namespace:uri,prefix:null}
    			//{namespace:uri,prefix:''}
    			];
    		}
    	}
    	serializeToString(this,buf,isHtml,nodeFilter,visibleNamespaces);
    	//console.log('###',this.nodeType,uri,prefix,buf.join(''))
    	return buf.join('');
    }

    function needNamespaceDefine(node, isHTML, visibleNamespaces) {
    	var prefix = node.prefix || '';
    	var uri = node.namespaceURI;
    	// According to [Namespaces in XML 1.0](https://www.w3.org/TR/REC-xml-names/#ns-using) ,
    	// and more specifically https://www.w3.org/TR/REC-xml-names/#nsc-NoPrefixUndecl :
    	// > In a namespace declaration for a prefix [...], the attribute value MUST NOT be empty.
    	// in a similar manner [Namespaces in XML 1.1](https://www.w3.org/TR/xml-names11/#ns-using)
    	// and more specifically https://www.w3.org/TR/xml-names11/#nsc-NSDeclared :
    	// > [...] Furthermore, the attribute value [...] must not be an empty string.
    	// so serializing empty namespace value like xmlns:ds="" would produce an invalid XML document.
    	if (!uri) {
    		return false;
    	}
    	if (prefix === "xml" && uri === NAMESPACE$2.XML || uri === NAMESPACE$2.XMLNS) {
    		return false;
    	}

    	var i = visibleNamespaces.length;
    	while (i--) {
    		var ns = visibleNamespaces[i];
    		// get namespace prefix
    		if (ns.prefix === prefix) {
    			return ns.namespace !== uri;
    		}
    	}
    	return true;
    }
    /**
     * Well-formed constraint: No < in Attribute Values
     * > The replacement text of any entity referred to directly or indirectly
     * > in an attribute value must not contain a <.
     * @see https://www.w3.org/TR/xml11/#CleanAttrVals
     * @see https://www.w3.org/TR/xml11/#NT-AttValue
     *
     * Literal whitespace other than space that appear in attribute values
     * are serialized as their entity references, so they will be preserved.
     * (In contrast to whitespace literals in the input which are normalized to spaces)
     * @see https://www.w3.org/TR/xml11/#AVNormalize
     * @see https://w3c.github.io/DOM-Parsing/#serializing-an-element-s-attributes
     */
    function addSerializedAttribute(buf, qualifiedName, value) {
    	buf.push(' ', qualifiedName, '="', value.replace(/[<>&"\t\n\r]/g, _xmlEncoder), '"');
    }

    function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
    	if (!visibleNamespaces) {
    		visibleNamespaces = [];
    	}

    	if(nodeFilter){
    		node = nodeFilter(node);
    		if(node){
    			if(typeof node == 'string'){
    				buf.push(node);
    				return;
    			}
    		}else {
    			return;
    		}
    		//buf.sort.apply(attrs, attributeSorter);
    	}

    	switch(node.nodeType){
    	case ELEMENT_NODE:
    		var attrs = node.attributes;
    		var len = attrs.length;
    		var child = node.firstChild;
    		var nodeName = node.tagName;

    		isHTML = NAMESPACE$2.isHTML(node.namespaceURI) || isHTML;

    		var prefixedNodeName = nodeName;
    		if (!isHTML && !node.prefix && node.namespaceURI) {
    			var defaultNS;
    			// lookup current default ns from `xmlns` attribute
    			for (var ai = 0; ai < attrs.length; ai++) {
    				if (attrs.item(ai).name === 'xmlns') {
    					defaultNS = attrs.item(ai).value;
    					break
    				}
    			}
    			if (!defaultNS) {
    				// lookup current default ns in visibleNamespaces
    				for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
    					var namespace = visibleNamespaces[nsi];
    					if (namespace.prefix === '' && namespace.namespace === node.namespaceURI) {
    						defaultNS = namespace.namespace;
    						break
    					}
    				}
    			}
    			if (defaultNS !== node.namespaceURI) {
    				for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
    					var namespace = visibleNamespaces[nsi];
    					if (namespace.namespace === node.namespaceURI) {
    						if (namespace.prefix) {
    							prefixedNodeName = namespace.prefix + ':' + nodeName;
    						}
    						break
    					}
    				}
    			}
    		}

    		buf.push('<', prefixedNodeName);

    		for(var i=0;i<len;i++){
    			// add namespaces for attributes
    			var attr = attrs.item(i);
    			if (attr.prefix == 'xmlns') {
    				visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
    			}else if(attr.nodeName == 'xmlns'){
    				visibleNamespaces.push({ prefix: '', namespace: attr.value });
    			}
    		}

    		for(var i=0;i<len;i++){
    			var attr = attrs.item(i);
    			if (needNamespaceDefine(attr,isHTML, visibleNamespaces)) {
    				var prefix = attr.prefix||'';
    				var uri = attr.namespaceURI;
    				addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : "xmlns", uri);
    				visibleNamespaces.push({ prefix: prefix, namespace:uri });
    			}
    			serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
    		}

    		// add namespace for current node
    		if (nodeName === prefixedNodeName && needNamespaceDefine(node, isHTML, visibleNamespaces)) {
    			var prefix = node.prefix||'';
    			var uri = node.namespaceURI;
    			addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : "xmlns", uri);
    			visibleNamespaces.push({ prefix: prefix, namespace:uri });
    		}

    		if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
    			buf.push('>');
    			//if is cdata child node
    			if(isHTML && /^script$/i.test(nodeName)){
    				while(child){
    					if(child.data){
    						buf.push(child.data);
    					}else {
    						serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
    					}
    					child = child.nextSibling;
    				}
    			}else
    			{
    				while(child){
    					serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
    					child = child.nextSibling;
    				}
    			}
    			buf.push('</',prefixedNodeName,'>');
    		}else {
    			buf.push('/>');
    		}
    		// remove added visible namespaces
    		//visibleNamespaces.length = startVisibleNamespaces;
    		return;
    	case DOCUMENT_NODE:
    	case DOCUMENT_FRAGMENT_NODE:
    		var child = node.firstChild;
    		while(child){
    			serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
    			child = child.nextSibling;
    		}
    		return;
    	case ATTRIBUTE_NODE:
    		return addSerializedAttribute(buf, node.name, node.value);
    	case TEXT_NODE:
    		/**
    		 * The ampersand character (&) and the left angle bracket (<) must not appear in their literal form,
    		 * except when used as markup delimiters, or within a comment, a processing instruction, or a CDATA section.
    		 * If they are needed elsewhere, they must be escaped using either numeric character references or the strings
    		 * `&amp;` and `&lt;` respectively.
    		 * The right angle bracket (>) may be represented using the string " &gt; ", and must, for compatibility,
    		 * be escaped using either `&gt;` or a character reference when it appears in the string `]]>` in content,
    		 * when that string is not marking the end of a CDATA section.
    		 *
    		 * In the content of elements, character data is any string of characters
    		 * which does not contain the start-delimiter of any markup
    		 * and does not include the CDATA-section-close delimiter, `]]>`.
    		 *
    		 * @see https://www.w3.org/TR/xml/#NT-CharData
    		 * @see https://w3c.github.io/DOM-Parsing/#xml-serializing-a-text-node
    		 */
    		return buf.push(node.data
    			.replace(/[<&>]/g,_xmlEncoder)
    		);
    	case CDATA_SECTION_NODE:
    		return buf.push( '<![CDATA[',node.data,']]>');
    	case COMMENT_NODE:
    		return buf.push( "<!--",node.data,"-->");
    	case DOCUMENT_TYPE_NODE:
    		var pubid = node.publicId;
    		var sysid = node.systemId;
    		buf.push('<!DOCTYPE ',node.name);
    		if(pubid){
    			buf.push(' PUBLIC ', pubid);
    			if (sysid && sysid!='.') {
    				buf.push(' ', sysid);
    			}
    			buf.push('>');
    		}else if(sysid && sysid!='.'){
    			buf.push(' SYSTEM ', sysid, '>');
    		}else {
    			var sub = node.internalSubset;
    			if(sub){
    				buf.push(" [",sub,"]");
    			}
    			buf.push(">");
    		}
    		return;
    	case PROCESSING_INSTRUCTION_NODE:
    		return buf.push( "<?",node.target," ",node.data,"?>");
    	case ENTITY_REFERENCE_NODE:
    		return buf.push( '&',node.nodeName,';');
    	//case ENTITY_NODE:
    	//case NOTATION_NODE:
    	default:
    		buf.push('??',node.nodeName);
    	}
    }
    function importNode(doc,node,deep){
    	var node2;
    	switch (node.nodeType) {
    	case ELEMENT_NODE:
    		node2 = node.cloneNode(false);
    		node2.ownerDocument = doc;
    		//var attrs = node2.attributes;
    		//var len = attrs.length;
    		//for(var i=0;i<len;i++){
    			//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
    		//}
    	case DOCUMENT_FRAGMENT_NODE:
    		break;
    	case ATTRIBUTE_NODE:
    		deep = true;
    		break;
    	//case ENTITY_REFERENCE_NODE:
    	//case PROCESSING_INSTRUCTION_NODE:
    	////case TEXT_NODE:
    	//case CDATA_SECTION_NODE:
    	//case COMMENT_NODE:
    	//	deep = false;
    	//	break;
    	//case DOCUMENT_NODE:
    	//case DOCUMENT_TYPE_NODE:
    	//cannot be imported.
    	//case ENTITY_NODE:
    	//case NOTATION_NODE：
    	//can not hit in level3
    	//default:throw e;
    	}
    	if(!node2){
    		node2 = node.cloneNode(false);//false
    	}
    	node2.ownerDocument = doc;
    	node2.parentNode = null;
    	if(deep){
    		var child = node.firstChild;
    		while(child){
    			node2.appendChild(importNode(doc,child,deep));
    			child = child.nextSibling;
    		}
    	}
    	return node2;
    }
    //
    //var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
    //					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
    function cloneNode(doc,node,deep){
    	var node2 = new node.constructor();
    	for (var n in node) {
    		if (Object.prototype.hasOwnProperty.call(node, n)) {
    			var v = node[n];
    			if (typeof v != "object") {
    				if (v != node2[n]) {
    					node2[n] = v;
    				}
    			}
    		}
    	}
    	if(node.childNodes){
    		node2.childNodes = new NodeList();
    	}
    	node2.ownerDocument = doc;
    	switch (node2.nodeType) {
    	case ELEMENT_NODE:
    		var attrs	= node.attributes;
    		var attrs2	= node2.attributes = new NamedNodeMap();
    		var len = attrs.length;
    		attrs2._ownerElement = node2;
    		for(var i=0;i<len;i++){
    			node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
    		}
    		break;;
    	case ATTRIBUTE_NODE:
    		deep = true;
    	}
    	if(deep){
    		var child = node.firstChild;
    		while(child){
    			node2.appendChild(cloneNode(doc,child,deep));
    			child = child.nextSibling;
    		}
    	}
    	return node2;
    }

    function __set__(object,key,value){
    	object[key] = value;
    }
    //do dynamic
    try{
    	if(Object.defineProperty){
    		Object.defineProperty(LiveNodeList.prototype,'length',{
    			get:function(){
    				_updateLiveList(this);
    				return this.$$length;
    			}
    		});

    		Object.defineProperty(Node.prototype,'textContent',{
    			get:function(){
    				return getTextContent(this);
    			},

    			set:function(data){
    				switch(this.nodeType){
    				case ELEMENT_NODE:
    				case DOCUMENT_FRAGMENT_NODE:
    					while(this.firstChild){
    						this.removeChild(this.firstChild);
    					}
    					if(data || String(data)){
    						this.appendChild(this.ownerDocument.createTextNode(data));
    					}
    					break;

    				default:
    					this.data = data;
    					this.value = data;
    					this.nodeValue = data;
    				}
    			}
    		});

    		function getTextContent(node){
    			switch(node.nodeType){
    			case ELEMENT_NODE:
    			case DOCUMENT_FRAGMENT_NODE:
    				var buf = [];
    				node = node.firstChild;
    				while(node){
    					if(node.nodeType!==7 && node.nodeType !==8){
    						buf.push(getTextContent(node));
    					}
    					node = node.nextSibling;
    				}
    				return buf.join('');
    			default:
    				return node.nodeValue;
    			}
    		}

    		__set__ = function(object,key,value){
    			//console.log(value)
    			object['$$'+key] = value;
    		};
    	}
    }catch(e){//ie8
    }

    //if(typeof require == 'function'){
    	var DocumentType_1 = DocumentType;
    	var DOMException_1 = DOMException;
    	var DOMImplementation_1 = DOMImplementation$2;
    	var Element_1 = Element;
    	var Node_1 = Node;
    	var NodeList_1 = NodeList;
    	var XMLSerializer_1 = XMLSerializer$1;
    //}

    var dom = {
    	DocumentType: DocumentType_1,
    	DOMException: DOMException_1,
    	DOMImplementation: DOMImplementation_1,
    	Element: Element_1,
    	Node: Node_1,
    	NodeList: NodeList_1,
    	XMLSerializer: XMLSerializer_1
    };

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
    }

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    function getCjsExportFromNamespace (n) {
    	return n && n['default'] || n;
    }

    var entities = createCommonjsModule(function (module, exports) {
    var freeze = conventions.freeze;

    /**
     * The entities that are predefined in every XML document.
     *
     * @see https://www.w3.org/TR/2006/REC-xml11-20060816/#sec-predefined-ent W3C XML 1.1
     * @see https://www.w3.org/TR/2008/REC-xml-20081126/#sec-predefined-ent W3C XML 1.0
     * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Predefined_entities_in_XML Wikipedia
     */
    exports.XML_ENTITIES = freeze({amp:'&', apos:"'", gt:'>', lt:'<', quot:'"'});

    /**
     * A map of currently 241 entities that are detected in an HTML document.
     * They contain all entries from `XML_ENTITIES`.
     *
     * @see XML_ENTITIES
     * @see DOMParser.parseFromString
     * @see DOMImplementation.prototype.createHTMLDocument
     * @see https://html.spec.whatwg.org/#named-character-references WHATWG HTML(5) Spec
     * @see https://www.w3.org/TR/xml-entity-names/ W3C XML Entity Names
     * @see https://www.w3.org/TR/html4/sgml/entities.html W3C HTML4/SGML
     * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Character_entity_references_in_HTML Wikipedia (HTML)
     * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Entities_representing_special_characters_in_XHTML Wikpedia (XHTML)
     */
    exports.HTML_ENTITIES = freeze({
           lt: '<',
           gt: '>',
           amp: '&',
           quot: '"',
           apos: "'",
           Agrave: "À",
           Aacute: "Á",
           Acirc: "Â",
           Atilde: "Ã",
           Auml: "Ä",
           Aring: "Å",
           AElig: "Æ",
           Ccedil: "Ç",
           Egrave: "È",
           Eacute: "É",
           Ecirc: "Ê",
           Euml: "Ë",
           Igrave: "Ì",
           Iacute: "Í",
           Icirc: "Î",
           Iuml: "Ï",
           ETH: "Ð",
           Ntilde: "Ñ",
           Ograve: "Ò",
           Oacute: "Ó",
           Ocirc: "Ô",
           Otilde: "Õ",
           Ouml: "Ö",
           Oslash: "Ø",
           Ugrave: "Ù",
           Uacute: "Ú",
           Ucirc: "Û",
           Uuml: "Ü",
           Yacute: "Ý",
           THORN: "Þ",
           szlig: "ß",
           agrave: "à",
           aacute: "á",
           acirc: "â",
           atilde: "ã",
           auml: "ä",
           aring: "å",
           aelig: "æ",
           ccedil: "ç",
           egrave: "è",
           eacute: "é",
           ecirc: "ê",
           euml: "ë",
           igrave: "ì",
           iacute: "í",
           icirc: "î",
           iuml: "ï",
           eth: "ð",
           ntilde: "ñ",
           ograve: "ò",
           oacute: "ó",
           ocirc: "ô",
           otilde: "õ",
           ouml: "ö",
           oslash: "ø",
           ugrave: "ù",
           uacute: "ú",
           ucirc: "û",
           uuml: "ü",
           yacute: "ý",
           thorn: "þ",
           yuml: "ÿ",
           nbsp: "\u00a0",
           iexcl: "¡",
           cent: "¢",
           pound: "£",
           curren: "¤",
           yen: "¥",
           brvbar: "¦",
           sect: "§",
           uml: "¨",
           copy: "©",
           ordf: "ª",
           laquo: "«",
           not: "¬",
           shy: "­­",
           reg: "®",
           macr: "¯",
           deg: "°",
           plusmn: "±",
           sup2: "²",
           sup3: "³",
           acute: "´",
           micro: "µ",
           para: "¶",
           middot: "·",
           cedil: "¸",
           sup1: "¹",
           ordm: "º",
           raquo: "»",
           frac14: "¼",
           frac12: "½",
           frac34: "¾",
           iquest: "¿",
           times: "×",
           divide: "÷",
           forall: "∀",
           part: "∂",
           exist: "∃",
           empty: "∅",
           nabla: "∇",
           isin: "∈",
           notin: "∉",
           ni: "∋",
           prod: "∏",
           sum: "∑",
           minus: "−",
           lowast: "∗",
           radic: "√",
           prop: "∝",
           infin: "∞",
           ang: "∠",
           and: "∧",
           or: "∨",
           cap: "∩",
           cup: "∪",
           'int': "∫",
           there4: "∴",
           sim: "∼",
           cong: "≅",
           asymp: "≈",
           ne: "≠",
           equiv: "≡",
           le: "≤",
           ge: "≥",
           sub: "⊂",
           sup: "⊃",
           nsub: "⊄",
           sube: "⊆",
           supe: "⊇",
           oplus: "⊕",
           otimes: "⊗",
           perp: "⊥",
           sdot: "⋅",
           Alpha: "Α",
           Beta: "Β",
           Gamma: "Γ",
           Delta: "Δ",
           Epsilon: "Ε",
           Zeta: "Ζ",
           Eta: "Η",
           Theta: "Θ",
           Iota: "Ι",
           Kappa: "Κ",
           Lambda: "Λ",
           Mu: "Μ",
           Nu: "Ν",
           Xi: "Ξ",
           Omicron: "Ο",
           Pi: "Π",
           Rho: "Ρ",
           Sigma: "Σ",
           Tau: "Τ",
           Upsilon: "Υ",
           Phi: "Φ",
           Chi: "Χ",
           Psi: "Ψ",
           Omega: "Ω",
           alpha: "α",
           beta: "β",
           gamma: "γ",
           delta: "δ",
           epsilon: "ε",
           zeta: "ζ",
           eta: "η",
           theta: "θ",
           iota: "ι",
           kappa: "κ",
           lambda: "λ",
           mu: "μ",
           nu: "ν",
           xi: "ξ",
           omicron: "ο",
           pi: "π",
           rho: "ρ",
           sigmaf: "ς",
           sigma: "σ",
           tau: "τ",
           upsilon: "υ",
           phi: "φ",
           chi: "χ",
           psi: "ψ",
           omega: "ω",
           thetasym: "ϑ",
           upsih: "ϒ",
           piv: "ϖ",
           OElig: "Œ",
           oelig: "œ",
           Scaron: "Š",
           scaron: "š",
           Yuml: "Ÿ",
           fnof: "ƒ",
           circ: "ˆ",
           tilde: "˜",
           ensp: " ",
           emsp: " ",
           thinsp: " ",
           zwnj: "‌",
           zwj: "‍",
           lrm: "‎",
           rlm: "‏",
           ndash: "–",
           mdash: "—",
           lsquo: "‘",
           rsquo: "’",
           sbquo: "‚",
           ldquo: "“",
           rdquo: "”",
           bdquo: "„",
           dagger: "†",
           Dagger: "‡",
           bull: "•",
           hellip: "…",
           permil: "‰",
           prime: "′",
           Prime: "″",
           lsaquo: "‹",
           rsaquo: "›",
           oline: "‾",
           euro: "€",
           trade: "™",
           larr: "←",
           uarr: "↑",
           rarr: "→",
           darr: "↓",
           harr: "↔",
           crarr: "↵",
           lceil: "⌈",
           rceil: "⌉",
           lfloor: "⌊",
           rfloor: "⌋",
           loz: "◊",
           spades: "♠",
           clubs: "♣",
           hearts: "♥",
           diams: "♦"
    });

    /**
     * @deprecated use `HTML_ENTITIES` instead
     * @see HTML_ENTITIES
     */
    exports.entityMap = exports.HTML_ENTITIES;
    });
    var entities_1 = entities.XML_ENTITIES;
    var entities_2 = entities.HTML_ENTITIES;
    var entities_3 = entities.entityMap;

    var NAMESPACE$1 = conventions.NAMESPACE;

    //[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
    //[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
    //[5]   	Name	   ::=   	NameStartChar (NameChar)*
    var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;//\u10000-\uEFFFF
    var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
    var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
    //var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
    //var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

    //S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
    //S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
    var S_TAG = 0;//tag name offerring
    var S_ATTR = 1;//attr name offerring
    var S_ATTR_SPACE=2;//attr name end and space offer
    var S_EQ = 3;//=space?
    var S_ATTR_NOQUOT_VALUE = 4;//attr value(no quot value only)
    var S_ATTR_END = 5;//attr value end and no space(quot end)
    var S_TAG_SPACE = 6;//(attr value end || tag end ) && (space offer)
    var S_TAG_CLOSE = 7;//closed el<el />

    /**
     * Creates an error that will not be caught by XMLReader aka the SAX parser.
     *
     * @param {string} message
     * @param {any?} locator Optional, can provide details about the location in the source
     * @constructor
     */
    function ParseError$1(message, locator) {
    	this.message = message;
    	this.locator = locator;
    	if(Error.captureStackTrace) Error.captureStackTrace(this, ParseError$1);
    }
    ParseError$1.prototype = new Error();
    ParseError$1.prototype.name = ParseError$1.name;

    function XMLReader$1(){

    }

    XMLReader$1.prototype = {
    	parse:function(source,defaultNSMap,entityMap){
    		var domBuilder = this.domBuilder;
    		domBuilder.startDocument();
    		_copy(defaultNSMap ,defaultNSMap = {});
    		parse(source,defaultNSMap,entityMap,
    				domBuilder,this.errorHandler);
    		domBuilder.endDocument();
    	}
    };
    function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
    	function fixedFromCharCode(code) {
    		// String.prototype.fromCharCode does not supports
    		// > 2 bytes unicode chars directly
    		if (code > 0xffff) {
    			code -= 0x10000;
    			var surrogate1 = 0xd800 + (code >> 10)
    				, surrogate2 = 0xdc00 + (code & 0x3ff);

    			return String.fromCharCode(surrogate1, surrogate2);
    		} else {
    			return String.fromCharCode(code);
    		}
    	}
    	function entityReplacer(a){
    		var k = a.slice(1,-1);
    		if (Object.hasOwnProperty.call(entityMap, k)) {
    			return entityMap[k];
    		}else if(k.charAt(0) === '#'){
    			return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
    		}else {
    			errorHandler.error('entity not found:'+a);
    			return a;
    		}
    	}
    	function appendText(end){//has some bugs
    		if(end>start){
    			var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
    			locator&&position(start);
    			domBuilder.characters(xt,0,end-start);
    			start = end;
    		}
    	}
    	function position(p,m){
    		while(p>=lineEnd && (m = linePattern.exec(source))){
    			lineStart = m.index;
    			lineEnd = lineStart + m[0].length;
    			locator.lineNumber++;
    			//console.log('line++:',locator,startPos,endPos)
    		}
    		locator.columnNumber = p-lineStart+1;
    	}
    	var lineStart = 0;
    	var lineEnd = 0;
    	var linePattern = /.*(?:\r\n?|\n)|.*$/g;
    	var locator = domBuilder.locator;

    	var parseStack = [{currentNSMap:defaultNSMapCopy}];
    	var closeMap = {};
    	var start = 0;
    	while(true){
    		try{
    			var tagStart = source.indexOf('<',start);
    			if(tagStart<0){
    				if(!source.substr(start).match(/^\s*$/)){
    					var doc = domBuilder.doc;
    	    			var text = doc.createTextNode(source.substr(start));
    	    			doc.appendChild(text);
    	    			domBuilder.currentElement = text;
    				}
    				return;
    			}
    			if(tagStart>start){
    				appendText(tagStart);
    			}
    			switch(source.charAt(tagStart+1)){
    			case '/':
    				var end = source.indexOf('>',tagStart+3);
    				var tagName = source.substring(tagStart + 2, end).replace(/[ \t\n\r]+$/g, '');
    				var config = parseStack.pop();
    				if(end<0){

    	        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
    	        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
    	        		end = tagStart+1+tagName.length;
    	        	}else if(tagName.match(/\s</)){
    	        		tagName = tagName.replace(/[\s<].*/,'');
    	        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
    	        		end = tagStart+1+tagName.length;
    				}
    				var localNSMap = config.localNSMap;
    				var endMatch = config.tagName == tagName;
    				var endIgnoreCaseMach = endMatch || config.tagName&&config.tagName.toLowerCase() == tagName.toLowerCase();
    		        if(endIgnoreCaseMach){
    		        	domBuilder.endElement(config.uri,config.localName,tagName);
    					if(localNSMap){
    						for (var prefix in localNSMap) {
    							if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
    								domBuilder.endPrefixMapping(prefix);
    							}
    						}
    					}
    					if(!endMatch){
    		            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName ); // No known test case
    					}
    		        }else {
    		        	parseStack.push(config);
    		        }

    				end++;
    				break;
    				// end elment
    			case '?':// <?...?>
    				locator&&position(tagStart);
    				end = parseInstruction(source,tagStart,domBuilder);
    				break;
    			case '!':// <!doctype,<![CDATA,<!--
    				locator&&position(tagStart);
    				end = parseDCC(source,tagStart,domBuilder,errorHandler);
    				break;
    			default:
    				locator&&position(tagStart);
    				var el = new ElementAttributes();
    				var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
    				//elStartEnd
    				var end = parseElementStartPart(source,tagStart,el,currentNSMap,entityReplacer,errorHandler);
    				var len = el.length;


    				if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
    					el.closed = true;
    					if(!entityMap.nbsp){
    						errorHandler.warning('unclosed xml attribute');
    					}
    				}
    				if(locator && len){
    					var locator2 = copyLocator(locator,{});
    					//try{//attribute position fixed
    					for(var i = 0;i<len;i++){
    						var a = el[i];
    						position(a.offset);
    						a.locator = copyLocator(locator,{});
    					}
    					domBuilder.locator = locator2;
    					if(appendElement$1(el,domBuilder,currentNSMap)){
    						parseStack.push(el);
    					}
    					domBuilder.locator = locator;
    				}else {
    					if(appendElement$1(el,domBuilder,currentNSMap)){
    						parseStack.push(el);
    					}
    				}

    				if (NAMESPACE$1.isHTML(el.uri) && !el.closed) {
    					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder);
    				} else {
    					end++;
    				}
    			}
    		}catch(e){
    			if (e instanceof ParseError$1) {
    				throw e;
    			}
    			errorHandler.error('element parse error: '+e);
    			end = -1;
    		}
    		if(end>start){
    			start = end;
    		}else {
    			//TODO: 这里有可能sax回退，有位置错误风险
    			appendText(Math.max(tagStart,start)+1);
    		}
    	}
    }
    function copyLocator(f,t){
    	t.lineNumber = f.lineNumber;
    	t.columnNumber = f.columnNumber;
    	return t;
    }

    /**
     * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
     * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
     */
    function parseElementStartPart(source,start,el,currentNSMap,entityReplacer,errorHandler){

    	/**
    	 * @param {string} qname
    	 * @param {string} value
    	 * @param {number} startIndex
    	 */
    	function addAttribute(qname, value, startIndex) {
    		if (el.attributeNames.hasOwnProperty(qname)) {
    			errorHandler.fatalError('Attribute ' + qname + ' redefined');
    		}
    		el.addValue(
    			qname,
    			// @see https://www.w3.org/TR/xml/#AVNormalize
    			// since the xmldom sax parser does not "interpret" DTD the following is not implemented:
    			// - recursive replacement of (DTD) entity references
    			// - trimming and collapsing multiple spaces into a single one for attributes that are not of type CDATA
    			value.replace(/[\t\n\r]/g, ' ').replace(/&#?\w+;/g, entityReplacer),
    			startIndex
    		);
    	}
    	var attrName;
    	var value;
    	var p = ++start;
    	var s = S_TAG;//status
    	while(true){
    		var c = source.charAt(p);
    		switch(c){
    		case '=':
    			if(s === S_ATTR){//attrName
    				attrName = source.slice(start,p);
    				s = S_EQ;
    			}else if(s === S_ATTR_SPACE){
    				s = S_EQ;
    			}else {
    				//fatalError: equal must after attrName or space after attrName
    				throw new Error('attribute equal must after attrName'); // No known test case
    			}
    			break;
    		case '\'':
    		case '"':
    			if(s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
    				){//equal
    				if(s === S_ATTR){
    					errorHandler.warning('attribute value must after "="');
    					attrName = source.slice(start,p);
    				}
    				start = p+1;
    				p = source.indexOf(c,start);
    				if(p>0){
    					value = source.slice(start, p);
    					addAttribute(attrName, value, start-1);
    					s = S_ATTR_END;
    				}else {
    					//fatalError: no end quot match
    					throw new Error('attribute value no end \''+c+'\' match');
    				}
    			}else if(s == S_ATTR_NOQUOT_VALUE){
    				value = source.slice(start, p);
    				addAttribute(attrName, value, start);
    				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
    				start = p+1;
    				s = S_ATTR_END;
    			}else {
    				//fatalError: no equal before
    				throw new Error('attribute value must after "="'); // No known test case
    			}
    			break;
    		case '/':
    			switch(s){
    			case S_TAG:
    				el.setTagName(source.slice(start,p));
    			case S_ATTR_END:
    			case S_TAG_SPACE:
    			case S_TAG_CLOSE:
    				s =S_TAG_CLOSE;
    				el.closed = true;
    			case S_ATTR_NOQUOT_VALUE:
    			case S_ATTR:
    			case S_ATTR_SPACE:
    				break;
    			//case S_EQ:
    			default:
    				throw new Error("attribute invalid close char('/')") // No known test case
    			}
    			break;
    		case ''://end document
    			errorHandler.error('unexpected end of input');
    			if(s == S_TAG){
    				el.setTagName(source.slice(start,p));
    			}
    			return p;
    		case '>':
    			switch(s){
    			case S_TAG:
    				el.setTagName(source.slice(start,p));
    			case S_ATTR_END:
    			case S_TAG_SPACE:
    			case S_TAG_CLOSE:
    				break;//normal
    			case S_ATTR_NOQUOT_VALUE://Compatible state
    			case S_ATTR:
    				value = source.slice(start,p);
    				if(value.slice(-1) === '/'){
    					el.closed  = true;
    					value = value.slice(0,-1);
    				}
    			case S_ATTR_SPACE:
    				if(s === S_ATTR_SPACE){
    					value = attrName;
    				}
    				if(s == S_ATTR_NOQUOT_VALUE){
    					errorHandler.warning('attribute "'+value+'" missed quot(")!');
    					addAttribute(attrName, value, start);
    				}else {
    					if(!NAMESPACE$1.isHTML(currentNSMap['']) || !value.match(/^(?:disabled|checked|selected)$/i)){
    						errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!');
    					}
    					addAttribute(value, value, start);
    				}
    				break;
    			case S_EQ:
    				throw new Error('attribute value missed!!');
    			}
    //			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
    			return p;
    		/*xml space '\x20' | #x9 | #xD | #xA; */
    		case '\u0080':
    			c = ' ';
    		default:
    			if(c<= ' '){//space
    				switch(s){
    				case S_TAG:
    					el.setTagName(source.slice(start,p));//tagName
    					s = S_TAG_SPACE;
    					break;
    				case S_ATTR:
    					attrName = source.slice(start,p);
    					s = S_ATTR_SPACE;
    					break;
    				case S_ATTR_NOQUOT_VALUE:
    					var value = source.slice(start, p);
    					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
    					addAttribute(attrName, value, start);
    				case S_ATTR_END:
    					s = S_TAG_SPACE;
    					break;
    				//case S_TAG_SPACE:
    				//case S_EQ:
    				//case S_ATTR_SPACE:
    				//	void();break;
    				//case S_TAG_CLOSE:
    					//ignore warning
    				}
    			}else {//not space
    //S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
    //S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
    				switch(s){
    				//case S_TAG:void();break;
    				//case S_ATTR:void();break;
    				//case S_ATTR_NOQUOT_VALUE:void();break;
    				case S_ATTR_SPACE:
    					var tagName =  el.tagName;
    					if (!NAMESPACE$1.isHTML(currentNSMap['']) || !attrName.match(/^(?:disabled|checked|selected)$/i)) {
    						errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!');
    					}
    					addAttribute(attrName, attrName, start);
    					start = p;
    					s = S_ATTR;
    					break;
    				case S_ATTR_END:
    					errorHandler.warning('attribute space is required"'+attrName+'"!!');
    				case S_TAG_SPACE:
    					s = S_ATTR;
    					start = p;
    					break;
    				case S_EQ:
    					s = S_ATTR_NOQUOT_VALUE;
    					start = p;
    					break;
    				case S_TAG_CLOSE:
    					throw new Error("elements closed character '/' and '>' must be connected to");
    				}
    			}
    		}//end outer switch
    		//console.log('p++',p)
    		p++;
    	}
    }
    /**
     * @return true if has new namespace define
     */
    function appendElement$1(el,domBuilder,currentNSMap){
    	var tagName = el.tagName;
    	var localNSMap = null;
    	//var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
    	var i = el.length;
    	while(i--){
    		var a = el[i];
    		var qName = a.qName;
    		var value = a.value;
    		var nsp = qName.indexOf(':');
    		if(nsp>0){
    			var prefix = a.prefix = qName.slice(0,nsp);
    			var localName = qName.slice(nsp+1);
    			var nsPrefix = prefix === 'xmlns' && localName;
    		}else {
    			localName = qName;
    			prefix = null;
    			nsPrefix = qName === 'xmlns' && '';
    		}
    		//can not set prefix,because prefix !== ''
    		a.localName = localName ;
    		//prefix == null for no ns prefix attribute
    		if(nsPrefix !== false){//hack!!
    			if(localNSMap == null){
    				localNSMap = {};
    				//console.log(currentNSMap,0)
    				_copy(currentNSMap,currentNSMap={});
    				//console.log(currentNSMap,1)
    			}
    			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
    			a.uri = NAMESPACE$1.XMLNS;
    			domBuilder.startPrefixMapping(nsPrefix, value);
    		}
    	}
    	var i = el.length;
    	while(i--){
    		a = el[i];
    		var prefix = a.prefix;
    		if(prefix){//no prefix attribute has no namespace
    			if(prefix === 'xml'){
    				a.uri = NAMESPACE$1.XML;
    			}if(prefix !== 'xmlns'){
    				a.uri = currentNSMap[prefix || ''];

    				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
    			}
    		}
    	}
    	var nsp = tagName.indexOf(':');
    	if(nsp>0){
    		prefix = el.prefix = tagName.slice(0,nsp);
    		localName = el.localName = tagName.slice(nsp+1);
    	}else {
    		prefix = null;//important!!
    		localName = el.localName = tagName;
    	}
    	//no prefix element has default namespace
    	var ns = el.uri = currentNSMap[prefix || ''];
    	domBuilder.startElement(ns,localName,tagName,el);
    	//endPrefixMapping and startPrefixMapping have not any help for dom builder
    	//localNSMap = null
    	if(el.closed){
    		domBuilder.endElement(ns,localName,tagName);
    		if(localNSMap){
    			for (prefix in localNSMap) {
    				if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
    					domBuilder.endPrefixMapping(prefix);
    				}
    			}
    		}
    	}else {
    		el.currentNSMap = currentNSMap;
    		el.localNSMap = localNSMap;
    		//parseStack.push(el);
    		return true;
    	}
    }
    function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
    	if(/^(?:script|textarea)$/i.test(tagName)){
    		var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
    		var text = source.substring(elStartEnd+1,elEndStart);
    		if(/[&<]/.test(text)){
    			if(/^script$/i.test(tagName)){
    				//if(!/\]\]>/.test(text)){
    					//lexHandler.startCDATA();
    					domBuilder.characters(text,0,text.length);
    					//lexHandler.endCDATA();
    					return elEndStart;
    				//}
    			}//}else{//text area
    				text = text.replace(/&#?\w+;/g,entityReplacer);
    				domBuilder.characters(text,0,text.length);
    				return elEndStart;
    			//}

    		}
    	}
    	return elStartEnd+1;
    }
    function fixSelfClosed(source,elStartEnd,tagName,closeMap){
    	//if(tagName in closeMap){
    	var pos = closeMap[tagName];
    	if(pos == null){
    		//console.log(tagName)
    		pos =  source.lastIndexOf('</'+tagName+'>');
    		if(pos<elStartEnd){//忘记闭合
    			pos = source.lastIndexOf('</'+tagName);
    		}
    		closeMap[tagName] =pos;
    	}
    	return pos<elStartEnd;
    	//}
    }

    function _copy (source, target) {
    	for (var n in source) {
    		if (Object.prototype.hasOwnProperty.call(source, n)) {
    			target[n] = source[n];
    		}
    	}
    }

    function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
    	var next= source.charAt(start+2);
    	switch(next){
    	case '-':
    		if(source.charAt(start + 3) === '-'){
    			var end = source.indexOf('-->',start+4);
    			//append comment source.substring(4,end)//<!--
    			if(end>start){
    				domBuilder.comment(source,start+4,end-start-4);
    				return end+3;
    			}else {
    				errorHandler.error("Unclosed comment");
    				return -1;
    			}
    		}else {
    			//error
    			return -1;
    		}
    	default:
    		if(source.substr(start+3,6) == 'CDATA['){
    			var end = source.indexOf(']]>',start+9);
    			domBuilder.startCDATA();
    			domBuilder.characters(source,start+9,end-start-9);
    			domBuilder.endCDATA();
    			return end+3;
    		}
    		//<!DOCTYPE
    		//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId)
    		var matchs = split(source,start);
    		var len = matchs.length;
    		if(len>1 && /!doctype/i.test(matchs[0][0])){
    			var name = matchs[1][0];
    			var pubid = false;
    			var sysid = false;
    			if(len>3){
    				if(/^public$/i.test(matchs[2][0])){
    					pubid = matchs[3][0];
    					sysid = len>4 && matchs[4][0];
    				}else if(/^system$/i.test(matchs[2][0])){
    					sysid = matchs[3][0];
    				}
    			}
    			var lastMatch = matchs[len-1];
    			domBuilder.startDTD(name, pubid, sysid);
    			domBuilder.endDTD();

    			return lastMatch.index+lastMatch[0].length
    		}
    	}
    	return -1;
    }



    function parseInstruction(source,start,domBuilder){
    	var end = source.indexOf('?>',start);
    	if(end){
    		var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
    		if(match){
    			var len = match[0].length;
    			domBuilder.processingInstruction(match[1], match[2]) ;
    			return end+2;
    		}else {//error
    			return -1;
    		}
    	}
    	return -1;
    }

    function ElementAttributes(){
    	this.attributeNames = {};
    }
    ElementAttributes.prototype = {
    	setTagName:function(tagName){
    		if(!tagNamePattern.test(tagName)){
    			throw new Error('invalid tagName:'+tagName)
    		}
    		this.tagName = tagName;
    	},
    	addValue:function(qName, value, offset) {
    		if(!tagNamePattern.test(qName)){
    			throw new Error('invalid attribute:'+qName)
    		}
    		this.attributeNames[qName] = this.length;
    		this[this.length++] = {qName:qName,value:value,offset:offset};
    	},
    	length:0,
    	getLocalName:function(i){return this[i].localName},
    	getLocator:function(i){return this[i].locator},
    	getQName:function(i){return this[i].qName},
    	getURI:function(i){return this[i].uri},
    	getValue:function(i){return this[i].value}
    //	,getIndex:function(uri, localName)){
    //		if(localName){
    //
    //		}else{
    //			var qName = uri
    //		}
    //	},
    //	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
    //	getType:function(uri,localName){}
    //	getType:function(i){},
    };



    function split(source,start){
    	var match;
    	var buf = [];
    	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
    	reg.lastIndex = start;
    	reg.exec(source);//skip <
    	while(match = reg.exec(source)){
    		buf.push(match);
    		if(match[1])return buf;
    	}
    }

    var XMLReader_1 = XMLReader$1;
    var ParseError_1 = ParseError$1;

    var sax = {
    	XMLReader: XMLReader_1,
    	ParseError: ParseError_1
    };

    var DOMImplementation$1 = dom.DOMImplementation;

    var NAMESPACE = conventions.NAMESPACE;

    var ParseError = sax.ParseError;
    var XMLReader = sax.XMLReader;

    /**
     * Normalizes line ending according to https://www.w3.org/TR/xml11/#sec-line-ends:
     *
     * > XML parsed entities are often stored in computer files which,
     * > for editing convenience, are organized into lines.
     * > These lines are typically separated by some combination
     * > of the characters CARRIAGE RETURN (#xD) and LINE FEED (#xA).
     * >
     * > To simplify the tasks of applications, the XML processor must behave
     * > as if it normalized all line breaks in external parsed entities (including the document entity)
     * > on input, before parsing, by translating all of the following to a single #xA character:
     * >
     * > 1. the two-character sequence #xD #xA
     * > 2. the two-character sequence #xD #x85
     * > 3. the single character #x85
     * > 4. the single character #x2028
     * > 5. any #xD character that is not immediately followed by #xA or #x85.
     *
     * @param {string} input
     * @returns {string}
     */
    function normalizeLineEndings(input) {
    	return input
    		.replace(/\r[\n\u0085]/g, '\n')
    		.replace(/[\r\u0085\u2028]/g, '\n')
    }

    /**
     * @typedef Locator
     * @property {number} [columnNumber]
     * @property {number} [lineNumber]
     */

    /**
     * @typedef DOMParserOptions
     * @property {DOMHandler} [domBuilder]
     * @property {Function} [errorHandler]
     * @property {(string) => string} [normalizeLineEndings] used to replace line endings before parsing
     * 						defaults to `normalizeLineEndings`
     * @property {Locator} [locator]
     * @property {Record<string, string>} [xmlns]
     *
     * @see normalizeLineEndings
     */

    /**
     * The DOMParser interface provides the ability to parse XML or HTML source code
     * from a string into a DOM `Document`.
     *
     * _xmldom is different from the spec in that it allows an `options` parameter,
     * to override the default behavior._
     *
     * @param {DOMParserOptions} [options]
     * @constructor
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
     * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-parsing-and-serialization
     */
    function DOMParser$2(options){
    	this.options = options ||{locator:{}};
    }

    DOMParser$2.prototype.parseFromString = function(source,mimeType){
    	var options = this.options;
    	var sax =  new XMLReader();
    	var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
    	var errorHandler = options.errorHandler;
    	var locator = options.locator;
    	var defaultNSMap = options.xmlns||{};
    	var isHTML = /\/x?html?$/.test(mimeType);//mimeType.toLowerCase().indexOf('html') > -1;
      	var entityMap = isHTML ? entities.HTML_ENTITIES : entities.XML_ENTITIES;
    	if(locator){
    		domBuilder.setDocumentLocator(locator);
    	}

    	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
    	sax.domBuilder = options.domBuilder || domBuilder;
    	if(isHTML){
    		defaultNSMap[''] = NAMESPACE.HTML;
    	}
    	defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML;
    	var normalize = options.normalizeLineEndings || normalizeLineEndings;
    	if (source && typeof source === 'string') {
    		sax.parse(
    			normalize(source),
    			defaultNSMap,
    			entityMap
    		);
    	} else {
    		sax.errorHandler.error('invalid doc source');
    	}
    	return domBuilder.doc;
    };
    function buildErrorHandler(errorImpl,domBuilder,locator){
    	if(!errorImpl){
    		if(domBuilder instanceof DOMHandler){
    			return domBuilder;
    		}
    		errorImpl = domBuilder ;
    	}
    	var errorHandler = {};
    	var isCallback = errorImpl instanceof Function;
    	locator = locator||{};
    	function build(key){
    		var fn = errorImpl[key];
    		if(!fn && isCallback){
    			fn = errorImpl.length == 2?function(msg){errorImpl(key,msg);}:errorImpl;
    		}
    		errorHandler[key] = fn && function(msg){
    			fn('[xmldom '+key+']\t'+msg+_locator(locator));
    		}||function(){};
    	}
    	build('warning');
    	build('error');
    	build('fatalError');
    	return errorHandler;
    }

    //console.log('#\n\n\n\n\n\n\n####')
    /**
     * +ContentHandler+ErrorHandler
     * +LexicalHandler+EntityResolver2
     * -DeclHandler-DTDHandler
     *
     * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
     * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
     * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
     */
    function DOMHandler() {
        this.cdata = false;
    }
    function position(locator,node){
    	node.lineNumber = locator.lineNumber;
    	node.columnNumber = locator.columnNumber;
    }
    /**
     * @see org.xml.sax.ContentHandler#startDocument
     * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
     */
    DOMHandler.prototype = {
    	startDocument : function() {
        	this.doc = new DOMImplementation$1().createDocument(null, null, null);
        	if (this.locator) {
            	this.doc.documentURI = this.locator.systemId;
        	}
    	},
    	startElement:function(namespaceURI, localName, qName, attrs) {
    		var doc = this.doc;
    	    var el = doc.createElementNS(namespaceURI, qName||localName);
    	    var len = attrs.length;
    	    appendElement(this, el);
    	    this.currentElement = el;

    		this.locator && position(this.locator,el);
    	    for (var i = 0 ; i < len; i++) {
    	        var namespaceURI = attrs.getURI(i);
    	        var value = attrs.getValue(i);
    	        var qName = attrs.getQName(i);
    			var attr = doc.createAttributeNS(namespaceURI, qName);
    			this.locator &&position(attrs.getLocator(i),attr);
    			attr.value = attr.nodeValue = value;
    			el.setAttributeNode(attr);
    	    }
    	},
    	endElement:function(namespaceURI, localName, qName) {
    		var current = this.currentElement;
    		var tagName = current.tagName;
    		this.currentElement = current.parentNode;
    	},
    	startPrefixMapping:function(prefix, uri) {
    	},
    	endPrefixMapping:function(prefix) {
    	},
    	processingInstruction:function(target, data) {
    	    var ins = this.doc.createProcessingInstruction(target, data);
    	    this.locator && position(this.locator,ins);
    	    appendElement(this, ins);
    	},
    	ignorableWhitespace:function(ch, start, length) {
    	},
    	characters:function(chars, start, length) {
    		chars = _toString.apply(this,arguments);
    		//console.log(chars)
    		if(chars){
    			if (this.cdata) {
    				var charNode = this.doc.createCDATASection(chars);
    			} else {
    				var charNode = this.doc.createTextNode(chars);
    			}
    			if(this.currentElement){
    				this.currentElement.appendChild(charNode);
    			}else if(/^\s*$/.test(chars)){
    				this.doc.appendChild(charNode);
    				//process xml
    			}
    			this.locator && position(this.locator,charNode);
    		}
    	},
    	skippedEntity:function(name) {
    	},
    	endDocument:function() {
    		this.doc.normalize();
    	},
    	setDocumentLocator:function (locator) {
    	    if(this.locator = locator){// && !('lineNumber' in locator)){
    	    	locator.lineNumber = 0;
    	    }
    	},
    	//LexicalHandler
    	comment:function(chars, start, length) {
    		chars = _toString.apply(this,arguments);
    	    var comm = this.doc.createComment(chars);
    	    this.locator && position(this.locator,comm);
    	    appendElement(this, comm);
    	},

    	startCDATA:function() {
    	    //used in characters() methods
    	    this.cdata = true;
    	},
    	endCDATA:function() {
    	    this.cdata = false;
    	},

    	startDTD:function(name, publicId, systemId) {
    		var impl = this.doc.implementation;
    	    if (impl && impl.createDocumentType) {
    	        var dt = impl.createDocumentType(name, publicId, systemId);
    	        this.locator && position(this.locator,dt);
    	        appendElement(this, dt);
    					this.doc.doctype = dt;
    	    }
    	},
    	/**
    	 * @see org.xml.sax.ErrorHandler
    	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
    	 */
    	warning:function(error) {
    		console.warn('[xmldom warning]\t'+error,_locator(this.locator));
    	},
    	error:function(error) {
    		console.error('[xmldom error]\t'+error,_locator(this.locator));
    	},
    	fatalError:function(error) {
    		throw new ParseError(error, this.locator);
    	}
    };
    function _locator(l){
    	if(l){
    		return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
    	}
    }
    function _toString(chars,start,length){
    	if(typeof chars == 'string'){
    		return chars.substr(start,length)
    	}else {//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
    		if(chars.length >= start+length || start){
    			return new java.lang.String(chars,start,length)+'';
    		}
    		return chars;
    	}
    }

    /*
     * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
     * used method of org.xml.sax.ext.LexicalHandler:
     *  #comment(chars, start, length)
     *  #startCDATA()
     *  #endCDATA()
     *  #startDTD(name, publicId, systemId)
     *
     *
     * IGNORED method of org.xml.sax.ext.LexicalHandler:
     *  #endDTD()
     *  #startEntity(name)
     *  #endEntity(name)
     *
     *
     * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
     * IGNORED method of org.xml.sax.ext.DeclHandler
     * 	#attributeDecl(eName, aName, type, mode, value)
     *  #elementDecl(name, model)
     *  #externalEntityDecl(name, publicId, systemId)
     *  #internalEntityDecl(name, value)
     * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
     * IGNORED method of org.xml.sax.EntityResolver2
     *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
     *  #resolveEntity(publicId, systemId)
     *  #getExternalSubset(name, baseURI)
     * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
     * IGNORED method of org.xml.sax.DTDHandler
     *  #notationDecl(name, publicId, systemId) {};
     *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
     */
    "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
    	DOMHandler.prototype[key] = function(){return null};
    });

    /* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
    function appendElement (hander,node) {
        if (!hander.currentElement) {
            hander.doc.appendChild(node);
        } else {
            hander.currentElement.appendChild(node);
        }
    }//appendChild and setAttributeNS are preformance key

    var __DOMHandler = DOMHandler;
    var normalizeLineEndings_1 = normalizeLineEndings;
    var DOMParser_1 = DOMParser$2;

    var domParser = {
    	__DOMHandler: __DOMHandler,
    	normalizeLineEndings: normalizeLineEndings_1,
    	DOMParser: DOMParser_1
    };

    var DOMImplementation = dom.DOMImplementation;
    var XMLSerializer = dom.XMLSerializer;
    var DOMParser$1 = domParser.DOMParser;

    var lib = {
    	DOMImplementation: DOMImplementation,
    	XMLSerializer: XMLSerializer,
    	DOMParser: DOMParser$1
    };

    /**
     * @author alawnxu
     * @description dom parser
     * @date 2022-06-29 11:05:51
     * @version 1.0.0
     * @description 这里主要因为会用在 WebWorker ,所以这里引用了独立的 xmldom 去解析DOM. 后面可以看情况调整为AST
     */
    var logger$j = Logger.getLogger('logger');
    var AST = /** @class */ (function () {
        function AST() {
        }
        AST.parser = function (template) {
            var startTime = Date.now();
            var dom = new DOMParser$1();
            var doc = dom.parseFromString(template, 'text/xml');
            logger$j.debug('AST Parser:', "".concat(Date.now() - startTime, "ms"));
            return doc;
        };
        return AST;
    }());

    /**
     * View标签序列化
     * @author alawnxu
     * @date 2022-07-14 21:09:11
     * @version 1.0.0
     */
    var ViewAttributeEnum;
    (function (ViewAttributeEnum) {
        ViewAttributeEnum["LAYERED"] = "layered";
        ViewAttributeEnum["FLOATING"] = "floating";
        ViewAttributeEnum["TEMPLATE"] = "template";
    })(ViewAttributeEnum || (ViewAttributeEnum = {}));
    var logger$i = Logger.getLogger('ViewSerializer');
    var ViewSerializer = /** @class */ (function (_super) {
        __extends$1(ViewSerializer, _super);
        function ViewSerializer(application, element, pObject) {
            var _this = _super.call(this, application, element) || this;
            _this.pObject = pObject;
            return _this;
        }
        ViewSerializer.prototype.read = function () {
            var _this = this;
            var _a = this, pObject = _a.pObject, element = _a.element, application = _a.application;
            var app = pObject.GetApp();
            if (!pObject) {
                logger$i.warn('pObject is null');
                return;
            }
            var templateId = element.getAttribute(ViewAttributeEnum.TEMPLATE);
            if (templateId) {
                this.LoadTemplate(templateId);
            }
            /**
             * 元素序列化的时候锁定布局.防止重复计算布局.
             * @description 非常重要.
             */
            pObject.LockLayout();
            var serializer = new UIObjectSerializer(application, element, pObject);
            serializer.read();
            // floating: 是否为悬浮浮窗.默认为false
            var floatingValue = element.getAttribute(ViewAttributeEnum.FLOATING);
            if (floatingValue) {
                pObject.isFloating = isTrueString(floatingValue);
            }
            var layout = null;
            var layoutChild = null;
            Array.from(element.childNodes).forEach(function (child) {
                if (child.nodeType !== 1) {
                    return;
                }
                var texture = null;
                var layoutType = '';
                switch (child.tagName.toUpperCase()) {
                    case WebTexture.tagName:
                        texture = TagSerializerObject(application, child);
                        if (texture) {
                            pObject.LockUpdate();
                            pObject.AddTexture(texture);
                            pObject.UnlockUpdate(false);
                        }
                        break;
                    case Layout.tagName:
                        layoutType = child.getAttribute(LayoutAttributeEnum.TYPE);
                        if (layoutType) {
                            layout = LayoutFactory.GetLayout(layoutType);
                            layoutChild = child;
                        }
                        break;
                    default:
                        _this.serializerChild(app, child);
                }
            });
            if (layout) {
                var layoutSerializer = new LayoutSerializer(application, layoutChild, layout);
                layoutSerializer.read();
                this.pObject.SetLayout(layout);
            }
            else {
                pObject.DoLayout();
            }
            // controller
            pObject.CreateFloating();
            /**
             * 解除锁定
             */
            pObject.UnlockLayout();
        };
        /**
         * 可能是一个模板文件
         * @param template
         */
        ViewSerializer.prototype.LoadTemplate = function (templateId) {
            if (!templateId) {
                return;
            }
            var application = this.application;
            var templates = application.GetTemplates();
            if (templates === null || templates === void 0 ? void 0 : templates[templateId]) {
                var template = templates[templateId];
                var doc = AST.parser(template);
                SerializerObject(application, doc.documentElement, this.pObject);
            }
        };
        ViewSerializer.prototype.serializerChild = function (app, child) {
            var application = this.application;
            var childUIObject = TagSerializerObject(application, child);
            if (childUIObject) {
                this.pObject.AddObject(childUIObject);
            }
            return childUIObject;
        };
        return ViewSerializer;
    }(BaseSerializer));

    /**
     * Texture序列化
     * @author alawnxu
     * @date 2022-07-14 21:09:11
     * @version 1.0.0
     */
    var logger$h = Logger.getLogger('TextureSerializer');
    var TextureAttributesEnum;
    (function (TextureAttributesEnum) {
        TextureAttributesEnum["VISIBLE"] = "visible";
        TextureAttributesEnum["VALUE"] = "value";
        TextureAttributesEnum["COLOR"] = "color";
    })(TextureAttributesEnum || (TextureAttributesEnum = {}));
    var TextureSerializer = /** @class */ (function (_super) {
        __extends$1(TextureSerializer, _super);
        function TextureSerializer(application, element, pObject) {
            var _this = _super.call(this, application, element) || this;
            _this.pObject = pObject;
            return _this;
        }
        TextureSerializer.prototype.read = function () {
            var _a = this, pObject = _a.pObject, element = _a.element, application = _a.application;
            if (!pObject) {
                logger$h.warn('pObject is null');
                return;
            }
            var serializer = new ObjectSerializer(application, element, pObject);
            serializer.read();
            var visible = element.getAttribute(TextureAttributesEnum.VISIBLE);
            var value = element.getAttribute(TextureAttributesEnum.VALUE);
            var color = element.getAttribute(TextureAttributesEnum.COLOR);
            if (value) {
                pObject.SetValue(value);
            }
            if (isFalseString(visible)) {
                pObject.InitVisible(false);
            }
            if (color) {
                pObject.SetColor(color);
            }
            // @TODO 九宫格
            // @TODO 纹理节点
        };
        return TextureSerializer;
    }(BaseSerializer));

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     * @description 自定义拓展方法请以小写开头的驼峰命名.
     */
    /**
     * canvas标签序列化
     * @author alawnxu
     * @date 2022-07-14 21:09:11
     * @version 1.0.0
     */
    var CanvasSerializer = /** @class */ (function (_super) {
        __extends$1(CanvasSerializer, _super);
        function CanvasSerializer(application, element, pObject) {
            var _this = _super.call(this, application, element) || this;
            _this.pObject = pObject;
            return _this;
        }
        CanvasSerializer.prototype.read = function () {
            var _a = this, pObject = _a.pObject, element = _a.element, application = _a.application;
            var serializer = new UIObjectSerializer(application, element, pObject);
            serializer.read();
        };
        return CanvasSerializer;
    }(BaseSerializer));

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     * @description 自定义拓展方法请以小写开头的驼峰命名.
     */
    /**
     * @fileoverview 线性渐变
     * @author alawnxu
     * @date 2022-07-25 19:46:30
     * @version 1.0.0
     */
    var LinearGradient = /** @class */ (function (_super) {
        __extends$1(LinearGradient, _super);
        function LinearGradient(context, x1, y1, x2, y2) {
            var _this = _super.call(this) || this;
            _this.gradient = context.createLinearGradient(x1, y1, x2, y2);
            return _this;
        }
        /**
         * 创建线性颜色渐变的Gradient对象
         * @param x1 渐变起点位置水平坐标
         * @param y1 渐变起点位置垂直坐标
         * @param x2 渐变终点位置水平坐标
         * @param y2 渐变终点位置垂直坐标
         */
        LinearGradient.Create = function (context, x1, y1, x2, y2) {
            return new LinearGradient(context, x1, y1, x2, y2);
        };
        /**
         * 指定渐变对象中的颜色和位置
         * @param stop 介于0.0和1.0之间的值，表示渐变中开始和结束之间的位置
         * @param color 要在停止位置显示的CSS颜色值(Ark这里的颜色是ARGB)
         */
        LinearGradient.prototype.AddColorStop = function (stop, color) {
            var rgba = argbToColor(color);
            this.gradient.addColorStop(stop, rgba);
        };
        return LinearGradient;
    }(Gradient));

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     * @description 自定义拓展方法请以小写开头的驼峰命名.
     */
    /**
     * @fileoverview 线性渐变
     * @author alawnxu
     * @date 2022-07-25 19:46:30
     * @version 1.0.0
     */
    var RadialGradient = /** @class */ (function (_super) {
        __extends$1(RadialGradient, _super);
        function RadialGradient(context, x1, y1, r1, x2, y2, r2) {
            var _this = _super.call(this) || this;
            _this.gradient = context.createRadialGradient(x1, y1, r1, x2, y2, r2);
            return _this;
        }
        /**
         * 创建放射颜色渐变的Gradient对象
         * @param x1 开始圆的圆心水平坐标
         * @param y1 开始圆的圆心垂直坐标
         * @param r1 开始圆的半径
         * @param x2 结束圆的圆心水平坐标
         * @param y2 结束圆的圆心垂直坐标
         * @param r2 结束圆的半径
         */
        RadialGradient.Create = function (context, x1, y1, r1, x2, y2, r2) {
            return new RadialGradient(context, x1, y1, r1, x2, y2, r2);
        };
        /**
         * 指定渐变对象中的颜色和位置
         * @param stop 介于0.0和1.0之间的值，表示渐变中开始和结束之间的位置
         * @param color 要在停止位置显示的CSS颜色值(Ark这里的颜色是ARGB)
         */
        RadialGradient.prototype.AddColorStop = function (stop, color) {
            var rgba = argbToColor(color);
            this.gradient.addColorStop(stop, rgba);
        };
        return RadialGradient;
    }(Gradient));

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     * @description 自定义拓展方法请以小写开头的驼峰命名.
     */
    /**
     * @fileoverview Canvas能力
     * @author alawnxu
     * @date 2022-07-23 15:29:49
     * @version 1.0.0
     */
    var WebCanvas = /** @class */ (function (_super) {
        __extends$1(WebCanvas, _super);
        function WebCanvas(applicationId) {
            var _this = _super.call(this, applicationId) || this;
            _this.canvas = new OffscreenCanvas(0, 0);
            _this.context = _this.canvas.getContext('2d');
            return _this;
        }
        WebCanvas.isCanvas = function (node) {
            return node.tagName === WebCanvas.tagName;
        };
        WebCanvas.prototype.GetNodeType = function () {
            return NodeTypeEnum.CANVAS;
        };
        WebCanvas.prototype.DoRenderTo = function (context, renderRect) {
            context.save();
            if (!this.canvas) {
                return;
            }
            this.canvas.width = this.canvas.width || 16;
            this.canvas.height = this.canvas.height || 16;
            context.drawImage(this.canvas, 0, 0, this.size.GetWidth(), this.size.GetHeight());
            context.restore();
        };
        /**
         * 设置宽度与大小
         * @param width
         * @param height
         */
        WebCanvas.prototype.SetSize = function (width, height) {
            _super.prototype.SetSize.call(this, width, height);
            this.canvas.width = width;
            this.canvas.height = height;
        };
        /**
         * 重置为最近保存的绘图状态
         */
        WebCanvas.prototype.Restore = function () {
            this.context.restore();
        };
        /**
         * 保存绘图状态，包括裁剪区域和变换矩阵
         */
        WebCanvas.prototype.Save = function () {
            this.context.save();
        };
        /**
         * 放缩绘图坐标
         * @param x
         * @param y
         */
        WebCanvas.prototype.Scale = function (x, y) {
            this.context.scale(x, y);
        };
        /**
         * 旋转绘图坐标
         * @param angle 角度
         */
        WebCanvas.prototype.Rotate = function (angle) {
            this.context.rotate(angle);
        };
        /**
         * 平移绘图坐标
         * @param x
         * @param y
         */
        WebCanvas.prototype.Translate = function (x, y) {
            this.context.translate(x, y);
        };
        /**
         * 设置用来填充路径的颜色或渐变
         * @param style 颜色的ARGB数值或者Gradient对象
         */
        WebCanvas.prototype.SetFillStyle = function (style) {
            if (typeof style === 'object' && style.gradient) {
                this.context.fillStyle = style.gradient;
            }
            else {
                this.context.fillStyle = argbToColor(style);
            }
        };
        /**
         * 设置用来绘制路径的颜色或渐变
         * @param style 颜色的ARGB数值或者Gradient对象
         */
        WebCanvas.prototype.SetStrokeStyle = function (style) {
            if (typeof style === 'object' && style.gradient) {
                this.context.strokeStyle = style.gradient;
            }
            else {
                this.context.strokeStyle = argbToColor(style);
            }
        };
        /**
         * 设置用来绘制路径的颜色或渐变
         * @param style 颜色的ARGB数值或者Gradient对象
         */
        WebCanvas.prototype.SetDrawStyle = function (style) { };
        /**
         * 设置虚线风格
         * @param style 表示虚线的风格，取值为0可恢复为实线
         */
        WebCanvas.prototype.SetLineDashStyle = function (style) { };
        /**
         * 设置线宽
         * @param width number
         */
        WebCanvas.prototype.SetStrokeWidth = function (width) {
            this.context.lineWidth = width;
        };
        /**
         * 设置线条末端的绘制方式
         * @param cap 表示线条末端绘制方式的数值
         */
        WebCanvas.prototype.SetStrokeCap = function (cap) {
            switch (cap) {
                case StrokeCapEnum.ROUND:
                    this.context.lineCap = 'round';
                    break;
                case StrokeCapEnum.SQUARE:
                    this.context.lineCap = 'square';
                    break;
                default:
                    this.context.lineCap = 'butt';
            }
        };
        /**
         * 设置线条连接处的绘制方式
         * @param join 表示线条连接处绘制方式的数值
         * @description 默认为尖角
         */
        WebCanvas.prototype.SetStrokeJoin = function (join) {
            switch (join) {
                case StrokeJoinEnum.ROUND:
                    this.context.lineJoin = 'round';
                    break;
                case StrokeJoinEnum.BEVEL:
                    this.context.lineJoin = 'bevel';
                    break;
                default:
                    this.context.lineJoin = 'miter';
            }
        };
        /**
         * 设置图形绘制模式，可改变Draw系列绘图方法的行为
         * @param mode 图形绘制模式
         */
        WebCanvas.prototype.SetDrawMode = function (mode) { };
        /**
         * 设置绘制内容的Alpha值
         * @param alpha
         */
        WebCanvas.prototype.SetGlobalAlpha = function (alpha) { };
        /**
         * 设置绘制内容的混合模式
         * @param mode 绘制内容的混合模式
         */
        WebCanvas.prototype.SetGlobalBlendMode = function (mode) { };
        /**
         * 清空画布
         */
        WebCanvas.prototype.Clear = function () {
            this.context.clearRect(0, 0, this.size.GetWidth(), this.size.GetHeight());
        };
        /**
         * LuaApi清空画布
         */
        WebCanvas.prototype.ClearRect = function (x, y, width, height) {
            this.context.clearRect(x, y, width, height);
        };
        /**
         * 开始新路径
         */
        WebCanvas.prototype.BeginPath = function () {
            this.context.beginPath();
        };
        /**
         * 关闭当前路径
         */
        WebCanvas.prototype.ClosePath = function () {
            this.context.closePath();
        };
        /**
         * 新建子路径并设置开始位置
         * @param x 目标位置水平坐标
         * @param y 目标位置垂直坐标
         */
        WebCanvas.prototype.MoveTo = function (x, y) {
            this.context.moveTo(x, y);
        };
        /**
         * 为当前子路径增加一条当前位置到目标位置的线段
         * @param x 线段终点位置水平坐标
         * @param y 线段终点位置垂直坐标
         */
        WebCanvas.prototype.LineTo = function (x, y) {
            this.context.lineTo(x, y);
        };
        /**
         * 基于两个端点和半径为当前子路径增加一条弧线
         * @param x1 端点1水平坐标
         * @param y1 端点1垂直坐标
         * @param x2 端点2水平坐标
         * @param y2 端点2垂直坐标
         * @param radius 圆弧半径
         * @description 当前位置和端点1、端点2构成夹角，用指定半径得到和夹角两边相切的圆，两切点为圆弧的起点和终点。
         */
        WebCanvas.prototype.ArcTo = function (x1, y1, x2, y2, radius) {
            this.context.arcTo(x1, y1, x2, y2, radius);
        };
        /**
         * 为当前子路径增加一条三次贝塞尔曲线
         * @param cpx1 和当前位置关联的控制点水平坐标
         * @param cpy1 和当前位置关联的控制点垂直坐标
         * @param cpx2 和结束位置关联的控制点
         * @param cpy2 和结束位置关联的控制点垂直坐标
         * @param x 曲线结束点水平坐标
         * @param y 曲线结束点垂直坐标
         */
        WebCanvas.prototype.BezierCurveTo = function (cpx1, cpy1, cpx2, cpy2, x, y) {
            this.context.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y);
        };
        /**
         * 为当前子路径增加一条二次贝塞尔曲线
         * @param cpx	控制点水平坐标
         * @param cpy	控制点垂直坐标
         * @param x 曲线结束点水平坐标
         * @param y 曲线结束点垂直坐标
         */
        WebCanvas.prototype.QuadraticCurveTo = function (cpx, cpy, x, y) {
            this.context.quadraticCurveTo(cpx, cpy, x, y);
        };
        /**
         * 基于圆心位置和半径为当前子路径增加一条弧线
         * @parma x 圆心水平坐标
         * @param y 圆心垂直坐标
         * @param radius 圆弧半径
         * @param startAngle 开始点的弧度
         * @param endAngle 结束点的弧度
         * @param anticlockwise 是否逆时针方向
         */
        WebCanvas.prototype.Arc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
            this.context.arc(x, y, radius, startAngle, endAngle, anticlockwise);
        };
        /**
         * 为当前路径增加矩形子路径
         * @param left 矩形的左上角水平坐标
         * @param top 矩形的左上角垂直坐标
         * @param width 矩形宽度
         * @param height 矩形高度
         */
        WebCanvas.prototype.Rectangle = function (left, top, width, height) {
            this.context.rect(left, top, width, height);
        };
        /**
         * 为当前路径增加圆形子路径
         * @param x 圆心水平坐标
         * @param y 圆心垂直坐标
         * @param radius 圆半径
         */
        WebCanvas.prototype.Circle = function (x, y, radius) { };
        /**
         * 为当前路径增加椭圆子路径
         * @param left 椭圆矩形外框的左上角水平坐标
         * @param top 椭圆矩形外框的左上角垂直坐标
         * @param width 椭圆矩形外框的宽度
         * @param height 椭圆矩形外框的高度
         */
        WebCanvas.prototype.Ellipse = function (left, top, width, height) { };
        /**
         * 使用当前路径裁剪绘图区域
         */
        WebCanvas.prototype.Clip = function () {
            this.context.clip();
        };
        /**
         * 使用当前颜色或渐变填充当前路径
         */
        WebCanvas.prototype.Fill = function () {
            this.context.fill();
        };
        /**
         * 使用当前颜色或渐变绘制当前路径
         */
        WebCanvas.prototype.Stroke = function () {
            this.context.stroke();
        };
        /**
         * 绘制线段
         * @param x1 线段起点位置水平坐标
         * @param y1 线段起点位置垂直坐标
         * @param x2 线段终点位置水平坐标
         * @param y2 线段终点位置垂直坐标
         */
        WebCanvas.prototype.DrawLine = function (x1, y1, x2, y2) { };
        /**
         * 绘制矩形
         * @param left 矩形的左上角水平坐标
         * @param top 矩形的左上角垂直坐标
         * @param width 矩形宽度
         * @param height 矩形高度
         */
        WebCanvas.prototype.DrawRectangle = function (left, top, width, height) { };
        /**
         * 绘制圆形
         * @param x 圆心水平坐标
         * @param y 圆心垂直坐标
         * @param radius 圆半径
         */
        WebCanvas.prototype.DrawCircle = function (x, y, radius) { };
        /**
         * 绘制椭圆
         * @param left 椭圆矩形外框的左上角水平坐标
         * @param top 椭圆矩形外框的左上角垂直坐标
         * @param width 椭圆矩形外框的宽度
         * @param height 椭圆矩形外框的高度
         */
        WebCanvas.prototype.DrawEllipse = function (left, top, width, height) { };
        /**
         * 绘制图像
         * @param img	Image对象
         * @param left 绘制目标位置的左上角水平坐标
         * @param top 绘制目标位置的左上角垂直坐标
         * @param width 绘制目标位置的宽度
         * @param height 绘制目标位置的高度
         */
        WebCanvas.prototype.DrawImage = function (image, left, top, width, height) {
            console.warn('[Engine] DrawImage width,height', image, width, height);
            if (!image) {
                return;
            }
            var destRect = new ARKRect(left, top, left + width, top + height);
            if (image.IsType(NodeTypeEnum.IMAGE)) {
                console.warn('[Engine] DrawImage isType Image');
                var bitmap = image.GetBitmap();
                console.warn('[Engine] DrawImage bitmap', bitmap);
                if (!bitmap) {
                    return;
                }
                this.context.save();
                this.context.translate(left, top);
                this.context.beginPath();
                this.context.rect(0, 0, width, height);
                this.context.clip();
                console.warn('[Engine] DrawImage width,height', width, height);
                this.context.drawImage(bitmap, 0, 0, width, height);
                this.context.closePath();
                this.context.restore();
                this.UpdateCanvas(destRect);
            }
        };
        /**
         * 绘制视图
         * @param view View对象
         * @param left 绘制目标位置的左上角水平坐标
         * @param top 绘制目标位置的左上角垂直坐标
         * @param width 绘制目标位置的宽度
         * @param height 绘制目标位置的高度
         */
        WebCanvas.prototype.DrawView = function (view, left, top, width, height) { };
        /**
         * 绘制画布内容
         * @param canvas Canvas对象
         * @param left 绘制目标位置的左上角水平坐标
         * @param top 绘制目标位置的左上角垂直坐标
         * @param width 绘制目标位置的宽度
         * @param height 绘制目标位置的高度
         */
        WebCanvas.prototype.DrawCanvas = function (canvas, left, top, width, height) { };
        /**
         * 创建线性颜色渐变的Gradient对象
         * @param x1 渐变起点位置水平坐标
         * @param y1 渐变起点位置垂直坐标
         * @param x2 渐变终点位置水平坐标
         * @param y2 渐变终点位置垂直坐标
         */
        WebCanvas.prototype.CreateLinearGradient = function (x1, y1, x2, y2) {
            return LinearGradient.Create(this.context, x1, y1, x2, y2);
        };
        /**
         * 创建放射颜色渐变的Gradient对象
         * @param x1 开始圆的圆心水平坐标
         * @param y1 开始圆的圆心垂直坐标
         * @param r1 开始圆的半径
         * @param x2 结束圆的圆心水平坐标
         * @param y2 结束圆的圆心垂直坐标
         * @param r2 结束圆的半径
         */
        WebCanvas.prototype.CreateRadialGradient = function (x1, y1, r1, x2, y2, r2) {
            return RadialGradient.Create(this.context, x1, y1, r1, x2, y2, r2);
        };
        WebCanvas.prototype.SetValue = function (value) {
            throw new Error('Method not implemented.');
        };
        /**
         * 释放资源
         */
        WebCanvas.prototype.Release = function () {
            _super.prototype.Release.call(this);
        };
        /**
         * 更新Canvas之后需要有事件触发
         * @param rcUpdate
         */
        WebCanvas.prototype.UpdateCanvas = function (rcUpdate) {
            if (!rcUpdate.IsEmpty()) {
                var rcCanvas = new ARKRect(0, 0, this.size.GetWidth(), this.size.GetHeight());
                rcUpdate.IntersectRect(rcUpdate, rcCanvas);
                this.DoChange(rcUpdate);
            }
        };
        WebCanvas.tagName = 'CANVAS';
        return WebCanvas;
    }(WebUIObject));

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     * @description 自定义拓展方法请以小写开头的驼峰命名.
     */
    /**
     * 节点序列化
     * @author alawnxu
     * @date 2022-07-14 21:09:11
     * @version 1.0.0
     */
    var logger$g = Logger.getLogger('SerializerObject');
    /**
     * 指定元素标签序列化
     * @returns
     */
    function TagSerializerObject(application, element) {
        var pObject = null;
        var applicationId = application.GetApplicationId();
        switch (element.tagName.toUpperCase()) {
            case WebView.tagName:
                pObject = new WebView(applicationId);
                break;
            case WebText.tagName:
                pObject = new WebText(applicationId);
                break;
            case WebImage.tagName:
                pObject = new WebImage(applicationId);
                break;
            case WebTexture.tagName:
                pObject = new WebTexture(applicationId);
                break;
            case WebCanvas.tagName:
                pObject = new WebCanvas(applicationId);
                break;
            default:
        }
        if (!pObject) {
            return null;
        }
        return SerializerObject(application, element, pObject);
    }
    /**
     * 先暂时用WebUIObject.后面还会有其它类型
     * @param pObject
     * @param application
     * @returns
     */
    function SerializerObject(application, element, pObject) {
        var serializer = null;
        var nodeType = pObject.GetNodeType();
        switch (nodeType) {
            case NodeTypeEnum.VIEW:
                serializer = new ViewSerializer(application, element, pObject);
                break;
            case NodeTypeEnum.TEXT:
                serializer = new TextSerializer(application, element, pObject);
                break;
            case NodeTypeEnum.IMAGE:
                serializer = new ImageSerializer(application, element, pObject);
                break;
            case NodeTypeEnum.TEXTURE:
                serializer = new TextureSerializer(application, element, pObject);
                break;
            case NodeTypeEnum.CANVAS:
                serializer = new CanvasSerializer(application, element, pObject);
                break;
            default:
                logger$g.warn('not supported');
        }
        if (serializer) {
            serializer.read();
        }
        return pObject;
    }

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     * @description 自定义拓展方法请以小写开头的驼峰命名.
     */
    /**
     * @fileoverview 根视图管理
     * @author alawnxu
     * @date 2022-07-19 15:57:48
     * @version 1.0.0
     * @description 为全局方法 GetRootView() 等提供的存储能力
     * @TODO 要注意内存溢出.
     */
    var logger$f = Logger.getLogger('RootViewManager');
    var RootViewManager = /** @class */ (function () {
        function RootViewManager() {
        }
        /**
         * 新增根 rootView
         * @param applicationId 每次创建的应用的ID.唯一
         * @param pView 根视图
         * @returns
         */
        RootViewManager.AddRootView = function (applicationId, pView) {
            if (!pView || !applicationId) {
                return false;
            }
            var views = RootViewManager.viewMap.get(applicationId);
            views = Array.isArray(views) ? views : [];
            views.push(pView);
            logger$f.debug('AddRootView applicationId:', applicationId, ', viewId:', pView.GetID());
            RootViewManager.viewMap.set(applicationId, views);
            return true;
        };
        /**
         * 获取根视图
         * @param applicationId 唯一的应用ID
         * @param id 视图ID
         * @returns
         */
        RootViewManager.GetRootView = function (applicationId, id) {
            if (!applicationId || !id) {
                return null;
            }
            var views = RootViewManager.viewMap.get(applicationId);
            if (!views || !Array.isArray(views)) {
                return null;
            }
            var pView = views.find(function (view) { return view.GetID() === id; });
            return pView || null;
        };
        /**
         * 获取根视图
         * @param applicationId 唯一的应用ID
         * @param id 视图ID
         * @returns
         */
        RootViewManager.GetApplicationRootViews = function (applicationId) {
            if (!applicationId) {
                return null;
            }
            var views = RootViewManager.viewMap.get(applicationId);
            return Array.isArray(views) ? views : [];
        };
        /**
         * 根据 applicationId 移除根视图
         * @param applicationId 唯一的应用ID
         */
        RootViewManager.RemoveRootView = function (applicationId) {
            if (!applicationId) {
                return null;
            }
            RootViewManager.viewMap.delete(applicationId);
        };
        RootViewManager.viewMap = new Map();
        return RootViewManager;
    }());

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     */
    var logger$e = Logger.getLogger('WebApplication');
    var WebApplication = /** @class */ (function (_super) {
        __extends$1(WebApplication, _super);
        function WebApplication() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 创建一个视图
         * @param viewId 视图ID
         * @param isRoot
         * @description 这里设计为一个抽象方法.方便不同渠道实现
         * @TODO 这里需要解析模板
         */
        WebApplication.prototype.CreateView = function (templateId, isRoot) {
            var templates = this.templates;
            var template = templates[templateId];
            var pView = null;
            if (template) {
                var doc = AST.parser(template);
                var rootNode = doc.documentElement;
                pView = this.DoCreateView(rootNode, isRoot);
                if (!pView) {
                    logger$e.error("CreateView(".concat(templateId, "): pView is null."));
                    return null;
                }
            }
            // 如果是根节点.此时触发 OnCreateView 事件
            if (pView && isRoot) {
                /**
                 * 注册当前根视图
                 * @description 需要通过 GetRootView(id) 全局方法获取到对应的根视图
                 */
                RootViewManager.AddRootView(this.applicationId, pView);
                this.FireEvent(LifeCycleEnum.ON_CREATE_VIEW, pView, templateId);
            }
            // @TODO 事件处理
            return pView;
        };
        /**
         * 释放资源
         * @TODO 先不置空先, 由于时序问题, 盲目置空可能会抛异常
         */
        WebApplication.prototype.Release = function () {
            var _this = this;
            var views = RootViewManager.GetApplicationRootViews(this.applicationId);
            views.forEach(function (pView) {
                _this.FireEvent(LifeCycleEnum.ON_DESTROY_VIEW, pView);
            });
            RootViewManager.RemoveRootView(this.applicationId);
            // 还有Destroy事件没有处理.不要着急 Release 掉事件
            _super.prototype.Release.call(this);
        };
        /**
         * 创建一个视图
         * @param element 元素
         * @param root 是否为根节点
         * @param bRoot
         * @returns
         */
        WebApplication.prototype.DoCreateView = function (element, root) {
            if (!element) {
                return null;
            }
            // 需要注意的是 xmldom 的 tagName 是元素的真实属性. 而 DOMParser 是全大写的
            if (element.tagName.toUpperCase() !== WebView.tagName) {
                return;
            }
            var view = new WebView(this.applicationId);
            view.SetRoot(Boolean(root));
            SerializerObject(this, element, view);
            return view;
        };
        /**
         * 事件异常监控
         * @param name 异常事件名称
         * @param script 异常事件脚本
         * @param error 错误信息
         */
        WebApplication.prototype.EventCatchErrorHandle = function (name, script, error) {
            WebReport.error(this.app, TracerTagEnum.ARK_EVENT_EXCEPTION, error, {
                eventName: name,
                eventScript: script,
            });
        };
        return WebApplication;
    }(Application));

    /**
     * @fileoverview post message
     * @author alawnxu
     * @date 2022-09-03 18:58:44
     * @version 1.0.0
     */
    /**
     * 消息类型枚举
     * @enum CONNECT 建立连接
     * @enum REGISTER_APPLICATION 注册应用
     * @enum UPDATE_APPLICATION 更新应用
     * @enum REMOVE_APPLICATION 移除应用
     * @enum HEARTBEAT 心跳
     * @enum SET_CONFIG 更新配置
     * @enum MOUNT 挂载
     * @enum UNMOUNT 卸载
     *
     * @enum SET_COOKIE 设置COOKIE
     * @enum HTTP_PROXY 请求代理
     */
    var PostMessageTypeEnum;
    (function (PostMessageTypeEnum) {
        PostMessageTypeEnum["CONNECT"] = "connect";
        PostMessageTypeEnum["REGISTER_APPLICATION"] = "register_application";
        PostMessageTypeEnum["UPDATE_APPLICATION"] = "update_application";
        PostMessageTypeEnum["REMOVE_APPLICATION"] = "remove_application";
        PostMessageTypeEnum["HEARTBEAT"] = "heartbeat";
        PostMessageTypeEnum["SET_CONFIG"] = "set_config";
        PostMessageTypeEnum["MOUNT"] = "mount";
        PostMessageTypeEnum["UNMOUNT"] = "unmount";
        PostMessageTypeEnum["SET_COOKIE"] = "set_cookie";
        PostMessageTypeEnum["HTTP_PROXY"] = "http_proxy";
    })(PostMessageTypeEnum || (PostMessageTypeEnum = {}));

    /**
     * 推送消息枚举
     * @enum PAINT 绘制 Ark 消息
     * @enum UPDATE_CONTAINER_SIZE 更新容器大小
     * @enum ADD_DOMAIN pskey 新增域名
     * @enum REPORT_VALUE 上报 metrics value
     * @enum REPORT_COUNT 上报 metrics count
     * @enum REPORT_LOG 上报 log 日志
     * @enum REPORT_ERROR 上报 error 日志
     */
    var WorkerPushMessageTypeEnum;
    (function (WorkerPushMessageTypeEnum) {
        WorkerPushMessageTypeEnum["ADD_DOMAIN"] = "add_domain";
        WorkerPushMessageTypeEnum["REPORT_VALUE"] = "report_value";
        WorkerPushMessageTypeEnum["REPORT_COUNT"] = "report_count";
        WorkerPushMessageTypeEnum["REPORT_LOG"] = "report_log";
        WorkerPushMessageTypeEnum["REPORT_ERROR"] = "report_error";
        WorkerPushMessageTypeEnum["EMITTER"] = "emitter";
    })(WorkerPushMessageTypeEnum || (WorkerPushMessageTypeEnum = {}));
    /**
     * 主进程消息推送枚举
     * @enum REFRESH_PSKEY 刷新 pskey
     * @enum REFRESH_SKEY 刷新 skey
     */
    var MainThreadPushMessageTypeEnum;
    (function (MainThreadPushMessageTypeEnum) {
        MainThreadPushMessageTypeEnum["REFRESH_PSKEY"] = "refresh_pskey";
        // 事件处理有点复杂.而且相对会有比较高的延迟. @shaobin 抽时间看下有没有好的解决方案
        MainThreadPushMessageTypeEnum["ON_CLICK"] = "on_click";
        MainThreadPushMessageTypeEnum["ON_MOUSE_DOWN"] = "on_mouse_down";
        MainThreadPushMessageTypeEnum["ON_MOUSE_UP"] = "on_mouse_up";
    })(MainThreadPushMessageTypeEnum || (MainThreadPushMessageTypeEnum = {}));

    var ErrorMsg;
    (function (ErrorMsg) {
        ErrorMsg["PARAM_ERROR"] = "PARAM_ERROR";
        ErrorMsg["TYPE_ERROR"] = "TYPE_ERROR";
        ErrorMsg["TIMEOUT"] = "TIMEOUT";
        ErrorMsg["APPLICATION_NOT_EXIST"] = "APPLICATION_NOT_EXIST";
        ErrorMsg["WORKER_ERROR"] = "WORKER_ERROR";
        ErrorMsg["MESSAGE_ERROR"] = "MESSAGE_ERROR";
        ErrorMsg["PARSE_ERROR"] = "PARSE_ERROR";
        ErrorMsg["APP_CODE_NOT_SET"] = "APP_CODE_NOT_SET";
        ErrorMsg["WORKER_CREATE_ERROR"] = "WORKER_CREATE_ERROR";
    })(ErrorMsg || (ErrorMsg = {}));

    var MsgType;
    (function (MsgType) {
        MsgType["POST"] = "post";
        MsgType["PUSH"] = "push";
        MsgType["RESPONSE"] = "response";
        MsgType["BROADCAST"] = "broadcast";
    })(MsgType || (MsgType = {}));

    /**
     * @fileoverview PromiseWorker
     * @author alawnxu
     * @date 2022-08-30 11:40:22
     * @version 1.0.0
     * @description
     * 主要功能：
     * 通信的时候有些麻烦, main thread -> worker 都是使用的 message 进行监听的, 两者直接并没有任何关联.
     * 开发的时候通过通信的方式比较难建立两者的联系，这里往上封装一层，让通信具备类似 promise 的能力
     */
    var logger$d = Logger.getLogger('Worker PromiseWorker');
    /**
     * 默认 PostMessage 超时时长
     */
    var DEFAULT_POSTMESSAGE_TIMEOUT = 0.5 * 1000;
    var POST_MESSAGE_TIMEOUT_ERROR = new Error(ErrorMsg.TIMEOUT);
    var PromiseWorker = /** @class */ (function () {
        function PromiseWorker() {
            /**
             * message 回调的处理
             */
            this.messageCallbackMap = new Map();
        }
        /**
         * 设置 worker
         * @param worker
         */
        PromiseWorker.prototype.setWorker = function (worker) {
            this.worker = worker;
        };
        /**
         * push消息.这类消息为单方向主动推送，不会回包
         * @description push 消息不会生成 msgId
         */
        PromiseWorker.prototype.pushMessage = function (type, data) {
            this.worker.postMessage({
                msgType: MsgType.PUSH,
                startTime: Date.now(),
                type: type,
                data: data,
            });
        };
        /**
         * 发送消息
         * @param type 事件类型
         * @param data 事件参数
         */
        PromiseWorker.prototype.postMessage = function (type, data, timeout, transfer) {
            var _this = this;
            var msgId = "MSG_".concat(String(type), "_").concat(uuid());
            var postTimeout = parseInt(String(timeout), 10) || DEFAULT_POSTMESSAGE_TIMEOUT;
            var startTime = Date.now();
            return new Promise(function (resolve, reject) {
                try {
                    /**
                     * postMessage 本身也会抛出异常. 当传递的参数无法被序列化的时候
                     * @example 如 post 了一个 function
                     * Uncaught DOMException: Failed to execute 'postMessage' on 'Worker': function(){console.log("test")} could not be cloned.
                     * @see 可以被结构化克隆的数据 {@link  https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm}
                     */
                    _this.worker.postMessage({
                        msgType: MsgType.POST,
                        msgId: msgId,
                        type: type,
                        data: data || {},
                        startTime: startTime,
                    }, {
                        transfer: Array.isArray(transfer) ? transfer : [],
                    });
                }
                catch (e) {
                    logger$d.error('postMessage error.', e);
                    reject(e);
                    return;
                }
                var timer = null;
                if (postTimeout) {
                    timer = setTimeout(function () {
                        _this.messageCallbackMap.delete(msgId);
                        // 这里还是不要直接抛异常的好, 可能会导致 Ark 消息渲染出现空白
                        // 当然 connect 和 heartbeat 除外
                        if (type === PostMessageTypeEnum.CONNECT || type === PostMessageTypeEnum.HEARTBEAT) {
                            reject(POST_MESSAGE_TIMEOUT_ERROR);
                        }
                    }, postTimeout);
                }
                _this.messageCallbackMap.set(msgId, function (result) {
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
                    var costTime = Date.now() - startTime;
                    resolve(result);
                    WebReport.reportValue(MetricsReportEventEnum.ARK_POST_MESSAGE_RESPONSE_TIME, costTime, null, {
                        type: type,
                    });
                });
            });
        };
        /**
         * 响应消息
         * @description 需要回传消息给 Worker . 此时带上 msgId
         */
        PromiseWorker.prototype.responseMessage = function (type, msgId, data) {
            this.worker.postMessage({
                msgType: MsgType.RESPONSE,
                startTime: Date.now(),
                type: type,
                msgId: msgId,
                data: data,
            });
        };
        /**
         * 接收消息
         */
        PromiseWorker.prototype.onMessageHandle = function () {
            var _this = this;
            var _a;
            (_a = this.worker) === null || _a === void 0 ? void 0 : _a.addEventListener('message', function (event) {
                if (!event.data) {
                    return;
                }
                var _a = event.data, type = _a.type, data = _a.data, msgType = _a.msgType, startTime = _a.startTime;
                logger$d.debug(Env.isMainThread ? '【main】' : "\u3010worker(".concat(self.name, ")\u3011"), 'thread receive message. type:', type, event, ', cost:', Date.now() - startTime);
                // 上报一些数据
                if (type && startTime) {
                    if (Env.isMainThread) {
                        WebReport.reportValue(MetricsReportEventEnum.MAINTHREAD_RECEIVE_MESSAGE_TIME, Date.now() - startTime, null, {
                            type: type,
                        });
                    }
                    else {
                        WebReport.reportValue(MetricsReportEventEnum.WORKER_RECEIVE_MESSAGE_TIME, Date.now() - startTime, null, {
                            type: type,
                        });
                    }
                }
                // push 消息
                if (msgType === MsgType.PUSH) {
                    _this.receivePushMessage(event);
                    return;
                }
                // post 消息
                if (msgType === MsgType.POST) {
                    _this.receivePostMessage(event);
                    return;
                }
                // response 消息自动处理
                if (msgType === MsgType.RESPONSE) {
                    var msgId = event.data.msgId;
                    var callback = _this.messageCallbackMap.get(msgId);
                    // 如果是回的消息.则直接走 callback
                    if (typeof callback === 'function') {
                        callback({
                            msgId: msgId,
                            type: type,
                            data: data,
                        });
                        _this.messageCallbackMap.delete(msgId);
                    }
                    return;
                }
                _this.receiveCustomMessage(event);
            });
        };
        /**
         * 自定义接收消息后的处理
         * @description 可以重写
         */
        PromiseWorker.prototype.receiveCustomMessage = function (event) {
            logger$d.debug('receive custom message:', event.data);
        };
        return PromiseWorker;
    }());

    /**
     * @fileoverview Worker 客户端
     * @author alawnxu
     * @date 2022-08-25 15:40:45
     * @version 1.0.0
     * @description 运行在主线程
     */
    /**
     * 心跳检测间隔
     * @description 心跳连接超时时长. 时长待斟酌，但是不能太小，可以上报上去看看。
     */
    var DEFAULT_HEARTBEAT_TIMEOUT = 30 * 1000;
    /**
     * 柔性销毁时间间隔
     */
    var FLEXIBLE_TERMINATE_INTERVAL = 5 * 60 * 1000;
    var UNKNOWN$1 = 'unknown';
    /**
     * @enum DISCONNECT 断开连接
     * @enum INACTIVATION 一段事件之内没有消息的往来, 则会触发 inactivation 事件. 申请主动销毁
     */
    var EventTypeEnum;
    (function (EventTypeEnum) {
        EventTypeEnum["DISCONNECT"] = "disconnect";
        EventTypeEnum["INACTIVATION"] = "inactivation";
    })(EventTypeEnum || (EventTypeEnum = {}));
    var TaskStatus;
    (function (TaskStatus) {
        TaskStatus["WAIT"] = "wait";
        TaskStatus["MOUNTING"] = "mounting";
        TaskStatus["MOUNTED"] = "mounted";
        TaskStatus["FAILED"] = "failed";
    })(TaskStatus || (TaskStatus = {}));
    var logger$c = Logger.getLogger('Worker WorkerClient');
    var WorkerClient = /** @class */ (function (_super) {
        __extends$1(WorkerClient, _super);
        /**
         * @param url Yoga 和引擎的 ObjectURL
         */
        function WorkerClient(url, name) {
            var _this = _super.call(this) || this;
            /**
             * 当前线程池中的 Ark 应用集合
             */
            _this.appSet = new Set();
            /**
             * 挂载任务
             * @description 存 traceId
             */
            _this.taskMap = new Map();
            /**
             * 已经注册的任务数
             * @description 通过任务数让渲染尽可能均衡
             */
            _this.taskCount = 0;
            /**
             * 是否已经过期
             * @description 当更新 Ark 引擎之后会过期
             */
            _this.expired = false;
            /**
             * 柔性销毁时间
             */
            _this.flexibleTerminateTimer = null;
            _this.name = name;
            _this.expired = false;
            _this.listener = new BaseEventListener();
            _this.initWorker(url);
            // 创建的时候就开始销毁任务
            _this.startFlexibleTerminate();
            return _this;
        }
        /**
         * 挂载一个应用
         * @param options
         * @description 这里比较简单. 如果挂载失败后直接上报错误即可。
         * @pass
         */
        WorkerClient.prototype.mount = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator$1(this, function (_a) {
                    this.taskCount++;
                    this.taskMap.set(options.traceId, {
                        info: options,
                        status: TaskStatus.WAIT,
                    });
                    this.restartFlexibleTerminate();
                    return [2 /*return*/, this.doMount(options)];
                });
            });
        };
        /**
         * 卸载一个 Ark 应用
         * @param appid 应用ID
         * @param traceId 索引ID
         * @description 这里比较简单. 如果挂载失败后直接上报错误即可。
         * @pass
         */
        WorkerClient.prototype.unmount = function (appid, traceId) {
            return __awaiter$1(this, void 0, void 0, function () {
                var e_1;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.postMessage(PostMessageTypeEnum.UNMOUNT, {
                                    appid: appid,
                                    traceId: traceId,
                                })];
                        case 1:
                            _a.sent();
                            this.removeTask(traceId);
                            // 如果已经没有挂载任务了, 且已经过期. 则直接断开连接. 等待下一次重新创建
                            if (this.isEmpty() && this.expired) {
                                this.disconnect();
                            }
                            return [2 /*return*/, true];
                        case 2:
                            e_1 = _a.sent();
                            this.removeTask(traceId);
                            this.catchPostMessageError(e_1, PostMessageTypeEnum.UNMOUNT, appid);
                            if (this.isEmpty() && this.expired) {
                                this.disconnect();
                            }
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 注册应用
         * @param appid 应用 ID
         * @param appCode 应用代码
         * @pass
         */
        WorkerClient.prototype.registerApplication = function (appid, appCode) {
            return __awaiter$1(this, void 0, void 0, function () {
                var data, e_2;
                var _this = this;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.postMessage(PostMessageTypeEnum.REGISTER_APPLICATION, {
                                    appid: appid,
                                    appCode: appCode,
                                }, null)];
                        case 1:
                            data = (_a.sent()).data;
                            // 初始化的时候抛异常了. 这种比较严重了, 最好还是告警出来会好点
                            if (data === null || data === void 0 ? void 0 : data.error) {
                                this.catchPostMessageError(data.error, PostMessageTypeEnum.REGISTER_APPLICATION, appid);
                                // 不用 removeApplication. 因为异常了就没有加进去
                                return [2 /*return*/, false];
                            }
                            this.appSet.add(appid);
                            this.taskMap.forEach(function (task) {
                                if (task.status === TaskStatus.WAIT) {
                                    _this.doMount(task.info);
                                }
                            });
                            return [2 /*return*/, true];
                        case 2:
                            e_2 = _a.sent();
                            this.catchPostMessageError(e_2, PostMessageTypeEnum.REGISTER_APPLICATION, appid);
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 更新应用
         * @param appid 应用 ID
         * @param appCode 应用代码
         * @description 更新的时候有些不太一样，更新的场景不需要刷新应用，如果后续有需要可以支持下. 即使 available: false, 此时更新还是可以支持的。
         * @pass
         */
        WorkerClient.prototype.updateApplication = function (appid, appCode) {
            return __awaiter$1(this, void 0, void 0, function () {
                var data, e_3;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.postMessage(PostMessageTypeEnum.UPDATE_APPLICATION, {
                                    appid: appid,
                                    appCode: appCode,
                                }, null)];
                        case 1:
                            data = (_a.sent()).data;
                            // 初始化的时候抛异常了. 这种比较严重了, 最好还是告警出来会好点
                            if (data === null || data === void 0 ? void 0 : data.error) {
                                logger$c.error('register application error.', data.error);
                                // 这里还是不移除吧. 如果之前存在, 说明至少之前的应用是可用的
                                return [2 /*return*/, false];
                            }
                            return [2 /*return*/, true];
                        case 2:
                            e_3 = _a.sent();
                            this.catchPostMessageError(e_3, PostMessageTypeEnum.UPDATE_APPLICATION, appid);
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 移除一个应用
         * @param application 应用
         */
        WorkerClient.prototype.removeApplication = function (appid) {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator$1(this, function (_a) {
                    try {
                        logger$c.debug('remove application. appid :', appid);
                        this.postMessage(PostMessageTypeEnum.REMOVE_APPLICATION, {
                            appid: appid,
                        });
                        this.appSet.delete(appid);
                        return [2 /*return*/, true];
                    }
                    catch (e) {
                        this.catchPostMessageError(e, PostMessageTypeEnum.REMOVE_APPLICATION, appid);
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * 销毁 worker
         * @pass
         */
        WorkerClient.prototype.terminate = function () {
            var webWorker = this.worker;
            this.appSet.clear();
            this.taskMap.clear();
            if (typeof (webWorker === null || webWorker === void 0 ? void 0 : webWorker.terminate) === 'function') {
                webWorker.terminate();
            }
        };
        /**
         * 检查心跳
         * @pass
         */
        WorkerClient.prototype.heartbeat = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var e_4;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.postMessage(PostMessageTypeEnum.HEARTBEAT, null, DEFAULT_HEARTBEAT_TIMEOUT)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                        case 2:
                            e_4 = _a.sent();
                            this.catchPostMessageError(e_4, PostMessageTypeEnum.HEARTBEAT);
                            if ((e_4 === null || e_4 === void 0 ? void 0 : e_4.message) === ErrorMsg.TIMEOUT) {
                                return [2 /*return*/, false];
                            }
                            // @TODO 其它错误也暂定仍然通信成功
                            return [2 /*return*/, true];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 更新配置
         * @param appid
         * @param traceId
         * @param config
         */
        WorkerClient.prototype.setConfig = function (appid, traceId, config) {
            return __awaiter$1(this, void 0, void 0, function () {
                var e_5;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.postMessage(PostMessageTypeEnum.SET_CONFIG, {
                                    appid: appid,
                                    traceId: traceId,
                                    config: config,
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                        case 2:
                            e_5 = _a.sent();
                            this.catchPostMessageError(e_5, PostMessageTypeEnum.SET_CONFIG);
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 触发事件
         * @param type 事件类型
         * @param data
         */
        WorkerClient.prototype.triggerEvent = function (type, data) {
            this.pushMessage(type, data);
        };
        /**
         * 绑定事件
         * @param type 事件类型
         * @param handler 回调函数
         */
        WorkerClient.prototype.on = function (type, handler) {
            this.listener.AttachEvent(type, handler);
        };
        /**
         * 取消事件
         * @param type 事件类型
         * @param handler 回调函数
         */
        WorkerClient.prototype.off = function (type, handler) {
            this.listener.DetachEvent(type, handler);
        };
        /**
         * 广播事件消息
         * @param type 广播消息
         * @param data
         * @description 这里单个的 worker 实际上就 push 消息就好了
         */
        WorkerClient.prototype.broadcast = function (type, data) {
            this.pushMessage(type, data);
        };
        /**
         * 获取当前任务数
         */
        WorkerClient.prototype.getTaskCount = function () {
            return this.taskCount;
        };
        /**
         * 获取 wait 的 Ark 消息数
         */
        WorkerClient.prototype.getWaitTaskCount = function () {
            var count = 0;
            this.taskMap.forEach(function (task) {
                if (task.status === TaskStatus.WAIT) {
                    count++;
                }
            });
            return count;
        };
        /**
         * 根据 traceId 获取任务
         */
        WorkerClient.prototype.getTask = function (traceId) {
            if (!traceId) {
                return null;
            }
            var task = this.taskMap.get(traceId);
            return task;
        };
        /**
         * 当前 worker 的挂载任务是否为空
         */
        WorkerClient.prototype.isEmpty = function () {
            return this.taskMap.size === 0;
        };
        /**
         * 当前 worker 的挂载任务不为空
         */
        WorkerClient.prototype.isNotEmpty = function () {
            return !this.isEmpty();
        };
        /**
         * 存在某一个应用
         * @param appid 应用ID
         */
        WorkerClient.prototype.hasApplication = function (appid) {
            return this.appSet.has(appid);
        };
        /**
         * 连接 worker
         * @param timeout 超时时长
         * @description 建立连接之前, 请先通过 WebApplicationApi.setContext 设置上下文
         */
        WorkerClient.prototype.connect = function (timeout) {
            return __awaiter$1(this, void 0, void 0, function () {
                var startTime, connectData, e_6;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = Date.now();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            connectData = this.getConnectData();
                            logger$c.debug('establish connection.... context:', connectData);
                            return [4 /*yield*/, this.postMessage(PostMessageTypeEnum.CONNECT, connectData, timeout)];
                        case 2:
                            _a.sent();
                            // 这里实际上不会抛异常了. 因为实例化 worker 的时候只传入了 engine 和 yoga 代码. 所以这里不会有异常. 除非本身引擎存在死循环这种. 但是这种也不会存在初始化的时候.
                            // await this.postMessage(PostMessageTypeEnum.CONNECT, connectData, timeout);
                            logger$c.debug('connection success. time:', "".concat(Date.now() - startTime, "ms"));
                            return [2 /*return*/, true];
                        case 3:
                            e_6 = _a.sent();
                            // 如果连接都失败了, 那么直接断开连接，马上销毁 worker
                            this.disconnect();
                            this.catchPostMessageError(e_6, PostMessageTypeEnum.CONNECT);
                            return [2 /*return*/, false];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 设置过期
         */
        WorkerClient.prototype.setExpired = function () {
            this.expired = true;
        };
        /**
         * 是否已经过期
         */
        WorkerClient.prototype.isExpired = function () {
            return this.expired;
        };
        /**
         * 断开连接
         */
        WorkerClient.prototype.disconnect = function () {
            this.listener.FireEvent(EventTypeEnum.DISCONNECT);
        };
        /**
         * 主动断开连接
         */
        WorkerClient.prototype.inactivation = function () {
            // 如果存在没有卸载的 ark 消息, 则不做处理. 否则可能会白屏 (why?)
            if (this.isNotEmpty()) {
                return;
            }
            this.listener.FireEvent(EventTypeEnum.INACTIVATION);
        };
        /**
         * 开启自动柔性销毁
         * @description 如果 postMessage 超时后立即强制终止 worker. 可能会导致偶尔的一次超时，而后续的 postMessage 无法被响应，导致出现渲染空白
         * 当然如果当 Worker 的状态恢复正常，该策略也会被同时终止。
         * 1、同时当任务为0的时候也会开启这个策略
         */
        WorkerClient.prototype.startFlexibleTerminate = function () {
            var _this = this;
            if (this.flexibleTerminateTimer) {
                return;
            }
            this.flexibleTerminateTimer = setTimeout(function () {
                // 主动断开连接
                _this.inactivation();
                // 继续执行任务. 因为主动断开连接不一定会断开, 防止出现僵尸 worker
                _this.restartFlexibleTerminate();
            }, FLEXIBLE_TERMINATE_INTERVAL);
        };
        /**
         * 重新开始柔性销毁策略
         */
        WorkerClient.prototype.restartFlexibleTerminate = function () {
            if (this.flexibleTerminateTimer) {
                clearTimeout(this.flexibleTerminateTimer);
                this.flexibleTerminateTimer = null;
            }
            this.startFlexibleTerminate();
        };
        /**
         * post 消息分发
         */
        WorkerClient.prototype.receivePostMessage = function (event) {
            var receive = event.data;
            if (!receive) {
                return;
            }
            switch (receive.type) {
                case PostMessageTypeEnum.SET_COOKIE:
                    this.doSetCookie(receive);
                    break;
                case PostMessageTypeEnum.HTTP_PROXY:
                    this.doHttpProxy(receive);
                    break;
                default:
            }
        };
        /**
         * push消息分发
         */
        WorkerClient.prototype.receivePushMessage = function (event) {
            var receive = event.data;
            switch (receive.type) {
                case WorkerPushMessageTypeEnum.REPORT_COUNT:
                    this.doReportCount(receive);
                    break;
                case WorkerPushMessageTypeEnum.REPORT_VALUE:
                    this.doReportValue(receive);
                    break;
                case WorkerPushMessageTypeEnum.REPORT_LOG:
                    this.doReportLog(receive);
                    break;
                case WorkerPushMessageTypeEnum.REPORT_ERROR:
                    this.doReportError(receive);
                    break;
                case WorkerPushMessageTypeEnum.EMITTER:
                    this.emitter(receive);
                    break;
                default:
            }
        };
        /**
         * 初始化 Worker
         * @param url Yoga 和引擎的 ObjectURL
         */
        WorkerClient.prototype.initWorker = function (url) {
            var _this = this;
            var startTime = Date.now();
            // 这部分耗时其实还好.大概在 4ms 内.可以上报到监控平台看下数据
            var worker = new Worker(url, {
                name: this.name,
            });
            logger$c.debug('worker created. time:', "".concat(Date.now() - startTime, "ms"));
            // 设置 worker
            this.setWorker(worker);
            this.onMessageHandle();
            /**
             * 当 worker 内部出现异常会触发 error 事件.
             *
             * 如：实例化 worker 的时候抛出异常
             * @example
             * const blob = new Blob(["throw new Error('NullPointerException')"]);
             * const url = URL.createObjectURL(blob);
             * const worker = new Worker(url);
             * 此时 worker 已经不可用
             *
             * 如：如果 worker 内部发送了无法被结构化算法克隆的数据时，也会触发 error
             * const blob = new Blob(["self.postMessage({a: function() {} })"]);
             * const url = URL.createObjectURL(blob);
             * const worker = new Worker();
             * 但是此时并不代表 worker 已经不可用。但是它竟然无法被 worker 内部的 error | messageerror捕获到
             * @see 可以被结构化克隆的数据 {@link  https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm}
             *
             * @description 需要注意的是，触发 error 后服务不一定不可用. 所以不能清理 worker
             */
            worker.addEventListener('error', function (error) {
                logger$c.error('worker error. event:', error);
                _this.catchWorkerError(ErrorMsg.WORKER_ERROR, error);
                //  当出现异常的时候. 手动触发一次心跳
                _this.heartbeat();
            });
            /**
             * 当 Worker 对象接收到一条无法被反序列化的消息时会触发该事件.
             * @description 没找到触发场景, Object 死循环也不行
             */
            worker.addEventListener('messageerror', function (event) {
                logger$c.error('worker messageerror. event:', event);
                _this.catchWorkerError(ErrorMsg.MESSAGE_ERROR);
            });
        };
        /**
         * 获取 connect 数据
         */
        WorkerClient.prototype.getConnectData = function () {
            var context = WebApplicationApi.getContext();
            var connectData = {
                logger: context.getLoggerConfig(),
                debug: context.isDebug(),
                uin: context.getUin(),
                tinyId: context.getTinyId(),
                qqVersion: context.getQQVersion(),
                httpProxy: typeof context.getHttpProxy() === 'function',
                pskeyMap: PskeyManager.getPskeyMap(),
                screen: {
                    width: window.screen.width,
                    height: window.screen.height,
                },
                devicePixelRatio: window.devicePixelRatio,
            };
            return connectData;
        };
        /**
         * 更新任务的状态
         */
        WorkerClient.prototype.updateTaskStatus = function (traceId, status) {
            var task = this.getTask(traceId);
            if (!task) {
                return;
            }
            this.taskMap.set(traceId, {
                info: task.info,
                status: status,
            });
        };
        /**
         * 移除任务
         */
        WorkerClient.prototype.removeTask = function (traceId) {
            if (!traceId) {
                return;
            }
            this.taskMap.delete(traceId);
        };
        /**
         * 挂载 Ark 消息
         * @description 真实挂载
         */
        WorkerClient.prototype.doMount = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var task, e_7;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            // 还没有注册成功. 不管了
                            if (!this.appSet.has(options.appid)) {
                                return [2 /*return*/];
                            }
                            task = this.getTask(options.traceId);
                            if (task.status !== TaskStatus.WAIT) {
                                return [2 /*return*/];
                            }
                            // 这里更新下状态. 防止多次 mount
                            // 多次 mount 会导致 OffscreenCanvas transfer失败.
                            // An OffscreenCanvas could not be cloned because it was detached.
                            this.updateTaskStatus(options.traceId, TaskStatus.MOUNTING);
                            return [4 /*yield*/, this.postMessage(PostMessageTypeEnum.MOUNT, options, null, 
                                // OffscreenCanvas 可以 transfer
                                [options.canvas])];
                        case 1:
                            _a.sent();
                            // 更新下状态. 还不能移除. 因为 unmount 的时候会用到
                            this.updateTaskStatus(options.traceId, TaskStatus.MOUNTED);
                            return [2 /*return*/, true];
                        case 2:
                            e_7 = _a.sent();
                            this.updateTaskStatus(options.traceId, TaskStatus.FAILED);
                            this.catchPostMessageError(e_7, PostMessageTypeEnum.MOUNT, options.appid);
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 上报metrics count
         */
        WorkerClient.prototype.doReportCount = function (receive) {
            var report = WebApplicationApi.getReport();
            var _a = receive.data, event = _a.event, count = _a.count, labels = _a.labels;
            report.reportCount(event, count, labels);
        };
        /**
         * 上报metrics value
         */
        WorkerClient.prototype.doReportValue = function (receive) {
            var report = WebApplicationApi.getReport();
            var _a = receive.data, event = _a.event, value = _a.value, labels = _a.labels;
            report.reportValue(event, value, labels);
        };
        /**
         * 上报错误日志
         * @description 这里同 WebReport 不采用 report.error 上报
         */
        WorkerClient.prototype.doReportError = function (receive) {
            var report = WebApplicationApi.getReport();
            var _a = receive.data, message = _a.message, span = _a.span, labels = _a.labels, attributes = _a.attributes;
            report.log({
                message: message,
                span: span,
                labels: labels,
                attributes: attributes || {},
            });
        };
        /**
         * 上报普通日志
         */
        WorkerClient.prototype.doReportLog = function (receive) {
            var report = WebApplicationApi.getReport();
            var _a = receive.data, message = _a.message, span = _a.span, labels = _a.labels, attributes = _a.attributes;
            report.log({
                message: message,
                span: span,
                labels: labels,
                attributes: attributes || {},
            });
        };
        /**
         * 设置 cookie
         * @pass
         */
        WorkerClient.prototype.doSetCookie = function (receive) {
            var msgId = receive.msgId, data = receive.data;
            var cookie = data.cookie;
            var context = WebApplicationApi.getContext();
            context.setCookie(cookie);
            this.responseMessage(PostMessageTypeEnum.SET_COOKIE, msgId);
        };
        /**
         * 代理请求
         * @description 仅用于调试
         */
        WorkerClient.prototype.doHttpProxy = function (receive) {
            return __awaiter$1(this, void 0, void 0, function () {
                var url, context, httpProxy, proxy, _a, status_1, success, data;
                return __generator$1(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            url = receive.data.url;
                            context = WebApplicationApi.getContext();
                            httpProxy = context.getHttpProxy();
                            if (!(typeof httpProxy === 'function')) return [3 /*break*/, 2];
                            proxy = httpProxy(url);
                            if (!(proxy && typeof proxy.then === 'function')) return [3 /*break*/, 2];
                            return [4 /*yield*/, proxy];
                        case 1:
                            _a = _b.sent(), status_1 = _a.status, success = _a.success, data = _a.data;
                            return [2 /*return*/, {
                                    status: status_1,
                                    success: success,
                                    data: data,
                                }];
                        case 2: return [2 /*return*/, Promise.reject(new Error('TYPE_ERROR'))];
                    }
                });
            });
        };
        /**
         * 触发全局事件
         */
        WorkerClient.prototype.emitter = function (receive) {
            logger$c.debug('receive emitter message.', receive);
            var data = receive.data;
            var type = data.type, options = data.options;
            eventBus.emit(type, options);
        };
        /**
         * postMessage 异常处理
         * @param type 消息类型
         * @param appid 应用ID
         */
        WorkerClient.prototype.catchPostMessageError = function (error, type, appid) {
            logger$c.error("postmessage error. type: ".concat(type, ", appid: ").concat(appid, ", e:"), error);
            var tracerTag = TracerTagEnum.ARK_POSTMESSAGE_ERROR;
            if ((error === null || error === void 0 ? void 0 : error.message) === ErrorMsg.TIMEOUT) {
                tracerTag = TracerTagEnum.ARK_WORKER_TIMEOUT;
            }
            var reportLabels = {
                exception: (error === null || error === void 0 ? void 0 : error.message) || UNKNOWN$1,
                stack: (error === null || error === void 0 ? void 0 : error.stack) || UNKNOWN$1,
                appid: appid || '',
                engineVersion: WebApplicationContext.engineVersion,
                messageType: type || '',
                apps: Array.from(this.appSet).join(';'),
            };
            var context = WebApplicationApi.getContext();
            var attributes = {
                uin: context.getUin(),
            };
            var report = WebApplicationApi.getReport();
            requestIdleCallback(function () {
                report.log({
                    message: tracerTag,
                    span: TRACER_SPAN_NAME$1,
                    labels: reportLabels,
                    attributes: attributes,
                });
            });
        };
        /**
         * worker 异常处理
         */
        WorkerClient.prototype.catchWorkerError = function (type, error) {
            logger$c.error("worker error. type:", type, ', error:', error);
            var tracerTag = TracerTagEnum.ARK_WORKER_MESSAGE_ERROR;
            if (type === ErrorMsg.WORKER_ERROR) {
                tracerTag = TracerTagEnum.ARK_WORKER_ERROR;
            }
            var reportLabels = {
                error: (error === null || error === void 0 ? void 0 : error.message) || UNKNOWN$1,
                engineVersion: WebApplicationContext.engineVersion,
                apps: Array.from(this.appSet).join(';'),
            };
            var context = WebApplicationApi.getContext();
            var attributes = {
                uin: context.getUin(),
            };
            var report = WebApplicationApi.getReport();
            requestIdleCallback(function () {
                report.log({
                    message: tracerTag,
                    span: TRACER_SPAN_NAME$1,
                    labels: reportLabels,
                    attributes: attributes,
                });
            });
        };
        return WorkerClient;
    }(PromiseWorker));

    /**
     * @fileoverview Global
     * @date 2022-09-06 23:38:11
     * @author alawnxu
     * @version 1.0.0
     * @description Worker 中有一些 api 无法使用，这个时候会通过 Global 存储一些数据，方便 Worker 中调用
     */
    var DEFAULT_DEVICE_PIXEL_RATIO$1 = 1;
    var Global = /** @class */ (function () {
        function Global() {
        }
        /**
         * 设置引擎代码
         * @param code
         * @description 当引擎代码发生更新的时候意味着所有的 Worker 需要重建. 需要注意，这里需要先设置 Yoga 代码
         */
        Global.setEngineCode = function (code) {
            if (!code) {
                return;
            }
            if (this.engineCode !== code) {
                this.engineCode = code;
                this.updateWorkerPoolEngine();
            }
        };
        /**
         * 设置Lua WebAssembly代码
         * @param code
         * @description
         */
        Global.setWasmoonCode = function (code) {
            if (!code) {
                return;
            }
            if (this.wasmoonCode !== code) {
                this.wasmoonCode = code;
                this.updateWorkerPoolEngine();
            }
        };
        /**
         * 获取引擎的代码
         */
        Global.getEngineCode = function () {
            return this.engineCode;
        };
        /**
         * 设置 Yoga 代码
         */
        Global.setYogaCode = function (code) {
            if (!code) {
                return;
            }
            if (this.yogaCode !== code) {
                this.yogaCode = code;
                this.updateWorkerPoolEngine();
            }
        };
        /**
         * 更新 WorkerPool 引擎
         */
        Global.updateWorkerPoolEngine = function () {
            var yogaWithEngineObjectUrl = this.yogaWithEngineObjectUrl;
            if (this.yogaCode && this.engineCode) {
                if (yogaWithEngineObjectUrl) {
                    URL.revokeObjectURL(yogaWithEngineObjectUrl);
                }
                var blob = void 0;
                if (Global.wasmoonCode) {
                    blob = new Blob([Global.yogaCode, Global.wasmoonCode, Global.engineCode]);
                }
                else {
                    blob = new Blob([Global.yogaCode, Global.engineCode]);
                }
                var url = URL.createObjectURL(blob);
                this.yogaWithEngineObjectUrl = url;
                WorkerPool.updateEngine();
            }
        };
        /**
         * 获取 engine 和 Yoga 对应的 objectUrl
         */
        Global.getEngineWithYogaObjectUrl = function () {
            return this.yogaWithEngineObjectUrl;
        };
        /**
         * 设置屏幕大小
         * @description 会在 WorkerServer 中设置. 提供给 Worker 使用
         */
        Global.setScreen = function (width, height) {
            Global.screen = {
                width: parseInt(String(width), 10) || 0,
                height: parseInt(String(height), 10) || 0,
            };
        };
        /**
         * 获取屏幕大小
         */
        Global.getScreen = function () {
            if (Env.isMainThread) {
                return {
                    width: window.screen.width,
                    height: window.screen.height,
                };
            }
            return Global.screen;
        };
        /**
         * 设置设备分辨率
         */
        Global.setDevicePixelRatio = function (ratio) {
            this.devicePixelRatio = parseInt(String(ratio), 10) || DEFAULT_DEVICE_PIXEL_RATIO$1;
        };
        /**
         * 获取设备分辨率
         */
        Global.getDevicePixelRatio = function () {
            if (Env.isMainThread) {
                return window.devicePixelRatio || DEFAULT_DEVICE_PIXEL_RATIO$1;
            }
            return Global.devicePixelRatio;
        };
        /**
         * 设备分辨率
         */
        Global.devicePixelRatio = DEFAULT_DEVICE_PIXEL_RATIO$1;
        /**
         * 屏幕信息
         * @description 在 Worker 中会用到
         */
        Global.screen = {
            width: 0,
            height: 0,
        };
        return Global;
    }());

    /**
     * @fileoverview Worker 池
     * @author alawnxu
     * @date 2022-08-25 15:40:45
     * @version 1.0.0
     * @description 这里不能直接一个应用一个 Worker . 因为在 Ark 引擎中使用了 Yoga ,而编译成了 wasm，会默认分配了 16M 的内存，所以一个 Ark 应用一个 Worker 的话，
     * 会导致内存分配急速上升。因为这里采用线程池的方式，一个 Worker 中跑多个应用。
     */
    /**
     * 表示默认超出 MAX_WORKER_TASK_CONCURRENT 任务后会自动多创建一个 Worker. (当然是没有超出最大 worker 数的情况)
     * @description 这个数是凭经验写的.可以自行调整
     */
    var MAX_WORKER_TASK_CONCURRENT = 3;
    /**
     * 考虑到有些设备的 CPU 核数比较高, 但是如果创建太多的线程的话，会需要更多的内存. 所以这里限制下 Worker 最大数量.
     */
    var DEFAULT_MAX_WORKER_THRESHOLD = 3;
    /**
     * 最少保留线程数
     */
    var MIN_WORKER_THRESHOLD = 1;
    /**
     * 心跳检测间隔
     * @description 单位为ms, 当超出 DEFAULT_CONNECT_TIMEOUT 后,认为 worker 已经无法工作.此时会断开连接
     */
    var DEFAULT_HEARTBEAT_INTERVAL = 30 * 1000;
    /**
     * 连接超时间隔
     * @description 单位为ms.当超出 DEFAULT_CONNECT_TIMEOUT 后,认为 worker 创建失败. 此时会重新创建
     * 这个事件不要太小. 在本地开发环境. 这里初始的时候可能耗时比较长
     */
    var DEFAULT_CONNECT_TIMEOUT = 20 * 1000;
    var logger$b = Logger.getLogger('Worker WorkerPool');
    var WorkerPool = /** @class */ (function () {
        function WorkerPool() {
        }
        /**
         * 添加一个挂载任务
         * @param options 挂载任务
         */
        WorkerPool.addMountTask = function (options) {
            if (!options.appid) {
                return;
            }
            this.stack.push(options);
            this.next();
            this.heartbeat();
        };
        /**
         * 获取最大线程数
         * @description 默认为 hardwareConcurrency / 2.(给其它的场景留一点的,但是最少 DEFAULT_MAX_WORKER_THRESHOLD 个)
         */
        WorkerPool.getMaxWorkerThreshold = function () {
            if (typeof navigator !== 'undefined') {
                var hardwareConcurrency = parseInt(String(navigator.hardwareConcurrency), 10) || 0;
                return Math.max(DEFAULT_MAX_WORKER_THRESHOLD, parseInt(String(hardwareConcurrency / 2), 10));
            }
            return DEFAULT_MAX_WORKER_THRESHOLD;
        };
        /**
         * 更新应用
         * @description 如果 worker 不存在,则不做处理
         */
        WorkerPool.updateApplication = function (appid) {
            logger$b.debug('update application appid:', appid);
            var appCode = WebApplicationApi.getAppCode(appid);
            if (!appCode) {
                return;
            }
            this.workers.forEach(function (worker) {
                if (worker.hasApplication(appid)) {
                    worker.updateApplication(appid, appCode);
                }
            });
        };
        /**
         * 更新引擎
         * @description 这里不能直接更新 worker 内的 Ark 引擎. 如果还有 Ark 消息在渲染. 那么会导致引用丢失
         */
        WorkerPool.updateEngine = function () {
            var workers = this.workers;
            for (var i = workers.length - 1; i >= 0; i--) {
                var worker = workers[i];
                // 如果没有了渲染任务. 已经完全卸载. 那么更新 Ark 引擎
                if (worker.isEmpty()) {
                    this.terminateWorker(worker);
                }
                else {
                    worker.setExpired();
                }
            }
            // 如果 worker 数小于限制最大值 (预创建)
            if (this.workers.length < WorkerPool.maxThreshold) {
                this.createWorker();
            }
        };
        /**
         * 广播事件消息
         * @param type 广播消息类型
         * @param data
         */
        WorkerPool.broadcast = function (type, data) {
            var workers = this.workers;
            if (Array.isArray(workers) && workers.length) {
                workers.forEach(function (worker) {
                    worker.broadcast(type, data);
                });
            }
        };
        /**
         * 移除 worker
         */
        WorkerPool.terminateWorker = function (worker) {
            logger$b.debug('removeWorker:', worker);
            var index = this.workers.findIndex(function (item) { return item === worker; });
            if (index !== -1) {
                this.workers.splice(index, 1);
            }
            worker.terminate();
        };
        /**
         * 获取指定 traceId 对应的 Worker
         */
        WorkerPool.getWorker = function (traceId) {
            var e_1, _a;
            if (!traceId) {
                return null;
            }
            var workers = this.workers;
            if (Array.isArray(workers) && workers.length) {
                try {
                    for (var workers_1 = __values$1(workers), workers_1_1 = workers_1.next(); !workers_1_1.done; workers_1_1 = workers_1.next()) {
                        var worker = workers_1_1.value;
                        var task = worker.getTask(traceId);
                        if (task) {
                            return worker;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (workers_1_1 && !workers_1_1.done && (_a = workers_1.return)) _a.call(workers_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return null;
        };
        /**
         * 心跳检测
         * @description 如果心跳超时.则直接移除. 可能是由于内存溢出等问题引起的
         */
        WorkerPool.heartbeat = function () {
            var _this = this;
            if (this.heartbeatTimer) {
                return;
            }
            this.heartbeatTimer = window.setTimeout(function () {
                logger$b.debug('check workers heartbeat');
                _this.workers.forEach(function (worker) { return __awaiter$1(_this, void 0, void 0, function () {
                    var isAvailable;
                    return __generator$1(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, worker.heartbeat()];
                            case 1:
                                isAvailable = _a.sent();
                                if (!isAvailable) {
                                    this.terminateWorker(worker);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                _this.heartbeatTimer = null;
                _this.heartbeat();
            }, DEFAULT_HEARTBEAT_INTERVAL);
        };
        /**
         * 执行任务
         * @description 这里放到队列里的原因是: 一个应用被创建不是同步的. 需要检查对应的 worker 是否有效同时连接是否成功.
         */
        WorkerPool.next = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var stack, info, appid, appCode, createWorker, optimumWorker, e_2;
                var _this = this;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack = this.stack;
                            if (!Array.isArray(stack) || !stack.length) {
                                return [2 /*return*/];
                            }
                            if (this.taskRunning) {
                                return [2 /*return*/];
                            }
                            this.taskRunning = true;
                            this.workers = Array.isArray(this.workers) ? this.workers : [];
                            info = stack.pop();
                            appid = info.appid;
                            appCode = WebApplicationApi.getAppCode(appid);
                            if (!appCode) {
                                logger$b.warn('appCode is empty. appid:', appid);
                                WebReport.error(null, TracerTagEnum.ARK_EXCEPTION, new Error(ErrorMsg.APP_CODE_NOT_SET), {
                                    appid: appid,
                                });
                                this.taskRunning = false;
                                this.next();
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            createWorker = function () { return __awaiter$1(_this, void 0, void 0, function () {
                                var worker;
                                return __generator$1(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.createWorker()];
                                        case 1:
                                            worker = _a.sent();
                                            // 一个 worker 都没有创建成功, 那别玩了.引擎存在巨大问题, 直接异常吧. 显示暂不支持
                                            if (!worker) {
                                                WebReport.error(null, TracerTagEnum.ARK_EXCEPTION, new Error(ErrorMsg.WORKER_CREATE_ERROR), {
                                                    appid: appid,
                                                });
                                                this.taskRunning = false;
                                                this.next();
                                                return [2 /*return*/];
                                            }
                                            // 这里不会抛异常, 异常已经在里面捕获了. 这里不要阻塞了. 没关系
                                            worker.mount(info);
                                            worker.registerApplication(appid, appCode);
                                            this.taskRunning = false;
                                            this.next();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            if (!(this.workers.length === 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, createWorker()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                        case 3:
                            optimumWorker = this.findOptimumWorker();
                            if (!!optimumWorker) return [3 /*break*/, 5];
                            return [4 /*yield*/, createWorker()];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                        case 5:
                            optimumWorker.mount(info);
                            if (!optimumWorker.hasApplication(appid)) {
                                optimumWorker.registerApplication(appid, appCode);
                            }
                            this.pollingCheckWorkers();
                            this.taskRunning = false;
                            this.next();
                            return [3 /*break*/, 7];
                        case 6:
                            e_2 = _a.sent();
                            // @description 这里实际上不会走到这里来
                            logger$b.error(e_2);
                            this.taskRunning = false;
                            this.next();
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 查找最优的 worker. 让挂载任务尽可能均衡
         */
        WorkerPool.findOptimumWorker = function () {
            var e_3, _a;
            var optimumWorker = null;
            var minWaitTaskCount = Number.MAX_SAFE_INTEGER;
            var minTaskCount = Number.MAX_SAFE_INTEGER;
            try {
                for (var _b = __values$1(this.workers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var worker = _c.value;
                    // 如果是过期了.则再重新创建 worker
                    if (worker.isExpired()) {
                        continue;
                    }
                    var waitTaskCount = worker.getWaitTaskCount();
                    var taskCount = worker.getTaskCount();
                    // 等待的任务数相等的时候. 找执行过任务最小的 worker
                    if (waitTaskCount < minWaitTaskCount || (waitTaskCount === minWaitTaskCount && taskCount < minTaskCount)) {
                        minWaitTaskCount = waitTaskCount;
                        optimumWorker = worker;
                        minTaskCount = taskCount;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return optimumWorker;
        };
        /**
         * 获取一个空闲(没有超出并发数)的 worker
         * @param excludeWorker 排除指定的 worker
         */
        WorkerPool.getIdleWorker = function (excludeWorker) {
            var e_4, _a;
            var idleWorker = null;
            try {
                for (var _b = __values$1(this.workers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var worker = _c.value;
                    // 如果 worker 已经过期. 不管是否空闲都不做处理
                    if (worker.isExpired()) {
                        continue;
                    }
                    if (worker.getWaitTaskCount() < MAX_WORKER_TASK_CONCURRENT) {
                        if (!excludeWorker || worker !== excludeWorker) {
                            idleWorker = worker;
                            break;
                        }
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return idleWorker;
        };
        /**
         * 是否存在空闲线程
         */
        WorkerPool.hasIdleWorker = function () {
            return !!this.getIdleWorker();
        };
        /**
         * 检测 workers
         */
        WorkerPool.pollingCheckWorkers = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var e_5;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.checkWorkersRunning) {
                                return [2 /*return*/];
                            }
                            this.checkWorkersRunning = true;
                            // 如果线程数已经超出.则不做处理
                            if (this.workers.length + 1 > WorkerPool.maxThreshold) {
                                this.checkWorkersRunning = false;
                                return [2 /*return*/];
                            }
                            // 如果存在空闲的线程.也不继续创建
                            if (this.hasIdleWorker()) {
                                this.checkWorkersRunning = false;
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.createWorker()];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_5 = _a.sent();
                            logger$b.error(e_5);
                            return [3 /*break*/, 4];
                        case 4:
                            this.checkWorkersRunning = false;
                            this.pollingCheckWorkers();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 创建一个 Worker
         */
        WorkerPool.createWorker = function (timeout) {
            return __awaiter$1(this, void 0, void 0, function () {
                var objectUrl, worker, connectTimeout, startTime, connected, e_6;
                var _this = this;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            objectUrl = Global.getEngineWithYogaObjectUrl();
                            worker = new WorkerClient(objectUrl, "ark-worker-".concat(uuid()));
                            connectTimeout = parseInt(String(timeout), 10) || DEFAULT_CONNECT_TIMEOUT;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            startTime = Date.now();
                            return [4 /*yield*/, worker.connect(connectTimeout)];
                        case 2:
                            connected = _a.sent();
                            if (!connected) {
                                logger$b.warn("connect timeout. cost time: ".concat(Date.now() - startTime, "ms. worker disconnect"));
                                return [2 /*return*/, null];
                            }
                            this.workers.push(worker);
                            // 强制断开连接
                            worker.on(EventTypeEnum.DISCONNECT, function () {
                                logger$b.error('worker disconnect');
                                _this.terminateWorker(worker);
                            });
                            // 主动申请断开连接. worker 一段时间内没有消息往来
                            worker.on(EventTypeEnum.INACTIVATION, function () {
                                if (_this.workers.length <= MIN_WORKER_THRESHOLD) {
                                    return;
                                }
                                // 如果还有空闲的线程.则关闭
                                var idleWorker = _this.getIdleWorker(worker);
                                if (idleWorker) {
                                    logger$b.info('hasIdleWorker. close worker.', worker);
                                    _this.terminateWorker(worker);
                                }
                            });
                            return [2 /*return*/, worker];
                        case 3:
                            e_6 = _a.sent();
                            logger$b.error(e_6);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 创建 Worker 异常
         * @description 重大渲染引擎BUG
         */
        WorkerPool.catchCreateWorkerError = function () {
            logger$b.error('create worker error.');
            var context = WebApplicationApi.getContext();
            var report = WebApplicationApi.getReport();
            requestIdleCallback(function () {
                report.log({
                    message: TracerTagEnum.ARK_CREATE_WORKER_ERROR,
                    span: TRACER_SPAN_NAME$1,
                    labels: {
                        engineVersion: WebApplicationContext.engineVersion,
                    },
                    attributes: { uin: context.getUin() },
                });
            });
        };
        /**
         * 最大并发线程数
         */
        WorkerPool.maxThreshold = WorkerPool.getMaxWorkerThreshold();
        /**
         * worker 列表
         */
        WorkerPool.workers = [];
        /**
         * 任务堆栈
         */
        WorkerPool.stack = [];
        /**
         * 是否繁忙
         */
        WorkerPool.taskRunning = false;
        /**
         * 检测 worker 数
         */
        WorkerPool.checkWorkersRunning = false;
        return WorkerPool;
    }());

    /**
     * @fileoverview PSKEY 缓存
     * @author alawnxu
     * @date 2022-09-05 20:46:42
     * @version 1.0.0
     * @description 只会运行在 worker 中. 在主线程中就直接访问 storage 了.
     */
    var PskeyCache = /** @class */ (function () {
        function PskeyCache() {
        }
        /**
         * 缓存 pskey
         * @param domains 域名对应的 pskey 对象. 也可以为一个域名
         */
        PskeyCache.set = function (domains, pskey) {
            var _this = this;
            if (typeof domains === 'object') {
                Object.keys(domains).forEach(function (domain) {
                    var value = domains[domain];
                    if (typeof value === 'string') {
                        _this.pskeyMap.set(domain, value);
                    }
                });
                return;
            }
            if (typeof domains === 'string' && typeof pskey === 'string') {
                this.pskeyMap.set(domains, pskey);
            }
        };
        /**
         * 获取指定 domain 的 pskey
         */
        PskeyCache.get = function (domain) {
            if (!domain) {
                return '';
            }
            return this.pskeyMap.get(domain) || '';
        };
        /**
         * 获取 pskey
         * @description 提供给 ApplicationContext 调用
         */
        PskeyCache.getPskey = function (domains) {
            var _this = this;
            var map = new Map();
            if (Array.isArray(domains) && domains.length) {
                domains.forEach(function (domain) {
                    map.set(domain, _this.get(domain));
                });
            }
            return map;
        };
        PskeyCache.pskeyMap = new Map();
        return PskeyCache;
    }());

    /**
     * @fileoverview Application 管理
     * @author alawnxu
     * @date 2022-09-01 17:29:15
     * @version 1.0.0
     * @description 运行在 Worker 内
     */
    var WorkerServerApplicationManager = /** @class */ (function () {
        function WorkerServerApplicationManager() {
        }
        /**
         * 注册 Application 方法
         * @param appid 应用ID
         * @param buffer 应用代码
         */
        WorkerServerApplicationManager.addApplication = function (appid, code) {
            if (!appid || !code) {
                return new Error(ErrorMsg.PARAM_ERROR);
            }
            try {
                var context = {
                    WebArk: self[WorkerServerApplicationManager.engineLibraryName],
                };
                new Function(code).call(context);
                var createApp = context[WorkerServerApplicationManager.appLibraryName];
                if (typeof createApp === 'function') {
                    WorkerServerApplicationManager.applicationMap.set(appid, createApp);
                    return;
                }
                return new Error(ErrorMsg.TYPE_ERROR);
            }
            catch (e) {
                return e;
            }
        };
        /**
         * 获取 Application 的方法
         */
        WorkerServerApplicationManager.getApplication = function (appid) {
            if (!appid) {
                return null;
            }
            var createApp = WorkerServerApplicationManager.applicationMap.get(appid);
            if (typeof createApp === 'function') {
                return createApp;
            }
            return null;
        };
        /**
         * 移除一个Application
         */
        WorkerServerApplicationManager.removeApplication = function (appid) {
            if (!appid) {
                return;
            }
            WorkerServerApplicationManager.applicationMap.delete(appid);
        };
        WorkerServerApplicationManager.applicationMap = new Map();
        /**
         * Ark引擎暴露出的 library 名称
         */
        WorkerServerApplicationManager.engineLibraryName = 'WebArk';
        /**
         * Ark应用暴露出的 library 名称
         */
        WorkerServerApplicationManager.appLibraryName = 'Ark';
        return WorkerServerApplicationManager;
    }());

    /**
     * @fileoverview Worker 线程内的 ARKView 管理
     * @author alawnxu
     * @date 2022-09-01 17:29:15
     * @version 1.0.0
     * @description 运行在 Worker 内
     */
    var WorkerServerARKViewManager = /** @class */ (function () {
        function WorkerServerARKViewManager() {
        }
        /**
         * 注册 ARKView
         * @param appid 应用ID
         * @param traceId 消息ID
         */
        WorkerServerARKViewManager.addARKView = function (appid, traceId) {
            return __awaiter$1(this, void 0, void 0, function () {
                var createApp, arkView, map, e_1;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!appid || !traceId) {
                                return [2 /*return*/, {
                                        error: new Error(ErrorMsg.PARAM_ERROR),
                                        arkView: null,
                                    }];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            createApp = WorkerServerApplicationManager.getApplication(appid);
                            if (!(typeof createApp === 'function')) return [3 /*break*/, 3];
                            return [4 /*yield*/, createApp()];
                        case 2:
                            arkView = _a.sent();
                            map = WorkerServerARKViewManager.arkViewMap.get(appid) || new Map();
                            map.set(traceId, arkView);
                            WorkerServerARKViewManager.arkViewMap.set(appid, map);
                            return [2 /*return*/, {
                                    error: null,
                                    arkView: arkView,
                                }];
                        case 3: return [2 /*return*/, {
                                error: new Error(ErrorMsg.APPLICATION_NOT_EXIST),
                                arkView: null,
                            }];
                        case 4:
                            e_1 = _a.sent();
                            return [2 /*return*/, {
                                    error: e_1,
                                    arkView: null,
                                }];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 获取 ARKView
         * @param appid 应用ID
         * @param [traceId] 消息ID
         */
        WorkerServerARKViewManager.getARKView = function (appid, traceId) {
            if (!appid) {
                return [];
            }
            var map = WorkerServerARKViewManager.arkViewMap.get(appid);
            if (traceId) {
                if (map.size) {
                    var arkView = map.get(traceId);
                    return arkView ? [arkView] : [];
                }
            }
            return __spreadArray$1([], __read$1(map.values()), false);
        };
        /**
         * 移除一个 ARKView
         * @param appid 应用ID
         * @param [traceId] 消息ID, 当有 traceId 的时候表示移除所有
         */
        WorkerServerARKViewManager.removeARKView = function (appid, traceId) {
            if (!appid) {
                return;
            }
            var map = WorkerServerARKViewManager.arkViewMap.get(appid);
            if (!map || map.size === 0) {
                return;
            }
            if (traceId) {
                var arkView = map.get(traceId);
                if (arkView) {
                    arkView.unmount();
                }
                map.delete(traceId);
                WorkerServerARKViewManager.arkViewMap.set(appid, map);
                return;
            }
            map.forEach(function (arkView) {
                arkView.unmount();
            });
            WorkerServerARKViewManager.arkViewMap.delete(appid);
        };
        /**
         * 更新配置
         */
        WorkerServerARKViewManager.setConfig = function (appid, traceId, config) {
            if (!appid || !traceId) {
                return;
            }
            var map = WorkerServerARKViewManager.arkViewMap.get(appid);
            if (!map || map.size === 0) {
                return;
            }
            var arkView = map.get(traceId);
            if (arkView) {
                arkView.setConfig(config);
            }
        };
        WorkerServerARKViewManager.arkViewMap = new Map();
        return WorkerServerARKViewManager;
    }());

    /**
     * @fileoverview Worker 服务端
     * @author alawnxu
     * @date 2022-09-01 16:40:03
     * @version 1.0.0
     * @description 运行在 Worker 内. 一个 Worker 只会启动一个服务
     */
    var logger$a = Logger.getLogger('Worker WorkerClient');
    var WorkerServer = /** @class */ (function (_super) {
        __extends$1(WorkerServer, _super);
        function WorkerServer() {
            var _this = _super.call(this) || this;
            if (Env.isMainThread) {
                return _this;
            }
            _this.setWorker(self);
            _this.onMessageHandle();
            return _this;
        }
        /**
         * push消息
         * @param type 事件类型
         * @param data 事件参数
         */
        WorkerServer.pushMessage = function (type, data) {
            if (Env.isMainThread) {
                return;
            }
            return WorkerServer.instance.pushMessage(type, data);
        };
        /**
         * 发送消息
         * @param type 事件类型
         * @param data 事件参数
         * @param timeout 超时时长
         */
        WorkerServer.postMessage = function (type, data, timeout) {
            if (Env.isMainThread) {
                return;
            }
            return WorkerServer.instance.postMessage(type, data, timeout);
        };
        /**
         * 触发全局事件
         */
        WorkerServer.emitter = function (type, options) {
            this.pushMessage(WorkerPushMessageTypeEnum.EMITTER, {
                type: type,
                options: options,
            });
        };
        /**
         * push 消息分发
         */
        WorkerServer.prototype.receivePushMessage = function (event) {
            var receive = event.data;
            var type = receive.type;
            switch (type) {
                case MainThreadPushMessageTypeEnum.REFRESH_PSKEY:
                    this.refreshPskey(receive);
                    break;
                case MainThreadPushMessageTypeEnum.ON_CLICK:
                    this.onClickHandle(receive);
                    break;
                case MainThreadPushMessageTypeEnum.ON_MOUSE_UP:
                    this.onClickHandle(receive);
                    break;
                case MainThreadPushMessageTypeEnum.ON_MOUSE_DOWN:
                    this.onClickHandle(receive);
                    break;
                default:
            }
        };
        /**
         * 消息分发
         */
        WorkerServer.prototype.receivePostMessage = function (event) {
            var receive = event.data;
            var type = receive.type;
            switch (type) {
                case PostMessageTypeEnum.CONNECT:
                    this.connection(receive);
                    break;
                case PostMessageTypeEnum.HEARTBEAT:
                    this.heartbeat(receive);
                    break;
                case PostMessageTypeEnum.REGISTER_APPLICATION:
                    this.registerApplication(receive);
                    break;
                case PostMessageTypeEnum.UPDATE_APPLICATION:
                    this.updateApplication(receive);
                    break;
                case PostMessageTypeEnum.REMOVE_APPLICATION:
                    this.removeApplication(receive);
                    break;
                case PostMessageTypeEnum.MOUNT:
                    this.mount(receive);
                    break;
                case PostMessageTypeEnum.UNMOUNT:
                    this.unmount(receive);
                    break;
                case PostMessageTypeEnum.SET_CONFIG:
                    this.setConfig(receive);
                    break;
                default:
            }
        };
        /**
         * Server 端不主动断开连接
         */
        WorkerServer.prototype.inactivation = function () {
            logger$a.warn('inactivation');
        };
        /**
         * 回消息的时候带上 msgId. 保证通信消息能正常匹配
         */
        WorkerServer.prototype.connection = function (receive) {
            var _this = this;
            var msgId = receive.msgId, data = receive.data;
            var loggerConfig = data.logger, debug = data.debug, uin = data.uin, tinyId = data.tinyId, qqVersion = data.qqVersion, httpProxy = data.httpProxy, pskeyMap = data.pskeyMap, screen = data.screen, devicePixelRatio = data.devicePixelRatio;
            WebApplicationApi.setContext({
                logger: loggerConfig,
                debug: debug,
                getPskey: function (domains) { return _this.getPskey(domains); },
                setCookie: function (cookie) { return _this.setCookie(cookie); },
                uin: uin,
                tinyId: tinyId,
                monitor: null,
                getQQVersion: function () {
                    return qqVersion || 'unknown';
                },
                httpProxy: httpProxy ? function (url) { return _this.httpProxy(url); } : false,
                // isMute 和 getContainerInfo 先用默认的吧，后面有需求可以再考虑加上去
            });
            logger$a.debug('receive connection request');
            PskeyCache.set(pskeyMap);
            Global.setScreen(screen.width, screen.height);
            Global.setDevicePixelRatio(devicePixelRatio);
            this.responseMessage(PostMessageTypeEnum.CONNECT, msgId);
        };
        /**
         * 心跳回复
         */
        WorkerServer.prototype.heartbeat = function (receive) {
            var msgId = receive.msgId;
            logger$a.debug('heartbeat');
            this.responseMessage(PostMessageTypeEnum.HEARTBEAT, msgId);
        };
        /**
         * 注册应用
         */
        WorkerServer.prototype.registerApplication = function (receive) {
            var data = receive.data, msgId = receive.msgId;
            var appid = data.appid, appCode = data.appCode;
            logger$a.debug('register application. appid:', appid);
            var error = WorkerServerApplicationManager.addApplication(appid, appCode);
            this.responseMessage(PostMessageTypeEnum.REGISTER_APPLICATION, msgId, {
                error: error,
            });
        };
        /**
         * 移除应用
         */
        WorkerServer.prototype.removeApplication = function (receive) {
            var data = receive.data, msgId = receive.msgId;
            var appid = data.appid;
            logger$a.debug('remove application. appid:', appid);
            WorkerServerApplicationManager.removeApplication(appid);
            this.responseMessage(PostMessageTypeEnum.REMOVE_APPLICATION, msgId);
        };
        /**
         * 更新应用
         * @description 这里还是走 addApplication 就可以了.因为采用的是 Map 是怎么存储的
         */
        WorkerServer.prototype.updateApplication = function (receive) {
            var data = receive.data, msgId = receive.msgId;
            var appid = data.appid, appCode = data.appCode;
            logger$a.debug('update application. appid:', appid);
            var error = WorkerServerApplicationManager.addApplication(appid, appCode);
            this.responseMessage(PostMessageTypeEnum.UPDATE_APPLICATION, msgId, {
                error: error,
            });
        };
        /**
         * 挂载应用
         */
        WorkerServer.prototype.mount = function (receive) {
            return __awaiter$1(this, void 0, void 0, function () {
                var msgId, data, config, appid, traceId, ratio, canvas, _a, error, arkView, e_1;
                return __generator$1(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            msgId = receive.msgId, data = receive.data;
                            config = data.config, appid = data.appid, traceId = data.traceId, ratio = data.ratio, canvas = data.canvas;
                            return [4 /*yield*/, WorkerServerARKViewManager.addARKView(appid, traceId)];
                        case 1:
                            _a = _b.sent(), error = _a.error, arkView = _a.arkView;
                            if (error) {
                                this.responseMessage(PostMessageTypeEnum.MOUNT, msgId, {
                                    error: error,
                                });
                                return [2 /*return*/];
                            }
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, arkView.mount({
                                    traceId: traceId,
                                    config: config,
                                    ratio: ratio,
                                    canvas: canvas,
                                })];
                        case 3:
                            _b.sent();
                            this.responseMessage(PostMessageTypeEnum.MOUNT, msgId, {
                                error: null,
                            });
                            return [3 /*break*/, 5];
                        case 4:
                            e_1 = _b.sent();
                            this.responseMessage(PostMessageTypeEnum.MOUNT, msgId, {
                                error: e_1,
                            });
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 卸载Ark消息
         */
        WorkerServer.prototype.unmount = function (receive) {
            var data = receive.data, msgId = receive.msgId;
            var appid = data.appid, traceId = data.traceId;
            logger$a.debug('unmount app. appid:', appid, 'traceId:', traceId);
            WorkerServerARKViewManager.removeARKView(appid, traceId);
            this.responseMessage(PostMessageTypeEnum.UNMOUNT, msgId);
        };
        /**
         * 更新配置
         */
        WorkerServer.prototype.setConfig = function (receive) {
            var data = receive.data;
            var config = data.config, appid = data.appid, traceId = data.traceId;
            logger$a.debug('set config. appid:', appid, 'traceId:', traceId);
            WorkerServerARKViewManager.setConfig(appid, traceId, config);
        };
        /**
         * 刷新 pskey
         */
        WorkerServer.prototype.refreshPskey = function (receive) {
            var data = receive.data;
            var domains = data.domains;
            if (!domains) {
                return;
            }
            PskeyCache.set(domains);
        };
        /**
         * 点击事件的处理
         */
        WorkerServer.prototype.onClickHandle = function (receive) {
            return __awaiter$1(this, void 0, void 0, function () {
                var data, appid, traceId, offsetX, offsetY, arkViews;
                return __generator$1(this, function (_a) {
                    data = receive.data;
                    appid = data.appid, traceId = data.traceId, offsetX = data.offsetX, offsetY = data.offsetY;
                    arkViews = WorkerServerARKViewManager.getARKView(appid, traceId);
                    if (arkViews.length) {
                        arkViews[0].DoClick({ offsetX: offsetX, offsetY: offsetY });
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * 鼠标按键被松开时的处理
         */
        WorkerServer.prototype.onMouseupHandle = function (receive) {
            return __awaiter$1(this, void 0, void 0, function () {
                var data, appid, traceId, offsetX, offsetY, arkViews;
                return __generator$1(this, function (_a) {
                    data = receive.data;
                    appid = data.appid, traceId = data.traceId, offsetX = data.offsetX, offsetY = data.offsetY;
                    arkViews = WorkerServerARKViewManager.getARKView(appid, traceId);
                    if (arkViews.length) {
                        arkViews[0].DoMouseup({ offsetX: offsetX, offsetY: offsetY });
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * 鼠标按键按下时的处理
         */
        WorkerServer.prototype.onMousedownHandle = function (receive) {
            return __awaiter$1(this, void 0, void 0, function () {
                var data, appid, traceId, offsetX, offsetY, arkViews;
                return __generator$1(this, function (_a) {
                    data = receive.data;
                    appid = data.appid, traceId = data.traceId, offsetX = data.offsetX, offsetY = data.offsetY;
                    arkViews = WorkerServerARKViewManager.getARKView(appid, traceId);
                    if (arkViews.length) {
                        arkViews[0].DoMousedown({ offsetX: offsetX, offsetY: offsetY });
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * 获取 Pskey
         * @description 这里其实不会调用到.在 QQ.GetPskey 中直接走了 PskeyManager.getPskey
         */
        WorkerServer.prototype.getPskey = function (domains) {
            var pskeyMap = PskeyCache.getPskey(domains);
            return Promise.resolve(pskeyMap);
        };
        /**
         * 设置Cookie
         * @pass
         */
        WorkerServer.prototype.setCookie = function (cookie) {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!Array.isArray(cookie) || cookie.length === 0) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, WorkerServer.postMessage(PostMessageTypeEnum.SET_COOKIE, {
                                    cookie: cookie,
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Http代理
         * @description 这个仅仅只是用作调试
         */
        WorkerServer.prototype.httpProxy = function (url) {
            return __awaiter$1(this, void 0, void 0, function () {
                var response;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, WorkerServer.postMessage(PostMessageTypeEnum.HTTP_PROXY, {
                                url: url,
                            })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data];
                    }
                });
            });
        };
        /**
         * 自启动 Worker 客户端
         * @description 一个 Worker 只会启动给一个 Client
         */
        WorkerServer.instance = (function () {
            if (Env.isWorker) {
                return new WorkerServer();
            }
            return null;
        })();
        return WorkerServer;
    }(PromiseWorker));

    /**
     * @fileoverview Pskey管理
     * @author alawnxu
     * @date 2022-08-12 15:33:24
     * @date 2022-08-12 15:33:31
     */
    var logger$9 = Logger.getLogger('PskeyManager');
    /**
     * 会采集一批domains.然后进行批量更新
     */
    var DEFAULT_DOMAINS = new Set([
        'qzone.qq.com',
        'qlive.qq.com',
        'qun.qq.com',
        'gamecenter.qq.com',
        'vip.qq.com',
        'qianbao.qq.com',
    ]);
    /**
     * Pskey过期时间
     * @description 过期时间有1天,这里放短一点
     */
    var PSKEY_EXPIRED_TIME = 1 * 60 * 60 * 1000;
    /**
     * 轮询时间间隔
     */
    var POLLING_INTERVAL = 30 * 60 * 1000;
    /**
     * Pskey前缀
     */
    var PSKEY_PREFIX = 'PSKEY_';
    var PskeyManager = /** @class */ (function () {
        function PskeyManager() {
        }
        /**
         * 初始化
         * @description 如果是在主线程中, 那么会轮询更新 pskey, 然后广播到所有的 worker 中
         */
        PskeyManager.init = function (domains) {
            if (Env.isWorker) {
                return;
            }
            domains && PskeyManager.addDomain(domains);
            if (PskeyManager.locked) {
                logger$9.warn('init locked');
                return;
            }
            // 防止死循环
            PskeyManager.locked = true;
            PskeyManager.refreshPskey();
            PskeyManager.polling();
        };
        /**
         * 获取pskey
         * @param domain
         */
        PskeyManager.getPskey = function (domain) {
            if (typeof domain === 'string' && domain.trim()) {
                var domainTrim = domain.trim();
                // 加入 domain. 进入到下一次的轮询
                PskeyManager.addDomain(domainTrim);
                // 在 Worker 中可以直接从缓存中取
                if (Env.isWorker) {
                    return PskeyCache.get(domainTrim);
                }
                var key = PskeyManager.generateKey(domainTrim);
                return CookieStorage.getCookie(key);
            }
            return '';
        };
        /**
         * 异步获取Pskey
         * @param domain
         */
        PskeyManager.getPskeyAsync = function (domain) {
            return __awaiter$1(this, void 0, void 0, function () {
                var domainTrim, applicationContext, pskeyMap, pskey, domainObj;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(typeof domain === 'string' && domain.trim())) return [3 /*break*/, 2];
                            domainTrim = domain.trim();
                            // 加入domain.进入到下一次的轮询
                            PskeyManager.addDomain(domainTrim);
                            if (Env.isWorker) {
                                return [2 /*return*/, PskeyCache.get(domainTrim)];
                            }
                            applicationContext = WebApplicationApi.getContext();
                            return [4 /*yield*/, applicationContext.getPskeyAsync([domainTrim])];
                        case 1:
                            pskeyMap = _a.sent();
                            pskey = pskeyMap.get(domainTrim);
                            PskeyManager.cachePskey(domainTrim, pskey);
                            domainObj = {};
                            domainObj[domainTrim] = pskey;
                            WorkerPool.broadcast(MainThreadPushMessageTypeEnum.REFRESH_PSKEY, {
                                domains: domainObj,
                            });
                            return [2 /*return*/, pskey];
                        case 2: return [2 /*return*/, ''];
                    }
                });
            });
        };
        /**
         * 增加domain
         * @param domain
         */
        PskeyManager.addDomain = function (domains) {
            if (!domains) {
                return;
            }
            var notExistDomains = [];
            var domainList = Array.isArray(domains) ? domains : [domains];
            domainList.forEach(function (domain) {
                var domainTrim = domain.trim();
                if (!domainTrim || PskeyManager.domains.has(domainTrim)) {
                    return;
                }
                notExistDomains.push(domainTrim);
            });
            // 如果 domains 已经都存在.则不做处理
            if (notExistDomains.length === 0) {
                return;
            }
            // 如果是在 worker 中, 则 push 到主线程中处理
            if (Env.isWorker) {
                WorkerServer.pushMessage(WorkerPushMessageTypeEnum.ADD_DOMAIN, {
                    domain: notExistDomains,
                });
                return;
            }
            // 在主线程中处理 domains
            notExistDomains.forEach(function (domain) {
                PskeyManager.domains.add(domain);
            });
        };
        /**
         * 获取当前所有域名对应的pskey
         */
        PskeyManager.getPskeyMap = function () {
            var res = {};
            var domains = Array.from(PskeyManager.domains);
            domains.forEach(function (domain) {
                var key = PskeyManager.generateKey(domain);
                var pskey = CookieStorage.getCookie(key);
                res[domain] = pskey;
            });
            return res;
        };
        /**
         * 刷新pskey
         * @description 只能运行在主线程中.然后会广播给 worker
         */
        PskeyManager.refreshPskey = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var applicationContext, domains, pskeyMap, pskeyObj;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (Env.isWorker) {
                                return [2 /*return*/];
                            }
                            logger$9.debug('refreshPskey:', PskeyManager.domains);
                            applicationContext = WebApplicationApi.getContext();
                            domains = Array.from(PskeyManager.domains);
                            if (!domains.length) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, applicationContext.getPskeyAsync(domains)];
                        case 1:
                            pskeyMap = _a.sent();
                            pskeyObj = {};
                            pskeyMap.forEach(function (pskey, domain) {
                                PskeyManager.cachePskey(domain, pskey);
                                pskeyObj[domain] = pskey;
                            });
                            // 广播 pskey. 在渲染进程中就可以同步获取了
                            WorkerPool.broadcast(MainThreadPushMessageTypeEnum.REFRESH_PSKEY, {
                                domains: pskeyObj,
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 根据domain生成pskey前缀
         */
        PskeyManager.generateKey = function (domain) {
            return "".concat(PSKEY_PREFIX, "_").concat(domain);
        };
        /**
         * 存储Pskey
         */
        PskeyManager.cachePskey = function (domain, value) {
            var key = PskeyManager.generateKey(domain);
            if (value) {
                CookieStorage.setCookie(key, value, new Date(Date.now() + PSKEY_EXPIRED_TIME));
            }
        };
        /**
         * polling
         * 轮询拉取pskey
         */
        PskeyManager.polling = function () {
            if (Env.isWorker) {
                return;
            }
            logger$9.debug('polling');
            PskeyManager.timer = setTimeout(function () {
                PskeyManager.refreshPskey();
                if (PskeyManager.timer) {
                    clearTimeout(PskeyManager.timer);
                    PskeyManager.timer = null;
                }
                PskeyManager.polling();
            }, POLLING_INTERVAL);
        };
        PskeyManager.domains = DEFAULT_DOMAINS;
        PskeyManager.timer = null;
        PskeyManager.locked = false;
        return PskeyManager;
    }());

    var logger$8 = Logger.getLogger('WebApplicationApi');
    var WebApplicationApi = /** @class */ (function (_super) {
        __extends$1(WebApplicationApi, _super);
        function WebApplicationApi() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 自定义拓展方法
         * @description 可能会运行在 Worker 中，或者主线程中
         */
        WebApplicationApi.setContext = function (context) {
            WebApplicationApi.context = new WebApplicationContext(context);
            logger$8.info('init context:', WebApplicationApi.context);
            PskeyManager.init();
        };
        /**
         * 获取context对象
         * @example
         * const context = Application.getContext();
         * context.getPskey('qun.qq.com');
         * @description 这里给个默认值.防止报错
         */
        WebApplicationApi.getContext = function () {
            if (WebApplicationApi.context) {
                return WebApplicationApi.context;
            }
            logger$8.error('WebApplicationContext not init:', WebApplicationApi.context);
            WebApplicationApi.setContext(BaseApplicationContext.DEFAULT_APPLICATION_CONTEXT_DATA);
            return WebApplicationApi.context;
        };
        /**
         * 设置 Yoga 引擎的代码
         * @description 这个当使用了 WebWorker 的时候需要设置
         */
        WebApplicationApi.setYogaCode = function (code) {
            Global.setYogaCode(code);
        };
        /**
         * 设置 渲染引擎 代码
         * @description 这个当使用了 WebWorker 的时候需要设置
         */
        WebApplicationApi.setEngineCode = function (code) {
            Global.setEngineCode(code);
        };
        /**
         * 设置 Wasmoon WebAssembly的代码
         * @description 这个当使用了 WebWorker 的时候需要设置
         */
        WebApplicationApi.setWasmoonCode = function (code) {
            Global.setWasmoonCode(code);
        };
        /**
         * 设置应用代码
         * @description 当 app 代码发生更新的时候需要. 意味着对应的 worker 里面的应用需要重新实例化
         */
        WebApplicationApi.setAppCode = function (appid, appCode) {
            if (!appid || !appCode) {
                return;
            }
            var beforeCode = WebApplicationApi.appCodeMap.get(appid);
            WebApplicationApi.appCodeMap.set(appid, appCode);
            // 如果之前有设置过代码. 那么更新应用
            if (beforeCode) {
                WorkerPool.updateApplication(appid);
            }
        };
        /**
         * 获取应用代码
         * @param appid 应用ID
         */
        WebApplicationApi.getAppCode = function (appid) {
            if (!appid) {
                return '';
            }
            return WebApplicationApi.appCodeMap.get(appid);
        };
        /**
         * 上报监控实例对象
         * @param template
         * @returns
         */
        WebApplicationApi.getReport = function () {
            var context = WebApplicationApi.getContext();
            return context.getReport();
        };
        /**
         * 从模版创建视图
         * @param template 模版索引或者模版文件的路径
         */
        WebApplicationApi.prototype.CreateView = function (template) {
            var _a = this, app = _a.app, templates = _a.templates;
            var application = new WebApplication(app, templates);
            var view = application.CreateView(template, false);
            return view;
        };
        /**
         * 从模版创建顶层视图
         * @param templateId 模版索引或者模版文件的路径
         * @TODO 一期暂时没有用到这个方法.先暂时不实现
         */
        WebApplicationApi.prototype.CreateRootView = function (templateId) {
            logger$8.warn('CreateRootView:', templateId);
            return null;
        };
        /**
         * 顶层视图对象
         * @param id 顶层视图索引
         */
        WebApplicationApi.prototype.GetRootView = function (id) {
            var app = this.app;
            var applicationId = AppUtil.GetApplicationId(app);
            logger$8.debug('GetRootView applicationId:', applicationId);
            var view = RootViewManager.GetRootView(applicationId, id);
            return view;
        };
        /**
         * 获取模版
         * @param templateId 视图模板
         * @TODO 一期暂时没有用到这个方法.先暂时不实现
         */
        WebApplicationApi.prototype.GetTemplate = function (templateId) {
            logger$8.warn('CreateRootView:', templateId);
            return null;
        };
        /**
         * 应用代码
         * @TODO 先暂时存储一份, @shaobin 有空优化下
         */
        WebApplicationApi.appCodeMap = new Map();
        return WebApplicationApi;
    }(ApplicationApi));

    /**
     * @fileoverview 监控上报
     * @author alawnxu
     * @date 2022-08-08 20:21:47
     * @description 可以运行在 Worker 和 主线程 中，但是运行在 Worker 中的时候会通过 postMessage 交给主进程处理. 因为 monitor 无法 clone
     */
    var logger$7 = Logger.getLogger('WebReport');
    var UNKNOWN = 'unknown';
    var TRACER_SPAN_NAME = 'QQWebArk';
    var TracerTagEnum;
    (function (TracerTagEnum) {
        TracerTagEnum["ARK_CLICK"] = "ArkClick";
        TracerTagEnum["ARK_CREATE"] = "ArkCreate";
        TracerTagEnum["ARK_LAYOUT_ERROR"] = "ArkLayoutError";
        TracerTagEnum["ARK_EXCEPTION"] = "ArkException";
        TracerTagEnum["ARK_EVENT_EXCEPTION"] = "ArkEventException";
        TracerTagEnum["ARK_WORKER_TIMEOUT"] = "ArkWorkerTimeout";
        TracerTagEnum["ARK_POSTMESSAGE_ERROR"] = "ArkPostMessageError";
        TracerTagEnum["ARK_CREATE_WORKER_ERROR"] = "ArkCreateWorkerError";
        TracerTagEnum["ARK_WORKER_ERROR"] = "ArkWorkerError";
        TracerTagEnum["ARK_WORKER_MESSAGE_ERROR"] = "ArkWorkerMessageError";
    })(TracerTagEnum || (TracerTagEnum = {}));
    var MetricsReportEventEnum;
    (function (MetricsReportEventEnum) {
        // Ark实例创建次数
        MetricsReportEventEnum["ARK_CREATE"] = "QQWebArkCreate";
        // 点击率(传播率): ArkClick / ArkExposure
        MetricsReportEventEnum["ARK_CLICK"] = "QQWebArkClick";
        MetricsReportEventEnum["ARK_EXPOSURE"] = "QQWebArkExposure";
        // 成功率: ArkMountSuccess / (QQWebArkMountSuccess + QQWebArkMountError). 曝光不一定挂载
        MetricsReportEventEnum["ARK_MOUNT_SUCCESS"] = "QQWebArkMountSuccess";
        MetricsReportEventEnum["ARK_MOUNT_ERROR"] = "QQWebArkMountError";
        // 异步上屏等待时长: ArkWaitTime
        MetricsReportEventEnum["ARK_WAIT_TIME"] = "QQWebArkWaitTime";
        // Ark消息平均绘制时长: ArkPaintTime
        MetricsReportEventEnum["ARK_PAINT_TIME"] = "QQWebArkPaintTime";
        // 首帧绘制时长: ArkFirstPaintTime
        MetricsReportEventEnum["ARK_FIRST_PAINT_TIME"] = "ArkFirstPaintTime";
        // POST_MESSAGE 响应时长
        MetricsReportEventEnum["ARK_POST_MESSAGE_RESPONSE_TIME"] = "ArkPostMessageResponseTime";
        MetricsReportEventEnum["WORKER_RECEIVE_MESSAGE_TIME"] = "WorkerReceiveMessageTime";
        MetricsReportEventEnum["MAINTHREAD_RECEIVE_MESSAGE_TIME"] = "MainThreadReceiveMessageTime";
        MetricsReportEventEnum["STRING_TO_ARRAY_BUFFER"] = "StringToArrayBuffer";
        MetricsReportEventEnum["ARRAY_BUFFER_TO_STRING"] = "ArrayBufferToString";
        // CONNECT 时长
        MetricsReportEventEnum["ARK_WORKER_CONNECT_TIME"] = "ArkWorkerConnectTime";
    })(MetricsReportEventEnum || (MetricsReportEventEnum = {}));
    var WebReport = /** @class */ (function () {
        function WebReport() {
        }
        /**
         * 上报trace
         * @param message
         */
        WebReport.log = function (app, tag, message, labels) {
            try {
                var appid = UNKNOWN;
                var appVersion = UNKNOWN;
                var buildVersion = UNKNOWN;
                if (app) {
                    buildVersion = AppUtil.GetBuildVersion(app);
                    appVersion = AppUtil.GetAppVersion(app);
                    appid = AppUtil.GetAppid(app);
                }
                var reportLabels_1 = __assign$1({ message: message || tag, buildVersion: buildVersion, appVersion: appVersion, appid: appid, engineVersion: WebApplicationContext.engineVersion }, (labels || {}));
                var context = WebApplicationApi.getContext();
                var attributes_1 = {
                    uin: context.getUin(),
                };
                // 如果是在 worker 中. push 给主线程进行上报
                if (Env.isWorker) {
                    WorkerServer.pushMessage(WorkerPushMessageTypeEnum.REPORT_LOG, {
                        message: tag,
                        span: TRACER_SPAN_NAME,
                        labels: reportLabels_1,
                        attributes: attributes_1,
                    });
                    return;
                }
                var report_1 = WebApplicationApi.getReport();
                requestIdleCallback(function () {
                    report_1.log({
                        message: tag,
                        span: TRACER_SPAN_NAME,
                        labels: reportLabels_1,
                        attributes: attributes_1,
                    });
                });
            }
            catch (e) {
                logger$7.error(e);
            }
        };
        /**
         * 上报error
         * @param receive
         * @description 这里就不走错误上报了
         */
        WebReport.error = function (app, tag, e, labels) {
            try {
                var appid = UNKNOWN;
                var appVersion = UNKNOWN;
                var buildVersion = UNKNOWN;
                if (app) {
                    buildVersion = AppUtil.GetBuildVersion(app);
                    appVersion = AppUtil.GetAppVersion(app);
                    appid = AppUtil.GetAppid(app);
                }
                var reportLabels_2 = __assign$1({ exception: typeof e === 'string' ? e : (e === null || e === void 0 ? void 0 : e.message) || UNKNOWN, stack: typeof e === 'string' ? e : (e === null || e === void 0 ? void 0 : e.stack) || UNKNOWN, buildVersion: buildVersion, appVersion: appVersion, appid: appid, engineVersion: WebApplicationContext.engineVersion }, (labels || {}));
                var message_1 = tag;
                var context = WebApplicationApi.getContext();
                var attributes_2 = {
                    uin: context.getUin(),
                };
                // 如果是在 worker 中. push 给主线程进行上报
                if (Env.isWorker) {
                    WorkerServer.pushMessage(WorkerPushMessageTypeEnum.REPORT_ERROR, {
                        message: message_1,
                        span: TRACER_SPAN_NAME,
                        labels: reportLabels_2,
                        attributes: attributes_2,
                    });
                    return;
                }
                var report_2 = WebApplicationApi.getReport();
                requestIdleCallback(function () {
                    report_2.log({
                        message: message_1,
                        span: TRACER_SPAN_NAME,
                        labels: reportLabels_2,
                        attributes: attributes_2,
                    });
                });
            }
            catch (error) {
                logger$7.error(error);
            }
        };
        /**
         * 上报值
         * @description metrics 的 labels 不能用来设置发散的数据
         */
        WebReport.reportValue = function (event, value, appid, labels) {
            try {
                var reportLabels_3 = __assign$1({ appid: appid || '', engineVersion: WebApplicationContext.engineVersion, platform: getPlatform() }, (labels || {}));
                // 如果是在 worker 中. push 给主线程进行上报
                if (Env.isWorker) {
                    WorkerServer.pushMessage(WorkerPushMessageTypeEnum.REPORT_VALUE, {
                        event: event,
                        value: value,
                        labels: reportLabels_3,
                    });
                    return;
                }
                var report_3 = WebApplicationApi.getReport();
                requestIdleCallback(function () {
                    if (typeof event === 'string') {
                        report_3.reportValue(event, value, reportLabels_3);
                    }
                    else if (Array.isArray(event) && event.length) {
                        report_3.reportValue(event, value, reportLabels_3);
                    }
                });
            }
            catch (e) {
                logger$7.error(e);
            }
        };
        /**
         * 上报Count
         * @description metrics 的 labels 不能用来设置发散的数据
         */
        WebReport.reportCount = function (event, count, appid, labels) {
            try {
                var reportLabels_4 = __assign$1({ appid: appid || '', engineVersion: WebApplicationContext.engineVersion, platform: getPlatform() }, (labels || {}));
                // 如果是在 worker 中. push 给主线程进行上报
                if (Env.isWorker) {
                    WorkerServer.pushMessage(WorkerPushMessageTypeEnum.REPORT_COUNT, {
                        event: event,
                        count: count,
                        labels: reportLabels_4,
                    });
                    return;
                }
                var report_4 = WebApplicationApi.getReport();
                requestIdleCallback(function () {
                    if (typeof event === 'string') {
                        report_4.reportCount(event, count, reportLabels_4);
                    }
                });
            }
            catch (e) {
                logger$7.error(e);
            }
        };
        return WebReport;
    }());

    /**
     * @fileoverview 容器管理
     * @author alawnxu
     * @date 2022-07-31 15:11:10
     * @version 1.0.0
     * @TODO 要注意内存溢出
     */
    var ContextHolder = /** @class */ (function () {
        function ContextHolder() {
        }
        ContextHolder.AddContainer = function (pView, pContainer) {
            if (!pView) {
                return false;
            }
            ContextHolder.containerMap.set(pView, pContainer);
        };
        /**
         * 获取容器
         */
        ContextHolder.GetContainer = function (pView) {
            if (!pView) {
                return null;
            }
            return ContextHolder.containerMap.get(pView);
        };
        /**
         * 绑定root视图
         */
        ContextHolder.RemoveContainer = function (pView) {
            if (!pView) {
                return false;
            }
            ContextHolder.containerMap.delete(pView);
        };
        ContextHolder.containerMap = new Map();
        return ContextHolder;
    }());

    /**
     * @fileoverview Ark容器
     * @author alawnxu
     * @date 2022-07-18 23:22:23
     * @version 1.0.0
     */
    var logger$6 = Logger.getLogger('Container');
    var ContainerEventEnum;
    (function (ContainerEventEnum) {
        ContainerEventEnum["UPDATE"] = "Update";
        ContainerEventEnum["SYNC_RECT"] = "SyncRect";
        ContainerEventEnum["CLICK"] = "Click";
        ContainerEventEnum["UPDATE_CONTAINER_SIZE"] = "UpdateContainerSize";
    })(ContainerEventEnum || (ContainerEventEnum = {}));
    // const DEFAULT_CANVAS_WIDTH = MIN_QQ_RENDER_WIDTH;
    // const DEFAULT_CANVAS_HEIGHT = MIN_QQ_RENDER_HEIGHT;
    var Container = /** @class */ (function (_super) {
        __extends$1(Container, _super);
        function Container(devicePixelRatio, canvas) {
            var _this = _super.call(this) || this;
            /**
             * 根视图大小发生改变的时候的处理
             */
            _this.ViewResize = function (sender, oldWidth, oldHeight, newWidth, newHeight) {
                logger$6.debug("ViewResize oldSize: [".concat(oldWidth, ", ").concat(oldHeight, "], newSize: ").concat(newWidth, ", ").concat(newHeight));
                _this.SyncRect();
                var rect = _this.pView.GetRect();
                _this.Update(rect.getLeft(), rect.getTop(), rect.getRight(), rect.getBottom());
            };
            /**
             * 当根视图发生更新后的处理
             * @TODO 先强制刷新所有的区域.后面再优化
             */
            _this.ViewChange = function (sender, left, top, right, bottom) {
                var rect = new ARKRect(left, top, right, bottom);
                if (rect.IsEmpty()) {
                    return;
                }
                var pRect = _this.pView.GetRect();
                _this.Update(pRect.getLeft(), pRect.getTop(), pRect.getRight(), pRect.getBottom());
            };
            _this.devicePixelRatio = devicePixelRatio;
            _this.canvas = canvas;
            _this.context = canvas.getContext('2d');
            CanvasUtil.wrapperCanvasRenderingContext2D(_this.devicePixelRatio, _this.context);
            return _this;
        }
        /**
         * 绘制Ark消息
         * @param context
         * @param renderRect
         * @description 清理的时候需要特别注意. 因为 container 被缩放了.所以这里需要 * ratio 才可以.不过已经在初始化的时候处理了.
         */
        Container.prototype.DoPaint = function (renderRect) {
            var _a = this, pView = _a.pView, context = _a.context;
            if (!pView) {
                return;
            }
            context.clearRect(renderRect.getLeft(), renderRect.getTop(), renderRect.Width(), renderRect.Height());
            pView.RenderTo(context, renderRect);
        };
        /**
         * 设置宽高
         */
        Container.prototype.SetSize = function (width, height) {
            logger$6.debug('SetSize:', width, height);
            if (!this.pView) {
                return;
            }
            // CSSLayout需要设置布局节点的宽度跟高度
            if (this.pView.IsCSSMode()) {
                this.pView.SetCSSNodeSize(width, height);
            }
            else {
                this.pView.SetSize(width, height);
            }
            this.UpdateContainerSize(new ARKSize(width, height));
        };
        /**
         * 获取大小
         */
        Container.prototype.GetSize = function () {
            if (this.pView) {
                return this.pView.GetSize();
            }
            return new ARKSize();
        };
        /**
         * 获取Rect
         */
        Container.prototype.GetRect = function () {
            if (this.pView) {
                return this.pView.GetRect();
            }
            return new ARKRect();
        };
        /**
         * 创建根视图
         * @param application 应用实例
         * @param templateId 模板ID
         * @param app 用来调试
         * @param appConfig 用来调试
         */
        Container.prototype.CreateRootView = function (application, templateId) {
            var pView = application.CreateRootView(templateId);
            if (!pView) {
                logger$6.error('CreateRootView fail.');
                return;
            }
            this.pView = pView;
            ContextHolder.AddContainer(pView, this);
            this.ListenViewEvent();
            return true;
        };
        /**
         * 设置元数据信息
         * @param metadata
         */
        Container.prototype.SetMetadata = function (metadata) {
            logger$6.debug('SetMetadata:', metadata);
            if (!metadata) {
                return;
            }
            if (this.pView) {
                this.pView.SetMetadata(metadata);
            }
        };
        /**
         * 自定义拓展方法
         * @returns
         */
        Container.prototype.GetRootView = function () {
            return this.pView;
        };
        /**
         * 释放资源
         * @author alawnxu
         * @date 2022-08-01 11:25:47
         * @TODO 先不置空先, 由于时序问题, 盲目置空可能会抛异常
         */
        Container.prototype.Release = function () {
            var _a;
            logger$6.debug('Container Destroy');
            // 可能还没有初始化
            if (this.pView) {
                ContextHolder.RemoveContainer(this.pView);
                (_a = this.pView) === null || _a === void 0 ? void 0 : _a.Release();
            }
            this.canvas.width = 0;
            this.canvas.height = 0;
            this.context.fillRect(0, 0, 0, 0);
            this.UnlistenViewEvent();
        };
        /**
         * 点击事件的处理
         */
        Container.prototype.DoClick = function (offsetX, offsetY) {
            if (!this.pView) {
                return;
            }
            // 这里与 Native 不一样,前端这里采用的事件冒泡的形式. 而 Native 触发的是 pView 的点击事件.这样又需要重新比较一次
            var pObj = this.pView.DoHitTest(offsetX, offsetY);
            pObj === null || pObj === void 0 ? void 0 : pObj.DoClick(offsetX, offsetY);
        };
        /**
         * 鼠标按键按下时的处理
         */
        Container.prototype.DoMousedown = function (offsetX, offsetY) {
            if (!this.pView) {
                return;
            }
            var pObj = this.pView.DoHitTest(offsetX, offsetY);
            pObj === null || pObj === void 0 ? void 0 : pObj.DoMouseDown(offsetX, offsetY);
            this.FireEvent(ContainerEventEnum.CLICK, offsetX, offsetY);
        };
        /**
         * 鼠标按键被松开时的处理
         */
        Container.prototype.DoMouseup = function (offsetX, offsetY) {
            if (!this.pView) {
                return;
            }
            this.pView.DoMouseUp(offsetX, offsetY);
        };
        /**
         * 绑定事件
         * @description 监听resize事件更新容器大小
         */
        Container.prototype.ListenViewEvent = function () {
            if (!this.pView) {
                return;
            }
            this.pView.AttachEvent(UIObjectEventEnum.ON_RESIZE, this.ViewResize);
            this.pView.AttachEvent(UIObjectEventEnum.ON_CHANGE, this.ViewChange);
        };
        /**
         * 移除事件
         */
        Container.prototype.UnlistenViewEvent = function () {
            if (!this.pView) {
                return;
            }
            this.pView.DetachEvent(UIObjectEventEnum.ON_RESIZE, this.ViewResize);
            this.pView.DetachEvent(UIObjectEventEnum.ON_CHANGE, this.ViewChange);
        };
        /**
         * 同步Rect
         */
        Container.prototype.SyncRect = function () {
            if (!this.pView) {
                return;
            }
            var rect = this.pView.GetRect();
            this.FireEvent(ContainerEventEnum.SYNC_RECT, rect.getLeft(), rect.getTop(), rect.getRight(), rect.getBottom());
        };
        /**
         * 根视图更新后的处理
         */
        Container.prototype.Update = function (left, top, right, bottom) {
            this.FireEvent(ContainerEventEnum.UPDATE, left, top, right, bottom);
        };
        /**
         * 根视图大小发生改变的时候的处理
         */
        Container.prototype.UpdateContainerSize = function (newSize) {
            var width = newSize.GetWidth();
            var height = newSize.GetHeight();
            if (width > 0 && height > 0) {
                this.canvas.width = width * this.devicePixelRatio;
                this.canvas.height = height * this.devicePixelRatio;
                this.FireEvent(ContainerEventEnum.UPDATE_CONTAINER_SIZE, width, height);
            }
        };
        return Container;
    }(BaseEventListener));

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     * @description 自定义拓展方法请以小写开头的驼峰命名.
     */
    /**
     * @fileoverview ArkModel
     * @author alawnxu
     * @date 2022-07-18 23:22:23
     * @version 1.0.0
     */
    var logger$5 = Logger.getLogger('WebARKModel');
    /**
     * 上报时间间隔
     */
    var REPORT_INTERVAL = 2 * 1000;
    /**
     * 绘制上报次数
     */
    var DRAW_REPORT_NUM = 4;
    var WebARKModel = /** @class */ (function () {
        function WebARKModel(_a) {
            var appid = _a.appid, appConfig = _a.appConfig, templateId = _a.templateId, applicationId = _a.applicationId, devicePixelRatio = _a.devicePixelRatio;
            var _this = this;
            /**
             * syncRect是否已经锁定
             * @description SyncRect 涉及到重新布局.所以会一定的耗时.这里加一个锁
             */
            this.syncRectLocked = false;
            /**
             * requestAnimationFrame的Id
             */
            this.requestHandle = null;
            /**
             * 更新次数
             */
            this.updateCount = 0;
            /**
             * 绘制次数
             */
            this.drawCount = 0;
            /**
             * 绘制总时长
             */
            this.drawTimeCount = 0;
            /**
             * 绘制耗时上报次数
             */
            this.drawReportCount = 0;
            /**
             * 上报timer
             */
            this.reportTimer = null;
            /**
             * 当根视图发生更新时的处理
             * @description 当根视图大小或者位置等发生更新的时候会触发
             */
            this.Update = function (left, top, right, bottom, frameSync) {
                if (frameSync === void 0) { frameSync = true; }
                if (_this.syncRectLocked) {
                    return;
                }
                var rect = new ARKRect(left, top, right, bottom);
                _this.mRectInvalid.UnionRect(rect);
                _this.mRectInvalid.IntersectRect(_this.mRectArkContainer);
                if (frameSync) {
                    _this.FrameSync();
                }
            };
            /**
             * 同步Rect
             * @description 当根视图大小发生更新的时候会触发
             * @param left
             * @param top
             * @param right
             * @param bottom
             */
            this.SyncRect = function (left, top, right, bottom, frameSync) {
                if (frameSync === void 0) { frameSync = true; }
                if (_this.syncRectLocked) {
                    logger$5.debug('SyncRect locked');
                    return;
                }
                var originContainerRect = _this.mRectArkContainer.Copy();
                _this.mRectArkContainer = new ARKRect(left, top, right, bottom);
                _this.syncRectLocked = true;
                var width = _this.mRectArkContainer.Width();
                var height = _this.mRectArkContainer.Height();
                var mRectContainer = null;
                if (_this.notInSizeRange(width, height)) {
                    var size = _this.limitToSizeRange(width, height);
                    logger$5.debug("SyncRect. size negotiation failed, origin-rect: ".concat(originContainerRect, ", new-rect: ").concat(_this.mRectArkContainer, ", adjusted: ").concat(size));
                    mRectContainer = new ARKRect(0, 0, size.GetWidth(), size.GetHeight());
                }
                else {
                    logger$5.debug("SyncRect. success, origin-rect: ".concat(originContainerRect, ", new-rect: ").concat(_this.mRectArkContainer));
                    mRectContainer = _this.mRectArkContainer.Copy();
                }
                _this.container.SetSize(mRectContainer.Width(), mRectContainer.Height());
                if (frameSync) {
                    _this.FrameSync();
                }
                _this.syncRectLocked = false;
            };
            if (!templateId) {
                throw new Error('Init got null app id and viewImpl name.');
            }
            this.appid = appid;
            this.appConfig = appConfig;
            this.applicationId = applicationId;
            this.templateId = templateId;
            this.mRectArkContainer = ARKRect.EmptyRect;
            this.mRectInvalid = new ARKRect();
            this.devicePixelRatio = devicePixelRatio;
        }
        /**
         * 挂载视图
         * @param application
         * @param canvas 离屏canvas
         */
        WebARKModel.prototype.AttachView = function (application, canvas) {
            logger$5.debug('AttachView');
            var _a = this, appConfig = _a.appConfig, devicePixelRatio = _a.devicePixelRatio;
            application.Load();
            var runApplication = application.Run(appConfig);
            // 不需要要监控. 目前 WebArk 这里不可能返回false
            if (!runApplication) {
                return null;
            }
            var container = new Container(devicePixelRatio, canvas);
            this.container = container;
            this.AttachContainerEvent();
            return container;
        };
        /**
         * 卸载视图
         */
        WebARKModel.prototype.DetachView = function () {
            logger$5.debug('DetachView');
        };
        /**
         * 激活Ark消息
         */
        WebARKModel.prototype.DoActivate = function (application) {
            var _a, _b;
            var app = application.GetApp();
            var _c = this, appConfig = _c.appConfig, templateId = _c.templateId, appid = _c.appid;
            var meta = appConfig.meta;
            var container = this.container;
            try {
                var startTime = Date.now();
                var rootView = container.CreateRootView(application, templateId);
                if (!rootView) {
                    logger$5.error('AttachView CreateRootView fail!');
                    WebReport.error(app, TracerTagEnum.ARK_EXCEPTION, 'CreateRootView fail!', {
                        view: templateId,
                    });
                    return;
                }
                var rect = this.container.GetRect();
                var width = rect.Width();
                var height = rect.Height();
                if (((_a = this.appConfig.config) === null || _a === void 0 ? void 0 : _a.autosize) || ((_b = this.appConfig.config) === null || _b === void 0 ? void 0 : _b.extendAutoSize)) {
                    width = DEFAULT_QQ_RENDER_WIDTH;
                    this.container.SetSize(DEFAULT_QQ_RENDER_WIDTH, DEFAULT_CHANNEL_RENDER_HEIGHT);
                }
                else if (this.notInSizeRange(width, height)) {
                    var realSize = this.limitToSizeRange(width, height);
                    width = realSize.GetWidth();
                    height = realSize.GetHeight();
                    this.container.SetSize(width, height);
                }
                this.SyncRect(0, 0, width, height, false);
                this.Update(rect.getLeft(), rect.getTop(), rect.getRight(), rect.getBottom(), false);
                var createRootViewCostTime = Date.now() - startTime;
                var doFrameStartTime = Date.now();
                WebReport.reportCount(MetricsReportEventEnum.ARK_EXPOSURE, 1, appid);
                this.container.SetMetadata(meta);
                this.DoFrame();
                this.FrameSync();
                WebReport.reportCount(MetricsReportEventEnum.ARK_MOUNT_SUCCESS, 1, appid);
                // 首帧耗时: 需要去掉等待时间
                var firstPaintTime = Date.now() - doFrameStartTime + createRootViewCostTime;
                WebReport.reportValue(MetricsReportEventEnum.ARK_FIRST_PAINT_TIME, firstPaintTime, appid);
                logger$5.info('FirstPaintTime:', firstPaintTime);
            }
            catch (e) {
                logger$5.error(e);
                // 挂载失败.
                WebReport.error(app, TracerTagEnum.ARK_EXCEPTION, e, {
                    appConfig: JSON.stringify(appConfig || {}),
                });
                WebReport.reportCount(MetricsReportEventEnum.ARK_MOUNT_ERROR, 1, appid);
            }
        };
        WebARKModel.prototype.DoClick = function (offsetX, offsetY) {
            this.container.DoClick(offsetX, offsetY);
        };
        WebARKModel.prototype.DoMouseup = function (offsetX, offsetY) {
            this.container.DoMouseup(offsetX, offsetY);
        };
        WebARKModel.prototype.DoMousedown = function (offsetX, offsetY) {
            this.container.DoMousedown(offsetX, offsetY);
        };
        /**
         * 释放资源
         */
        WebARKModel.prototype.Release = function () {
            var _a;
            (_a = this.container) === null || _a === void 0 ? void 0 : _a.Release();
            this.CloseFrameSync();
            this.CloseReportTimer();
            this.DetachContainerEvent();
        };
        /**
         * 绑定Container事件
         */
        WebARKModel.prototype.AttachContainerEvent = function () {
            if (!this.container) {
                return;
            }
            this.container.AttachEvent(ContainerEventEnum.UPDATE, this.Update);
            this.container.AttachEvent(ContainerEventEnum.SYNC_RECT, this.SyncRect);
        };
        /**
         * 移除Container事件
         */
        WebARKModel.prototype.DetachContainerEvent = function () {
            if (!this.container) {
                return;
            }
            this.container.DetachEvent(ContainerEventEnum.UPDATE, this.Update);
            this.container.DetachEvent(ContainerEventEnum.SYNC_RECT, this.SyncRect);
        };
        /**
         * 判断元素大小是否在有效的区域
         * @param width
         * @param height
         * @returns
         */
        WebARKModel.prototype.notInSizeRange = function (width, height) {
            if (width < MIN_QQ_RENDER_WIDTH || height < MIN_QQ_RENDER_HEIGHT) {
                return true;
            }
            if (width > MAX_QQ_RENDER_WIDTH || height > MAX_QQ_RENDER_HEIGHT) {
                return true;
            }
            return false;
        };
        /**
         * 限制Ark容器的宽高
         * @param width
         * @param height
         */
        WebARKModel.prototype.limitToSizeRange = function (width, height) {
            var renderWidth = Math.min(MAX_QQ_RENDER_WIDTH, Math.max(width, MIN_QQ_RENDER_WIDTH));
            var renderHeight = Math.min(MAX_QQ_RENDER_HEIGHT, Math.max(height, MIN_QQ_RENDER_HEIGHT));
            return new ARKSize(renderWidth, renderHeight);
        };
        /**
         * 绘制每一帧
         */
        WebARKModel.prototype.DoFrame = function () {
            var _this = this;
            if (this.syncRectLocked || this.mRectInvalid.IsEmpty()) {
                return;
            }
            try {
                var startTime = Date.now();
                this.container.DoPaint(this.mRectInvalid);
                this.mRectInvalid.SetRectEmpty();
                logger$5.info("DoFrame timeCost: ".concat(Date.now() - startTime, "ms"));
                this.drawCount++;
                this.drawTimeCount += Date.now() - startTime;
                if (this.reportTimer) {
                    this.CloseReportTimer();
                }
                if (this.drawReportCount >= DRAW_REPORT_NUM) {
                    logger$5.debug('stop paint report. drawReportCount: ', this.drawReportCount);
                    return;
                }
                var appid_1 = this.appid;
                this.reportTimer = setTimeout(function () {
                    var time = parseInt(String(_this.drawTimeCount / _this.drawCount), 10);
                    WebReport.reportValue(MetricsReportEventEnum.ARK_PAINT_TIME, time, appid_1);
                    logger$5.debug("report paint time: ".concat(time, "ms."));
                    _this.drawCount = 0;
                    _this.drawTimeCount = 0;
                    _this.drawReportCount++;
                }, REPORT_INTERVAL);
            }
            catch (e) {
                var app = this.GetApp();
                logger$5.error('DoFrame fail.', e);
                WebReport.error(app, TracerTagEnum.ARK_EXCEPTION, e);
            }
        };
        /**
         * 帧同步
         * @description 当视图更新一次的时候的. 会触发一次帧同步
         */
        WebARKModel.prototype.FrameSync = function () {
            var _this = this;
            this.updateCount++;
            // 如果有正在执行的渲染任务.则不做处理
            if (this.requestHandle) {
                logger$5.warn('lock');
                return;
            }
            this.requestHandle = requestAnimationFrame(function () {
                if (_this.updateCount) {
                    logger$5.debug('FrameSync');
                    _this.DoFrame();
                    _this.updateCount = 0;
                }
                _this.CloseFrameSync();
            });
        };
        /**
         * 关闭帧同步
         */
        WebARKModel.prototype.CloseFrameSync = function () {
            if (this.requestHandle) {
                cancelAnimationFrame(this.requestHandle);
                this.requestHandle = null;
            }
        };
        /**
         * 关闭上报Timer
         */
        WebARKModel.prototype.CloseReportTimer = function () {
            if (this.reportTimer) {
                clearTimeout(this.reportTimer);
                this.reportTimer = null;
            }
        };
        /**
         * 获取App对象
         */
        WebARKModel.prototype.GetApp = function () {
            var applicationId = this.applicationId;
            var application = ApplicationManager.GetApplication(applicationId);
            return application.GetApp();
        };
        return WebARKModel;
    }());

    /**
     * 最大同时并发数
     * @description 先渲染两条试试
     */
    var MAX_CONCURRENT_COUNT = 3;
    /**
     * 首次进入时渲染条数
     */
    var MAX_FIRST_ENTRY_RENDER_COUNT = 1;
    /**
     * 缓冲区
     */
    var MAX_ROOT_MARGIN_BUFFER$1 = 280;
    /**
     * 最低曝光率
     */
    var MIN_INTERSECTION_RATIO$1 = 0.3;
    var WebARKViewThreadPool = /** @class */ (function () {
        function WebARKViewThreadPool() {
        }
        WebARKViewThreadPool.initObserver = function (viewPortContainer) {
            var _this = this;
            var observer = this.observerMap.get(viewPortContainer);
            if (observer) {
                return observer;
            }
            observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    var node = entry.target;
                    /**
                     * 初始化的时候，把没有超过 MIN_INTERSECTION_RATIO 的先踢掉
                     */
                    if (entry.intersectionRatio <= MIN_INTERSECTION_RATIO$1) {
                        _this.deleteThread(node);
                        return;
                    }
                    var handler = _this.threadMap.get(node);
                    var intersectionRatio = _this.getRealIntersectionRatio(entry);
                    _this.deleteThread(node);
                    _this.runThreads.push({
                        node: node,
                        intersectionRatio: intersectionRatio,
                        handler: handler,
                    });
                });
                WebARKViewThreadPool.count = 0;
                _this.run(viewPortContainer);
            }, {
                root: viewPortContainer || null,
                threshold: [0.3, 0.5, 0.8, 1],
                rootMargin: "".concat(MAX_ROOT_MARGIN_BUFFER$1, "px 0px"),
            });
            this.observerMap.set(viewPortContainer, observer);
            return observer;
        };
        /**
         * 判断一个entry是否在屏幕内.这类的entry优先加载
         * @param entry
         */
        WebARKViewThreadPool.isInVerticalViewPort = function (entry) {
            var boundingClientRect = entry.boundingClientRect, rootBounds = entry.rootBounds;
            if (!rootBounds) {
                return true;
            }
            var realRootBoundsHeight = rootBounds.height - 2 * MAX_ROOT_MARGIN_BUFFER$1;
            if (boundingClientRect.top >= 0 && boundingClientRect.bottom <= realRootBoundsHeight) {
                return true;
            }
            return false;
        };
        /**
         * 获取真实的曝光率
         * @description 这里会根据权重再算出一个ratio
         */
        WebARKViewThreadPool.getRealIntersectionRatio = function (entry) {
            var boundingClientRect = entry.boundingClientRect, rootBounds = entry.rootBounds;
            if (this.isInVerticalViewPort(entry)) {
                return 1;
            }
            var realRootBoundsHeight = rootBounds.height - 2 * MAX_ROOT_MARGIN_BUFFER$1;
            var realIntersectionHeight = 0;
            if (boundingClientRect.top <= 0) {
                realIntersectionHeight = boundingClientRect.height + boundingClientRect.top;
            }
            else if (boundingClientRect.bottom >= realRootBoundsHeight) {
                realIntersectionHeight = boundingClientRect.height + (realRootBoundsHeight - boundingClientRect.bottom);
            }
            var intersectionRatio = realIntersectionHeight / boundingClientRect.height;
            /**
             * 因为限制了300px的缓冲高度.所以这里还是取最小值的曝光率. MIN_INTERSECTION_RATIO, 防止丢弃
             */
            return Math.max(MIN_INTERSECTION_RATIO$1, intersectionRatio * entry.intersectionRatio);
        };
        WebARKViewThreadPool.addThread = function (node, handler, viewPortContainer) {
            var observer = this.initObserver(viewPortContainer);
            /**
             * 如果超出了首次最大渲染条数.则直接observe
             */
            if (this.firstEntryRenderNum++ > MAX_FIRST_ENTRY_RENDER_COUNT) {
                this.threadMap.set(node, handler);
                var observerNodes = this.observerNodeMap.get(observer);
                if (Array.isArray(observerNodes)) {
                    if (observerNodes.indexOf(node) === -1) {
                        this.observerNodeMap.set(observer, __spreadArray$1(__spreadArray$1([], __read$1(observerNodes), false), [node], false));
                    }
                }
                else {
                    this.observerNodeMap.set(observer, [node]);
                }
                observer.observe(node);
            }
            else {
                /**
                 * 同样限制最大并发数
                 * @author alawnxu
                 * @date 2022-05-05 10:48:20
                 */
                WebARKViewThreadPool.count++;
                handler();
            }
        };
        /**
         * 删除已经加入到执行现成的ark
         * @returns
         */
        WebARKViewThreadPool.deleteThread = function (node) {
            var threadIndex = this.runThreads.findIndex(function (thread) { return thread.node === node; });
            if (threadIndex !== -1) {
                this.runThreads.splice(threadIndex, 1);
            }
        };
        /**
         * 执行线程
         */
        WebARKViewThreadPool.run = function (viewPortContainer) {
            return __awaiter$1(this, void 0, void 0, function () {
                var runThreads, runThread, ratio, index, thread, intersectionRatio, node, handler, observer, channel_1, startTime_1, p;
                var _this = this;
                return __generator$1(this, function (_a) {
                    runThreads = this.runThreads;
                    /**
                     * 当线程池里面没有数据的时候,重新开启高优的通道
                     */
                    if (runThreads.length === 0) {
                        this.callbackId = requestIdleCallback(function () {
                            _this.firstEntryRenderNum = 0;
                            if (_this.callbackId) {
                                cancelIdleCallback(_this.callbackId);
                                _this.callbackId = null;
                            }
                        });
                        return [2 /*return*/];
                    }
                    if (this.callbackId) {
                        cancelIdleCallback(this.callbackId);
                        this.callbackId = null;
                    }
                    runThread = null;
                    ratio = 0;
                    for (index = runThreads.length - 1; index >= 0; index--) {
                        thread = runThreads[index];
                        intersectionRatio = thread.intersectionRatio;
                        if (intersectionRatio >= 1) {
                            runThread = thread;
                            break;
                        }
                        if (intersectionRatio > ratio) {
                            ratio = intersectionRatio;
                            runThread = thread;
                        }
                    }
                    if (!runThread) {
                        runThread = runThreads[runThreads.length - 1];
                    }
                    node = runThread.node, handler = runThread.handler;
                    WebARKViewThreadPool.count++;
                    WebARKViewThreadPool.deleteThread(node);
                    observer = WebARKViewThreadPool.observerMap.get(viewPortContainer);
                    if (observer) {
                        observer.unobserve(node);
                    }
                    if (typeof handler === 'function') {
                        handler();
                    }
                    if (WebARKViewThreadPool.count >= MAX_CONCURRENT_COUNT) {
                        channel_1 = new MessageChannel();
                        startTime_1 = Date.now();
                        channel_1.port1.onmessage = function () {
                            WebARKViewThreadPool.count = 0;
                            _this.run(viewPortContainer);
                            channel_1 = null;
                            WebReport.reportValue(MetricsReportEventEnum.ARK_WAIT_TIME, Date.now() - startTime_1);
                        };
                        channel_1.port2.postMessage(1);
                        return [2 /*return*/];
                    }
                    p = Promise.resolve();
                    p.then(function () {
                        WebARKViewThreadPool.run(viewPortContainer);
                    });
                    return [2 /*return*/];
                });
            });
        };
        /**
         * 移除线程
         */
        WebARKViewThreadPool.removeThread = function (node, viewPortContainer) {
            WebARKViewThreadPool.threadMap.delete(node);
            WebARKViewThreadPool.deleteThread(node);
            var observer = WebARKViewThreadPool.observerMap.get(viewPortContainer);
            if (observer) {
                observer.unobserve(node);
                var observerNodes = WebARKViewThreadPool.observerNodeMap.get(observer);
                if (Array.isArray(observerNodes)) {
                    observerNodes = observerNodes.filter(function (_node) { return _node !== node; });
                    if (observerNodes.length === 0) {
                        observer.disconnect();
                        // 释放内存
                        WebARKViewThreadPool.observerMap.delete(viewPortContainer);
                        WebARKViewThreadPool.observerNodeMap.delete(observer);
                        return;
                    }
                    WebARKViewThreadPool.observerNodeMap.set(observer, observerNodes);
                }
            }
        };
        WebARKViewThreadPool.threadMap = new Map();
        WebARKViewThreadPool.runThreads = [];
        WebARKViewThreadPool.count = 1;
        /**
         * 首次进入时渲染的ark消息数
         */
        WebARKViewThreadPool.firstEntryRenderNum = 1;
        WebARKViewThreadPool.callbackId = null;
        WebARKViewThreadPool.observerMap = new Map();
        WebARKViewThreadPool.observerNodeMap = new Map();
        return WebARKViewThreadPool;
    }());

    /**
     * @fileoverview ARKView
     * @date 2022-04-04 21:55:29
     * @version 1.0.0
     * @description 这里的模块名称尽量还是与Native保持一致. 为业务渲染提供的接口层
     *
     * @version 1.0.1
     * @date 2022-09-04 11:49:10
     * @description 这里需要注意,这个模块可能会跑在 Worker 中，也可能跑在 MainThread 中。
     */
    var logger$4 = Logger.getLogger('WebARKView');
    var ZOOM_PROPERTY$1 = 'zoom';
    var DEFAULT_DEVICE_PIXEL_RATIO = 1;
    var WebARKView = /** @class */ (function (_super) {
        __extends$1(WebARKView, _super);
        function WebARKView(options) {
            var _this = _super.call(this) || this;
            /**
             * 点击事件的处理
             * @description 会在 Worker 中运行, 请不要操作dom
             */
            _this.DoClick = function (event) {
                var _a = _this, application = _a.application, appConfig = _a.appConfig;
                var app = application.GetApp();
                var appid = AppUtil.GetAppid(app);
                _this.arkModel.DoClick(event.offsetX, event.offsetY);
                WebReport.reportCount(MetricsReportEventEnum.ARK_CLICK, 1, appid);
                WebReport.log(app, TracerTagEnum.ARK_CLICK, null, {
                    appConfig: JSON.stringify(appConfig || {}),
                });
            };
            /**
             * 鼠标按键按下时的处理
             * @description 会在 Worker 中运行, 请不要操作dom
             */
            _this.DoMouseup = function (event) {
                _this.arkModel.DoMouseup(event.offsetX, event.offsetY);
            };
            /**
             * 鼠标按键被松开时的处理
             * @description 会在 Worker 中运行, 请不要操作dom
             */
            _this.DoMousedown = function (event) {
                _this.arkModel.DoMousedown(event.offsetX, event.offsetY);
            };
            var templates = options.templates, app = options.app;
            _this.application = new WebApplication(app, templates);
            _this.devicePixelRatio = DEFAULT_DEVICE_PIXEL_RATIO;
            // 注册全局的应用
            var applicationId = AppUtil.GetApplicationId(app);
            ApplicationManager.AddApplication(applicationId, _this.application);
            return _this;
        }
        /**
         * Ark消息挂载.暴露对外的接口
         * @param options
         */
        WebARKView.prototype.mount = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var application, config, container, viewPortContainer, ratio, canvas, app, appid, e_1, engineVersion, appVersion, buildVersion, view, appConfig, arkContainer;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            application = this.application;
                            logger$4.debug('mount:', options);
                            config = options.config, container = options.container, viewPortContainer = options.viewPortContainer, ratio = options.ratio, canvas = options.canvas;
                            app = application.GetApp();
                            appid = AppUtil.GetAppid(app);
                            if (!config) {
                                WebReport.error(app, TracerTagEnum.ARK_EXCEPTION, 'config is not null');
                                logger$4.error('mount: config is not null');
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, WebApplicationContext.initYoga()];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            logger$4.error('mount: init bridge error');
                            WebReport.error(app, TracerTagEnum.ARK_EXCEPTION, 'init bridge error');
                            return [2 /*return*/];
                        case 4:
                            engineVersion = WebApplicationContext.engineVersion;
                            appVersion = AppUtil.GetAppVersion(app);
                            buildVersion = AppUtil.GetBuildVersion(app);
                            view = config.view;
                            if (!view) {
                                WebReport.error(app, TracerTagEnum.ARK_EXCEPTION, 'view is not null');
                                logger$4.error('Load: view is not null');
                                return [2 /*return*/];
                            }
                            logger$4.info("\u5F53\u524DARK\u5F15\u64CE: WebArk. Ark\u5F15\u64CE\u7248\u672C\u53F7: ".concat(engineVersion, ". Ark\u5E94\u7528\u6784\u5EFA\u7248\u672C\u53F7: ").concat(buildVersion, ". Ark\u5E94\u7528\u7248\u672C\u53F7: ").concat(appVersion));
                            appConfig = __assign$1({ theme: {
                                    themeId: DEFAULT_THEME,
                                    mode: ArkModeEnum.DEFAULT,
                                } }, config);
                            this.appConfig = appConfig;
                            this.container = container;
                            this.canvas = canvas;
                            this.viewPortContainer = viewPortContainer;
                            if (Env.isMainThread) {
                                this.devicePixelRatio = getRatio();
                                // @TODO 暂时通过这种方式来解决 canvas 绘制模糊的问题
                                container.style[ZOOM_PROPERTY$1] = 1 / (window.devicePixelRatio || 1);
                            }
                            else {
                                if (typeof ratio === 'undefined') {
                                    logger$4.warn('ratio is undefined');
                                }
                                this.devicePixelRatio = ratio || DEFAULT_DEVICE_PIXEL_RATIO;
                            }
                            WebReport.reportCount(MetricsReportEventEnum.ARK_CREATE, 1, appid);
                            arkContainer = this.AttachView(view);
                            WebReport.log(app, TracerTagEnum.ARK_CREATE, null, {
                                appConfig: JSON.stringify(appConfig),
                            });
                            return [2 /*return*/, arkContainer];
                    }
                });
            });
        };
        /**
         * 卸载
         * @description 主要是内存清理
         */
        WebARKView.prototype.unmount = function () {
            var _a, _b;
            var _c = this, application = _c.application, container = _c.container;
            var app = application.GetApp();
            var applicationId = application.GetApplicationId();
            try {
                (_a = this.application) === null || _a === void 0 ? void 0 : _a.Release();
                (_b = this.arkModel) === null || _b === void 0 ? void 0 : _b.Release();
            }
            catch (e) {
                logger$4.error('unmount exception:', e);
                WebReport.error(app, TracerTagEnum.ARK_EXCEPTION, e);
            }
            if (Env.isMainThread) {
                this.RemoveEventListener();
                WebARKViewThreadPool.removeThread(container, this.viewPortContainer);
                if (container.parentNode) {
                    container.parentNode.removeChild(container);
                }
            }
            // 这个最后再移除.其它地方卸载的时候可能还会依赖 ApplicationManager
            ApplicationManager.RemoveApplication(applicationId);
        };
        /**
         * 配置更新
         * @param config 更新配置
         */
        WebARKView.prototype.setConfig = function (config) {
            var _a;
            (_a = this.application) === null || _a === void 0 ? void 0 : _a.SetConfig(config);
        };
        /**
         * 挂载视图
         * @param templateId 视图名称
         */
        WebARKView.prototype.AttachView = function (templateId) {
            var _a = this, application = _a.application, appConfig = _a.appConfig, devicePixelRatio = _a.devicePixelRatio, canvas = _a.canvas, domContainer = _a.container;
            var applicationId = application.GetApplicationId();
            var app = application.GetApp();
            var appid = AppUtil.GetAppid(app);
            this.arkModel = new WebARKModel({
                appid: appid,
                applicationId: applicationId,
                appConfig: appConfig,
                templateId: templateId,
                devicePixelRatio: devicePixelRatio,
            });
            this.AddEventListener();
            var offscreenCanvas = canvas || domContainer.transferControlToOffscreen();
            var container = this.arkModel.AttachView(application, offscreenCanvas);
            this.OnActivate();
            return container;
        };
        /**
         * 监听 Ark 消息进入视窗事件
         * @description 如果运行在主线程. 则需要观察 Ark 消息是否进入视窗. 否则直接激活
         */
        WebARKView.prototype.OnActivate = function () {
            var _this = this;
            var _a = this, container = _a.container, viewPortContainer = _a.viewPortContainer, application = _a.application;
            if (Env.isWorker) {
                this.arkModel.DoActivate(application);
                return;
            }
            WebARKViewThreadPool.addThread(container, function () {
                _this.arkModel.DoActivate(application);
            }, viewPortContainer);
        };
        /**
         * 绑定事件
         */
        WebARKView.prototype.AddEventListener = function () {
            var container = this.container;
            container === null || container === void 0 ? void 0 : container.addEventListener('click', this.DoClick);
            container === null || container === void 0 ? void 0 : container.addEventListener('onmouseup', this.DoMouseup);
            container === null || container === void 0 ? void 0 : container.addEventListener('onmousedown', this.DoMousedown);
        };
        /**
         * 取消绑定
         */
        WebARKView.prototype.RemoveEventListener = function () {
            var container = this.container;
            container === null || container === void 0 ? void 0 : container.removeEventListener('click', this.DoClick);
            container === null || container === void 0 ? void 0 : container.removeEventListener('onmouseup', this.DoMouseup);
            container === null || container === void 0 ? void 0 : container.removeEventListener('onmousedown', this.DoMousedown);
        };
        return WebARKView;
    }(ARKView));

    var WebUI = /** @class */ (function (_super) {
        __extends$1(WebUI, _super);
        function WebUI() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 创建一个Image节点
         * @param app
         * @description 此时因为没有挂载.所以默认设置为autosize为true
         */
        WebUI.prototype.Image = function (app) {
            var applicationId = AppUtil.GetApplicationId(app);
            var image = new WebImage(applicationId);
            /**
             * 通过 UI.Image() 创建的节点默认 autosize 为true
             * @see {@link Ark/src/core/image/imagewrapper.cpp}
             */
            image.SetAutoSize(true);
            return image;
        };
        /**
         * 创建一个Canvas节点
         * @param app
         * @description 此时因为没有挂载.所以默认设置为autosize为true
         */
        WebUI.prototype.Canvas = function (app) {
            var applicationId = AppUtil.GetApplicationId(app);
            var canvas = new WebCanvas(applicationId);
            return canvas;
        };
        /**
         * 创建一个Text节点
         * @param app
         * @description 此时因为没有挂载.所以默认设置为autosize为true
         */
        WebUI.prototype.Text = function (app) {
            var applicationId = AppUtil.GetApplicationId(app);
            var text = new WebText(applicationId);
            /**
             * 通过 UI.Text() 创建的节点默认 autosize 为true
             * @see {@link Ark/src/core/text/textwrapper.cpp}
             */
            text.SetAutoSize(true);
            return text;
        };
        WebUI.prototype.View = function (app) {
            var applicationId = AppUtil.GetApplicationId(app);
            return new WebView(applicationId);
        };
        return WebUI;
    }(UI$1));

    var Layer = /** @class */ (function () {
        function Layer(_a) {
            var template = _a.template, styles = _a.styles, container = _a.container, fonts = _a.fonts, debug = _a.debug;
            WebApplicationApi.setContext({
                uin: '253948113',
                debug: debug,
                tinyId: '',
                getPskey: function () {
                    return new Promise(function (resolve) {
                        var map = new Map();
                        map.set('qun.qq.com', 'X0LweQeJ9xVxI1vKVkbAywbAc00F8eM6rvIwYOYE5nc_');
                        resolve(map);
                    });
                },
                setCookie: function () {
                    return Promise.resolve();
                },
            });
            var arkView = new WebARKView({
                app: {
                    getExtendObject: function () {
                        return {
                            styles: styles,
                            appid: 'com.tencent.forum',
                            appKey: '122',
                            images: [],
                            fonts: fonts || {},
                            appVersion: '1212',
                            buildVersion: '1212',
                            applicationId: 'com.tencent.forum',
                            applicationEvents: [],
                            urlWhiteList: [],
                        };
                    },
                },
                templates: {
                    default: template,
                },
            });
            return arkView.mount({
                config: {
                    app: 'com.tencent.forum',
                    ver: '1.0.0',
                    view: 'default',
                    meta: {},
                    theme: {
                        themeId: '1109',
                        mode: ArkModeEnum.DEFAULT,
                    },
                },
                container: container,
            });
        }
        return Layer;
    }());

    var logger$3 = Logger.getLogger('WebQQ');
    var WebQQ = /** @class */ (function (_super) {
        __extends$1(WebQQ, _super);
        function WebQQ() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WebQQ.prototype.emitter = function (type, data) {
            if (Env.isMainThread) {
                eventBus.emit(type, data);
                return;
            }
            WorkerServer.emitter(type, data);
        };
        /**
         * 获取当前容器信息
         * @param 视图信息
         */
        WebQQ.prototype.GetContainerInfo = function (view) {
            var context = WebApplicationApi.getContext();
            return context.getContainerInfo(view);
        };
        /**
         * 获取QQ版本号
         */
        WebQQ.prototype.GetVersion = function () {
            var context = WebApplicationApi.getContext();
            return context.getQQVersion();
        };
        /**
         * 返回Pskey
         * @param domain 业务域名
         */
        WebQQ.prototype.GetPskey = function (domain) {
            return PskeyManager.getPskey(domain);
        };
        /**
         * 返回skey
         * @description 这里后面都不会走skey鉴权. 所以这里直接返回空
         */
        WebQQ.prototype.GetSkey = function () {
            return '';
        };
        /**
         * 返回当前登录用户的QQ号
         */
        WebQQ.prototype.GetUIN = function () {
            var context = WebApplicationApi.getContext();
            return context.getUin();
        };
        /**
         * 异步获取pskey (QQ-8.2.6)
         * @param domain 业务域名
         * @param callback 回调函数，参数为string类型
         */
        WebQQ.prototype.GetPskeyAsync = function (domain, callback) {
            PskeyManager.getPskeyAsync(domain)
                .then(function (pskey) {
                if (typeof callback === 'function') {
                    callback(pskey);
                }
            })
                .catch(function (e) {
                logger$3.error('GetPskeyAsync fail.', e);
                callback('');
            });
        };
        /**
         * 获取用户的tinyId
         */
        WebQQ.prototype.GetTinyId = function () {
            var context = WebApplicationApi.getContext();
            return context.getTinyId();
        };
        /**
         * 判断是否静音
         * @param true 静音模式模式下弹toast提示，120s间隔。 false 静音模式下不弹toast提示
         * @date 2022-08-09 12:30:36
         */
        WebQQ.prototype.isMute = function (isShowToast) {
            var applicationContext = WebApplicationApi.getContext();
            return applicationContext.isMute(isShowToast);
        };
        /**
         * 数据请求
         * @description 文档上没见写.但是有些Ark确实还是有在使用
         * @see
         * com.tencent.boodo.boodoshareaioark
         * com.tencent.cmshow.mp
         * @TODO 先这样写
         */
        WebQQ.prototype.DataRequest = function () {
            return {};
        };
        return WebQQ;
    }(QQ$1));

    /**
     * @fileoverview Worker ARKView线程池
     * @date 2022-04-04 21:55:29
     * @version 1.0.0
     * @description 如果是在 Worker 中，策略会有些不一样. 在 Worker 中因为是通过 postMessage 发送消息之后然后挂载的. 所以不存在多条并发的长任务. 直接使用 Promise 就行
     */
    /**
     * 缓冲区
     */
    var MAX_ROOT_MARGIN_BUFFER = 280;
    /**
     * 最低曝光率
     */
    var MIN_INTERSECTION_RATIO = 0.3;
    var WorkerWebARKViewThreadPool = /** @class */ (function () {
        function WorkerWebARKViewThreadPool() {
        }
        WorkerWebARKViewThreadPool.initObserver = function (viewPortContainer) {
            var _this = this;
            var observer = this.observerMap.get(viewPortContainer);
            if (observer) {
                return observer;
            }
            observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    var node = entry.target;
                    /**
                     * 初始化的时候，把没有超过 MIN_INTERSECTION_RATIO 的先踢掉
                     */
                    if (entry.intersectionRatio <= MIN_INTERSECTION_RATIO) {
                        _this.deleteThread(node);
                        return;
                    }
                    var handler = _this.threadMap.get(node);
                    var intersectionRatio = _this.getRealIntersectionRatio(entry);
                    _this.deleteThread(node);
                    _this.runThreads.push({
                        node: node,
                        intersectionRatio: intersectionRatio,
                        handler: handler,
                    });
                });
                _this.run(viewPortContainer);
            }, {
                root: viewPortContainer || null,
                threshold: [0.3, 0.5, 0.8, 1],
                rootMargin: "".concat(MAX_ROOT_MARGIN_BUFFER, "px 0px"),
            });
            this.observerMap.set(viewPortContainer, observer);
            return observer;
        };
        /**
         * 判断一个entry是否在屏幕内.这类的entry优先加载
         * @param entry
         */
        WorkerWebARKViewThreadPool.isInVerticalViewPort = function (entry) {
            var boundingClientRect = entry.boundingClientRect, rootBounds = entry.rootBounds;
            if (!rootBounds) {
                return true;
            }
            var realRootBoundsHeight = rootBounds.height - 2 * MAX_ROOT_MARGIN_BUFFER;
            if (boundingClientRect.top >= 0 && boundingClientRect.bottom <= realRootBoundsHeight) {
                return true;
            }
            return false;
        };
        /**
         * 获取真实的曝光率
         * @description 这里会根据权重再算出一个ratio
         */
        WorkerWebARKViewThreadPool.getRealIntersectionRatio = function (entry) {
            var boundingClientRect = entry.boundingClientRect, rootBounds = entry.rootBounds;
            if (this.isInVerticalViewPort(entry)) {
                return 1;
            }
            var realRootBoundsHeight = rootBounds.height - 2 * MAX_ROOT_MARGIN_BUFFER;
            var realIntersectionHeight = 0;
            if (boundingClientRect.top <= 0) {
                realIntersectionHeight = boundingClientRect.height + boundingClientRect.top;
            }
            else if (boundingClientRect.bottom >= realRootBoundsHeight) {
                realIntersectionHeight = boundingClientRect.height + (realRootBoundsHeight - boundingClientRect.bottom);
            }
            var intersectionRatio = realIntersectionHeight / boundingClientRect.height;
            /**
             * 因为限制了300px的缓冲高度.所以这里还是取最小值的曝光率. MIN_INTERSECTION_RATIO, 防止丢弃
             */
            return Math.max(MIN_INTERSECTION_RATIO, intersectionRatio * entry.intersectionRatio);
        };
        WorkerWebARKViewThreadPool.addThread = function (node, handler, viewPortContainer) {
            var observer = this.initObserver(viewPortContainer);
            this.threadMap.set(node, handler);
            var observerNodes = this.observerNodeMap.get(observer);
            if (Array.isArray(observerNodes)) {
                if (observerNodes.indexOf(node) === -1) {
                    this.observerNodeMap.set(observer, __spreadArray$1(__spreadArray$1([], __read$1(observerNodes), false), [node], false));
                }
            }
            else {
                this.observerNodeMap.set(observer, [node]);
            }
            observer.observe(node);
        };
        /**
         * 删除已经加入到执行现成的ark
         * @returns
         */
        WorkerWebARKViewThreadPool.deleteThread = function (node) {
            var threadIndex = this.runThreads.findIndex(function (thread) { return thread.node === node; });
            if (threadIndex !== -1) {
                this.runThreads.splice(threadIndex, 1);
            }
        };
        /**
         * 执行线程
         */
        WorkerWebARKViewThreadPool.run = function (viewPortContainer) {
            return __awaiter$1(this, void 0, void 0, function () {
                var runThreads, runThread, ratio, index, thread, intersectionRatio, node, handler, observer;
                return __generator$1(this, function (_a) {
                    runThreads = this.runThreads;
                    if (!this.runThreads.length) {
                        return [2 /*return*/];
                    }
                    runThread = null;
                    ratio = 0;
                    for (index = runThreads.length - 1; index >= 0; index--) {
                        thread = runThreads[index];
                        intersectionRatio = thread.intersectionRatio;
                        if (intersectionRatio >= 1) {
                            runThread = thread;
                            break;
                        }
                        if (intersectionRatio > ratio) {
                            ratio = intersectionRatio;
                            runThread = thread;
                        }
                    }
                    if (!runThread) {
                        runThread = runThreads[runThreads.length - 1];
                    }
                    node = runThread.node, handler = runThread.handler;
                    WorkerWebARKViewThreadPool.deleteThread(node);
                    observer = WorkerWebARKViewThreadPool.observerMap.get(viewPortContainer);
                    if (observer) {
                        observer.unobserve(node);
                    }
                    if (typeof handler === 'function') {
                        handler();
                    }
                    WorkerWebARKViewThreadPool.run(viewPortContainer);
                    return [2 /*return*/];
                });
            });
        };
        /**
         * 移除线程
         */
        WorkerWebARKViewThreadPool.removeThread = function (node, viewPortContainer) {
            WorkerWebARKViewThreadPool.threadMap.delete(node);
            WorkerWebARKViewThreadPool.deleteThread(node);
            var observer = WorkerWebARKViewThreadPool.observerMap.get(viewPortContainer);
            if (observer) {
                observer.unobserve(node);
                var observerNodes = WorkerWebARKViewThreadPool.observerNodeMap.get(observer);
                if (Array.isArray(observerNodes)) {
                    observerNodes = observerNodes.filter(function (_node) { return _node !== node; });
                    if (observerNodes.length === 0) {
                        observer.disconnect();
                        // 释放内存
                        WorkerWebARKViewThreadPool.observerMap.delete(viewPortContainer);
                        WorkerWebARKViewThreadPool.observerNodeMap.delete(observer);
                        return;
                    }
                    WorkerWebARKViewThreadPool.observerNodeMap.set(observer, observerNodes);
                }
            }
        };
        WorkerWebARKViewThreadPool.threadMap = new Map();
        WorkerWebARKViewThreadPool.runThreads = [];
        WorkerWebARKViewThreadPool.observerMap = new Map();
        WorkerWebARKViewThreadPool.observerNodeMap = new Map();
        return WorkerWebARKViewThreadPool;
    }());

    /**
     * @fileoverview 针对 Worker 暴露出的对外 ARKView
     * @author alawnxu
     * @date 2022-08-25 15:40:45
     * @version 1.0.0
     * @description 运行在主线程中
     */
    var ZOOM_PROPERTY = 'zoom';
    var WorkerARKView = /** @class */ (function () {
        function WorkerARKView(appid) {
            var _this = this;
            /**
             * 点击事件的处理
             */
            this.onClickHandle = function (event) {
                var _a = _this, traceId = _a.traceId, appid = _a.appid;
                var worker = WorkerPool.getWorker(traceId);
                if (worker) {
                    worker.triggerEvent(MainThreadPushMessageTypeEnum.ON_CLICK, {
                        offsetX: event.offsetX,
                        offsetY: event.offsetY,
                        appid: appid,
                        traceId: traceId,
                    });
                }
            };
            /**
             * 鼠标按键按下时的处理
             */
            this.onMouseupHandle = function (event) {
                var _a = _this, traceId = _a.traceId, appid = _a.appid;
                var worker = WorkerPool.getWorker(traceId);
                if (worker) {
                    worker.triggerEvent(MainThreadPushMessageTypeEnum.ON_MOUSE_UP, {
                        offsetX: event.offsetX,
                        offsetY: event.offsetY,
                        appid: appid,
                        traceId: traceId,
                    });
                }
            };
            /**
             * 鼠标按键被松开时的处理
             */
            this.onMousedownHandle = function (event) {
                var _a = _this, traceId = _a.traceId, appid = _a.appid;
                var worker = WorkerPool.getWorker(traceId);
                if (worker) {
                    worker.triggerEvent(MainThreadPushMessageTypeEnum.ON_MOUSE_DOWN, {
                        offsetX: event.offsetX,
                        offsetY: event.offsetY,
                        appid: appid,
                        traceId: traceId,
                    });
                }
            };
            this.appid = appid;
            this.traceId = "ARK_".concat(appid, "_").concat(uuid());
        }
        /**
         * 挂载
         * @param options 挂载的 Ark 消息数据
         */
        WorkerARKView.prototype.mount = function (options) {
            var _a = this, appid = _a.appid, traceId = _a.traceId;
            var config = options.config, container = options.container, viewPortContainer = options.viewPortContainer;
            if (!container) {
                return;
            }
            // 如果没有曝光.那么不会入挂载队列
            this.container = container;
            this.viewPortContainer = viewPortContainer;
            this.addEventListener();
            WorkerWebARKViewThreadPool.addThread(container, function () {
                /**
                 * @TODO 暂时通过这种方式来解决 canvas 绘制模糊的问题
                 */
                container.style[ZOOM_PROPERTY] = 1 / (window.devicePixelRatio || 1);
                var canvas = container.transferControlToOffscreen();
                WorkerPool.addMountTask({
                    appid: appid,
                    config: config,
                    traceId: traceId,
                    ratio: getRatio(),
                    canvas: canvas,
                });
            }, viewPortContainer);
        };
        /**
         * 卸载 Ark 消息
         */
        WorkerARKView.prototype.unmount = function () {
            var _a = this, traceId = _a.traceId, appid = _a.appid, container = _a.container, viewPortContainer = _a.viewPortContainer;
            var worker = WorkerPool.getWorker(traceId);
            if (worker) {
                worker.unmount(appid, traceId);
            }
            if (!this.container) {
                return;
            }
            this.removeEventListener();
            WebARKViewThreadPool.removeThread(container, viewPortContainer);
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        };
        /**
         * 更新配置
         */
        WorkerARKView.prototype.setConfig = function (config) {
            var _a = this, traceId = _a.traceId, appid = _a.appid;
            var worker = WorkerPool.getWorker(traceId);
            if (worker) {
                worker.setConfig(appid, traceId, config);
            }
        };
        /**
         * 新增事件绑定
         * @TODO @shaobin 可以看下怎么优化
         */
        WorkerARKView.prototype.addEventListener = function () {
            var container = this.container;
            container === null || container === void 0 ? void 0 : container.addEventListener('click', this.onClickHandle);
            container === null || container === void 0 ? void 0 : container.addEventListener('onmouseup', this.onMouseupHandle);
            container === null || container === void 0 ? void 0 : container.addEventListener('onmousedown', this.onMousedownHandle);
        };
        /**
         * 移除事件绑定
         */
        WorkerARKView.prototype.removeEventListener = function () {
            var container = this.container;
            container === null || container === void 0 ? void 0 : container.removeEventListener('click', this.onClickHandle);
            container === null || container === void 0 ? void 0 : container.removeEventListener('onmouseup', this.onMouseupHandle);
            container === null || container === void 0 ? void 0 : container.removeEventListener('onmousedown', this.onMousedownHandle);
        };
        return WorkerARKView;
    }());

    /**
     * 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     */
    var WebNet = /** @class */ (function (_super) {
        __extends$1(WebNet, _super);
        function WebNet() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 创建HTTP对象，用于从服务期获取XML、JSON等数据
         * @param app AppData是注入进来的. packages/ark-builder/template/inject/before/ark.net.js
         * @returns http
         */
        WebNet.prototype.HttpRequest = function (app) {
            return new WebHttp(app);
        };
        return WebNet;
    }(Net$1));

    var logger$2 = Logger.getLogger('WebDevice');
    var WebDevice = /** @class */ (function (_super) {
        __extends$1(WebDevice, _super);
        function WebDevice() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 获取设备的宽度
         */
        WebDevice.prototype.GetScreenWidth = function () {
            var screen = Global.getScreen();
            return screen.width;
        };
        /**
         * 获取设备的高度
         */
        WebDevice.prototype.GetScreenHeight = function () {
            var screen = Global.getScreen();
            return screen.height;
        };
        /**
         * 获取设备的像素比
         */
        WebDevice.prototype.GetPixelRatio = function () {
            return Global.getDevicePixelRatio();
        };
        /**
         * 获取设备型号
         * @description 一般用于数据上报
         */
        WebDevice.prototype.GetModelName = function () {
            return getPlatform();
        };
        /**
         * 默认都返回wifi
         */
        WebDevice.prototype.GetConnectionType = function () {
            return ConnectionTypeEnum.WIFI;
        };
        /**
         * 扫码二维码
         * @param callback
         */
        WebDevice.prototype.ScanCode = function (callback) {
            logger$2.warn("Device.ScanCode() not implemented. callback:", callback);
        };
        return WebDevice;
    }(Device$1));

    var WebStorage = /** @class */ (function (_super) {
        __extends$1(WebStorage, _super);
        function WebStorage() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WebStorage.prototype.Load = function () {
            // @TODO
        };
        WebStorage.prototype.Save = function () {
            return false;
        };
        return WebStorage;
    }(Storage$1));

    var WebSystem = /** @class */ (function (_super) {
        __extends$1(WebSystem, _super);
        function WebSystem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Web环境
         * @returns web只区分Mac和Windows
         */
        WebSystem.prototype.GetOS = function () {
            return navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? SystemEnum.MAC : SystemEnum.WINDOWS;
        };
        /**
         * 返回业务类型
         * @TODO 目前先返回Guild
         * @returns
         */
        WebSystem.prototype.GetBusinessType = function () {
            return BusinessTypeEnum.GUILD;
        };
        return WebSystem;
    }(System$1));

    var logger$1 = Logger.getLogger('WebConsole');
    var WebConsole = /** @class */ (function (_super) {
        __extends$1(WebConsole, _super);
        function WebConsole() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 输入信息到调试窗口
         * @param params
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        WebConsole.prototype.Log = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            logger$1.info.apply(logger$1, __spreadArray$1([], __read$1(params), false));
        };
        WebConsole.prototype.Table = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            logger$1.info.apply(logger$1, __spreadArray$1([], __read$1(params), false));
        };
        return WebConsole;
    }(Console$1));

    /**
     * 请知悉: 这里为了跟ARK原本的API保持一致.所以采用大写开头的接口
     * @see API请参考: http://arkapp.oa.com:8080/ark-doc/internal/doc/ark-develop-reference.html
     */
    /**
     * @fileoverview 调试相关方法直接注册为Notification模块下的函数使用。
     * @date 2022-07-25 20:04:58
     * @version 1.0.0
     */
    var logger = Logger.getLogger('WebNotification');
    var WebNotification = /** @class */ (function () {
        function WebNotification() {
        }
        /**
         * 监听通知
         * @param name 通知名称
         * @returns script 脚本函数
         */
        WebNotification.prototype.Listen = function (name, script) {
            logger.debug('Listen ', name, script);
        };
        /**
         * 取消监听通知
         * @param name 通知名称
         */
        WebNotification.prototype.Unlisten = function (name) {
            logger.debug('Unlisten:', name);
            return true;
        };
        /**
         * 广播通知
         * @param appid 应用名称
         * @param name 通知名称
         * @param data 通知数据
         */
        WebNotification.prototype.Notify = function (appid, name, data) {
            logger.debug('Notify:', appid, name, data);
            return true;
        };
        return WebNotification;
    }());

    var WebPlatform = /** @class */ (function (_super) {
        __extends$1(WebPlatform, _super);
        function WebPlatform() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 获取平台当前版本
         * @returns
         */
        WebPlatform.prototype.GetVersion = function () {
            return '';
        };
        /**
         * 获取平台最低兼容版本
         * @TODO
         * @returns
         */
        WebPlatform.prototype.GetMinVersion = function () {
            return '';
        };
        return WebPlatform;
    }(Platform$1));

    var WebLuaAdapter = /** @class */ (function (_super) {
        __extends$1(WebLuaAdapter, _super);
        function WebLuaAdapter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WebLuaAdapter.prototype.getLuaFactory = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var factory;
                return __generator$1(this, function (_a) {
                    if (!wasmoon__namespace || (wasmoon__namespace && !wasmoon__namespace.LuaFactory)) {
                        console.warn('[ArkEngine] wasmoon LuaFactory not load');
                        return [2 /*return*/];
                    }
                    if (this.factory) {
                        return [2 /*return*/, this.factory];
                    }
                    factory = new wasmoon__namespace.LuaFactory();
                    // Create a standalone lua environment from the factory
                    // const lua = await factory.createEngine();
                    this.factory = factory;
                    return [2 /*return*/, this.factory];
                });
            });
        };
        return WebLuaAdapter;
    }(LuaAdapter$1));

    var QQ = new WebQQ();
    var Net = new WebNet();
    var Storage = new WebStorage();
    var UI = new WebUI();
    var Device = new WebDevice();
    var System = new WebSystem();
    var Console = new WebConsole();
    var Notification = new WebNotification();
    var Platform = new WebPlatform();
    var LuaAdapter = new WebLuaAdapter();

    exports.Application = WebApplicationApi;
    exports.Console = Console;
    exports.Device = Device;
    exports.Layer = Layer;
    exports.LuaAdapter = LuaAdapter;
    exports.Net = Net;
    exports.Notification = Notification;
    exports.Platform = Platform;
    exports.QQ = QQ;
    exports.Storage = Storage;
    exports.System = System;
    exports.Timer = Timer;
    exports.UI = UI;
    exports.WebARKView = WebARKView;
    exports.WorkerARKView = WorkerARKView;
    exports.eventBus = eventBus;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
