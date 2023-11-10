'use strict';
describe('basic mark with diacritics', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('basic/diacritics.html');

    $ctx = $('.basic-diacritics');
    // including a term with a "s" and a whitespace to check "merge blanks"
    // behavior in combination with diacritics
    new Mark($ctx[0]).mark(['dolor', 'amet', 'justo', 'lores ipsum'], {
      'separateWordSearch': false,
      'done': () => {
        done();
      }
    });
  });

  it('should treat normal and diacritic characters equally', () => {
    expect($ctx.find('mark').length).toBe(15);
  });
});
