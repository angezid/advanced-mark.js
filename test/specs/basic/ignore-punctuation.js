'use strict';
describe('basic mark with ignorePunctuation', function() {
  function getPunctuation() {
    return '^:;.,-–—‒_(){}[]!\'"+='.replace(/[-^\]\\]/g, '\\$&');
  }
  var $ctx1, $ctx2, $ctx3,
    punctuation = getPunctuation(),
    regexp = new RegExp('[' + punctuation + ']', 'g');

  beforeEach(function() {
    loadFixtures('basic/ignore-punctuation.html');
  });

  it('should find matches when \'ignorePunctuation\' option is a string of punctuation characters', function(done) {
    $ctx1 = $('.basic-ignore-punctuation > div:nth-child(1)');

    new Mark($ctx1[0]).mark('Lorem ipsum', {
      'separateWordSearch': false,
      'diacritics': false,
      'ignorePunctuation': punctuation,
      'done': function(totalMarks, totalMatches) {
        expect(totalMatches).toBe(5);
        done();
      }
    });
  });
  
  it('should find single word matches', function(done) {
    $ctx1 = $('.basic-ignore-punctuation > div:nth-child(1)');

    new Mark($ctx1[0]).mark('ipsum', {
      'separateWordSearch': false,
      'diacritics': false,
      'ignorePunctuation': punctuation.split(''),
      'done': function() {
        expect($ctx1.find('mark')).toHaveLength(5);
        var count = 0;
        $ctx1.find('mark').each(function() {
          if ($(this).text().replace(regexp, '') === 'ipsum') {
            count++;
          }
        });
        expect(count).toBe(5);
        done();
      }
    });
  });

  it('should find matches containing whitespace', function(done) {
    $ctx2 = $('.basic-ignore-punctuation > div:nth-child(2)');

    new Mark($ctx2[0]).mark(['Lorem ipsum'], {
      'separateWordSearch': false,
      'diacritics': false,
      'ignorePunctuation': punctuation.split(''),
      'done': function() {
        expect($ctx2.find('mark')).toHaveLength(5);
        var count = 0,
          regex = /lorem\s+ipsum/i;
        $ctx2.find('mark').each(function() {
          if (regex.test($(this).text().replace(regexp, ''))) {
            count++;
          }
        });
        expect(count).toBe(5);
        done();
      }
    });
  });

  it('should not find matches when disabled', function(done) {
    $ctx3 = $('.basic-ignore-punctuation > div:nth-child(3)');

    new Mark($ctx3[0]).mark(['ipsum'], {
      'separateWordSearch': false,
      'diacritics': false,
      'ignorePunctuation': '',
      'done': function() {
        expect($ctx3.find('mark')).toHaveLength(1);
        done();
      }
    });
  });
});
