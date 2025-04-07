/*!***************************************************
* advanced-mark.js v2.7.0
* Copyright (c) 2014–2025, Julian Kühnel
* Released under the MIT license https://git.io/vwTVl
* Modified by angezid
*****************************************************/

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.RegExpCreator = factory());
})(this, (function () { 'use strict';

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

  var RegExpCreator$1 = /*#__PURE__*/function () {
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

  function RegExpCreator(options) {
    var instance = new RegExpCreator$1(options);
    this.create = function (str, patterns) {
      return instance.create(str, patterns);
    };
    this.createCombinePattern = function (array, capture) {
      return instance.createCombinePattern(array, capture);
    };
    this.createDiacritics = function (str) {
      return instance.createDiacritics(str);
    };
  }

  return RegExpCreator;

}));
