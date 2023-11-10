'use strict';
describe('markCombinePatterns() with acrossElements option', () => {
  let $ctx;
  let words = ['cafe', 'resume', 'expose', 'lame', 'mate', 'ore', 'pate', 'rose'],
    stats = { 'cafe' : 2, 'resume' : 3, 'expose' : 2, 'lame' : 2, 'mate' : 2, 'ore' : 3, 'pate' : 2, 'rose' : 2 };

  beforeEach(() => {
    loadFixtures('across-elements/basic/combine-patterns.html');

    $ctx = $('.diacritics');
  });

  it('should mark array with combinePatterns option', done => {
    let matchCount = 0, first = true, groups = 0;
    new Mark($ctx[0]).mark(words, {
      'accuracy' : 'exactly',
      'combinePatterns' : 4,
      'acrossElements' : true,
      'each' : (elem, info) => {
        if (info.matchStart) {
          matchCount++;
        }
        if (first) {
          first = false;
          groups = info.match.length;
        }
      },
      'done' : (m, totalMatches, termStats) => {
        // match[0], lookbehind, main group, 4 term groups
        expect(groups).toBe(7);
        expect(matchCount).toBe(18);
        expect(totalMatches).toBe(18);
        expect($ctx.find('mark').length).toBe(24);

        for (let term in termStats) {
          expect(termStats[term]).toBe(stats[term]);
        }
        done();
      }
    });
  });

  it('should mark first match of each array item', done => {
    new Mark($ctx[0]).mark(words, {
      'accuracy' : 'exactly',
      'combinePatterns' : 4,
      'acrossElements' : true,
      'filter' : (node, term, marks, termMatchCount) => {
        // 'info.execution.abort' is useless here as it will break execution
        // of whole combine pattern
        if (termMatchCount >= 1) {
          return false;
        }
        return true;
      },
      'done' : (m, totalMatches, termStats) => {
        expect($ctx.find('mark').length).toBe(8);

        for (let term in termStats) {
          expect(termStats[term]).toBe(1);
        }
        done();
      }
    });
  });
});
