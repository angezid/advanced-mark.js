
## Getting started

You can download the package using npm by running:
<pre class="bash"><code>$ npm install advanced-mark.js --save-dev</code></pre>
A `dist` directory contains files:  
<details class="info">
<summary>JavaScript</summary>
<ul>
<li><code>mark.js</code></li>
<li><code>mark.min.js</code></li>
<li><code>mark.es6.js</code></li>
<li><code>mark.es6.min.js</code></li>
</ul>
</details>
<details class="info">
<summary>jQuery</summary>
<ul>
<li><code>jquery.mark.js</code></li>
<li><code>jquery.mark.min.js</code></li>
<li><code>jquery.mark.es6.js</code></li>
<li><code>jquery.mark.es6.min.js</code></li>
<li><code>node.jquery.mark.es6.js</code> for use in Virtual DOMs (contains necessary <code>import $ from 'jquery'</code> declaration)</li>
</ul>
</details>
<details class="info">
<summary>TypeScript declaration files</summary>
<ul>
<li><code>mark.d.js</code></li>
<li><code>mark.es6.d.js</code></li>
<li><code>jquery.mark.es6.d.js</code></li>
<li><code>node.jquery.mark.es6.d.js</code></li>
</ul>
</details>

### HTML
To include library in web page just add:
``` html
<script src="path/to/mark.js"></script>
```
<strong>Note:</strong>the library requires UTF-8 encoding and may needs adding `charset` attribute:
``` html
<script src="path/to/mark.min.js" charset="utf-8"></script>
```

### API
There are four API methods:
* [mark()](mark-method.md) - to highlight custom terms
* [markRegExp()](markRegExp-method.md) - to highlight custom regular expressions
* [markRanges()](markRanges-method.md) - to highlight ranges with a start and length properties (of text or lines with `markLines` option)
* [unmark()](unmark-method.md) - to remove highlights

#### JavaScript
API methods called on an instance object. To initialize a new instance, you have to use:
``` js
var instance = new Mark(context);
instance.mark('lorem');
```
where `context` can be:
* a single element get by e.g. `document.getElementById()` or `document.querySelector()`
* a NodeList get by e.g. `document.querySelectorAll()`
* an array containing multiple single elements (**Note** that internally the array is sorted by the element position in the document)
* a string selector (internally calls `document.querySelectorAll()`)

#### jQuery
API methods called on every jQuery element:
``` js
$("div.test").mark('lorem');
```
