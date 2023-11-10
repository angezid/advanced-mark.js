'use strict';
describe('mark with disabled iframes', () => {
  let $ctx, $elements, errCall;
  beforeEach(done => {
    loadFixtures('iframes/disabled.html');

    $elements = $();
    $ctx = $('.iframes-disabled');
    errCall = 0;
    try {
      new Mark($ctx[0]).mark('lorem', {
        'diacritics': false,
        'separateWordSearch': false,
        'iframes': false,
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

  it('should ignore matches inside iframes if specified', () => {
    expect(errCall).toBe(0);
    let unequal = false;
    $elements.each((i, elem) => {
      if ($(elem).prop('ownerDocument') !== $ctx.prop('ownerDocument')) {
        unequal = true;
      }
    });
    expect(unequal).toBe(false);
    expect($elements).toHaveLength(4);
  });
});
