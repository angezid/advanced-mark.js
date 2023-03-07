# advanced-mark.js

[![npm](https://img.shields.io/npm/v/advanced-mark.js)](https://www.npmjs.com/package/advanced-mark.js)

#### Highlight words, terms, or text on browser page using JavaScript.

To play with this library - [Markjs-playground](https://github.com/angezid/Markjs-playground). It requires minimum installation and provides full functionality.
It also can be used with the old `mark.js` - it's install npm package v8.11.1.
It has some built-in examples. 

What is done:
* `filter`, `each`, and `done` callbacks have received additional parameters; they expose useful information that can simplify the code, help solve problems which are difficult or not possible to implement externally.
* The `acrossElements` option - advance across elements pipeline, which boosts performance (also affects `markRanges()` method),
  allows correctly highlight (especially minified) HTML with the requirement `exactly` in `mark()` or `markRegExp()` methods ...
* `combinePatterns` option - boosts performance of `mark()` method when highlighting array
* `cacheTextNodes` option - improves performance of `mark()` method when highlighting array
* `separateGroups` option - allows highlighting RegExp capturing groups instead of the whole match, handle RegExp with/without the `d` flag
* `wrapAllRanges` option - allows highlighting nesting/overlapping ranges and RegExp capturing groups
* `blockElementsBoundary` option - limits matches within HTML block elements, when highlighting phrases or RegExp groups with `acrossElements` option
* `shadowDOM` option - allows highlighting shadow DOM ('mode: open' and is already built)

This library from v2.0.0 doesn't guaranty backward compatibility with `mark.js` v9.0.0 and npm package v8.11.1.

Main doc - [Documentation](https://markjs.io/). Note that this doc is for old `mark.js`.

## Version 2 doc content:
* [Performance](doc_v2/performance.md)
* [mark method](doc_v2/mark-method.md)
* [markRegExp method](doc_v2/markRegExp-method.md)
* [markRanges method](doc_v2/markRanges-method.md)
* [Filtering matches](doc_v2/filtering-matches.md)
* [Highlight separate groups](doc_v2/separate-groups.md)
* [Highlight nesting/overlapping](doc_v2/nesting-overlapping.md)
* [Elements boundaries](doc_v2/elements-boundaries.md)
* [Highlight shadow DOM](doc_v2/shadow-dom.md)
* [Some examples](doc_v2/some-examples.md)
* [RegExpCreator module](doc_v2/RegExpCreator-module.md)

## Modules changes
* \*. es6.\*.js now are real ES6 modules. They are actually UMD modules in `mark.js` v9.0.0 and npm package v8.11.1.

``` js
import Mark from './mark.es6.js';
// import Mark from './jquery.mark.es6.js';
```
UMD modules are removed in v2.0.0.
