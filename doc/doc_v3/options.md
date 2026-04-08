
## Options descriptions

**Note:** this is still under development.

### `acrossElements` option
With this option, the library aggregates all context(s) text node contents into a single string taking into account HTML elements.  
If two text nodes are divided by a block element, and `node.textContent`s doesn't separated by white spaces, a space is added to the string to separate them,  
e.g. '&lt;h1&gt;Header&lt;/h1&gt;&lt;p&gt;Paragraph&lt;/p&gt;' resulted in 'Header Paragraph' (in *mark.js* - 'HeaderParagraph').

Due to searching in single string, it can highlight matches across HTML block elements, which in most cases are undesirable.
A `blockElementsBoundary` option can be used to limit matches within HTML elements. See [Elements boundaries](elements-boundaries.md) for more details.

### `separateWordSearch` option
When it is set to `true`, if a searching string contains several words, it splits the string by spaces into separate words and highlights individual words instead of the whole string.
It also applies to every string in a search array.

When it is set to `'preserveTerms'`, it preserves the term(s) surrounded by double quotes from breaking into separate words.  
This allows highlighting exact term(s) alongside with individual words.  
It can be useful when the library is used to highlight searches or in the case of using a string instead of an array, and there is a need to keep some term(s) intact.

It also allows highlighting quoted terms no matter how many quotes it contains on each side (but not in the middle),
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
new Mark('section').mark(['Lorem', 'dolor'], {
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

**AE** - with the option `acrossElements: true`.

### `combineBy` option
Old name is `combinePatterns`. Related to `mark()` method.  
This option allows to control how many individual terms will be processed at run, e.g., an array of 50 strings, `combineBy: 10` - the library creates 5 combine patterns and perform 5 runs.  
Any number bigger than the array length or `Infinity` creates a single combined pattern.  
If there is a need to highlight terms one by one, use `combineBy: 1`.

**Note:** when highlighting a (especially) large array of strings with the `diacritics` option (`ignorePunctuation` and `ignoreJoiners` options also affect size), a single pattern can be monstrous and slower (it can also exceed the browser RegExp size limit); it's better to create several patterns.   
   Also, a single pattern prevents highlighting inside already highlighted elements.

``` js
instance.mark([ 'str1', 'str2', .. ], {
  'combineBy': number  // default number is 10
});
```

### `iframes` option
To customize the style of mark elements in iframe, the option `iframes: { style: 'your mark element style' }` can be used.   
To customize the style of highlighting when using a `Highlight` API the pseudo-element `::highlight(custom-highlight-name) { your highlight style }` should be added to the `iframes` style property.  
The library creates a `style` element with the attribute 'data-markjs' and appends it to an iframe head element.  
**Note** that the style is added to an iframe no matter whether it contains any matches or not.  

An `unmark()` method will remove the style from an iframe if it call with option `iframes: { style: 'any string' }`.  

### `shadowDOM` option
The option `shadowDOM: true` allows to highlight a text inside shadow DOMs that have `mode: 'open'` option and are already created.  
You can play with Playground - Examples -> Shadow DOM.

To customize the style of mark elements in shadow DOM, the option `shadowDOM: { style: 'your mark element style' }` can be used.   
To customize the style of highlighting when using a `Highlight` API the pseudo-element `::highlight(custom-highlight-name) { your highlight style }` should be added to the `shadowDOM` style property.  
The library creates a `style` element with the attribute 'data-markjs' and appends it at the end of shadow root child nodes.  
**Note** that the style is added to the shadow root no matter whether it contains any matches or not.

An `unmark()` method will remove the style from a shadow root if it call with option `shadowDOM: { style: 'any string' }`.

An inline style can be used as an alternative:
**Warning:** it's not workable when using a `Highlight` API.

``` js
each: (markElement, info) => {
  // a shadow root is the DocumentFragment
  if (markElement.getRootNode().nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    markElement.style.color = "red";
  }
}
```

### `highlight` option
This option allows using [CSS Custom Highlight API](https://developer.mozilla.org/developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API.html).

If a `Highlight` object is provided, the library creates `StaticRange/Range` objects of matches, adds them to the `Highlight` object, and registers it using the `HighlightRegistry` when it finishes.  
**Note** that the `each` callback's first parameter is the `StaticRange/Range` object instead of an HTML element.

If a browser does not support the Highlight API, the library wrap matches in HTML elements.

``` js
const array = [,,,,];
let highlight;

// checks whether the browser supports the Highlight API
if (typeof Highlight !== 'undefined') {
	highlight = new Highlight();
}

new Mark(ctx).mark(array, {
    highlight: highlight,
    highlightName: 'my-highlight'
});
```
CSS
``` css
::highlight(my-highlight) {
  background-color: yellow;
}
```

### `staticRanges` option
When using `Range` objects one serious problem was discovered: after the library runs using a Highlight API, there is a huge performance degradation if the next run wraps matches in HTML elements.  
The library splits text nodes when wrapping matches in HTML elements and this is forced the browser to re-calculate layout and re-render highlights.  

This performance problem is solved by using `StaticRange` objects, but it may raise another problem - a `StaticRange` does not keep the same content on document changes.

So, be aware of possible performance issue, when setting option `staticRanges: false`.

### `rangeAcrossElements` option
This option allows creating a single range for matches located across elements when using the Highlight API with the `acrossElements` (`markRanges()` API does not require this) option.
**Note** that the `filter` callback's first parameter is an array of text node(s) containing a match instead of a text node.

When it is set to `false`, the number of `StaticRange/Range` objects is equal to the number of marked elements (the library creates a `StaticRange/Range` object instead of creating an element).  
It can be useful for compatibility: the only difference is `each` callback's first parameter - a `StaticRange/Range` object instead of an HTML element.


``` js

```
 