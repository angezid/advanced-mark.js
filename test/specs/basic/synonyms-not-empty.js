'use strict';
describe('basic mark ignore empty synonyms', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('basic/synonyms-not-empty.html');
    $ctx = $('.synonyms-not-empty > div');
    new Mark($ctx[0]).mark('lorem', {
      'synonyms': {
        'lorem': ''
      },
      'separateWordSearch': false,
      'diacritics': false,
      'done': () => {
        done();
      }
    });
  });

  it('should ignore empty synonyms', () => {
    expect($ctx.find('mark').length).toBe(4);
  });
});
