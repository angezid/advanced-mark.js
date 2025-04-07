
## Options descriptions

**Note:** this is still under development.

### `acrossElements` option
With this option the library aggregate all context(s) text node contents into a single string taking into account HTML elements.  
If a block element 'divides' two text nodes, and `node.textContent`s doesn't separated by white space, the space is added to the string to separate them,  
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
  e.g. `{ value : 'exactly', limiters : ",.;:?!'\\"()" }`

**AE** - with option `acrossElements: true` or `acrossElements: inline`.


``` js

```
 