'use strict';
describe('basic mark with caseSensitive synonyms', () => {
  let $ctx1, $ctx2;
  beforeEach(done => {
    loadFixtures('basic/case-sensitive-synonyms.html');

    $ctx1 = $('.basic-case-sensitive-synonyms > div:nth-child(1)');
    $ctx2 = $('.basic-case-sensitive-synonyms > div:nth-child(2)');
    new Mark($ctx1[0]).mark('Lorem', {
      'synonyms': {
        'Lorem': 'ipsum'
      },
      'separateWordSearch': false,
      'diacritics': false,
      'caseSensitive': true,
      'done': () => {
        new Mark($ctx2[0]).mark(['one', '2', 'lüfte'], {
          'separateWordSearch': false,
          'diacritics': false,
          'caseSensitive': true,
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

  it('should wrap keywords and synonyms', () => {
    expect($ctx1.find('mark').length).toBe(6);
    expect($ctx2.find('mark').length).toBe(5);
  });
});
