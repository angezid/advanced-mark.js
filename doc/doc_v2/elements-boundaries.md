
## Elements boundaries

**Note** that using a `blockElementsBoundary` option only makes sense with `acrossElements` option when highlighting phrases, or RegExp capturing groups, or using a wildcards character `*` with <code><a href="mark-method.md#mark-wildcards">wildcards</a> : 'withSpaces'</code> option (can match multiple words).

This, how library aggregates all context(s) text node contents into a single string with `blockElementsBoundary: true` option:
if a block element 'divides' two text nodes, `\x01` character with spaces (it depends) is added between them,  
e.g. '&lt;h1&gt;Header&lt;/h1&gt;&lt;p&gt;Paragraph&lt;/p&gt;' resulted in 'Header \x01 Paragraph'.

With different values the option allows matches across all HTML elements:
* `blockElementsBoundary: true` except default block elements
* `blockElementsBoundary: { tagNames: [..] }` except custom element(s)
* `blockElementsBoundary: { tagNames: [..], extend : true }` except default block elements and custom element(s)

#### Boundary object:
* `tagNames` \{string[]\} - An array of custom tag names. (default is `undefined`)
* `extend` \{boolean\} - Whether to extend default block elements with custom elements (`true`) or to make only custom elements have boundaries. (default is `false`)
* `char` \{string\} - A custom boundary char. (default is `\x01`)

### Example:
``` js
instance.mark('lorem ipsum dolor', {
    'separateWordSearch' : false,
    'acrossElements' : true,
    'blockElementsBoundary' : true
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
