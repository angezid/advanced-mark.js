'use strict';
describe('mark in inaccessible iframes', () => {
  let $ctx, $elements, errCall;
  beforeEach(done => {
    loadFixtures('iframes/inaccessible.html');

    $elements = $();
    $ctx = $('.iframes-inaccessible');
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

  it('should silently skip iframes which can not be accessed', () => {
    expect(errCall).toBe(0);
    expect($elements).toHaveLength(4);
  });
});
