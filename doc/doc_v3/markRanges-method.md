
## markRanges() method
### Syntax
``` js
// javascript
const instance = new Mark(context);
const ranges = [{ start: 2, length: 5 }, { start: 10, length: 7 },,,];
instance.markRanges(ranges[, options]);
// jQuery
$(selector).markRanges(ranges[, options]);
```
#### Parameters:
* `ranges` {object[]} - An array of objects with `start` and `length` properties with integer type values.
* `options` {object} - Optional options:
  * `element` {string} - A custom mark element e.g. `span`. (default is `'mark'`)
  * `className` {string} -  A custom class to be added to mark elements. (default is `''`)
  * `exclude` {string|string[]} - A string or an array of selectors. Specifies DOM elements that should be excluded from searching. (default is `[]`)
    See [exclude](options.html#exclude-option) option for more details.
  * `wrapAllRanges` {boolean} - Mark nesting/overlapping capturing groups (default is `undefined`)
    See [Marking nesting and overlapping ranges and match groups](nesting-overlapping.md) for more details.

  * `highlight` {Highlight} - If a `Highlight` object is provided, the library switches to using the `CSS Custom Highlight API` instead of wrapping matches in HTML elements (default is `undefined`)
    See [highlight](options.html#highlight-option) option for more details.
  * `highlightName` {string} - The name of the `Highlight` object necessary to register it using `HighlightRegistry` (default is `'advanced-markjs'`)
  * `staticRanges` {boolean} - Whether to use `StaticRange` objects instead of `Range` objects (`Highlight` API) (default is `true`)
    See [staticRanges](options.html#staticranges-option) option for more details.
  * `rangeAcrossElements` {boolean} - Whether to create a single `StaticRange/Range` object for matches located across elements (`Highlight` API) (default is `true`)
    See [rangeAcrossElements](options.html#rangeacrosselements-option) option for more details.

  * `shadowDOM` {boolean|object} - Whether to mark inside shadow DOMs (default is `undefined`)
    See [shadowDOM](options.html#shadowdom-option) option for more details.
  * `markLines` {boolean} - Whether to mark ranges of lines instead of ranges of texts (default is `undefined`)
    See [Highlighting line ranges](mark-lines.md) for more details.
  * `iframes` {boolean|object} - Whether to mark inside iframes (default is `false`)
    See [iframes](options.html#iframes-option) option for more details.
  * `iframesTimeout` {number} - The maximum time to wait for an iframe to load before skipping (default is `5000` ms)
  * `debug` {boolean} - Whether to log messages (default is `false`)
  * `log` {object} - Log messages to a specific object (default is `console`)

  * `filter: (nodeOrArray, range, matchString, index) => {}` {function} - A callback to filter matches. It calls for each range (FR) (default is )
    * `nodeOrArray` {Text|Text[]} - The text node which includes the range or is the part of the range  
      OR an array of text node(s) if the `Highlight` API is used with `rangeAcrossElements` option
    * `range` {object} - The current range object with `start` and `length` properties
    * `matchString` {string} - The current range matching string
    * `index` {number} - The current range index (is not reliable - range can be skipped if it matches the string that contains only white spaces)

The function **must** return either `true` (highlight) or `false` (skip highlighting).

  * `each: (elementOrRange, range, rangeInfo) => {}` {function} - A callback for each created HTML element OR `StaticRange/Range` object (`Highlight` API) (default is )
    * `elementOrRange` {HTMLElement|StaticRange|Range} - The marked DOM element OR `StaticRange/Range` object (`Highlight` API)
    * `range` {object} - The range object with `start` and `length` properties
    * `rangeInfo` {object}:
      * `matchStart` {boolean} - indicate the start of a range;
      * `count` {number} - The number of ranges so far

  * `done: (total, totalRanges) => {}` {function} - A callback on finish (default is )
    * `total` {number} - The total number of created HTML elements OR `StaticRange/Range` objects (`Highlight` API)
    * `totalRanges` {number} - The number of total number of highlighted ranges

  * `noMatch: (range) => {}` {function} - A callback that is called on non-valid range (default is )
    * `range` {object} - The range object with `start` and `length` properties

<details class="internal-code">
<summary><b>Example with default options values</b></summary>

<pre><code class="language-js">const options = {
    element: 'mark',
    className: '',
    exclude: [],
    
    staticRanges: true, // Highlight API only
    rangeAcrossElements: true, // Highlight API only
    shadowDOM: false,
    iframes: false,
    iframesTimeout: 5000,
    
    filter: (nodeOrArray, range, matchingString, index) => {
        return true; // must return either true or false
    },
    each: (elementOrRange, range, rangeInfo) => {},
    done: (total, totalMatches) => {},
    noMatch: (range) => {},
    debug: false,
    log: window.console
};
</code></pre>

JavaScript:

<pre><code class='lang-javascript'>
const instance = new Mark(document.querySelector('selector')),
  ranges = [{ start: 0, length: 5 }, { start: 6, length: 5 }];

instance.markRanges(ranges, options);
</code></pre>

jQuery:

<pre><code class='lang-javascript'>$('selector').markRanges(ranges, options);</code></pre>
</details>

* FR - if a range is located across several elements, it calls for each text node which includes the range
