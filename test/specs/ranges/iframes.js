'use strict';
describe('mark with range in iframes', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('ranges/iframes.html');

    $ctx = $('.ranges-iframes');
    new Mark($ctx[0]).markRanges([
      // "lorem" in iframes.html
      { start: 14, length: 5 },
      // "lorem" in inc.html iframe
      { start: 70, length: 5 },
      // "testing" in inc.html iframe
      { start: 82, length: 7 }
    ], {
      'iframes': true,
      'done': () => {
        done();
      }
    });
  });

  it('should mark correct range including iframes', () => {
    expect($ctx.find('mark').length).toBe(1);
    expect($ctx.find('iframe').contents().find('mark').length).toBe(2);
  });
});
