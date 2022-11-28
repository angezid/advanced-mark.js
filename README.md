# mark.js

##### Highlight keywords using JavaScript. Intended for every use case. <br> Can e.g. be used to mark text in search results.

More info and how to use can be found here [Radical changes of across elements pipeline](https://github.com/julmot/mark.js/pull/450).  
To play with mark.js - [Markjs-playground](https://github.com/angezid/Markjs-playground). It's requires minimum installation and provides full functionally.

## Modules
* \*. es6.\*.js now are real ES6 modules
* \*.umd.\*.js are UMD modules. They previously named as \*. es6.\*.js
``` js
import Mark from './mark.es6.js';
// import Mark from './jquery.mark.es6.js';
```
It was tested on Firefox and Chrome.

### RegExpCreator module
It's exposes two API methods - `create()` and `createDiacritics()`.  
The `create(string, true)` method with the second parameter set to true returns an object containing three string properties instead of RegExp:
* `lookbehind` - is actuality a capturing group; is non empty group only with `accuracy : 'exactly'`; 
  it can be easily converted to real lookbehind by replacing the first `(` by `(?<=`
* `pattern` - a string pattern
* `lookahead` - is real lookahead assertion pattern; is non empty string only with `accuracy : 'exactly'`;

``` js
import RegExpCreator from './regexpcreator.es6.js';
// the `options` object accepts : accuracy, diacritics, synonyms, caseSensitive,
// ignoreJoiners, ignorePunctuation, wildcards
const creator = new RegExpCreator(options);
const obj = creator.create(string, true);
console.log(obj.lookbehind, obj.pattern, obj.lookahead);
```

The `createDiacritics(string)` method returns a string diacritic pattern.
``` js
import creator from './regexpcreator.es6.js';
// the `options` object accepts only : caseSensitive
const pattern = new creator(options).createDiacritics(string);
console.log(pattern);
```

## Mark a shadow DOM
With an option `shadowDOM : true` the mark.js now is able to highlight shadow DOM.  
You can play with Markjs-playground. Import `JSON -> Examples -> Shadow DOM`.  
**Note:** to style mark elements in shadow DOM, the option `shadowDOM : {style : 'your mark element style'}` can be used.  
It creates a style element and inserts it at the beginning of shadow root child node(s).  
But this operation is invasive, it can break root code.  
An inline style can be used as an alternative:
``` js
each : (elem, info) => {
  // a shadow root is the DocumentFragment
  if(elem.getRootNode().nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    elem.style.color = "red";
  }
}
```
