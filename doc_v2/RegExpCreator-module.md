
## RegExpCreator module

It exposes three API methods:
* [create()](regexpcreator.md#117)
* [createCombinePattern()](regexpcreator.md#155)
* [createDiacritics()](regexpcreator.md#344)

#### create()
The `create(string, true)` method with the second parameter set to `true` instead of RegExp, returns an object containing three properties:
* {string} `lookbehind` - is actuality a capturing group; is non-empty group only with [accuracy](mark-method.md#mark-accuracy) option: `'exactly'` or `{ 'value' : 'exactly', 'limiters': [..] }`.  
  It can be easily converted to real lookbehind by replacing the first `(` by `(?<=`.
* {string} `pattern` - a string pattern
* {string} `lookahead` - is real lookahead assertion pattern; is non-empty string only with [accuracy](mark-method.md#mark-accuracy) option: `'exactly'` or `{ 'value' : 'exactly', 'limiters': [..] }`
These properties can be used in options object: [accuracy](mark-method.md#mark-accuracy), [diacritics](mark-method.md#mark-diacritics), [synonyms](mark-method.md#mark-synonyms), [caseSensitive](mark-method.md#mark-caseSensitive), [ignoreJoiners](mark-method.md#mark-ignoreJoiners), [ignorePunctuation](mark-method.md#mark-ignorePunctuation), and [wildcards](mark-method.md#mark-wildcards).

See [mark() method](mark-method.md) for properties details.

``` js
import RegExpCreator from './regexpcreator.es6.js';
const creator = new RegExpCreator(options);
const obj = creator.create(string, true);
console.log(obj.lookbehind, obj.pattern, obj.lookahead);
```

#### createCombinePattern()
The `createCombinePattern(array, capture)` method creates combine pattern from an array of string; returns an object containing three properties:
* {string} `lookbehind` - is the same as in `create()` method;
* {string} `pattern` - a combine pattern itself.
  If the `capture` parameter set to true, an individual pattern is wrapped in a capturing group, false - non-capturing group.
* {string} `lookahead` - is the same as in `create()` method;

``` js
// the 'creator' and the accepted options are the same as in above example
const obj = creator.createCombinePattern(array, true);
console.log(obj.pattern);  // true - (ptn1)|(ptn2)|(ptn3); false - (?:ptn1)|(?:ptn2)|(?:ptn3)
```

#### createDiacritics()
The `createDiacritics(string)` method returns a string diacritic pattern.
It's affected only by one option : [caseSensitive](mark-method.md#mark-caseSensitive).
``` js
import creator from './regexpcreator.es6.js';
const pattern = new creator(options).createDiacritics(string);
console.log(pattern);
```
