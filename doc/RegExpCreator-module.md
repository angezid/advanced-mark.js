
## RegExpCreator module

**See [Documentation](https://angezid.github.io/advanced-mark.js/doc-v1) for advanced-mark.js v1 on GitHub Pages.**




It exposes three API - `create()`, `createCombinePattern()` and `createDiacritics()` methods.  
The `create(string, true)` method with the second parameter set to `true` instead of RegExp, returns an object containing three properties:
* {string} `lookbehind` - is actuality a capturing group; is non empty group only with accuracy: `'exactly'` or `{ 'value' : 'exactly', 'limiters': [..] }`.
  It can be easily converted to real lookbehind by replacing the first `(` by `(?<=`.
* {string} `pattern` - a string pattern
* {string} `lookahead` - is real lookahead assertion pattern; is non empty string only with accuracy: `'exactly'` or `{ 'value' : 'exactly', 'limiters': [..] }`

These properties can be used in options object: `accuracy`, `diacritics`, `synonyms`, `caseSensitive`, `ignoreJoiners`, `ignorePunctuation`, and `wildcards`.
See [mark() method](mark-method.md) for properties details.

``` js
import RegExpCreator from './regexpcreator.es6.js';
const creator = new RegExpCreator(options);
const obj = creator.create(string, true);
console.log(obj.lookbehind, obj.pattern, obj.lookahead);
```

The `createCombinePattern(array, capture)` method creates combine pattern from an array of string; returns an object containing three properties:
* {string} `lookbehind` - is the same as in `create()` method;
* {string} `pattern` - a combine pattern itself.
  If the `capture` parameter set to true, an individual string pattern is wrapped in a capturing group, false - non-capturing group.
* {string} `lookahead` - is the same as in `create()` method;

``` js
// the 'creator' and the accepted options are the same as in above example
const obj = creator.createCombinePattern(array, true);
console.log(obj.pattern);  // true - (ptn1)|(ptn2)|(ptn3); false - (?:ptn1)|(?:ptn2)|(?:ptn3)
```

The `createDiacritics(string)` method returns a string diacritic pattern.
It's affected only by one option : `caseSensitive`.
``` js
import creator from './regexpcreator.es6.js';
const pattern = new creator(options).createDiacritics(string);
console.log(pattern);
```
