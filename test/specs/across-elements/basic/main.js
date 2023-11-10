'use strict';
describe('mark with acrossElements', function() {
  var $ctx;
  beforeEach(function(done) {
    loadFixtures('across-elements/basic/main.html');

    $ctx = $('.across-elements');
    new Mark($ctx[0]).mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'acrossElements': true,
      'done': function() {
        done();
      }
    });
  });

  it('should wrap matches', function() {
    expect($ctx.find('mark').length).toBe(6);
  });
});
