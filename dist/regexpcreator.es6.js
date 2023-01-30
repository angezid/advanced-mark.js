/*!***************************************************
* advanced-mark.js v1.1.0
* Copyright (c) 2014–2023, Julian Kühnel
* Released under the MIT license https://git.io/vwTVl
* Modified by angezid
*****************************************************/

class RegExpCreator$1 {
  constructor(options) {
    this.opt = Object.assign({}, {
      'diacritics': true,
      'synonyms': {},
      'accuracy': 'partially',
      'caseSensitive': false,
      'ignoreJoiners': false,
      'ignorePunctuation': [],
      'wildcards': 'disabled'
    }, options);
  }
  create(str, patterns) {
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
      return new RegExp(str, `gm${this.opt.caseSensitive ? '' : 'i'}`);
    }
  }
  createCombinePattern(array, capture) {
    if ( !Array.isArray(array) || !array.length) {
      return null;
    }
    const group = capture ? '(' : '(?:',
      obj = this.create(array[0], true),
      lookbehind = obj.lookbehind,
      lookahead = obj.lookahead,
      pattern = array.map(str => `${group}${this.create(str, true).pattern})`).join('|');
    return { lookbehind, pattern, lookahead };
  }
  sortByLength(arry) {
    return arry.sort((a, b) => a.length === b.length ?
      (a > b ? 1 : -1) :
      b.length - a.length
    );
  }
  escapeStr(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }
  createSynonymsRegExp(str) {
    const syn = this.opt.synonyms,
      sens = this.opt.caseSensitive ? '' : 'i';
    for (let index in syn) {
      if (syn.hasOwnProperty(index)) {
        let keys = Array.isArray(syn[index]) ? syn[index] : [syn[index]];
        keys.unshift(index);
        keys = this.sortByLength(keys).map(key => {
          if (this.opt.wildcards !== 'disabled') {
            key = this.setupWildcardsRegExp(key);
          }
          key = this.escapeStr(key);
          return key;
        }).filter(k => k !== '');
        if (keys.length > 1) {
          const pattern = keys.map(k => this.escapeStr(k)).join('|');
          str = str.replace(new RegExp(`(?:${pattern})`, `gm${sens}`), `(?:${keys.join('|')})`);
        }
      }
    }
    return str;
  }
  setupWildcardsRegExp(str) {
    str = str.replace(/(?:\\)*\?/g, val => {
      return val.charAt(0) === '\\' ? '?' : '\u0001';
    });
    return str.replace(/(?:\\)*\*/g, val => {
      return val.charAt(0) === '\\' ? '*' : '\u0002';
    });
  }
  createWildcardsRegExp(str) {
    let spaces = this.opt.wildcards === 'withSpaces';
    return str
      .replace(/\u0001/g, spaces ? '[\\S\\s]?' : '\\S?')
      .replace(/\u0002/g, spaces ? '[\\S\\s]*?' : '\\S*');
  }
  setupIgnoreJoinersRegExp(str) {
    return str.replace(/(\(\?:|\|)|\\?.(?=([|)]|$)|.)/g, (m, gr1, gr2) => {
      return gr1 || typeof gr2 !== 'undefined' ? m : m + '\u0000';
    });
  }
  createJoinersRegExp(str) {
    let joiner = [];
    const ignorePunctuation = this.opt.ignorePunctuation;
    if (Array.isArray(ignorePunctuation) && ignorePunctuation.length) {
      joiner.push(this.escapeStr(ignorePunctuation.join('')));
    }
    if (this.opt.ignoreJoiners) {
      joiner.push('\\u00ad\\u200b\\u200c\\u200d');
    }
    return joiner.length ?
      str.split(/\u0000+/).join(`[${joiner.join('')}]*`) :
      str;
  }
  createDiacriticsRegExp(str) {
    const caseSensitive = this.opt.caseSensitive,
      array = [
        'aàáảãạăằắẳẵặâầấẩẫậäåāą', 'AÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ',
        'cçćč', 'CÇĆČ', 'dđď', 'DĐĎ', 'eèéẻẽẹêềếểễệëěēę', 'EÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ',
        'iìíỉĩịîïī', 'IÌÍỈĨỊÎÏĪ', 'lł', 'LŁ', 'nñňń', 'NÑŇŃ',
        'oòóỏõọôồốổỗộơởỡớờợöøō', 'OÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ', 'rř', 'RŘ',
        'sšśșş', 'SŠŚȘŞ', 'tťțţ', 'TŤȚŢ', 'uùúủũụưừứửữựûüůū', 'UÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ',
        'yýỳỷỹỵÿ', 'YÝỲỶỸỴŸ', 'zžżź', 'ZŽŻŹ'
      ];
    return str.split('').map(ch => {
      for (let i = 0; i < array.length; i += 2)  {
        if (caseSensitive) {
          if (array[i].indexOf(ch) !== -1) {
            return '[' + array[i] + ']';
          } else if (array[i+1].indexOf(ch) !== -1) {
            return '[' + array[i+1] + ']';
          }
        } else if (array[i].indexOf(ch) !== -1 || array[i+1].indexOf(ch) !== -1) {
          return '[' + array[i] + array[i+1] + ']';
        }
      }
      return ch;
    }).join('');
  }
  createMergedBlanksRegExp(str) {
    return str.replace(/\s+/g, '[\\s]+');
  }
  createAccuracyRegExp(str, patterns) {
    const chars = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~¡¿';
    let acc = this.opt.accuracy,
      val = typeof acc === 'string' ? acc : acc.value,
      ls = typeof acc === 'string' ? [] : acc.limiters,
      lsJoin = '';
    ls.forEach(limiter => {
      lsJoin += `|${this.escapeStr(limiter)}`;
    });
    let lookbehind = '()', pattern, lookahead = '';
    switch (val) {
      case 'partially':
      default:
        pattern = str;
        break;
      case 'complementary':
        lsJoin = '\\s' + (lsJoin ? lsJoin : this.escapeStr(chars));
        pattern = `[^${lsJoin}]*${str}[^${lsJoin}]*`;
        break;
      case 'exactly':
        lookbehind = `(^|\\s${lsJoin})`;
        pattern = str,
        lookahead = `(?=$|\\s${lsJoin})`;
        break;
    }
    if (patterns) {
      return { lookbehind, pattern, lookahead };
    } else {
      return `${lookbehind}(${pattern})${lookahead}`;
    }
  }
}

function RegExpCreator(options) {
  const instance = new RegExpCreator$1(options);
  this.create = (str, patterns) => {
    return instance.create(str, patterns);
  };
  this.createCombinePattern = (array, capture) => {
    return instance.createCombinePattern(array, capture);
  };
  this.createDiacritics = (str) => {
    return instance.createDiacriticsRegExp(str);
  };
}

export { RegExpCreator as default };
