/*!***************************************************
* advanced-mark.js v2.6.0
* https://github.com/angezid/advanced-mark.js
* MIT licensed
* Copyright (c) 2022–2024, angezid
* Based on 'mark.js', license https://git.io/vwTVl
*****************************************************/

class DOMIterator {
  constructor(ctx, opt) {
    this.ctx = ctx;
    this.opt = opt;
    this.map = new Map();
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
      ctx = Array.from(win.document.querySelectorAll(ctx));
    } else if (ctx.length >= 0) {
      ctx = Array.from(ctx);
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
  getIframeContents(iframe, successFn, errorFn) {
    try {
      const doc = iframe.contentWindow.document;
      if (doc) {
        this.map.set(iframe, 'ready');
        successFn({ iframe : iframe, context : doc });
      }
    } catch (e) {
      errorFn({ iframe : iframe, error : e });
    }
  }
  observeIframeLoad(ifr, successFn, errorFn) {
    if (this.map.has(ifr)) {
      return;
    }
    let id = null;
    const listener = () => {
      clearTimeout(id);
      ifr.removeEventListener('load', listener);
      this.getIframeContents(ifr, successFn, errorFn);
    };
    ifr.addEventListener('load', listener);
    this.map.set(ifr, true);
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
        if (this.isIframe(node) && !this.map.has(node)) {
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
            if (iframe && this.isIframe(node) && this.map.get(node) === 'ready') {
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
  create(terms) {
    const array = [];
    let index = 0;
    terms = terms.map(str => {
      if (this.opt.charSets) {
        str = str.replace(/(\\.)+|\[(?:[^\\\]]|(?:\\.))+\](?:[+*?]\??|\{[\d,]+\}\??)?/g, (m, gr) => {
          if (gr) return m;
          array.push(m);
          return '\x03' + index++ + '\x03';
        }).replace(/\\+(?=\[|\x03)/g, m => m.slice(1));
      }
      return '(' + this.createPattern(str) + ')';
    });
    const obj = this.createAccuracy(terms.join('|'));
    if (array.length) {
      obj.pattern = obj.pattern.replace(/\x03(\d+)\x03/g, (m, gr) => array[gr]);
    }
    return new RegExp(`${obj.lookbehind}(${obj.pattern})${obj.lookahead}`, `g${this.opt.caseSensitive ? '' : 'i'}`);
  }
  createPattern(str) {
    const wildcards = this.opt.wildcards !== 'disabled';
    str = str.replace(/\s+/g, ' ');
    if (wildcards) {
      str = this.createPlaceholders(str);
    }
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
  getJoinersPunctuation() {
    let str = this.preprocess(this.opt.ignorePunctuation);
    if (this.opt.ignoreJoiners) {
      str += '\\u00ad\\u200b\\u200c\\u200d';
    }
    return str;
  }
  setupIgnoreJoiners(str) {
    const reg = /((?:\\\\)+|\x02|\x03\d+\x03|\|)|\\?(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|.)(?=(\x02|\||$)|.)/g;
    return str.replace(reg, (m, gr1, gr2) => {
      return gr1 || typeof gr2 !== 'undefined' ? m : m + '\x00';
    });
  }
  createPlaceholders(str) {
    return str.replace(/(\\.)+|[?*]/g, (m, gr) => gr ? m : m === '?' ? '\x01' : '\x02')
      .replace(/\\+(?=[?*\x01\x02])/g, m => m.slice(1));
  }
  createWildcards(str) {
    const spaces = this.opt.wildcards === 'withSpaces',
      anyChar = spaces && this.opt.boundary ? '[^\x01]*?' : '[^]*?';
    return str.replace(/\x01/g, spaces ? '[^]?' : '\\S?').replace(/\x02/g, spaces ? anyChar : '\\S*');
  }
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
      'combinePatterns': Infinity,
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
  getSeachTerms(sv) {
    const search = typeof sv === 'string' ? [sv] : sv,
      separate = this.opt.separateWordSearch,
      array = [],
      termStats = {},
      split = str => {
        str.split(/ +/).forEach(word => add(word));
      },
      add = str => {
        if (str.trim() && !array.includes(str)) {
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
      boundary : boundary, str : '', ch : ch
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
      cb({
        text : obj.text,
        nodes: nodes,
        lastIndex: 0
      });
    });
  }
  getNodeInfo(prevNode, node, type, obj) {
    const start = obj.text.length,
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
      obj.str = '';
    }
    obj.text += text;
    return this.createInfo(prevNode, start, obj.text.length - offset, offset);
  }
  getRangesTextNodes(cb, lines) {
    const nodes = [],
      regex = /\n/g,
      newLines = [0],
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
        if (node.tagName.toLowerCase() === 'br') {
          newLines.push(len);
        }
        return false;
      }
      return !this.excluded(node.parentNode);
    }, () => {
      const dict = { text, nodes, lastIndex: 0 };
      if (lines) {
        newLines.push(len);
        dict.newLines = newLines;
      }
      cb(dict);
    });
  }
  getTextNodes(cb) {
    const nodes = [];
    this.iterator.forEachNode(this.filter.SHOW_TEXT, node => {
      nodes.push(node);
    }, node => {
      return !this.excluded(node.parentNode);
    }, () => {
      cb({ nodes, lastIndex: 0 });
    });
  }
  excluded(elem) {
    return this.nodeNames.includes(elem.nodeName.toLowerCase()) || DOMIterator.matches(elem, this.opt.exclude);
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
      nodeInfo = this.createInfo(retNode, type === 0 || type === 2 ? end : n.start + e, end, n.offset);
    if (type === 0) {
      n.node = markChild;
      return { mark, nodeInfo, increment : 0 };
    }
    const info = this.createInfo(markChild, type === 1 ? n.start : start, n.start + e, 0);
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
  createInfo(node, start, end, offset) {
    return { node, start, end, offset };
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
    const wrapAllRanges = this.opt.wrapAllRanges;
    if (wrapAllRanges) {
      while (i > 0 && dict.nodes[i].start > start) {
        i--;
      }
    }
    for (i; i < dict.nodes.length; i++) {
      if (i + 1 === dict.nodes.length || dict.nodes[i+1].start > start) {
        let n = dict.nodes[i];
        if ( !filterCb(n.node)) {
          break;
        }
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
  wrapGroups(node, match, regex, filterCb, eachCb) {
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
      regex.lastIndex = 0;
    } else if (match[0].length === 0) {
      this.setLastIndex(regex, end);
    }
    return node;
  }
  wrapGroupsAcross(dict, match, regex, filterCb, eachCb) {
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
          this.wrapRangeAcross(dict, start, end, node => {
            return filterCb(node, group, i);
          }, (node, groupStart) => {
            isWrapped = true;
            eachCb(node, i, groupStart);
          });
          if (isWrapped && end > lastIndex) {
            lastIndex = end;
          }
        }
      }
    }
    if (match[0].length === 0) {
      this.setLastIndex(regex, end);
    }
  }
  setLastIndex(regex, end) {
    const index = regex.lastIndex;
    regex.lastIndex = end > index ? end : end > 0 ? index + 1 : Infinity;
  }
  wrapSeparateGroups(regex, unused, filterCb, eachCb, endCb) {
    const across = this.opt.acrossElements,
      fn = across ? 'wrapGroupsAcross' : 'wrapGroups',
      execution = { abort : false },
      info = { execution : execution };
    let node, match, filterStart, eachStart, count = 0;
    const wrap = (obj) => {
      while ((match = regex.exec(across ? obj.text : obj.textContent)) !== null) {
        info.match = match;
        filterStart = eachStart = true;
        node = this[fn](obj, match, regex, (node, group, grIndex) => {
          info.matchStart = filterStart;
          info.groupIndex = grIndex;
          filterStart = false;
          return filterCb(node, group, info);
        }, (node, grIndex, groupStart) => {
          if (eachStart) {
            count++;
          }
          const eachInfo = {
            match : match,
            matchStart : eachStart,
            count : count,
            groupIndex : grIndex,
          };
          if (typeof groupStart !== 'undefined') {
            eachInfo.groupStart = groupStart;
          }
          eachCb(node, eachInfo);
          eachStart = false;
        });
        obj = node || obj;
        if (execution.abort) break;
      }
    };
    if (across) {
      this.getTextNodesAcross(dict => {
        wrap(dict);
      });
    } else {
      this.getTextNodes(dict => {
        dict.nodes.every(node => {
          wrap(node);
          return !execution.abort;
        });
      });
    }
    endCb(count);
  }
  wrapMatches(regex, ignoreGroups, filterCb, eachCb, endCb) {
    const index = ignoreGroups === 0 ? 0 : ignoreGroups + 1,
      execution = { abort : false },
      filterInfo = { execution : execution };
    let match, str, count = 0;
    this.getTextNodes(dict => {
      dict.nodes.every(node => {
        while ((match = regex.exec(node.textContent)) !== null) {
          if ((str = match[index]) === '') {
            regex.lastIndex++;
            continue;
          }
          filterInfo.match = match;
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
          node = this.wrapRange(node, start, end, node => {
            eachCb(node, {
              match : match,
              count : ++count
            });
          });
          regex.lastIndex = 0;
          if (execution.abort) break;
        }
        return !execution.abort;
      });
      endCb(count);
    });
  }
  wrapMatchesAcross(regex, ignoreGroups, filterCb, eachCb, endCb) {
    const index = ignoreGroups === 0 ? 0 : ignoreGroups + 1,
      execution = { abort : false },
      filterInfo = { execution : execution };
    let match, str, matchStart, count = 0;
    this.getTextNodesAcross(dict => {
      while ((match = regex.exec(dict.text)) !== null) {
        if ((str = match[index]) === '') {
          regex.lastIndex++;
          continue;
        }
        filterInfo.match = match;
        matchStart = true;
        let i = 0, start = match.index;
        while (++i < index) {
          if (match[i]) {
            start += match[i].length;
          }
        }
        this.wrapRangeAcross(dict, start, start + str.length, node => {
          filterInfo.matchStart = matchStart;
          matchStart = false;
          return filterCb(node, str, filterInfo);
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
    this.getRangesTextNodes(dict => {
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
          this.wrapRangeAcross(dict, start, end, node => {
            return filterCb(node, range, substr, index);
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
      this.log(`Valid ranges: ${JSON.stringify(array.filter(range => !skipped.includes(range)))}`);
      endCb(count, logs);
    }, lines);
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
    this.opt = opt;
    let totalMarks = 0,
      matchesSoFar = 0,
      across = this.opt.acrossElements,
      fn = this.opt.separateGroups ? 'wrapSeparateGroups' : across ? 'wrapMatchesAcross' : 'wrapMatches';
    if ( !regexp.global && !regexp.sticky) {
      let splits = regexp.toString().split('/');
      regexp = new RegExp(regexp.source, 'g' + splits[splits.length-1]);
      this.log('RegExp is recompiled - it must have a `g` flag', 'warn');
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
    this.opt = opt;
    const { terms, termStats } = this.getSeachTerms(sv);
    if ( !terms.length) {
      this.opt.done(0, 0, termStats);
      return;
    }
    let index = 0,
      totalMarks = 0,
      totalMatches = 0,
      term,
      termMatches;
    const across = this.opt.acrossElements,
      fn = across ? 'wrapMatchesAcross' : 'wrapMatches',
      array = this.getRegExps(terms);
    const loop = ({ regex, regTerms }) => {
      this.log(`RegExp ${regex}`);
      this[fn](regex, 1, (node, _, filterInfo) => {
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
        const noMatches = regTerms.filter(term => termStats[term] === 0);
        if (noMatches.length) {
          this.opt.noMatch(noMatches);
        }
        if (++index < array.length) {
          loop(array[index]);
        } else {
          this.opt.done(totalMarks, totalMatches, termStats);
        }
      });
    };
    loop(array[0]);
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
  getRegExps(terms) {
    const creator = new RegExpCreator(this.opt),
      option = this.opt.combineBy || this.opt.combinePatterns,
      array = [];
    let num = 10,
      value;
    if (option === Infinity) {
      num = Math.pow(2, 31);
    } else if (Number.isInteger(option) && (value = parseInt(option)) > 0) {
      num = value;
    }
    for (let i = 0; i < terms.length; i += num) {
      const chunk = terms.slice(i, Math.min(i + num, terms.length));
      array.push({ regex : creator.create(chunk), regTerms : chunk });
    }
    return array;
  }
  markRanges(ranges, opt) {
    this.opt = opt;
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
    this.opt = opt;
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
  return '2.6.0';
};
var $$1 = $;

export { $$1 as default };
