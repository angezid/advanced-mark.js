import DOMIterator from './domiterator';
import RegExpCreator from './regexpcreator';

/**
 * Marks search terms in DOM elements
 * @example
 * new Mark(document.querySelector('.context')).mark('lorem ipsum');
 * @example
 * new Mark(document.querySelector('.context')).markRegExp(/lorem/gmi);
 * @example
 * new Mark('.context').markRanges([{start:10,length:0}]);
 */
class Mark {

  /**
   * @param {HTMLElement|HTMLElement[]|NodeList|string} ctx - The context DOM
   * element, an array of DOM elements, a NodeList or a selector
   */
  constructor(ctx) {
    /**
     * The context of the instance. Either a DOM element, an array of DOM
     * elements, a NodeList or a selector
     * @type {HTMLElement|HTMLElement[]|NodeList|string}
     * @access protected
     */
    this.ctx = ctx;
    /**
     * The array of node names which must be excluded from search
     * @type {array}
     * @access protected
     */
    this.nodeNames = ['script', 'style', 'title', 'head', 'html'];
  }

  /**
   * @typedef Mark~commonOptions
   * @type {object.<string>}
   * @property {object} [window] - A window object
   * @property {string} [element="mark"] - HTML element tag name
   * @property {string} [className] - An optional class name
   * @property {string[]} [exclude] - An array with exclusion selectors.
   * Elements matching those selectors will be ignored
   * @property {boolean} [iframes=false] - Whether to search inside iframes
   * @property {number} [iframesTimeout=5000] - Maximum ms to wait for a load
   * event of an iframe
   * @property {boolean} [acrossElements=false] - Whether to find matches across HTML elements.
   * By default, only matches within single HTML elements will be found
   * @property {Mark~markEachCallback} [each]
   * @property {Mark~markNoMatchCallback} [noMatch]
   * @property {Mark~commonDoneCallback} [done]
   * @property {boolean} [debug=false] - Whether to log messages
   * @property {object} [log=window.console] - Where to log messages (only if debug is true)
   */

  /**
   * Options defined by the user. They will be initialized from one of the
   * public methods. See {@link Mark#mark}, {@link Mark#markRegExp},
   * {@link Mark#markRanges} and {@link Mark#unmark} for option properties.
   * @type {object}
   * @param {object} [val] - An object that will be merged with defaults
   * @access protected
   */
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
    // shortens a lengthy name
    this.filter = win.NodeFilter;
    // this empty text node used to simplify code
    this.empty = win.document.createTextNode('');
  }

  get opt() {
    return this._opt;
  }

  /**
   * An instance of DOMIterator
   * @type {DOMIterator}
   * @access protected
   */
  get iterator() {
    // always return new instance in case there were option changes
    return new DOMIterator(this.ctx, this.opt);
  }

  /**
   * Logs a message if log is enabled
   * @param {string} msg - The message to log
   * @param {string} [level="debug"] - The log level, e.g. <code>warn</code>
   * <code>error</code>, <code>debug</code>
   * @access protected
   */
  log(msg, level = 'debug') {
    if (this.opt.debug) {
      const log = this.opt.log;
      if (typeof log === 'object' && typeof log[level] === 'function') {
        log[level](`mark.js: ${msg}`);
      }
    }
  }

  /**
   * @typedef Mark~logObject
   * @type {object}
   * @property {string} message - The message
   * @property {object} obj - The object
   */

  /**
   * Logs errors and info
   * @param {array} array - The array of objects
   */
  report(array) {
    array.forEach(item => {
      this.log(`${item.text} ${JSON.stringify(item.obj)}`, item.level || 'debug');
      if ( !item.skip) {
        this.opt.noMatch(item.obj);
      }
    });
  }

  /**
   * Checks the validity of cache objects (mark instance can calls several methods with different setting
   * of the cacheTextNodes option, which breaks the relation of the DOM nodes and cache object nodes)
   * @param {object} [opt] - Optional options object
   * @return {object}
   */
  checkOption(opt, del) {
    this.opt = opt;
    let dict = this.cacheDict,
      clear = true;

    if (dict) {
      // It allows using cache object if the type and cacheTextNodes option doesn't change
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

  /**
   * Splits string into separate words if 'separateWordSearch' option has value 'true' but,
   * if it has string value 'preserveTerms', prevents splitting terms surrounding by double quotes.
   * Removes duplicate or empty entries and sort by the length in descending order.
   * It also initializes termStats object.
   * @param {string|string[]} sv - Search value, either a string or an array of strings
   * @return {object}
   * @access protected
   */
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
          // initializes term property
          termStats[str] = 0;
        }
      };

    search.forEach(str => {
      if (separate) {
        if (separate === 'preserveTerms') {
          // allows highlight quoted terms no matter how many quotes it contains on each side,
          // e.g. ' ""term"" ' or ' """"term" '
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

  /**
   * Check if a value is a number
   * @param {number|string} value - the value to check;
   * numeric strings allowed
   * @return {boolean}
   * @access protected
   */
  isNumeric(value) {
    // http://stackoverflow.com/a/16655847/145346
    // eslint-disable-next-line eqeqeq
    return Number(parseFloat(value)) == value;
  }

  /**
   * Filters valid ranges, sorts and, if wrapAllRanges option is false, filters out nesting/overlapping ranges
   * @param {Mark~setOfRanges} array - unprocessed raw array
   * @param {Mark~logObject} logs - The array of logs objects
   * @return {Mark~setOfRanges} - processed array with any invalid entries removed
   * @access protected
   */
  checkRanges(array, logs, min, max) {
    // a range object must have the start and length properties with numeric values
    // [{start: 0, length: 5}, ..]
    const level = 'error';

    // filters and sorts valid ranges
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
    // filters out nesting/overlapping ranges
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

  /**
   * @typedef Mark~blockElementsBoundaryObject
   * @type {object}
   * @property {array} [tagNames] - The array of custom tag names
   * @property {boolean} [extend] - Whether to extend the default boundary elements with custom elements
   * or set only custom elements to boundary type
   * @property {string} [char] - The custom separating char
   */
  /**
  * Sets type: 1 - separate by space, 2 - separate by boundary char with space(s)
  * @param {object} tags - The object containing HTML element tag names
  */
  setType(tags, boundary) {
    const custom = Array.isArray(boundary.tagNames) && boundary.tagNames.length;

    if (custom) {
      // normalizes custom elements names and adds to the tags object with boundary type value
      boundary.tagNames.forEach(name => tags[name.toLowerCase()] = 2);
    }
    // if not extend, the only custom tag names are set to a boundary type
    if ( !custom || boundary.extend) {
      // sets all tags value to the boundary
      for (const key in tags) {
        tags[key] = 2;
      }
    }
    tags['br'] = 3;
  }

  /**
   * @typedef Mark~nodeInfoAcross
   * @property {Text} node - The DOM text node
   * @property {number} start - The start index within the composite string
   * @property {number} end - The end index within the composite string
   * @property {number} offset - The offset is used to correct position if space or string
   * was added to end of composite string after this node textContent
   * @property {number} startOffset - The sum of all offsets that were added
   * to the composite string before this node. It has a negative value.
   */

  /**
   * @typedef Mark~getTextNodesAcrossDict
   * @type {object.<string>}
   * @property {string} text - The composite string of all text nodes
   * @property {Mark~nodeInfoAcross[]} nodes - An array of node info objects
   * @property {number} lastIndex - The property used to store the nodes last index
   * @property {number} lastTextIndex - The property used to store the composite string last index
   */

  /**
   * Callback
   * @callback Mark~getTextNodesAcrossCallback
   * @param {Mark~getTextNodesAcrossDict}
   */
  /**
   * Calls the callback with an object containing all text nodes (including iframe text nodes)
   * with start and end positions and the composite value of them (string)
   * @param {Mark~getTextNodesAcrossCallback} cb - Callback
   * @access protected
   */
  getTextNodesAcross(cb) {
    // uses cache dict if it's already built
    if (this.opt.cacheTextNodes && this.cacheDict) {
      // it's only requires reset two indexes
      this.cacheDict.lastIndex = 0;
      this.cacheDict.lastTextIndex = 0;

      cb(this.cacheDict);
      return;
    }

    // a space or string can be safely added to the end of a text node when two text nodes
    // are 'separated' by element with one of these names
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

    this.iterator.forEachNode(this.filter.SHOW_ELEMENT | this.filter.SHOW_TEXT, node => { // each
      if (prevNode) {
        nodes.push(this.getNodeInfo(prevNode, node, type, obj));
      }
      type = null;
      prevNode = node;

    }, node => { // filter
      if (node.nodeType === 1) { // element
        tempType = tags[node.nodeName.toLowerCase()];

        if (tempType === 3) { // br element
          obj.str += '\n';
        }

        if ( !type || tempType === priorityType) {
          type = tempType;
        }
        return false;
      }
      return !this.excluded(node.parentNode);

    }, () => { // done
      // processes the last node
      if (prevNode) {
        nodes.push(this.getNodeInfo(prevNode, null, type, obj));
      }
      cb(this.createDict(obj.text, nodes, true));
    });
  }

  /**
   * Creates object
   * @param {Text} prevNode - The previous DOM text node
   * @param {Text} node - The current DOM text node
   * @param {number|null} type - define how to separate the previous and current text nodes textContent;
   * type is null when nodes doesn't separated by block elements
   * @param {object} obj - The auxiliary object to pass multiple parameters to the method
   */
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
        // searches for the first parent of the previous text node that met condition
        // and checks does they have the same parent or the parent contains the current text node
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

  /**
   * @typedef Mark~nodeInfo
   * @property {Text} node - The DOM text node
   * @property {number} start - The start index within the composite string
   * @property {number} end - The end index within the composite string
   * @property {number} offset - This property is required for compatibility with [Mark~nodeInfoAcross]
   * for {@link Mark#markRanges}
   */

  /**
   * @typedef Mark~getTextNodesDict
   * @type {object.<string>}
   * @property {string} text - The composite value of all text nodes
   * @property {Mark~nodeInfo[]} nodes - The array of objects
   * @property {number} lastIndex - The property used to store the nodes the last index
   * @property {number} lastTextIndex - This property is required for compatibility with [Mark~getTextNodesAcrossDict]
   * for {@link Mark#markRanges}
   */

  /**
   * Callback
   * @callback Mark~getTextNodesCallback
   * @param {Mark~getTextNodesDict}
   */
  /**
   * Calls the callback with an object containing all text nodes (including iframe text nodes)
   * with start and end positions and the composite value of them (string)
   * @param {Mark~getTextNodesCallback} cb - Callback
   * @access protected
   */
  getTextNodes(cb) {
    // uses cache cacheDict if it's already built
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

    this.iterator.forEachNode(show, node => { // each
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

    }, node => { // filter
      if (lines && node.nodeType === 1) {
        if (node.tagName === 'BR') {
          newLines.push(len);
        }
        return false;
      }
      return !this.excluded(node.parentNode);

    }, () => { // done
      const dict = this.createDict(text, nodes, false);

      if (lines) {
        newLines.push(len);
        dict.newLines = newLines;
      }
      cb(dict);
    });
  }

  /**
   * Creates dict object
   * @param {string} text - The composite string
   * @param {Mark~nodeInfo[]|Mark~nodeInfoAcross[]} nodes - The array of info objects
   * @param {boolean} across - Indicate that cache dict type
   */
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

  /**
   * Checks if an element matches any of the specified exclude selectors.
   * @param {HTMLElement} elem - The element to check
   * @return {boolean}
   * @access protected
   */
  excluded(elem) {
    // it's faster to check if an array contains the node name than a selector in 'DOMIterator.matches()'
    // also it allows using a string of selectors instead of an array with the 'exclude' option
    return this.nodeNames.indexOf(elem.nodeName.toLowerCase()) !== -1 || DOMIterator.matches(elem, this.opt.exclude);
  }

  /**
   * Splits the text node into two or three nodes and wraps the necessary node or wraps the input node
   * Creates info object(s) related to the newly created node(s) and inserts into dict.nodes or replace an existing one
   * It doesn't create empty sibling text nodes when `Text.splitText()` method splits a text node at the start/end
   * @param {Mark~wrapRangeInsertDict} dict - The dictionary
   * @param {object} n - The currently processed info object
   * @param {number} s - The position where to start wrapping
   * @param {number} e - The position where to end wrapping
   * @param {number} start - The start position of the match
   * @param {number} index - The current index of the processed object
   * @return {object} Returns object containing the mark element, the splitted text node
   * that will appear after the wrapped text node, and increment number
   */
  wrapRangeInsert(dict, n, s, e, start, index) {
    const ended = e === n.node.textContent.length,
      end = n.end;
    // type: 0 - whole text node, 1 - from the start, 2 - to the end, 3 - between
    let type = 1,
      splitIndex = e,
      node = n.node;
    // prevents creating empty sibling text nodes at the start/end of a text node
    if (s !== 0) {
      node = node.splitText(s);
      splitIndex = e - s;
      type = ended ? 2 : 3;

    } else if (ended) { // whole
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
    // inserts new node(s) info in dict.nodes depending where a range is located in a text node
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

  /**
   * Creates object
   * @param {Text} node - The DOM text node
   * @param {number} start - The position where to start wrapping
   * @param {number} end - The position where to end wrapping
   * @param {number} offset - The length of space/string that is added to end of composite string
   * after this node textContent
   * @param {number} startOffset - The sum of all offsets that were added before this node
   */
  createInfo(node, start, end, offset, startOffset) {
    return { node, start, end, offset, startOffset };
  }

  /**
   * Splits the text node into two or three nodes and wraps the necessary node or wraps the input node
   * It doesn't create empty sibling text nodes when `Text.splitText()` method splits a text node at the start/end
   * @param {Text} node - The DOM text node
   * @param {number} start - The position where to start wrapping
   * @param {number} end - The position where to end wrapping
   * @param {Mark~wrapRangeEachCallback} eachCb - Each callback
   * @return {Text}
   * @access protected
   */
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

  /**
   * Wraps the new element with the necessary attributes around text node
   * @param {Text} node - The DOM text node
   * @return {HTMLElement} Returns the created DOM node
   */
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

  /**
   * @typedef Mark~wrapRangeAcrossDict
   * @type {object.<string>}
   * @property {string} text - The composite string of all text nodes
   * @property {Mark~nodeInfoAcross[]} nodes - An array of node info objects
   * @property {number} lastIndex - The property used to store the nodes last index
   * @property {number} lastTextIndex - The property used to store the string last index
   */
  /**
   * Each callback
   * @callback Mark~wrapRangeAcrossEachCallback
   * @param {HTMLElement} node - The wrapped DOM element
   * @param {boolean} rangeStart - Indicate the start of the current range
   */

  /**
   * Filter callback
   * @callback Mark~wrapRangeAcrossFilterCallback
   * @param {object} n - The current node info object of the dict.nodes
   */
  /**
   * Determines matches by start and end positions using the text node dictionary
   * and calls {@link Mark#wrapRange} or {@link Mark#wrapRangeInsert} to wrap them
   * @param {Mark~wrapRangeAcrossDict} dict - The dictionary
   * @param {number} start - The start index of the match
   * @param {number} end - The end index of the match
   * @param {Mark~wrapRangeAcrossFilterCallback} filterCb - Filter callback
   * @param {Mark~wrapRangeAcrossEachCallback} eachCb - Each callback
   * @access protected
   */
  wrapRangeAcross(dict, start, end, filterCb, eachCb) {
    // dict.lastIndex stores the last node index to avoid iteration from the beginning
    let i = dict.lastIndex,
      rangeStart = true;
    // 'cacheTextNodes' option must enable 'wrapAllRanges' code here
    const wrapAllRanges = this.opt.wrapAllRanges || this.opt.cacheTextNodes;

    if (wrapAllRanges) {
      // finds the starting index in case of nesting/overlapping
      while (i > 0 && dict.nodes[i].start > start) {
        i--;
      }

    } else if (start < dict.lastTextIndex) {
      // case of overlapping match; can occurs with separateGroups option and capturing group inside assertion
      return;
    }

    for (i; i < dict.nodes.length; i++) {
      if (i + 1 === dict.nodes.length || dict.nodes[i+1].start > start) {
        let n = dict.nodes[i];

        if ( !filterCb(n)) break;

        // map range from dict.text to text node
        const s = start - n.start,
          e = (end > n.end ? n.end : end) - n.start;

        // prevents exception if something went wrong, useful for debugging purpose
        if (s >= 0 && e > s) {
          if (wrapAllRanges) {
            const obj = this.wrapRangeInsert(dict, n, s, e, start, i);
            n = obj.nodeInfo;
            eachCb(obj.mark, rangeStart);

          } else {
            n.node = this.wrapRange(n.node, s, e, node => {
              eachCb(node, rangeStart);
            });
            // sets the new text node start index in the case of subsequent matches in the same text node
            n.start += e;
            // sets the last text index
            dict.lastTextIndex = n.start;
          }
          rangeStart = false;
        }

        if (end > n.end) {
          // the range extends to the next text node
          start = n.end + n.offset;
        } else {
          break;
        }
      }
    }
    // sets the last index
    dict.lastIndex = i;
  }

  /**
   * @typedef Mark~paramsObject
   * @type {object}
   * @property {RegExp} regex - The regular expression to be searched for
   * @property {array} groups - The array containing main groups indexes
   */

  /**
   * Filter callback before each wrapping
   * @callback Mark~wrapGroupsFilterCallback
   * @param {string} group - The current group matching string
   * @param {Text} node - The text node where the match occurs
   * @param {number} index - The current group index
   */
  /**
   * Callback for each wrapped element
   * @callback Mark~wrapGroupsEachCallback
   * @param {HTMLElement} element - The marked DOM element
   * @param {number} index - The current group index
   */

  /**
   * Wraps match groups
   * @param {Text} node - The text node where the match occurs
   * @param {array} match - The result of RegExp exec() method
   * @param {Mark~paramsObject} params - The object containing two properties
   * @param {Mark~wrapGroupsFilterCallback} filterCb - Filter callback
   * @param {Mark~wrapGroupsEachCallback} eachCb - Each callback
   */
  wrapGroups(node, match, params, filterCb, eachCb) {
    let startIndex = match.index,
      isWrapped = false,
      group, start;

    // the only way to avoid nested group being searched by the indexOf method
    // is to parse the RegExp pattern and collect main groups indexes
    params.groups.forEach(index => {
      group = match[index];

      if (group) {
        start = node.textContent.indexOf(group, startIndex);

        if (start !== -1) {
          if (filterCb(node, group, index)) {
            node = this.wrapRange(node, start, start + group.length, node => {
              eachCb(node, index);
            });
            // resets the startIndex to start searching the beginning of new text node
            startIndex = 0;
            isWrapped = true;

          } else {
            // group is filtered out, so start next search from the group end
            startIndex = start + group.length;
          }
        }
      }
    });
    // resets the lastIndex only when any of group is wrapped (to avoid infinite loop)
    if (isWrapped) {
      params.regex.lastIndex = 0;
    }
    return node;
  }

  /**
   * Filter callback before each wrapping
   * @callback Mark~wrapGroupsAcrossFilterCallback
   * @param {string} group - The current group matching string
   * @param {Text} node - The text node where the match occurs or is part of the match
   * @param {number} index - The current group index
   */
  /**
   * Callback for each wrapped element
   * @callback Mark~wrapGroupsAcrossEachCallback
   * @param {HTMLElement} element - The marked DOM element
   * @param {boolean} groupStart - Indicate the start of a group
   * @param {number} index - The current group index
   */

  /**
   * Wraps match groups across elements
   * @param {Mark~wrapGroupsAcrossDict} dict - The dictionary
   * @param {array} match - The result of RegExp exec() method
   * @param {Mark~paramsObject} params - The object containing two properties
   * @param {Mark~wrapGroupsAcrossFilterCallback} filterCb - Filter callback
   * @param {Mark~wrapGroupsAcrossEachCallback} eachCb - Each callback
   */
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

    //a way to mark nesting groups, it first wraps the whole match as a group 0
    if (this.opt.wrapAllRanges) {
      wrap(0, text.length, 0);
    }

    // the only way to avoid nested group being searched by the indexOf method
    // is to parse the RegExp pattern and collect main groups indexes
    params.groups.forEach(index => {
      group = match[index];

      if (group) {
        // this approach only reliable with adjacent groups; unwanted group(s) can be easily filtered out
        start = text.indexOf(group, startIndex);

        if (start !== -1) {
          end = start + group.length;
          wrap(start, end, index);
          startIndex = end;
        }
      }
    });
  }

  /**
   * Filter callback before each wrapping
   * @callback Mark~wrapGroupsDFlagFilterCallback
   * @param {Text} node - The text node where the match occurs
   * @param {string} group - The current group matching string
   * @param {number} i - The current group index
   */
  /**
   * Callback for each wrapped element
   * @callback Mark~wrapGroupsDFlagEachCallback
   * @param {HTMLElement} element - The marked DOM element
   * @param {number} i - The current group index
   */

  /**
   * Wraps match groups with RegExp.hasIndices
   * @param {Text} node - The text node where the match occurs
   * @param {array} match - The result of RegExp exec() method
   * @param {Mark~paramsObject} params - The object containing one property
   * @param {Mark~wrapGroupsDFlagCallback} filterCb - Filter callback
   * @param {Mark~wrapGroupsDFlagEachCallback} eachCb - Each callback
   */
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
        //it prevents marking nested group - parent group is already marked
        if (start >= lastIndex) {
          end = match.indices[i][1];

          if (filterCb(node, group, i)) {
            // when a group is wrapping, a text node is split at the end index,
            // so to correct the start & end indexes of a new text node, subtract
            // the end index of the last wrapped group (offset)
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
    // resets the lastIndex when at least one group is wrapped (prevents infinite loop)
    if (isWrapped) {
      params.regex.lastIndex = 0;

    // when the match has zero length, we need to control the RegExp lastIndex
    } else if (match[0].length === 0) {
      this.setLastIndex(params.regex, end);
    }
    return node;
  }

  /**
   * Filter callback before each wrapping
   * @callback Mark~wrapGroupsDFlagAcrossFilterCallback
   * @param {Text} node - The text node where the match occurs or is part of the match
   * @param {string} group - The current group matching string
   * @param {number} i - The current group index
   */
  /**
   * Callback for each wrapped element
   * @callback Mark~wrapGroupsDFlagAcrossEachCallback
   * @param {HTMLElement} element - The marked DOM element
   * @param {boolean} groupStart - Indicate the start of a group
   * @param {number} i - The current group index
   */

  /**
   * Wraps match groups with RegExp.hasIndices across elements
   * @param {Mark~wrapGroupsDFlagAcrossDict} dict - The dictionary
   * @param {array} match - The result of RegExp exec() method
   * @param {Mark~paramsObject} params - The empty object
   * @param {Mark~wrapGroupsDFlagAcrossFilterCallback} filterCb - Filter callback
   * @param {Mark~wrapGroupsDFlagAcrossEachCallback} eachCb - Each callback
   */
  wrapGroupsDFlagAcross(dict, match, params, filterCb, eachCb) {
    let lastIndex = 0,
      i = 0,
      group, start, end = 0,
      isWrapped;

    while (++i < match.length) {
      group = match[i];

      if (group) {
        start = match.indices[i][0];
        // the wrapAllRanges option allows wrapping nested group(s),
        // the 'start >= lastIndex' prevents wrapping nested group(s) - the parent group is already wrapped
        if (this.opt.wrapAllRanges || start >= lastIndex) {
          end = match.indices[i][1];
          isWrapped = false;

          this.wrapRangeAcross(dict, start, end, obj => {
            return filterCb(obj, group, i);

          }, (node, groupStart) => {
            isWrapped = true;
            eachCb(node, groupStart, i);
          });
          // group may be filtered out
          if (isWrapped && end > lastIndex) {
            lastIndex = end;
          }
        }
      }
    }
    // when the match has zero length, we need to control the RegExp lastIndex
    if (match[0].length === 0) {
      this.setLastIndex(params.regex, end);
    }
  }

  /**
   * When processing zero length match, there is a need to set the RegExp lastIndex depending on conditions.
   * It's necessary to avoid infinite loop and set position from which to start the next match
   * @param {RegExp} regex - The regular expression to be searched for
   * @param {number} end - The end index of the last processed group
   */
  setLastIndex(regex, end) {
    const index = regex.lastIndex;
    // end > index - case when a capturing group is inside positive lookahead assertion
    // end > 0 - case when a match is filtered out or a capturing group is inside positive lookbehind assertion
    regex.lastIndex = end > index ? end : end > 0 ? index + 1 : Infinity;
  }

  /**
   * Parses the RegExp pattern and collects main groups (children of the group[0]) indexes
   * @param {RegExp} regex - The regular expression to be searched for
   * @return {array} groups - The array containing main groups indexes
   */
  collectGroupIndexes(regex) {
    let groups = [], stack = [],
      index = 0, brackets = 0,
      str = regex.source, rm,
      // any escaped char | charSet | start of a capturing groups '(?<, (' | rest open parentheses | close parenthesis
      reg = /(?:\\.)+|\[(?:[^\\\]]|(?:\\.))+\]|(\(\?<(?![=!])|\((?!\?))|(\()|(\))/g;

    while ((rm = reg.exec(str)) !== null) {
      if (rm[1]) { // the start of a capturing group
        stack.push(1);
        index++;

        if (brackets++ === 0) {
          groups.push(index);
        }
      } else if (rm[2]) { // an open parenthesis
        stack.push(0);

      } else if (rm[3] && stack.pop()) { // a close parenthesis
        brackets--;
      }
    }
    return groups;
  }

  /**
   * @typedef Mark~filterInfoObject
   * @type {object}
   * @property {array} match - The result of RegExp exec() method
   * @property {boolean} matchStart - Indicate the start of match. It's only available
   * with the 'acrossElements' option
   * @property {number} groupIndex - The group index. It's only available
   * with 'separateGroups' option
   * @property {object} execution - The helper object for early abort. Contains
   * boolean 'abort' property.
   * @property {number} offset - With the 'acrossElements' option: the length
   * of spaces/strings that were added to the composite string so far.
   * Without this option: the absolute start index of a text node in joined contexts.
   * It is necessary to translate the local node indexes to the absolute ones.
   */
  /**
   * @typedef Mark~eachInfoObject
   * @type {object}
   * @property {array} match - The result of RegExp exec() method
   * @property {boolean} matchStart - Indicate the start of match. It's only available
   * with the 'acrossElements' option
   * @property {number} count - The current number of matches
   * @property {number} groupIndex - The index of current match group. It's only
   * available with 'separateGroups' option
   * @property {boolean} groupStart - Indicate the start of group. It's only
   * available with both 'acrossElements' and 'separateGroups' options
   */

  /**
   * Group filter callback before each wrapping
   * @callback Mark~wrapSeparateGroupsFilterCallback
   * @param {Text} node - The text node where the match occurs
   * @param {string} group - The matching string of the current group
   * @param {Mark~filterInfoObject} info - The object containing the match information
   */
  /**
   * Callback for each wrapped element
   * @callback Mark~wrapSeparateGroupsEachCallback
   * @param {HTMLElement} element - The marked DOM element
   * @param {Mark~eachInfoObject} - The object containing the match information
   */
  /**
   * Callback on end
   * @callback Mark~wrapSeparateGroupsEndCallback
   * @param {number} count - The number of matches
   */

  /**
   * Wraps match capturing groups
   * @param {RegExp} regex - The regular expression to be searched for
   * @param {number} unused
   * @param {Mark~wrapSeparateGroupsFilterCallback} filterCb - Filter callback
   * @param {Mark~wrapSeparateGroupsEachCallback} eachCb - Each callback
   * @param {Mark~wrapSeparateGroupsEndCallback} endCb
   * @access protected
   */
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

          node = this[fn](node, match, params, (node, group, grIndex) => { // filter
            info.matchStart = filterStart;
            info.groupIndex = grIndex;
            filterStart = false;
            return filterCb(node, group, info);

          }, (node, grIndex) => { // each
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
        // breaks loop on custom abort
        return !execution.abort;
      });
      endCb(count);
    });
  }

  /**
   * Filter callback before each wrapping
   * @callback Mark~wrapSeparateGroupsAcrossFilterCallback
   * @param {Text} node - The text node where the match occurs or is part of the match
   * @param {string} group - The matching string of the current group
   * @param {Mark~filterInfoObject} info - The object containing the match information
   */
  /**
   * Callback for each wrapped element
   * @callback Mark~wrapSeparateGroupsAcrossEachCallback
   * @param {HTMLElement} node - The marked DOM element
   * @param {Mark~eachInfoObject} - The object containing the match information
   */
  /**
   * Callback on end
   * @callback Mark~wrapSeparateGroupsAcrossEndCallback
   * @param {number} count - The number of all matches
   */
  /**
   * Wraps match capturing groups across elements
   * @param {RegExp} regex - The regular expression to be searched for
   * @param {number} unused
   * @param {Mark~wrapSeparateGroupsAcrossFilterCallback} filterCb - Filter callback
   * @param {Mark~wrapSeparateGroupsAcrossEachCallback} eachCb - Each callback
   * @param {Mark~wrapSeparateGroupsAcrossEndCallback} endCb
   * @access protected
   */
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

        this[fn](dict, match, params, (obj, group, grIndex) => { // filter
          info.matchStart = filterStart;
          info.groupIndex = grIndex;
          info.offset = obj.startOffset;
          filterStart = false;
          return filterCb(obj.node, group, info);

        }, (node, groupStart, grIndex) => { // each
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

  /**
   * Filter callback before each wrapping
   * @callback Mark~wrapMatchesFilterCallback
   * @param {Text} node - The text node where the match occurs
   * @param {string} str - The matching string
   * @param {Mark~filterInfoObject} filterInfo - The object containing the match information
   */
  /**
   * Callback for each wrapped element
   * @callback Mark~wrapMatchesEachCallback
   * @param {HTMLElement} element - The marked DOM element
   * @param {Mark~eachInfoObject} eachInfo - The object containing the match information
   */
  /**
   * Callback on end
   * @callback Mark~wrapMatchesEndCallback
   * @param {number} count - The number of all matches
   */

  /**
   * Wraps the instance element and class around matches within single HTML elements in all contexts
   * @param {RegExp} regex - The regular expression to be searched for
   * @param {number} ignoreGroups - A number of RegExp capturing groups to ignore from the beginning of a match
   * @param {Mark~wrapMatchesFilterCallback} filterCb - Filter callback
   * @param {Mark~wrapMatchesEachCallback} eachCb - Each callback
   * @param {Mark~wrapMatchesEndCallback} endCb
   * @access protected
   */
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
          // calculates the start index inside node.textContent
          let i = 0, start = match.index;
          while (++i < index) {
            if (match[i]) { // allows any ignore group to be undefined
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

            // matches the whole text node
            if (obj.increment === 0) break;

            // corrects the current index because new info object(s) were inserted into dict.nodes
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
          // with 'g' flag the lastIndex is required resetting; without 'g' flag it resets internally.
          regex.lastIndex = 0;

          if (execution.abort) break;
        }
        if (execution.abort) break;
      }
      endCb(count);
    });
  }

  /**
   * Filter callback before each wrapping
   * @callback Mark~wrapMatchesAcrossFilterCallback
   * @param {Text} node - The text node where the match occurs or is part of the match
   * @param {string} str - The matching string
   * @param {Mark~filterInfoObject} filterInfo - The object containing the match information
   */
  /**
   * Callback for each wrapped element
   * @callback Mark~wrapMatchesAcrossEachCallback
   * @param {HTMLElement} element - The marked DOM element
   * @param {Mark~eachInfoObject} - The object containing the match information
   */

  /**
   * Callback on end
   * @callback Mark~wrapMatchesAcrossEndCallback
   * @param {number} count - The number of all matches
   */
  /**
   * Wraps the instance element and class around matches across all HTML elements in all contexts
   * @param {RegExp} regex - The regular expression to be searched for
   * @param {number} ignoreGroups - A number of RegExp capturing groups to ignore from the beginning of a match
   * @param {Mark~wrapMatchesAcrossFilterCallback} filterCb - Filter callback
   * @param {Mark~wrapMatchesAcrossEachCallback} eachCb - Each callback
   * @param {Mark~wrapMatchesAcrossEndCallback} endCb
   * @access protected
   */
  wrapMatchesAcross(regex, ignoreGroups, filterCb, eachCb, endCb) {
    const index = ignoreGroups === 0 ? 0 : ignoreGroups + 1,
      execution = { abort : false },
      filterInfo = { execution : execution };

    let match, str, matchStart, count = 0;

    this.getTextNodesAcross(dict => {
      while ((match = regex.exec(dict.text)) !== null && (str = match[index]) !== '') {
        filterInfo.match = match;
        matchStart = true;

        // calculates the start index inside dict.text
        let i = 0, start = match.index;
        while (++i < index) {
          if (match[i]) { // allows any ignore group to be undefined
            start += match[i].length;
          }
        }

        this.wrapRangeAcross(dict, start, start + str.length, obj => { // filter
          filterInfo.matchStart = matchStart;
          filterInfo.offset = obj.startOffset;
          matchStart = false;
          return filterCb(obj.node, str, filterInfo);

        }, (node, mStart) => { // each
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

  /**
   * Callback for each wrapped element
   * @callback Mark~wrapRangesEachCallback
   * @param {HTMLElement} element - The marked DOM element
   * @param {Mark~rangeObject} range - the current range object; the start and length values can be
   * modified if they are not numeric integers
   * @param {Mark~rangeInfoObject} rangeInfo - The object containing the range information
   */
  /**
   * Filter callback before each wrapping
   * @callback Mark~wrapRangesFilterCallback
   * @param {Text} node - The text node which includes the range or is part of the range
   * @param {Mark~rangeObject} range - the current range object
   * @param {string} substr - string extracted from the matching range
   * @param {number} index - The current range index ???
   */

  /**
   * Callback on end
   * @callback Mark~wrapRangesEndCallback
   * @param {number} count - The number of wrapped ranges
   * @param {Mark~logObject[]} logs - The array of objects
   */
  /**
   * Wraps the indicated ranges across all HTML elements in all contexts
   * @param {Mark~setOfRanges} ranges
   * @param {Mark~wrapRangesFilterCallback} filterCb
   * @param {Mark~wrapRangesEachCallback} eachCb
   * @param {Mark~wrapRangesEndCallback} endCb
   * @access protected
   */
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
          // with wrapAllRanges option, there can be several report of limited ranges
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
          this.wrapRangeAcross(dict, start, end, obj => {    // filter
            return filterCb(obj.node, range, substr, index);

          }, (node, rangeStart) => {    // each
            if (rangeStart) {
              count++;
            }
            eachCb(node, range, {
              matchStart : rangeStart,
              count : count
            });
          });
        } else {
          // whitespace only; even if wrapped it is not visible
          logs.push({ text : 'Skipping whitespace only range: ', obj : range, level });
          skipped.push(range);
        }
      });

      this.log(`Valid ranges: ${JSON.stringify(array.filter(range => skipped.indexOf(range) === -1))}`);
      endCb(count, logs);
    });
  }

  /**
   * Unwraps the specified DOM node with its content (text nodes or HTML)
   * without destroying possibly present events (using innerHTML) and normalizes text nodes
   * @param {HTMLElement} node - The DOM node to unwrap
   * @access protected
   */
  unwrapMatches(node) {
    const parent = node.parentNode,
      first = node.firstChild;

    if (node.childNodes.length === 1) {
      // unwraps and normalizes text nodes
      if (first.nodeType === 3) {
        // the most common case - mark element with child text node
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
        // most likely is a nested mark element or modified by user element
        parent.replaceChild(node.firstChild, node);
      }

    } else {
      if ( !first) {
        // an empty mark element
        parent.removeChild(node);

      } else {
        // most likely is a nested mark element(s) with sibling text node(s) or modified by user element(s)
        let docFrag = this.opt.window.document.createDocumentFragment();
        while (node.firstChild) {
          docFrag.appendChild(node.removeChild(node.firstChild));
        }
        parent.replaceChild(docFrag, node);
      }
      parent.normalize();
    }
  }

  /**
   * Callback to filter matches
   * @callback Mark~markRegExpFilterCallback
   * @param {Text} node - The text node which includes the match or with acrossElements option can be part of the match
   * @param {string} match - The matching string:
   * 1) without 'ignoreGroups' and 'separateGroups' options - the whole match.
   * 2) with 'ignoreGroups' option - the match[ignoreGroups+1] group matching string.
   * 3) with 'separateGroups' option - the current group matching string
   * @param {number} matchesSoFar - The number of wrapped matches so far
   * @param {Mark~filterInfoObject} filterInfo - The object containing the match information.
   */
  /**
   * Callback for each marked element
   * @callback Mark~markRegExpEachCallback
   * @param {HTMLElement} element - The marked DOM element
   * @param {Mark~eachInfoObject} eachInfo - The object containing the match information.
   */
  /**
   * Callback if there were no matches
   * @callback Mark~markRegExpNoMatchCallback
   * @param {RegExp} regexp - The regular expression
   */

  /**
   * These options also include the common options from {@link Mark~commonOptions}
   * @typedef Mark~markRegExpOptions
   * @type {object.<string>}
   * @property {number} [ignoreGroups=0] - A number of RegExp capturing groups to ignore from the beginning of a match
   * @property {boolean} [separateGroups] - Whether to mark RegExp capturing groups instead of whole match
   * @property {Mark~markRegExpNoMatchCallback} [noMatch]
   * @property {Mark~markRegExpFilterCallback} [filter]
   * @property {Mark~markRegExpEachCallback} [each]
   */
  /**
   * Marks a custom regular expression
   * @param {RegExp} regexp - The regular expression
   * @param {Mark~markRegExpOptions} [opt] - Optional options object
   * @access public
   */
  markRegExp(regexp, opt) {
    this.checkOption(opt);

    let totalMarks = 0,
      matchesSoFar = 0,
      fn = this.opt.separateGroups ? 'wrapSeparateGroups' : 'wrapMatches';

    if (this.opt.acrossElements) {
      fn +=  'Across'; // creates wrapSeparateGroupsAcross or wrapMatchesAcross
      // it solves the backward-compatibility issue but open gate for new code to slip in without g flag
      if ( !regexp.global && !regexp.sticky) {
        let splits = regexp.toString().split('/');
        regexp = new RegExp(regexp.source, 'g' + splits[splits.length-1]);
        this.log('RegExp is recompiled - it must have a `g` flag');
      }
    }
    this.log(`RegExp "${regexp}"`);

    this[fn](regexp, this.opt.ignoreGroups, (node, match, filterInfo) => { // filter
      return this.opt.filter(node, match, matchesSoFar, filterInfo);

    }, (element, eachInfo) => { // each
      matchesSoFar = eachInfo.count;
      totalMarks++;
      this.opt.each(element, eachInfo);

    }, (totalMatches) => { // done
      if (totalMatches === 0) {
        this.opt.noMatch(regexp);
      }
      this.opt.done(totalMarks, totalMatches);
    });
  }

  /**
   * Callback to filter matches
   * @callback Mark~markFilterCallback
   * @param {Text} node - The text node which includes the match or with acrossElements option can be part of the match
   * @param {string} term - The current term
   * @param {number} matches - The number of all wrapped matches so far
   * @param {number} termMatches - The number of wrapped matches for the current term so far
   * @param {Mark~filterInfoObject} filterInfo - The object containing the match information.
   */
  /**
   * Callback for each marked element
   * @callback Mark~markEachCallback
   * @param {HTMLElement} element - The marked DOM element
   * @param {Mark~eachInfoObject} eachInfo - The object containing the match information.
   */
  /**
   * Callback if there were no matches
   * @callback Mark~markNoMatchCallback
   * @param {string|string[]} term - Not found search term(s)
   */
  /**
   * Callback when finished
   * @callback Mark~commonDoneCallback
   * @param {number} totalMarks - The total number of marked elements
   * @param {number} totalMatches - The total number of matches
   * @param {object} termStats - The object containing an individual term's matches counts for {@link Mark#mark} method
   */

  /**
   * These options also include the common options from {@link Mark~commonOptions}
   * and the options from {@link RegExpCreator~options}
   * @typedef Mark~markOptions
   * @type {object.<string>}
   * @property {boolean} [separateWordSearch=true] - Whether to break term into words
   * and search for individual word instead of the complete term
   * @property {Mark~markFilterCallback} [filter]
   */
  /**
   * Marks the specified search terms
   * @param {string|string[]} [sv] - A search string or an array of search strings
   * @param {Mark~markOptions} [opt] - Optional options object
   * @access public
   */
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

      this[fn](regex, 1, (node, t, filterInfo) => { // filter
        matches = totalMatches + termMatches;
        return this.opt.filter(node, term, matches, termMatches, filterInfo);

      }, (element, eachInfo) => { // each
        termMatches = eachInfo.count;
        totalMarks++;
        this.opt.each(element, eachInfo);

      }, (count) => { // end
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

  /**
    * Marks the specified search terms
    * @param {string[]} terms - An array of search terms
    * @param {object} termStats - An object for collecting terms statistics
    * @access protected
    */
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

      this[fn](regex, 1, (node, t, filterInfo) => { // filter
        if ( !across || filterInfo.matchStart) {
          term = this.getCurrentTerm(filterInfo.match, regTerms);
        }
        // termStats[term] is the number of wrapped matches so far for the current term
        termMatches = termStats[term];
        return this.opt.filter(node, term, totalMatches + termMatches, termMatches, filterInfo);

      }, (element, eachInfo) => { // each
        totalMarks++;

        if ( !across || eachInfo.matchStart) {
          termStats[term] += 1;
        }

        this.opt.each(element, eachInfo);

      }, (count) => { // end
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

  /**
    * @param {array} match - The result of RegExp exec() method
    * @param {array} terms - The array of strings
    * @return {string} - The matched term
    */
  getCurrentTerm(match, terms) {
    // it's better to search from the end of array because the terms sorted by
    // their length in descending order - shorter term appears more frequently
    let i = match.length;
    while (--i > 2) {
      // the current term index is the first not undefined capturing group index minus three
      if (match[i]) {
        // the first 3 groups are: match[0], lookbehind, and main group
        return terms[i-3];
      }
    }
    return ' ';
  }

  /**
    * Splits an array of string into chunks by the specified number and
    * combines each chunk strings into single RegExp pattern
    * @param {array} terms - The array of strings
    * @return {array} - The array of combined RegExp patterns
    */
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
      // get a chunk of terms to create combine pattern
      const chunk = terms.slice(i, Math.min(i + num, length)),
        obj = creator.createCombinePattern(chunk, true);
      array.push({ pattern : `${obj.lookbehind}(${obj.pattern})${obj.lookahead}`, regTerms : chunk });
    }
    return array;
  }

  /**
   * @typedef Mark~rangeObject
   * @type {object}
   * @property {number} start - The start index within the composite string
   * @property {number} length - The length of the string to mark within the composite string.
   */
  /**
   * @typedef Mark~setOfRanges
   * @type {object[]}
   * @property {Mark~rangeObject}
   */

  /**
   * @typedef Mark~rangeInfoObject
   * @type {object}
   * @property {boolean} matchStart - Indicate the start of range
   * @property {number} count - The current number of wrapped ranges
   */
  /**
   * These options also include the common options from {@link Mark~commonOptions}
   * @typedef Mark~markRangesOptions
   * @type {object.<string>}
   * @property {Mark~markRangesEachCallback} [each]
   * @property {Mark~markRangesNoMatchCallback} [noMatch]
   * @property {Mark~markRangesFilterCallback} [filter]
   */

  /**
   * Callback to filter matches
   * @callback Mark~markRangesFilterCallback
   * @param {Text} node - The text node which includes the range or is part of the range
   * @param {Mark~rangeObject} range - The range object
   * @param {string} match - The current range matching string
   * @param {number} index - The current range index ???
   */
  /**
   * Callback for each marked element
   * @callback Mark~markRangesEachCallback
   * @param {HTMLElement} element - The marked DOM element
   * @param {Mark~rangeObject} range - The range object
   * @param {Mark~rangeInfoObject}  - The object containing the range information
   */
  /**
   * Callback if a processed range is invalid, out-of-bounds, overlaps another
   * range, or only matches whitespace
   * @callback Mark~markRangesNoMatchCallback
   * @param {Mark~rangeObject} range - The range object
   */

  /**
   * Marks an array of objects containing start and length properties
   * @param {Mark~setOfRanges} ranges - The original array of objects
   * @param {Mark~markRangesOptions} [opt] - Optional options object
   * @access public
   */
  markRanges(ranges, opt) {
    this.checkOption(opt, true);

    if (Array.isArray(ranges)) {
      let totalMarks = 0;

      this.wrapRanges(ranges, (node, range, match, index) => { // filter
        return this.opt.filter(node, range, match, index);

      }, (elem, range, rangeInfo) => { // each
        totalMarks++;
        this.opt.each(elem, range, rangeInfo);

      }, (totalRanges, logs) => { // end
        this.report(logs);
        this.opt.done(totalMarks, totalRanges);
      });

    } else {
      this.report([{ text : 'markRanges() accept an array of objects: ', obj : ranges, level : 'error' }]);
      this.opt.done(0, 0);
    }
  }

  /**
   * Removes all marked elements inside the context with their HTML and normalizes text nodes
   * @param {Mark~commonOptions} [opt] - Optional options object without each,
   * noMatch and acrossElements properties
   * @access public
   */
  unmark(opt) {
    this.checkOption(opt, true);

    let selector = this.opt.element + '[data-markjs]';

    if (this.opt.className) {
      selector += `.${this.opt.className}`;
    }
    this.log(`Removal selector "${selector}"`);

    this.iterator.forEachNode(this.filter.SHOW_ELEMENT, node => { // each
      this.unwrapMatches(node);
    }, node => { // filter
      return DOMIterator.matches(node, selector) && !this.excluded(node);
    }, this.opt.done);
  }
}

export default Mark;
