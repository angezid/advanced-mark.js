
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

  it('should change an iframe style\'s content', done => {
    const instance = new Mark($ctx[0]),
      ownerDocument = $ctx[0].ownerDocument,
      iframeStyle = { style: 'mark[data-markjs] { color:red; }' },
      iframeStyle2 = { style: 'mark[data-markjs] { color:green; }' };

    let markElement;

    instance.mark('lorem', {
      'diacritics': false,
      'iframes': iframeStyle,
      'done': () => {

        instance.mark('dolor', {
          'diacritics': false,
          'iframes': iframeStyle2,
          'each': (elem, info) => {
            if (elem.ownerDocument !== ownerDocument) {
              markElement = elem;
              info.abort = true;
            }
          },
          'done': () => {
            const style = markElement.ownerDocument.head.querySelector('style[data-markjs]');
            expect(style.textContent).toEqual(iframeStyle2.style);

            done();
          }
        });
      }
    });
  });

  it('should remove a style from an iframe head', done => {
    const instance = new Mark($ctx[0]),
      iframeStyle = { style: 'mark[data-markjs] { color:red; }' },
      ownerDocument = $ctx[0].ownerDocument;
    let markElement;

    instance.mark('lorem', {
      'diacritics': false,
      'iframes': iframeStyle,
      'each': (elem, info) => {
        if (elem.ownerDocument !== ownerDocument) {
          markElement = elem;
          info.abort = true;
        }
      },
      'done': () => {

        instance.unmark({
          'iframes': { style: 'x' },
          'done': () => {
            const style = markElement.ownerDocument.head.querySelector('style[data-markjs]');
            expect(style).toBeNull();

            done();
          }
        });
      }
    });
  });

});
