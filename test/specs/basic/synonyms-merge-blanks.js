'use strict';
describe('basic mark with synonyms and multiple blanks', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('basic/synonyms-merge-blanks.html');

    $ctx = $('.basic-synonyms-merge-blanks');
    new Mark($ctx[0]).mark(['dolor', 'amet'], {
      'separateWordSearch': false,
      'diacritics': false,
      'synonyms': {
        'dolor': 'lorem  ipsum'
      },
      'done': () => {
        done();
      }
    });
  });

  it('should find synonyms with diacritics', () => {
    expect($ctx.find('mark').length).toBe(4);
  });
});
