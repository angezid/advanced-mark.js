'use strict';
describe('basic mark called with jquery', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('basic/main.html');

    $ctx = $('.basic');
  });

  it('should return the provided context jquery element', done => {
    let ret = $ctx.mark('lorem');
    expect(ret instanceof $).toBe(true);
    expect(ret).toBeMatchedBy('.basic');
    done();
  });
});
