
import RegExpCreator from './regexpcreator.es6.js';

const keywords = ['thanks', 'specific', 'enough', 'long', 'lot', 'hand', 'popular', 'small', 'though', 'experience'];
const creator = new RegExpCreator({ 'diacritics' : false, 'accuracy' : 'exactly' });

combine();

function combine() {
  const first = creator.create(keywords[0], true);

  // create() with true returns object containing three string properties instead of RegExp
  console.log(first.lookbehind, first.pattern, first.lookahead, creator.create(keywords[0]));

  let pattern = '(?:';

  for(let i = 0; i < keywords.length; i++) {
    const ptn = creator.create(keywords[i], true).pattern;
    pattern += `${ptn}${i < keywords.length - 1 ? '|' : ''}`;
  }

  document.getElementById('log').innerHTML = keywords.toString() + '<br><br>' + pattern + ')';
}
