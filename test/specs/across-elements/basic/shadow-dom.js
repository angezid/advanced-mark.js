'use strict';
describe('shadow DOM with acrossElements option', function() {
  var $ctx,
    array = ['dom', 'nested', 'excluded'],
    exclude = ['p.exclude', 'p.exclude *'],
    sequence = ['dom', 'dom', 'nested', 'dom', 'nested', 'nested', 'dom', 'nested', 'dom', 'dom', 'dom'];

  beforeEach(function() {
    loadFixtures('across-elements/basic/shadow-dom.html');

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
    new Mark($ctx[0]).mark(array, {
      'diacritics' : false,
      'acrossElements' : true,
      'shadowDOM' : true,
      'exclude' : exclude,
      'done' : function() {
        test();
        unmark(done);
      }
    });
  });

  // important to test 'cacheTextNodes' option
  it('should mark/unmark shadow DOM with cacheTextNodes option', function(done) {
    new Mark($ctx[0]).mark(array, {
      'diacritics' : false,
      'acrossElements' : true,
      'shadowDOM' : true,
      'cacheTextNodes' : true,
      'exclude' : exclude,
      'done' : function() {
        test();
        unmark(done);
      }
    });
  });

  function test() {
    var marks = collectMarkElements($ctx[0]);
    expect(marks).toHaveLength(11);
    
    sequence.forEach(function(word, i) {
      expect(marks[i].textContent.toLowerCase()).toBe(word);
    });
  }

  function unmark(done) {
    new Mark($ctx[0]).unmark({
      'shadowDOM' : true,
      'done' : function() {
        expect(collectMarkElements($ctx[0])).toHaveLength(0);
        done();
      }
    });
  }

  function collectMarkElements(root) {
    var elements = [];

    var loop = function(node) {
      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.nodeName.toLowerCase() === 'mark' && node.hasAttribute('data-markjs')) {
            elements.push(node);
          }

          if (node.shadowRoot && node.shadowRoot.mode === 'open') {
            let elem = node.shadowRoot.querySelector(':first-child');
            if (elem) {
              loop(elem);
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
