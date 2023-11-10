'use strict';
describe('basic mark with ignoreJoiners and diacritics', function() {
  var $ctx;
  beforeEach(function(done) {
    loadFixtures('basic/ignore-joiners-diacritics.html');

    $ctx = $('.basic-ignore-joiners-diacritics');
    new Mark($ctx.get()).mark(['Dolor', 'Lorem ipsum'], {
      'separateWordSearch': false,
      'ignoreJoiners': true,
      'diacritics': true,
      'done': function() {
        done();
      }
    });
  });

  it('should find matches containing diacritics', function() {
    expect($ctx.find('mark').length).toBe(15);
  });
});
