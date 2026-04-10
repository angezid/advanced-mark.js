'use strict';
describe('basic mark with filter callback', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('basic/filter.html');

    $ctx = $('.basic-filter');
  });

  it('should call the callback with the right parameters', done => {
    let counter = {
        'lorem': 0,
        'ipsum': 0,
        'dolor': 0
      },
      totalCounter = 0,
      calls = 0;
    try {
      new Mark($ctx[0]).mark(Object.keys(counter), {
        'diacritics': false,
        'separateWordSearch': false,
        'filter': (node, term, totalMatches, matches) => {
          expect(node.nodeType).toBe(3);

          expect($.inArray(term, Object.keys(counter))).toBeGreaterThan(-1);

          expect(totalCounter).toBe(totalMatches);
          expect(counter[term]).toBe(matches);

          if (++calls !== 3) {
            counter[term]++;
            totalCounter++;
            return true;
          } else {
            return false;
          }
        },
        'done': () => {
          expect($ctx.find('mark').length).toBe(15);
          done();
        }
      });
    } catch (e){
      done.fail(e.message);
    }
  });

  it('should correctly count matches so far', done => {
    let count = 0;

    new Mark($ctx[0]).mark('lorem ipsum dolor sit amet et diam vero', {
      'diacritics': false,
      'combinePatterns' : 3,
      'filter': (node, term, matchesSoFar) => {
        count = matchesSoFar;
        return true;
      },
      'done': () => {
        // + 1 because matchesSoFar counter is set on the 'each' callback
        expect($ctx.find('mark').length).toBe(count + 1);

        done();
      }
    });
  });

  it('should correctly count matches so far with \'combinePatterns: Infinity\'', done => {
    new Mark($ctx[0]).mark('lorem ipsum dolor', {
      'diacritics': false,
      'combinePatterns' : Infinity,
      'filter': (node, term, totalMatchesSoFar, termMatches, info) => {
        if (totalMatchesSoFar >= 9) {
          info.execution.abort = true;
          return  false;
        }
        return true;
      },
      'done': (m, totalMatches) => {
        expect($ctx.find('mark').length).toBe(9);
        expect(totalMatches).toBe(9);

        done();
      }
    });
  });

});
