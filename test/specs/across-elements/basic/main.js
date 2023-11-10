'use strict';
describe('mark with acrossElements', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('across-elements/basic/main.html');

    $ctx = $('.across-elements');
    new Mark($ctx[0]).mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'acrossElements': true,
      'done': () => {
        done();
      }
    });
  });

  it('should wrap matches', () => {
    expect($ctx.find('mark').length).toBe(6);
  });
});
