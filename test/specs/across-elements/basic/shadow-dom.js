'use strict';
describe('shadow DOM with acrossElements option', () => {
  let $ctx,
    array = ['dom', 'nested', 'excluded'],
    exclude = ['p.exclude', 'p.exclude *'],
    sequence = ['dom', 'dom', 'nested', 'dom', 'nested', 'nested', 'dom', 'nested', 'dom', 'dom', 'dom'];

  beforeEach(() => {
    loadFixtures('across-elements/basic/shadow-dom.html');

    $ctx = $('.context');

    let div = $ctx[0].querySelector('#shadow-dom');
    let root = div.attachShadow({ mode : 'open' });
    root.innerHTML = $('.shadow-dom-html').html();

    let div2 = root.querySelector('#nested-shadow-dom');
    let root2 = div2.attachShadow({ mode : 'open' });
    root2.innerHTML = $('.nested-shadow-dom-html').html();

    let div3 = root2.querySelector('#nested2-shadow-dom');
    let root3 = div3.attachShadow({ mode : 'open' });
    root3.innerHTML = $('.nested2-shadow-dom-html').html();
  });

  it('should mark/unmark shadow DOM', done => {
    new Mark($ctx[0]).mark(array, {
      'diacritics' : false,
      'acrossElements' : true,
      'shadowDOM' : true,
      'exclude' : exclude,
      'done' : () => {
        test();
        unmark(done);
      }
    });
  });

  // important to test 'cacheTextNodes' option
  it('should mark/unmark shadow DOM with cacheTextNodes option', done => {
    new Mark($ctx[0]).mark(array, {
      'diacritics' : false,
      'acrossElements' : true,
      'shadowDOM' : true,
      'cacheTextNodes' : true,
      'exclude' : exclude,
      'done' : () => {
        test();
        unmark(done);
      }
    });
  });

  // important to test 'blockElementsBoundary' option
  it('should mark/unmark shadow DOM with blockElementsBoundary option', done => {
    new Mark($ctx[0]).mark(array, {
      'diacritics' : false,
      'acrossElements' : true,
      'shadowDOM' : true,
      'exclude' : exclude,
      'blockElementsBoundary' : {
        tagNames : ['div', 'p'],
      },
      'done' : () => {
        test();
        unmark(done);
      }
    });
  });

  function test() {
    let marks = collectMarkElements($ctx[0]);
    expect(marks).toHaveLength(11);

    sequence.forEach(function(word, i) {
      expect(marks[i].textContent.toLowerCase()).toBe(word);
    });
  }

  function unmark(done) {
    new Mark($ctx[0]).unmark({
      'shadowDOM' : true,
      'done' : () => {
        expect(collectMarkElements($ctx[0])).toHaveLength(0);
        done();
      }
    });
  }

  function collectMarkElements(root) {
    let elements = [];

    let loop = function(node) {
      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.nodeName.toLowerCase() === 'mark' && node.hasAttribute('data-markjs')) {
            elements.push(node);
          }

          if (node.shadowRoot && node.shadowRoot.mode === 'open') {
            if (node.shadowRoot.firstChild) {
              loop(node.shadowRoot.firstChild);
            }
          }
        }

        if (node.hasChildNodes()) {
          loop(node.firstChild);
        }
        node = node.nextSibling;
      }
    };

    loop(root.firstChild);

    return elements;
  }

});
