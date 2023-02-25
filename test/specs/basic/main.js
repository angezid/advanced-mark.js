'use strict';
describe('basic mark', function() {
  var $ctx;
  beforeEach(function() {
    loadFixtures('basic/main.html');

    $ctx = $('.basic');
  });

  it('return an object with further methods', function(done) {
    var ret = new Mark($ctx[0]).mark('lorem');
    expect(ret instanceof Mark).toBe(true);
    expect(typeof ret.mark).toBe('function');
    expect(typeof ret.unmark).toBe('function');
    expect(typeof ret.markRegExp).toBe('function');
    done();
  });
});
