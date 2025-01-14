
## mark() method
### Syntax
``` js
// javascript
const instance = new Mark(context);
instance.mark(search[, options]);
// jQuery
$(context).mark(search[, options]);
```
#### Parameters:
* `search` {string|string[]} - string or array of strings
* `options` {object} - Optional options:
  * `element` {string} - A custom mark element e.g. `span`. (default is `mark`)
  * `className` {string} - A custom class to be added to mark elements. (default is `''`)
  * `exclude` {string|string[]} - A string or an array of selectors. Specifies DOM elements that should be excluded from searching. (default is `[]`)
    See [exclude](options.html#exclude-option) option for more details.
  * `separateWordSearch` {boolean|string} - A **boolean** value `true` specifies to break term(s) into separate words and search for each individual word. (default is `true`)
    A **string** value `'preserveTerms'` preserved term(s) surrounding by double quotes from breaking into separate words.
    See [separateWordSearch](options.html#separatewordsearch-option) option for more details.
  * `diacritics` {boolean} - Whether to match diacritic characters (default is `true`)
  * `caseSensitive` {boolean} - Whether to search case sensitive (default is `false`)
  * `accuracy` {string|object} -   (default is `'partially'`):
    * Either one of the following <b>string</b> value:
      * `'partially'` e.g. searching 'a' mark 'a' in words 'and', 'back', and 'visa'.
      * `'exactly'` This option is actually forced to use an accuracy object, because the default word boundaries are white spaces and start/end of a text node content (with `acrossElements` option - start/end of a context).
      * `'startsWith'` e.g. searching 'pre' mark the whole words 'prefix', 'predict', and 'prefab'.  
      * `'complementary'` e.g. searching 'a' mark the whole words 'and', 'back', and 'visa'.  
  
  The **built-in** boundaries for values `startsWith` and `complementary` are:  
  white spaces and `!"#$%&'()*+,-./:;<=>?@[\\]^_{|}~¡¿` characters.

    * Or an <b>object</b> with two properties:
      * `value`: `'exactly'` or `'startsWith'` or `'complementary'`
      * `limiters`: a string or an array of custom word boundary characters,  
        e.g. `{ value : "exactly", limiters : ",.;:?!'\\"()" }`

  * `wildcards` {string} - Two characters `?` and `*` used as wildcards unless they are escaped (default is `disabled`):
    * `disabled`: The characters `?` and `*` match itself
    * `enabled`:
      * The character `?` match any non-white-space character zero or one time.
      * The character `*` match any non-white-space character zero or more times.
    * `withSpaces`:
      * The character `?` match any character zero or one time.
      * The character `*` match any character zero or more times, but as few times as possible.
        
  * `characterSets` {boolean} - Whether to use in search strings RegExp character sets (default is `false`)
    See [character sets](options.html#charsets-option) option for more details.
  * `unicode` {boolean} - Whether to use RegExp `u` flag which allows using unicode class `\p{..}`, `\P{..}`, etc. (default is `false`)
    It can be used with `characterSets`, `ignorePunctuation` options, and custom `accuracy` object to determine words boundaries. 
  
  * `ignoreJoiners` {boolean} - Whether to find matches that contain soft hyphen, zero width space, zero width non-joiner and zero width joiner (default is `false`)
  * `ignorePunctuation` {string|string[]} - A string or an array of punctuation characters (default is `[]`)
  * `synonyms` {object} - An object with synonyms  (default is `{}`)
    e.g. `{ 'one': '1' }` - '1' is synonym for 'one' and vice versa.  
    The value can be an array, e.g. `{ 'be': ['am', 'is', 'are'] }`.
 
  * `acrossElements` {boolean} - Whether to search for matches across elements (default is `false`)
    See [acrossElements](options.html#acrosselements-option) option for more details.
  * `combineBy` or `combinePatterns` {number} - Combine a specified number of individual term patterns into one (default is `10`)
    See [Performance](performance.md#ways-to-boost-performance) for more details.
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

  * `filter : (textNode, term, matchesSoFar, termMatchesSoFar, filterInfo) => {}` {function} - A callback to filter matches. It calls for each match (with `acrossElements` option, if the match is located across several elements, it calls for each text node which is part of the match) (default is )
    * `textNode` {Text} - The text node which includes the match or with `acrossElements` option can be part of the match
    * `term` {string} - The current term
    * `matchesSoFar` {number} - The number of all wrapped matches so far
    * `termMatchesSoFar` {number} - The number of wrapped matches for the current term so far
    * `filterInfo` {object}:
      * `match` {array} - The result of RegExp exec() method
      * `matchStart` {boolean} - indicate the start of a match  AE
      * `execution` {object} - The helper object for early abort:
        * `abort` {boolean} - Setting it to `true` breaks method execution
  
The function **must** return either `true` (to wrap) or `false` (to skip wrapping mark element).  
See [Filtering matches](filtering-matches.md) for more details.

  * `each : (markElement, eachInfo) => {}` {function} - A callback for each marked element (default is )
    * `markElement` {HTMLElement} - The marked DOM element
    * `eachInfo` {object}:
      * `match` {array} - The result of RegExp exec() method
      * `matchStart` {boolean} - Indicate the start of a match  AE
      * `count` {number} - The number of wrapped matches so far
  
See [Code examples](some-examples.md).

  * `done : (totalMarks, totalMatches, termStats) => {}` {function} - A callback on finish (default is )
    * `totalMarks` {number} - The total number of marked elements
    * `totalMatches` {number} - The total number of matches
    * `termStats` {object} - An object containing an individual term's matches count

  * `noMatch : (term) => {}` {function} - A callback that is called when a term has no match at all (default is )
    * `term` {string[]} - An array containing not found term(s)

### Available properties of the `filterInfo` object depending on options

|            options               |    match   |   matchStart   |  execution  |
|----------------------------------|------------|----------------|-------------|
|  acrossElements: true            |     +      |      +         |     +       |
|  acrossElements: false           |     +      |      -         |     +       |


### Available properties of the `eachInfo` object depending on options

|             options              |    match   |    matchStart   | count |
|----------------------------------|------------|-----------------|-------|
|  acrossElements: true            |     +      |      +          |   +   |
|  acrossElements: false           |     +      |      -          |   +   |
  
<details class="internal-code">
<summary><b>Example with default options values</b></summary>

<pre><code class="language-js">const options = {
    element : 'mark',
    className : '',
    separateWordSearch : true,
    diacritics : true,
    exclude : [],
    caseSensitive : false,
    accuracy : 'partially',
    synonyms : {},
    ignoreJoiners : false,
    ignorePunctuation : [],
    wildcards : 'disabled',
    
    acrossElements : false,
    combineBy : 10,
    cacheTextNodes : false,
    blockElementsBoundary : false,
    
    shadowDOM : false,
    iframes : false,
    iframesTimeout : 5000,
    
    filter : (textNode, term, marksSoFar, termMarksSoFar, filterInfo) => {
        return true; // must return either true or false
    },
    each : (markElement, eachInfo) => {},
    done : (totalMarks, totalMatches, termStats) => {},
    noMatch : (term) => {},
    debug : false,
    log : window.console
};
</code></pre>

JavaScript:

<pre><code class='lang-javascript'>
var instance = new Mark(document.querySelector('selector'));
instance.mark('test', options);
</code></pre>

jQuery:

<pre><code class='lang-javascript'>$('selector').mark('test', options);</code></pre>
</details>

* AE - only available when `acrossElements` option is set to `true`
