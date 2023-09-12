
## markRanges() method
### Syntax
``` js
// javascript
const instance = new Mark(context);
instance.markRanges(ranges[, options]);
// jQuery
$(context).markRanges(ranges[, options]);
```
#### Parameters:
* `ranges` {object[]} - An array of objects with `start` and `length` properties with integer type values.
* `options` {object} - Optional options:
  * `element` {string} - A custom mark element e.g. `span`. (default is `mark`)
  * `className` {string} -  A class to be added to mark elements. (default is `''`)
  * `exclude` {string|string[]} - A string or an array of selectors. Defines DOM elements that should be excluded from searching. (default is `[]`)
  * `wrapAllRanges` {boolean} - Mark nesting/overlapping capturing groups (default is `undefined`)
    See [Marking nesting and overlapping ranges and match groups](nesting-overlapping.md) for more details.

  * `shadowDOM` {boolean} - Whether to mark inside shadow DOMs (default is `undefined`)
    See [Highlighting in shadow DOM](shadow-dom.md) for more details.
  * `markLines` {boolean} - Whether to mark ranges of lines instead of ranges of texts (default is `undefined`)
    See [Highlighting line ranges](mark-lines.md) for more details.
  * `iframes` {boolean} - Whether to mark inside iframes (default is `false`)
  * `iframesTimeout` {number} - The max time to wait for iframe(s) to load before skipping (default is `5000` ms)
  * `debug` {boolean} - Whether to log messages (default is `false`)
  * `log` {object} - Log messages to a specific object (default is `console`)

  * `filter : (textNode, range, matchString, index) => {}` {function} - A callback to filter matches. It calls for each range (if a range is located across several elements, it calls for each text node which is part of the range) (default is )
    * `textNode` {Text} - The text node which includes the range or is the part of the range
    * `range` {object} - The current range object
    * `matchString` {string} - The current range matching string
    * `index` {number} - The current range index (is not reliable - range can be skipped if it matches the string that contains only white spaces)
  
The function must return `false` to skip wrapping mark element, otherwise `true`.

  * `each : (markElement, range, rangeInfo) => {}` {function} - A callback for each marked element (default is )
    * `markElement` {HTMLElement} - The marked DOM element
    * `range` {object} - The range object
    * `rangeInfo` {object}:
      * `matchStart` {boolean} - indicate the start of a range;
      * `count` {number} - The number of wrapped ranges so far

  * `done : (totalMarks, totalRanges) => {}` {function} - A callback on finish (default is )
    * `totalMarks` {number} - The total number of marked elements
    * `totalRanges` {number} - The number of total ranges

  * `noMatch : (range) => {}` {function} - A callback that is called on non-valid range (default is )
    * `range` {string} - The stringify range

<details class="internal-code">
<summary><b>Example with default options values</b></summary>

<pre><code class="language-js">const options = {
    element : 'mark',
    className : '',
    exclude : [],
    
    wrapAllRanges : false,
    markLines : false,
    shadowDOM : false,
    iframes : false,
    iframesTimeout : 5000,
    
    filter : (textNode, range, matchingString, index) => {
        return true; // must return either true or false
    },
    each : (markElement, range, rangeInfo) => {},
    done : (totalMarks, totalMatches) => {},
    noMatch : (range) => {},
    debug : false,
    log : window.console
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
