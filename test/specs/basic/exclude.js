'use strict';
describe('basic mark with exclude', function() {
  var $ctx;
  beforeEach(function() {
    loadFixtures('basic/exclude.html');

    $ctx = $('.basic-exclude');
  });

  it('should exclude elements from searching when \'exclude\' option is an array of selectors', function(done) {
    new Mark($ctx[0]).mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'exclude': ['*[data-ignore]', '.ignore'],
      'done': function() {
        expect($ctx.find('mark')).toHaveLength(4);
        done();
      }
    });
  });
  
  it('should exclude elements from searching when \'exclude\' option is a string of selectors', function(done) {
    new Mark($ctx[0]).mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'exclude': '*[data-ignore], .ignore',
      'done': function() {
        expect($ctx.find('mark')).toHaveLength(4);
        done();
      }
    });
  });
});
