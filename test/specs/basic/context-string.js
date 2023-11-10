'use strict';
describe('basic mark called with a string selector as context', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('basic/context-string.html');

    $ctx = $('.basic-context-string');
    new Mark('.basic-context-string').mark('lorem', {
      'diacritics': false,
      'separateWordSearch': false,
      'done': () => {
        done();
      }
    });
  });

  it('should wrap matches', () => {
    expect($ctx.find('mark').length).toBe(8);
  });
});
