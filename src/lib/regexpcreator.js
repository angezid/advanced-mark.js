/**
 * Creates regular expressions based on specified settings
 * @example
 * new RegExpCreator({caseSensitive: true, diacritics: false}).create('lorem');
 * // => /()(lorem)/gm
 */
class RegExpCreator {

  /**
   * @typedef RegExpCreator~accuracyObj
   * @type {object.<string>}
   * @property {string} value - An accuracy string value
   * @property {string[]} limiters - A custom array of limiters. For example
   * <code>["-", ","]</code>
   */
  /**
   * @typedef RegExpCreator~accuracy
   * @type {string}
   * @property {"partially"|"complementary"|"exactly"|RegExpCreator~accuracyObj}
   * [accuracy="partially"] - Either one of the following string values:
   * <ul>
   *   <li><i>partially</i>: When searching for "lor" only "lor" inside
   *   "lorem" will be marked</li>
   *   <li><i>complementary</i>: When searching for "lor" the whole word
   *   "lorem" will be marked</li>
   *   <li><i>exactly</i>: When searching for "lor" only those exact words
   *   will be marked. In this example nothing inside "lorem".
   * </ul>
   * Or an object containing two properties:
   * <ul>
   *   <li><i>value</i>: The value must be "exactly" or "complementary" or "startsWith"</li>
   *   <li><i>limiters</i>: A custom array of string limiters</li>
   * </ul>
   */
  /**
   * @typedef RegExpCreator~wildcards
   * @type {string}
   * @property {"disabled"|"enabled"|"withSpaces"}
   * [wildcards="disabled"] - Set to any of the following string values:
   * <ul>
   *   <li><i>disabled</i>: Disable wildcard usage</li>
   *   <li><i>enabled</i>: When searching for "lor?m", the "?" will match zero
   *   or one non-space character (e.g. "lorm", "loram", "lor3m", etc). When
   *   searching for "lor*m", the "*" will match zero or more non-space
   *   characters (e.g. "lorm", "loram", "lor123m", etc).</li>
   *   <li><i>withSpaces</i>: When searching for "lor?m", the "?" will
   *   match zero or one space or non-space character (e.g. "lor m", "loram",
   *   etc). When searching for "lor*m", the "*" will match zero or more space
   *   or non-space characters (e.g. "lorm", "lore et dolor ipsum", "lor: m",
   *   etc).</li>
   * </ul>
   */
  /**
   * @typedef RegExpCreator~ignorePunctuation
   * @type {string[]}
   * @property {string} The strings in this setting will contain punctuation
   * marks that will be ignored:
   * <ul>
   *   <li>These punctuation marks can be between any characters, e.g. setting
   *   this option to <code>["'"]</code> would match "Worlds", "World's" and
   *   "Wo'rlds"</li>
   *   <li>One or more apostrophes between the letters would still produce a
   *   match (e.g. "W'o''r'l'd's").</li>
   *   <li>A typical setting for this option could be as follows:
   *   <pre>ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),</pre> This
   *   setting includes common punctuation as well as a minus, en-dash,
   *   em-dash and figure-dash
   *   ({@link https://en.wikipedia.org/wiki/Dash#Figure_dash ref}), as well
   *   as an underscore.</li>
   * </ul>
   */

  /**
   * @typedef RegExpCreator~options
   * @type {object.<string>}
   * @property {boolean} [diacritics=true] - If diacritic characters should be
   * matched. ({@link https://en.wikipedia.org/wiki/Diacritic Diacritics})
   * @property {object.<string|string[]>} [synonyms] - An object with synonyms.
   * The key will be a synonym for the value and the value for the key
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
   * @type {object}
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
      'synonyms': {},
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
   * Creates a regular expression to match the specified search term considering
   * the available option settings
   * @param {string} str - The search term to be used
   * @param {boolean} patterns - Whether to return an object with pattern parts or RegExp object
   * @return {RegExpCreator~patternObj|RegExp}
   */
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

  /**
    * Creates a single combine pattern from an array of string considering the available option settings
    * @param {Array} array - The array of string
    * @param {boolean} capture - Whether to wrap an individual pattern in a capturing or non-capturing group
    * @return {RegExpCreator~patternObj|null}
    */
  createCombinePattern(array, capture) {
    if ( !Array.isArray(array) || !array.length) {
      return null;
    }
    const group = capture ? '(' : '(?:',
      obj = this.create(array[0], true);
    obj.pattern = this.distinct(array.map(str => `${group}${this.create(str, true).pattern})`)).join('|');

    return obj;
  }

  /**
   * Sort array from longest entry to shortest
   * @param {array} arry - The array to sort
   * @return {array}
   */
  sortByLength(arry) {
    return arry.sort((a, b) => a.length === b.length ?
      // sort a-z for same length elements
      (a > b ? 1 : -1) :
      b.length - a.length
    );
  }

  /**
   * Escapes RegExp special characters
   * @param {string} str - The string to escape
   * @return {string}
   */
  escape(str) {
    return str.replace(/[[\]/{}()*+?.\\^$|]/g, '\\$&');
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
   * Creates a regular expression string to match the defined synonyms
   * @param {string} str - The search term to be used
   * @return {string}
   */
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

  /**
   * Check wildcards option creates placeholders in the regular expression string to allow later
   * insertion of wildcard patterns and escapes RegExp special characters
   * @param {string} str - The search term
   * @return {string}
   */
  checkWildcardsEscape(str) {
    if (this.opt.wildcards !== 'disabled') {
      // replaces single character wildcard with \x01, multiple character wildcard with \x02
      str = str.replace(/(\\.)+|[?*]/g, (m, gr) => gr ? m : m === '?' ? '\x01' : '\x02')
        // removes one backslash character before '?', '*', '\x01', and '\x02'
        .replace(/\\(?=[?*\x01\x02])/g, '');
    }
    return this.escape(str);
  }

  /**
   * Replaces the wildcard placeholders in a regular expression string
   * @param {string} str - The search term to be used
   * @return {string}
   */
  createWildcards(str) {
    // default to "enable" (i.e. to not include spaces)
    // "withSpaces" uses `[^]` instead of `.` because the latter does not match new line characters
    // or `[^\x01]` if blockElementsBoundary option is enabled
    const spaces = this.opt.wildcards === 'withSpaces',
      boundary = this.opt.blockElementsBoundary,
      anyChar = `[^${spaces && boundary ? '\x01' : ''}]*?`;

    return str
    // replace \x01 with a RegExp class to match any single
    // character, or any single non-whitespace character depending
    // on the setting
      .replace(/\x01/g, spaces ? '[^]?' : '\\S?')
      // replace \x02 with a RegExp class to match zero or
      // more characters, or zero or more non-whitespace characters
      // depending on the setting
      .replace(/\x02/g, spaces ? anyChar : '\\S*');
  }

  /**
   * Creates placeholders in the regular expression string to allow later insertion of
   * designated characters (soft hyphens, zero width characters, and punctuation)
   * @param {string} str - The search term to be used
   * @return {string}
   */
  setupIgnoreJoiners(str) {
    // it's not added '\0' after `(?:` grouping construct, around `|` char and wildcard `\x02` placeholder,
    // before `)` char, and at the end of a string,
    // not breaks the grouping construct `(?:`, continues pairs of backslashes, and UTF-16 surrogate pairs
    const reg = /((?:\\\\)+|\x02|\(\?:|\|)|\\?(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|.)(?=([|)\x02]|$)|.)/g;
    return str.replace(reg, (m, gr1, gr2) => {
      return gr1 || typeof gr2 !== 'undefined' ? m : m + '\x00';
    });
  }

  /**
   * Replaces '\x00' placeholders in a regular expression string by designated
   * characters (soft hyphens, zero width characters, and punctuation) based on the
   * specified option values of <code>ignorePunctuation</code> and
   * <code>ignoreJoiners</code>
   * @param {string} str - The search term to be used
   * @return {string}
   */
  createJoiners(str, joiners) {
    return str.split(/\x00+/).join(`[${joiners}]*`);
  }

  /**
   * Creates a punctuation and/or joiners pattern
   * @return {string}
   */
  getJoinersPunctuation() {
    let punct = this.preprocess(this.opt.ignorePunctuation),
      str = punct ? punct : '';

    if (this.opt.ignoreJoiners) {
      // u+00ad = soft hyphen
      // u+200b = zero-width space
      // u+200c = zero-width non-joiner
      // u+200d = zero-width joiner
      str += '\\u00ad\\u200b\\u200c\\u200d';
    }
    return str;
  }

  /**
   * Creates a regular expression string to match diacritics
   * @param {string} str - The search term to be used
   * @return {string}
   */
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

  /**
   * Creates a regular expression string to match the specified string with the
   * defined accuracy. All regular expressions created with two capturing groups.
   * The first group is ignored (serves as lookbehind with values 'exactly' and 'startsWith'),
   * the second is contained the actual match
   * @param {string} str - The search term to be used
   * @return {RegExpCreator~patternObj}
   */
  createAccuracy(str) {
    const chars = '!-/:-@[-`{-~¡¿'; // '!"#$%&\'()*+,\\-./:;<=>?@[\\]\\\\^_`{|}~¡¿';
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

export default RegExpCreator;
