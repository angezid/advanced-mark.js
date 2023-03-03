
### 2.0.0

* Rewrote `DOMIterator` iframe related code. Added code sorting a custom array of elements by the DOM order -  can affect `markRanges()` method.
* Rewrote `unwrapMatches()` method for performance reason.
* Rewrote `getTextNodesAcross()` method (previously named as 'getTextNodesAcrossElements') to change the logic which determines does the two text nodes are separated by block element.
* Rewrote `markRanges` related code (to simplify the code).
* Changes in `mark()` and `markRegExp()` methods: the `filter` callback parameters that count mark elements has been changed to count matches. It can affect the old code that uses `acrossElements` option.
* Simplified `getSeparatedKeywords()` method.
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
