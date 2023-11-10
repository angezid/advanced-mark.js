'use strict';
describe('basic mark with wildcards and synonyms', () => {
  let $ctx1, $ctx2, $ctx3;
  beforeEach(done => {
    loadFixtures('basic/wildcards-synonyms.html');

    $ctx1 = $('.basic-wildcards-synonyms > div:nth-child(1)');
    $ctx2 = $('.basic-wildcards-synonyms > div:nth-child(2)');
    $ctx3 = $('.basic-wildcards-synonyms > div:nth-child(3)');
    new Mark($ctx1[0]).mark('Lor?m', {
      'synonyms': {
        'Lor?m': 'Ips?m'
      },
      'separateWordSearch': false,
      'diacritics': true,
      'wildcards': 'enabled',
      'done': () => {
        new Mark($ctx2[0]).mark('Lor*m', {
          'synonyms': {
            'Lor*m': 'Ips*m'
          },
          'separateWordSearch': false,
          'diacritics': true,
          'wildcards': 'enabled',
          'done': () => {
            new Mark($ctx3[0]).mark(['lorem', 'good(s)'], {
              'synonyms': {
                'lorem': '1+1',
                'good(s)': 'ipsum'
              },
              'separateWordSearch': false,
              'diacritics': false,
              'wildcards': 'enabled',
              'done': () => {
                done();
              }
            });
          }
        });
      }
    });
  });

  it('should match wildcards inside of synonyms', () => {
    expect($ctx1.find('mark').length).toBe(10);
    expect($ctx2.find('mark').length).toBe(17);
  });
  it('regexp special chars in each synonym set should be escaped', () => {
    expect($ctx3.find('mark').length).toBe(4);
  });
});
