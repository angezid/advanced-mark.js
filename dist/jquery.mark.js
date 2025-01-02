/*!***************************************************
* advanced-mark.js v2.6.0
* https://github.com/angezid/advanced-mark.js
* MIT licensed
* Copyright (c) 2022–2025, angezid
* Based on 'mark.js', license https://git.io/vwTVl
*****************************************************/

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Mark = factory(global.jQuery));
})(this, (function ($) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

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
      this.map = new Map();
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
          ctx = win.document.querySelectorAll(ctx);
        } else if (typeof ctx.length === 'undefined') {
          ctx = [ctx];
        }
        var array = [];
        var _loop = function _loop(i) {
          if (!array.includes(ctx[i]) && !array.some(function (node) {
            return node.contains(ctx[i]);
          })) {
            array.push(ctx[i]);
          }
        };
        for (var i = 0; i < ctx.length; i++) {
          _loop(i);
        }
        if (sort) {
          array.sort(function (a, b) {
            return (a.compareDocumentPosition(b) & win.Node.DOCUMENT_POSITION_FOLLOWING) > 0 ? -1 : 1;
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
            this.map.set(iframe, 'ready');
            successFn();
          }
        } catch (e) {
          errorFn(e);
        }
      }
    }, {
      key: "observeIframeLoad",
      value: function observeIframeLoad(ifr, successFn, errorFn) {
        var _this = this;
        if (this.map.has(ifr)) return;
        var id = null;
        var listener = function listener() {
          clearTimeout(id);
          ifr.removeEventListener('load', listener);
          _this.getIframeContents(ifr, successFn, errorFn);
        };
        ifr.addEventListener('load', listener);
        this.map.set(ifr, true);
        id = setTimeout(listener, this.opt.iframesTimeout);
      }
    }, {
      key: "onIframeReady",
      value: function onIframeReady(ifr, successFn, errorFn) {
        var bl = 'about:blank',
          src = ifr.getAttribute('src'),
          win = ifr.contentWindow;
        try {
          if (win.readyState !== 'complete' || src && src.trim() !== bl && win.location.href === bl) {
            this.observeIframeLoad(ifr, successFn, errorFn);
          } else {
            this.getIframeContents(ifr, successFn, errorFn);
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
        var array = [],
          node;
        var collect = function collect(context) {
          var iterator = _this2.createIterator(context, _this2.opt.window.NodeFilter.SHOW_ELEMENT);
          while (node = iterator.nextNode()) {
            if (_this2.isIframe(node)) {
              var promise = new Promise(function (resolve) {
                _this2.onIframeReady(node, function () {
                  resolve();
                }, function (error) {
                  resolve();
                  if (_this2.opt.debug) console.log(error);
                });
              });
              array.push(promise);
            }
            if (shadow && node.shadowRoot && node.shadowRoot.mode === 'open') {
              collect(node.shadowRoot);
            }
          }
        };
        collect(ctx);
        if (array.length) {
          Promise.all(array).then(function () {
            return doneCb();
          });
        } else {
          doneCb();
        }
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
                if (iframe && _this3.isIframe(node) && _this3.map.get(node) === 'ready') {
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
          var count = open;
          contexts.forEach(function (ctx) {
            _this4.waitForIframes(ctx, function () {
              if (--count <= 0) ready();
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
        var selectors = typeof selector === 'string' ? [selector] : selector,
          fn = element.matches;
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
      value: function create(terms) {
        var _this2 = this;
        var array = [];
        var index = 0;
        terms = terms.map(function (str) {
          if (_this2.opt.charSets) {
            str = str.replace(/(\\.)+|\[(?:[^\\\]]|(?:\\.))+\](?:[+*?]\??|\{[\d,]+\}\??)?/g, function (m, gr) {
              if (gr) return m;
              array.push(m);
              return '\x03' + index++ + '\x03';
            }).replace(/\\(?=\[|\x03)/g, '');
          }
          return '(' + _this2.createPattern(str) + ')';
        });
        var obj = this.createAccuracy(terms.join('|'));
        if (array.length) {
          obj.pattern = obj.pattern.replace(/\x03(\d+)\x03/g, function (m, gr) {
            return array[gr];
          });
        }
        return new RegExp("".concat(obj.lookbehind, "(").concat(obj.pattern, ")").concat(obj.lookahead), "g".concat(this.opt.caseSensitive ? '' : 'i'));
      }
    }, {
      key: "createPattern",
      value: function createPattern(str) {
        var wildcards = this.opt.wildcards !== 'disabled';
        str = str.replace(/\s+/g, ' ');
        if (wildcards) {
          str = this.createPlaceholders(str);
        }
        str = str.replace(/[[\]/{}()*+?.\\^$|]/g, '\\$&');
        var joiners = this.getJoinersPunctuation();
        if (joiners) {
          str = this.setupIgnoreJoiners(str);
        }
        if (this.opt.diacritics) {
          str = this.createDiacritics(str);
        }
        str = str.replace(/ /g, '\\s+');
        if (joiners) {
          str = str.split(/\x00+/).join("[".concat(joiners, "]*"));
        }
        if (wildcards) {
          str = this.createWildcards(str);
        }
        return str;
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
      key: "getJoinersPunctuation",
      value: function getJoinersPunctuation() {
        var str = this.preprocess(this.opt.ignorePunctuation);
        if (this.opt.ignoreJoiners) {
          str += "\\u00ad\\u200b\\u200c\\u200d";
        }
        return str;
      }
    }, {
      key: "setupIgnoreJoiners",
      value: function setupIgnoreJoiners(str) {
        var reg = /((?:\\\\)+|\x02|\x03\d+\x03|\|)|\\?(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|.)(?=(\x02|\||$)|.)/g;
        return str.replace(reg, function (m, gr1, gr2) {
          return gr1 || typeof gr2 !== 'undefined' ? m : m + '\x00';
        });
      }
    }, {
      key: "createPlaceholders",
      value: function createPlaceholders(str) {
        return str.replace(/(\\.)+|[?*]/g, function (m, gr) {
          return gr ? m : m === '?' ? '\x01' : '\x02';
        }).replace(/\\+(?=[?*\x01\x02])/g, function (m) {
          return m.slice(1);
        });
      }
    }, {
      key: "createWildcards",
      value: function createWildcards(str) {
        var spaces = this.opt.wildcards === 'withSpaces',
          anyChar = spaces && this.opt.boundary ? '[^\x01]*?' : '[^]*?';
        return str.replace(/\x01/g, spaces ? '[^]?' : '\\S?').replace(/\x02/g, spaces ? anyChar : '\\S*');
      }
    }, {
      key: "createDiacritics",
      value: function createDiacritics(str) {
        var _this3 = this;
        var array = this.chars;
        return str.split('').map(function (ch) {
          for (var i = 0; i < array.length; i += 2) {
            var lowerCase = array[i].includes(ch);
            if (_this3.opt.caseSensitive) {
              if (lowerCase) {
                return '[' + array[i] + ']';
              }
              if (array[i + 1].includes(ch)) {
                return '[' + array[i + 1] + ']';
              }
            } else if (lowerCase || array[i + 1].includes(ch)) {
              return '[' + array[i] + array[i + 1] + ']';
            }
          }
          return ch;
        }).join('');
      }
    }, {
      key: "createAccuracy",
      value: function createAccuracy(str) {
        var accuracy = this.opt.accuracy,
          lookbehind = '()',
          pattern = str,
          lookahead = '',
          limiters;
        if (accuracy !== 'partially') {
          if (typeof accuracy !== 'string') {
            limiters = this.preprocess(accuracy.limiters);
            accuracy = accuracy.value;
          }
          limiters = '\\s' + (limiters || '!"#$%&\'()*+,\\-./:;<=>?@[\\]\\\\^_`{|}~¡¿');
          var group = "(^|[".concat(limiters, "])");
          if (accuracy === 'exactly') {
            lookbehind = group;
            lookahead = "(?=$|[".concat(limiters, "])");
          } else {
            var charSet = "[^".concat(limiters, "]*");
            if (accuracy === 'complementary') {
              pattern = "".concat(charSet, "(?:").concat(str, ")").concat(charSet);
            } else if (accuracy === 'startsWith') {
              lookbehind = group;
              pattern = "(?:".concat(str.replace(/\\s\+/g, charSet + '$&'), ")").concat(charSet);
            }
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

  var Mark = /*#__PURE__*/function () {
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
            if (str.trim() && !array.includes(str)) {
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
          cb({
            text: obj.text,
            nodes: nodes,
            lastIndex: 0
          });
        });
      }
    }, {
      key: "getNodeInfo",
      value: function getNodeInfo(prevNode, node, type, obj) {
        var start = obj.text.length,
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
          obj.str = '';
        }
        obj.text += text;
        return this.createInfo(prevNode, start, obj.text.length - offset, offset);
      }
    }, {
      key: "getRangesTextNodes",
      value: function getRangesTextNodes(cb, lines) {
        var _this4 = this;
        var nodes = [],
          regex = /\n/g,
          newLines = [0],
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
            if (node.tagName.toLowerCase() === 'br') {
              newLines.push(len);
            }
            return false;
          }
          return !_this4.excluded(node.parentNode);
        }, function () {
          var dict = {
            text: text,
            nodes: nodes,
            lastIndex: 0
          };
          if (lines) {
            newLines.push(len);
            dict.newLines = newLines;
          }
          cb(dict);
        });
      }
    }, {
      key: "getTextNodes",
      value: function getTextNodes(cb) {
        var _this5 = this;
        var nodes = [];
        this.iterator.forEachNode(this.filter.SHOW_TEXT, function (node) {
          nodes.push(node);
        }, function (node) {
          return !_this5.excluded(node.parentNode);
        }, function () {
          cb({
            nodes: nodes,
            lastIndex: 0
          });
        });
      }
    }, {
      key: "excluded",
      value: function excluded(elem) {
        return this.nodeNames.includes(elem.nodeName.toLowerCase()) || DOMIterator.matches(elem, this.opt.exclude);
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
          nodeInfo = this.createInfo(retNode, type === 0 || type === 2 ? end : n.start + e, end, n.offset);
        if (type === 0) {
          n.node = markChild;
          return {
            mark: mark,
            nodeInfo: nodeInfo,
            increment: 0
          };
        }
        var info = this.createInfo(markChild, type === 1 ? n.start : start, n.start + e, 0);
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
      value: function createInfo(node, start, end, offset) {
        return {
          node: node,
          start: start,
          end: end,
          offset: offset
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
        var wrapAllRanges = this.opt.wrapAllRanges;
        if (wrapAllRanges) {
          while (i > 0 && dict.nodes[i].start > start) {
            i--;
          }
        }
        for (i; i < dict.nodes.length; i++) {
          if (i + 1 === dict.nodes.length || dict.nodes[i + 1].start > start) {
            var n = dict.nodes[i];
            if (!filterCb(n.node)) {
              break;
            }
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
      value: function wrapGroups(node, match, regex, filterCb, eachCb) {
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
          regex.lastIndex = 0;
        } else if (match[0].length === 0) {
          this.setLastIndex(regex, end);
        }
        return node;
      }
    }, {
      key: "wrapGroupsAcross",
      value: function wrapGroupsAcross(dict, match, regex, filterCb, eachCb) {
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
              this.wrapRangeAcross(dict, start, end, function (node) {
                return filterCb(node, group, i);
              }, function (node, groupStart) {
                isWrapped = true;
                eachCb(node, i, groupStart);
              });
              if (isWrapped && end > lastIndex) {
                lastIndex = end;
              }
            }
          }
        }
        if (match[0].length === 0) {
          this.setLastIndex(regex, end);
        }
      }
    }, {
      key: "setLastIndex",
      value: function setLastIndex(regex, end) {
        var index = regex.lastIndex;
        regex.lastIndex = end > index ? end : end > 0 ? index + 1 : Infinity;
      }
    }, {
      key: "wrapSeparateGroups",
      value: function wrapSeparateGroups(regex, unused, filterCb, eachCb, endCb) {
        var _this6 = this;
        var across = this.opt.acrossElements,
          fn = across ? 'wrapGroupsAcross' : 'wrapGroups',
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
        var wrap = function wrap(obj) {
          while ((match = regex.exec(across ? obj.text : obj.textContent)) !== null) {
            info.match = match;
            filterStart = eachStart = true;
            node = _this6[fn](obj, match, regex, function (node, group, grIndex) {
              info.matchStart = filterStart;
              info.groupIndex = grIndex;
              filterStart = false;
              return filterCb(node, group, info);
            }, function (node, grIndex, groupStart) {
              if (eachStart) {
                count++;
              }
              var eachInfo = {
                match: match,
                matchStart: eachStart,
                count: count,
                groupIndex: grIndex,
                groupStart: groupStart
              };
              eachCb(node, eachInfo);
              eachStart = false;
            });
            obj = node || obj;
            if (execution.abort) break;
          }
        };
        if (across) {
          this.getTextNodesAcross(function (dict) {
            wrap(dict);
          });
        } else {
          this.getTextNodes(function (dict) {
            dict.nodes.every(function (node) {
              wrap(node);
              return !execution.abort;
            });
          });
        }
        endCb(count);
      }
    }, {
      key: "wrapMatches",
      value: function wrapMatches(regex, ignoreGroups, filterCb, eachCb, endCb) {
        var _this7 = this;
        var index = ignoreGroups === 0 ? 0 : ignoreGroups + 1,
          execution = {
            abort: false
          },
          filterInfo = {
            execution: execution
          };
        var match,
          str,
          count = 0;
        this.getTextNodes(function (dict) {
          dict.nodes.every(function (node) {
            while ((match = regex.exec(node.textContent)) !== null) {
              if ((str = match[index]) === '') {
                regex.lastIndex++;
                continue;
              }
              filterInfo.match = match;
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
              node = _this7.wrapRange(node, start, end, function (node) {
                eachCb(node, {
                  match: match,
                  count: ++count
                });
              });
              regex.lastIndex = 0;
              if (execution.abort) break;
            }
            return !execution.abort;
          });
          endCb(count);
        });
      }
    }, {
      key: "wrapMatchesAcross",
      value: function wrapMatchesAcross(regex, ignoreGroups, filterCb, eachCb, endCb) {
        var _this8 = this;
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
          while ((match = regex.exec(dict.text)) !== null) {
            if ((str = match[index]) === '') {
              regex.lastIndex++;
              continue;
            }
            filterInfo.match = match;
            matchStart = true;
            var i = 0,
              start = match.index;
            while (++i < index) {
              if (match[i]) {
                start += match[i].length;
              }
            }
            _this8.wrapRangeAcross(dict, start, start + str.length, function (node) {
              filterInfo.matchStart = matchStart;
              matchStart = false;
              return filterCb(node, str, filterInfo);
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
        var _this9 = this;
        var lines = this.opt.markLines,
          logs = [],
          skipped = [],
          level = 'warn';
        var count = 0;
        this.getRangesTextNodes(function (dict) {
          var max = lines ? dict.newLines.length : dict.text.length,
            array = _this9.checkRanges(ranges, logs, lines ? 1 : 0, max);
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
              _this9.wrapRangeAcross(dict, start, end, function (node) {
                return filterCb(node, range, substr, index);
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
          _this9.log("Valid ranges: ".concat(JSON.stringify(array.filter(function (range) {
            return !skipped.includes(range);
          }))));
          endCb(count, logs);
        }, lines);
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
        var _this10 = this;
        this.opt = opt;
        var totalMarks = 0,
          matchesSoFar = 0,
          across = this.opt.acrossElements,
          fn = this.opt.separateGroups ? 'wrapSeparateGroups' : across ? 'wrapMatchesAcross' : 'wrapMatches';
        if (!regexp.global && !regexp.sticky) {
          var splits = regexp.toString().split('/');
          regexp = new RegExp(regexp.source, 'g' + splits[splits.length - 1]);
          this.log('RegExp is recompiled - it must have a `g` flag', 'warn');
        }
        this.log("RegExp \"".concat(regexp, "\""));
        this[fn](regexp, this.opt.ignoreGroups, function (node, match, filterInfo) {
          return _this10.opt.filter(node, match, matchesSoFar, filterInfo);
        }, function (element, eachInfo) {
          matchesSoFar = eachInfo.count;
          totalMarks++;
          _this10.opt.each(element, eachInfo);
        }, function (totalMatches) {
          if (totalMatches === 0) {
            _this10.opt.noMatch(regexp);
          }
          _this10.opt.done(totalMarks, totalMatches);
        });
      }
    }, {
      key: "mark",
      value: function mark(sv, opt) {
        var _this11 = this;
        this.opt = opt;
        var _this$getSeachTerms = this.getSeachTerms(sv),
          terms = _this$getSeachTerms.terms,
          termStats = _this$getSeachTerms.termStats;
        if (!terms.length) {
          this.opt.done(0, 0, termStats);
          return;
        }
        var index = 0,
          totalMarks = 0,
          totalMatches = 0,
          term,
          termMatches;
        var across = this.opt.acrossElements,
          fn = across ? 'wrapMatchesAcross' : 'wrapMatches',
          array = this.getRegExps(terms);
        var loop = function loop(_ref) {
          var regex = _ref.regex,
            regTerms = _ref.regTerms;
          _this11.log("RegExp ".concat(regex));
          _this11[fn](regex, 1, function (node, _, filterInfo) {
            if (!across || filterInfo.matchStart) {
              term = _this11.getCurrentTerm(filterInfo.match, regTerms);
            }
            termMatches = termStats[term];
            return _this11.opt.filter(node, term, totalMatches + termMatches, termMatches, filterInfo);
          }, function (element, eachInfo) {
            totalMarks++;
            if (!across || eachInfo.matchStart) {
              termStats[term] += 1;
            }
            _this11.opt.each(element, eachInfo);
          }, function (count) {
            totalMatches += count;
            var noMatches = regTerms.filter(function (term) {
              return termStats[term] === 0;
            });
            if (noMatches.length) {
              _this11.opt.noMatch(noMatches);
            }
            if (++index < array.length) {
              loop(array[index]);
            } else {
              _this11.opt.done(totalMarks, totalMatches, termStats);
            }
          });
        };
        loop(array[0]);
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
      key: "getRegExps",
      value: function getRegExps(terms) {
        var creator = new RegExpCreator(this.opt),
          option = this.opt.combineBy || this.opt.combinePatterns,
          array = [];
        var num = 10,
          value;
        if (option === Infinity) {
          num = Math.pow(2, 31);
        } else if (!isNaN(+option) && (value = parseInt(option)) > 0) {
          num = value;
        }
        for (var i = 0; i < terms.length; i += num) {
          var chunk = terms.slice(i, Math.min(i + num, terms.length));
          array.push({
            regex: creator.create(chunk),
            regTerms: chunk
          });
        }
        return array;
      }
    }, {
      key: "markRanges",
      value: function markRanges(ranges, opt) {
        var _this12 = this;
        this.opt = opt;
        if (Array.isArray(ranges)) {
          var totalMarks = 0;
          this.wrapRanges(ranges, function (node, range, match, index) {
            return _this12.opt.filter(node, range, match, index);
          }, function (elem, range, rangeInfo) {
            totalMarks++;
            _this12.opt.each(elem, range, rangeInfo);
          }, function (totalRanges, logs) {
            _this12.report(logs);
            _this12.opt.done(totalMarks, totalRanges);
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
        var _this13 = this;
        this.opt = opt;
        var selector = this.opt.element + '[data-markjs]';
        if (this.opt.className) {
          selector += ".".concat(this.opt.className);
        }
        this.log("Removal selector \"".concat(selector, "\""));
        this.iterator.forEachNode(this.filter.SHOW_ELEMENT, function (node) {
          _this13.unwrapMatches(node);
        }, function (node) {
          return DOMIterator.matches(node, selector) && !_this13.excluded(node);
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
    return '2.6.0';
  };

  return $__default["default"];

}));
