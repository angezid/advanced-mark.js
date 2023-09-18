
## markRegExp() method
### Syntax
``` js
// javascript
const instance = new Mark(context);
instance.markRegExp(regex[, options]);
// jQuery
$(context).markRegExp(regex[, options]);
```
#### Parameters:
* `regex` {RegExp} - The regular expression. With `acrossElements` option it **must** have `g` flag - it works with indexes and only two `g` and `y` flags allow control RegExp `lastIndex`. Note that for backward compatibility, RegExp without `g` flag is recompile internally with `g` flag.
  Although without `acrossElements` option it doesn't require `g` flag, it still recommended having this flag.
* `options` {object} - Optional options:
  * `element` {string} - A custom mark element e.g. `span`. (default is `mark`)
  * `className` {string} -  A class to be added to mark elements. (default is `''`)
  * `exclude` {string|string[]} - A string or an array of selectors. Specifies DOM elements that should be excluded from searching. (default is `[]`)
  * `ignoreGroups` {number} - The number of adjacent capturing groups that should be ignored from the start of RegExp (default is `0`)
    e.g. `/(\w+)(\.)(\w+)(?!\2)/g`, `ignoreGroups : 2` - mark the group 3
  * `separateGroups` {boolean} - Whether to mark RegExp capturing groups instead of whole match (default is `false`)
    See [Highlighting separate groups](separate-groups.md) for more details.
  * `acrossElements` {boolean} - Whether to search for matches across elements (default is `false`)
  * `wrapAllRanges` {boolean} - Mark nesting/overlapping capturing groups  (default is `undefined`)
    See [Marking nesting and overlapping ranges and match groups](nesting-overlapping.md) for more details.
  * `blockElementsBoundary` {boolean|object} - Whether to limit matches within default HTML block elements and/or custom elements (default is `undefined`)  AE
    See [Elements boundaries](elements-boundaries.md) for more details.
    * `tagNames` {string[]} - An array of custom HTML tag names
    * `extend` {boolean} - `true` extends default boundary elements by the custom elements
      otherwise only the custom elements do have boundaries
    * `char` {string} - A custom boundary character. The default is `\x01`.

  * `shadowDOM` {boolean} - Whether to mark inside shadow DOMs (default is `undefined`)
    See [Highlighting in shadow DOM](shadow-dom.md) for more details.
  * `iframes` {boolean} - Whether to mark inside iframes (default is `false`)
  * `iframesTimeout` {number} - The max time to wait for iframe(s) to load before skipping (default is `5000` ms)
  * `debug` {boolean} - Whether to log messages (default is `false`)
  * `log` {object} - Log messages to a specific object (default is `console`)

  * `filter : (textNode, matchString, matchesSoFar, filterInfo) => {}` {function} - A callback to filter matches. It calls for each match (with `acrossElements` option, if the match is located across several elements, it calls for each text node which is part of the match) (default is )
    * `textNode` {Text} - The text node which includes the match or with `acrossElements` option can be part of the match
    * `matchString` {string} - The matching string:
      1. without `ignoreGroups` and `separateGroups` options - the whole match
      2. with `ignoreGroups` option - the match[ignoreGroups+1] group matching string e.g. `/(-)(\w+)\s+/g`, `ignoreGroups : 1`, the matching string is content of the group 2
      3. with `separateGroups` option - the current group matching string
    * `matchesSoFar` {number} - The number of all wrapped matches so far
    * `filterInfo` {object}:
      * `match` {array} - The result of RegExp exec() method
      * `matchStart` {boolean} - indicate the start of a match  AE
      * `groupIndex` {number} - The current group index  SG
      * `execution` {object} - The helper object for early abort:
        * `abort` {boolean} - Setting it to `true` breaks method execution
      * `offset` {number} - When 'acrossElements: false': the absolute start index of a text node in joined context.
        When 'acrossElements: true': the sum of the lengths of separated spaces or boundary strings that were added to the composite string so far.
  
The function must return `false` to skip wrapping mark element, otherwise `true`.

  * `each : (markElement, eachInfo) => {}` {function} - A callback for each marked element (default is )
    * `markElement` {HTMLElement} - The marked DOM element
    * `eachInfo` {object}:
      * `match` {array} - The result of RegExp exec() method
      * `matchStart` {boolean} - Indicate the start of a match  AE
      * `count` {number} - The number of wrapped matches so far
      * `groupIndex` {number} - The current index of match group  SG
      * `groupStart` {boolean} - Indicate the start of group  AE SG

  * `done : (totalMarks, totalMatches) => {}` {function} - A callback on finish. (default is )
    * `totalMarks` {number} - The total number of marked elements
    * `totalMatches` {number} - The total number of matches

  * `noMatch : (regex) => {}` {function} - A callback that is called when regex failed to match (default is )
    * `regex` {string} - The stringify RegExp

### Available properties of the `filterInfo` object depending on options

|            options               |    match   |   matchStart   | groupIndex  |  execution  | offset |
|----------------------------------|------------|----------------|-------------|-------------|--------|
|  acrossElements                  |     +      |      +         |     -       |     +       |   +    |
|  acrossElements, separateGroups  |     +      |      +         |     +       |     +       |   +    |
|  separateGroups                  |     +      |      +         |     +       |     +       |   +    |
|  above options are false         |     +      |      -         |     -       |     +       |   +    |


### Available properties of the `eachInfo` object depending on options

|             options              |    match   |    matchStart   |  groupIndex  | groupStart | count |
|----------------------------------|------------|-----------------|--------------|------------|-------|
|  acrossElements                  |     +      |      +          |     -        |     -      |   +   |
|  acrossElements, separateGroups  |     +      |      +          |     +        |     +      |   +   |
|  separateGroups                  |     +      |      +          |     +        |     -      |   +   |
|  above options are false         |     +      |      -          |     -        |     -      |   +   |


<details class="internal-code">
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
const instance = new Mark(document.querySelector('selector')),
  regex = /../gi;
instance.markRegExp(regex, options);
</code></pre>

jQuery:

<pre><code class='lang-javascript'>$('selector').markRegExp(regex, options);</code></pre>
</details>

* AE - only available when `acrossElements` option is set to `true`
* SG - only available when `separateGroups` option is set to `true`
* AE SG - only available when both `acrossElements` and `separateGroups` options are set to `true`
