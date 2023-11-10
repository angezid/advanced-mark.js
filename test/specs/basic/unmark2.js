'use strict';
describe('basic unmark', () => {
  let $ctx, $ctx2;
  beforeEach(() => {
    loadFixtures('basic/unmark.html');

    $ctx = $('p#normal');
    $ctx2 = $('p#marked');
  });

  it('should remove all mark elements and restore the DOM to the original state', done => {
    let count = countTextNodes($ctx[0]),
      text = $ctx.text(),
      instance = new Mark($ctx[0]);

    instance.mark('lorem ipsum dolor', {
      'diacritics': false,
      'done': () => {
        expect($ctx.find('mark').length).toBe(16);

        instance.unmark({
          'done': () => {
            expect(text).toBe($ctx.text());
            expect(countTextNodes($ctx[0])).toBe(count);
            done();
          }
        });
      }
    });
  });

  it('should remove all mark elements', done => {
    new Mark($ctx2[0]).unmark({
      'done': () => {
        expect($ctx2.find('mark').length).toBe(0);
        done();
      }
    });
  });

  function countTextNodes(ctx) {
    let iterator = document.createNodeIterator(ctx, NodeFilter.SHOW_TEXT, () => {
      return NodeFilter.FILTER_ACCEPT;
    }, false);

    let count = 0;
    while (iterator.nextNode()) {
      count++;
    }
    return count;
  }
});
