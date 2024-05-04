/**
 * A NodeIterator with iframes support and a method to check if an element is
 * matching a specified selector
 * @example
 * const iterator = new DOMIterator("selector", opt);
 * iterator.forEachNode(NodeFilter.SHOW_TEXT, node => { // each
 *     console.log(node);
 * }, node => { // filter
 *     return !DOMIterator.matches(node.parentNode, ".ignore");
 * }, () => { // done
 *     console.log("DONE");
 * });
 */
class DOMIterator {

  /**
   * @param {HTMLElement|HTMLElement[]|NodeList|string} ctx - The context DOM
   * element, an array of DOM elements, a NodeList or a selector
   * @param {object} opt - Options object
   */
  constructor(ctx, opt) {
    /**
     * The context of the instance. Either a DOM element, an array of DOM
     * elements, a NodeList or a selector
     * @type {HTMLElement|HTMLElement[]|NodeList|string}
     * @access protected
     */
    this.ctx = ctx;
    /**
     * The object containing Mark options
     * @type {object}
     * @access protected
     */
    this.opt = opt;
    /**
     * The array to truck iframes states
     * @type {array}
     * @access protected
     */
    //this.map = new Map();
    this.map = [];
  }

  /**
   * Checks if the specified DOM element matches the selector
   * @param {HTMLElement} element - The DOM element
   * @param {string|string[]} selector - The selector or an array with
   * selectors
   * @return {boolean}
   * @access public
   */
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

  /**
   * Returns all contexts filtered by duplicates or nested elements
   * @return {HTMLElement[]} - An array containing DOM contexts
   * @access protected
   */
  getContexts() {
    let ctx = this.ctx,
      win = this.opt.window,
      sort = false;

    if ( !ctx) return [];

    if (Array.isArray(ctx)) {
      sort = true;
    } else if (typeof ctx === 'string') {
      ctx = this.toArray(win.document.querySelectorAll(ctx));
    } else if (ctx.length >= 0) { // NodeList or HTMLCollection
      ctx = this.toArray(ctx);
    } else { // e.g. HTMLElement
      ctx = [ctx];
    }

    // filters out duplicate/nested elements
    const array = [];
    ctx.forEach(elem => {
      if (array.indexOf(elem) === -1 && !array.some(node => node.contains(elem))) {
        array.push(elem);
      }
    });
    // elements in the custom array can be in any order
    // sorts elements by the DOM order
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

  /**
   * @callback DOMIterator~getIframeContentsSuccessCallback
   * @param {HTMLDocument} contents - The contentDocument of the iframe
   */
  /**
   * Calls the success callback function with the iframe document. If it can't
   * be accessed it calls the error callback function
   * @param {HTMLElement} ifr - The iframe DOM element
   * @param {DOMIterator~getIframeContentsSuccessCallback} successFn
   * @param {function} [errorFn]
   * @access protected
   */
  getIframeContents(iframe, successFn, errorFn) {
    try {
      const doc = iframe.contentWindow.document;
      if (doc) {
        //this.map.set(iframe, 'ready');
        this.map.push([iframe, 'ready']);
        successFn({ iframe : iframe, context : doc });
      }
    } catch (e) {
      errorFn({ iframe : iframe, error : e });
    }
  }

  /**
   * Observes the onload event of an iframe and calls the success callback or
   * the error callback if the iframe is inaccessible. If the event isn't
   * fired within the specified {@link DOMIterator#iframesTimeout}, then it'll
   * call the error callback too
   * @param {HTMLElement} ifr - The iframe DOM element
   * @param {DOMIterator~getIframeContentsSuccessCallback} successFn
   * @param {function} errorFn
   * @access protected
   */
  observeIframeLoad(ifr, successFn, errorFn) {
    // an event listener is already added to the iframe
    //if (this.map.has(ifr)) {
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
    //this.map.set(ifr, true);
    this.map.push([ifr, true]);
    id = setTimeout(listener, this.opt.iframesTimeout);
  }

  /**
   * Callback when the iframe is ready
   * @callback DOMIterator~onIframeReadySuccessCallback
   * @param {HTMLDocument} contents - The contentDocument of the iframe
   */
  /**
   * Callback if the iframe can't be accessed
   * @callback DOMIterator~onIframeReadyErrorCallback
   */
  /**
   * Calls the callback if the specified iframe is ready for DOM access
   * @param {HTMLElement} ifr - The iframe DOM element
   * @param {DOMIterator~onIframeReadySuccessCallback} successFn - Success
   * callback
   * @param {DOMIterator~onIframeReadyErrorCallback} errorFn - Error callback
   * @see {@link http://stackoverflow.com/a/36155560/3894981} for
   * background information
   * @access protected
   */
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
    } catch (e) { // accessing document failed
      errorFn(e);
    }
  }

  /**
   * Callback when all context iframes are ready for DOM access
   * @callback DOMIterator~waitForIframesDoneCallback
   */
  /**
   * Iterates over all context iframes and calls the done callback when all of them
   * are ready for DOM access (including nested ones)
   * @param {HTMLElement} ctx - The context DOM element
   * @param {DOMIterator~waitForIframesDoneCallback} done - Done callback
   */
  waitForIframes(ctx, doneCb) {
    const shadow = this.opt.shadowDOM;
    let count = 0,
      iframes = 0,
      array,
      node;

    const collect = context => {
      const iterator = this.createIterator(context, this.opt.window.NodeFilter.SHOW_ELEMENT);

      while ((node = iterator.nextNode())) {
        //if (this.isIframe(node) && !this.map.has(node)) {
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
          this.onIframeReady(iframe, obj => { // success
            count++;
            loop(obj);
          }, obj => { // error
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

  /**
   * Creates a NodeIterator on the specified context
   * @see {@link https://developer.mozilla.org/en/docs/Web/API/NodeIterator}
   * @param {HTMLElement} ctx - The context DOM element
   * @param {DOMIterator~whatToShow} whatToShow
   * @return {NodeIterator}
   * @access protected
   */
  createIterator(ctx, whatToShow) {
    const win = this.opt.window;
    return win.document.createNodeIterator(ctx, whatToShow, () => win.NodeFilter.FILTER_ACCEPT, false);
  }

  /**
   * Adds custom style to shadow root when marking, removes when unmark
   * There is no possibility to check whether a shadow root has any matches though
   * @param {HTMLElement} node - The shadow root node
   * @param {HTMLElement} style - The custom style element
   * @param {boolean} add - A boolean indicating add or remove a style element
   */
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

  /**
   * Checks if the DOM element is an iframe and is not excluded from search
   * @param {HTMLElement} element - The DOM element
   * @return {boolean}
   */
  isIframe(node) {
    return node.tagName === 'IFRAME' && !DOMIterator.matches(node, this.opt.exclude);
  }

  /**
   * Iterates through all nodes, including shadow DOM nodes, in the specified context
   * @param {HTMLElement} ctx - The context
   * @param {DOMIterator~whatToShow} whatToShow
   * @param {DOMIterator~filterCb} filterCb - Filter callback
   * @param {DOMIterator~forEachNodeCallback} eachCb - Each callback
   * @param {DOMIterator~forEachNodeEndCallback} doneCb - End callback
   * @access protected
   */
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
          if (node.nodeType === 1) { // element
            if (showElement && filterCb(node)) {
              eachCb(node);
            }

            //if (iframe && this.isIframe(node) && this.map.get(node) === 'ready') {
            if (iframe && this.isIframe(node) && this.map.some(arr => arr[0] === node && arr[1] === 'ready')) {
              const doc = node.contentWindow.document;
              if (doc) traverse(doc);
            }
            // there is no possibility to filter a whole shadow DOM, because the 'DOMIterator.matches()'
            // is not working neither for 'shadowRoot' no for the element itself
            if (shadow && (root = node.shadowRoot) && root.mode === 'open') {
              this.addRemoveStyle(root, shadow.style, showText);
              traverse(root);
            }

          } else  if (showText && node.nodeType === 3 && filterCb(node)) { // text node
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

  /**
   * @typedef DOMIterator~whatToShow
   * @see {@link http://tinyurl.com/zfqqkx2}
   * @type {number}
   */
  /**
   * Callback to filter nodes. Can return either true to accept node or false to reject node.
   * @see {@link http://tinyurl.com/zdczmm2}
   * @callback DOMIterator~filterCb
   * @param {Text|HTMLElement} node - The node to filter
   */
  /**
   * Callback for each node
   * @callback DOMIterator~forEachNodeCallback
   * @param {Text|HTMLElement} node - The node node to process
   */
  /**
   * Callback if all contexts were handled
   * @callback DOMIterator~forEachNodeEndCallback
   */
  /**
   * Iterates over all contexts
   * @param {DOMIterator~whatToShow} whatToShow
   * @param {DOMIterator~forEachNodeCallback} each - Each callback
   * @param {DOMIterator~filterCb} filter - Filter callback
   * @param {DOMIterator~forEachNodeEndCallback} done - End callback
   * @access public
   */
  forEachNode(whatToShow, each, filter, done = () => {}) {
    const contexts = this.getContexts();
    let open = contexts.length;

    if ( !open) done();

    const ready = () => {
      contexts.forEach(ctx => {
        this.iterateThroughNodes(ctx, whatToShow, filter, each, () => {
          if (--open <= 0) done(); // calls end when all contexts were handled
        });
      });
    };

    // wait for all iframes to be ready for DOM access or timeout
    if (this.opt.iframes) {
      let count = open,
        fired = false;
      // it should guarantee a single done callback, if something went wrong
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

export default DOMIterator;
