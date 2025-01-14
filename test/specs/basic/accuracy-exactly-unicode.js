'use strict';
describe('basic mark using accuracy exactly object and unicode option', () => {
  let $ctx1;
  beforeEach(() => {
    loadFixtures('basic/accuracy-exactly-unicode.html');

    $ctx1 = $('.accuracy-exactly-unicode');
  });

  it('should wrap matches using unicode class `\\p{..}`', done => {
    new Mark($ctx1[0]).mark('cafe resume expose lame mate ore pate rose', {
      'unicode': true,
      'accuracy': { 'value': 'exactly', 'limiters': '\\p{P}\\p{Emoji_Presentation}|$' },
      'done': () => {
        expect($ctx1.find('mark').length).toBe(14);

        done();
      }
    });
  });
});
