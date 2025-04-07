/*!***************************************************
* advanced-mark.js v2.7.0
* https://github.com/angezid/advanced-mark.js
* MIT licensed
* Copyright (c) 2022–2025, angezid
* Based on 'mark.js', license https://git.io/vwTVl
*****************************************************/

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Mark = factory());
})(this, (function () { 'use strict';

  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var DOMIterator = /*#__PURE__*/function () {
    function DOMIterator(ctx, opt) {
      _classCallCheck(this, DOMIterator);
      this.ctx = ctx;
      this.opt = opt;
      this.map = [];
    }
    _createClass(DOMIterator, [{
      key: "getContexts",
      value: function getContexts() {
        var ctx = this.ctx,
          win = this.opt.window,
          sort = false;
        if (!ctx) return [];
        if (Array.isArray(ctx)) {
          sort = true;
        } else if (typeof ctx === 'string') {
          ctx = this.toArray(win.document.querySelectorAll(ctx));
        } else if (ctx.length >= 0) {
          ctx = this.toArray(ctx);
        } else {
          ctx = [ctx];
        }
        var array = [];
        ctx.forEach(function (elem) {
          if (array.indexOf(elem) === -1 && !array.some(function (node) {
            return node.contains(elem);
          })) {
            array.push(elem);
          }
        });
        if (sort) {
          array.sort(function (a, b) {
            return (a.compareDocumentPosition(b) & win.Node.DOCUMENT_POSITION_FOLLOWING) > 0 ? -1 : 1;
          });
        }
        return array;
      }
    }, {
      key: "toArray",
      value: function toArray(collection) {
        var array = [];
        for (var i = 0; i < collection.length; i++) {
          array.push(collection[i]);
        }
        return array;
      }
    }, {
      key: "getIframeContents",
      value: function getIframeContents(iframe, successFn, errorFn) {
        try {
          var doc = iframe.contentWindow.document;
          if (doc) {
            this.map.push([iframe, 'ready']);
            successFn({
              iframe: iframe,
              context: doc
            });
          }
        } catch (e) {
          errorFn({
            iframe: iframe,
            error: e
          });
        }
      }
    }, {
      key: "observeIframeLoad",
      value: function observeIframeLoad(ifr, successFn, errorFn) {
        var _this = this;
        if (this.map.some(function (arr) {
          return arr[0] === ifr;
        })) {
          return;
        }
        var id = null;
        var listener = function listener() {
          clearTimeout(id);
          ifr.removeEventListener('load', listener);
          _this.getIframeContents(ifr, successFn, errorFn);
        };
        ifr.addEventListener('load', listener);
        this.map.push([ifr, true]);
        id = setTimeout(listener, this.opt.iframesTimeout);
      }
    }, {
      key: "onIframeReady",
      value: function onIframeReady(ifr, successFn, errorFn) {
        try {
          var bl = 'about:blank',
            src = ifr.getAttribute('src'),
            win = ifr.contentWindow;
          if (win.document.readyState === 'complete') {
            if (src && src.trim() !== bl && win.location.href === bl) {
              this.observeIframeLoad(ifr, successFn, errorFn);
            } else {
              this.getIframeContents(ifr, successFn, errorFn);
            }
          } else {
            this.observeIframeLoad(ifr, successFn, errorFn);
          }
        } catch (e) {
          errorFn(e);
        }
      }
    }, {
      key: "waitForIframes",
      value: function waitForIframes(ctx, doneCb) {
        var _this2 = this;
        var shadow = this.opt.shadowDOM;
        var count = 0,
          iframes = 0,
          array,
          node;
        var collect = function collect(context) {
          var iterator = _this2.createIterator(context, _this2.opt.window.NodeFilter.SHOW_ELEMENT);
          while (node = iterator.nextNode()) {
            if (_this2.isIframe(node) && !_this2.map.some(function (arr) {
              return arr[0] === node;
            })) {
              array.push(node);
              iframes++;
            }
            if (shadow && node.shadowRoot && node.shadowRoot.mode === 'open') {
              collect(node.shadowRoot);
            }
          }
        };
        var loop = function loop(obj) {
          array = [];
          if (!obj.iframe || obj.context.location.href !== 'about:blank') {
            collect(obj.context);
            if (!obj.iframe && !array.length) {
              doneCb();
              return;
            }
          }
          if (array.length) {
            array.forEach(function (iframe) {
              _this2.onIframeReady(iframe, function (obj) {
                count++;
                loop(obj);
              }, function (obj) {
                if (_this2.opt.debug) {
                  console.log(obj.error || obj);
                }
                if (++count === iframes) doneCb();
              });
            });
          } else if (count === iframes) {
            doneCb();
          }
        };
        loop({
          context: ctx
        });
      }
    }, {
      key: "createIterator",
      value: function createIterator(ctx, whatToShow) {
        var win = this.opt.window;
        return win.document.createNodeIterator(ctx, whatToShow, function () {
          return win.NodeFilter.FILTER_ACCEPT;
        }, false);
      }
    }, {
      key: "addRemoveStyle",
      value: function addRemoveStyle(root, style, add) {
        if (add && !style) return;
        var elem = root.querySelector('style[data-markjs]');
        if (add) {
          if (!elem) {
            elem = this.opt.window.document.createElement('style');
            elem.setAttribute('data-markjs', 'true');
            root.appendChild(elem);
          }
          elem.textContent = style;
        } else if (elem) {
          root.removeChild(elem);
        }
      }
    }, {
      key: "isIframe",
      value: function isIframe(node) {
        return node.tagName === 'IFRAME' && !DOMIterator.matches(node, this.opt.exclude);
      }
    }, {
      key: "iterateThroughNodes",
      value: function iterateThroughNodes(ctx, whatToShow, filterCb, eachCb, doneCb) {
        var _this3 = this;
        var filter = this.opt.window.NodeFilter,
          shadow = this.opt.shadowDOM,
          iframe = this.opt.iframes;
        if (iframe || shadow) {
          var showElement = (whatToShow & filter.SHOW_ELEMENT) > 0,
            showText = (whatToShow & filter.SHOW_TEXT) > 0;
          var traverse = function traverse(node) {
            var iterator = _this3.createIterator(node, whatToShow | filter.SHOW_ELEMENT),
              root;
            while (node = iterator.nextNode()) {
              if (node.nodeType === 1) {
                if (showElement && filterCb(node)) {
                  eachCb(node);
                }
                if (iframe && _this3.isIframe(node) && _this3.map.some(function (arr) {
                  return arr[0] === node && arr[1] === 'ready';
                })) {
                  var doc = node.contentWindow.document;
                  if (doc) traverse(doc);
                }
                if (shadow && (root = node.shadowRoot) && root.mode === 'open') {
                  _this3.addRemoveStyle(root, shadow.style, showText);
                  traverse(root);
                }
              } else if (showText && node.nodeType === 3 && filterCb(node)) {
                eachCb(node);
              }
            }
          };
          traverse(ctx);
        } else {
          var iterator = this.createIterator(ctx, whatToShow);
          var node;
          while (node = iterator.nextNode()) {
            if (filterCb(node)) {
              eachCb(node);
            }
          }
        }
        doneCb();
      }
    }, {
      key: "forEachNode",
      value: function forEachNode(whatToShow, each, filter) {
        var _this4 = this;
        var done = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};
        var contexts = this.getContexts();
        var open = contexts.length;
        if (!open) done();
        var ready = function ready() {
          contexts.forEach(function (ctx) {
            _this4.iterateThroughNodes(ctx, whatToShow, filter, each, function () {
              if (--open <= 0) done();
            });
          });
        };
        if (this.opt.iframes) {
          var count = open,
            fired = false;
          var id = setTimeout(function () {
            fired = true;
            ready();
          }, this.opt.iframesTimeout);
          var finish = function finish() {
            clearTimeout(id);
            if (!fired) ready();
          };
          contexts.forEach(function (ctx) {
            _this4.waitForIframes(ctx, function () {
              if (--count <= 0) finish();
            });
          });
        } else {
          ready();
        }
      }
    }], [{
      key: "matches",
      value: function matches(element, selector) {
        if (!selector || !selector.length) {
          return false;
        }
        var selectors = typeof selector === 'string' ? [selector] : selector;
        var fn = element.matches || element.matchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.webkitMatchesSelector;
        return fn && selectors.some(function (sel) {
          return fn.call(element, sel);
        });
      }
    }]);
    return DOMIterator;
  }();

  var RegExpCreator = /*#__PURE__*/function () {
    function RegExpCreator(options) {
      _classCallCheck(this, RegExpCreator);
      this.opt = _extends({}, {
        'diacritics': true,
        'synonyms': {},
        'accuracy': 'partially',
        'caseSensitive': false,
        'ignoreJoiners': false,
        'ignorePunctuation': [],
        'wildcards': 'disabled'
      }, options);
    }
    _createClass(RegExpCreator, [{
      key: "chars",
      get: function get() {
        var _this = this;
        if (!this._chars) {
          this._chars = [];
          ['aàáảãạăằắẳẵặâầấẩẫậäåāą', 'cçćč', 'dđď', 'eèéẻẽẹêềếểễệëěēę', 'iìíỉĩịîïī', 'lł', 'nñňń', 'oòóỏõọôồốổỗộơởỡớờợöøōő', 'rř', 'sšśșş', 'tťțţ', 'uùúủũụưừứửữựûüůūű', 'yýỳỷỹỵÿ', 'zžżź'].forEach(function (str) {
            _this._chars.push(str, str.toUpperCase());
          });
        }
        return this._chars;
      }
    }, {
      key: "create",
      value: function create(str, patterns) {
        var flags = 'g' + (this.opt.caseSensitive ? '' : 'i');
        str = this.checkWildcardsEscape(str);
        str = this.createSynonyms(str, flags);
        var joiners = this.getJoinersPunctuation();
        if (joiners) {
          str = this.setupIgnoreJoiners(str);
        }
        if (this.opt.diacritics) {
          str = this.createDiacritics(str);
        }
        str = str.replace(/\s+/g, '[\\s]+');
        if (joiners) {
          str = this.createJoiners(str, joiners);
        }
        if (this.opt.wildcards !== 'disabled') {
          str = this.createWildcards(str);
        }
        var obj = this.createAccuracy(str);
        return patterns ? obj : new RegExp("".concat(obj.lookbehind, "(").concat(obj.pattern, ")").concat(obj.lookahead), flags);
      }
    }, {
      key: "createCombinePattern",
      value: function createCombinePattern(array, capture) {
        var _this2 = this;
        if (!Array.isArray(array) || !array.length) {
          return null;
        }
        var group = capture ? '(' : '(?:',
          obj = this.create(array[0], true);
        obj.pattern = this.distinct(array.map(function (str) {
          return "".concat(group).concat(_this2.create(str, true).pattern, ")");
        })).join('|');
        return obj;
      }
    }, {
      key: "sortByLength",
      value: function sortByLength(arry) {
        return arry.sort(function (a, b) {
          return a.length === b.length ? a > b ? 1 : -1 : b.length - a.length;
        });
      }
    }, {
      key: "escape",
      value: function escape(str) {
        return str.replace(/[[\]/{}()*+?.\\^$|]/g, '\\$&');
      }
    }, {
      key: "preprocess",
      value: function preprocess(val) {
        if (val && val.length) {
          return this.distinct(typeof val === 'string' ? val.split('') : val).join('').replace(/[-^\]\\]/g, '\\$&');
        }
        return '';
      }
    }, {
      key: "distinct",
      value: function distinct(array) {
        var result = [];
        array.forEach(function (item) {
          if (item.trim() && result.indexOf(item) === -1) {
            result.push(item);
          }
        });
        return result;
      }
    }, {
      key: "createSynonyms",
      value: function createSynonyms(str, flags) {
        var _this3 = this;
        var syn = this.opt.synonyms;
        if (!Object.keys(syn).length) {
          return str;
        }
        for (var key in syn) {
          if (syn.hasOwnProperty(key)) {
            var array = Array.isArray(syn[key]) ? syn[key] : [syn[key]];
            array.unshift(key);
            array = this.sortByLength(this.distinct(array)).map(function (term) {
              return _this3.checkWildcardsEscape(term);
            });
            if (array.length > 1) {
              var pattern = array.map(function (k) {
                return _this3.escape(k);
              }).join('|');
              str = str.replace(new RegExp(pattern, flags), "(?:".concat(array.join('|'), ")"));
            }
          }
        }
        return str;
      }
    }, {
      key: "checkWildcardsEscape",
      value: function checkWildcardsEscape(str) {
        if (this.opt.wildcards !== 'disabled') {
          str = str.replace(/(\\.)+|[?*]/g, function (m, gr) {
            return gr ? m : m === '?' ? '\x01' : '\x02';
          }).replace(/\\(?=[?*\x01\x02])/g, '');
        }
        return this.escape(str);
      }
    }, {
      key: "createWildcards",
      value: function createWildcards(str) {
        var spaces = this.opt.wildcards === 'withSpaces',
          boundary = this.opt.blockElementsBoundary,
          anyChar = "[^".concat(spaces && boundary ? '\x01' : '', "]*?");
        return str.replace(/\x01/g, spaces ? '[^]?' : '\\S?').replace(/\x02/g, spaces ? anyChar : '\\S*');
      }
    }, {
      key: "setupIgnoreJoiners",
      value: function setupIgnoreJoiners(str) {
        var reg = /((?:\\\\)+|\x02|\(\?:|\|)|\\?(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|.)(?=([|)\x02]|$)|.)/g;
        return str.replace(reg, function (m, gr1, gr2) {
          return gr1 || typeof gr2 !== 'undefined' ? m : m + '\x00';
        });
      }
    }, {
      key: "createJoiners",
      value: function createJoiners(str, joiners) {
        return str.split(/\x00+/).join("[".concat(joiners, "]*"));
      }
    }, {
      key: "getJoinersPunctuation",
      value: function getJoinersPunctuation() {
        var punct = this.preprocess(this.opt.ignorePunctuation),
          str = punct ? punct : '';
        if (this.opt.ignoreJoiners) {
          str += "\\u00ad\\u200b\\u200c\\u200d";
        }
        return str;
      }
    }, {
      key: "createDiacritics",
      value: function createDiacritics(str) {
        var _this4 = this;
        var array = this.chars;
        return str.split('').map(function (ch) {
          for (var i = 0; i < array.length; i += 2) {
            var lowerCase = array[i].indexOf(ch) !== -1;
            if (_this4.opt.caseSensitive) {
              if (lowerCase) {
                return '[' + array[i] + ']';
              } else if (array[i + 1].indexOf(ch) !== -1) {
                return '[' + array[i + 1] + ']';
              }
            } else if (lowerCase || array[i + 1].indexOf(ch) !== -1) {
              return '[' + array[i] + array[i + 1] + ']';
            }
          }
          return ch;
        }).join('');
      }
    }, {
      key: "createAccuracy",
      value: function createAccuracy(str) {
        var chars = '!-/:-@[-`{-~¡¿';
        var accuracy = this.opt.accuracy,
          lookbehind = '()',
          pattern = str,
          lookahead = '',
          limiters;
        if (typeof accuracy !== 'string') {
          limiters = this.preprocess(accuracy.limiters);
          accuracy = accuracy.value;
        }
        if (accuracy === 'exactly') {
          var charSet = limiters ? '[\\s' + limiters + ']' : '\\s';
          lookbehind = "(^|".concat(charSet, ")");
          lookahead = "(?=$|".concat(charSet, ")");
        } else {
          var chs = limiters || chars,
            _charSet = "[^\\s".concat(chs, "]*");
          if (accuracy === 'complementary') {
            pattern = _charSet + str + _charSet;
          } else if (accuracy === 'startsWith') {
            lookbehind = "(^|[\\s".concat(chs, "])");
            pattern = str.split(/\[\\s\]\+/).join(_charSet + '[\\s]+') + _charSet;
          }
        }
        return {
          lookbehind: lookbehind,
          pattern: pattern,
          lookahead: lookahead
        };
      }
    }]);
    return RegExpCreator;
  }();

  var Mark$1 = /*#__PURE__*/function () {
    function Mark(ctx) {
      _classCallCheck(this, Mark);
      this.ctx = ctx;
      this.nodeNames = ['script', 'style', 'title', 'head', 'html'];
    }
    _createClass(Mark, [{
      key: "opt",
      get: function get() {
        return this._opt;
      },
      set: function set(val) {
        if (!(val && val.window && val.window.document) && typeof window === 'undefined') {
          throw new Error('Mark.js: please provide a window object as an option.');
        }
        var win = val && val.window || window;
        this._opt = _extends({}, {
          'window': win,
          'element': '',
          'className': '',
          'exclude': [],
          'iframes': false,
          'iframesTimeout': 5000,
          'separateWordSearch': true,
          'acrossElements': false,
          'ignoreGroups': 0,
          'each': function each() {},
          'noMatch': function noMatch() {},
          'filter': function filter() {
            return true;
          },
          'done': function done() {},
          'debug': false,
          'log': win.console
        }, val);
        if (!this._opt.element) {
          this._opt.element = 'mark';
        }
        this.filter = win.NodeFilter;
        this.empty = win.document.createTextNode('');
      }
    }, {
      key: "iterator",
      get: function get() {
        return new DOMIterator(this.ctx, this.opt);
      }
    }, {
      key: "log",
      value: function log(msg) {
        var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'debug';
        if (this.opt.debug) {
          var log = this.opt.log;
          if (_typeof(log) === 'object' && typeof log[level] === 'function') {
            log[level]("mark.js: ".concat(msg));
          }
        }
      }
    }, {
      key: "report",
      value: function report(array) {
        var _this = this;
        array.forEach(function (item) {
          _this.log("".concat(item.text, " ").concat(JSON.stringify(item.obj)), item.level || 'debug');
          if (!item.skip) {
            _this.opt.noMatch(item.obj);
          }
        });
      }
    }, {
      key: "checkOption",
      value: function checkOption(opt, del) {
        this.opt = opt;
        var dict = this.cacheDict,
          clear = true;
        if (dict) {
          if (!del && this.opt.cacheTextNodes) {
            if (this.opt.acrossElements) {
              if (dict.across) {
                clear = false;
              }
            } else if (!dict.across) {
              clear = false;
            }
          }
          if (clear) {
            this.cacheDict = null;
          }
        }
      }
    }, {
      key: "getSeachTerms",
      value: function getSeachTerms(sv) {
        var search = typeof sv === 'string' ? [sv] : sv,
          separate = this.opt.separateWordSearch,
          array = [],
          termStats = {},
          split = function split(str) {
            str.split(/ +/).forEach(function (word) {
              return add(word);
            });
          },
          add = function add(str) {
            if (str.trim() && array.indexOf(str) === -1) {
              array.push(str);
              termStats[str] = 0;
            }
          };
        search.forEach(function (str) {
          if (separate) {
            if (separate === 'preserveTerms') {
              str.split(/"("*[^"]+"*)"/).forEach(function (term, i) {
                if (i % 2 > 0) add(term);else split(term);
              });
            } else {
              split(str);
            }
          } else {
            add(str);
          }
        });
        array.sort(function (a, b) {
          return b.length - a.length;
        });
        return {
          terms: array,
          termStats: termStats
        };
      }
    }, {
      key: "isNumeric",
      value: function isNumeric(value) {
        return Number(parseFloat(value)) == value;
      }
    }, {
      key: "checkRanges",
      value: function checkRanges(array, logs, min, max) {
        var _this2 = this;
        var level = 'error';
        var ranges = array.filter(function (range) {
          if (_this2.isNumeric(range.start) && _this2.isNumeric(range.length)) {
            range.start = parseInt(range.start);
            range.length = parseInt(range.length);
            if (range.start >= min && range.start < max && range.length > 0) {
              return true;
            }
          }
          logs.push({
            text: 'Invalid range: ',
            obj: range,
            level: level
          });
          return false;
        }).sort(function (a, b) {
          return a.start - b.start;
        });
        if (this.opt.wrapAllRanges) {
          return ranges;
        }
        var lastIndex = 0,
          index;
        return ranges.filter(function (range) {
          index = range.start + range.length;
          if (range.start >= lastIndex) {
            lastIndex = index;
            return true;
          }
          logs.push({
            text: (index < lastIndex ? 'Nest' : 'Overlapp') + 'ing range: ',
            obj: range,
            level: level
          });
          return false;
        });
      }
    }, {
      key: "setType",
      value: function setType(tags, boundary) {
        var custom = Array.isArray(boundary.tagNames) && boundary.tagNames.length;
        if (custom) {
          boundary.tagNames.forEach(function (name) {
            return tags[name.toLowerCase()] = 2;
          });
        }
        if (!custom || boundary.extend) {
          for (var key in tags) {
            tags[key] = 2;
          }
        }
        tags['br'] = 3;
      }
    }, {
      key: "getTextNodesAcross",
      value: function getTextNodesAcross(cb) {
        var _this3 = this;
        if (this.opt.cacheTextNodes && this.cacheDict) {
          this.cacheDict.lastIndex = 0;
          this.cacheDict.lastTextIndex = 0;
          cb(this.cacheDict);
          return;
        }
        var tags = {
          div: 1,
          p: 1,
          li: 1,
          td: 1,
          tr: 1,
          th: 1,
          ul: 1,
          ol: 1,
          dd: 1,
          dl: 1,
          dt: 1,
          h1: 1,
          h2: 1,
          h3: 1,
          h4: 1,
          h5: 1,
          h6: 1,
          hr: 1,
          blockquote: 1,
          figcaption: 1,
          figure: 1,
          pre: 1,
          table: 1,
          thead: 1,
          tbody: 1,
          tfoot: 1,
          input: 1,
          img: 1,
          nav: 1,
          details: 1,
          label: 1,
          form: 1,
          select: 1,
          menu: 1,
          br: 3,
          menuitem: 1,
          main: 1,
          section: 1,
          article: 1,
          aside: 1,
          picture: 1,
          output: 1,
          button: 1,
          header: 1,
          footer: 1,
          address: 1,
          area: 1,
          canvas: 1,
          map: 1,
          fieldset: 1,
          textarea: 1,
          track: 1,
          video: 1,
          audio: 1,
          body: 1,
          iframe: 1,
          meter: 1,
          object: 1,
          svg: 1
        };
        var nodes = [],
          boundary = this.opt.blockElementsBoundary,
          priorityType = boundary ? 2 : 1;
        var ch = '\x01',
          tempType,
          type,
          prevNode;
        if (boundary) {
          this.setType(tags, boundary);
          if (boundary["char"]) {
            ch = boundary["char"].charAt(0);
          }
        }
        var obj = {
          text: '',
          regex: /\s/,
          tags: tags,
          boundary: boundary,
          startOffset: 0,
          str: '',
          ch: ch
        };
        this.iterator.forEachNode(this.filter.SHOW_ELEMENT | this.filter.SHOW_TEXT, function (node) {
          if (prevNode) {
            nodes.push(_this3.getNodeInfo(prevNode, node, type, obj));
          }
          type = null;
          prevNode = node;
        }, function (node) {
          if (node.nodeType === 1) {
            tempType = tags[node.nodeName.toLowerCase()];
            if (tempType === 3) {
              obj.str += '\n';
            }
            if (!type || tempType === priorityType) {
              type = tempType;
            }
            return false;
          }
          return !_this3.excluded(node.parentNode);
        }, function () {
          if (prevNode) {
            nodes.push(_this3.getNodeInfo(prevNode, null, type, obj));
          }
          cb(_this3.createDict(obj.text, nodes, true));
        });
      }
    }, {
      key: "getNodeInfo",
      value: function getNodeInfo(prevNode, node, type, obj) {
        var start = obj.text.length,
          startOffset = obj.startOffset,
          ch = obj.ch;
        var offset = 0,
          str = obj.str,
          text = prevNode.textContent;
        if (node) {
          var startBySpace = obj.regex.test(node.textContent[0]),
            both = startBySpace && obj.regex.test(text[text.length - 1]);
          if (obj.boundary || !both) {
            var separate = type;
            if (!type) {
              var parent = prevNode.parentNode;
              while (parent) {
                type = obj.tags[parent.nodeName.toLowerCase()];
                if (type) {
                  separate = !(parent === node.parentNode || parent.contains(node));
                  break;
                }
                parent = parent.parentNode;
              }
            }
            if (separate) {
              if (!both) {
                str += type === 1 ? ' ' : type === 2 ? ' ' + ch + ' ' : '';
              } else if (type === 2) {
                str += both ? ch : startBySpace ? ' ' + ch : ch + ' ';
              }
            }
          }
        }
        if (str) {
          text += str;
          offset = str.length;
          obj.startOffset -= offset;
          obj.str = '';
        }
        obj.text += text;
        return this.createInfo(prevNode, start, obj.text.length - offset, offset, startOffset);
      }
    }, {
      key: "getTextNodes",
      value: function getTextNodes(cb) {
        var _this4 = this;
        if (this.opt.cacheTextNodes && this.cacheDict) {
          cb(this.cacheDict);
          return;
        }
        var nodes = [],
          regex = /\n/g,
          newLines = [0],
          lines = this.opt.markLines,
          show = this.filter.SHOW_TEXT | (lines ? this.filter.SHOW_ELEMENT : 0);
        var text = '',
          len = 0,
          rm;
        this.iterator.forEachNode(show, function (node) {
          if (lines) {
            while ((rm = regex.exec(node.textContent)) !== null) {
              newLines.push(len + rm.index);
            }
          }
          text += node.textContent;
          nodes.push({
            start: len,
            end: len = text.length,
            offset: 0,
            node: node
          });
        }, function (node) {
          if (lines && node.nodeType === 1) {
            if (node.tagName === 'BR') {
              newLines.push(len);
            }
            return false;
          }
          return !_this4.excluded(node.parentNode);
        }, function () {
          var dict = _this4.createDict(text, nodes, false);
          if (lines) {
            newLines.push(len);
            dict.newLines = newLines;
          }
          cb(dict);
        });
      }
    }, {
      key: "createDict",
      value: function createDict(text, nodes, across) {
        var dict = {
          text: text,
          nodes: nodes,
          lastIndex: 0,
          lastTextIndex: 0
        };
        if (this.opt.cacheTextNodes) {
          this.cacheDict = dict;
          this.cacheDict.across = across;
        }
        return dict;
      }
    }, {
      key: "excluded",
      value: function excluded(elem) {
        return this.nodeNames.indexOf(elem.nodeName.toLowerCase()) !== -1 || DOMIterator.matches(elem, this.opt.exclude);
      }
    }, {
      key: "wrapRangeInsert",
      value: function wrapRangeInsert(dict, n, s, e, start, index) {
        var ended = e === n.node.textContent.length,
          end = n.end;
        var type = 1,
          splitIndex = e,
          node = n.node;
        if (s !== 0) {
          node = node.splitText(s);
          splitIndex = e - s;
          type = ended ? 2 : 3;
        } else if (ended) {
          type = 0;
        }
        var retNode = ended ? this.empty : node.splitText(splitIndex),
          mark = this.wrapTextNode(node),
          markChild = mark.childNodes[0],
          nodeInfo = this.createInfo(retNode, type === 0 || type === 2 ? end : n.start + e, end, n.offset, n.startOffset);
        if (type === 0) {
          n.node = markChild;
          return {
            mark: mark,
            nodeInfo: nodeInfo,
            increment: 0
          };
        }
        var info = this.createInfo(markChild, type === 1 ? n.start : start, n.start + e, 0, n.startOffset);
        if (type === 1) {
          dict.nodes.splice(index, 1, info, nodeInfo);
        } else {
          if (type === 2) {
            dict.nodes.splice(index + 1, 0, info);
          } else {
            dict.nodes.splice(index + 1, 0, info, nodeInfo);
          }
          n.end = start;
          n.offset = 0;
        }
        return {
          mark: mark,
          nodeInfo: nodeInfo,
          increment: type < 3 ? 1 : 2
        };
      }
    }, {
      key: "createInfo",
      value: function createInfo(node, start, end, offset, startOffset) {
        return {
          node: node,
          start: start,
          end: end,
          offset: offset,
          startOffset: startOffset
        };
      }
    }, {
      key: "wrapRange",
      value: function wrapRange(node, start, end, eachCb) {
        var ended = end === node.textContent.length,
          index = end,
          retNode;
        if (start !== 0) {
          node = node.splitText(start);
          index = end - start;
        }
        retNode = ended ? this.empty : node.splitText(index);
        eachCb(this.wrapTextNode(node));
        return retNode;
      }
    }, {
      key: "wrapTextNode",
      value: function wrapTextNode(node) {
        var markNode = this.opt.window.document.createElement(this.opt.element);
        markNode.setAttribute('data-markjs', 'true');
        if (this.opt.className) {
          markNode.setAttribute('class', this.opt.className);
        }
        markNode.textContent = node.textContent;
        node.parentNode.replaceChild(markNode, node);
        return markNode;
      }
    }, {
      key: "wrapRangeAcross",
      value: function wrapRangeAcross(dict, start, end, filterCb, eachCb) {
        var i = dict.lastIndex,
          rangeStart = true;
        var wrapAllRanges = this.opt.wrapAllRanges || this.opt.cacheTextNodes;
        if (wrapAllRanges) {
          while (i > 0 && dict.nodes[i].start > start) {
            i--;
          }
        } else if (start < dict.lastTextIndex) {
          return;
        }
        for (i; i < dict.nodes.length; i++) {
          if (i + 1 === dict.nodes.length || dict.nodes[i + 1].start > start) {
            var n = dict.nodes[i];
            if (!filterCb(n)) break;
            var s = start - n.start,
              e = (end > n.end ? n.end : end) - n.start;
            if (s >= 0 && e > s) {
              if (wrapAllRanges) {
                var obj = this.wrapRangeInsert(dict, n, s, e, start, i);
                n = obj.nodeInfo;
                eachCb(obj.mark, rangeStart);
              } else {
                n.node = this.wrapRange(n.node, s, e, function (node) {
                  eachCb(node, rangeStart);
                });
                n.start += e;
                dict.lastTextIndex = n.start;
              }
              rangeStart = false;
            }
            if (end > n.end) {
              start = n.end + n.offset;
            } else {
              break;
            }
          }
        }
        dict.lastIndex = i;
      }
    }, {
      key: "wrapGroups",
      value: function wrapGroups(node, match, params, filterCb, eachCb) {
        var _this5 = this;
        var startIndex = match.index,
          isWrapped = false,
          group,
          start;
        params.groups.forEach(function (index) {
          group = match[index];
          if (group) {
            start = node.textContent.indexOf(group, startIndex);
            if (start !== -1) {
              if (filterCb(node, group, index)) {
                node = _this5.wrapRange(node, start, start + group.length, function (node) {
                  eachCb(node, index);
                });
                startIndex = 0;
                isWrapped = true;
              } else {
                startIndex = start + group.length;
              }
            }
          }
        });
        if (isWrapped) {
          params.regex.lastIndex = 0;
        }
        return node;
      }
    }, {
      key: "wrapGroupsAcross",
      value: function wrapGroupsAcross(dict, match, params, filterCb, eachCb) {
        var _this6 = this;
        var startIndex = 0,
          group,
          start,
          end;
        var s = match.index,
          text = match[0],
          wrap = function wrap(start, end, index) {
            _this6.wrapRangeAcross(dict, s + start, s + end, function (obj) {
              return filterCb(obj, text, index);
            }, function (node, groupStart) {
              eachCb(node, groupStart, index);
            });
          };
        if (this.opt.wrapAllRanges) {
          wrap(0, text.length, 0);
        }
        params.groups.forEach(function (index) {
          group = match[index];
          if (group) {
            start = text.indexOf(group, startIndex);
            if (start !== -1) {
              end = start + group.length;
              wrap(start, end, index);
              startIndex = end;
            }
          }
        });
      }
    }, {
      key: "wrapGroupsDFlag",
      value: function wrapGroupsDFlag(node, match, params, filterCb, eachCb) {
        var lastIndex = 0,
          offset = 0,
          i = 0,
          isWrapped = false,
          group,
          start,
          end = 0;
        while (++i < match.length) {
          group = match[i];
          if (group) {
            start = match.indices[i][0];
            if (start >= lastIndex) {
              end = match.indices[i][1];
              if (filterCb(node, group, i)) {
                node = this.wrapRange(node, start - offset, end - offset, function (node) {
                  eachCb(node, i);
                });
                if (end > lastIndex) {
                  lastIndex = end;
                }
                offset = end;
                isWrapped = true;
              }
            }
          }
        }
        if (isWrapped) {
          params.regex.lastIndex = 0;
        } else if (match[0].length === 0) {
          this.setLastIndex(params.regex, end);
        }
        return node;
      }
    }, {
      key: "wrapGroupsDFlagAcross",
      value: function wrapGroupsDFlagAcross(dict, match, params, filterCb, eachCb) {
        var lastIndex = 0,
          i = 0,
          group,
          start,
          end = 0,
          isWrapped;
        while (++i < match.length) {
          group = match[i];
          if (group) {
            start = match.indices[i][0];
            if (this.opt.wrapAllRanges || start >= lastIndex) {
              end = match.indices[i][1];
              isWrapped = false;
              this.wrapRangeAcross(dict, start, end, function (obj) {
                return filterCb(obj, group, i);
              }, function (node, groupStart) {
                isWrapped = true;
                eachCb(node, groupStart, i);
              });
              if (isWrapped && end > lastIndex) {
                lastIndex = end;
              }
            }
          }
        }
        if (match[0].length === 0) {
          this.setLastIndex(params.regex, end);
        }
      }
    }, {
      key: "setLastIndex",
      value: function setLastIndex(regex, end) {
        var index = regex.lastIndex;
        regex.lastIndex = end > index ? end : end > 0 ? index + 1 : Infinity;
      }
    }, {
      key: "collectGroupIndexes",
      value: function collectGroupIndexes(regex) {
        var groups = [],
          stack = [],
          index = 0,
          brackets = 0,
          str = regex.source,
          rm,
          reg = /(?:\\.)+|\[(?:[^\\\]]|(?:\\.))+\]|(\(\?<(?![=!])|\((?!\?))|(\()|(\))/g;
        while ((rm = reg.exec(str)) !== null) {
          if (rm[1]) {
            stack.push(1);
            index++;
            if (brackets++ === 0) {
              groups.push(index);
            }
          } else if (rm[2]) {
            stack.push(0);
          } else if (rm[3] && stack.pop()) {
            brackets--;
          }
        }
        return groups;
      }
    }, {
      key: "wrapSeparateGroups",
      value: function wrapSeparateGroups(regex, unused, filterCb, eachCb, endCb) {
        var _this7 = this;
        var hasIndices = regex.hasIndices,
          fn = hasIndices ? 'wrapGroupsDFlag' : 'wrapGroups',
          params = {
            regex: regex,
            groups: hasIndices ? {} : this.collectGroupIndexes(regex)
          },
          execution = {
            abort: false
          },
          info = {
            execution: execution
          };
        var node,
          match,
          filterStart,
          eachStart,
          count = 0;
        this.getTextNodes(function (dict) {
          dict.nodes.every(function (obj) {
            node = obj.node;
            info.offset = obj.start;
            while ((match = regex.exec(node.textContent)) !== null && (hasIndices || match[0] !== '')) {
              info.match = match;
              filterStart = eachStart = true;
              node = _this7[fn](node, match, params, function (node, group, grIndex) {
                info.matchStart = filterStart;
                info.groupIndex = grIndex;
                filterStart = false;
                return filterCb(node, group, info);
              }, function (node, grIndex) {
                if (eachStart) {
                  count++;
                }
                eachCb(node, {
                  match: match,
                  matchStart: eachStart,
                  count: count,
                  groupIndex: grIndex
                });
                eachStart = false;
              });
              if (execution.abort) break;
            }
            return !execution.abort;
          });
          endCb(count);
        });
      }
    }, {
      key: "wrapSeparateGroupsAcross",
      value: function wrapSeparateGroupsAcross(regex, unused, filterCb, eachCb, endCb) {
        var _this8 = this;
        var hasIndices = regex.hasIndices,
          fn = hasIndices ? 'wrapGroupsDFlagAcross' : 'wrapGroupsAcross',
          params = {
            regex: regex,
            groups: hasIndices ? {} : this.collectGroupIndexes(regex)
          },
          execution = {
            abort: false
          },
          info = {
            execution: execution
          };
        var match,
          filterStart,
          eachStart,
          count = 0;
        this.getTextNodesAcross(function (dict) {
          while ((match = regex.exec(dict.text)) !== null && (hasIndices || match[0] !== '')) {
            info.match = match;
            filterStart = eachStart = true;
            _this8[fn](dict, match, params, function (obj, group, grIndex) {
              info.matchStart = filterStart;
              info.groupIndex = grIndex;
              info.offset = obj.startOffset;
              filterStart = false;
              return filterCb(obj.node, group, info);
            }, function (node, groupStart, grIndex) {
              if (eachStart) {
                count++;
              }
              eachCb(node, {
                match: match,
                matchStart: eachStart,
                count: count,
                groupIndex: grIndex,
                groupStart: groupStart
              });
              eachStart = false;
            });
            if (execution.abort) break;
          }
          endCb(count);
        });
      }
    }, {
      key: "wrapMatches",
      value: function wrapMatches(regex, ignoreGroups, filterCb, eachCb, endCb) {
        var _this9 = this;
        var index = ignoreGroups === 0 ? 0 : ignoreGroups + 1,
          execution = {
            abort: false
          },
          filterInfo = {
            execution: execution
          };
        var info,
          node,
          match,
          str,
          count = 0;
        this.getTextNodes(function (dict) {
          for (var k = 0; k < dict.nodes.length; k++) {
            info = dict.nodes[k];
            node = info.node;
            while ((match = regex.exec(node.textContent)) !== null && (str = match[index]) !== '') {
              filterInfo.match = match;
              filterInfo.offset = info.start;
              if (!filterCb(node, str, filterInfo)) {
                continue;
              }
              var i = 0,
                start = match.index;
              while (++i < index) {
                if (match[i]) {
                  start += match[i].length;
                }
              }
              var end = start + str.length;
              if (_this9.opt.cacheTextNodes) {
                var obj = _this9.wrapRangeInsert(dict, info, start, end, info.start + start, k);
                eachCb(obj.mark, {
                  match: match,
                  count: ++count
                });
                if (obj.increment === 0) break;
                k += obj.increment;
                info = obj.nodeInfo;
                node = info.node;
              } else {
                node = _this9.wrapRange(node, start, end, function (node) {
                  eachCb(node, {
                    match: match,
                    count: ++count
                  });
                });
              }
              regex.lastIndex = 0;
              if (execution.abort) break;
            }
            if (execution.abort) break;
          }
          endCb(count);
        });
      }
    }, {
      key: "wrapMatchesAcross",
      value: function wrapMatchesAcross(regex, ignoreGroups, filterCb, eachCb, endCb) {
        var _this10 = this;
        var index = ignoreGroups === 0 ? 0 : ignoreGroups + 1,
          execution = {
            abort: false
          },
          filterInfo = {
            execution: execution
          };
        var match,
          str,
          matchStart,
          count = 0;
        this.getTextNodesAcross(function (dict) {
          while ((match = regex.exec(dict.text)) !== null && (str = match[index]) !== '') {
            filterInfo.match = match;
            matchStart = true;
            var i = 0,
              start = match.index;
            while (++i < index) {
              if (match[i]) {
                start += match[i].length;
              }
            }
            _this10.wrapRangeAcross(dict, start, start + str.length, function (obj) {
              filterInfo.matchStart = matchStart;
              filterInfo.offset = obj.startOffset;
              matchStart = false;
              return filterCb(obj.node, str, filterInfo);
            }, function (node, mStart) {
              if (mStart) {
                count++;
              }
              eachCb(node, {
                match: match,
                matchStart: mStart,
                count: count
              });
            });
            if (execution.abort) break;
          }
          endCb(count);
        });
      }
    }, {
      key: "wrapRanges",
      value: function wrapRanges(ranges, filterCb, eachCb, endCb) {
        var _this11 = this;
        var lines = this.opt.markLines,
          logs = [],
          skipped = [],
          level = 'warn';
        var count = 0;
        this.getTextNodes(function (dict) {
          var max = lines ? dict.newLines.length : dict.text.length,
            array = _this11.checkRanges(ranges, logs, lines ? 1 : 0, max);
          array.forEach(function (range, index) {
            var start = range.start,
              end = start + range.length;
            if (end > max) {
              logs.push({
                text: "Range was limited to: ".concat(max),
                obj: range,
                skip: true,
                level: level
              });
              end = max;
            }
            if (lines) {
              start = dict.newLines[start - 1];
              if (dict.text[start] === '\n') {
                start++;
              }
              end = dict.newLines[end - 1];
            }
            var substr = dict.text.substring(start, end);
            if (substr.trim()) {
              _this11.wrapRangeAcross(dict, start, end, function (obj) {
                return filterCb(obj.node, range, substr, index);
              }, function (node, rangeStart) {
                if (rangeStart) {
                  count++;
                }
                eachCb(node, range, {
                  matchStart: rangeStart,
                  count: count
                });
              });
            } else {
              logs.push({
                text: 'Skipping whitespace only range: ',
                obj: range,
                level: level
              });
              skipped.push(range);
            }
          });
          _this11.log("Valid ranges: ".concat(JSON.stringify(array.filter(function (range) {
            return skipped.indexOf(range) === -1;
          }))));
          endCb(count, logs);
        });
      }
    }, {
      key: "unwrapMatches",
      value: function unwrapMatches(node) {
        var parent = node.parentNode,
          first = node.firstChild;
        if (node.childNodes.length === 1) {
          if (first.nodeType === 3) {
            var previous = node.previousSibling,
              next = node.nextSibling;
            if (previous && previous.nodeType === 3) {
              if (next && next.nodeType === 3) {
                previous.nodeValue += first.nodeValue + next.nodeValue;
                parent.removeChild(next);
              } else {
                previous.nodeValue += first.nodeValue;
              }
            } else if (next && next.nodeType === 3) {
              next.nodeValue = first.nodeValue + next.nodeValue;
            } else {
              parent.replaceChild(node.firstChild, node);
              return;
            }
            parent.removeChild(node);
          } else {
            parent.replaceChild(node.firstChild, node);
          }
        } else {
          if (!first) {
            parent.removeChild(node);
          } else {
            var docFrag = this.opt.window.document.createDocumentFragment();
            while (node.firstChild) {
              docFrag.appendChild(node.removeChild(node.firstChild));
            }
            parent.replaceChild(docFrag, node);
          }
          parent.normalize();
        }
      }
    }, {
      key: "markRegExp",
      value: function markRegExp(regexp, opt) {
        var _this12 = this;
        this.checkOption(opt);
        var totalMarks = 0,
          matchesSoFar = 0,
          fn = this.opt.separateGroups ? 'wrapSeparateGroups' : 'wrapMatches';
        if (this.opt.acrossElements) {
          fn += 'Across';
          if (!regexp.global && !regexp.sticky) {
            var splits = regexp.toString().split('/');
            regexp = new RegExp(regexp.source, 'g' + splits[splits.length - 1]);
            this.log('RegExp is recompiled - it must have a `g` flag');
          }
        }
        this.log("RegExp \"".concat(regexp, "\""));
        this[fn](regexp, this.opt.ignoreGroups, function (node, match, filterInfo) {
          return _this12.opt.filter(node, match, matchesSoFar, filterInfo);
        }, function (element, eachInfo) {
          matchesSoFar = eachInfo.count;
          totalMarks++;
          _this12.opt.each(element, eachInfo);
        }, function (totalMatches) {
          if (totalMatches === 0) {
            _this12.opt.noMatch(regexp);
          }
          _this12.opt.done(totalMarks, totalMatches);
        });
      }
    }, {
      key: "mark",
      value: function mark(sv, opt) {
        var _this13 = this;
        this.checkOption(opt);
        var _this$getSeachTerms = this.getSeachTerms(sv),
          terms = _this$getSeachTerms.terms,
          termStats = _this$getSeachTerms.termStats;
        if (!terms.length) {
          this.opt.done(0, 0, termStats);
          return;
        }
        if (this.opt.combinePatterns) {
          this.markCombinePatterns(terms, termStats);
          return;
        }
        var index = 0,
          totalMarks = 0,
          matches = 0,
          totalMatches = 0,
          termMatches;
        var regCreator = new RegExpCreator(this.opt),
          fn = this.opt.acrossElements ? 'wrapMatchesAcross' : 'wrapMatches';
        var loop = function loop(term) {
          termMatches = 0;
          var regex = regCreator.create(term);
          _this13.log("RegExp \"".concat(regex, "\""));
          _this13[fn](regex, 1, function (node, t, filterInfo) {
            matches = totalMatches + termMatches;
            return _this13.opt.filter(node, term, matches, termMatches, filterInfo);
          }, function (element, eachInfo) {
            termMatches = eachInfo.count;
            totalMarks++;
            _this13.opt.each(element, eachInfo);
          }, function (count) {
            totalMatches += count;
            if (count === 0) {
              _this13.opt.noMatch(term);
            }
            termStats[term] = count;
            if (++index < terms.length) {
              loop(terms[index]);
            } else {
              _this13.opt.done(totalMarks, totalMatches, termStats);
            }
          });
        };
        loop(terms[index]);
      }
    }, {
      key: "markCombinePatterns",
      value: function markCombinePatterns(terms, termStats) {
        var _this14 = this;
        var index = 0,
          totalMarks = 0,
          totalMatches = 0,
          term,
          termMatches;
        var across = this.opt.acrossElements,
          fn = across ? 'wrapMatchesAcross' : 'wrapMatches',
          flags = "g".concat(this.opt.caseSensitive ? '' : 'i'),
          patterns = this.getPatterns(terms);
        var loop = function loop(_ref) {
          var pattern = _ref.pattern,
            regTerms = _ref.regTerms;
          var regex = new RegExp(pattern, flags);
          _this14.log("RegExp \"".concat(regex, "\""));
          _this14[fn](regex, 1, function (node, t, filterInfo) {
            if (!across || filterInfo.matchStart) {
              term = _this14.getCurrentTerm(filterInfo.match, regTerms);
            }
            termMatches = termStats[term];
            return _this14.opt.filter(node, term, totalMatches + termMatches, termMatches, filterInfo);
          }, function (element, eachInfo) {
            totalMarks++;
            if (!across || eachInfo.matchStart) {
              termStats[term] += 1;
            }
            _this14.opt.each(element, eachInfo);
          }, function (count) {
            totalMatches += count;
            var array = regTerms.filter(function (term) {
              return termStats[term] === 0;
            });
            if (array.length) {
              _this14.opt.noMatch(array);
            }
            if (++index < patterns.length) {
              loop(patterns[index]);
            } else {
              _this14.opt.done(totalMarks, totalMatches, termStats);
            }
          });
        };
        loop(patterns[index]);
      }
    }, {
      key: "getCurrentTerm",
      value: function getCurrentTerm(match, terms) {
        var i = match.length;
        while (--i > 2) {
          if (match[i]) {
            return terms[i - 3];
          }
        }
        return ' ';
      }
    }, {
      key: "getPatterns",
      value: function getPatterns(terms) {
        var creator = new RegExpCreator(this.opt),
          option = this.opt.combinePatterns,
          length = terms.length,
          array = [];
        var num = 10,
          value;
        if (option === Infinity) {
          num = length;
        } else if (Number.isInteger(option) && (value = parseInt(option)) > 0) {
          num = value;
        }
        for (var i = 0; i < length; i += num) {
          var chunk = terms.slice(i, Math.min(i + num, length)),
            obj = creator.createCombinePattern(chunk, true);
          array.push({
            pattern: "".concat(obj.lookbehind, "(").concat(obj.pattern, ")").concat(obj.lookahead),
            regTerms: chunk
          });
        }
        return array;
      }
    }, {
      key: "markRanges",
      value: function markRanges(ranges, opt) {
        var _this15 = this;
        this.checkOption(opt, true);
        if (Array.isArray(ranges)) {
          var totalMarks = 0;
          this.wrapRanges(ranges, function (node, range, match, index) {
            return _this15.opt.filter(node, range, match, index);
          }, function (elem, range, rangeInfo) {
            totalMarks++;
            _this15.opt.each(elem, range, rangeInfo);
          }, function (totalRanges, logs) {
            _this15.report(logs);
            _this15.opt.done(totalMarks, totalRanges);
          });
        } else {
          this.report([{
            text: 'markRanges() accept an array of objects: ',
            obj: ranges,
            level: 'error'
          }]);
          this.opt.done(0, 0);
        }
      }
    }, {
      key: "unmark",
      value: function unmark(opt) {
        var _this16 = this;
        this.checkOption(opt, true);
        var selector = this.opt.element + '[data-markjs]';
        if (this.opt.className) {
          selector += ".".concat(this.opt.className);
        }
        this.log("Removal selector \"".concat(selector, "\""));
        this.iterator.forEachNode(this.filter.SHOW_ELEMENT, function (node) {
          _this16.unwrapMatches(node);
        }, function (node) {
          return DOMIterator.matches(node, selector) && !_this16.excluded(node);
        }, this.opt.done);
      }
    }]);
    return Mark;
  }();

  function Mark(ctx) {
    var _this = this;
    var instance = new Mark$1(ctx);
    this.mark = function (sv, opt) {
      instance.mark(sv, opt);
      return _this;
    };
    this.markRegExp = function (sv, opt) {
      instance.markRegExp(sv, opt);
      return _this;
    };
    this.markRanges = function (sv, opt) {
      instance.markRanges(sv, opt);
      return _this;
    };
    this.unmark = function (opt) {
      instance.unmark(opt);
      return _this;
    };
    this.getVersion = function () {
      return '2.7.0';
    };
    return this;
  }

  return Mark;

}));
