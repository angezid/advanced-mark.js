'use strict';
describe('basic mark with separateWordSearch and blanks', () => {
  let $ctx1, $ctx2, $ctx3;
  beforeEach(done => {
    loadFixtures('basic/separate-word-search-blank.html');

    $ctx1 = $('.basic-separate-blank > div:nth-child(1)');
    $ctx2 = $('.basic-separate-blank > div:nth-child(2)');
    $ctx3 = $('.basic-separate-blank > div:nth-child(3)');
    new Mark($ctx1[0]).mark('lorem ', {
      'diacritics': false,
      'separateWordSearch': true,
      'done': () => {
        new Mark($ctx2[0]).mark(' lorem ', {
          'diacritics': false,
          'separateWordSearch': true,
          'done': () => {
            new Mark($ctx3[0]).mark([''], {
              'diacritics': false,
              'separateWordSearch': true,
              'done': () => {
                done();
              }
            });
          }
        });
      }
    });
  });

  it('should wrap matches, ignore blanks and call done', () => {
    expect($ctx1.find('mark').length).toBe(4);
    expect($ctx2.find('mark').length).toBe(4);
    expect($ctx3.find('mark').length).toBe(0);
  });
});
