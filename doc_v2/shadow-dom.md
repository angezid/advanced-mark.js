
## Highlighting in shadow DOM

An option `shadowDOM : true`allows to highlight a text inside shadow DOMs that have `mode: 'open'` and are already created.  
You can play with Playground - Examples -> Shadow DOM.

**Note:** to style mark elements in shadow DOM, the option `shadowDOM : {style : 'your mark element style'}` can be used.  
It creates a `style` element and inserts it at the beginning of shadow root child node(s).  
But this operation is invasive, it can break the root code.  
An inline style can be used as an alternative:
``` js
each : (markElement, info) => {
  // a shadow root is the DocumentFragment
  if (markElement.getRootNode().nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    markElement.style.color = "red";
  }
}
```
