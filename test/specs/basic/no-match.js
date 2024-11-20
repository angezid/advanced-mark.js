'use strict';
describe('basic mark with noMatch callback', () => {
  let $ctx, notFound;
  beforeEach(done => {
    loadFixtures('basic/main.html');

    $ctx = $('.basic');
    new Mark($ctx[0]).mark('test', {
      'diacritics': false,
      'separateWordSearch': false,
      'noMatch': array => {
        notFound = array;
      },
      'done': () => {
        done();
      }
    });
  });

  it('should call the noMatch callback for not found terms', () => {
    expect(notFound).toEqual(['test']);
  });
});
