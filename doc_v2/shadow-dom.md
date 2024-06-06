
## Highlighting in shadow DOM

An option `shadowDOM : true`allows to highlight a text inside shadow DOMs that have `mode: 'open'` and are already created.  
You can play with Playground - Examples -> Shadow DOM.

To style mark elements in shadow DOM, the option `shadowDOM : {style : 'your mark element style'}` can be used.  
It creates a `style` element and appends it at the end of shadow root child nodes (before v2.6.0 it inserted style of beginning of shadow root child nodes).  
**Note** that a style is added to shadow root no matter does shadow DOM contains any matches or not.  

An inline style can be used as an alternative:
``` js
each : (markElement, info) => {
  // a shadow root is the DocumentFragment
  if (markElement.getRootNode().nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    markElement.style.color = "red";
  }
}
```
