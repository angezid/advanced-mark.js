'use strict';
describe('basic mark with synonyms and diacritics', () => {
  let $ctx1, $ctx2;
  beforeEach(done => {
    loadFixtures('basic/synonyms-diacritics.html');

    $ctx1 = $('.basic-synonyms-diacritics > div:nth-child(1)');
    $ctx2 = $('.basic-synonyms-diacritics > div:nth-child(2)');
    new Mark($ctx1[0]).mark(['dolor', 'amet'], {
      'separateWordSearch': false,
      'synonyms': {
        'dolor': 'justo'
      },
      'done': () => {
        new Mark($ctx2[0]).mark('Lorem', {
          'separateWordSearch': false,
          'synonyms': {
            'Lorem': 'amet'
          },
          'done': () => {
            done();
          }
        });
      }
    });
  });

  it('should find synonyms with diacritics', () => {
    expect($ctx1.find('mark').length).toBe(14);
    expect($ctx2.find('mark').length).toBe(8);
  });
});
