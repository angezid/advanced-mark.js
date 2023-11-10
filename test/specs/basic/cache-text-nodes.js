'use strict';
describe('cache text nodes without acrossElements option', () => {
  let $ctx;
  let words = ['lorem', 'ipsum', 'dolor', 'sed', 'diam'];

  beforeEach(() => {
    loadFixtures('basic/cache-text-nodes.html');

    $ctx = $('.context');
  });

  it('should mark array with cacheTextNodes option', done => {
    new Mark($ctx[0]).mark(words, {
      'cacheTextNodes' : true,
      'accuracy' : 'exactly',
      'done' : (m, totalMatches) => {
        expect(totalMatches).toBe(20);
        expect($ctx.find('mark').length).toBe(20);
        done();
      }
    });
  });

  it('should build & wrap ranges from array', done => {
    let ranges = [], total = 0;

    new Mark($ctx[0]).mark(words, {
      'cacheTextNodes' : true,
      'accuracy' : 'exactly',
      'filter' : (node, term, t, c, info) => {
        total++;

        ranges.push({
          start : info.offset + info.match.index + info.match[1].length,
          length : info.match[2].length,
        });
        // it should only build ranges
        return  false;
      },
      'done' : () => {
        new Mark($ctx[0]).markRanges(ranges, {
          done : (totalMarks, totalMatches) => {
            expect(totalMatches).toBe(total);
            expect(totalMatches).toBe(20);
            expect(checkWords()).toBe(true);
            done();
          }
        });
      }
    });
  });

  function checkWords() {
    let success = true;
    // it checks correctness of marked words
    $('mark').each(function(i, elem) {
      if (words.indexOf(elem.textContent.toLowerCase()) === -1) {
        success = false;
        return false;
      }
      return true;
    });
    return success;
  }
});
