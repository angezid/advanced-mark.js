'use strict';
describe('basic mark called with a NodeList context', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('basic/context-nodelist.html');

    $ctx = $('.basic-context-nodelist');
    let ctxNodelist = document.querySelectorAll('.basic-context-nodelist');
    new Mark(ctxNodelist).mark('lorem', {
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
