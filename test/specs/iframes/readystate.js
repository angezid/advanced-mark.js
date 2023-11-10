'use strict';
describe('mark with iframes where onload was already fired', () => {
  let $ctx, $elements, errCall;
  beforeEach(done => {
    loadFixtures('iframes/readystate.html');

    $elements = $();
    $ctx = $('.iframes-readystate');
    errCall = 0;
    try {
      let int = setInterval(() => {
        let iCon = $ctx.find('iframe').first()[0].contentWindow,
          readyState = iCon.document.readyState,
          href = iCon.location.href;
        // about:blank check is necessary for Chrome
        // (see Mark~onIframeReady)
        if (readyState === 'complete' && href !== 'about:blank') {
          clearInterval(int);
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
        }
      }, 100);
    } catch (e) {
      errCall++;
    }
  }, 30000); // 30 sec timeout

  it('should wrap matches inside iframes', () => {
    expect(errCall).toBe(0);
    expect($elements).toHaveLength(8);
    let unequal = false;
    $elements.each((i, elem) => {
      if ($(elem).prop('ownerDocument') !== $ctx.prop('ownerDocument')) {
        unequal = true;
      }
    });
    expect(unequal).toBe(true);
  });
});
