
## Elements boundaries

With `acrossElements` option, *advance-mark.js* aggregates text nodes content into a single string, taking into account HTML elements.
If a block element 'divides' two text nodes, and `node.textContent`s doesn't separated by white space, the space is added to the string to separate them,  
e.g. '&lt;h1&gt;Header&lt;/h1&gt;&lt;p&gt;Paragraph&lt;/p&gt;' resulted: in *mark.js* - 'HeaderParagraph', in *advance-mark.js* - 'Header Paragraph'.

But the `acrossElements` option doesn't 'knows' any boundaries.  
A `blockElementsBoundary` option is 'invented' to limit matches within HTML block elements.  
It allows matches only across HTML inline elements (`blockElementsBoundary : true`).

**Note** that using the `blockElementsBoundary` option only makes sense when highlighting phrases or RegExp capturing groups, or using a wildcards character `*` with <code><a href="mark-method.md#mark-wildcards">wildcards</a> : 'withSpaces'</code> option.

With the `blockElementsBoundary` option, if a block element 'divides' two text nodes, `\x01` character with spaces (it depend) is added between them, e.g. above combined string becomes 'Header \x01 Paragraph'.  

If the custom `tagNames` are defined, they can be:
1. the only elements that have boundaries
2. added to the default block elements

* `blockElementsBoundary` {boolean|object} - Option: (default is `undefined`)
  * `tagNames` {string[]} - The string or array of tag name. (default is `undefined`)
  * `extend` {boolean} - Whether to extend the default block elements with custom elements or only specify custom elements have boundaries. (default is `false`)
  * `char` {string} - The custom boundary char. (default is `\x01`)

``` js
instance.mark('lorem ipsum dolor', {
    'separateWordSearch' : false,
    'acrossElements' : true,
    'blockElementsBoundary' : true,
    // or
    'blockElementsBoundary' : {
        // only these custom elements have boundaries
        'tagNames' : ['div', 'p', 'h1', 'h2'],  // optional
        // custom boundary char, default is '\x01'
        'char' : '.'   // optional
    }
});
```

### Extending default block elements with custom elements:
``` js
instance.markRegExp(/.../gi, {
    'acrossElements' : true,
    'blockElementsBoundary' : {
        // custom elements are added to the default block elements
        'tagNames' : ['tab-container', 'custom-tag'],
        'extend' : true
    }
});
```

The default elements are:
> address, area, article, aside, audio, blockquote, body, br, button, canvas, dd, details, div, dl, dt,
fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hr, iframe, img, input,
label, li, main, map, menu, menuitem, meter, nav, object, ol, output, p, picture, pre, section,
select, svg, table, tbody, td, textarea, tfoot, th, thead, tr, track, ul, video
