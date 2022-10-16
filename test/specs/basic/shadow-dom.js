'use strict';
describe('shadow DOM without acrossElements option', function() {
  var $ctx,
    array = ['dom', 'nested', 'excluded'],
    exclude = ['p.exclude', 'p.exclude *'];

  beforeEach(function() {
    loadFixtures('basic/shadow-dom.html');

    $ctx = $('.context');

    var div = $ctx[0].querySelector('#shadow-dom');
    var root = div.attachShadow({ mode : 'open' });
    root.innerHTML = $('.shadow-dom-html').html();

    var div2 = root.querySelector('#nested-shadow-dom');
    var root2 = div2.attachShadow({ mode : 'open' });
    root2.innerHTML = $('.nested-shadow-dom-html').html();

    var div3 = root2.querySelector('#nested2-shadow-dom');
    var root3 = div3.attachShadow({ mode : 'open' });
    root3.innerHTML = $('.nested2-shadow-dom-html').html();
  });

  it('should mark/unmark shadow DOM', function(done) {
    const styleObj = { style : 'mark[data-markjs] { background: #ffe408; }' };

    new Mark($ctx[0]).mark(array, {
      'diacritics' : false,
      'shadowDOM' : styleObj,
      'exclude' : exclude,
      'done' : function() {
        var obj = collectElements($ctx[0], styleObj);
        expect(obj.elements).toHaveLength(11);
        expect(obj.styles).toHaveLength(3);
        testExcluded(obj.elements);
        unmark(done);
      }
    });
  });

  // important to test 'cacheTextNodes' option
  it('should mark/unmark shadow DOM with cacheTextNodes option', function(done) {
    const styleObj = {};

    new Mark($ctx[0]).mark(array, {
      'diacritics' : false,
      'shadowDOM' : styleObj,
      'cacheTextNodes' : true,
      'exclude' : exclude,
      'done' : function() {
        var obj = collectElements($ctx[0]);
        expect(obj.elements).toHaveLength(11);
        testExcluded(obj.elements);
        unmark(done);
      }
    });
  });

  function testExcluded(elements) {
    expect(elements.filter(function(el) {
      return /excluded/i.test(el.textContent);
    })).toHaveLength(0);
  }

  function unmark(done) {
    new Mark($ctx[0]).unmark({
      'shadowDOM' : true,
      'done' : function() {
        var obj = collectElements($ctx[0]);
        expect(obj.elements).toHaveLength(0);
        expect(obj.styles).toHaveLength(0);
        done();
      }
    });
  }

  function collectElements(root, obj) {
    var elements = [],
      styles = [];

    var loop = function(node) {
      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.nodeName.toLowerCase() === 'mark' && node.hasAttribute('data-markjs')) {
            elements.push(node);
          }

          if (node.shadowRoot && node.shadowRoot.mode === 'open') {
            if (obj && obj.style) {
              let style = node.shadowRoot.querySelector('style');
              if (style) {
                styles.push(style);
              }
            }

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

    return { elements, styles };
  }

});
