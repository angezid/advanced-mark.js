### 1.1.1

* Fixed bug that affect wrapping separate groups across elements with combination of `acrossElements`, `cacheTextNodes`, and `separateGroups` options
* Implemented missing `offset` property in filter callback info object with combination of `acrossElements` and `separateGroups` options
* Corrected some mistakes in TypeScript declaration files

### 1.1.0

* Added ability to extend the default boundary elements with custom elements (`blockElementsBoundary` option)

### 1.0.3

* Added TypeScript types declaration files.
* Rewrote `setupIgnoreJoinersRegExp()` method to get rid of a capturing group in `createSynonymsRegExp()` method (it breaks group/term relation when using synonyms with combinePatterns option).
* Rewrote `createDiacriticsRegExp()` method to reduce the size.
* Optimized cache object code.
* Corrected `Elements boundaries` doc.

### 1.0.2

* Initial release
