/**
 * Creates regular expressions pattern based on specified settings
 */
class RegExpCreator {

  /**
   * @typedef RegExpCreator~accuracyObj
   * @type {object.<string>}
   * @property {string} value - An accuracy string value
   * @property {string|string[]} limiters - A string or an array of custom limiters.
   */
  /**
   * @typedef RegExpCreator~accuracy
   * @type {string}
   * @property {'partially'|'complementary'|'exactly'|'startsWith'|RegExpCreator~accuracyObj}
   */
  /**
   * @typedef RegExpCreator~wildcards
   * @type {string}
   * @property {'disabled'|'enabled'|'withSpaces'}
   */
  /**
   * @typedef RegExpCreator~ignorePunctuation
   * @type {string|string[]}
   * @property {string} The string(s) contain punctuation marks that should be ignored.
   */

  /**
   * @typedef RegExpCreator~options
   * @type {object.<string>}
   * @property {boolean} [diacritics=true] - If diacritic characters should be
   * matched. ({@link https://en.wikipedia.org/wiki/Diacritic Diacritics})
   * @property {RegExpCreator~accuracy} [accuracy]
   * @property {boolean} [caseSensitive=false] - Whether to search case sensitive
   * @property {boolean} [ignoreJoiners=false] - Whether to ignore word
   * joiners inside of key words. These include soft-hyphens, zero-width
   * space, zero-width non-joiners and zero-width joiners.
   * @property {RegExpCreator~ignorePunctuation} [ignorePunctuation]
   * @property {RegExpCreator~wildcards} [wildcards]
   */
  /**
   * @typedef RegExpCreator~patternObj
   * @type {object.<string>}
   * @property {string} lookbehind - A lookbehind capturing group
   * @property {string} pattern - A string pattern
   * @property {string} lookahead - A positive lookahead assertion
   */
  /**
   * @param {RegExpCreator~options} [options] - Optional options object
   */
  constructor(options) {
    this.opt = Object.assign({}, {
      'diacritics': true,
      'accuracy': 'partially',
      'caseSensitive': false,
      'ignoreJoiners': false,
      'ignorePunctuation': [],
      'wildcards': 'disabled'
    }, options);
  }

  /**
   * The array with lower and upper cases diacritics characters
   * @type {string[]}
   * @access protected
   */
  get chars() {
    if ( !this._chars) {
      this._chars = [];
      // initialises an array with lower and upper cases diacritics characters
      ['aàáảãạăằắẳẵặâầấẩẫậäåāą', 'cçćč', 'dđď', 'eèéẻẽẹêềếểễệëěēę',
        'iìíỉĩịîïī',  'lł', 'nñňń', 'oòóỏõọôồốổỗộơởỡớờợöøōő',  'rř',
        'sšśșş', 'tťțţ', 'uùúủũụưừứửữựûüůūű', 'yýỳỷỹỵÿ', 'zžżź'].forEach(str => {
        this._chars.push(str, str.toUpperCase());
      });
    }
    return this._chars;
  }

  /**
    * Creates a combined pattern RegExp from an array of string depending on option settings
    * @param  {Array} terms - The array of searching string
    * @return {RegExp}
    */
  create(terms) {
    const array = [];
    let index = 0;

    terms = terms.map(str => {
      if (this.opt.charSets) {
        // saves RegExp character sets in the array and creates index placeholders to restore them later.
        // matches any escaped char | character set with quantifier
        str = str.replace(/(\\.)+|\[(?:[^\\\]]|(?:\\.))+\](?:[+*?]\??|\{[\d,]+\}\??)?/g, (m, gr) => {
          if (gr) return m;

          array.push(m);
          return '\x03' + index++ + '\x03';
        }).replace(/\\+(?=\[|\x03)/g, m => m.slice(1)); // removes one backslash character before '[' and '\x03'
      }
      // wraps an individual term pattern in a capturing group; that allows to determine
      // in filter callback which term is currently matched
      return '(' + this.createPattern(str) + ')';
    });

    const obj = this.createAccuracy(terms.join('|'));

    if (array.length) {
      // restores RegExp character sets
      obj.pattern = obj.pattern.replace(/\x03(\d+)\x03/g, (m, gr) => array[gr]);
    }

    return new RegExp(`${obj.lookbehind}(${obj.pattern})${obj.lookahead}`, `g${this.opt.caseSensitive ? '' : 'i'}`);
  }

  /**
   * Creates a regular expression pattern for the specified search term depending on option settings
   * @param  {string} str - The search term to be used
   * @return {string}
   */
  createPattern(str) {
    const wildcards = this.opt.wildcards !== 'disabled';
    // normalizes white spaces
    str = str.replace(/\s+/g, ' ');

    if (wildcards) {
      str = this.createPlaceholders(str);
    }
    // escapes RegExp special characters
    str = str.replace(/[[\]/{}()*+?.\\^$|]/g, '\\$&');

    const joiners = this.getJoinersPunctuation();
    if (joiners) {
      str = this.setupIgnoreJoiners(str);
    }

    if (this.opt.diacritics) {
      str = this.createDiacritics(str);
    }
    str = str.replace(/ /g, '\\s+');

    if (joiners) {
      str = str.split(/\x00+/).join(`[${joiners}]*`);
    }

    if (wildcards) {
      str = this.createWildcards(str);
    }
    return str;
  }

  /**
   * Splits string if val is string, removes duplicates, escape '-^]\\' which are special in RegExp characters set
   * @param {array|string} val - The parameter to process
   * @return {string}
   */
  preprocess(val) {
    if (val && val.length) {
      return this.distinct(typeof val === 'string' ? val.split('') : val).join('').replace(/[-^\]\\]/g, '\\$&');
    }
    return '';
  }

  /**
   * Removes duplicate or empty entries
   * @param {array} array - The array to process
   * @return {array}
   */
  distinct(array) {
    const result = [];
    array.forEach(item => {
      if (item.trim() && result.indexOf(item) === -1) {
        result.push(item);
      }
    });
    return result;
  }

  /**
   * Creates a punctuation and/or joiners pattern
   * @return {string}
   */
  getJoinersPunctuation() {
    let str = this.preprocess(this.opt.ignorePunctuation);

    if (this.opt.ignoreJoiners) {
      str += '\\u00ad\\u200b\\u200c\\u200d';
    }
    return str;
  }

  /**
   * Creates placeholders in the regular expression string to allow later insertion of
   * designated characters (soft hyphens, zero width characters, and punctuation)
   * @param  {string} str - The search term to be used
   * @return {string}
   */
  setupIgnoreJoiners(str) {
    // it's not added '\0' after charSet placeholder, around `|` char and wildcard `\x02`, and at the end of a string,
    // not breaks charSet placeholders `\x03\d+\x03`, continues pairs of backslashes, and UTF-16 surrogate pairs
    const reg = /((?:\\\\)+|\x02|\x03\d+\x03|\|)|\\?(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|.)(?=(\x02|\||$)|.)/g;
    return str.replace(reg, (m, gr1, gr2) => {
      return gr1 || typeof gr2 !== 'undefined' ? m : m + '\x00';
    });
  }

  /**
   * Creates placeholders in the regular expression string to allow later insertion of wildcard patterns.
   * Correctly handles escaping
   * @param {string} str - The search term
   * @return {string}
   */
  createPlaceholders(str) {
    return str.replace(/(\\.)+|[?*]/g, (m, gr) => gr ? m : m === '?' ? '\x01' : '\x02')
      // removes one backslash character before '?', '*', '\x01', and '\x02'
      .replace(/\\+(?=[?*\x01\x02])/g, m => m.slice(1));
  }

  /**
   * Replaces the wildcard placeholders in a regular expression string
   * @param  {string} str - The search term to be used
   * @return {string}
   */
  createWildcards(str) {
    const spaces = this.opt.wildcards === 'withSpaces',
      anyChar = spaces && this.opt.boundary ? '[^\x01]*?' : '[^]*?';

    return str.replace(/\x01/g, spaces ? '[^]?' : '\\S?').replace(/\x02/g, spaces ? anyChar : '\\S*');
  }

  /**
   * Creates a regular expression string to match diacritics
   * @param  {string} str - The search term to be used
   * @return {string}
   */
  createDiacritics(str) {
    const array = this.chars;

    return str.split('').map(ch => {
      for (let i = 0; i < array.length; i += 2) {
        const lowerCase = array[i].includes(ch);

        if (this.opt.caseSensitive) {
          if (lowerCase) {
            return '[' + array[i] + ']';
          }
          if (array[i+1].includes(ch)) {
            return '[' + array[i+1] + ']';
          }
        } else if (lowerCase || array[i+1].includes(ch)) {
          return '[' + array[i] + array[i+1] + ']';
        }
      }
      return ch;
    }).join('');
  }

  /**
   * Creates a RegExp pattern to match with the specified accuracy.
   * The lookbehind group is ignored (serves as lookbehind with values 'exactly' and 'startsWith')
   * @param  {string} str - The combined pattern
   * @return {RegExpCreator~patternObj}
   */
  createAccuracy(str) {
    let accuracy = this.opt.accuracy,
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
      const group = `(^|[${limiters}])`;

      if (accuracy === 'exactly') {
        lookbehind = group;
        lookahead = `(?=$|[${limiters}])`;

      } else {
        const charSet = `[^${limiters}]*`;

        if (accuracy === 'complementary') {
          pattern = `${charSet}(?:${str})${charSet}`;

        } else if (accuracy === 'startsWith') {
          lookbehind = group;
          pattern = `(?:${str.replace(/\\s\+/g, charSet + '$&')})${charSet}`;
        }
      }
    }
    return { lookbehind, pattern, lookahead };
  }
}

export default RegExpCreator;
