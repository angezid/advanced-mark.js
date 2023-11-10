'use strict';
describe('basic mark with ignorePunctuation', () => {
  function getPunctuation() {
    return '^:;.,-–—‒_(){}[]!\'"+='.replace(/[-^\]\\]/g, '\\$&');
  }
  let $ctx1, $ctx2, $ctx3,
    punctuation = getPunctuation(),
    regexp = new RegExp('[' + punctuation + ']', 'g');

  beforeEach(() => {
    loadFixtures('basic/ignore-punctuation.html');
  });

  it('should find matches when \'ignorePunctuation\' option is a string of punctuation characters', done => {
    $ctx1 = $('.basic-ignore-punctuation > div:nth-child(1)');

    new Mark($ctx1[0]).mark('Lorem ipsum', {
      'separateWordSearch': false,
      'diacritics': false,
      'ignorePunctuation': punctuation,
      'done': (totalMarks, totalMatches) => {
        expect(totalMatches).toBe(5);
        done();
      }
    });
  });
  
  it('should find single word matches', done => {
    $ctx1 = $('.basic-ignore-punctuation > div:nth-child(1)');

    new Mark($ctx1[0]).mark('ipsum', {
      'separateWordSearch': false,
      'diacritics': false,
      'ignorePunctuation': punctuation.split(''),
      'done': () => {
        expect($ctx1.find('mark').length).toBe(5);
        let count = 0;
        $ctx1.find('mark').each((i, elem) => {
          if ($(elem).text().replace(regexp, '') === 'ipsum') {
            count++;
          }
        });
        expect(count).toBe(5);
        done();
      }
    });
  });

  it('should find matches containing whitespace', done => {
    $ctx2 = $('.basic-ignore-punctuation > div:nth-child(2)');

    new Mark($ctx2[0]).mark(['Lorem ipsum'], {
      'separateWordSearch': false,
      'diacritics': false,
      'ignorePunctuation': punctuation.split(''),
      'done': () => {
        expect($ctx2.find('mark').length).toBe(5);
        let count = 0,
          regex = /lorem\s+ipsum/i;
        $ctx2.find('mark').each((i, elem) => {
          if (regex.test($(elem).text().replace(regexp, ''))) {
            count++;
          }
        });
        expect(count).toBe(5);
        done();
      }
    });
  });

  it('should not find matches when disabled', done => {
    $ctx3 = $('.basic-ignore-punctuation > div:nth-child(3)');

    new Mark($ctx3[0]).mark(['ipsum'], {
      'separateWordSearch': false,
      'diacritics': false,
      'ignorePunctuation': '',
      'done': () => {
        expect($ctx3.find('mark').length).toBe(1);
        done();
      }
    });
  });
});
