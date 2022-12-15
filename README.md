# mark.js

##### Highlight keywords using JavaScript. Intended for every use case.  
Can e.g. be used to mark text in search results.

To play with this library - [Markjs-playground](https://github.com/angezid/Markjs-playground). It requires minimum installation and provides full functionality.
Also, it has built-in examples. 

What's done:
* `acrossElements` option - advance across elements pipeline, which boosts performance,
  allows correctly highlight compressed HTML with the requirement `exactly` in `mark()` or `markRegExp()` methods
* `combinePatterns` option - boosts performance of `mark()` method when highlighting array
* `cacheTextNodes` option - improves performance of `mark()` method when highlighting array
* `separateGroups` option - allows highlighting RegExp capturing groups instead of matches, handle RegExp with/without the `d` flag
* `wrapAllRanges` option - allows highlighting nesting/overlapping ranges and RegExp capturing groups
* `blockElementsBoundary` option - limits matches within HTML block elements or custom elements
* `shadowDOM` option - allows highlighting shadow DOM

This library keep backward compatibility with v9.0.0 and npm package v8.11.1 on public API level.

Main doc - [Documentation](https://markjs.io/).

## Content
* [Performance](performance.md)
* [Callbacks parameters](doc/callbacks-parameters.md)
* [Filtering matches](doc/filtering-matches.md)
* [Highlight separate groups](doc/separate-groups.md)
* [Highlight nesting/overlapping](doc/nesting-overlapping.md)
* [Elements boundaries](doc/elements-boundaries.md)
* [Highlight shadow DOM](doc/shadow-dom.md)
* [Some examples](doc/some-examples.md)
* [RegExpCreator module](doc/RegExpCreator-module.md)

## Modules changes
* \*. es6.\*.js now are real ES6 modules
* \*.umd.\*.js are UMD modules, previously was named as \*. es6.\*.js
``` js
import Mark from './mark.es6.js';
// import Mark from './jquery.mark.es6.js';
```
