# advanced-mark.js

[![npm](https://img.shields.io/npm/v/advanced-mark.js)](https://www.npmjs.com/package/advanced-mark.js)

#### Highlight words, terms, or text on a browser page using JavaScript.

This library from v2.0.0 doesn't guaranty backward compatibility with `mark.js` v9.0.0 and npm package v8.11.1.

[Playground](https://angezid.github.io/advanced-mark.js/playground) and
[Documentation](https://angezid.github.io/advanced-mark.js/doc-v2) for `advanced-mark.js` v2.

Also may be useful to read [Documentation](https://markjs.io/). Note that this doc is for old `mark.js`.

## Modules changes
* \*. es6.\*.js now are real ES6 modules. They are actually UMD modules in `mark.js` v9.0.0 and npm package v8.11.1.

``` js
import Mark from './mark.es6.js';
// import Mark from './jquery.mark.es6.js';
```

Added `node.jquery.mark.es6.js` module, which is intended to use on Node.js and contains necessary `import $ from 'jquery';` declaration.
The modules `jquery.mark.es6.js` and `jquery.mark.es6. min.js` can be used directly in browsers (global $).

## Virtual DOMs
See [JSDOM test](jsdom-tests/test.js).
