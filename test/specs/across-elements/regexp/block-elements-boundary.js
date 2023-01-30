'use strict';
describe('markRegExp() with acrossElements and blockElementsBoundary options', function() {
  var $ctx,
    reg = /\bblock[\s|]+elements\s+boundary\b/gi;

  beforeEach(function() {
    loadFixtures('across-elements/regexp/block-elements-boundary.html');

    $ctx = $('.block-elements-boundary');
  });

  it('should mark phrases with custom elements added to the default elements', function(done) {
    new Mark($ctx[0]).markRegExp(reg, {
      'acrossElements' : true,
      'blockElementsBoundary' : {
        tagNames : ['s', 'my-tag'],
        extend : true,
        'char' : '|'
      },
      'done' : function(totalMarks, totalMatches) {
        expect(totalMatches).toBe(3);
        done();
      }
    });
  });
});
