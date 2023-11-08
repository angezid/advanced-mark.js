# advanced-mark.js

[![npm](https://img.shields.io/npm/v/advanced-mark.js)](https://www.npmjs.com/package/advanced-mark.js)

### A fast JavaScript library to highlight any text on a browser page. It also supports virtual DOMs.

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

### License

[MIT](LICENSE)
