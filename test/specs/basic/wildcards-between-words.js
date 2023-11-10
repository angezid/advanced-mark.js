'use strict';
describe('basic mark with wildcards between words', () => {
  let $ctx1, $ctx2, $ctx3, $ctx4;
  beforeEach(() => {
    loadFixtures('basic/wildcards-between-words.html');
  });

  it('should match wildcard with zero to one non-whitespace in the keyword', done => {
    $ctx1 = $('.basic-wildcards-between-words > div:nth-child(1)');

    new Mark($ctx1[0]).mark('lorem?ipsum', {
      'separateWordSearch': false,
      'diacritics': false,
      'wildcards': 'enabled',
      'done': () => {
        expect($ctx1.find('mark').length).toBe(4);
        done();
      }
    });
  });

  it('should match wildcard with zero or more non-whitespace in the keyword', done => {
    $ctx2 = $('.basic-wildcards-between-words > div:nth-child(2)');

    new Mark($ctx2[0]).mark('lorem*ipsum', {
      'separateWordSearch': false,
      'diacritics': false,
      'wildcards': 'enabled',
      'done': () => {
        expect($ctx2.find('mark').length).toBe(5);
        done();
      }
    });
  });

  it('should match wildcard with zero to one character in the keyword', done => {
    $ctx3 = $('.basic-wildcards-between-words > div:nth-child(3)');

    new Mark($ctx3[0]).mark('lorem?ipsum', {
      'separateWordSearch': false,
      'diacritics': false,
      'wildcards': 'withSpaces',
      'done': () => {
        expect($ctx3.find('mark').length).toBe(6);
        done();
      }
    });
  });

  it('should match wildcard with zero or more characters in the keyword', done => {
    $ctx4 = $('.basic-wildcards-between-words > div:nth-child(4)');

    new Mark($ctx4[0]).mark('lorem*ipsum', {
      'separateWordSearch': false,
      'diacritics': false,
      'wildcards': 'withSpaces',
      'done': () => {
        expect($ctx4.find('mark').length).toBe(9);
        done();
      }
    });
  });

});
