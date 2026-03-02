'use strict';
describe('basic mark with an array of keywords', () => {
  let $ctx, notFound;
  beforeEach(done => {
    loadFixtures('basic/array-keyword.html');

    $ctx = $('.basic-array-keyword');
    notFound = [];
    new Mark($ctx[0]).mark(['lorem', 'ipsum', 'test', 'hey'], {
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

  it('should wrap all matching keywords from the array', () => {
    expect($ctx.find('mark').length).toBe(8);
  });
  it('should call noMatch for not found array items', () => {
    console.log( notFound );
    expect(notFound).toEqual(['test', 'hey']);
  });
});
