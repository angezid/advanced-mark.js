
## RegExpCreator module

It exposes three API - `create()`, `createCombinePattern()` and `createDiacritics()` methods.  
The `create(string, true)` method with the second parameter set to true returns an object containing three properties instead of RegExp:
* {string} `lookbehind` - is actuality a capturing group; is non empty group only with `accuracy : 'exactly'` or `{ 'value': 'exactly', 'limiters': [..] }`;
  it can be easily converted to real lookbehind by replacing the first `(` by `(?<=`
* {string} `pattern` - a string pattern
* {string} `lookahead` - is real lookahead assertion pattern; is non empty string only with `accuracy : 'exactly'` or `{ 'value': 'exactly', 'limiters': [..] }`

Those options can be used: `accuracy`, `diacritics`, `synonyms`, `caseSensitive`, `ignoreJoiners`, `ignorePunctuation`, and `wildcards`.

``` js
import RegExpCreator from './regexpcreator.es6.js';
const creator = new RegExpCreator(options);
const obj = creator.create(string, true);
console.log(obj.lookbehind, obj.pattern, obj.lookahead);
```

The `createCombinePattern(array, capture)` method creates combine pattern from the array of string; returns an object containing three properties:
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
It's affected only one option : `caseSensitive`.
``` js
import creator from './regexpcreator.es6.js';
const pattern = new creator(options).createDiacritics(string);
console.log(pattern);
```
