const { JSDOM } = require('jsdom');

const Mark = require('./dist/mark.js');

const dom = new JSDOM('<!DOCTYPE html><html><body><p>this <i>is</i> a test</p></body></html>');
const mark = new Mark(dom.window.document.body);

mark.mark('this is a test', {
  acrossElements:true,
  window: dom.window
});

console.log(dom.serialize());