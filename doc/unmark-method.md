
## unmark() method

**See [Documentation](https://angezid.github.io/advanced-mark.js/doc-v1) for advanced-mark.js v1 on GitHub Pages.**


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
  * `element` {string} - Specifies marked elements to remove. (default is `mark`)
    **Important:** if you use other than default marked element, e.g. `span`, you must also use it in `unmark()` options explicitly. It is also possible to use `*` in case of using different marked elements to unmark in one run. `mark.js` library uses a default selector `*[data-markjs]` but it is not safe to apply to all HTML elements.
  * `className` {string} - Remove only marked elements with specified class name. (default is `''`)
  * `exclude` {string|string[]} - A string or an array of selectors. Specifies DOM elements that should be excluded from searching. (default is `[]`)
  * `shadowDOM` {boolean} - Whether to search inside shadow DOMs (default is `undefined`)
    See [Highlighting in shadow DOM](shadow-dom.md) for more details.
  * `iframes` {boolean} - Whether to search inside iframes (default is `false`)
  * `iframesTimeout` {number} - The max time to wait for iframe(s) to load before skipping (default is `5000` ms)
  * `debug` {boolean} - Whether to log messages (default is `false`)
  * `log` {object} - Log messages to a specific object (default is `console`)
  * `done : () => {}` {function} - A callback after all specified marked elements were removed (default is )
    It has no parameters.
  
<details id="internal-code">
<summary><b>Example with default options values</b></summary>

<pre><code class="language-js">const options = {
    element : 'mark',
    className : '',
    shadowDOM : false,
    iframes : false,
    iframesTimeout : 5000,
    done : () => {},
    debug : false,
    log : window.console
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
