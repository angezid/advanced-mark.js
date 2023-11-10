'use strict';
describe('unmark with nested iframes', () => {
  let $ctx, $elements, errCall;
  beforeEach(done => {
    loadFixtures('iframes/nested.html');

    $ctx = $('.iframes-nested');
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

  it(
    'should remove all marked elements inside iframes recursively',
    function() {
      expect(errCall).toBe(0);
      $elements.each(() => {
        expect(this).not.toBeInDOM();
      });
    }
  );
});
