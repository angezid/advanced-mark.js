'use strict';
describe('basic mark with synonyms', () => {
  let $ctx1, $ctx2;
  beforeEach(done => {
    loadFixtures('basic/synonyms.html');

    $ctx1 = $('.basic-synonyms > div:nth-child(1)');
    $ctx2 = $('.basic-synonyms > div:nth-child(2)');
    new Mark($ctx1[0]).mark('lorem', {
      'synonyms': {
        'lorem': 'ipsum'
      },
      'separateWordSearch': false,
      'diacritics': false,
      'done': () => {
        new Mark($ctx2[0]).mark(['one', '2', 'lüfte'], {
          'separateWordSearch': false,
          'diacritics': false,
          'synonyms': {
            'ü': 'ue',
            'one': '1',
            'two': '2'
          },
          'done': () => {
            done();
          }
        });
      }
    });
  });

  it('should wrap synonyms as well as keywords', () => {
    expect($ctx1.find('mark').length).toBe(8);
    expect($ctx2.find('mark').length).toBe(4);
  });
});
