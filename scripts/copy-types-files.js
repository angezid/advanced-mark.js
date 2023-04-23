const fs = require('fs');
const files = {
    'mark.d.ts' : ['mark.d.ts', 'mark.es6.d.ts'],
    'jquery.mark.d.ts' : ['jquery.mark.d.ts', 'nodes.jquery.mark.es6.d.ts'],
    'regexpcreator.d.ts' : ['regexpcreator.d.ts', 'regexpcreator.es6.d.ts']
  },
  sourceDir = 'src/types/',
  destDir = 'dist/',
  version = process.env.npm_package_version;

if(version) {
  for (const name in files) {
    text = fs.readFileSync(sourceDir + name, 'utf-8');
    text = text.replace(/^(\s*\/\/.+?\bv)[\d.]+/, '$1' + version);

    files[name].forEach(destName => {
      fs.writeFileSync(destDir + destName, text);
    });
  }
}
