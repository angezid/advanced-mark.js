
## The `markRegExp()` method:

  * `element` {string} - Defines a custom mark element e.g. `span`. (default is `mark`)
  * `className` {string} - Defines a custom class name that should be added to mark elements. (default is `''`)
  * `exclude` {array|string} - The string or array of selectors. Defines DOM elements that should be excluded from searching. (default is `[]`)
  * `ignoreGroups` {number} - The number of contiguous capturing groups that should be ignored from the start of RegExp (default is `0`)
    e.g. `/(\w+)(\.)(\w+)(?!\2)/g`, `ignoreGroups : 2` - mark the group 3
  * `acrossElements` {boolean} - Whether to search for matches across elements (default is `false`)
  * `wrapAllRanges` {boolean} - Mark nesting/overlapping capturing groups  (default is `undefined`)
    See [Marking nesting and overlapping ranges and match groups](nesting-overlapping.md) for more details.
  * `blockElementsBoundary` {boolean|object} - Whether to limit matches within default HTML block elements and/or custom elements (default is `undefined`)
    See [Elements boundaries](elements-boundaries.md) for more details.

  * `shadowDOM` {boolean} - Whether to mark inside shadow DOMs (default is `undefined`)
    See [Marking shadow DOM](shadow-dom.md) for more details.
  * `iframes` {boolean} - Whether to mark inside iframes (default is `false`)
  * `iframesTimeout` {number} - The max time to wait for iframe(s) to load before skipping (default is `5000` ms)
  * `debug` {boolean} - Whether to log messages (default is `false`)
  * `log` {object} - Log messages to a specific object (default is `window.console`)

* The `filter` callback:
  `filter : (textNode, matchString, matchesSoFar, filterInfo) => {}`
  * `textNode` {Text} - The text node which includes the match or with `acrossElements` option can be part of the match
  * `matchString` {string} - The matching string:
    1) without `ignoreGroups` and `separateGroups` options - the whole match
    2) with `ignoreGroups` option - the match[ignoreGroups+1] group matching string e.g. `/(-)(\w+)\s+/g`, `ignoreGroups : 1`, the matching string is content of the group 2
    3) with `separateGroups` option - the current group matching string
  * `matchesSoFar` {number} - The number of all wrapped matches so far
  * `filterInfo` {object}:
    * `match` {array} - The result of RegExp exec() method
    * `matchStart` {boolean} - indicate the start of a match  AE
    * `groupIndex` {number} - The current group index  SG
    * `execution` {object} - The helper object for early abort:
      * `abort` {boolean} - When set to `true` it breaks method execution
    * `offset` {number} - When 'acrossElements: false': the absolute start index of a text node in joined context.
      when 'acrossElements: true': the sum of lengths of separated spaces or boundary strings that were added to the composite string so far.

* The `each` callback:
  `each : (markElement, eachInfo) => {}`
  * `markElement` {HTMLElement} - The marked DOM element
  * `eachInfo` {object}:
    * `match` {array} - The result of RegExp exec() method
    * `matchStart` {boolean} - Indicate the start of a match  AE
    * `count` {number} - The number of matches so far
    * `groupIndex` {number} - The current index of match group  SG
    * `groupStart` {boolean} - Indicate the start of group  AE SG

* The `done` callback:
  `done : (totalMarks, totalMatches) => {}`
  * `totalMarks` {number} - The total number of marked elements
  * `totalMatches` {number} - The total number of matches

* The `noMatch` callback:
  `noMatch : (regex) => {}`
  * `regex` {string} - The not found regexp

### Available properties of the `filterInfo` object depending on options

|            options               |    match   |   matchStart   | groupIndex  |  execution  | offset |
|----------------------------------|------------|----------------|-------------|-------------|--------|
|  acrossElements                  |     +      |      +         |     -       |     +       |   +    |
|  acrossElements, separateGroups  |     +      |      +         |     +       |     +       |   -    |
|  separateGroups                  |     +      |      +         |     +       |     +       |   +    |
|  above options are false         |     +      |      -         |     -       |     +       |   -    |


### Available properties of the `eachInfo` object depending on options

|             options              |    match   |    matchStart   |  groupIndex  | groupStart | count |
|----------------------------------|------------|-----------------|--------------|------------|-------|
|  acrossElements                  |     +      |      +          |     -        |     -      |   +   |
|  acrossElements, separateGroups  |     +      |      +          |     +        |     +      |   +   |
|  separateGroups                  |     +      |      +          |     +        |     -      |   +   |
|  above options are false         |     +      |      -          |     -        |     -      |   +   |


<details id="internal-code">
<summary><b>Example with default options values</b></summary>

<pre><code class="language-js">const options = {
    element : 'mark',
    className : '',
    exclude : [],
    ignoreGroups : 0,
    acrossElements : false,
	wrapAllRanges : false,
	blockElementsBoundary : false,
	shadowDOM : false,
    iframes : false,
    iframesTimeout : 5000,
    filter : (textNode, matchString, matchesSoFar, filterInfo) => {
        return true; // must return either true or false
    },
    each : (markElement, eachInfo) => {},
    done : (totalMarks, totalMatches) => {},
    noMatch : (regex) => {},
    debug : false,
    log : window.console
};
</code></pre>

JavaScript:

<pre><code class='lang-javascript'>
var instance = new Mark(document.querySelector('selector'));
instance.markRegExp('test', options);
</code></pre>

jQuery:

<pre><code class='lang-javascript'>$('selector').markRegExp('test', options);</code></pre>
</details>

* AE across elements
* SG separate groups
