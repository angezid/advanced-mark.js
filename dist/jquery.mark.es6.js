/*!***************************************************
* advanced-mark.js v2.7.0
* https://github.com/angezid/advanced-mark.js
* MIT licensed
* Copyright (c) 2022–2025, angezid
* Based on 'mark.js', license https://git.io/vwTVl
*****************************************************/

class DOMIterator {
  constructor(ctx, opt) {
    this.ctx = ctx;
    this.opt = opt;
    this.map = [];
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
    return fn && selectors.some(sel => fn.call(element, sel));
  }
  getContexts() {
    let ctx = this.ctx,
      win = this.opt.window,
      sort = false;
    if ( !ctx) return [];
    if (Array.isArray(ctx)) {
      sort = true;
    } else if (typeof ctx === 'string') {
      ctx = this.toArray(win.document.querySelectorAll(ctx));
    } else if (ctx.length >= 0) {
      ctx = this.toArray(ctx);
    } else {
      ctx = [ctx];
    }
    const array = [];
    ctx.forEach(elem => {
      if (array.indexOf(elem) === -1 && !array.some(node => node.contains(elem))) {
        array.push(elem);
      }
    });
    if (sort) {
      array.sort((a, b) => {
        return (a.compareDocumentPosition(b) & win.Node.DOCUMENT_POSITION_FOLLOWING) > 0 ? -1 : 1;
      });
    }
    return array;
  }
  toArray(collection) {
    const array = [];
    for (let i = 0; i < collection.length; i++) {
      array.push(collection[i]);
    }
    return array;
  }
  getIframeContents(iframe, successFn, errorFn) {
    try {
      const doc = iframe.contentWindow.document;
      if (doc) {
        this.map.push([iframe, 'ready']);
        successFn({ iframe : iframe, context : doc });
      }
    } catch (e) {
      errorFn({ iframe : iframe, error : e });
    }
  }
  observeIframeLoad(ifr, successFn, errorFn) {
    if (this.map.some(arr => arr[0] === ifr)) {
      return;
    }
    let id = null;
    const listener = () => {
      clearTimeout(id);
      ifr.removeEventListener('load', listener);
      this.getIframeContents(ifr, successFn, errorFn);
    };
    ifr.addEventListener('load', listener);
    this.map.push([ifr, true]);
    id = setTimeout(listener, this.opt.iframesTimeout);
  }
  onIframeReady(ifr, successFn, errorFn) {
    try {
      const bl = 'about:blank',
        src = ifr.getAttribute('src'),
        win = ifr.contentWindow;
      if (win.document.readyState === 'complete') {
        if (src && src.trim() !== bl && win.location.href === bl) {
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
  waitForIframes(ctx, doneCb) {
    const shadow = this.opt.shadowDOM;
    let count = 0,
      iframes = 0,
      array,
      node;
    const collect = context => {
      const iterator = this.createIterator(context, this.opt.window.NodeFilter.SHOW_ELEMENT);
      while ((node = iterator.nextNode())) {
        if (this.isIframe(node) && !this.map.some(arr => arr[0] === node)) {
          array.push(node);
          iframes++;
        }
        if (shadow && node.shadowRoot && node.shadowRoot.mode === 'open') {
          collect(node.shadowRoot);
        }
      }
    };
    const loop = (obj) => {
      array = [];
      if ( !obj.iframe || obj.context.location.href !== 'about:blank') {
        collect(obj.context);
        if ( !obj.iframe && !array.length) {
          doneCb();
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
              console.log(obj.error || obj);
            }
            if (++count === iframes) doneCb();
          });
        });
      } else if (count === iframes) {
        doneCb();
      }
    };
    loop({ context : ctx });
  }
  createIterator(ctx, whatToShow) {
    const win = this.opt.window;
    return win.document.createNodeIterator(ctx, whatToShow, () => win.NodeFilter.FILTER_ACCEPT, false);
  }
  addRemoveStyle(root, style, add) {
    if (add && !style) return;
    let elem = root.querySelector('style[data-markjs]');
    if (add) {
      if ( !elem) {
        elem = this.opt.window.document.createElement('style');
        elem.setAttribute('data-markjs', 'true');
        root.appendChild(elem);
      }
      elem.textContent = style;
    } else if (elem) {
      root.removeChild(elem);
    }
  }
  isIframe(node) {
    return node.tagName === 'IFRAME' && !DOMIterator.matches(node, this.opt.exclude);
  }
  iterateThroughNodes(ctx, whatToShow, filterCb, eachCb, doneCb) {
    const filter = this.opt.window.NodeFilter,
      shadow = this.opt.shadowDOM,
      iframe = this.opt.iframes;
    if (iframe || shadow) {
      const showElement = (whatToShow & filter.SHOW_ELEMENT) > 0,
        showText = (whatToShow & filter.SHOW_TEXT) > 0;
      const traverse = node => {
        let iterator = this.createIterator(node, whatToShow | filter.SHOW_ELEMENT),
          root;
        while ((node = iterator.nextNode())) {
          if (node.nodeType === 1) {
            if (showElement && filterCb(node)) {
              eachCb(node);
            }
            if (iframe && this.isIframe(node) && this.map.some(arr => arr[0] === node && arr[1] === 'ready')) {
              const doc = node.contentWindow.document;
              if (doc) traverse(doc);
            }
            if (shadow && (root = node.shadowRoot) && root.mode === 'open') {
              this.addRemoveStyle(root, shadow.style, showText);
              traverse(root);
            }
          } else  if (showText && node.nodeType === 3 && filterCb(node)) {
            eachCb(node);
          }
        }
      };
      traverse(ctx);
    } else {
      const iterator = this.createIterator(ctx, whatToShow);
      let node;
      while ((node = iterator.nextNode())) {
        if (filterCb(node)) {
          eachCb(node);
        }
      }
    }
    doneCb();
  }
  forEachNode(whatToShow, each, filter, done = () => {}) {
    const contexts = this.getContexts();
    let open = contexts.length;
    if ( !open) done();
    const ready = () => {
      contexts.forEach(ctx => {
        this.iterateThroughNodes(ctx, whatToShow, filter, each, () => {
          if (--open <= 0) done();
        });
      });
    };
    if (this.opt.iframes) {
      let count = open,
        fired = false;
      const id = setTimeout(() => {
        fired = true;
        ready();
      }, this.opt.iframesTimeout);
      const finish = () => {
        clearTimeout(id);
        if ( !fired) ready();
      };
      contexts.forEach(ctx => {
        this.waitForIframes(ctx, () => {
          if (--count <= 0) finish();
        });
      });
    } else {
      ready();
    }
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

class Mark {
  constructor(ctx) {
    this.ctx = ctx;
    this.nodeNames = ['script', 'style', 'title', 'head', 'html'];
  }
  set opt(val) {
    if ( !(val && val.window && val.window.document) && typeof window === 'undefined') {
      throw new Error('Mark.js: please provide a window object as an option.');
    }
    const win = val && val.window || window;
    this._opt = Object.assign({}, {
      'window': win,
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
      'log': win.console
    }, val);
    if ( !this._opt.element) {
      this._opt.element = 'mark';
    }
    this.filter = win.NodeFilter;
    this.empty = win.document.createTextNode('');
  }
  get opt() {
    return this._opt;
  }
  get iterator() {
    return new DOMIterator(this.ctx, this.opt);
  }
  log(msg, level = 'debug') {
    if (this.opt.debug) {
      const log = this.opt.log;
      if (typeof log === 'object' && typeof log[level] === 'function') {
        log[level](`mark.js: ${msg}`);
      }
    }
  }
  report(array) {
    array.forEach(item => {
      this.log(`${item.text} ${JSON.stringify(item.obj)}`, item.level || 'debug');
      if ( !item.skip) {
        this.opt.noMatch(item.obj);
      }
    });
  }
  checkOption(opt, del) {
    this.opt = opt;
    let dict = this.cacheDict,
      clear = true;
    if (dict) {
      if ( !del && this.opt.cacheTextNodes) {
        if (this.opt.acrossElements) {
          if (dict.across) {
            clear = false;
          }
        } else if ( !dict.across) {
          clear = false;
        }
      }
      if (clear) {
        this.cacheDict = null;
      }
    }
  }
  getSeachTerms(sv) {
    const search = typeof sv === 'string' ? [sv] : sv,
      separate = this.opt.separateWordSearch,
      array = [],
      termStats = {},
      split = str => {
        str.split(/ +/).forEach(word => add(word));
      },
      add = str => {
        if (str.trim() && array.indexOf(str) === -1) {
          array.push(str);
          termStats[str] = 0;
        }
      };
    search.forEach(str => {
      if (separate) {
        if (separate === 'preserveTerms') {
          str.split(/"("*[^"]+"*)"/).forEach((term, i) => {
            if (i % 2 > 0) add(term);
            else split(term);
          });
        } else {
          split(str);
        }
      } else {
        add(str);
      }
    });
    array.sort((a, b) => b.length - a.length);
    return { terms : array, termStats };
  }
  isNumeric(value) {
    return Number(parseFloat(value)) == value;
  }
  checkRanges(array, logs, min, max) {
    const level = 'error';
    const ranges = array.filter(range => {
      if (this.isNumeric(range.start) && this.isNumeric(range.length)) {
        range.start = parseInt(range.start);
        range.length = parseInt(range.length);
        if (range.start >= min && range.start < max && range.length > 0) {
          return true;
        }
      }
      logs.push({ text : 'Invalid range: ', obj : range, level });
      return false;
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
  setType(tags, boundary) {
    const custom = Array.isArray(boundary.tagNames) && boundary.tagNames.length;
    if (custom) {
      boundary.tagNames.forEach(name => tags[name.toLowerCase()] = 2);
    }
    if ( !custom || boundary.extend) {
      for (const key in tags) {
        tags[key] = 2;
      }
    }
    tags['br'] = 3;
  }
  getTextNodesAcross(cb) {
    if (this.opt.cacheTextNodes && this.cacheDict) {
      this.cacheDict.lastIndex = 0;
      this.cacheDict.lastTextIndex = 0;
      cb(this.cacheDict);
      return;
    }
    const tags = { div : 1, p : 1, li : 1, td : 1, tr : 1, th : 1, ul : 1,
      ol : 1, dd : 1, dl : 1, dt : 1, h1 : 1, h2 : 1, h3 : 1, h4 : 1,
      h5 : 1, h6 : 1, hr : 1, blockquote : 1, figcaption : 1, figure : 1,
      pre : 1, table : 1, thead : 1, tbody : 1, tfoot : 1, input : 1,
      img : 1, nav : 1, details : 1, label : 1, form : 1, select : 1, menu : 1,
      br : 3, menuitem : 1,
      main : 1, section : 1, article : 1, aside : 1, picture : 1, output : 1,
      button : 1, header : 1, footer : 1, address : 1, area : 1, canvas : 1,
      map : 1, fieldset : 1, textarea : 1, track : 1, video : 1, audio : 1,
      body : 1, iframe : 1, meter : 1, object : 1, svg : 1 };
    const nodes = [],
      boundary = this.opt.blockElementsBoundary,
      priorityType = boundary ? 2 : 1;
    let ch = '\x01', tempType, type, prevNode;
    if (boundary) {
      this.setType(tags, boundary);
      if (boundary.char) {
        ch = boundary.char.charAt(0);
      }
    }
    const obj = {
      text : '', regex : /\s/, tags : tags,
      boundary : boundary, startOffset : 0, str : '', ch : ch
    };
    this.iterator.forEachNode(this.filter.SHOW_ELEMENT | this.filter.SHOW_TEXT, node => {
      if (prevNode) {
        nodes.push(this.getNodeInfo(prevNode, node, type, obj));
      }
      type = null;
      prevNode = node;
    }, node => {
      if (node.nodeType === 1) {
        tempType = tags[node.nodeName.toLowerCase()];
        if (tempType === 3) {
          obj.str += '\n';
        }
        if ( !type || tempType === priorityType) {
          type = tempType;
        }
        return false;
      }
      return !this.excluded(node.parentNode);
    }, () => {
      if (prevNode) {
        nodes.push(this.getNodeInfo(prevNode, null, type, obj));
      }
      cb(this.createDict(obj.text, nodes, true));
    });
  }
  getNodeInfo(prevNode, node, type, obj) {
    const start = obj.text.length,
      startOffset = obj.startOffset,
      ch = obj.ch;
    let offset = 0,
      str = obj.str,
      text = prevNode.textContent;
    if (node) {
      const startBySpace = obj.regex.test(node.textContent[0]),
        both = startBySpace && obj.regex.test(text[text.length - 1]);
      if (obj.boundary || !both) {
        let separate = type;
        if (!type) {
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
          if ( !both) {
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
      obj.startOffset -= offset;
      obj.str = '';
    }
    obj.text += text;
    return this.createInfo(prevNode, start, obj.text.length - offset, offset, startOffset);
  }
  getTextNodes(cb) {
    if (this.opt.cacheTextNodes && this.cacheDict) {
      cb(this.cacheDict);
      return;
    }
    const nodes = [],
      regex = /\n/g,
      newLines = [0],
      lines = this.opt.markLines,
      show = this.filter.SHOW_TEXT | (lines ? this.filter.SHOW_ELEMENT : 0);
    let text = '',
      len = 0,
      rm;
    this.iterator.forEachNode(show, node => {
      if (lines) {
        while ((rm = regex.exec(node.textContent)) !== null) {
          newLines.push(len + rm.index);
        }
      }
      text += node.textContent;
      nodes.push({
        start : len,
        end : (len = text.length),
        offset : 0,
        node : node
      });
    }, node => {
      if (lines && node.nodeType === 1) {
        if (node.tagName === 'BR') {
          newLines.push(len);
        }
        return false;
      }
      return !this.excluded(node.parentNode);
    }, () => {
      const dict = this.createDict(text, nodes, false);
      if (lines) {
        newLines.push(len);
        dict.newLines = newLines;
      }
      cb(dict);
    });
  }
  createDict(text, nodes, across) {
    const dict = {
      text : text,
      nodes: nodes,
      lastIndex: 0,
      lastTextIndex: 0
    };
    if (this.opt.cacheTextNodes) {
      this.cacheDict = dict;
      this.cacheDict.across = across;
    }
    return dict;
  }
  excluded(elem) {
    return this.nodeNames.indexOf(elem.nodeName.toLowerCase()) !== -1 || DOMIterator.matches(elem, this.opt.exclude);
  }
  wrapRangeInsert(dict, n, s, e, start, index) {
    const ended = e === n.node.textContent.length,
      end = n.end;
    let type = 1,
      splitIndex = e,
      node = n.node;
    if (s !== 0) {
      node = node.splitText(s);
      splitIndex = e - s;
      type = ended ? 2 : 3;
    } else if (ended) {
      type = 0;
    }
    const retNode = ended ? this.empty : node.splitText(splitIndex),
      mark = this.wrapTextNode(node),
      markChild = mark.childNodes[0],
      nodeInfo = this.createInfo(retNode, type === 0 || type === 2 ? end : n.start + e, end, n.offset, n.startOffset);
    if (type === 0) {
      n.node = markChild;
      return { mark, nodeInfo, increment : 0 };
    }
    const info = this.createInfo(markChild, type === 1 ? n.start : start, n.start + e, 0, n.startOffset);
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
    return { mark, nodeInfo, increment : type < 3 ? 1 : 2 };
  }
  createInfo(node, start, end, offset, startOffset) {
    return { node, start, end, offset, startOffset };
  }
  wrapRange(node, start, end, eachCb) {
    let ended = end === node.textContent.length,
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
  wrapTextNode(node) {
    let markNode = this.opt.window.document.createElement(this.opt.element);
    markNode.setAttribute('data-markjs', 'true');
    if (this.opt.className) {
      markNode.setAttribute('class', this.opt.className);
    }
    markNode.textContent = node.textContent;
    node.parentNode.replaceChild(markNode, node);
    return markNode;
  }
  wrapRangeAcross(dict, start, end, filterCb, eachCb) {
    let i = dict.lastIndex,
      rangeStart = true;
    const wrapAllRanges = this.opt.wrapAllRanges || this.opt.cacheTextNodes;
    if (wrapAllRanges) {
      while (i > 0 && dict.nodes[i].start > start) {
        i--;
      }
    } else if (start < dict.lastTextIndex) {
      return;
    }
    for (i; i < dict.nodes.length; i++) {
      if (i + 1 === dict.nodes.length || dict.nodes[i+1].start > start) {
        let n = dict.nodes[i];
        if ( !filterCb(n)) break;
        const s = start - n.start,
          e = (end > n.end ? n.end : end) - n.start;
        if (s >= 0 && e > s) {
          if (wrapAllRanges) {
            const obj = this.wrapRangeInsert(dict, n, s, e, start, i);
            n = obj.nodeInfo;
            eachCb(obj.mark, rangeStart);
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
          break;
        }
      }
    }
    dict.lastIndex = i;
  }
  wrapGroups(node, match, params, filterCb, eachCb) {
    let startIndex = match.index,
      isWrapped = false,
      group, start;
    params.groups.forEach(index => {
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
    });
    if (isWrapped) {
      params.regex.lastIndex = 0;
    }
    return node;
  }
  wrapGroupsAcross(dict, match, params, filterCb, eachCb) {
    let startIndex = 0,
      group, start, end;
    const s = match.index,
      text = match[0],
      wrap = (start, end, index) => {
        this.wrapRangeAcross(dict, s + start, s + end, obj => {
          return filterCb(obj, text, index);
        }, (node, groupStart) => {
          eachCb(node, groupStart, index);
        });
      };
    if (this.opt.wrapAllRanges) {
      wrap(0, text.length, 0);
    }
    params.groups.forEach(index => {
      group = match[index];
      if (group) {
        start = text.indexOf(group, startIndex);
        if (start !== -1) {
          end = start + group.length;
          wrap(start, end, index);
          startIndex = end;
        }
      }
    });
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
  collectGroupIndexes(regex) {
    let groups = [], stack = [],
      index = 0, brackets = 0,
      str = regex.source, rm,
      reg = /(?:\\.)+|\[(?:[^\\\]]|(?:\\.))+\]|(\(\?<(?![=!])|\((?!\?))|(\()|(\))/g;
    while ((rm = reg.exec(str)) !== null) {
      if (rm[1]) {
        stack.push(1);
        index++;
        if (brackets++ === 0) {
          groups.push(index);
        }
      } else if (rm[2]) {
        stack.push(0);
      } else if (rm[3] && stack.pop()) {
        brackets--;
      }
    }
    return groups;
  }
  wrapSeparateGroups(regex, unused, filterCb, eachCb, endCb) {
    const hasIndices = regex.hasIndices,
      fn = hasIndices ? 'wrapGroupsDFlag' : 'wrapGroups',
      params = {
        regex : regex,
        groups : hasIndices ? {} : this.collectGroupIndexes(regex)
      },
      execution = { abort : false },
      info = { execution : execution };
    let node, match, filterStart, eachStart, count = 0;
    this.getTextNodes(dict => {
      dict.nodes.every(obj => {
        node = obj.node;
        info.offset = obj.start;
        while ((match = regex.exec(node.textContent)) !== null && (hasIndices || match[0] !== '')) {
          info.match = match;
          filterStart = eachStart = true;
          node = this[fn](node, match, params, (node, group, grIndex) => {
            info.matchStart = filterStart;
            info.groupIndex = grIndex;
            filterStart = false;
            return filterCb(node, group, info);
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
          if (execution.abort) break;
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
        groups : hasIndices ? {} : this.collectGroupIndexes(regex)
      },
      execution = { abort : false },
      info = { execution : execution };
    let match, filterStart, eachStart, count = 0;
    this.getTextNodesAcross(dict => {
      while ((match = regex.exec(dict.text)) !== null && (hasIndices || match[0] !== '')) {
        info.match = match;
        filterStart = eachStart = true;
        this[fn](dict, match, params, (obj, group, grIndex) => {
          info.matchStart = filterStart;
          info.groupIndex = grIndex;
          info.offset = obj.startOffset;
          filterStart = false;
          return filterCb(obj.node, group, info);
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
        if (execution.abort) break;
      }
      endCb(count);
    });
  }
  wrapMatches(regex, ignoreGroups, filterCb, eachCb, endCb) {
    const index = ignoreGroups === 0 ? 0 : ignoreGroups + 1,
      execution = { abort : false },
      filterInfo = { execution : execution };
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
            if (match[i]) {
              start += match[i].length;
            }
          }
          const end = start + str.length;
          if (this.opt.cacheTextNodes) {
            const obj = this.wrapRangeInsert(dict, info, start, end, info.start + start, k);
            eachCb(obj.mark, {
              match : match,
              count : ++count,
            });
            if (obj.increment === 0) break;
            k += obj.increment;
            info = obj.nodeInfo;
            node = info.node;
          } else {
            node = this.wrapRange(node, start, end, node => {
              eachCb(node, {
                match : match,
                count : ++count
              });
            });
          }
          regex.lastIndex = 0;
          if (execution.abort) break;
        }
        if (execution.abort) break;
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
          if (match[i]) {
            start += match[i].length;
          }
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
        if (execution.abort) break;
      }
      endCb(count);
    });
  }
  wrapRanges(ranges, filterCb, eachCb, endCb) {
    const lines = this.opt.markLines,
      logs = [],
      skipped = [],
      level = 'warn';
    let count = 0;
    this.getTextNodes(dict => {
      const max = lines ? dict.newLines.length : dict.text.length,
        array = this.checkRanges(ranges, logs, lines ? 1 : 0, max);
      array.forEach((range, index) => {
        let start = range.start,
          end = start + range.length;
        if (end > max) {
          logs.push({ text : `Range was limited to: ${max}`, obj : range, skip : true, level });
          end = max;
        }
        if (lines) {
          start = dict.newLines[start-1];
          if (dict.text[start] === '\n') {
            start++;
          }
          end = dict.newLines[end-1];
        }
        const substr = dict.text.substring(start, end);
        if (substr.trim()) {
          this.wrapRangeAcross(dict, start, end, obj => {
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
        let docFrag = this.opt.window.document.createDocumentFragment();
        while (node.firstChild) {
          docFrag.appendChild(node.removeChild(node.firstChild));
        }
        parent.replaceChild(docFrag, node);
      }
      parent.normalize();
    }
  }
  markRegExp(regexp, opt) {
    this.checkOption(opt);
    let totalMarks = 0,
      matchesSoFar = 0,
      fn = this.opt.separateGroups ? 'wrapSeparateGroups' : 'wrapMatches';
    if (this.opt.acrossElements) {
      fn +=  'Across';
      if ( !regexp.global && !regexp.sticky) {
        let splits = regexp.toString().split('/');
        regexp = new RegExp(regexp.source, 'g' + splits[splits.length-1]);
        this.log('RegExp is recompiled - it must have a `g` flag');
      }
    }
    this.log(`RegExp "${regexp}"`);
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
    this.checkOption(opt);
    const { terms, termStats } = this.getSeachTerms(sv);
    if ( !terms.length) {
      this.opt.done(0, 0, termStats);
      return;
    }
    if (this.opt.combinePatterns) {
      this.markCombinePatterns(terms, termStats);
      return;
    }
    let index = 0,
      totalMarks = 0,
      matches = 0,
      totalMatches = 0,
      termMatches;
    const regCreator = new RegExpCreator(this.opt),
      fn = this.opt.acrossElements ? 'wrapMatchesAcross' : 'wrapMatches';
    const loop = term => {
      termMatches = 0;
      const regex = regCreator.create(term);
      this.log(`RegExp "${regex}"`);
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
    loop(terms[index]);
  }
  markCombinePatterns(terms, termStats) {
    let index = 0,
      totalMarks = 0,
      totalMatches = 0,
      term,
      termMatches;
    const across = this.opt.acrossElements,
      fn = across ? 'wrapMatchesAcross' : 'wrapMatches',
      flags = `g${this.opt.caseSensitive ? '' : 'i'}`,
      patterns = this.getPatterns(terms);
    const loop = ({ pattern, regTerms }) => {
      const regex = new RegExp(pattern, flags);
      this.log(`RegExp "${regex}"`);
      this[fn](regex, 1, (node, t, filterInfo) => {
        if ( !across || filterInfo.matchStart) {
          term = this.getCurrentTerm(filterInfo.match, regTerms);
        }
        termMatches = termStats[term];
        return this.opt.filter(node, term, totalMatches + termMatches, termMatches, filterInfo);
      }, (element, eachInfo) => {
        totalMarks++;
        if ( !across || eachInfo.matchStart) {
          termStats[term] += 1;
        }
        this.opt.each(element, eachInfo);
      }, (count) => {
        totalMatches += count;
        const array = regTerms.filter((term) => termStats[term] === 0);
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
    loop(patterns[index]);
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
      option = this.opt.combinePatterns,
      length = terms.length,
      array = [];
    let num = 10,
      value;
    if (option === Infinity) {
      num = length;
    } else if (Number.isInteger(option) && (value = parseInt(option)) > 0) {
      num = value;
    }
    for (let i = 0; i < length; i += num) {
      const chunk = terms.slice(i, Math.min(i + num, length)),
        obj = creator.createCombinePattern(chunk, true);
      array.push({ pattern : `${obj.lookbehind}(${obj.pattern})${obj.lookahead}`, regTerms : chunk });
    }
    return array;
  }
  markRanges(ranges, opt) {
    this.checkOption(opt, true);
    if (Array.isArray(ranges)) {
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
    this.checkOption(opt, true);
    let selector = this.opt.element + '[data-markjs]';
    if (this.opt.className) {
      selector += `.${this.opt.className}`;
    }
    this.log(`Removal selector "${selector}"`);
    this.iterator.forEachNode(this.filter.SHOW_ELEMENT, node => {
      this.unwrapMatches(node);
    }, node => {
      return DOMIterator.matches(node, selector) && !this.excluded(node);
    }, this.opt.done);
  }
}

$.fn.mark = function(sv, opt) {
  new Mark(this.get()).mark(sv, opt);
  return this;
};
$.fn.markRegExp = function(regexp, opt) {
  new Mark(this.get()).markRegExp(regexp, opt);
  return this;
};
$.fn.markRanges = function(ranges, opt) {
  new Mark(this.get()).markRanges(ranges, opt);
  return this;
};
$.fn.unmark = function(opt) {
  new Mark(this.get()).unmark(opt);
  return this;
};
$.fn.getVersion = function() {
  return '2.7.0';
};
var $$1 = $;

export { $$1 as default };
