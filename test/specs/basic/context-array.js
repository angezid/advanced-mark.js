'use strict';
describe('basic mark called with an array of contexts', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('basic/context-array.html');

    $ctx = $('.basic-context-array');
    new Mark($ctx.get()).mark('lorem', {
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
