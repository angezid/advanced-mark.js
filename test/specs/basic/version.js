'use strict';
describe('get mark library version', function() {
  var version;
  beforeEach(function(done) {
    version = new Mark('').getVersion();
    done();
  });

  it('should match version pattern', function() {
    expect(version).toMatch(/^\d+\.\d+\.\d+$/i);
  });
});
