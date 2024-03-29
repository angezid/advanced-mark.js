'use strict';
describe('basic mark with no options', () => {
  let $ctx, err;
  beforeEach(() => {
    loadFixtures('basic/no-options.html');

    $ctx = $('.basic-no-options');
    err = false;
    try {
      new Mark($ctx[0]).mark('lorem ipsum');
    } catch (e){
      err = true;
    }
  });

  it('should not throw an error', () => {
    expect(err).toBe(false);
  });
  it('should wrap matches', () => {
    expect($ctx.find('mark').length).toBeGreaterThan(0);
  });
});
