// npm run test-virtual-dom
const fs = require('fs');
const { JSDOM } = require('jsdom');
const Mark = require('../dist/mark.js');

const path = './jsdom-tests/main.html';
const html = fs.readFileSync(path, 'utf8');

const text = 'JSDOM \'mark()\' method ';

let options = {
  accuracy : 'exactly', 
};
test(html, text + 'test', '.context', 9, 9, options);

options = {
  separateWordSearch : false,
  acrossElements : true,
};
test(html, text + 'across elements test', '.across-elements', 9, 4, options);


function test(html, message, selector, marks, matches, opt) {
  console.log(message);

  if ( !html) {
    console.log('Failed to read ' + path);
    return false;
  }

  const { window } = new JSDOM(html);

  const options = Object.assign({}, {
    diacritics : false,
    window : window,
    done : (totalMarks, totalMatches) => {
      const success = totalMarks === marks && totalMatches === matches;
      report(success, totalMarks, totalMatches);
    }
  }, opt);

  const instance = new Mark(selector);
  instance.mark('Lorem ipsum dolor', options);
}

function report(success, marks, matches) {
  if (success) {
    console.log(' Test passed');

  } else {
    console.log(' Test failed');
    console.log(marks, matches);
  }
}










