/**
 * A NodeIterator with iframes support and a method to check if an element is
 * matching a specified selector
 * @example
 * const iterator = new DOMIterator(
 *     document.querySelector("#context"), true
 * );
 * iterator.forEachNode(NodeFilter.SHOW_TEXT, node => { // each
 *     console.log(node);
 * }, node => { // filter
 *     return !DOMIterator.matches(node.parentNode, ".ignore");
 * }, () => {
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
     * The name of an attribute, which added to iframes, to indicate iframe state
     * @type {string}
     * @access protected
     */
    this.attrName = 'data-markjsListener';
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
    let ctx,
      sort = false;

    if ( !this.ctx) {
      ctx = [];
    } else if (this.opt.window.NodeList.prototype.isPrototypeOf(this.ctx)) {
      ctx = this.ctx;
    } else if (Array.isArray(this.ctx)) {
      ctx = this.ctx;
      sort = true;
    } else if (typeof this.ctx === 'string') {
      ctx = this.opt.window.document.querySelectorAll(this.ctx);
    } else { // e.g. HTMLElement or element inside iframe
      ctx = [this.ctx];
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
        return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) > 0 ? -1 : 1;
      });
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
        iframe.setAttribute(this.attrName, 'completed');
        successFn({ iframe : iframe, context : doc });
      }
    } catch (e) {
      iframe.setAttribute(this.attrName, 'error');
      errorFn({ iframe : iframe, error : e });
    }
  }

  /**
   * Checks if an iframe is empty (if about:blank is the shown page)
   * @param {HTMLElement} ifr - The iframe DOM element
   * @return {boolean}
   * @access protected
   */
  isIframeBlank(ifr) {
    const bl = 'about:blank',
      src = ifr.getAttribute('src').trim(),
      href = ifr.contentWindow.location.href;
    return href === bl && src !== bl && src;
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
      if (ifr.contentWindow.document.readyState === 'complete') {
        if (this.isIframeBlank(ifr)) {
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
   * Callback when all iframes are ready for DOM access
   * @callback DOMIterator~waitForIframesDoneCallback
   */
  /**
   * Iterates over all iframes and calls the done callback when all of them
   * are ready for DOM access (including nested ones)
   * @param {HTMLElement} ctx - The context DOM element
   * @param {DOMIterator~waitForIframesDoneCallback} done - Done callback
   */
  waitForAllIframes(ctx, doneCb) {
    let count = 0,
      iframes = [],
      array = [],
      fired = false;
    // not sure about this timeout; it should guarantee a single done callback, if something went wrong
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
        // case when the main context has no iframes or iframes were already handled, e.g. by unmark() method
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

  /**
   * Creates a NodeIterator on the specified context
   * @see {@link https://developer.mozilla.org/en/docs/Web/API/NodeIterator}
   * @param {HTMLElement} ctx - The context DOM element
   * @param {DOMIterator~whatToShow} whatToShow
   * @param {DOMIterator~filterCb} filter
   * @return {NodeIterator}
   * @access protected
   */
  createIterator(ctx, whatToShow, filter) {
    return this.opt.window.document.createNodeIterator(ctx, whatToShow, filter, false);
  }

  /**
   * Adds custom style to shadow root when marking, removes when unmark
   * There is no possibility to check whether a shadow root has any matches though
   * @param {HTMLElement} node - The shadow root node
   * @param {HTMLElement} style - The custom style element
   * @param {boolean} add - A boolean indicating add or remove a style element
   */
  addRemoveStyle(root, style, add) {
    if (add) {
      if (style && root.firstChild && !root.querySelector('style[data-markjs]')) {
        const elem = this.opt.window.document.createElement('style');
        elem.setAttribute('data-markjs', 'true');
        elem.textContent = style;
        root.insertBefore(elem, root.firstChild);
      }

    } else {
      let elem = root.querySelector('style[data-markjs]');
      if (elem) {
        root.removeChild(elem);
      }
    }
  }

  /**
   * Checks whether the node has attribute with the specified name and value
   * @return {Boolean}
   */
  hasAttributeValue(node, name, value) {
    return node.hasAttribute(name) && node.getAttribute(name) === value;
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
    const nodeFilter = this.opt.window.NodeFilter, 
      shadow = this.opt.shadowDOM,
      iframe = this.opt.iframes;

    if (iframe || shadow) {
      const showElement = (whatToShow & nodeFilter.SHOW_ELEMENT) !== 0,
        showText = (whatToShow & nodeFilter.SHOW_TEXT) !== 0;

      if (showText) {
        whatToShow = nodeFilter.SHOW_ELEMENT | nodeFilter.SHOW_TEXT;
      }

      const traverse = node => {
        const iterator = this.createIterator(node, whatToShow);

        while ((node = iterator.nextNode())) {
          if (node.nodeType === 1) { // element
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
            // there is no possibility to filter a whole shadow DOM, because the 'DOMIterator.matches()'
            // is not working neither for 'shadowRoot' no for the element itself
            if (shadow && node.shadowRoot && node.shadowRoot.mode === 'open') {
              this.addRemoveStyle(node.shadowRoot, shadow.style, showText);
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
        return filterCb(node) ? nodeFilter.FILTER_ACCEPT : nodeFilter.FILTER_REJECT;
      });
      let node;

      while ((node = iterator.nextNode())) {
        eachCb(node);
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
    if ( !open) {
      done();
    }

    contexts.forEach(ctx => {
      open--;

      const ready = () => {
        this.iterateThroughNodes(ctx, whatToShow, filter, each, () => {
          if (open <= 0) { // calls end when all contexts were handled
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

export default DOMIterator;
