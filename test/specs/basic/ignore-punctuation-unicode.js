'use strict';
describe('basic mark with ignorePunctuation and unicode', () => {
  let $ctx1;

  beforeEach(() => {
    loadFixtures('basic/ignore-punctuation-unicode.html');
  });

  it('should find matches using unicode class \'\\p{..}\'and character escape \'\\u{..}\'', done => {
    $ctx1 = $('.ignore-punctuation-unicode');

    new Mark($ctx1[0]).mark('Lorem ipsum dolor', {
      'diacritics': false,
      'unicode': true,
      'ignorePunctuation': '\\p{P}\\p{Emoji_Presentation}\\u{1d4b3}|$',
      'done': (totalMarks, totalMatches) => {
        expect(totalMatches).toBe(9);
        done();
      }
    });
  });
});
