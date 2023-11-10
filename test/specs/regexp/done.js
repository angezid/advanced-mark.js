'use strict';
describe('mark with regular expression and done callback', () => {
  let $ctx, doneCalled, totalMatches;
  beforeEach(done => {
    loadFixtures('regexp/main.html');

    totalMatches = doneCalled = 0;
    $ctx = $('.regexp > div:first-child');
    new Mark($ctx[0]).markRegExp(/lorem/gmi, {
      'done': counter => {
        doneCalled++;
        totalMatches = counter;
        done();
      }
    });
  });

  it('should call the done callback once only', done => {
    setTimeout(() => {
      expect(doneCalled).toBe(1);
      done();
    }, 3000);
  });
  it('should call the done callback with total matches', () => {
    expect(totalMatches).toBe(4);
  });
});
