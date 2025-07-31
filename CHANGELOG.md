
### 2.7.0
* Added source code to the npm package.

### 2.6.0
* Added ability to mark inside iframes in shadow DOM.
* Changed the way to truck iframes states (dropped using attribute).
* Added ability to use HTMLCollection (returned by 'getElementsByClassName()' and 'getElementsByTagName()').

### 2.5.0
* Added ability to select iframe elements when using non-jQuery libraries and iframe elements are dynamically created by javascript.
* Fixed multiple wrapping of highlighted text in mark elements that can occur on some conditions with `iframes` option (page contains several iframes and selecting several contexts). Previous 2.x.x versions correctly handle only one context.
* Fixed bug that is related to old browsers in DOMIterator class, e.g. IE11. (introduced in v2.4.1)

### 2.4.2
* Fixed bug that occurs in `markRanges()` API then an array of ranges have a single item and a range `start` property is zero.

### 2.4.1
* Fixed infinite loop that can occur with `ignoreGroups` option in markRegExp() API with the conditional main group.
* Fixed missing window object of the Node interface (causes an exception in virtual DOM environments when context is an array of elements).

### 2.4.0
* Fixed handling escaped wildcards characters (backslashes were stripped from searching string, e.g. 'C:\\\\\\\\&#42;' resulted in 'C:\\\\&#42;' and is treated as escape '*', not a wildcard)
* Fixed breaking UTF-16 surrogate pairs and continues pairs of backslashes by joiners/punctuation
* Slightly reduce a code size

### 2.3.0

* Added `preserveTerms` value for `separateWordSearch` option that allows highlight exact term(s) alone side with separate word(s).
* Added 'startsWith' value for accuracy option that allows highlight whole word(s) just typing the start of it(s). It also works with `preserveTerms`.

### 2.2.0

* Added ability to mark line ranges (`markRanges()` API with `markLines` option).
* Fixed handling `br` element in `getTextNodesAcross()` method.
* Fixed negative value of the start index in `wrapRangeAcross()` method with `wrapAllRanges` option, which can occur in some cases.
* An improvement that allows usage of RegExp conditional capturing groups with  `ignoreGroups` option in `markRegExp()` API.

### 2.1.2

* Fixed problem with 'jquery.mark.es6.js' module by adding `node.jquery.mark.es6.js` module, which contains `import $ from 'jquery';` statement necessary on Node.js.
* Added missing `őŐűŰ` diacritic characters in RegExpCreator class.

### 2.1.1

* Fixed debug logging to the console.
* Improved detection of custom window object and as a result getting a clear error message on the non-valid object.

### 2.1.0

* Fixed bug related using a wildcards character `*` with `wildcards : 'withSpaces'`, `acrossElements` , and `blockElementsBoundary` options.
* Added supports for virtual DOM environments such as JSDOM. Thanks to [Tyler Nickerson](https://github.com/Nickersoft) for the contribution.

### 2.0.0

* Rewrote `DOMIterator` iframe related code. Added code sorting a custom array of elements by the DOM order -  can affect `markRanges()` method.
* Rewrote `unwrapMatches()` method for performance reason.
* Rewrote `getTextNodesAcross()` method (previously named as 'getTextNodesAcrossElements') to change the logic which determines does the two text nodes are separated by block element.
* Rewrote `markRanges` related code (to simplify the code).
* Changes in `mark()` and `markRegExp()` methods: the `filter` callback parameters that count mark elements has been changed to count matches. It can affect the old code that uses `acrossElements` option.
* Simplified `getSeparatedKeywords()` method.
* Got rid of empty sibling text nodes that are created when `Text.splitText()` method splits a text node at the start or/and at the end.
* Changes in RegExpCreator class:
  1. removed unnecessary escaping of characters in a RegExp character set
  2. added ability to using string instead of array in 'ignorePunctuation' option and accuracy object
  3. added code which remove duplicate from array of characters or synonyms

### 1.1.2

* Fixed bug related using a wildcards character `*` with `wildcards : 'withSpaces'`, `acrossElements` , and `blockElementsBoundary` options.
* Fixed types path in package.json.

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
