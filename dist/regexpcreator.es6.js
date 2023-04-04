/*!***************************************************
* advanced-mark.js v2.0.1
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
    str = this.checkWildcardsEscape(str);
    if (Object.keys(this.opt.synonyms).length) {
      str = this.createSynonyms(str);
    }
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
      : new RegExp(`${obj.lookbehind}(${obj.pattern})${obj.lookahead}`, `g${this.opt.caseSensitive ? '' : 'i'}`));
  }
  createCombinePattern(array, capture) {
    if ( !Array.isArray(array) || !array.length) {
      return null;
    }
    const group = capture ? '(' : '(?:',
      obj = this.create(array[0], true),
      lookbehind = obj.lookbehind,
      lookahead = obj.lookahead,
      pattern = this.distinct(array.map(str => `${group}${this.create(str, true).pattern})`)).join('|');
    return { lookbehind, pattern, lookahead };
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
  escapeCharSet(str) {
    return str.replace(/[-^\]\\]/g, '\\$&');
  }
  toArrayIfString(par) {
    return par && par.length ? this.distinct(typeof par === 'string' ? par.split('') : par) : [];
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
  createSynonyms(str) {
    const syn = this.opt.synonyms,
      flags = 'g' + (this.opt.caseSensitive ? '' : 'i');
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
      str = str.replace(/(\\)*\?/g, (m, gr1) => gr1 ? '?' : '\u0001')
        .replace(/(\\)*\*/g, (m, gr1) => gr1 ? '*' : '\u0002');
    }
    return this.escape(str);
  }
  createWildcards(str) {
    const spaces = this.opt.wildcards === 'withSpaces',
      boundary = this.opt.blockElementsBoundary,
      anyChar = spaces && boundary ? '[^' + (boundary.char ? boundary.char : '\x01') + ']*?' : '[\\S\\s]*?';
    return str
      .replace(/\u0001/g, spaces ? '[\\S\\s]?' : '\\S?')
      .replace(/\u0002/g, spaces ? anyChar : '\\S*');
  }
  setupIgnoreJoiners(str) {
    return str.replace(/(\(\?:|\|)|\\?.(?=([|)]|$)|.)/g, (m, gr1, gr2) => {
      return gr1 || typeof gr2 !== 'undefined' ? m : m + '\u0000';
    });
  }
  createJoiners(str, joiners) {
    return str.split(/\u0000+/).join(`[${joiners}]*`);
  }
  getJoinersPunctuation() {
    let punct = this.toArrayIfString(this.opt.ignorePunctuation),
      str = '';
    if (punct.length) {
      str = this.escapeCharSet(punct.join(''));
    }
    if (this.opt.ignoreJoiners) {
      str += '\\u00ad\\u200b\\u200c\\u200d';
    }
    return str;
  }
  createDiacritics(str) {
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
  createAccuracy(str) {
    const chars = '!"#$%&\'()*+,\\-./:;<=>?@[\\]\\\\^_`{|}~¡¿';
    let accuracy = this.opt.accuracy,
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
      let joins ='\\s' + (limiters ? this.escapeCharSet(limiters.join('')) : chars);
      pattern = `[^${joins}]*${str}[^${joins}]*`;
    } else if (accuracy === 'exactly') {
      let joins = limiters ? '|' + limiters.map(ch => this.escape(ch)).join('|') : '';
      lookbehind = `(^|\\s${joins})`;
      lookahead = `(?=$|\\s${joins})`;
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
