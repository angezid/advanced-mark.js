'use strict';
describe('mark with iframes and exclude', () => {
  let $ctx, $elements;
  beforeEach(done => {
    loadFixtures('iframes/exclude.html');

    $elements = $();
    $ctx = $('.iframes-exclude');
    new Mark($ctx[0]).mark('lorem', {
      'diacritics': false,
      'separateWordSearch': false,
      'iframes': true,
      'exclude': [
        '.ignore'
      ],
      'each': function($m) {
        $elements = $elements.add($($m));
      },
      'done': () => {
        done();
      }
    });
  });

  it('should ignore iframes matching exclude selectors', () => {
    expect($elements).toHaveLength(4);
  });
});
