
## The `markRanges()` method:

  * `element` {string} - Defines a custom mark element e.g. `span`. (default is `mark`)
  * `className` {string} - Defines a custom class name that should be added to mark elements. (default is `''`)
  * `exclude` {array|string} - The string or array of selectors. Defines DOM elements that should be excluded from searching. (default is `[]`)
  * `wrapAllRanges` {boolean} - Mark nesting/overlapping capturing groups  (default is `undefined`)
    See [Marking nesting and overlapping ranges and match groups](nesting-overlapping.md) for more details.

  * `shadowDOM` {boolean} - Whether to mark inside shadow DOMs (default is `undefined`)
    See [Marking shadow DOM](shadow-dom.md) for more details.
  * `iframes` {boolean} - Whether to mark inside iframes (default is `false`)
  * `iframesTimeout` {number} - The max time to wait for iframe(s) to load before skipping (default is `5000` ms)
  * `debug` {boolean} - Whether to log messages (default is `false`)
  * `log` {object} - Log messages to a specific object (default is `window.console`)

* The `filter` callback:
  `filter : (textNode, range, matchString, index) => {}`
  * `textNode` {Text} - The text node which includes the range or is the part of the range
  * `range` {object} - The current range object
  * `matchString` {string} - The current range matching string
  * `index` {number} - The current range index ???

* The `each` callback:
  `each : (markElement, range, rangeInfo) => {}`
  * `markElement` {HTMLElement} - The marked DOM element
  * `range` {object} - The range object
  * `rangeInfo` {object}:
    * `matchStart` {boolean} - indicate the start of a range;
    * `count` {number} - The number of wrapped ranges so far

* The `done` callback parameters:
  `done : (totalMarks, totalRanges) => {}`
  * `totalMarks` {number} - The total number of marked elements
  * `totalRanges` {number} - The number of total ranges

* The `noMatch` callback:
  `noMatch : (range) => {}`
  * `range` {string} - The not found range

<details id="internal-code">
<summary><b>Example with default options values</b></summary>

<pre><code class="language-js">const options = {
    element : 'mark',
    className : '',
    exclude : [],
    
	wrapAllRanges : false,
	
	shadowDOM : false,
    iframes : false,
    iframesTimeout : 5000,
    
    filter : (textNode, range, matchingString, index) => {
        return true; // must return either true or false
    },
    each : (markElement, range, rangeInfo) => {},
    done : (totalMarks, totalMatches) => {},
    noMatch : (regex) => {},
    debug : false,
    log : window.console
};
</code></pre>

JavaScript:

<pre><code class='lang-javascript'>
var instance = new Mark(document.querySelector('selector'));
instance.markRanges('test', options);
</code></pre>

jQuery:

<pre><code class='lang-javascript'>$('selector').markRanges('test', options);</code></pre>
</details>
