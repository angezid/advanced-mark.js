'use strict';
describe(
  'mark with acrossElements, regular expression and filter callback',
  function() {
    var $ctx;
    beforeEach(function() {
      loadFixtures('across-elements/regexp/filter.html');

      $ctx = $('.across-elements-regexp-filter');
    });

    it('should call the callback with the right parameters', function(done) {
      var count = 0,
        textOpts = ['Lorem', 'ipsum'];
      
      new Mark($ctx[0]).markRegExp(/Lorem|ipsum/gi, {
        'acrossElements': true,
        'filter': function(node, term, matchesSoFar, info) {
          expect(node.nodeType).toBe(3);
          expect($.inArray(term, textOpts)).toBeGreaterThan(-1);
          expect(count).toBe(matchesSoFar);
          
          if (info.matchStart) {
            count++;
          }
          return true;
        },
        'done': function() {
          expect($ctx.find('mark').length).toBe(9);
          done();
        }
      });
    });
  }
);
