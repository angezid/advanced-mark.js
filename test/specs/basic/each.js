'use strict';
describe('basic mark with each callback', () => {
  let $ctx, eachCalled;
  beforeEach(done => {
    loadFixtures('basic/main.html');

    eachCalled = 0;
    $ctx = $('.basic');
    new Mark($ctx[0]).mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'each': () => {
        eachCalled++;
      },
      'done': () => {
        done();
      }
    });
  });

  it('should call the each callback for each marked element', () => {
    expect(eachCalled).toBe(4);
  });
});
