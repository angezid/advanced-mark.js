'use strict';
describe('mark with regular expression and noMatch callback', () => {
  let $ctx, notFound, notFoundCalled;
  beforeEach(done => {
    loadFixtures('regexp/main.html');

    $ctx = $('.regexp > div:first-child');
    notFound = null;
    notFoundCalled = 0;
    new Mark($ctx[0]).markRegExp(/test/gmi, {
      'noMatch': regexp => {
        notFoundCalled++;
        notFound = regexp;
      },
      'done': () => {
        done();
      }
    });
  });

  it('should call noMatch with the regular expression', () => {
    expect(notFoundCalled).toBe(1);
    expect(notFound instanceof RegExp).toBe(true);
  });
});
