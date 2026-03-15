
## unmark() method
### Syntax
``` js
// javascript
const instance = new Mark(context);
instance.unmark([options]);
// jQuery
$(context).unmark([options]);
```
#### Parameters:
* `options` {object} - Optional options:
  * `highlight` {Highlight} - If `highlight` object is specified, the library delete necessary (if <a href="#unmark-exclude">exclude</a> option is specified) or all `Range` objects from the `highlight` object (default is `undefined`)
    **Note:** it's not removed any mark elements; `element` and `className` options are ignored.
  * `highlightName` {string} - A name of the `Highlight` object necessary to unregister it using the `HighlightRegistry` before  deleting ranges and register again if it contains some ranges (default is `'markjs'`)

  * `element` {string} - Specifies marked elements to remove. (default is `'mark'`)
    **Important:** if other than default marked element is used, e.g. `span`, it must be also specified in the `unmark()` method. It is also possible to use `\*` in case of using different marked elements to unmark in one run. A `mark.js` library uses a default selector `\*[data-markjs]` but it is not safe to apply to all HTML elements.
  * `className` {string} - Remove only marked elements with specified class name. (default is `''`)

  * `exclude` {string|string[]} - A string or an array of selectors. Specifies DOM elements that should be excluded from removing highlighting. (default is `[]`)
    **Important:** if highlighting is done using `Highlight` API with `acrossElements` and `rangeAcrossElements` options and wish to exclude element is inside a range, there is no possibility to exclude this element (the whole range will be removed).
  * `shadowDOM` {boolean} - Whether to remove highlighting inside shadow DOMs (default is `undefined`)
    See [Highlighting in shadow DOM](shadow-dom.md) for more details.
  * `iframes` {boolean} - Whether to remove highlighting inside iframes (default is `false`)
  * `iframesTimeout` {number} - The max time to wait for iframe(s) to load before skipping (default is `5000` ms)
  * `debug` {boolean} - Whether to log messages (default is `false`)
  * `log` {object} - Log messages to a specific object (default is `console`)
  * `done: () => {}` {function} - A callback after highlighting was removed (default is )
    It has no parameters.
  
<details class="internal-code">
<summary><b>Example with default options values</b></summary>

<pre><code class="language-js">const options = {
    highlight: undefined,
    highlightName: 'markjs',
    element: 'mark',
    className: '',
    shadowDOM: false,
    iframes: false,
    iframesTimeout: 5000,
    done: () => {},
    debug: false,
    log: window.console
};
</code></pre>

JavaScript:

<pre><code class='lang-javascript'>
var instance = new Mark(document.querySelector('selector'));
instance.unmark(options);
</code></pre>

jQuery:

<pre><code class='lang-javascript'>$('selector').unmark(options);</code></pre>
</details>
