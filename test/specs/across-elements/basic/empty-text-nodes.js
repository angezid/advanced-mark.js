'use strict';
describe('empty text nodes across elements', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('across-elements/basic/empty-text-nodes.html');

    $ctx = $('.empty-text-nodes-across');
  });

  it('should not create empty text nodes', done => {
    let original = countTextNodes($ctx[0]),
      instance = new Mark($ctx[0]),
      previous = 0,
      next = 0;

    instance.mark(['Lorem', 'ipsum'], {
      'diacritics' : false,
      'acrossElements' : true,
      'each' : elem => {
        if (checkNode(elem.previousSibling)) {
          previous++;
        }
        if (checkNode(elem.nextSibling)) {
          next++;
        }
      },
      'done' : () => {
        instance.unmark({
          'done' : () => {
            expect('previous ' + previous).toBe('previous 0');
            expect('next ' + next).toBe('next 0');
            expect(countTextNodes($ctx[0])).toBe(original);
            done();
          }
        });
      }
    });
  });
  
  it('should not create empty text nodes with \'cacheTextNodes\' option', done => {
    let original = countTextNodes($ctx[0]),
      instance = new Mark($ctx[0]),
      previous = 0,
      next = 0;

    instance.mark(['Lorem', 'ipsum'], {
      'diacritics' : false,
      'acrossElements' : true,
      'cacheTextNodes' : true,
      'each' : elem => {
        if (checkNode(elem.previousSibling)) {
          previous++;
        }
        if (checkNode(elem.nextSibling)) {
          next++;
        }
      },
      'done' : () => {
        instance.unmark({
          'done' : () => {
            expect('previous ' + previous).toBe('previous 0');
            expect('next ' + next).toBe('next 0');
            expect(countTextNodes($ctx[0])).toBe(original);
            done();
          }
        });
      }
    });
  });

  function checkNode(node) {
    return node && node.nodeType === Node.TEXT_NODE && node.textContent.length === 0;
  }

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
