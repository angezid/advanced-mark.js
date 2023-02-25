'use strict';
describe('basic mark called with jquery', function() {
  var $ctx;
  beforeEach(function() {
    loadFixtures('basic/main.html');

    $ctx = $('.basic');
  });

  it('should return the provided context jquery element', function(done) {
    var ret = $ctx.mark('lorem');
    expect(ret instanceof $).toBe(true);
    expect(ret).toBeMatchedBy('.basic');
    done();
  });
});
