const fs = require('fs');

const path = 'dist/node.jquery.mark.es6.js';
let text = fs.readFileSync(path, 'utf-8');
text = text.replace(/^(\s*\/\*![^]+?\*\/.*\n)/, '$1\nimport $ from \'jquery\';');
fs.writeFileSync(path, text);
