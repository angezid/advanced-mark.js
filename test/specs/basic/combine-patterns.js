'use strict';
/* eslint-disable */
describe('markCombinePatterns() without acrossElements option', function() {
  var $ctx;
  var words = ['cafe', 'resume', 'expose', 'lame', 'mate', 'ore', 'pate', 'rose'],
    stats = { 'cafe' : 2, 'resume' : 3, 'expose' : 2, 'lame' : 2, 'mate' : 2, 'ore' : 3, 'pate' : 2, 'rose' : 2 };
  /* eslint-enable */
  beforeEach(function() {
    loadFixtures('basic/combine-patterns.html');

    $ctx = $('.diacritics');
  });

  it('should mark array with combinePatterns option', function(done) {
    var first = true, groups = 0;

    new Mark($ctx[0]).mark(words, {
      'combinePatterns' : 3,
      'accuracy' : 'exactly',
      each : function(elem, info) {
        if (first) {
          first = false;
          groups = info.match.length;
        }
      },
      'done' : function(m, totalMatches, termStats) {
        expect(groups).toBe(6);
        expect(totalMatches).toBe(18);
        expect($ctx.find('mark')).toHaveLength(18);

        for (var term in termStats) {
          expect(termStats[term]).toBe(stats[term]);
        }
        done();
      }
    });
  });
});
