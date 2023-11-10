'use strict';
describe('basic mark with caseSenstive and diacritics', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('basic/case-sensitive-diacritics.html');

    $ctx = $('.basic-case-sensitive-diacritics');
    new Mark($ctx.get()).mark(['Dolor', 'Amet', 'Aliquam', 'Lorem ipsum'], {
      'separateWordSearch': false,
      'caseSensitive': true,
      'done': () => {
        done();
      }
    });
  });

  it('should find case sensitive matches with diacritics', () => {
    expect($ctx.find('mark').length).toBe(8);
  });
});
