'use strict';
describe('basic unmark', function() {
  var $ctx, $ctx2;
  beforeEach(function() {
    loadFixtures('basic/unmark.html');

    $ctx = $('p#normal');
    $ctx2 = $('p#marked');
  });

  it('should remove all mark elements and restore the DOM to the original state', function(done) {
    var count = countTextNodes($ctx[0]),
      text = $ctx.text(),
      instance = new Mark($ctx[0]);

    instance.mark('lorem ipsum dolor', {
      'diacritics': false,
      'done': function() {
        expect($ctx.find('mark').length).toBe(16);

        instance.unmark({
          'done': function() {
            expect(text).toBe($ctx.text());
            expect(countTextNodes($ctx[0])).toBe(count);
            done();
          }
        });
      }
    });
  });

  it('should remove all mark elements', function(done) {
    new Mark($ctx2[0]).unmark({
      'done': function() {
        expect($ctx2.find('mark').length).toBe(0);
        done();
      }
    });
  });

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
