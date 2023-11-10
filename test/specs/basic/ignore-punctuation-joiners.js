'use strict';
describe('basic mark with ignorePunctuation and ignoreJoiners', () => {
  function getPunctuation() {
    return '^:;.,-–—‒_(){}[]!\'"+='.replace(/[-^\]\\]/g, '\\$&');
  }
  let $ctx1, $ctx2, $ctx3, $container,
    punctuation = getPunctuation(),
    regexp = new RegExp('[\u00ad\u200b\u200c\u200d' + punctuation + ']', 'g');

  beforeEach(() => {
    loadFixtures('basic/ignore-punctuation-joiners.html');
    $container = $('.basic-ignore-punctuation-joiners');

    $ctx1 = $container.children('div:nth-child(1)');
    $ctx2 = $container.children('div:nth-child(2)');
    $ctx3 = $container.children('div:nth-child(3)');
  });

  it('should find matches containing ignore joiners', done => {
    new Mark($ctx1[0]).mark('Lorem ipsum', {
      'separateWordSearch': false,
      'diacritics': false,
      'ignoreJoiners': true,
      'ignorePunctuation': punctuation,
      'done': () => {
        expect($ctx1.find('mark').length).toBe(6);
        let count = 0,
          regex = /lorem\s+ipsum/i;
        $ctx1.find('mark').each((i, elem) => {
          if (regex.test($(elem).text().replace(regexp, ''))) {
            count++;
          }
        });
        expect(count).toBe(6);

        done();
      }
    });
  });

  it('should find matches containing spaces and ignore joiners', done => {
    new Mark($ctx2[0]).mark(['ipsum'], {
      'separateWordSearch': false,
      'diacritics': false,
      'ignoreJoiners': true,
      'ignorePunctuation': punctuation,
      'done': () => {
        expect($ctx2.find('mark').length).toBe(6);
        let count = 0;
        $ctx2.find('mark').each((i, elem) => {
          if ($(elem).text().replace(regexp, '') === 'ipsum') {
            count++;
          }
        });
        expect(count).toBe(6);

        done();
      }
    });
  });

  it('should not break UTF-16 surrogate pairs', done => {
    $ctx3.find('p').text('A \uD87E\uDC04 Z \uD87E,\uDC04 \uD87E\u200d\uDC04 \uD87E\uDC04');

    new Mark($ctx3[0]).mark('你', {
      'diacritics': false,
      'ignoreJoiners': true,
      'ignorePunctuation': punctuation,
      'done': () => {
        let marks = $ctx3.find('mark');
        expect(marks.length).toBe(2);
        expect(marks.text()).toBe('你你');
        done();
      }
    });
  });
});
