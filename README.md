# advanced-mark.js

[![npm](https://img.shields.io/npm/v/advanced-mark.js)](https://www.npmjs.com/package/advanced-mark.js)

#### Highlight words, terms, or text on a browser page using JavaScript.

To play with this library - [advanced-mark.js-playground](https://github.com/angezid/advanced-mark.js-playground). It requires minimum installation and provides full functionality.
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

See [Documentation](https://angezid.github.io/advanced-mark.js/doc-v2) for `advanced-mark.js` v2.
Note that it's still under development.

Also may be useful to read [Documentation](https://markjs.io/). Note that this doc is for old `mark.js`.

## Modules changes
* \*. es6.\*.js now are real ES6 modules. They are actually UMD modules in `mark.js` v9.0.0 and npm package v8.11.1.

``` js
import Mark from './mark.es6.js';
// import Mark from './jquery.mark.es6.js';
```
UMD modules are removed in v2.0.0.
