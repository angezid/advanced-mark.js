'use strict';
/* eslint-disable */
describe('markCombinePatterns() with acrossElements option', function() {
  var $ctx;
  var words = ['cafe', 'resume', 'expose', 'lame', 'mate', 'ore', 'pate', 'rose'],
      stats = { 'cafe' : 2, 'resume' : 3, 'expose' : 2, 'lame' : 2, 'mate' : 2, 'ore' : 3, 'pate' : 2, 'rose' : 2 };
  /* eslint-enable */

  beforeEach(function() {
    loadFixtures('across-elements/basic/combine-patterns.html');

    $ctx = $('.diacritics');
  });

  it('should mark array with combinePatterns option', function(done) {
    var matchCount = 0, first = true, groups = 0;
    new Mark($ctx[0]).mark(words, {
      'separateWordSearch' : false,
      'accuracy' : 'exactly',
      'combinePatterns' : 4,
      'acrossElements' : true,
      'each' : function(elem, info) {
        if (info.matchStart) {
          matchCount++;
        }
        if (first) {
          first = false;
          groups = info.match.length;
        }
      },
      'done' : function(m, totalMatches, termStats) {
        expect(groups).toBe(7);
        expect(matchCount).toBe(18);
        expect(totalMatches).toBe(18);
        expect($ctx.find('mark')).toHaveLength(24);

        for (var term in termStats) {
          expect(termStats[term]).toBe(stats[term]);
        }
        done();
      }
    });
  });
});
