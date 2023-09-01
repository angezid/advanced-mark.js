
## Highlighting line ranges

An option `markLines` changes the behavior of the `markRanges` API. Instead of dealing with text ranges it is dealt with line ranges.  
It correctly handle `<br>` elements. With an option `wrapAllRanges` it can highlight nesting/overlaping lines.  
This option is useful in `pre` elements. It can be used in other elements, if HTLM page isn't minified, but with care.
You can play with advance-mark.js-playground. Examples -> `Mark line ranges`.  
**Note** that minimal line number is 1 (a text range can start with 0). 

#### Highlight and scroll into view the specified code line:
``` js
let elem;
const instance = new Mark(document.querySelector('pre'));
instance.markRanges([{ start: line, length: 1 }], {
  'markLines' : true,
  'each' : (markElement, info) => {
    if (info.matchStart) elem = markElement;
    markElement.className = 'mark-line';
  },
  'done' : () => {
    if (elem) elem.scrollIntoView();
  }
});
```
