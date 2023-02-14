const fs = require('fs');

const files = ['mark.d.ts', 'jquery.mark.d.ts', 'regexpcreator.d.ts'],
  sourceDir = 'src/types/', 
  destDir = 'dist/',
  version = process.env.npm_package_version;

if(version) {
  files.forEach(name => {
    fs.readFile(sourceDir + name, 'utf-8', (err, text) => {
      if (err) {
        console.error(err);
        
      } else {
        text = text.replace(/^(\s*\/\/.+?\bv)[\d.]+/, '$1' + version);
        
        fs.writeFile(destDir + name, text, 'utf-8', err => {
          if (err) {
            console.log(err);
          }
        });
        fs.writeFile(destDir + name.replace(/\.d\.ts$/, '.es6$&'), text, 'utf-8', err => {
          if (err) {
            console.log(err);
          }
        });
      } 
    });
  });
}
