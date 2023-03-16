# advanced-mark.js

[![npm](https://img.shields.io/npm/v/advanced-mark.js)](https://www.npmjs.com/package/advanced-mark.js)

#### Highlight words, terms, or text on browser page using JavaScript.

To play with this library - [advanced-mark.js-playground](https://github.com/angezid/advanced-mark.js-playground). It requires minimum installation and provides full functionality.
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

This library keeps backward compatibility with `mark.js` v9.0.0 and npm package v8.11.1 on public API level.

[Documentation](https://markjs.io/). Note that this doc is for `mark.js`, it isn't updated for a long time.

## Version 1 doc content
* [Performance](doc/performance.md)
* [mark method](doc/mark-method.md)
* [markRegExp method](doc/markRegExp-method.md)
* [markRanges method](doc/markRanges-method.md)
* [unmark method](doc/unmark-method.md)
* [Callbacks parameters](doc/callbacks-parameters.md)
* [Filtering matches](doc/filtering-matches.md)
* [Highlight separate groups](doc/separate-groups.md)
* [Highlight nesting/overlapping](doc/nesting-overlapping.md)
* [Elements boundaries](doc/elements-boundaries.md)
* [Highlight shadow DOM](doc/shadow-dom.md)
* [TypeScript types](doc/TypeScript-types.md)
* [Some examples](doc/some-examples.md)
* [RegExpCreator module](doc/RegExpCreator-module.md)

## Modules changes
* \*. es6.\*.js now are real ES6 modules
* \*.umd.\*.js are UMD modules, previously was named as \*. es6.\*.js
``` js
import Mark from './mark.es6.js';
// import Mark from './jquery.mark.es6.js';
```
**Warning:** UMD modules will be removed in version 2 - they are kept for backward compatibility.
