'use strict';
describe('using CSS Custom Highlight API', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('highlight/main.html');
    $ctx = $('.basic');
  });

  afterEach(() => {
    if (CSS.highlights) CSS.highlights.clear();
  });

  it('should create expected number of Range objects', done => {
    let instance = new Mark($ctx[0]),
      // eslint-disable-next-line
      highlight = new Highlight(),
      array = ['lorem', 'ipsum', 'dolor'];

    instance.mark(array, {
      'highlight': highlight,
      'diacritics': false,
      'done': (total, totalMatches) => {
        expect(total).toBe(16);
        expect(total).toBe(highlight.size);
        expect(countHighlights(highlight, array)).toBe(totalMatches);

        done();
      }
    });
  });

  function countHighlights(highlight, array) {
    let count = 0;

    highlight.forEach((range) => {
      const node = range.startContainer;

      // match on single text node
      if (node.nodeType === 3) {
        if (array.includes(node.textContent.slice(range.startOffset, range.endOffset).toLowerCase())) {
          count++;
        }
      }
    });
    return count;
  }

});
