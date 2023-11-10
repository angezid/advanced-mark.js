'use strict';
describe('basic unmark with jquery', () => {
  let $ctx, ret;
  beforeEach(done => {
    loadFixtures('basic/main.html');

    $ctx = $('.basic');
    $ctx.mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'done': () => {
        ret = $ctx.unmark({
          'done': () => {
            // otherwise "ret =" will not be executed
            setTimeout(() => {
              done();
            }, 50);
          }
        });
      }
    });
  });

  it('should remove all marked elements', () => {
    expect($ctx).not.toContainElement('mark');
  });
  it('should return the provided context jquery element', () => {
    expect(ret instanceof $).toBe(true);
    expect(ret).toBeMatchedBy('.basic');
  });
});
