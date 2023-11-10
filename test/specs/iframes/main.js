'use strict';
describe('mark with iframes', () => {
  let $ctx, $elements, errCall;
  beforeEach(done => {
    loadFixtures('iframes/main.html');

    $elements = $();
    $ctx = $('.iframes');
    errCall = 0;
    try {
      new Mark($ctx[0]).mark('lorem', {
        'diacritics': false,
        'separateWordSearch': false,
        'iframes': true,
        'each': function($m) {
          $elements = $elements.add($($m));
        },
        'done': () => {
          done();
        }
      });
    } catch (e) {
      errCall++;
    }
  }, 30000); // 30 sec timeout

  it('should wrap matches inside iframes', () => {
    expect(errCall).toBe(0);
    expect($elements).toHaveLength(8);
    let unequal = false;
    $elements.each((i, elem) => {
      // make sure that some elements are inside an iframe
      if ($(elem).prop('ownerDocument') !== $ctx.prop('ownerDocument')) {
        unequal = true;
      }
    });
    expect(unequal).toBe(true);
  });
});
