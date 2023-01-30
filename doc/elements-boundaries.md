
## Elements boundaries

With the `acrossElements` option, text nodes are aggregated into a single string, taking into account HTML elements.
If a block element divides text nodes, and the first text node doesn't end by white space, the space is added to the string to separate them,  
e.g.  '<h1>Header</h1><p>Paragraph</p>' resulted: `mark. js` - 'HeaderParagraph', `advance-mark. js` - 'Header Paragraph'.

But the `acrossElements` option doesn't know any boundaries.  
A `blockElementsBoundary` option is 'invented' to limit matches within HTML block elements.  
It allows matches only across HTML inline elements (`blockElementsBoundary : true`).

With the `blockElementsBoundary` option, if the text node doesn't end by white space - ' \x01 ', otherwise - '\x01 ' string is added between them,  
e.g. 'Header \x01 Paragraph'.

If the custom `tagNames` are defined:
* they can be the only elements that have boundaries
* they can be added to the default block elements

The `blockElementsBoundary` option makes sense only when highlighting phrases or RegExp separate groups.

``` js
instance.mark('lorem ipsum dolor', {
    'separateWordSearch' : false,
    'acrossElements' : true,
    'blockElementsBoundary' : true,
    // or
    'blockElementsBoundary' : {
        // only those custom elements have boundaries
        'tagNames' : ['div', 'p', 'h1', 'h2'],  // optional
        // custom boundary char, default is '\x01'
        'char' : '.'   // optional
    }
});
```

### Extending default block elements with custom elements:
``` js
context.markRegExp(/.../gi, {
    'acrossElements' : true,
    'blockElementsBoundary' : {
        // custom elements are added to the default block elements
        'tagNames' : ['tab-container', 'custom-tag'],
        extend : true
    }
});
```

The default elements are:
> address, area, article, aside, audio, blockquote, body, br, button, canvas, dd, details, div, dl, dt,
fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hr, iframe, img, input,
label, li, main, map, menu, menuitem, meter, nav, object, ol, output, p, picture, pre, section,
select, svg, table, tbody, td, textarea, tfoot, th, thead, tr, track, ul, video
