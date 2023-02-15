
### 2.0.0

Rewrote `DOMIterator` iframe related code.
Rewrote `unwrapMatches()` method for performance reason.
Rewrote `getTextNodesAcross()` method (previous named as 'getTextNodesAcrossElements') to change the logic which determines does the two text nodes are separated by block element.

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
