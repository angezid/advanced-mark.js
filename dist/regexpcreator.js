/*!***************************************************
* advanced-mark.js v2.1.0
* Copyright (c) 2014–2023, Julian Kühnel
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
