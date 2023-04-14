// npm run test-virtual-dom
const fs = require('fs');
const chalk = require('chalk');
const { JSDOM } = require('jsdom');
const Mark = require('../dist/mark.js');

const path = './jsdom-tests/main.html';
const html = fs.readFileSync(path, 'utf8');

const text = 'JSDOM \'mark()\' method ';
const search = 'Lorem ipsum dolor';

let options = {
  accuracy : 'exactly', 
};
test(html, text + 'test', '.context', search, 9, 9, options);

options = {
  separateWordSearch : false,
  acrossElements : true,
};
test(html, text + 'across elements test', '.across-elements', search, 9, 4, options);


function test(html, message, selector, search, marks, matches, opt) {
  console.log(message);

  if ( !html) {
    console.log(chalk.red('Failed to read ' + path));
    return false;
  }

  const { window } = new JSDOM(html),
    context = window.document.querySelector(selector);

  if ( !context) {
    console.log('Context is ', context);
    return false;
  }

  const options = Object.assign({}, {
    diacritics : false,
    window : window,
    done : (totalMarks, totalMatches, termStats) => {
      const success = totalMarks === marks && totalMatches === matches;
      report(success, totalMarks, totalMatches);
    }
  }, opt);

  const instance = new Mark(context);
  instance.mark(search, options);
}

function report(success, marks, matches) {
  if (success) {
    console.log(chalk.green(' Test passed'));

  } else {
    console.log(chalk.red(' Test failed'));
    console.log(marks, matches);
  }
}










