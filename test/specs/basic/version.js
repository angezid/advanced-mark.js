'use strict';
describe('get mark library version', () => {
  let version;
  beforeEach(done => {
    version = new Mark('').getVersion();
    done();
  });

  it('should match version pattern', () => {
    expect(version).toMatch(/^\d+\.\d+\.\d+$/i);
  });
});
