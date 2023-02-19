'use strict';
describe('empty text nodes', function() {
  var $ctx;
  beforeEach(function() {
    loadFixtures('basic/empty-text-nodes.html');

    $ctx = $('.empty-text-nodes');
  });

  it('should not create empty text nodes', function(done) {
    var original = countTextNodes($ctx[0]),
      instance = new Mark($ctx[0]),
      previous = 0,
      next = 0;

    instance.mark(['Lorem', 'ipsum'], {
      'diacritics' : false,
      'each' : function(elem) {
        if (checkNode(elem.previousSibling)) {
          previous++;
        }
        if (checkNode(elem.nextSibling)) {
          next++;
        }
      },
      'done' : function() {
        instance.unmark({
          'done' : function() {
            expect('previous ' + previous).toBe('previous 0');
            expect('next ' + next).toBe('next 0');
            expect(countTextNodes($ctx[0])).toBe(original);
            done();
          }
        });
      }
    });
  });

  it('should not create empty text nodes with \'cacheTextNodes\' option', function(done) {
    var original = countTextNodes($ctx[0]),
      instance = new Mark($ctx[0]),
      previous = 0,
      next = 0;

    instance.mark(['Lorem', 'ipsum'], {
      'diacritics' : false,
      'cacheTextNodes' : true,
      'each' : function(elem) {
        if (checkNode(elem.previousSibling)) {
          previous++;
        }
        if (checkNode(elem.nextSibling)) {
          next++;
        }
      },
      'done' : function() {
        instance.unmark({
          'done' : function() {
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
    var iterator = document.createNodeIterator(ctx, NodeFilter.SHOW_TEXT, function filter() {
      return NodeFilter.FILTER_ACCEPT;
    }, false);

    var count = 0;
    while (iterator.nextNode()) {
      count++;
    }
    return count;
  }

});
