
## Options descriptions

**Note:** this is still under development.

### `acrossElements` option
With this option the library aggregate all context(s) text node contents into a single string taking into account HTML elements.  
If a block element 'divides' two text nodes, and `node.textContent`s doesn't separated by white spaces, the space is added to the string to separate them,  
e.g. '&lt;h1&gt;Header&lt;/h1&gt;&lt;p&gt;Paragraph&lt;/p&gt;' resulted in 'Header Paragraph' (in *mark.js* - 'HeaderParagraph').

Due to searching in single string, it can highlight matches across HTML block elements, which in most cases are undesirable.
A `blockElementsBoundary` option can be used to limit matches within HTML elements. See [Elements boundaries](elements-boundaries.md) for more details.

### `separateWordSearch` option
When it set to `true`, if a searching string contains several words, it splits the string by spaces into separate words and highlights individual words instead of the whole string.  
It also applies to every string in a searching array.

When it set to `'preserveTerms'`, it preserved term(s) surrounding by double quotes from breaking into separate words.  
This allows highlight exact term(s) alone side with individual words.  
It can be useful, when library is used to highlight searchings or in case of using a string instead of an array and there is need to keep some term(s) intact.

It also allows highlight quoted terms no matter how many quotes it contains on each side (but not in the middle),  
e.g. `""term""` - marked `"term"`, `""""term"` - `"""term`.

### `exclude` option
In the case if the context contains element(s) matches in which shouldn't be highlighted, the `exclude` option can be pretty handy.

``` html
<section>
    <p>Lorem ipsum dolor</p>
    <p>Lorem ipsum dolor</p>
    <p>Lorem <i>ipsum <b>dolor</b></i></p>
</section>
```
``` js
new Mark(document.querySelector("section")).mark("Lorem dolor", {
  // Note: to exclude all descendants, you need to add 'p:last-child *' selector
  exclude: 'p:last-child, p:last-child *'
});
```

### `accuracy` option
The option values specify how library should perform searching:

* `partially` (contains) - searches for matches within a text node content (AE - within an aggregated context string). Can highlight practically anything.

* `exactly` - the default word boundaries are:
  * start - the start of a text node (AE - start of a context) and the *built-in* boundaries.
  * end - the end of a text node (AE - end of a context) and the *built-in* boundaries.

* `startsWith` - the default word boundaries are:
  * start - the start of a text node (AE - start of a context) and the *built-in* boundaries.
  * end - searching will continued til *built-in* word boundaries or to the end of a text node content (AE - to the end of a context).

* `complementary` - the default word boundaries are:
  * start - will search for the start of *built-in* boundaries or to the start of a text node content (AE - to the start of a context).
  * end - searching will continued til *built-in* word boundaries or to the end of a text node content (AE - to the end of a context).

The **built-in** word boundary characters are: white spaces and `!"#$%&'()*+,-./:;<=>?@[\\]^_{|}~¡¿`.

An accuracy object can be used if the default boundaries are not satisfactory:
* `value`: `'exactly'` or `'startsWith'` or `'complementary'`
* `limiters`: a string or an array of custom word boundary characters,  
  e.g. `{ value: 'exactly', limiters: ",.;:?!'\\"()" }`

**AE** - with option `acrossElements: true`.

### `highlight` option
This option allows using [CSS Custom Highlight API](https://developer.mozilla.org/developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API.html).

If a `Highlight` object is provided, the library creates `Range` objects of matches, adds them to the `Highlight` object, and registers it using the `HighlightRegistry` when it finishes.  
**Note** that `each` callback's first parameter is the `Range` object instead of an HTML element.

If a browser does not support the Highlight API, the library wrap matches in HTML elements.

**Warning:** when highlighting  for performance reasons set `combineBy: Infinity` option, if the browser RegExp size limit isn't exceeded.

One serious problem was discovered: after the library runs using Highlight API, there is a huge performance degradation (a hundred times) if the next run is wrapping matches in HTML elements, but not vice versa.  

There is some explanation of the problem: [Custom Highlight API causing significant slowdowns with large amounts of nodes](https://stackoverflow.com/questions/78140011/custom-highlight-api-causing-significant-slowdowns-with-large-amounts-of-nodes).  
This library splits text nodes before wrapping matches in HTML elements. Obviously, it has a much more detrimental effect on performance than in the above link.

This means: use only the Highlight API or if there is a need to wrap some matches in HTML elements, wrap them first and then switch to using the Highlight API.

``` js
const array = [,,,,];
let highlight;

if (typeof Highlight !== 'undefined') {
	highlight = new Highlight();
}

new Mark(ctx).mark(array, {
    highlight: highlight,
    highlightName: 'my-highlight' // custom Highlight name
});
```

``` css
/*::highlight(markjs) {*/ /*default Highlight name*/
::highlight(my-highlight) {
  background-color: yellow;
}
```

### `rangeAcrossElements` option
This option allows creating a single range for matches located across elements when using the Highlight API with `acrossElements` option (`markRanges()` API hasn't requires `acrossElements` opt.).  
**Note** that `filter` callback's first parameter is an array of text node(s) containing match instead of a text node.

When it is set to `false` the number of `Range` objects is equal to the number of marked elements (the library creates `Range` object instead of creating an element).  
It can be useful for compatibility: the only difference is `each` callback's first parameter that is a `Range` object instead of an HTML element.



``` js

```
 