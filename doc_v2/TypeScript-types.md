
## TypeScript types

The following TypeScript declaration files are added to `dist` folder:  
* mark.d.ts  
* mark.es6.d.ts  
* jquery.mark.d.ts  
* jquery.mark.es6.d.ts  
* node.jquery.mark.es6.d.ts  
* regexpcreator.d.ts  
* regexpcreator.es6.d.ts

**Note:** the default imported library is ES6 module -`mark.es6.js`, to import others you need to specify the full path,  
e.g. `import 'advanced-mark.js/dist/jquery.mark.js';`.

#### JavaScript example
``` js
// imported 'mark.es6.js' library
import Mark from 'advanced-mark.js';

new Mark(document.querySelector("article")).mark('lorem ipsum', {});
```

#### jQuery example 
**Note:** in `Node.js` environment with `jquery` you need to use `node.jquery.mark.es6.js` module, which contains necessary `import $ from 'jquery'` declaration.
``` js
import $ from 'jquery';
import 'advanced-mark.js/dist/jquery.mark.js';

$("article").mark('lorem ipsum', {});
```
