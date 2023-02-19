
### 2.0.0

* Rewrote `DOMIterator` iframe related code.
* Rewrote `unwrapMatches()` method for performance reason.
* Rewrote `getTextNodesAcross()` method (previously named as 'getTextNodesAcrossElements') to change the logic which determines does the two text nodes are separated by block element.
* Rewrote `markRanges` related code (to simplify the code).
* Changes in `mark()` and `markCombinePatterns()` methods (important: in `filter` callback the parameters that count mark elements now count matches - affects code that uses `acrossElements` option), simplified `getSeparatedKeywords()` method.
* Got rid of empty sibling text nodes that are created when `Text.splitText()` method splits a text node at the start or/and at the end.

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
