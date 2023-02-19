/* Version: 2.0.0 - February 20, 2023 */
/*!***************************************************
* advanced-mark.js v2.0.0
* https://github.com/angezid/advanced-mark#readme
* MIT licensed
* Copyright (c) 2022–2023, angezid
* Original author Julian Kühnel, license https://git.io/vwTVl
*****************************************************/

class DOMIterator {
  constructor(ctx, opt) {
    this.ctx = ctx;
    this.opt = opt;
    this.attrName = 'data-markjsListener';
  }
  static matches(element, selector) {
    const selectors = typeof selector === 'string' ? [selector] : selector;
    if ( !selectors) {
      return false;
    }
    const fn = (
      element.matches ||
      element.matchesSelector ||
      element.msMatchesSelector ||
      element.mozMatchesSelector ||
      element.oMatchesSelector ||
      element.webkitMatchesSelector
    );
    return fn ? selectors.some(sel => fn.call(element, sel) === true) : false;
  }
  getContexts() {
    let ctx;
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
    const array = [];
    ctx.forEach(elem => {
      if (array.indexOf(elem) === -1 && !array.some(node => node.contains(elem))) {
        array.push(elem);
      }
    });
    return array;
  }
  getIframeContents(iframe, successFn, errorFn) {
    try {
      const doc = iframe.contentWindow.document;
      if (doc) {
        iframe.setAttribute(this.attrName, 'completed');
        successFn({ iframe : iframe, context : doc });
      }
    } catch (e) {
      iframe.setAttribute(this.attrName, 'error');
      errorFn({ iframe : iframe, error : e });
    }
  }
  isIframeBlank(ifr) {
    const bl = 'about:blank',
      src = ifr.getAttribute('src').trim(),
      href = ifr.contentWindow.location.href;
    return href === bl && src !== bl && src;
  }
  observeIframeLoad(ifr, successFn, errorFn) {
    if (ifr.hasAttribute(this.attrName)) {
      return;
    }
    let id = null;
    const listener = () => {
      clearTimeout(id);
      ifr.removeEventListener('load', listener);
      this.getIframeContents(ifr, successFn, errorFn);
    };
    ifr.addEventListener('load', listener);
    ifr.setAttribute(this.attrName, true);
    id = setTimeout(listener, this.opt.iframesTimeout);
  }
  onIframeReady(ifr, successFn, errorFn) {
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
  waitForAllIframes(ctx, doneCb) {
    let count = 0,
      iframes = [],
      array = [],
      fired = false;
    const id = setTimeout(() => {
      fired = true;
      doneCb();
    }, this.opt.iframesTimeout);
    const done = () => {
      clearTimeout(id);
      if ( !fired) {
        doneCb();
      }
    };
    const checkDone = () => {
      if (count === iframes.filter(ifr => !this.hasAttributeValue(ifr, this.attrName, 'error')).length) {
        done();
      }
    };
    const loop = (obj) => {
      if ( !obj.iframe || obj.context.location.href !== 'about:blank') {
        array = [];
        obj.context.querySelectorAll(obj.iframe ? 'body iframe' : 'iframe').forEach(iframe => {
          if ( !DOMIterator.matches(iframe, this.opt.exclude)) {
            iframes.push(iframe);
            if ( !iframe.hasAttribute(this.attrName)) {
              array.push(iframe);
            }
          }
        });
        if ( !obj.iframe && !array.length) {
          done();
          return;
        }
      }
      if (array.length) {
        array.forEach(iframe => {
          this.onIframeReady(iframe, obj => {
            count++;
            loop(obj);
          }, obj => {
            if (this.opt.debug) {
              console.log(obj.error);
            }
            checkDone();
          });
        });
      } else {
        checkDone();
      }
    };
    loop({ context : ctx });
  }
  createIterator(ctx, whatToShow, filter) {
    return document.createNodeIterator(ctx, whatToShow, filter, false);
  }
  addRemoveStyle(root, style, add) {
    if (add) {
      if ( !style || !root.firstChild || root.querySelector('style[data-markjs]')) {
        return;
      }
      root.insertBefore(style, root.firstChild);
    } else {
      let elem = root.querySelector('style[data-markjs]');
      if (elem) {
        root.removeChild(elem);
      }
    }
  }
  createStyleElement() {
    const style = document.createElement('style');
    style.setAttribute('data-markjs', 'true');
    style.textContent = this.opt.shadowDOM.style;
    return style;
  }
  hasAttributeValue(node, name, value) {
    return node.hasAttribute(name) && node.getAttribute(name) === value;
  }
  iterateThroughNodes(ctx, whatToShow, filterCb, eachCb, doneCb) {
    const shadow = this.opt.shadowDOM,
      iframe = this.opt.iframes;
    if (iframe || shadow) {
      const showElement = (whatToShow & NodeFilter.SHOW_ELEMENT) !== 0,
        showText = (whatToShow & NodeFilter.SHOW_TEXT) !== 0,
        style = shadow && shadow.style ? this.createStyleElement() : null;
      if (showText) {
        whatToShow = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT;
      }
      const traverse = node => {
        const iterator = this.createIterator(node, whatToShow);
        while ((node = iterator.nextNode())) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (showElement && filterCb(node) === NodeFilter.FILTER_ACCEPT) {
              eachCb(node);
            }
            if (iframe && node.nodeName.toUpperCase() === 'IFRAME' && !DOMIterator.matches(node, this.opt.exclude)) {
              if (this.hasAttributeValue(node, this.attrName, 'completed')) {
                this.getIframeContents(node, obj => {
                  traverse(obj.context);
                }, () => {});
              }
            }
            if (shadow && node.shadowRoot && node.shadowRoot.mode === 'open') {
              this.addRemoveStyle(node.shadowRoot, style, showText);
              traverse(node.shadowRoot);
            }
          } else  if (showText && node.nodeType === Node.TEXT_NODE && filterCb(node) === NodeFilter.FILTER_ACCEPT) {
            eachCb(node);
          }
        }
      };
      traverse(ctx);
    } else {
      const iterator = this.createIterator(ctx, whatToShow, filterCb);
      let node;
      while ((node = iterator.nextNode())) {
        eachCb(node);
      }
    }
    doneCb();
  }
  forEachNode(whatToShow, each, filter, done = () => {}) {
    const contexts = this.getContexts();
    let open = contexts.length;
    if ( !open) {
      done();
    }
    contexts.forEach(ctx => {
      open--;
      const ready = () => {
        this.iterateThroughNodes(ctx, whatToShow, filter, each, () => {
          if (open <= 0) {
            done();
          }
        });
      };
      if (this.opt.iframes) {
        this.waitForAllIframes(ctx, ready);
      } else {
        ready();
      }
    });
  }
}

class RegExpCreator {
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

class Mark$1 {
  constructor(ctx) {
    this.version = '2.0.0';
    this.ctx = ctx;
    this.cacheDict = {};
  }
  set opt(val) {
    this._opt = Object.assign({}, {
      'element': '',
      'className': '',
      'exclude': [],
      'iframes': false,
      'iframesTimeout': 5000,
      'separateWordSearch': true,
      'acrossElements': false,
      'ignoreGroups': 0,
      'each': () => {},
      'noMatch': () => {},
      'filter': () => true,
      'done': () => {},
      'debug': false,
      'log': window.console
    }, val);
  }
  get opt() {
    return this._opt;
  }
  get iterator() {
    return new DOMIterator(this.ctx, this.opt);
  }
  log(msg, level = 'debug') {
    const log = this.opt.log;
    if (!this.opt.debug) {
      return;
    }
    if (typeof log === 'object' && typeof log[level] === 'function') {
      log[level](`mark.js: ${msg}`);
    }
  }
  report(array) {
    array.forEach(item => {
      this.log(`${item.text} ${JSON.stringify(item.obj)}`, item.level ? item.level : 'debug');
      if ( !item.skip) {
        this.opt.noMatch(item.obj);
      }
    });
  }
  checkOption(opt) {
    if (opt && opt.acrossElements && opt.cacheTextNodes && !opt.wrapAllRanges) {
      opt = Object.assign({}, opt, { 'wrapAllRanges' : true });
    }
    let clear = true;
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
  getSeparatedKeywords(sv) {
    const search = this.isString(sv) ? [sv] : sv,
      array = [],
      add = str => {
        if (str.trim() && array.indexOf(str) === -1) {
          array.push(str);
        }
      };
    search.forEach(str => {
      if (this.opt.separateWordSearch) {
        str.split(' ').forEach(word => add(word));
      } else {
        add(str);
      }
    });
    array.sort((a, b) => b.length - a.length);
    return array;
  }
  isNumeric(value) {
    return Number(parseFloat(value)) == value;
  }
  isString(obj) {
    return typeof obj === 'string';
  }
  isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }
  isArrayOfObjects(array) {
    return Array.isArray(array) && array.some(item => this.isObject(item));
  }
  checkRanges(array, logs, max) {
    const level = 'error';
    const ranges = array.filter(range => {
      let valid = false;
      if (this.isNumeric(range.start) && this.isNumeric(range.length)) {
        range.start = parseInt(range.start);
        range.length = parseInt(range.length);
        if (range.start >= 0 && range.start < max && range.length > 0) {
          valid = true;
        }
      }
      if ( !valid) {
        logs.push({ text : 'Ignoring invalid range: ', obj : range, level });
        return false;
      }
      return true;
    }).sort((a, b) => a.start - b.start);
    if (this.opt.wrapAllRanges) {
      return ranges;
    }
    let lastIndex = 0, type;
    return ranges.filter(range => {
      if (range.start >= lastIndex) {
        lastIndex = range.start + range.length;
        return true;
      }
      type = range.start + range.length < lastIndex ? 'nesting' : 'overlapping';
      logs.push({ text : `Ignoring ${type} range: `, obj : range, level });
      return false;
    });
  }
  setType(tags) {
    const boundary = this.opt.blockElementsBoundary,
      custom = Array.isArray(boundary.tagNames) && boundary.tagNames.length;
    if (custom) {
      boundary.tagNames.map(name => name.toLowerCase()).forEach(name => {
        tags[name] = 2;
      });
    }
    if ( !custom || boundary.extend) {
      for (const key in tags) {
        tags[key] = 2;
      }
    }
    tags['br'] = 1;
  }
  getTextNodesAcross(cb) {
    if (this.opt.cacheTextNodes && this.cacheDict.nodes) {
      this.cacheDict.lastIndex = 0;
      this.cacheDict.lastTextIndex = 0;
      cb(this.cacheDict);
      return;
    }
    let tags = { div : 1, p : 1, li : 1, td : 1, tr : 1, th : 1, ul : 1,
      ol : 1, br : 1, dd : 1, dl : 1, dt : 1, h1 : 1, h2 : 1, h3 : 1, h4 : 1,
      h5 : 1, h6 : 1, hr : 1, blockquote : 1, figcaption : 1, figure : 1,
      pre : 1, table : 1, thead : 1, tbody : 1, tfoot : 1, input : 1,
      img : 1, nav : 1, details : 1, label : 1, form : 1, select : 1, menu : 1,
      menuitem : 1,
      main : 1, section : 1, article : 1, aside : 1, picture : 1, output : 1,
      button : 1, header : 1, footer : 1, address : 1, area : 1, canvas : 1,
      map : 1, fieldset : 1, textarea : 1, track : 1, video : 1, audio : 1,
      body : 1, iframe : 1, meter : 1, object : 1, svg : 1 };
    const boundary = this.opt.blockElementsBoundary;
    let str = '\x01', temp, prevNode, currNode, type;
    if (boundary) {
      this.setType(tags);
      if (boundary.char) {
        str = boundary.char.charAt(0);
      }
    }
    const obj = {
      nodes : [], text : '', tags : tags,
      boundary : boundary, startOffset : 0,
      str : str, str1 : ' ' + str, str2 : str + ' ', str3 : ' ' + str + ' '
    };
    this.iterator.forEachNode(NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, node => {
      if ( !currNode) {
        prevNode = currNode = node;
      } else {
        currNode = node;
        this.getNodeInfo(prevNode, node, type, obj);
        prevNode = node;
        type = null;
      }
    }, node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if ( !type) {
          type = tags[node.nodeName.toLowerCase()];
        } else {
          if ((temp = tags[node.nodeName.toLowerCase()]) && temp === 2) {
            type = temp;
          }
        }
        return NodeFilter.FILTER_REJECT;
      }
      return this.excludeElements(node.parentNode) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }, () => {
      if (currNode) {
        this.getNodeInfo(prevNode, currNode, type, obj);
      }
      const dict = {
        text : obj.text,
        nodes: obj.nodes,
        lastIndex: 0,
        lastTextIndex: 0
      };
      if (this.opt.cacheTextNodes) {
        this.cacheDict = dict;
        this.cacheDict.type = 'across';
      }
      cb(dict);
    });
  }
  getNodeInfo(prevNode, node, type, obj) {
    let offset = 0;
    const start = obj.text.length,
      text = prevNode.textContent;
    if (prevNode !== node) {
      const endSpace = /\s/.test(text[text.length - 1]),
        startSpace = /\s/.test(node.textContent[0]);
      if (obj.boundary || !endSpace && !startSpace) {
        let separate = type;
        if ( !type) {
          let parent = prevNode.parentNode;
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
          if ( !endSpace && !startSpace) {
            if (type === 1) {
              obj.text += text + ' ';
              offset = 1;
            } else if (type === 2) {
              obj.text += text + obj.str3;
              offset = 3;
            }
          } else if (type === 2) {
            let str = startSpace && endSpace ? obj.str : startSpace ? obj.str1 : obj.str2;
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
  getTextNodes(cb) {
    if (this.opt.cacheTextNodes && this.cacheDict.nodes) {
      cb(this.cacheDict);
      return;
    }
    let val = '',
      nodes = [];
    this.iterator.forEachNode(NodeFilter.SHOW_TEXT, node => {
      nodes.push({
        start: val.length,
        end: (val += node.textContent).length,
        offset : 0,
        node: node
      });
    }, node => {
      if (this.excludeElements(node.parentNode)) {
        return NodeFilter.FILTER_REJECT;
      } else {
        return NodeFilter.FILTER_ACCEPT;
      }
    }, () => {
      const dict = {
        value: val,
        nodes: nodes,
        lastIndex: 0,
        lastTextIndex: 0
      };
      if (this.opt.cacheTextNodes) {
        this.cacheDict = dict;
        this.cacheDict.type = 'every';
      }
      cb(dict);
    });
  }
  excludeElements(elem) {
    const nodeNames = ['script', 'style', 'title', 'head', 'html'];
    return nodeNames.indexOf(elem.nodeName.toLowerCase()) !== -1 ||
      this.opt.exclude && this.opt.exclude.length && DOMIterator.matches(elem, this.opt.exclude);
  }
  wrapRangeInsert(dict, n, s, e, start, index) {
    const empty = document.createTextNode(''),
      ended = e === n.node.textContent.length;
    let type = 0,
      retNode, textNode;
    if (s === 0) {
      if (ended) {
        const node = this.wrapTextNode(n.node);
        n.node = node.childNodes[0];
        return { markNode : node, nodeInfo : this.createInfo(empty, n.end, n.end, n.offset, 0), increment : 0 };
      } else {
        retNode = n.node.splitText(e);
        textNode = n.node;
        type = 1;
      }
    } else if (ended) {
      textNode = n.node.splitText(s);
      retNode = empty;
      type = 2;
    } else {
      textNode = n.node.splitText(s);
      retNode = textNode.splitText(e - s);
      type = 3;
    }
    const markNode = this.wrapTextNode(textNode),
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
    return { markNode, nodeInfo, increment : type < 3 ? 1 : 2 };
  }
  createInfo(node, start, end, offset, startOffset) {
    return { node, start, end, offset, startOffset };
  }
  wrapTextNode(node) {
    const name = !this.opt.element ? 'mark' : this.opt.element;
    let markNode = document.createElement(name);
    markNode.setAttribute('data-markjs', 'true');
    if (this.opt.className) {
      markNode.setAttribute('class', this.opt.className);
    }
    markNode.textContent = node.textContent;
    node.parentNode.replaceChild(markNode, node);
    return markNode;
  }
  wrapRange(node, start, end) {
    let retNode = document.createTextNode(''),
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
    return { markNode : this.wrapTextNode(textNode), node : retNode };
  }
  wrapRangeAcross(dict, start, end, filterCb, eachCb) {
    let i = dict.lastIndex,
      rangeStart = true;
    if (this.opt.wrapAllRanges) {
      while (i >= 0 && dict.nodes[i].start > start) {
        i--;
      }
    } else if (start < dict.lastTextIndex) {
      return;
    }
    for (i; i < dict.nodes.length; i++)  {
      if (i + 1 === dict.nodes.length || dict.nodes[i+1].start > start) {
        let n = dict.nodes[i];
        if ( !filterCb(n)) {
          if (i > dict.lastIndex) {
            dict.lastIndex = i;
          }
          break;
        }
        const s = start - n.start,
          e = (end > n.end ? n.end : end) - n.start;
        if (s >= 0 && e > s) {
          if (this.opt.wrapAllRanges) {
            const obj = this.wrapRangeInsert(dict, n, s, e, start, i);
            n = obj.nodeInfo;
            eachCb(obj.markNode, rangeStart);
          } else {
            const obj = this.wrapRange(n.node, s, e);
            n.node = obj.node;
            n.start += e;
            dict.lastTextIndex = n.start;
            eachCb(obj.markNode, rangeStart);
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
  separateGroupsD(node, match, params, filterCb, eachCb) {
    let lastIndex = 0,
      offset = 0,
      i = 0,
      isWrapped = false,
      group, start, end = 0;
    while (++i < match.length) {
      group = match[i];
      if (group) {
        start = match.indices[i][0];
        if (start >= lastIndex) {
          end = match.indices[i][1];
          if (filterCb(node, group, i)) {
            const obj = this.wrapRange(node, start - offset, end - offset);
            node = obj.node;
            eachCb(obj.markNode, i);
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
  separateGroups(node, match, params, filterCb, eachCb) {
    let startIndex = match.index,
      i = -1,
      isWrapped = false,
      index, group, start;
    while (++i < params.groups.length) {
      index = params.groups[i];
      group = match[index];
      if (group) {
        start = node.textContent.indexOf(group, startIndex);
        if (start !== -1) {
          if (filterCb(node, group, index)) {
            const obj = this.wrapRange(node, start, start + group.length);
            node = obj.node;
            eachCb(obj.markNode, index);
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
  wrapMatchGroupsD(dict, match, params, filterCb, eachCb) {
    let lastIndex = 0,
      i = 0,
      group, start, end = 0,
      isWrapped;
    while (++i < match.length) {
      group = match[i];
      if (group) {
        start = match.indices[i][0];
        if (this.opt.wrapAllRanges || start >= lastIndex) {
          end = match.indices[i][1];
          isWrapped = false;
          this.wrapRangeAcross(dict, start, end, obj => {
            return filterCb(obj.node, group, i);
          }, (node, groupStart) => {
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
  setLastIndex(regex, end) {
    if (end > regex.lastIndex) {
      regex.lastIndex = end;
    } else if (end > 0) {
      regex.lastIndex++;
    } else {
      regex.lastIndex = Infinity;
    }
  }
  wrapMatchGroups(dict, match, params, filterCb, eachCb) {
    let startIndex = 0,
      index = 0,
      group, start, end;
    const s = match.index,
      text = match[0];
    if (this.opt.wrapAllRanges) {
      this.wrapRangeAcross(dict, s, s + text.length, obj => {
        return filterCb(obj.node, text, index);
      }, (node, groupStart) => {
        eachCb(node, groupStart, index);
      });
    }
    for (let i = 0; i < params.groups.length; i++) {
      index = params.groups[i];
      group = match[index];
      if (group) {
        start = text.indexOf(group, startIndex);
        end = start + group.length;
        if (start !== -1) {
          this.wrapRangeAcross(dict, s + start, s + end, obj => {
            return filterCb(obj.node, group, index);
          }, (node, groupStart) => {
            eachCb(node, groupStart, index);
          });
          startIndex = end;
        }
      }
    }
  }
  collectRegexGroupIndexes(regex) {
    let groups = [], stack = [],
      i = -1, index = 1, brackets = 0, charsSet = false,
      str = regex.source,
      reg = /^\(\?<(?![=!])|^\((?!\?)/;
    while (++i < str.length) {
      switch (str[i]) {
        case '(':
          if ( !charsSet) {
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
          if ( !charsSet && stack.pop() === 1) {
            brackets--;
          }
          break;
        case '\\' : i++; break;
        case '[' : charsSet = true; break;
        case ']' : charsSet = false; break;
      }
    }
    return groups;
  }
  wrapSeparateGroups(regex, unused, filterCb, eachCb, endCb) {
    const fn = regex.hasIndices ? 'separateGroupsD' : 'separateGroups',
      params = {
        regex : regex,
        groups : regex.hasIndices ? {} : this.collectRegexGroupIndexes(regex)
      },
      execution = { abort : false },
      filterInfo = { execution : execution };
    let node, match, matchStart, eMatchStart, count = 0;
    this.getTextNodes(dict => {
      dict.nodes.every(nd => {
        node = nd.node;
        filterInfo.offset = nd.start;
        while (
          (match = regex.exec(node.textContent)) !== null &&
          (regex.hasIndices || match[0] !== '')
        ) {
          filterInfo.match = match;
          matchStart = eMatchStart = true;
          node = this[fn](node, match, params, (node, group, groupIndex) => {
            filterInfo.matchStart = matchStart;
            filterInfo.groupIndex = groupIndex;
            matchStart = false;
            return  filterCb(node, group, filterInfo);
          }, (node, groupIndex) => {
            if (eMatchStart) {
              count++;
            }
            eachCb(node, {
              match : match,
              matchStart : eMatchStart,
              count : count,
              groupIndex : groupIndex,
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
  wrapMatches(regex, ignoreGroups, filterCb, eachCb, endCb) {
    const index = ignoreGroups === 0 ? 0 : ignoreGroups + 1,
      execution = { abort : false },
      filterInfo = { execution : execution },
      eachInfo = {};
    let info, node, match, str, count = 0;
    this.getTextNodes(dict => {
      for (let k = 0; k < dict.nodes.length; k++) {
        info = dict.nodes[k];
        node = info.node;
        while ((match = regex.exec(node.textContent)) !== null && (str = match[index]) !== '') {
          filterInfo.match = eachInfo.match = match;
          filterInfo.offset = info.start;
          if ( !filterCb(node, str, filterInfo)) {
            continue;
          }
          let i = 0, start = match.index;
          while (++i < index) {
            start += match[i].length;
          }
          const end = start + str.length;
          if (this.opt.cacheTextNodes) {
            const obj = this.wrapRangeInsert(dict, info, start, end, info.start + start, k);
            eachInfo.count = ++count;
            eachCb(obj.markNode, eachInfo);
            if (obj.increment === 0) {
              regex.lastIndex = 0;
              break;
            }
            k += obj.increment;
            info = obj.nodeInfo;
            node = info.node;
          } else {
            const obj = this.wrapRange(node, start, end);
            node = obj.node;
            eachInfo.count = ++count;
            eachCb(obj.markNode, eachInfo);
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
  wrapGroupsAcrossElements(regex, unused, filterCb, eachCb, endCb) {
    const fn = regex.hasIndices ? 'wrapMatchGroupsD' : 'wrapMatchGroups',
      params = {
        regex : regex,
        groups : regex.hasIndices ? {} : this.collectRegexGroupIndexes(regex)
      },
      execution = { abort : false },
      filterInfo = { execution : execution };
    let match, matchStart, eMatchStart, count = 0;
    this.getTextNodesAcross(dict => {
      while ((match = regex.exec(dict.text)) !== null && (regex.hasIndices || match[0] !== '')) {
        filterInfo.match = match;
        matchStart = eMatchStart = true;
        this[fn](dict, match, params, (node, group, groupIndex) => {
          filterInfo.matchStart = matchStart;
          filterInfo.groupIndex = groupIndex;
          matchStart = false;
          return  filterCb(node, group, filterInfo);
        }, (node, groupStart, groupIndex) => {
          if (eMatchStart) {
            count++;
          }
          eachCb(node, {
            match : match,
            matchStart : eMatchStart,
            count : count,
            groupIndex : groupIndex,
            groupStart : groupStart,
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
  wrapMatchesAcross(regex, ignoreGroups, filterCb, eachCb, endCb) {
    const index = ignoreGroups === 0 ? 0 : ignoreGroups + 1,
      execution = { abort : false },
      filterInfo = { execution : execution };
    let match, matchStart, count = 0;
    this.getTextNodesAcross(dict => {
      while ((match = regex.exec(dict.text)) !== null && match[index] !== '') {
        filterInfo.match = match;
        matchStart = true;
        let start = match.index;
        if (index !== 0) {
          for (let i = 1; i < index; i++) {
            start += match[i].length;
          }
        }
        const end = start + match[index].length;
        this.wrapRangeAcross(dict, start, end, obj => {
          filterInfo.matchStart = matchStart;
          filterInfo.offset = obj.startOffset;
          matchStart = false;
          return filterCb(obj.node, match[index], filterInfo);
        }, (node, matchStart) => {
          if (matchStart) {
            count++;
          }
          eachCb(node, {
            match : match,
            matchStart : matchStart,
            count : count,
          });
        });
        if (execution.abort) {
          break;
        }
      }
      endCb(count);
    });
  }
  wrapRanges(ranges, filterCb, eachCb, endCb) {
    const logs = [],
      skipped = [],
      level = 'warn';
    let count = 0;
    this.getTextNodes(dict => {
      const max = dict.value.length,
        array = this.checkRanges(ranges, logs, max);
      array.forEach((range, index) => {
        let end = range.start + range.length;
        if (end > max) {
          logs.push({ text : `Range length was limited to: ${end - max}`, obj : range, skip : true, level });
          end = max;
        }
        const substr = dict.value.substring(range.start, end);
        if (substr.trim()) {
          this.wrapRangeAcross(dict, range.start, end, obj => {
            return filterCb(obj.node, range, substr, index);
          }, (node, rangeStart) => {
            if (rangeStart) {
              count++;
            }
            eachCb(node, range, {
              matchStart : rangeStart,
              count : count
            });
          });
        } else {
          logs.push({ text : 'Skipping whitespace only range: ', obj : range, level });
          skipped.push(range);
        }
      });
      this.log(`Valid ranges: ${JSON.stringify(array.filter(range => skipped.indexOf(range) === -1))}`);
      endCb(count, logs);
    });
  }
  unwrapMatches(node) {
    const parent = node.parentNode,
      first = node.firstChild;
    if (node.childNodes.length === 1) {
      if (first.nodeType === 3) {
        const previous = node.previousSibling,
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
      if ( !first) {
        parent.removeChild(node);
      } else {
        let docFrag = document.createDocumentFragment();
        while (node.firstChild) {
          docFrag.appendChild(node.removeChild(node.firstChild));
        }
        parent.replaceChild(docFrag, node);
      }
      parent.normalize();
    }
  }
  markRegExp(regexp, opt) {
    this.opt = this.checkOption(opt);
    let totalMarks = 0,
      fn = this.opt.separateGroups ? 'wrapSeparateGroups' : 'wrapMatches';
    if (this.opt.acrossElements) {
      fn = this.opt.separateGroups ? 'wrapGroupsAcrossElements' : 'wrapMatchesAcross';
    }
    if (this.opt.acrossElements) {
      if ( !regexp.global && !regexp.sticky) {
        let splits = regexp.toString().split('/');
        regexp = new RegExp(regexp.source, 'g' + splits[splits.length-1]);
        this.log('RegExp was recompiled because it must have g flag');
      }
    }
    this.log(`Searching with expression "${regexp}"`);
    this[fn](regexp, this.opt.ignoreGroups, (node, match, filterInfo) => {
      return this.opt.filter(node, match, totalMarks, filterInfo);
    }, (element, eachInfo) => {
      totalMarks++;
      this.opt.each(element, eachInfo);
    }, (totalMatches) => {
      if (totalMatches === 0) {
        this.opt.noMatch(regexp);
      }
      this.opt.done(totalMarks, totalMatches);
    });
  }
  mark(sv, opt) {
    if (opt && opt.combinePatterns) {
      this.markCombinePatterns(sv, opt);
      return;
    }
    this.opt = this.checkOption(opt);
    let index = 0,
      totalMarks = 0,
      allMatches = 0,
      totalMatches = 0;
    const regCreator = new RegExpCreator(this.opt),
      fn = this.opt.acrossElements ? 'wrapMatchesAcross' : 'wrapMatches',
      termStats = {},
      terms = this.getSeparatedKeywords(sv);
    const loop = term => {
      const regex = regCreator.create(term);
      let termMatches = 0;
      this.log(`Searching with expression "${regex}"`);
      this[fn](regex, 1, (node, t, filterInfo) => {
        allMatches = totalMatches + termMatches;
        return this.opt.filter(node, term, allMatches, termMatches, filterInfo);
      }, (element, eachInfo) => {
        termMatches = eachInfo.count;
        totalMarks++;
        this.opt.each(element, eachInfo);
      }, (count) => {
        totalMatches += count;
        if (count === 0) {
          this.opt.noMatch(term);
        }
        termStats[term] = count;
        if (++index < terms.length) {
          loop(terms[index]);
        } else {
          this.opt.done(totalMarks, totalMatches, termStats);
        }
      });
    };
    if (terms.length === 0) {
      this.opt.done(0, 0, termStats);
    } else {
      loop(terms[index]);
    }
  }
  markCombinePatterns(sv, opt) {
    this.opt = this.checkOption(opt);
    let index = 0,
      totalMarks = 0,
      totalMatches = 0,
      patterns = [],
      termsParts = [],
      term,
      termMatches;
    const across = this.opt.acrossElements,
      fn = across ? 'wrapMatchesAcross' : 'wrapMatches',
      flags = `gm${this.opt.caseSensitive ? '' : 'i'}`,
      termStats = {},
      terms = this.getSeparatedKeywords(sv);
    const loop = pattern => {
      const regex = new RegExp(pattern, flags),
        patternTerms = termsParts[index];
      this.log(`Searching with expression "${regex}"`);
      this[fn](regex, 1, (node, t, filterInfo) => {
        if (across) {
          if (filterInfo.matchStart) {
            term = this.getCurrentTerm(filterInfo.match, patternTerms);
          }
        } else {
          term = this.getCurrentTerm(filterInfo.match, patternTerms);
        }
        termMatches = termStats[term];
        return this.opt.filter(node, term, totalMatches + termMatches, termMatches, filterInfo);
      }, (element, eachInfo) => {
        totalMarks++;
        if (across) {
          if (eachInfo.matchStart) {
            termStats[term] += 1;
          }
        } else {
          termStats[term] += 1;
        }
        this.opt.each(element, eachInfo);
      }, (count) => {
        totalMatches += count;
        const array = patternTerms.filter((term) => termStats[term] === 0);
        if (array.length) {
          this.opt.noMatch(array);
        }
        if (++index < patterns.length) {
          loop(patterns[index]);
        } else {
          this.opt.done(totalMarks, totalMatches, termStats);
        }
      });
    };
    if (terms.length === 0) {
      this.opt.done(0, 0, termStats);
    } else {
      terms.forEach(term => {
        termStats[term] = 0;
      });
      const obj = this.getPatterns(terms);
      termsParts = obj.termsParts;
      patterns = obj.patterns;
      loop(patterns[index]);
    }
  }
  getCurrentTerm(match, terms) {
    let i = match.length;
    while (--i > 2) {
      if (match[i]) {
        return terms[i-3];
      }
    }
    return ' ';
  }
  getPatterns(terms) {
    const creator = new RegExpCreator(this.opt),
      first = creator.create(terms[0], true),
      patterns = [],
      array = [];
    let num = 10;
    if (typeof this.opt.combinePatterns === 'number') {
      if (this.opt.combinePatterns === Infinity) {
        num = Math.pow(2, 31);
      } else if (this.isNumeric(this.opt.combinePatterns)) {
        num = parseInt(this.opt.combinePatterns);
      }
    }
    let count = Math.ceil(terms.length / num);
    for (let k = 0; k < count; k++)  {
      let pattern = first.lookbehind + '(';
      const patternTerms = [],
        length = Math.min(k * num + num, terms.length);
      for (let i = k * num; i < length; i++)  {
        patternTerms.push(terms[i]);
      }
      pattern += creator.createCombinePattern(patternTerms, true).pattern;
      patterns.push(pattern + ')' + first.lookahead);
      array.push(patternTerms);
    }
    return {  patterns, termsParts : array };
  }
  markRanges(ranges, opt) {
    this.opt = opt;
    this.cacheDict = {};
    if (this.isArrayOfObjects(ranges)) {
      let totalMarks = 0;
      this.wrapRanges(ranges, (node, range, match, index) => {
        return this.opt.filter(node, range, match, index);
      }, (elem, range, rangeInfo) => {
        totalMarks++;
        this.opt.each(elem, range, rangeInfo);
      }, (totalRanges, logs) => {
        this.report(logs);
        this.opt.done(totalMarks, totalRanges);
      });
    } else {
      this.report([{ text : 'markRanges() accept an array of objects: ', obj : ranges, level : 'error' }]);
      this.opt.done(0, 0);
    }
  }
  unmark(opt) {
    this.opt = opt;
    this.cacheDict = {};
    let selector = (this.opt.element ? this.opt.element : 'mark') + '[data-markjs]';
    if (this.opt.className) {
      selector += `.${this.opt.className}`;
    }
    this.log(`Removal selector "${selector}"`);
    this.iterator.forEachNode(NodeFilter.SHOW_ELEMENT, node => {
      this.unwrapMatches(node);
    }, node => {
      const accept = DOMIterator.matches(node, selector) && !this.excludeElements(node);
      return accept ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }, this.opt.done);
  }
}

function Mark(ctx) {
  const instance = new Mark$1(ctx);
  this.mark = (sv, opt) => {
    instance.mark(sv, opt);
    return this;
  };
  this.markRegExp = (sv, opt) => {
    instance.markRegExp(sv, opt);
    return this;
  };
  this.markRanges = (sv, opt) => {
    instance.markRanges(sv, opt);
    return this;
  };
  this.unmark = (opt) => {
    instance.unmark(opt);
    return this;
  };
  this.getVersion = () => {
    return instance.version;
  };
  return this;
}

export { Mark as default };
