'use strict';
describe('mark with acrossElements and done callback', () => {
  let $ctx, doneCalled, totalMatches, totalMarks;
  beforeEach(done => {
    loadFixtures('across-elements/basic/main.html');

    totalMarks = totalMatches = doneCalled = 0;
    $ctx = $('.across-elements');
    new Mark($ctx[0]).mark(['lorem ipsum', 'dolor sit'], {
      'diacritics': false,
      'separateWordSearch': false,
      'acrossElements': true,
      'done': (counter, matchCount) => {
        doneCalled++;
        totalMarks = counter;
        totalMatches = matchCount;
        done();
      }
    });
  });

  it('should call the done callback once only', done => {
    setTimeout(() => {
      expect(doneCalled).toBe(1);
      done();
    }, 300);
  });
  it('should call the done callback with total matches', () => {
    expect(totalMarks).toBe(11);
    expect(totalMatches).toBe(8);
  });
});
