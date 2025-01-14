'use strict';
describe('\'charSets\' with \'unicode\' option', () => {
  let $ctx;

  beforeEach(() => {
    loadFixtures('basic/char-sets-unicode.html');

    $ctx = $('.char-sets-unicode');
  });

  it('should mark RegExp character sets with \'unicode\' option', done => {
    let curTerm = '';
    new Mark($ctx[0]).mark(['[\\p{sc=Han}]+', '[\\p{Sc}][\\d]+', '[\\p{Nl}]'], {
      'characterSets' : true,
      'unicode' : true,
      'done' : () => {
        expect($ctx.find('mark').length).toBe(5);
        done();
      }
    });
  });
});
