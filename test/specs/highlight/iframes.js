'use strict';
describe('customize a iframe\'s style when using the Highlight API', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('highlight/iframe.html');
    $ctx = $('.iframes');
  });

  afterEach(() => {
    if (CSS.highlights) CSS.highlights.clear();
  });

  it('should create expected number of Range objects and add style to iframe head', done => {
    let instance = new Mark($ctx[0]),
      // eslint-disable-next-line
      highlight = new Highlight(),
      array = ['lorem', 'ipsum', 'dolor'],
      iframeStyle = { style: '::highlight(advanced-markjs) { color:red; }' };

    instance.mark(array, {
      'highlight': highlight,
      'diacritics': false,
      'iframes': iframeStyle,
      'done': (total) => {
        expect(total).toBe(32);
        expect(total).toBe(highlight.size);

        const { count, style } = countHighlightsAndGetStyle(highlight, array);
        expect(count).toBe(16);

        expect(style.getAttribute('data-markjs')).not.toBeNull();
        expect(style.textContent).toEqual(iframeStyle.style);

        done();
      }
    });
  });

  function countHighlightsAndGetStyle(highlight, array) {
    const ownerDocument = $ctx[0].ownerDocument;
    let count = 0,
      style,
      first;

    highlight.forEach((range) => {
      const node = range.startContainer;

      if (node.ownerDocument !== ownerDocument) {
        // match on single text node
        if (node.nodeType === 3) {
          if (array.includes(node.textContent.slice(range.startOffset, range.endOffset).toLowerCase())) {
            count++;
          }
        }

        if ( !first) {
          // a iframe style is appended to the head
          style = node.ownerDocument.head.lastElementChild;
          first = true;
        }
      }
    });

    return { count, style };
  }
});
