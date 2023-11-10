'use strict';
describe('basic mark with done callback', () => {
  let $ctx, doneCalled, totalMatches, totalMarks, termStats = {},
    array = ['lorem ipsum', 'dolor sit'];

  beforeEach(done => {
    loadFixtures('basic/main.html');

    totalMarks = totalMatches = doneCalled = 0;
    $ctx = $('.basic');
    new Mark($ctx[0]).mark(array, {
      'diacritics': false,
      'separateWordSearch': false,
      'done': (counter, matchCount, stats) => {
        doneCalled++;
        totalMarks = counter;
        totalMatches = matchCount;
        termStats = stats;
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
    expect(totalMarks).toBe(totalMatches);
    expect(totalMatches).toBe(8);

    expect(termStats[array[0]]).toBe(4);
    expect(termStats[array[1]]).toBe(4);
  });
});
