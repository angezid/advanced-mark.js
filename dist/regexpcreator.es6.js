/*!***************************************************
* advanced-mark.js v2.7.0
* Copyright (c) 2014–2025, Julian Kühnel
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
  get chars() {
    if ( !this._chars) {
      this._chars = [];
      ['aàáảãạăằắẳẵặâầấẩẫậäåāą', 'cçćč', 'dđď', 'eèéẻẽẹêềếểễệëěēę',
        'iìíỉĩịîïī',  'lł', 'nñňń', 'oòóỏõọôồốổỗộơởỡớờợöøōő',  'rř',
        'sšśșş', 'tťțţ', 'uùúủũụưừứửữựûüůūű', 'yýỳỷỹỵÿ', 'zžżź'].forEach(str => {
        this._chars.push(str, str.toUpperCase());
      });
    }
    return this._chars;
  }
  create(str, patterns) {
    const flags = 'g' + (this.opt.caseSensitive ? '' : 'i');
    str = this.checkWildcardsEscape(str);
    str = this.createSynonyms(str, flags);
    const joiners = this.getJoinersPunctuation();
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
    const obj = this.createAccuracy(str);
    return (patterns
      ? obj
      : new RegExp(`${obj.lookbehind}(${obj.pattern})${obj.lookahead}`, flags));
  }
  createCombinePattern(array, capture) {
    if ( !Array.isArray(array) || !array.length) {
      return null;
    }
    const group = capture ? '(' : '(?:',
      obj = this.create(array[0], true);
    obj.pattern = this.distinct(array.map(str => `${group}${this.create(str, true).pattern})`)).join('|');
    return obj;
  }
  sortByLength(arry) {
    return arry.sort((a, b) => a.length === b.length ?
      (a > b ? 1 : -1) :
      b.length - a.length
    );
  }
  escape(str) {
    return str.replace(/[[\]/{}()*+?.\\^$|]/g, '\\$&');
  }
  preprocess(val) {
    if (val && val.length) {
      return this.distinct(typeof val === 'string' ? val.split('') : val).join('').replace(/[-^\]\\]/g, '\\$&');
    }
    return '';
  }
  distinct(array) {
    const result = [];
    array.forEach(item => {
      if (item.trim() && result.indexOf(item) === -1) {
        result.push(item);
      }
    });
    return result;
  }
  createSynonyms(str, flags) {
    const syn = this.opt.synonyms;
    if ( !Object.keys(syn).length) {
      return str;
    }
    for (const key in syn) {
      if (syn.hasOwnProperty(key)) {
        let array = Array.isArray(syn[key]) ? syn[key] : [syn[key]];
        array.unshift(key);
        array = this.sortByLength(this.distinct(array)).map(term => this.checkWildcardsEscape(term));
        if (array.length > 1) {
          const pattern = array.map(k => this.escape(k)).join('|');
          str = str.replace(new RegExp(pattern, flags), `(?:${array.join('|')})`);
        }
      }
    }
    return str;
  }
  checkWildcardsEscape(str) {
    if (this.opt.wildcards !== 'disabled') {
      str = str.replace(/(\\.)+|[?*]/g, (m, gr) => gr ? m : m === '?' ? '\x01' : '\x02')
        .replace(/\\(?=[?*\x01\x02])/g, '');
    }
    return this.escape(str);
  }
  createWildcards(str) {
    const spaces = this.opt.wildcards === 'withSpaces',
      boundary = this.opt.blockElementsBoundary,
      anyChar = `[^${spaces && boundary ? '\x01' : ''}]*?`;
    return str
      .replace(/\x01/g, spaces ? '[^]?' : '\\S?')
      .replace(/\x02/g, spaces ? anyChar : '\\S*');
  }
  setupIgnoreJoiners(str) {
    const reg = /((?:\\\\)+|\x02|\(\?:|\|)|\\?(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|.)(?=([|)\x02]|$)|.)/g;
    return str.replace(reg, (m, gr1, gr2) => {
      return gr1 || typeof gr2 !== 'undefined' ? m : m + '\x00';
    });
  }
  createJoiners(str, joiners) {
    return str.split(/\x00+/).join(`[${joiners}]*`);
  }
  getJoinersPunctuation() {
    let punct = this.preprocess(this.opt.ignorePunctuation),
      str = punct ? punct : '';
    if (this.opt.ignoreJoiners) {
      str += '\\u00ad\\u200b\\u200c\\u200d';
    }
    return str;
  }
  createDiacritics(str) {
    const array = this.chars;
    return str.split('').map(ch => {
      for (let i = 0; i < array.length; i += 2) {
        const lowerCase = array[i].indexOf(ch) !== -1;
        if (this.opt.caseSensitive) {
          if (lowerCase) {
            return '[' + array[i] + ']';
          } else if (array[i+1].indexOf(ch) !== -1) {
            return '[' + array[i+1] + ']';
          }
        } else if (lowerCase || array[i+1].indexOf(ch) !== -1) {
          return '[' + array[i] + array[i+1] + ']';
        }
      }
      return ch;
    }).join('');
  }
  createAccuracy(str) {
    const chars = '!-/:-@[-`{-~¡¿';
    let accuracy = this.opt.accuracy,
      lookbehind = '()',
      pattern = str,
      lookahead = '',
      limiters;
    if (typeof accuracy !== 'string') {
      limiters = this.preprocess(accuracy.limiters);
      accuracy = accuracy.value;
    }
    if (accuracy === 'exactly') {
      const charSet = limiters ? '[\\s' + limiters + ']' : '\\s';
      lookbehind = `(^|${charSet})`;
      lookahead = `(?=$|${charSet})`;
    } else {
      const chs = limiters || chars,
        charSet = `[^\\s${chs}]*`;
      if (accuracy === 'complementary') {
        pattern = charSet + str + charSet;
      } else if (accuracy === 'startsWith') {
        lookbehind = `(^|[\\s${chs}])`;
        pattern = str.split(/\[\\s\]\+/).join(charSet + '[\\s]+') + charSet;
      }
    }
    return { lookbehind, pattern, lookahead };
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
    return instance.createDiacritics(str);
  };
}

export { RegExpCreator as default };
