/* Version: 2.0.0 - March 26, 2023 */
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
    if ( !selector || !selector.length) {
      return false;
    }
    const selectors = typeof selector === 'string' ? [selector] : selector;
    const fn = (
      element.matches ||
      element.matchesSelector ||
      element.msMatchesSelector ||
      element.mozMatchesSelector ||
      element.oMatchesSelector ||
      element.webkitMatchesSelector
    );
    return fn && selectors.some(sel => fn.call(element, sel) === true);
  }
  getContexts() {
    let ctx,
      sort = false;
    if ( !this.ctx) {
      ctx = [];
    } else if (NodeList.prototype.isPrototypeOf(this.ctx)) {
      ctx = this.ctx;
    } else if (Array.isArray(this.ctx)) {
      ctx = this.ctx;
      sort = true;
    } else if (typeof this.ctx === 'string') {
      ctx = document.querySelectorAll(this.ctx);
    } else {
      ctx = [this.ctx];
    }
    const array = [];
    ctx.forEach(elem => {
      if (array.indexOf(elem) === -1 && !array.some(node => node.contains(elem))) {
        array.push(elem);
      }
    });
    if (sort) {
      array.sort((a, b) => {
        return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) > 0 ? -1 : 1;
      });
    }
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
          if (node.nodeType === 1) {
            if (showElement && filterCb(node)) {
              eachCb(node);
            }
            if (iframe && node.nodeName.toLowerCase() === 'iframe' && !DOMIterator.matches(node, this.opt.exclude)) {
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
          } else  if (showText && node.nodeType === 3 && filterCb(node)) {
            eachCb(node);
          }
        }
      };
      traverse(ctx);
    } else {
      const iterator = this.createIterator(ctx, whatToShow, node => {
        return filterCb(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      });
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
    let spaces = this.opt.wildcards === 'withSpaces';
    return str
      .replace(/\u0001/g, spaces ? '[\\S\\s]?' : '\\S?')
      .replace(/\u0002/g, spaces ? '[\\S\\s]*?' : '\\S*');
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

class Mark$1 {
  constructor(ctx) {
    this.ctx = ctx;
    this.cacheDict = {};
    this.empty = document.createTextNode('');
    this.nodeNames = ['script', 'style', 'title', 'head', 'html'];
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
    if (!this.opt.debug) {
      return;
    }
    const log = this.opt.log;
    if (this.isObject(log) && typeof log[level] === 'function') {
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
    let clear = true,
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
  getSeachTerms(sv) {
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
        logs.push({ text : 'Invalid range: ', obj : range, level });
        return false;
      }
      return true;
    }).sort((a, b) => a.start - b.start);
    if (this.opt.wrapAllRanges) {
      return ranges;
    }
    let lastIndex = 0, index;
    return ranges.filter(range => {
      index = range.start + range.length;
      if (range.start >= lastIndex) {
        lastIndex = index;
        return true;
      }
      logs.push({ text : (index < lastIndex ? 'Nest' : 'Overlapp') + 'ing range: ', obj : range, level });
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
    tags['br'] = 3;
  }
  getTextNodesAcross(cb) {
    if (this.opt.cacheTextNodes && this.cacheDict.nodes) {
      this.cacheDict.lastIndex = 0;
      this.cacheDict.lastTextIndex = 0;
      cb(this.cacheDict);
      return;
    }
    let tags = { div : 1, p : 1, li : 1, td : 1, tr : 1, th : 1, ul : 1,
      ol : 1, dd : 1, dl : 1, dt : 1, h1 : 1, h2 : 1, h3 : 1, h4 : 1,
      h5 : 1, h6 : 1, hr : 1, blockquote : 1, figcaption : 1, figure : 1,
      pre : 1, table : 1, thead : 1, tbody : 1, tfoot : 1, input : 1,
      img : 1, nav : 1, details : 1, label : 1, form : 1, select : 1, menu : 1,
      br : 3, menuitem : 1,
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
      nodes : [], text : '', regex : /\s/, tags : tags,
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
      if (node.nodeType === 1) {
        if ( !type) {
          type = tags[node.nodeName.toLowerCase()];
        } else if (boundary && type !== 2 && (temp = tags[node.nodeName.toLowerCase()]) === 2) {
          type = temp;
        }
        return false;
      }
      return !this.excludeElements(node.parentNode);
    }, () => {
      if (currNode) {
        this.getNodeInfo(prevNode, currNode, type, obj);
      }
      const dict = this.createDict(obj.text, obj.nodes, 'across');
      cb(dict);
    });
  }
  getNodeInfo(prevNode, node, type, obj) {
    let offset = 0,
      text = prevNode.textContent;
    const start = obj.text.length;
    if (prevNode !== node) {
      if (type === 3) {
        text += '\n';
        offset = 1;
      } else {
        const endSpace = obj.regex.test(text[text.length - 1]),
          startSpace = obj.regex.test(node.textContent[0]);
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
                text += ' ';
                offset = 1;
              } else if (type === 2) {
                text += obj.str3;
                offset = 3;
              }
            } else if (type === 2) {
              let str = startSpace && endSpace ? obj.str : startSpace ? obj.str1 : obj.str2;
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
  getTextNodes(cb) {
    if (this.opt.cacheTextNodes && this.cacheDict.nodes) {
      cb(this.cacheDict);
      return;
    }
    let text = '',
      nodes = [];
    this.iterator.forEachNode(NodeFilter.SHOW_TEXT, node => {
      nodes.push({
        start: text.length,
        end: (text += node.textContent).length,
        offset : 0,
        node: node
      });
    }, node => {
      return !this.excludeElements(node.parentNode);
    }, () => {
      const dict = this.createDict(text, nodes, 'every');
      cb(dict);
    });
  }
  createDict(text, nodes, type) {
    const dict = {
      text : text,
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
  excludeElements(elem) {
    return this.nodeNames.indexOf(elem.nodeName.toLowerCase()) !== -1 || DOMIterator.matches(elem, this.opt.exclude);
  }
  wrapRangeInsert(dict, n, s, e, start, index) {
    const ended = e === n.node.textContent.length;
    let type = 0,
      retNode, textNode;
    if (s === 0) {
      if (ended) {
        const node = this.wrapTextNode(n.node);
        n.node = node.childNodes[0];
        return { markNode : node, nodeInfo : this.createInfo(this.empty, n.end, n.end, n.offset, 0), increment : 0 };
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
  wrapRange(node, start, end, eachCb) {
    let retNode = this.empty,
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
  wrapRangeAcross(dict, start, end, filterCb, eachCb) {
    let i = dict.lastIndex,
      rangeStart = true;
    const wrapAllRanges = this.opt.wrapAllRanges || this.opt.cacheTextNodes;
    if (wrapAllRanges) {
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
          if (wrapAllRanges) {
            const obj = this.wrapRangeInsert(dict, n, s, e, start, i);
            n = obj.nodeInfo;
            eachCb(obj.markNode, rangeStart);
          } else {
            n.node = this.wrapRange(n.node, s, e, node => {
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
  wrapGroups(node, match, params, filterCb, eachCb) {
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
            node = this.wrapRange(node, start, start + group.length, node => {
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
  wrapGroupsAcross(dict, match, params, filterCb, eachCb) {
    let startIndex = 0,
      index = 0,
      group, start, end;
    const s = match.index,
      text = match[0];
    if (this.opt.wrapAllRanges) {
      this.wrapRangeAcross(dict, s, s + text.length, obj => {
        return filterCb(obj, text, index);
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
            return filterCb(obj, group, index);
          }, (node, groupStart) => {
            eachCb(node, groupStart, index);
          });
          startIndex = end;
        }
      }
    }
  }
  wrapGroupsDFlag(node, match, params, filterCb, eachCb) {
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
            node = this.wrapRange(node, start - offset, end - offset, node => {
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
  wrapGroupsDFlagAcross(dict, match, params, filterCb, eachCb) {
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
            return filterCb(obj, group, i);
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
    const index = regex.lastIndex;
    regex.lastIndex = end > index ? end : end > 0 ? index + 1 : Infinity;
  }
  collectRegexGroupIndexes(regex) {
    let groups = [], stack = [],
      i = -1, index = 1, brackets = 0, charSet = false,
      str = regex.source,
      reg = /^\(\?<(?![=!])|^\((?!\?)/;
    while (++i < str.length) {
      switch (str[i]) {
        case '(':
          if ( !charSet) {
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
          if ( !charSet && stack.pop() === 1) {
            brackets--;
          }
          break;
        case '\\' : i++; break;
        case '[' : charSet = true; break;
        case ']' : charSet = false; break;
      }
    }
    return groups;
  }
  wrapSeparateGroups(regex, unused, filterCb, eachCb, endCb) {
    const hasIndices = regex.hasIndices,
      fn = hasIndices ? 'wrapGroupsDFlag' : 'wrapGroups',
      params = {
        regex : regex,
        groups : hasIndices ? {} : this.collectRegexGroupIndexes(regex)
      },
      execution = { abort : false },
      filterInfo = { execution : execution };
    let node, match, filterStart, eachStart, count = 0;
    this.getTextNodes(dict => {
      dict.nodes.every(info => {
        node = info.node;
        filterInfo.offset = info.start;
        while ((match = regex.exec(node.textContent)) !== null && (hasIndices || match[0] !== '')) {
          filterInfo.match = match;
          filterStart = eachStart = true;
          node = this[fn](node, match, params, (node, group, grIndex) => {
            filterInfo.matchStart = filterStart;
            filterInfo.groupIndex = grIndex;
            filterStart = false;
            return filterCb(node, group, filterInfo);
          }, (node, grIndex) => {
            if (eachStart) {
              count++;
            }
            eachCb(node, {
              match : match,
              matchStart : eachStart,
              count : count,
              groupIndex : grIndex,
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
  wrapSeparateGroupsAcross(regex, unused, filterCb, eachCb, endCb) {
    const hasIndices = regex.hasIndices,
      fn = hasIndices ? 'wrapGroupsDFlagAcross' : 'wrapGroupsAcross',
      params = {
        regex : regex,
        groups : hasIndices ? {} : this.collectRegexGroupIndexes(regex)
      },
      execution = { abort : false },
      filterInfo = { execution : execution };
    let match, filterStart, eachStart, count = 0;
    this.getTextNodesAcross(dict => {
      while ((match = regex.exec(dict.text)) !== null && (hasIndices || match[0] !== '')) {
        filterInfo.match = match;
        filterStart = eachStart = true;
        this[fn](dict, match, params, (obj, group, grIndex) => {
          filterInfo.matchStart = filterStart;
          filterInfo.groupIndex = grIndex;
          filterInfo.offset = obj.startOffset;
          filterStart = false;
          return filterCb(obj.node, group, filterInfo);
        }, (node, groupStart, grIndex) => {
          if (eachStart) {
            count++;
          }
          eachCb(node, {
            match : match,
            matchStart : eachStart,
            count : count,
            groupIndex : grIndex,
            groupStart : groupStart,
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
          filterInfo.match = match;
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
            node = this.wrapRange(node, start, end, node => {
              count++;
              eachCb(node, {
                match : match,
                count : count
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
  wrapMatchesAcross(regex, ignoreGroups, filterCb, eachCb, endCb) {
    const index = ignoreGroups === 0 ? 0 : ignoreGroups + 1,
      execution = { abort : false },
      filterInfo = { execution : execution };
    let match, str, matchStart, count = 0;
    this.getTextNodesAcross(dict => {
      while ((match = regex.exec(dict.text)) !== null && (str = match[index]) !== '') {
        filterInfo.match = match;
        matchStart = true;
        let i = 0, start = match.index;
        while (++i < index) {
          start += match[i].length;
        }
        this.wrapRangeAcross(dict, start, start + str.length, obj => {
          filterInfo.matchStart = matchStart;
          filterInfo.offset = obj.startOffset;
          matchStart = false;
          return filterCb(obj.node, str, filterInfo);
        }, (node, mStart) => {
          if (mStart) {
            count++;
          }
          eachCb(node, {
            match : match,
            matchStart : mStart,
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
      const max = dict.text.length,
        array = this.checkRanges(ranges, logs, max);
      array.forEach((range, index) => {
        let end = range.start + range.length;
        if (end > max) {
          logs.push({ text : `Range was limited to: ${max}`, obj : range, skip : true, level });
          end = max;
        }
        const substr = dict.text.substring(range.start, end);
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
      matchesSoFar = 0,
      fn = this.opt.separateGroups ? 'wrapSeparateGroups' : 'wrapMatches';
    if (this.opt.acrossElements) {
      fn = this.opt.separateGroups ? 'wrapSeparateGroupsAcross' : 'wrapMatchesAcross';
      if ( !regexp.global && !regexp.sticky) {
        let splits = regexp.toString().split('/');
        regexp = new RegExp(regexp.source, 'g' + splits[splits.length-1]);
        this.log('RegExp is recompiled because it must have g flag');
      }
    }
    this.log(`Searching with expression "${regexp}"`);
    this[fn](regexp, this.opt.ignoreGroups, (node, match, filterInfo) => {
      return this.opt.filter(node, match, matchesSoFar, filterInfo);
    }, (element, eachInfo) => {
      matchesSoFar = eachInfo.count;
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
    this.opt = this.checkOption(opt);
    if (this.opt && this.opt.combinePatterns) {
      this.markCombinePatterns(sv);
      return;
    }
    let index = 0,
      totalMarks = 0,
      matches = 0,
      totalMatches = 0;
    const regCreator = new RegExpCreator(this.opt),
      fn = this.opt.acrossElements ? 'wrapMatchesAcross' : 'wrapMatches',
      termStats = {},
      terms = this.getSeachTerms(sv);
    const loop = term => {
      const regex = regCreator.create(term);
      let termMatches = 0;
      this.log(`Searching with expression "${regex}"`);
      this[fn](regex, 1, (node, t, filterInfo) => {
        matches = totalMatches + termMatches;
        return this.opt.filter(node, term, matches, termMatches, filterInfo);
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
    if (terms.length) {
      loop(terms[index]);
    } else {
      this.opt.done(0, 0, termStats);
    }
  }
  markCombinePatterns(sv) {
    let index = 0,
      totalMarks = 0,
      totalMatches = 0,
      patterns = [],
      termsParts = [],
      term,
      termMatches;
    const across = this.opt.acrossElements,
      fn = across ? 'wrapMatchesAcross' : 'wrapMatches',
      flags = `g${this.opt.caseSensitive ? '' : 'i'}`,
      termStats = {},
      terms = this.getSeachTerms(sv);
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
    if (terms.length) {
      terms.forEach(term => {
        termStats[term] = 0;
      });
      const obj = this.getPatterns(terms);
      termsParts = obj.termsParts;
      patterns = obj.patterns;
      loop(patterns[index]);
    } else {
      this.opt.done(0, 0, termStats);
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
      option = this.opt.combinePatterns,
      patterns = [],
      array = [];
    let num = 10,
      value;
    if (option === Infinity) {
      num = Math.pow(2, 31);
    } else if (this.isNumeric(option) && (value = parseInt(option)) > 0) {
      num = value;
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
      return DOMIterator.matches(node, selector) && !this.excludeElements(node);
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
    return '2.0.0';
  };
  return this;
}

export { Mark as default };
