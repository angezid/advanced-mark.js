const { JSDOM } = require('jsdom');

const Mark = require('../dist/mark.js');

const result = '<!DOCTYPE html><html><head></head><body><p><mark data-markjs="true">th<mark data-markjs="true">is</mark></mark> <i><mark data-markjs="true">is</mark></i> <mark data-markjs="true">a</mark> <mark data-markjs="true">test</mark></p></body></html>';
const dom = new JSDOM('<!DOCTYPE html><html><body><p>this <i>is</i> a test</p></body></html>');
const mark = new Mark(dom.window.document.body);

mark.mark('this is a test', {
  acrossElements:true,
  window: dom.window
});

if (result !== dom.serialize()) {
	console.warn(' x JSDOM test failed');
}else {
	console.log(' v JSDOM test passed');
} 
