
'use strict';

describe('customize a iframe\'s style', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('iframes/main.html');
    $ctx = $('.iframes');
  });

  it('should wrap matches inside iframe and add style to iframe head', done => {
    const instance = new Mark($ctx[0]),
      array = ['lorem', 'ipsum', 'dolor'],
      iframeStyle = { style: 'mark[data-markjs] { color:red; }' },
      ownerDocument = $ctx[0].ownerDocument,
      marks = [];

    instance.mark(array, {
      'diacritics': false,
      'iframes': iframeStyle,
      'each': (elem) => {
        if (elem.ownerDocument !== ownerDocument) marks.push(elem);
      },
      'done': (total) => {
        expect(total).toBe(32);
        expect(marks.length).toBe(16);

        // a iframe style is appended to the head
        const style = marks[0].ownerDocument.head.lastElementChild;
        expect(style.getAttribute('data-markjs')).not.toBeNull();
        expect(style.textContent).toEqual(iframeStyle.style);

        done();
      }
    });
  });
});
