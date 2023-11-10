'use strict';
describe('mark with acrossElements and each callback', () => {
  let $ctx, eachCalled;
  beforeEach(done => {
    loadFixtures('across-elements/basic/main.html');

    eachCalled = 0;
    $ctx = $('.across-elements');
    new Mark($ctx[0]).mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'acrossElements': true,
      'each': () => {
        eachCalled++;
      },
      'done': () => {
        done();
      }
    });
  });

  it('should call the each callback for each marked element', () => {
    expect(eachCalled).toBe(6);
  });
});
