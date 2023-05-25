/*!***************************************************
* advanced-mark.js v2.1.1
* https://github.com/angezid/advanced-mark#readme
* MIT licensed
* Copyright (c) 2022–2023, angezid
* Original author Julian Kühnel, license https://git.io/vwTVl
*****************************************************/

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Mark = factory(global.jQuery));
})(this, (function ($) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

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
      this.attrName = 'data-markjsListener';
    }
    _createClass(DOMIterator, [{
      key: "getContexts",
      value: function getContexts() {
        var ctx,
          sort = false;
        if (!this.ctx) {
          ctx = [];
        } else if (this.opt.window.NodeList.prototype.isPrototypeOf(this.ctx)) {
          ctx = this.ctx;
        } else if (Array.isArray(this.ctx)) {
          ctx = this.ctx;
          sort = true;
        } else if (typeof this.ctx === 'string') {
          ctx = this.opt.window.document.querySelectorAll(this.ctx);
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
        if (sort) {
          array.sort(function (a, b) {
            return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) > 0 ? -1 : 1;
          });
        }
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
        return this.opt.window.document.createNodeIterator(ctx, whatToShow, filter, false);
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
        var style = this.opt.window.document.createElement('style');
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
          var showElement = (whatToShow & this.opt.window.NodeFilter.SHOW_ELEMENT) !== 0,
            showText = (whatToShow & this.opt.window.NodeFilter.SHOW_TEXT) !== 0,
            style = shadow && shadow.style ? this.createStyleElement() : null;
          if (showText) {
            whatToShow = this.opt.window.NodeFilter.SHOW_ELEMENT | this.opt.window.NodeFilter.SHOW_TEXT;
          }
          var traverse = function traverse(node) {
            var iterator = _this3.createIterator(node, whatToShow);
            while (node = iterator.nextNode()) {
              if (node.nodeType === 1) {
                if (showElement && filterCb(node)) {
                  eachCb(node);
                }
                if (iframe && node.nodeName.toLowerCase() === 'iframe' && !DOMIterator.matches(node, _this3.opt.exclude)) {
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
              } else if (showText && node.nodeType === 3 && filterCb(node)) {
                eachCb(node);
              }
            }
          };
          traverse(ctx);
        } else {
          var iterator = this.createIterator(ctx, whatToShow, function (node) {
            return filterCb(node) ? _this3.opt.window.NodeFilter.FILTER_ACCEPT : _this3.opt.window.NodeFilter.FILTER_REJECT;
          });
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
        if (!selector || !selector.length) {
          return false;
        }
        var selectors = typeof selector === 'string' ? [selector] : selector;
        var fn = element.matches || element.matchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.webkitMatchesSelector;
        return fn && selectors.some(function (sel) {
          return fn.call(element, sel) === true;
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
      key: "create",
      value: function create(str, patterns) {
        str = this.checkWildcardsEscape(str);
        if (Object.keys(this.opt.synonyms).length) {
          str = this.createSynonyms(str);
        }
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
        return patterns ? obj : new RegExp("".concat(obj.lookbehind, "(").concat(obj.pattern, ")").concat(obj.lookahead), "g".concat(this.opt.caseSensitive ? '' : 'i'));
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
          pattern = this.distinct(array.map(function (str) {
            return "".concat(group).concat(_this.create(str, true).pattern, ")");
          })).join('|');
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
      key: "escape",
      value: function escape(str) {
        return str.replace(/[[\]/{}()*+?.\\^$|]/g, '\\$&');
      }
    }, {
      key: "escapeCharSet",
      value: function escapeCharSet(str) {
        return str.replace(/[-^\]\\]/g, '\\$&');
      }
    }, {
      key: "toArrayIfString",
      value: function toArrayIfString(par) {
        return par && par.length ? this.distinct(typeof par === 'string' ? par.split('') : par) : [];
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
      value: function createSynonyms(str) {
        var _this2 = this;
        var syn = this.opt.synonyms,
          flags = 'g' + (this.opt.caseSensitive ? '' : 'i');
        for (var key in syn) {
          if (syn.hasOwnProperty(key)) {
            var array = Array.isArray(syn[key]) ? syn[key] : [syn[key]];
            array.unshift(key);
            array = this.sortByLength(this.distinct(array)).map(function (term) {
              return _this2.checkWildcardsEscape(term);
            });
            if (array.length > 1) {
              var pattern = array.map(function (k) {
                return _this2.escape(k);
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
          str = str.replace(/(\\)*\?/g, function (m, gr1) {
            return gr1 ? '?' : "\x01";
          }).replace(/(\\)*\*/g, function (m, gr1) {
            return gr1 ? '*' : "\x02";
          });
        }
        return this.escape(str);
      }
    }, {
      key: "createWildcards",
      value: function createWildcards(str) {
        var spaces = this.opt.wildcards === 'withSpaces',
          boundary = this.opt.blockElementsBoundary,
          anyChar = spaces && boundary ? '[^' + (boundary["char"] ? boundary["char"] : '\x01') + ']*?' : '[\\S\\s]*?';
        return str.replace(/\u0001/g, spaces ? '[\\S\\s]?' : '\\S?').replace(/\u0002/g, spaces ? anyChar : '\\S*');
      }
    }, {
      key: "setupIgnoreJoiners",
      value: function setupIgnoreJoiners(str) {
        return str.replace(/(\(\?:|\|)|\\?.(?=([|)]|$)|.)/g, function (m, gr1, gr2) {
          return gr1 || typeof gr2 !== 'undefined' ? m : m + "\0";
        });
      }
    }, {
      key: "createJoiners",
      value: function createJoiners(str, joiners) {
        return str.split(/\u0000+/).join("[".concat(joiners, "]*"));
      }
    }, {
      key: "getJoinersPunctuation",
      value: function getJoinersPunctuation() {
        var punct = this.toArrayIfString(this.opt.ignorePunctuation),
          str = '';
        if (punct.length) {
          str = this.escapeCharSet(punct.join(''));
        }
        if (this.opt.ignoreJoiners) {
          str += "\\u00ad\\u200b\\u200c\\u200d";
        }
        return str;
      }
    }, {
      key: "createDiacritics",
      value: function createDiacritics(str) {
        var caseSensitive = this.opt.caseSensitive,
          array = ['aàáảãạăằắẳẵặâầấẩẫậäåāą', 'AÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ', 'cçćč', 'CÇĆČ', 'dđď', 'DĐĎ', 'eèéẻẽẹêềếểễệëěēę', 'EÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ', 'iìíỉĩịîïī', 'IÌÍỈĨỊÎÏĪ', 'lł', 'LŁ', 'nñňń', 'NÑŇŃ', 'oòóỏõọôồốổỗộơởỡớờợöøōő', 'OÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌŐ', 'rř', 'RŘ', 'sšśșş', 'SŠŚȘŞ', 'tťțţ', 'TŤȚŢ', 'uùúủũụưừứửữựûüůūű', 'UÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪŰ', 'yýỳỷỹỵÿ', 'YÝỲỶỸỴŸ', 'zžżź', 'ZŽŻŹ'];
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
      key: "createAccuracy",
      value: function createAccuracy(str) {
        var _this3 = this;
        var chars = '!"#$%&\'()*+,\\-./:;<=>?@[\\]\\\\^_`{|}~¡¿';
        var accuracy = this.opt.accuracy,
          lookbehind = '()',
          pattern = str,
          lookahead = '',
          limiters;
        if (typeof accuracy !== 'string') {
          limiters = this.toArrayIfString(accuracy.limiters);
          limiters = limiters.length ? limiters : null;
          accuracy = accuracy.value;
        }
        if (accuracy === 'complementary') {
          var joins = '\\s' + (limiters ? this.escapeCharSet(limiters.join('')) : chars);
          pattern = "[^".concat(joins, "]*").concat(str, "[^").concat(joins, "]*");
        } else if (accuracy === 'exactly') {
          var _joins = limiters ? '|' + limiters.map(function (ch) {
            return _this3.escape(ch);
          }).join('|') : '';
          lookbehind = "(^|\\s".concat(_joins, ")");
          lookahead = "(?=$|\\s".concat(_joins, ")");
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

  var Mark = /*#__PURE__*/function () {
    function Mark(ctx) {
      _classCallCheck(this, Mark);
      this.ctx = ctx;
      this.cacheDict = {};
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
      }
    }, {
      key: "empty",
      get: function get() {
        if (!this._empty) {
          this._empty = this.opt.window.document.createTextNode('');
        }
        return this._empty;
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
        if (!this.opt.debug) {
          return;
        }
        var log = this.opt.log;
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
        var clear = true,
          type = this.cacheDict.type;
        if (type && opt && opt.cacheTextNodes) {
          if (opt.acrossElements) {
            if (type === 'across') {
              clear = false;
            }
          } else if (type === 'every') {
            clear = false;
          }
        }
        if (clear) {
          this.cacheDict = {};
        }
        return opt;
      }
    }, {
      key: "getSeachTerms",
      value: function getSeachTerms(sv) {
        var _this2 = this;
        var search = this.isString(sv) ? [sv] : sv,
          array = [],
          add = function add(str) {
            if (str.trim() && array.indexOf(str) === -1) {
              array.push(str);
            }
          };
        search.forEach(function (str) {
          if (_this2.opt.separateWordSearch) {
            str.split(' ').forEach(function (word) {
              return add(word);
            });
          } else {
            add(str);
          }
        });
        array.sort(function (a, b) {
          return b.length - a.length;
        });
        return array;
      }
    }, {
      key: "isNumeric",
      value: function isNumeric(value) {
        return Number(parseFloat(value)) == value;
      }
    }, {
      key: "isString",
      value: function isString(obj) {
        return typeof obj === 'string';
      }
    }, {
      key: "isObject",
      value: function isObject(obj) {
        return String(obj) === '[object Object]';
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
              text: 'Invalid range: ',
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
        tags['br'] = 3;
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
          regex: /\s/,
          tags: tags,
          boundary: boundary,
          startOffset: 0,
          str: str,
          str1: ' ' + str,
          str2: str + ' ',
          str3: ' ' + str + ' '
        };
        this.iterator.forEachNode(this.opt.window.NodeFilter.SHOW_ELEMENT | this.opt.window.NodeFilter.SHOW_TEXT, function (node) {
          if (!currNode) {
            prevNode = currNode = node;
          } else {
            currNode = node;
            _this5.getNodeInfo(prevNode, node, type, obj);
            prevNode = node;
            type = null;
          }
        }, function (node) {
          if (node.nodeType === 1) {
            if (!type) {
              type = tags[node.nodeName.toLowerCase()];
            } else if (boundary && type !== 2 && (temp = tags[node.nodeName.toLowerCase()]) === 2) {
              type = temp;
            }
            return false;
          }
          return !_this5.excludeElements(node.parentNode);
        }, function () {
          if (currNode) {
            _this5.getNodeInfo(prevNode, currNode, type, obj);
          }
          var dict = _this5.createDict(obj.text, obj.nodes, 'across');
          cb(dict);
        });
      }
    }, {
      key: "getNodeInfo",
      value: function getNodeInfo(prevNode, node, type, obj) {
        var offset = 0,
          text = prevNode.textContent;
        var start = obj.text.length;
        if (prevNode !== node) {
          if (type === 3) {
            text += '\n';
            offset = 1;
          } else {
            var endSpace = obj.regex.test(text[text.length - 1]),
              startSpace = obj.regex.test(node.textContent[0]);
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
                    text += ' ';
                    offset = 1;
                  } else if (type === 2) {
                    text += obj.str3;
                    offset = 3;
                  }
                } else if (type === 2) {
                  var str = startSpace && endSpace ? obj.str : startSpace ? obj.str1 : obj.str2;
                  text += str;
                  offset = str.length;
                }
              }
            }
          }
        }
        obj.text += text;
        obj.nodes.push(this.createInfo(prevNode, start, obj.text.length - offset, offset, obj.startOffset));
        obj.startOffset -= offset;
      }
    }, {
      key: "getTextNodes",
      value: function getTextNodes(cb) {
        var _this6 = this;
        if (this.opt.cacheTextNodes && this.cacheDict.nodes) {
          cb(this.cacheDict);
          return;
        }
        var text = '',
          nodes = [];
        this.iterator.forEachNode(this.opt.window.NodeFilter.SHOW_TEXT, function (node) {
          nodes.push({
            start: text.length,
            end: (text += node.textContent).length,
            offset: 0,
            node: node
          });
        }, function (node) {
          return !_this6.excludeElements(node.parentNode);
        }, function () {
          var dict = _this6.createDict(text, nodes, 'every');
          cb(dict);
        });
      }
    }, {
      key: "createDict",
      value: function createDict(text, nodes, type) {
        var dict = {
          text: text,
          nodes: nodes,
          lastIndex: 0,
          lastTextIndex: 0
        };
        if (this.opt.cacheTextNodes) {
          this.cacheDict = dict;
          this.cacheDict.type = type;
        }
        return dict;
      }
    }, {
      key: "excludeElements",
      value: function excludeElements(elem) {
        return this.nodeNames.indexOf(elem.nodeName.toLowerCase()) !== -1 || DOMIterator.matches(elem, this.opt.exclude);
      }
    }, {
      key: "wrapRangeInsert",
      value: function wrapRangeInsert(dict, n, s, e, start, index) {
        var ended = e === n.node.textContent.length;
        var type = 0,
          retNode,
          textNode;
        if (s === 0) {
          if (ended) {
            var node = this.wrapTextNode(n.node);
            n.node = node.childNodes[0];
            return {
              markNode: node,
              nodeInfo: this.createInfo(this.empty, n.end, n.end, n.offset, 0),
              increment: 0
            };
          } else {
            retNode = n.node.splitText(e);
            textNode = n.node;
            type = 1;
          }
        } else if (ended) {
          textNode = n.node.splitText(s);
          retNode = this.empty;
          type = 2;
        } else {
          textNode = n.node.splitText(s);
          retNode = textNode.splitText(e - s);
          type = 3;
        }
        var markNode = this.wrapTextNode(textNode),
          markInfo = this.createInfo(markNode.childNodes[0], type === 1 ? n.start : start, n.start + e, 0, n.startOffset),
          nodeInfo = this.createInfo(retNode, type === 2 ? n.end : n.start + e, n.end, n.offset, n.startOffset);
        if (type === 1) {
          dict.nodes.splice(index, 1, markInfo, nodeInfo);
        } else {
          if (type === 2) {
            dict.nodes.splice(index + 1, 0, markInfo);
          } else {
            dict.nodes.splice(index + 1, 0, markInfo, nodeInfo);
          }
          n.end = start;
          n.offset = 0;
        }
        return {
          markNode: markNode,
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
      key: "wrapTextNode",
      value: function wrapTextNode(node) {
        var name = !this.opt.element ? 'mark' : this.opt.element;
        var markNode = this.opt.window.document.createElement(name);
        markNode.setAttribute('data-markjs', 'true');
        if (this.opt.className) {
          markNode.setAttribute('class', this.opt.className);
        }
        markNode.textContent = node.textContent;
        node.parentNode.replaceChild(markNode, node);
        return markNode;
      }
    }, {
      key: "wrapRange",
      value: function wrapRange(node, start, end, eachCb) {
        var retNode = this.empty,
          ended = end === node.textContent.length,
          textNode;
        if (start === 0) {
          if (ended) {
            textNode = node;
          } else {
            retNode = node.splitText(end);
            textNode = node;
          }
        } else if (ended) {
          textNode = node.splitText(start);
        } else {
          textNode = node.splitText(start);
          retNode = textNode.splitText(end - start);
        }
        eachCb(this.wrapTextNode(textNode));
        return retNode;
      }
    }, {
      key: "wrapRangeAcross",
      value: function wrapRangeAcross(dict, start, end, filterCb, eachCb) {
        var i = dict.lastIndex,
          rangeStart = true;
        var wrapAllRanges = this.opt.wrapAllRanges || this.opt.cacheTextNodes;
        if (wrapAllRanges) {
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
              if (wrapAllRanges) {
                var obj = this.wrapRangeInsert(dict, n, s, e, start, i);
                n = obj.nodeInfo;
                eachCb(obj.markNode, rangeStart);
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
              dict.lastIndex = i;
              break;
            }
          }
        }
      }
    }, {
      key: "wrapGroups",
      value: function wrapGroups(node, match, params, filterCb, eachCb) {
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
              if (filterCb(node, group, index)) {
                node = this.wrapRange(node, start, start + group.length, function (node) {
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
      key: "wrapGroupsAcross",
      value: function wrapGroupsAcross(dict, match, params, filterCb, eachCb) {
        var startIndex = 0,
          index = 0,
          group,
          start,
          end;
        var s = match.index,
          text = match[0];
        if (this.opt.wrapAllRanges) {
          this.wrapRangeAcross(dict, s, s + text.length, function (obj) {
            return filterCb(obj, text, index);
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
              this.wrapRangeAcross(dict, s + start, s + end, function (obj) {
                return filterCb(obj, group, index);
              }, function (node, groupStart) {
                eachCb(node, groupStart, index);
              });
              startIndex = end;
            }
          }
        }
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
      key: "collectRegexGroupIndexes",
      value: function collectRegexGroupIndexes(regex) {
        var groups = [],
          stack = [],
          i = -1,
          index = 1,
          brackets = 0,
          charSet = false,
          str = regex.source,
          reg = /^\(\?<(?![=!])|^\((?!\?)/;
        while (++i < str.length) {
          switch (str[i]) {
            case '(':
              if (!charSet) {
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
              if (!charSet && stack.pop() === 1) {
                brackets--;
              }
              break;
            case '\\':
              i++;
              break;
            case '[':
              charSet = true;
              break;
            case ']':
              charSet = false;
              break;
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
            groups: hasIndices ? {} : this.collectRegexGroupIndexes(regex)
          },
          execution = {
            abort: false
          },
          filterInfo = {
            execution: execution
          };
        var node,
          match,
          filterStart,
          eachStart,
          count = 0;
        this.getTextNodes(function (dict) {
          dict.nodes.every(function (info) {
            node = info.node;
            filterInfo.offset = info.start;
            while ((match = regex.exec(node.textContent)) !== null && (hasIndices || match[0] !== '')) {
              filterInfo.match = match;
              filterStart = eachStart = true;
              node = _this7[fn](node, match, params, function (node, group, grIndex) {
                filterInfo.matchStart = filterStart;
                filterInfo.groupIndex = grIndex;
                filterStart = false;
                return filterCb(node, group, filterInfo);
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
      key: "wrapSeparateGroupsAcross",
      value: function wrapSeparateGroupsAcross(regex, unused, filterCb, eachCb, endCb) {
        var _this8 = this;
        var hasIndices = regex.hasIndices,
          fn = hasIndices ? 'wrapGroupsDFlagAcross' : 'wrapGroupsAcross',
          params = {
            regex: regex,
            groups: hasIndices ? {} : this.collectRegexGroupIndexes(regex)
          },
          execution = {
            abort: false
          },
          filterInfo = {
            execution: execution
          };
        var match,
          filterStart,
          eachStart,
          count = 0;
        this.getTextNodesAcross(function (dict) {
          while ((match = regex.exec(dict.text)) !== null && (hasIndices || match[0] !== '')) {
            filterInfo.match = match;
            filterStart = eachStart = true;
            _this8[fn](dict, match, params, function (obj, group, grIndex) {
              filterInfo.matchStart = filterStart;
              filterInfo.groupIndex = grIndex;
              filterInfo.offset = obj.startOffset;
              filterStart = false;
              return filterCb(obj.node, group, filterInfo);
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
            if (execution.abort) {
              break;
            }
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
          },
          eachInfo = {};
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
                start += match[i].length;
              }
              var end = start + str.length;
              if (_this9.opt.cacheTextNodes) {
                var obj = _this9.wrapRangeInsert(dict, info, start, end, info.start + start, k);
                eachInfo.match = match;
                eachInfo.count = ++count;
                eachCb(obj.markNode, eachInfo);
                if (obj.increment === 0) {
                  break;
                }
                k += obj.increment;
                info = obj.nodeInfo;
                node = info.node;
              } else {
                node = _this9.wrapRange(node, start, end, function (node) {
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
              start += match[i].length;
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
          var max = dict.text.length,
            array = _this11.checkRanges(ranges, logs, max);
          array.forEach(function (range, index) {
            var end = range.start + range.length;
            if (end > max) {
              logs.push({
                text: "Range was limited to: ".concat(max),
                obj: range,
                skip: true,
                level: level
              });
              end = max;
            }
            var substr = dict.text.substring(range.start, end);
            if (substr.trim()) {
              _this11.wrapRangeAcross(dict, range.start, end, function (obj) {
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
        this.opt = this.checkOption(opt);
        var totalMarks = 0,
          matchesSoFar = 0,
          fn = this.opt.separateGroups ? 'wrapSeparateGroups' : 'wrapMatches';
        if (this.opt.acrossElements) {
          fn = this.opt.separateGroups ? 'wrapSeparateGroupsAcross' : 'wrapMatchesAcross';
          if (!regexp.global && !regexp.sticky) {
            var splits = regexp.toString().split('/');
            regexp = new RegExp(regexp.source, 'g' + splits[splits.length - 1]);
            this.log('RegExp is recompiled because it must have g flag');
          }
        }
        this.log("Searching with expression \"".concat(regexp, "\""));
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
        this.opt = this.checkOption(opt);
        if (this.opt && this.opt.combinePatterns) {
          this.markCombinePatterns(sv);
          return;
        }
        var index = 0,
          totalMarks = 0,
          matches = 0,
          totalMatches = 0;
        var regCreator = new RegExpCreator(this.opt),
          fn = this.opt.acrossElements ? 'wrapMatchesAcross' : 'wrapMatches',
          termStats = {},
          terms = this.getSeachTerms(sv);
        var loop = function loop(term) {
          var regex = regCreator.create(term);
          var termMatches = 0;
          _this13.log("Searching with expression \"".concat(regex, "\""));
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
        if (terms.length) {
          loop(terms[index]);
        } else {
          this.opt.done(0, 0, termStats);
        }
      }
    }, {
      key: "markCombinePatterns",
      value: function markCombinePatterns(sv) {
        var _this14 = this;
        var index = 0,
          totalMarks = 0,
          totalMatches = 0,
          patterns = [],
          termsParts = [],
          term,
          termMatches;
        var across = this.opt.acrossElements,
          fn = across ? 'wrapMatchesAcross' : 'wrapMatches',
          flags = "g".concat(this.opt.caseSensitive ? '' : 'i'),
          termStats = {},
          terms = this.getSeachTerms(sv);
        var loop = function loop(pattern) {
          var regex = new RegExp(pattern, flags),
            patternTerms = termsParts[index];
          _this14.log("Searching with expression \"".concat(regex, "\""));
          _this14[fn](regex, 1, function (node, t, filterInfo) {
            if (across) {
              if (filterInfo.matchStart) {
                term = _this14.getCurrentTerm(filterInfo.match, patternTerms);
              }
            } else {
              term = _this14.getCurrentTerm(filterInfo.match, patternTerms);
            }
            termMatches = termStats[term];
            return _this14.opt.filter(node, term, totalMatches + termMatches, termMatches, filterInfo);
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
              loop(patterns[index]);
            } else {
              _this14.opt.done(totalMarks, totalMatches, termStats);
            }
          });
        };
        if (terms.length) {
          terms.forEach(function (term) {
            termStats[term] = 0;
          });
          var obj = this.getPatterns(terms);
          termsParts = obj.termsParts;
          patterns = obj.patterns;
          loop(patterns[index]);
        } else {
          this.opt.done(0, 0, termStats);
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
          option = this.opt.combinePatterns,
          patterns = [],
          array = [];
        var num = 10,
          value;
        if (option === Infinity) {
          num = Math.pow(2, 31);
        } else if (this.isNumeric(option) && (value = parseInt(option)) > 0) {
          num = value;
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
          termsParts: array
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
        this.iterator.forEachNode(this.opt.window.NodeFilter.SHOW_ELEMENT, function (node) {
          _this16.unwrapMatches(node);
        }, function (node) {
          return DOMIterator.matches(node, selector) && !_this16.excludeElements(node);
        }, this.opt.done);
      }
    }]);
    return Mark;
  }();

  $__default["default"].fn.mark = function (sv, opt) {
    new Mark(this.get()).mark(sv, opt);
    return this;
  };
  $__default["default"].fn.markRegExp = function (regexp, opt) {
    new Mark(this.get()).markRegExp(regexp, opt);
    return this;
  };
  $__default["default"].fn.markRanges = function (ranges, opt) {
    new Mark(this.get()).markRanges(ranges, opt);
    return this;
  };
  $__default["default"].fn.unmark = function (opt) {
    new Mark(this.get()).unmark(opt);
    return this;
  };
  $__default["default"].fn.getVersion = function () {
    return '2.1.1';
  };

  return $__default["default"];

}));
