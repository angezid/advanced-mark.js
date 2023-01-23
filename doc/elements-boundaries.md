
## Elements boundaries

With the `acrossElements` option, text nodes are aggregated into a single string, taking into account HTML elements.
If a block element divides text nodes, and the first text node doesn't end by white space, the space is added to the string to separate them.

But the `acrossElements` option doesn't know any boundaries.  
A `blockElementsBoundary` option is 'invented' to limit matches within HTML block elements and additional custom elements if they're defined.  
It allows matches only across HTML inline elements (`blockElementsBoundary : true`).
With the `blockElementsBoundary` option, if the text node doesn't end by white space - ' \u001 ', otherwise - '\u001 ' string is added between them.

The `blockElementsBoundary` option makes sense only when highlighting phrases or RegExp separate groups.

``` js
context.markRegExp(/.../gi, {
    'acrossElements' : true,
    'blockElementsBoundary' : true,
    // or
    'blockElementsBoundary' : {
        // additional custom elements are added to the default block elements
        'tagNames' : ['tab-container', 'theme-toggle'],  //optional
        // custom boundary char, default is '\u001'
        'char' : '.'   //optional
    }
});
```
