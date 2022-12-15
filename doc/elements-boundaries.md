
## Elements boundaries

With the `acrossElements` option, text nodes are aggregated into a single string, taking into account HTML elements.
If a block element divides text nodes, and the first text node doesn't end by white space, the space is added to the string to separate them.

But the `acrossElements` option don't knows any boundaries.  
A `blockElementsBoundary` option is 'invented' to limit matches within HTML block elements.  
It allow matches only across all HTML inline elements (`blockElementsBoundary : true`) or with custom elements - across the rest HTML elements.  
With the `blockElementsBoundary` option, if the text node doesn't end by white space - ' \u001 ', otherwise - '\u001 ' string is added between them.

The `blockElementsBoundary` option make sense only when highlighting phrases or RegExp separate groups.

``` js
context.markRegExp(/.../gi, {
    'acrossElements' : true,
    'blockElementsBoundary' : true,
    // or
    'blockElementsBoundary' : {
        // custom elements - only those custom elements have boundaries
        'tagNames' : ['div', 'p', 'h1', 'h2'],  //optional
        // custom boundary char, default is '\u001'
        'char' : '.'   //optional
    }
});
```
