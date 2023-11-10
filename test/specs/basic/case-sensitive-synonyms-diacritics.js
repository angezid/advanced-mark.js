'use strict';
describe('basic mark with caseSensitive synonyms and diacritics', function() {
  var $ctx;
  beforeEach(function(done) {
    loadFixtures('basic/case-sensitive-synonyms-diacritics.html');

    $ctx = $('.basic-case-sensitive-synonyms-diacritics');
    new Mark($ctx[0]).mark(['Dolor', 'Aliquam', 'Sed', 'Lorèm ipsum'], {
      'separateWordSearch': false,
      'synonyms': {
        'Sed': 'justø',
        'Dolor': 'Ãmet'
      },
      'caseSensitive': true,
      'done': function() {
        done();
      }
    });
  });

  it('should find case sensitive synonyms with diacritics', function() {
    expect($ctx.find('mark').length).toBe(15);
  });
});
