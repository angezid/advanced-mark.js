/* Version: 2.0.0 - February 18, 2023 */
/*!***************************************************
* advanced-mark.js v2.0.0
* https://github.com/angezid/advanced-mark#readme
* MIT licensed
* Copyright (c) 2022–2023, angezid
* Original author Julian Kühnel, license https://git.io/vwTVl
*****************************************************/

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Mark = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
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
      Object.defineProperty(target, descriptor.key, descriptor);
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

  var DOMIterator = /*#__PURE__*/function () {
    function DOMIterator(ctx, opt) {
      _classCallCheck(this, DOMIterator);
      this.ctx = ctx;
      this.opt = opt;
      this.attrName = 'data-markjsListener';
    }
    _createClass(DOMIterator, [{
      key: "getContexts",
      value: function getContexts() {
        var ctx;
        if (typeof this.ctx === 'undefined' || !this.ctx) {
          ctx = [];
        } else if (NodeList.prototype.isPrototypeOf(this.ctx)) {
          ctx = Array.prototype.slice.call(this.ctx);
        } else if (Array.isArray(this.ctx)) {
          ctx = this.ctx;
        } else if (typeof this.ctx === 'string') {
          ctx = Array.prototype.slice.call(document.querySelectorAll(this.ctx));
        } else {
          ctx = [this.ctx];
        }
        var array = [];
        ctx.forEach(function (elem) {
          if (array.indexOf(elem) === -1 && !array.some(function (node) {
            return node.contains(elem);
          })) {
            array.push(elem);
          }
        });
        return array;
      }
    }, {
      key: "getIframeContents",
      value: function getIframeContents(iframe, successFn, errorFn) {
        try {
          var doc = iframe.contentWindow.document;
          if (doc) {
            iframe.setAttribute(this.attrName, 'completed');
            successFn({
              iframe: iframe,
              context: doc
            });
          }
        } catch (e) {
          iframe.setAttribute(this.attrName, 'error');
          errorFn({
            iframe: iframe,
            error: e
          });
        }
      }
    }, {
      key: "isIframeBlank",
      value: function isIframeBlank(ifr) {
        var bl = 'about:blank',
          src = ifr.getAttribute('src').trim(),
          href = ifr.contentWindow.location.href;
        return href === bl && src !== bl && src;
      }
    }, {
      key: "observeIframeLoad",
      value: function observeIframeLoad(ifr, successFn, errorFn) {
        var _this = this;
        if (ifr.hasAttribute(this.attrName)) {
          return;
        }
        var id = null;
        var listener = function listener() {
          clearTimeout(id);
          ifr.removeEventListener('load', listener);
          _this.getIframeContents(ifr, successFn, errorFn);
        };
        ifr.addEventListener('load', listener);
        ifr.setAttribute(this.attrName, true);
        id = setTimeout(listener, this.opt.iframesTimeout);
      }
    }, {
      key: "onIframeReady",
      value: function onIframeReady(ifr, successFn, errorFn) {
        try {
          if (ifr.contentWindow.document.readyState === 'complete') {
            if (this.isIframeBlank(ifr)) {
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
      key: "waitForAllIframes",
      value: function waitForAllIframes(ctx, doneCb) {
        var _this2 = this;
        var count = 0,
          iframes = [],
          array = [],
          fired = false;
        var id = setTimeout(function () {
          fired = true;
          doneCb();
        }, this.opt.iframesTimeout);
        var done = function done() {
          clearTimeout(id);
          if (!fired) {
            doneCb();
          }
        };
        var checkDone = function checkDone() {
          if (count === iframes.filter(function (ifr) {
            return !_this2.hasAttributeValue(ifr, _this2.attrName, 'error');
          }).length) {
            done();
          }
        };
        var loop = function loop(obj) {
          if (!obj.iframe || obj.context.location.href !== 'about:blank') {
            array = [];
            obj.context.querySelectorAll(obj.iframe ? 'body iframe' : 'iframe').forEach(function (iframe) {
              if (!DOMIterator.matches(iframe, _this2.opt.exclude)) {
                iframes.push(iframe);
                if (!iframe.hasAttribute(_this2.attrName)) {
                  array.push(iframe);
                }
              }
            });
            if (!obj.iframe && !array.length) {
              done();
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
                  console.log(obj.error);
                }
                checkDone();
              });
            });
          } else {
            checkDone();
          }
        };
        loop({
          context: ctx
        });
      }
    }, {
      key: "createIterator",
      value: function createIterator(ctx, whatToShow, filter) {
        return document.createNodeIterator(ctx, whatToShow, filter, false);
      }
    }, {
      key: "addRemoveStyle",
      value: function addRemoveStyle(root, style, add) {
        if (add) {
          if (!style || !root.firstChild || root.querySelector('style[data-markjs]')) {
            return;
          }
          root.insertBefore(style, root.firstChild);
        } else {
          var elem = root.querySelector('style[data-markjs]');
          if (elem) {
            root.removeChild(elem);
          }
        }
      }
    }, {
      key: "createStyleElement",
      value: function createStyleElement() {
        var style = document.createElement('style');
        style.setAttribute('data-markjs', 'true');
        style.textContent = this.opt.shadowDOM.style;
        return style;
      }
    }, {
      key: "hasAttributeValue",
      value: function hasAttributeValue(node, name, value) {
        return node.hasAttribute(name) && node.getAttribute(name) === value;
      }
    }, {
      key: "iterateThroughNodes",
      value: function iterateThroughNodes(ctx, whatToShow, filterCb, eachCb, doneCb) {
        var _this3 = this;
        var shadow = this.opt.shadowDOM,
          iframe = this.opt.iframes;
        if (iframe || shadow) {
          var showElement = (whatToShow & NodeFilter.SHOW_ELEMENT) !== 0,
            showText = (whatToShow & NodeFilter.SHOW_TEXT) !== 0,
            style = shadow && shadow.style ? this.createStyleElement() : null;
          if (showText) {
            whatToShow = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT;
          }
          var traverse = function traverse(node) {
            var iterator = _this3.createIterator(node, whatToShow);
            while (node = iterator.nextNode()) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (showElement && filterCb(node) === NodeFilter.FILTER_ACCEPT) {
                  eachCb(node);
                }
                if (iframe && node.nodeName.toUpperCase() === 'IFRAME' && !DOMIterator.matches(node, _this3.opt.exclude)) {
                  if (_this3.hasAttributeValue(node, _this3.attrName, 'completed')) {
                    _this3.getIframeContents(node, function (obj) {
                      traverse(obj.context);
                    }, function () {});
                  }
                }
                if (shadow && node.shadowRoot && node.shadowRoot.mode === 'open') {
                  _this3.addRemoveStyle(node.shadowRoot, style, showText);
                  traverse(node.shadowRoot);
                }
              } else if (showText && node.nodeType === Node.TEXT_NODE && filterCb(node) === NodeFilter.FILTER_ACCEPT) {
                eachCb(node);
              }
            }
          };
          traverse(ctx);
        } else {
          var iterator = this.createIterator(ctx, whatToShow, filterCb);
          var node;
          while (node = iterator.nextNode()) {
            eachCb(node);
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
        if (!open) {
          done();
        }
        contexts.forEach(function (ctx) {
          open--;
          var ready = function ready() {
            _this4.iterateThroughNodes(ctx, whatToShow, filter, each, function () {
              if (open <= 0) {
                done();
              }
            });
          };
          if (_this4.opt.iframes) {
            _this4.waitForAllIframes(ctx, ready);
          } else {
            ready();
          }
        });
      }
    }], [{
      key: "matches",
      value: function matches(element, selector) {
        var selectors = typeof selector === 'string' ? [selector] : selector;
        if (!selectors) {
          return false;
        }
        var fn = element.matches || element.matchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.webkitMatchesSelector;
        return fn ? selectors.some(function (sel) {
          return fn.call(element, sel) === true;
        }) : false;
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
      key: "create",
      value: function create(str, patterns) {
        if (this.opt.wildcards !== 'disabled') {
          str = this.setupWildcardsRegExp(str);
        }
        str = this.escapeStr(str);
        if (Object.keys(this.opt.synonyms).length) {
          str = this.createSynonymsRegExp(str);
        }
        if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
          str = this.setupIgnoreJoinersRegExp(str);
        }
        if (this.opt.diacritics) {
          str = this.createDiacriticsRegExp(str);
        }
        str = this.createMergedBlanksRegExp(str);
        if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
          str = this.createJoinersRegExp(str);
        }
        if (this.opt.wildcards !== 'disabled') {
          str = this.createWildcardsRegExp(str);
        }
        if (patterns) {
          return this.createAccuracyRegExp(str, true);
        } else {
          str = this.createAccuracyRegExp(str, false);
          return new RegExp(str, "gm".concat(this.opt.caseSensitive ? '' : 'i'));
        }
      }
    }, {
      key: "createCombinePattern",
      value: function createCombinePattern(array, capture) {
        var _this = this;
        if (!Array.isArray(array) || !array.length) {
          return null;
        }
        var group = capture ? '(' : '(?:',
          obj = this.create(array[0], true),
          lookbehind = obj.lookbehind,
          lookahead = obj.lookahead,
          pattern = array.map(function (str) {
            return "".concat(group).concat(_this.create(str, true).pattern, ")");
          }).join('|');
        return {
          lookbehind: lookbehind,
          pattern: pattern,
          lookahead: lookahead
        };
      }
    }, {
      key: "sortByLength",
      value: function sortByLength(arry) {
        return arry.sort(function (a, b) {
          return a.length === b.length ? a > b ? 1 : -1 : b.length - a.length;
        });
      }
    }, {
      key: "escapeStr",
      value: function escapeStr(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
      }
    }, {
      key: "createSynonymsRegExp",
      value: function createSynonymsRegExp(str) {
        var _this2 = this;
        var syn = this.opt.synonyms,
          sens = this.opt.caseSensitive ? '' : 'i';
        for (var index in syn) {
          if (syn.hasOwnProperty(index)) {
            var keys = Array.isArray(syn[index]) ? syn[index] : [syn[index]];
            keys.unshift(index);
            keys = this.sortByLength(keys).map(function (key) {
              if (_this2.opt.wildcards !== 'disabled') {
                key = _this2.setupWildcardsRegExp(key);
              }
              key = _this2.escapeStr(key);
              return key;
            }).filter(function (k) {
              return k !== '';
            });
            if (keys.length > 1) {
              var pattern = keys.map(function (k) {
                return _this2.escapeStr(k);
              }).join('|');
              str = str.replace(new RegExp("(?:".concat(pattern, ")"), "gm".concat(sens)), "(?:".concat(keys.join('|'), ")"));
            }
          }
        }
        return str;
      }
    }, {
      key: "setupWildcardsRegExp",
      value: function setupWildcardsRegExp(str) {
        str = str.replace(/(?:\\)*\?/g, function (val) {
          return val.charAt(0) === '\\' ? '?' : "\x01";
        });
        return str.replace(/(?:\\)*\*/g, function (val) {
          return val.charAt(0) === '\\' ? '*' : "\x02";
        });
      }
    }, {
      key: "createWildcardsRegExp",
      value: function createWildcardsRegExp(str) {
        var spaces = this.opt.wildcards === 'withSpaces';
        return str.replace(/\u0001/g, spaces ? '[\\S\\s]?' : '\\S?').replace(/\u0002/g, spaces ? '[\\S\\s]*?' : '\\S*');
      }
    }, {
      key: "setupIgnoreJoinersRegExp",
      value: function setupIgnoreJoinersRegExp(str) {
        return str.replace(/(\(\?:|\|)|\\?.(?=([|)]|$)|.)/g, function (m, gr1, gr2) {
          return gr1 || typeof gr2 !== 'undefined' ? m : m + "\0";
        });
      }
    }, {
      key: "createJoinersRegExp",
      value: function createJoinersRegExp(str) {
        var joiner = [];
        var ignorePunctuation = this.opt.ignorePunctuation;
        if (Array.isArray(ignorePunctuation) && ignorePunctuation.length) {
          joiner.push(this.escapeStr(ignorePunctuation.join('')));
        }
        if (this.opt.ignoreJoiners) {
          joiner.push("\\u00ad\\u200b\\u200c\\u200d");
        }
        return joiner.length ? str.split(/\u0000+/).join("[".concat(joiner.join(''), "]*")) : str;
      }
    }, {
      key: "createDiacriticsRegExp",
      value: function createDiacriticsRegExp(str) {
        var caseSensitive = this.opt.caseSensitive,
          array = ['aàáảãạăằắẳẵặâầấẩẫậäåāą', 'AÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ', 'cçćč', 'CÇĆČ', 'dđď', 'DĐĎ', 'eèéẻẽẹêềếểễệëěēę', 'EÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ', 'iìíỉĩịîïī', 'IÌÍỈĨỊÎÏĪ', 'lł', 'LŁ', 'nñňń', 'NÑŇŃ', 'oòóỏõọôồốổỗộơởỡớờợöøō', 'OÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ', 'rř', 'RŘ', 'sšśșş', 'SŠŚȘŞ', 'tťțţ', 'TŤȚŢ', 'uùúủũụưừứửữựûüůū', 'UÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ', 'yýỳỷỹỵÿ', 'YÝỲỶỸỴŸ', 'zžżź', 'ZŽŻŹ'];
        return str.split('').map(function (ch) {
          for (var i = 0; i < array.length; i += 2) {
            if (caseSensitive) {
              if (array[i].indexOf(ch) !== -1) {
                return '[' + array[i] + ']';
              } else if (array[i + 1].indexOf(ch) !== -1) {
                return '[' + array[i + 1] + ']';
              }
            } else if (array[i].indexOf(ch) !== -1 || array[i + 1].indexOf(ch) !== -1) {
              return '[' + array[i] + array[i + 1] + ']';
            }
          }
          return ch;
        }).join('');
      }
    }, {
      key: "createMergedBlanksRegExp",
      value: function createMergedBlanksRegExp(str) {
        return str.replace(/\s+/g, '[\\s]+');
      }
    }, {
      key: "createAccuracyRegExp",
      value: function createAccuracyRegExp(str, patterns) {
        var _this3 = this;
        var chars = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~¡¿';
        var acc = this.opt.accuracy,
          val = typeof acc === 'string' ? acc : acc.value,
          ls = typeof acc === 'string' ? [] : acc.limiters,
          lsJoin = '';
        ls.forEach(function (limiter) {
          lsJoin += "|".concat(_this3.escapeStr(limiter));
        });
        var lookbehind = '()',
          pattern,
          lookahead = '';
        switch (val) {
          case 'partially':
          default:
            pattern = str;
            break;
          case 'complementary':
            lsJoin = '\\s' + (lsJoin ? lsJoin : this.escapeStr(chars));
            pattern = "[^".concat(lsJoin, "]*").concat(str, "[^").concat(lsJoin, "]*");
            break;
          case 'exactly':
            lookbehind = "(^|\\s".concat(lsJoin, ")");
            pattern = str, lookahead = "(?=$|\\s".concat(lsJoin, ")");
            break;
        }
        if (patterns) {
          return {
            lookbehind: lookbehind,
            pattern: pattern,
            lookahead: lookahead
          };
        } else {
          return "".concat(lookbehind, "(").concat(pattern, ")").concat(lookahead);
        }
      }
    }]);
    return RegExpCreator;
  }();

  var Mark$1 = /*#__PURE__*/function () {
    function Mark(ctx) {
      _classCallCheck(this, Mark);
      this.version = '2.0.0';
      this.ctx = ctx;
      this.cacheDict = {};
    }
    _createClass(Mark, [{
      key: "opt",
      get: function get() {
        return this._opt;
      },
      set: function set(val) {
        this._opt = _extends({}, {
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
          'log': window.console
        }, val);
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
        var log = this.opt.log;
        if (!this.opt.debug) {
          return;
        }
        if (_typeof(log) === 'object' && typeof log[level] === 'function') {
          log[level]("mark.js: ".concat(msg));
        }
      }
    }, {
      key: "report",
      value: function report(array) {
        var _this = this;
        array.forEach(function (item) {
          _this.log("".concat(item.text, " ").concat(JSON.stringify(item.obj)), item.level ? item.level : 'debug');
          if (!item.skip) {
            _this.opt.noMatch(item.obj);
          }
        });
      }
    }, {
      key: "checkOption",
      value: function checkOption(opt) {
        if (opt && opt.acrossElements && opt.cacheTextNodes && !opt.wrapAllRanges) {
          opt = _extends({}, opt, {
            'wrapAllRanges': true
          });
        }
        var clear = true;
        if (opt && opt.cacheTextNodes && this.cacheDict.type) {
          if (opt.acrossElements) {
            if (this.cacheDict.type === 'across') {
              clear = false;
            }
          } else if (this.cacheDict.type === 'every') {
            clear = false;
          }
        }
        if (clear) {
          this.cacheDict = {};
        }
        return opt;
      }
    }, {
      key: "getSeparatedKeywords",
      value: function getSeparatedKeywords(sv) {
        var _this2 = this;
        var stack = [];
        sv.forEach(function (kw) {
          if (!_this2.opt.separateWordSearch) {
            if (kw.trim() && stack.indexOf(kw) === -1) {
              stack.push(kw);
            }
          } else {
            kw.split(' ').forEach(function (kwSplitted) {
              if (kwSplitted.trim() && stack.indexOf(kwSplitted) === -1) {
                stack.push(kwSplitted);
              }
            });
          }
        });
        return {
          'keywords': stack.sort(function (a, b) {
            return b.length - a.length;
          }),
          'length': stack.length
        };
      }
    }, {
      key: "isNumeric",
      value: function isNumeric(value) {
        return Number(parseFloat(value)) == value;
      }
    }, {
      key: "isObject",
      value: function isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
      }
    }, {
      key: "isArrayOfObjects",
      value: function isArrayOfObjects(array) {
        var _this3 = this;
        return Array.isArray(array) && array.some(function (item) {
          return _this3.isObject(item);
        });
      }
    }, {
      key: "checkRanges",
      value: function checkRanges(array, logs, max) {
        var _this4 = this;
        var level = 'error';
        var ranges = array.filter(function (range) {
          var valid = false;
          if (_this4.isNumeric(range.start) && _this4.isNumeric(range.length)) {
            range.start = parseInt(range.start);
            range.length = parseInt(range.length);
            if (range.start >= 0 && range.start < max && range.length > 0) {
              valid = true;
            }
          }
          if (!valid) {
            logs.push({
              text: 'Ignoring invalid range: ',
              obj: range,
              level: level
            });
            return false;
          }
          return true;
        }).sort(function (a, b) {
          return a.start - b.start;
        });
        if (this.opt.wrapAllRanges) {
          return ranges;
        }
        var lastIndex = 0,
          type;
        return ranges.filter(function (range) {
          if (range.start >= lastIndex) {
            lastIndex = range.start + range.length;
            return true;
          }
          type = range.start + range.length < lastIndex ? 'nesting' : 'overlapping';
          logs.push({
            text: "Ignoring ".concat(type, " range: "),
            obj: range,
            level: level
          });
          return false;
        });
      }
    }, {
      key: "setType",
      value: function setType(tags) {
        var boundary = this.opt.blockElementsBoundary,
          custom = Array.isArray(boundary.tagNames) && boundary.tagNames.length;
        if (custom) {
          boundary.tagNames.map(function (name) {
            return name.toLowerCase();
          }).forEach(function (name) {
            tags[name] = 2;
          });
        }
        if (!custom || boundary.extend) {
          for (var key in tags) {
            tags[key] = 2;
          }
        }
        tags['br'] = 1;
      }
    }, {
      key: "getTextNodesAcross",
      value: function getTextNodesAcross(cb) {
        var _this5 = this;
        if (this.opt.cacheTextNodes && this.cacheDict.nodes) {
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
          br: 1,
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
        var boundary = this.opt.blockElementsBoundary;
        var str = '\x01',
          temp,
          prevNode,
          currNode,
          type;
        if (boundary) {
          this.setType(tags);
          if (boundary["char"]) {
            str = boundary["char"].charAt(0);
          }
        }
        var obj = {
          nodes: [],
          text: '',
          tags: tags,
          boundary: boundary,
          startOffset: 0,
          str: str,
          str1: ' ' + str,
          str2: str + ' ',
          str3: ' ' + str + ' '
        };
        this.iterator.forEachNode(NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, function (node) {
          if (!currNode) {
            prevNode = currNode = node;
          } else {
            currNode = node;
            _this5.getNodeInfo(prevNode, node, type, obj);
            prevNode = node;
            type = null;
          }
        }, function (node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (!type) {
              type = tags[node.nodeName.toLowerCase()];
            } else {
              if ((temp = tags[node.nodeName.toLowerCase()]) && temp === 2) {
                type = temp;
              }
            }
            return NodeFilter.FILTER_REJECT;
          }
          return _this5.excludeElements(node.parentNode) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }, function () {
          if (currNode) {
            _this5.getNodeInfo(prevNode, currNode, type, obj);
          }
          var dict = {
            text: obj.text,
            nodes: obj.nodes,
            lastIndex: 0,
            lastTextIndex: 0
          };
          if (_this5.opt.cacheTextNodes) {
            _this5.cacheDict = dict;
            _this5.cacheDict.type = 'across';
          }
          cb(dict);
        });
      }
    }, {
      key: "getNodeInfo",
      value: function getNodeInfo(prevNode, node, type, obj) {
        var offset = 0;
        var start = obj.text.length,
          text = prevNode.textContent;
        if (prevNode !== node) {
          var endSpace = /\s/.test(text[text.length - 1]),
            startSpace = /\s/.test(node.textContent[0]);
          if (obj.boundary || !endSpace && !startSpace) {
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
              if (!endSpace && !startSpace) {
                if (type === 1) {
                  obj.text += text + ' ';
                  offset = 1;
                } else if (type === 2) {
                  obj.text += text + obj.str3;
                  offset = 3;
                }
              } else if (type === 2) {
                var str = startSpace && endSpace ? obj.str : startSpace ? obj.str1 : obj.str2;
                obj.text += text + str;
                offset = str.length;
              }
            }
          }
        }
        if (offset === 0) {
          obj.text += text;
        }
        obj.nodes.push(this.createInfo(prevNode, start, obj.text.length - offset, offset, obj.startOffset));
        obj.startOffset -= offset;
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
      key: "getTextNodes",
      value: function getTextNodes(cb) {
        var _this6 = this;
        if (this.opt.cacheTextNodes && this.cacheDict.nodes) {
          cb(this.cacheDict);
          return;
        }
        var val = '',
          nodes = [];
        this.iterator.forEachNode(NodeFilter.SHOW_TEXT, function (node) {
          nodes.push({
            start: val.length,
            end: (val += node.textContent).length,
            offset: 0,
            node: node
          });
        }, function (node) {
          if (_this6.excludeElements(node.parentNode)) {
            return NodeFilter.FILTER_REJECT;
          } else {
            return NodeFilter.FILTER_ACCEPT;
          }
        }, function () {
          var dict = {
            value: val,
            nodes: nodes,
            lastIndex: 0,
            lastTextIndex: 0
          };
          if (_this6.opt.cacheTextNodes) {
            _this6.cacheDict = dict;
            _this6.cacheDict.type = 'every';
          }
          cb(dict);
        });
      }
    }, {
      key: "excludeElements",
      value: function excludeElements(elem) {
        var nodeNames = ['script', 'style', 'title', 'head', 'html'];
        return nodeNames.indexOf(elem.nodeName.toLowerCase()) !== -1 || this.opt.exclude && this.opt.exclude.length && DOMIterator.matches(elem, this.opt.exclude);
      }
    }, {
      key: "wrapRangeInTextNode",
      value: function wrapRangeInTextNode(node, start, end) {
        var startNode = node.splitText(start),
          retNode = startNode.splitText(end - start);
        this.createMarkElement(startNode);
        return retNode;
      }
    }, {
      key: "createMarkElement",
      value: function createMarkElement(node) {
        var name = !this.opt.element ? 'mark' : this.opt.element;
        var markNode = document.createElement(name);
        markNode.setAttribute('data-markjs', 'true');
        if (this.opt.className) {
          markNode.setAttribute('class', this.opt.className);
        }
        markNode.textContent = node.textContent;
        node.parentNode.replaceChild(markNode, node);
        return markNode;
      }
    }, {
      key: "wrapRangeInTextNodeInsert",
      value: function wrapRangeInTextNodeInsert(dict, n, s, e, start, index) {
        var ended = e === n.node.textContent.length;
        if (s === 0 && ended) {
          var _markNode = this.createMarkElement(n.node);
          n.node = _markNode.childNodes[0];
          return {
            retNode: n,
            markNode: _markNode,
            increment: 0
          };
        }
        var node = n.node.splitText(s),
          restNode = node.splitText(e - s),
          markNode = this.createMarkElement(node),
          increment = 1;
        var mNode = {
            start: start,
            end: n.start + e,
            offset: 0,
            node: markNode.childNodes[0]
          },
          retNode = {
            start: n.start + e,
            end: n.end,
            offset: n.offset,
            node: restNode
          };
        if (s === 0) {
          dict.nodes.splice(index, 1, mNode, retNode);
        } else {
          if (ended) {
            dict.nodes.splice(index + 1, 0, mNode);
          } else {
            dict.nodes.splice(index + 1, 0, mNode, retNode);
            increment = 2;
          }
          n.end = start;
          n.offset = 0;
        }
        return {
          retNode: retNode,
          markNode: markNode,
          increment: increment
        };
      }
    }, {
      key: "wrapRangeInMappedTextNode",
      value: function wrapRangeInMappedTextNode(dict, start, end, filterCb, eachCb) {
        var i = dict.lastIndex,
          rangeStart = true;
        if (this.opt.wrapAllRanges) {
          while (i >= 0 && dict.nodes[i].start > start) {
            i--;
          }
        } else if (start < dict.lastTextIndex) {
          return;
        }
        for (i; i < dict.nodes.length; i++) {
          if (i + 1 === dict.nodes.length || dict.nodes[i + 1].start > start) {
            var n = dict.nodes[i];
            if (!filterCb(n)) {
              if (i > dict.lastIndex) {
                dict.lastIndex = i;
              }
              break;
            }
            var s = start - n.start,
              e = (end > n.end ? n.end : end) - n.start;
            if (s >= 0 && e > s) {
              if (this.opt.wrapAllRanges) {
                var ret = this.wrapRangeInTextNodeInsert(dict, n, s, e, start, i);
                n = ret.retNode;
                eachCb(ret.markNode, rangeStart);
              } else {
                n.node = this.wrapRangeInTextNode(n.node, s, e);
                n.start += e;
                dict.lastTextIndex = n.start;
                eachCb(n.node.previousSibling, rangeStart);
              }
              rangeStart = false;
            }
            if (end > n.end) {
              start = n.end + n.offset;
            } else {
              dict.lastIndex = i;
              break;
            }
          }
        }
      }
    }, {
      key: "wrapGroups",
      value: function wrapGroups(node, pos, len, eachCb) {
        node = this.wrapRangeInTextNode(node, pos, pos + len);
        eachCb(node.previousSibling);
        return node;
      }
    }, {
      key: "separateGroupsD",
      value: function separateGroupsD(node, match, params, filterCb, eachCb) {
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
              if (filterCb(group, node, i)) {
                node = this.wrapGroups(node, start - offset, end - start, function (node) {
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
      key: "separateGroups",
      value: function separateGroups(node, match, params, filterCb, eachCb) {
        var startIndex = match.index,
          i = -1,
          isWrapped = false,
          index,
          group,
          start;
        while (++i < params.groups.length) {
          index = params.groups[i];
          group = match[index];
          if (group) {
            start = node.textContent.indexOf(group, startIndex);
            if (start !== -1) {
              if (filterCb(group, node, index)) {
                node = this.wrapGroups(node, start, group.length, function (node) {
                  eachCb(node, index);
                });
                startIndex = 0;
                isWrapped = true;
              } else {
                startIndex = start + group.length;
              }
            }
          }
        }
        if (isWrapped) {
          params.regex.lastIndex = 0;
        }
        return node;
      }
    }, {
      key: "wrapMatchGroupsD",
      value: function wrapMatchGroupsD(dict, match, params, filterCb, eachCb) {
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
              this.wrapRangeInMappedTextNode(dict, start, end, function (obj) {
                return filterCb(group, obj.node, i);
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
        if (end > regex.lastIndex) {
          regex.lastIndex = end;
        } else if (end > 0) {
          regex.lastIndex++;
        } else {
          regex.lastIndex = Infinity;
        }
      }
    }, {
      key: "wrapMatchGroups",
      value: function wrapMatchGroups(dict, match, params, filterCb, eachCb) {
        var startIndex = 0,
          index = 0,
          group,
          start,
          end;
        var s = match.index,
          text = match[0];
        if (this.opt.wrapAllRanges) {
          this.wrapRangeInMappedTextNode(dict, s, s + text.length, function (obj) {
            return filterCb(text, obj.node, index);
          }, function (node, groupStart) {
            eachCb(node, groupStart, index);
          });
        }
        for (var i = 0; i < params.groups.length; i++) {
          index = params.groups[i];
          group = match[index];
          if (group) {
            start = text.indexOf(group, startIndex);
            end = start + group.length;
            if (start !== -1) {
              this.wrapRangeInMappedTextNode(dict, s + start, s + end, function (obj) {
                return filterCb(group, obj.node, index);
              }, function (node, groupStart) {
                eachCb(node, groupStart, index);
              });
              startIndex = end;
            }
          }
        }
      }
    }, {
      key: "collectRegexGroupIndexes",
      value: function collectRegexGroupIndexes(regex) {
        var groups = [],
          stack = [],
          i = -1,
          index = 1,
          brackets = 0,
          charsRange = false,
          str = regex.source,
          reg = /^\(\?<(?![=!])|^\((?!\?)/;
        while (++i < str.length) {
          switch (str[i]) {
            case '(':
              if (!charsRange) {
                if (reg.test(str.substring(i))) {
                  stack.push(1);
                  if (brackets === 0) {
                    groups.push(index);
                  }
                  brackets++;
                  index++;
                } else {
                  stack.push(0);
                }
              }
              break;
            case ')':
              if (!charsRange && stack.pop() === 1) {
                brackets--;
              }
              break;
            case '\\':
              i++;
              break;
            case '[':
              charsRange = true;
              break;
            case ']':
              charsRange = false;
              break;
          }
        }
        return groups;
      }
    }, {
      key: "wrapSeparateGroups",
      value: function wrapSeparateGroups(regex, unused, filterCb, eachCb, endCb) {
        var _this7 = this;
        var fn = regex.hasIndices ? 'separateGroupsD' : 'separateGroups',
          params = {
            regex: regex,
            groups: regex.hasIndices ? {} : this.collectRegexGroupIndexes(regex)
          },
          execution = {
            abort: false
          },
          filterInfo = {
            execution: execution
          };
        var node,
          match,
          matchStart,
          eMatchStart,
          count = 0;
        this.getTextNodes(function (dict) {
          dict.nodes.every(function (nd) {
            node = nd.node;
            filterInfo.offset = nd.start;
            while ((match = regex.exec(node.textContent)) !== null && (regex.hasIndices || match[0] !== '')) {
              filterInfo.match = match;
              matchStart = eMatchStart = true;
              node = _this7[fn](node, match, params, function (group, node, groupIndex) {
                filterInfo.matchStart = matchStart;
                filterInfo.groupIndex = groupIndex;
                matchStart = false;
                return filterCb(group, node, filterInfo);
              }, function (node, groupIndex) {
                if (eMatchStart) {
                  count++;
                }
                eachCb(node, {
                  match: match,
                  matchStart: eMatchStart,
                  count: count,
                  groupIndex: groupIndex
                });
                eMatchStart = false;
              });
              if (execution.abort) {
                break;
              }
            }
            return !execution.abort;
          });
          endCb(count);
        });
      }
    }, {
      key: "wrapMatches",
      value: function wrapMatches(regex, ignoreGroups, filterCb, eachCb, endCb) {
        var _this8 = this;
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
          count = 0;
        this.getTextNodes(function (dict) {
          for (var k = 0; k < dict.nodes.length; k++) {
            info = dict.nodes[k];
            node = info.node;
            while ((match = regex.exec(node.textContent)) !== null && match[index] !== '') {
              filterInfo.match = match;
              filterInfo.offset = info.start;
              if (!filterCb(match[index], node, filterInfo)) {
                continue;
              }
              var len = match[index].length,
                start = match.index;
              if (index !== 0) {
                for (var i = 1; i < index; i++) {
                  start += match[i].length;
                }
              }
              if (_this8.opt.cacheTextNodes) {
                var ret = _this8.wrapRangeInTextNodeInsert(dict, info, start, start + len, info.start + start, k);
                count++;
                eachCb(ret.markNode, {
                  match: match,
                  count: count
                });
                if (ret.increment === 0) {
                  regex.lastIndex = 0;
                  break;
                }
                k += ret.increment;
                info = ret.retNode;
                node = info.node;
              } else {
                node = _this8.wrapGroups(node, start, len, function (node) {
                  count++;
                  eachCb(node, {
                    match: match,
                    count: count
                  });
                });
              }
              regex.lastIndex = 0;
              if (execution.abort) {
                break;
              }
            }
            if (execution.abort) {
              break;
            }
          }
          endCb(count);
        });
      }
    }, {
      key: "wrapGroupsAcrossElements",
      value: function wrapGroupsAcrossElements(regex, unused, filterCb, eachCb, endCb) {
        var _this9 = this;
        var fn = regex.hasIndices ? 'wrapMatchGroupsD' : 'wrapMatchGroups',
          params = {
            regex: regex,
            groups: regex.hasIndices ? {} : this.collectRegexGroupIndexes(regex)
          },
          execution = {
            abort: false
          },
          filterInfo = {
            execution: execution
          };
        var match,
          matchStart,
          eMatchStart,
          count = 0;
        this.getTextNodesAcross(function (dict) {
          while ((match = regex.exec(dict.text)) !== null && (regex.hasIndices || match[0] !== '')) {
            filterInfo.match = match;
            matchStart = eMatchStart = true;
            _this9[fn](dict, match, params, function (group, node, groupIndex) {
              filterInfo.matchStart = matchStart;
              filterInfo.groupIndex = groupIndex;
              matchStart = false;
              return filterCb(group, node, filterInfo);
            }, function (node, groupStart, groupIndex) {
              if (eMatchStart) {
                count++;
              }
              eachCb(node, {
                match: match,
                matchStart: eMatchStart,
                count: count,
                groupIndex: groupIndex,
                groupStart: groupStart
              });
              eMatchStart = false;
            });
            if (execution.abort) {
              break;
            }
          }
          endCb(count);
        });
      }
    }, {
      key: "wrapMatchesAcrossElements",
      value: function wrapMatchesAcrossElements(regex, ignoreGroups, filterCb, eachCb, endCb) {
        var _this10 = this;
        var index = ignoreGroups === 0 ? 0 : ignoreGroups + 1,
          execution = {
            abort: false
          },
          filterInfo = {
            execution: execution
          };
        var match,
          matchStart,
          count = 0;
        this.getTextNodesAcross(function (dict) {
          while ((match = regex.exec(dict.text)) !== null && match[index] !== '') {
            filterInfo.match = match;
            matchStart = true;
            var start = match.index;
            if (index !== 0) {
              for (var i = 1; i < index; i++) {
                start += match[i].length;
              }
            }
            var end = start + match[index].length;
            _this10.wrapRangeInMappedTextNode(dict, start, end, function (obj) {
              filterInfo.matchStart = matchStart;
              filterInfo.offset = obj.startOffset;
              matchStart = false;
              return filterCb(match[index], obj.node, filterInfo);
            }, function (node, matchStart) {
              if (matchStart) {
                count++;
              }
              eachCb(node, {
                match: match,
                matchStart: matchStart,
                count: count
              });
            });
            if (execution.abort) {
              break;
            }
          }
          endCb(count);
        });
      }
    }, {
      key: "wrapRanges",
      value: function wrapRanges(ranges, filterCb, eachCb, endCb) {
        var _this11 = this;
        var logs = [],
          skipped = [],
          level = 'warn';
        var count = 0;
        this.getTextNodes(function (dict) {
          var max = dict.value.length,
            array = _this11.checkRanges(ranges, logs, max);
          array.forEach(function (range, index) {
            var end = range.start + range.length;
            if (end > max) {
              logs.push({
                text: "Range length was limited to: ".concat(end - max),
                obj: range,
                skip: true,
                level: level
              });
              end = max;
            }
            var substr = dict.value.substring(range.start, end);
            if (substr.trim()) {
              _this11.wrapRangeInMappedTextNode(dict, range.start, end, function (obj) {
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
            var docFrag = document.createDocumentFragment();
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
        this.opt = this.checkOption(opt);
        var totalMarks = 0,
          fn = this.opt.separateGroups ? 'wrapSeparateGroups' : 'wrapMatches';
        if (this.opt.acrossElements) {
          fn = this.opt.separateGroups ? 'wrapGroupsAcrossElements' : 'wrapMatchesAcrossElements';
        }
        if (this.opt.acrossElements) {
          if (!regexp.global && !regexp.sticky) {
            var splits = regexp.toString().split('/');
            regexp = new RegExp(regexp.source, 'g' + splits[splits.length - 1]);
            this.log('RegExp was recompiled because it must have g flag');
          }
        }
        this.log("Searching with expression \"".concat(regexp, "\""));
        this[fn](regexp, this.opt.ignoreGroups, function (match, node, filterInfo) {
          return _this12.opt.filter(node, match, totalMarks, filterInfo);
        }, function (element, eachInfo) {
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
        if (opt && opt.combinePatterns) {
          this.markCombinePatterns(sv, opt);
          return;
        }
        this.opt = this.checkOption(opt);
        var index = 0,
          totalMarks = 0,
          totalMatches = 0;
        var fn = this.opt.acrossElements ? 'wrapMatchesAcrossElements' : 'wrapMatches',
          termStats = {};
        var _this$getSeparatedKey = this.getSeparatedKeywords(typeof sv === 'string' ? [sv] : sv),
          keywords = _this$getSeparatedKey.keywords,
          length = _this$getSeparatedKey.length,
          handler = function handler(term) {
            var regex = new RegExpCreator(_this13.opt).create(term);
            var matches = 0;
            _this13.log("Searching with expression \"".concat(regex, "\""));
            _this13[fn](regex, 1, function (t, node, filterInfo) {
              return _this13.opt.filter(node, term, totalMarks, matches, filterInfo);
            }, function (element, eachInfo) {
              matches++;
              totalMarks++;
              _this13.opt.each(element, eachInfo);
            }, function (count) {
              totalMatches += count;
              if (count === 0) {
                _this13.opt.noMatch(term);
              }
              termStats[term] = count;
              if (++index < length) {
                handler(keywords[index]);
              } else {
                _this13.opt.done(totalMarks, totalMatches, termStats);
              }
            });
          };
        if (length === 0) {
          this.opt.done(0, 0, termStats);
        } else {
          handler(keywords[index]);
        }
      }
    }, {
      key: "markCombinePatterns",
      value: function markCombinePatterns(sv, opt) {
        var _this14 = this;
        this.opt = this.checkOption(opt);
        var index = 0,
          totalMarks = 0,
          totalMatches = 0,
          patterns = [],
          terms = [],
          term;
        var across = this.opt.acrossElements,
          fn = across ? 'wrapMatchesAcrossElements' : 'wrapMatches',
          flags = "gm".concat(this.opt.caseSensitive ? '' : 'i'),
          termStats = {},
          obj = this.getSeparatedKeywords(typeof sv === 'string' ? [sv] : sv);
        var handler = function handler(pattern) {
          var regex = new RegExp(pattern, flags),
            patternTerms = terms[index];
          _this14.log("Searching with expression \"".concat(regex, "\""));
          _this14[fn](regex, 1, function (t, node, filterInfo) {
            if (across) {
              if (filterInfo.matchStart) {
                term = _this14.getCurrentTerm(filterInfo.match, patternTerms);
              }
            } else {
              term = _this14.getCurrentTerm(filterInfo.match, patternTerms);
            }
            return _this14.opt.filter(node, term, totalMarks, termStats[term], filterInfo);
          }, function (element, eachInfo) {
            totalMarks++;
            if (across) {
              if (eachInfo.matchStart) {
                termStats[term] += 1;
              }
            } else {
              termStats[term] += 1;
            }
            _this14.opt.each(element, eachInfo);
          }, function (count) {
            totalMatches += count;
            var array = patternTerms.filter(function (term) {
              return termStats[term] === 0;
            });
            if (array.length) {
              _this14.opt.noMatch(array);
            }
            if (++index < patterns.length) {
              handler(patterns[index]);
            } else {
              _this14.opt.done(totalMarks, totalMatches, termStats);
            }
          });
        };
        if (obj.length === 0) {
          this.opt.done(0, 0, termStats);
        } else {
          obj.keywords.forEach(function (term) {
            termStats[term] = 0;
          });
          var o = this.getPatterns(obj.keywords);
          terms = o.terms;
          patterns = o.patterns;
          handler(patterns[index]);
        }
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
          first = creator.create(terms[0], true),
          patterns = [],
          array = [];
        var num = 10;
        if (typeof this.opt.combinePatterns === 'number') {
          if (this.opt.combinePatterns === Infinity) {
            num = Math.pow(2, 31);
          } else if (this.isNumeric(this.opt.combinePatterns)) {
            num = parseInt(this.opt.combinePatterns);
          }
        }
        var count = Math.ceil(terms.length / num);
        for (var k = 0; k < count; k++) {
          var pattern = first.lookbehind + '(';
          var patternTerms = [],
            length = Math.min(k * num + num, terms.length);
          for (var i = k * num; i < length; i++) {
            patternTerms.push(terms[i]);
          }
          pattern += creator.createCombinePattern(patternTerms, true).pattern;
          patterns.push(pattern + ')' + first.lookahead);
          array.push(patternTerms);
        }
        return {
          patterns: patterns,
          terms: array
        };
      }
    }, {
      key: "markRanges",
      value: function markRanges(ranges, opt) {
        var _this15 = this;
        this.opt = opt;
        this.cacheDict = {};
        if (this.isArrayOfObjects(ranges)) {
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
        this.opt = opt;
        this.cacheDict = {};
        var selector = (this.opt.element ? this.opt.element : 'mark') + '[data-markjs]';
        if (this.opt.className) {
          selector += ".".concat(this.opt.className);
        }
        this.log("Removal selector \"".concat(selector, "\""));
        this.iterator.forEachNode(NodeFilter.SHOW_ELEMENT, function (node) {
          _this16.unwrapMatches(node);
        }, function (node) {
          var accept = DOMIterator.matches(node, selector) && !_this16.excludeElements(node);
          return accept ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
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
      return instance.version;
    };
    return this;
  }

  return Mark;

}));
