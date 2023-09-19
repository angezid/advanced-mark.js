'use strict';
describe('basic mark with wildcards between words', function() {
  var $ctx1, $ctx2, $ctx3, $ctx4;
  beforeEach(function() {
    loadFixtures('basic/wildcards-between-words.html');
  });

  it('should match wildcard with zero to one non-whitespace in the keyword', function(done) {
    $ctx1 = $('.basic-wildcards-between-words > div:nth-child(1)');

    new Mark($ctx1[0]).mark('lorem?ipsum', {
      'separateWordSearch': false,
      'diacritics': false,
      'wildcards': 'enabled',
      'done': function() {
        expect($ctx1.find('mark')).toHaveLength(4);
        done();
      }
    });
  });

  it('should match wildcard with zero or more non-whitespace in the keyword', function(done) {
    $ctx2 = $('.basic-wildcards-between-words > div:nth-child(2)');

    new Mark($ctx2[0]).mark('lorem*ipsum', {
      'separateWordSearch': false,
      'diacritics': false,
      'wildcards': 'enabled',
      'done': function() {
        expect($ctx2.find('mark')).toHaveLength(5);
        done();
      }
    });
  });

  it('should match wildcard with zero to one character in the keyword', function(done) {
    $ctx3 = $('.basic-wildcards-between-words > div:nth-child(3)');

    new Mark($ctx3[0]).mark('lorem?ipsum', {
      'separateWordSearch': false,
      'diacritics': false,
      'wildcards': 'withSpaces',
      'done': function() {
        expect($ctx3.find('mark')).toHaveLength(6);
        done();
      }
    });
  });

  it('should match wildcard with zero or more characters in the keyword', function(done) {
    $ctx4 = $('.basic-wildcards-between-words > div:nth-child(4)');

    new Mark($ctx4[0]).mark('lorem*ipsum', {
      'separateWordSearch': false,
      'diacritics': false,
      'wildcards': 'withSpaces',
      'done': function() {
        expect($ctx4.find('mark')).toHaveLength(9);
        done();
      }
    });
  });

});
