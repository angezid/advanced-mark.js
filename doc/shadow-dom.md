
## Marking shadow DOM

With an option `shadowDOM : true` the mark.js now is able to highlight shadow DOM.  
You can play with Markjs-playground. Examples -> Shadow DOM`.  
**Note:** to style mark elements in shadow DOM, the option `shadowDOM : {style : 'your mark elements style'}` can be used.  
It creates a style element and inserts it at the beginning of shadow root child node(s).  
But this operation is invasive, it can break root code.  
An inline style can be used as an alternative:
``` js
each : (markElement, info) => {
  // a shadow root is the DocumentFragment
  if (markElement.getRootNode().nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    markElement.style.color = "red";
  }
}
```
