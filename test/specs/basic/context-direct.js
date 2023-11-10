'use strict';
describe('basic mark directly inside the context', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('basic/context-direct.html');

    $ctx = $('.basic-context-direct');
    new Mark($ctx[0]).mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'done': () => {
        done();
      }
    });
  });

  it('should wrap matches', () => {
    expect($ctx.find('mark').length).toBe(4);
  });
});
