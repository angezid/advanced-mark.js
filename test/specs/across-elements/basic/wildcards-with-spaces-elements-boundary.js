'use strict';
describe('mark across elements with wildcards', function() {
  var $ctx,
    str = 'block elements boundary',
    message = 'should limit matches within block elements; ';

  beforeEach(function() {
    loadFixtures('across-elements/basic/block-elements-boundary.html');

    $ctx = $('.block-elements-boundary');
  });

  it(message + 'wildcards : \'withSpaces\' opt and custom boundary char', function(done) {
    new Mark($ctx[0]).mark(str, {
      'diacritics' : false,
      'separateWordSearch' : false,
      'wildcards' : 'withSpaces',
      'acrossElements' : true,
      'blockElementsBoundary' : {
        char : '|'
      },
      'done' : function(totalMarks, totalMatches) {
        expect(totalMatches).toBe(3);
        done();
      }
    });
  });

  it(message + 'wildcards : \'withSpaces\' opt', function(done) {
    new Mark($ctx[0]).mark(str, {
      'diacritics' : false,
      'separateWordSearch' : false,
      'wildcards' : 'withSpaces',
      'acrossElements' : true,
      'blockElementsBoundary' : true,
      'done' : function(totalMarks, totalMatches) {
        expect(totalMatches).toBe(3);
        done();
      }
    });
  });

});
