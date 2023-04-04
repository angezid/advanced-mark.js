# advanced-mark.js

[![npm](https://img.shields.io/npm/v/advanced-mark.js)](https://www.npmjs.com/package/advanced-mark.js)

#### Highlight words, terms, or text on a browser page using JavaScript.

To play with this library - [advanced-mark.js-playground](https://github.com/angezid/advanced-mark.js-playground). It requires minimum installation and provides full functionality.
It has some built-in examples. 

This library from v2.0.0 doesn't guaranty backward compatibility with `mark.js` v9.0.0 and npm package v8.11.1.

See [Documentation](https://angezid.github.io/advanced-mark.js/doc-v2) for `advanced-mark.js` v2.
Note that it's still under development.

Also may be useful to read [Documentation](https://markjs.io/). Note that this doc is for old `mark.js`.

## Modules changes
* \*. es6.\*.js now are real ES6 modules. They are actually UMD modules in `mark.js` v9.0.0 and npm package v8.11.1.

``` js
import Mark from './mark.es6.js';
// import Mark from './jquery.mark.es6.js';
```
UMD modules are removed in v2.0.0.

## Virtual DOMs
See [JSDOM test](virtual-dom/test.js).
