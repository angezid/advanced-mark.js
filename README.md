# mark.js

##### Highlight keywords using JavaScript. Intended for every use case. <br> Can e.g. be used to mark text in search results.

More info and how to use can be found here [Radical changes of across elements pipeline](https://github.com/julmot/mark.js/pull/450).  
To play with mark.js - [Markjs-playground](https://github.com/angezid/Markjs-playground). It's requires minimum installation and provides full functionally.

## Modules
* \*. es6.\*.js now are real ES6 modules
* \*.umd.\*.js are UMD modules. They previously named as \*. es6.\*.js

It was tested on Firefox and Chrome.

### RegExpCreator module
It's exposes two API methods - `create()` and `createDiacritics()`.  
The `create(term, true)` method with the second parameter set to true returns an object containing three string properties instead of RegExp:
* `lookbehind` - is actuality a capturing group; it's non empty only with option `accuracy : 'exactly'`; 
  it can be easily converted to real lookbehind by replacing the first `(` by `(?<=`
* `pattern` - a term pattern
* `lookahead` - is real lookahead assertion pattern

The `createDiacritics(term)` method returns a term diacritic pattern.

``` js
import RegExpCreator from './regexpcreator.es6.js';
// the `options` object accepts : accuracy, diacritics, synonyms, caseSensitive,
// ignoreJoiners, ignorePunctuation, wildcards
const creator = new RegExpCreator(options);
const obj = creator.create(term, true);
console.log(obj.lookbehind, obj.pattern, obj.lookahead);
```

## Mark shadow DOM
With `shadowDOM` option mark.js now is able to highlight shadow DOM.  
You can play with [Markjs-playground](https://github.com/angezid/Markjs-playground). Import `JSON -> Examples -> Shadow DOM`.  
**Note** that option `shadowDOM : {style : 'your mark element style'}` creates a style element and inserts it at the beginning of shadow root child node(s).  
This operation is invasive, it can break code.  
An inline style can be used as an alternative:
``` js
each : (elem, info) => {
    if(elem.getRootNode().nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        elem.style.color = "red";
    }
}
```
