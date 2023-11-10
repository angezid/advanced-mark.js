'use strict';
describe('mark with acrossElements and ignoreJoiners', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('across-elements/basic/ignore-joiners.html');

    $ctx = $('.across-elements-ignore-joiners');
    new Mark($ctx[0]).mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'acrossElements': true,
      'ignoreJoiners': true,
      'done': () => {
        done();
      }
    });
  });

  it('should wrap matches and ignoreJoiners', () => {
    expect($ctx.find('mark').length).toBe(6);
  });
});
