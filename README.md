# advanced-mark.js

[![npm](https://img.shields.io/npm/v/advanced-mark.js)](https://www.npmjs.com/package/advanced-mark.js)

### A fast JavaScript library to highlight text on a browser page. It also supports virtual DOMs.

This library from v2.0.0 doesn't guaranty backward compatibility with *mark.js* v9.0.0 and npm package v8.11.1.

What is done:
* rewritten across elements pipeline for performance reason and additional features
* rewritten domiterator class to handle iframes and shadow DOMs
* `filter`, `each`, and `done` callbacks additional parameters expose useful data that can 'deprive' you from 'happy hacking'

Added options:
* `combinePatterns` - boosts performance of `mark()` method when highlighting an array of terms
* `cacheTextNodes` - improves performance of `mark()` method when highlighting an array of terms
* `separateGroups` - allows highlighting RegExp capturing groups instead of the whole match
* `wrapAllRanges` - allows highlighting nesting/overlapping ranges and RegExp capturing groups
* `markLines` - allows highlighting ranges of lines
* `blockElementsBoundary` - limits matches within HTML block elements
* `shadowDOM` - allows highlighting inside shadow DOM

And a lot of other fixings, improvements ...

[Playground](https://angezid.github.io/advanced-mark.js/playground) and
[Documentation](https://angezid.github.io/advanced-mark.js/doc-v2) for `advanced-mark.js` v2.

Also may be useful to read [Documentation](https://markjs.io/). Note that this doc is for old *mark.js*.

## Modules changes
* \*. es6.\*.js now are real ES6 modules. They are actually UMD modules in *mark.js*.

``` js
import Mark from './mark.es6.js';
// import Mark from './jquery.mark.es6.js';
```

Added `node.jquery.mark.es6.js` module, which is intended to use on Node.js and contains necessary `import $ from 'jquery'` declaration.  
The modules `jquery.mark.es6.js` and `jquery.mark.es6. min.js` can be used directly in browsers (global $ or import $).

## Virtual DOMs
See [JSDOM test](jsdom-tests/test.js).
