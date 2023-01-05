
## TypeScript types

The following TypeScript types files are added to `dist` folder:  
jquery.mark.d.ts  
jquery.mark.es6.d.ts  
jquery.mark.umd.d.ts  
mark.d.ts  
mark.es6.d.ts  
mark.umd.d.ts  
regexpcreator.d.ts  
regexpcreator.es6.d.ts  
regexpcreator.umd.d.ts  

### Simple example
``` js
import Mark from 'advanced-mark.js/dist/mark.js';

new Mark(document.querySelector("article")).mark(['lorem','ipsum'], {});
```

### jQuery example 
``` js
import "jquery/dist/jquery.js";
import Mark from 'advanced-mark.js/dist/jquery.mark.js';

$("article").mark(['lorem','ipsum'], {});
```

### RegExpCreator example
``` js
import regCreator from 'advanced-mark.js/dist/regexpcreator.js';

console.log('Using create method ', new regCreator().create('lorem', true));
console.log('Using createDiacritics method ', new regCreator().createDiacritics('lorem'));
console.log('Using createCombinePattern method ', new regCreator().createCombinePattern(['lorem', 'ipsum'], true));
```
