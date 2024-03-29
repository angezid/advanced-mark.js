'use strict';
describe('basic mark with synonyms and noMatch', () => {
  let $ctx, notFound;
  beforeEach(done => {
    loadFixtures('basic/synonyms-no-match.html');

    $ctx = $('.basic-synonyms-no-match > p');
    notFound = [];
    new Mark($ctx[0]).mark('test', {
      'synonyms': {
        'test': 'ipsum'
      },
      'separateWordSearch': false,
      'diacritics': false,
      'noMatch': term => {
        notFound.push(term);
      },
      'done': () => {
        done();
      }
    });
  });

  it('should not call noMatch if there are synonym matches', () => {
    expect(notFound).toEqual([]);
  });
});
