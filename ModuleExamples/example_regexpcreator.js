
import RegExpCreator from './regexpcreator.es6.js';

const keywords = ['thanks', 'specific', 'enough', 'long', 'lot', 'hand', 'popular', 'small', 'though', 'experience'];
// the 'createDiacritics()' is only affected by a 'caseSensitive' option
const creator = new RegExpCreator({ 'diacritics' : false, 'accuracy' : 'exactly' });
let result = '';

function combine() {
  const first = creator.create(keywords[0], true);

  // create() with the second parameter set to true returns object containing three string properties instead of RegExp
  console.log(first.lookbehind, first.pattern, first.lookahead, creator.create(keywords[0]));

  let pattern = '';

  for(let i = 0; i < keywords.length; i++) {
    const ptn = creator.create(keywords[i], true).pattern;
    pattern += `${ptn}${i < keywords.length - 1 ? '|' : ''}`;
  }

  result += 'Array: ' + keywords.toString() + '<br>Combine pattern: (?:' + pattern + ')';
}

function createDiacriticsPattern() {
  result += '<br><br>String: `specific`<br>Diacritics pattern: ' + new RegExpCreator({ 'caseSensitive' : true }).createDiacritics('specific');
  result += '<br><br>String: `specific`<br>Diacritics pattern: ' + creator.createDiacritics('specific');
}

combine();
createDiacriticsPattern();

document.getElementById('log').innerHTML = result;