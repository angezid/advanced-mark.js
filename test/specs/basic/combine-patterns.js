'use strict';
describe('markCombinePatterns() without acrossElements option', function() {
  var $ctx;
  var words = ['cafe', 'resume', 'expose', 'lame', 'mate', 'ore', 'pate', 'rose'],
    stats = { 'cafe' : 2, 'resume' : 3, 'expose' : 2, 'lame' : 2, 'mate' : 2, 'ore' : 3, 'pate' : 2, 'rose' : 2 };

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
        // match[0], lookbehind, main group, 3 term groups
        expect(groups).toBe(6);
        expect(totalMatches).toBe(18);
        expect($ctx.find('mark').length).toBe(18);

        for (var term in termStats) {
          expect(termStats[term]).toBe(stats[term]);
        }
        done();
      }
    });
  });

  it('should mark first match of each array item', function(done) {
    new Mark($ctx[0]).mark(words, {
      'combinePatterns' : 2,
      'accuracy' : 'exactly',
      'filter' : function(node, term, marks, termMatchCount) {
        // 'info.execution.abort' is useless here as it will break execution of whole combine pattern
        if (termMatchCount >= 1) {
          return false;
        }
        return true;
      },
      'done' : function(m, totalMatches, termStats) {
        expect($ctx.find('mark').length).toBe(8);

        for (var term in termStats) {
          expect(termStats[term]).toBe(1);
        }
        done();
      }
    });
  });

  it('should create a single combine pattern with `combinePatterns : Infinity`', function(done) {
    var first = true, groups = 0;

    new Mark($ctx[0]).mark(words, {
      'combinePatterns' : Infinity,
      'each' : function(elem, info) {
        if (first) {
          first = false;
          groups = info.match.length;
        }
      },
      'done' : function() {
        // match[0], lookbehind, main group, 8 term groups
        expect(groups).toBe(11);
        expect($ctx.find('mark').length).toBe(18);
        done();
      }
    });
  });
});
