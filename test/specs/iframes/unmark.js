'use strict';
describe('unmark with iframes', () => {
  let $ctx, $elements, errCall;
  beforeEach(done => {
    loadFixtures('iframes/main.html');

    $ctx = $('.iframes');
    $elements = $();
    errCall = 0;
    try {
      let instance = new Mark($ctx[0]);
      instance.mark('lorem', {
        'diacritics': false,
        'separateWordSearch': false,
        'iframes': true,
        'each': function($el) {
          $elements = $elements.add($($el));
        },
        'done': () => {
          instance.unmark({
            'iframes': true,
            'done': () => {
              done();
            }
          });
        }
      });
    } catch (e) {
      errCall++;
    }
  });

  it('should remove all marked elements inside iframes', () => {
    expect(errCall).toBe(0);
    $elements.each(() => {
      expect(this).not.toBeInDOM();
    });
  });
});
