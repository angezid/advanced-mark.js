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

  it('should correctly count total matches so far', done => {
    new Mark($ctx[0]).mark('lorem ipsum dolor', {
      'diacritics': false,
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

  it('should be able to break an execution on the \'each\' callback', done => {
    new Mark($ctx[0]).mark('lorem ipsum dolor sit amet et diam vero', {
      'diacritics': false,
      'accuracy' : 'exactly',
      'combineBy': 3,
      'each': (elem, info) => {
        if (info.count >= 9) {
          info.abort = true;
        }
      },
      'done': (total, totalMatches) => {
        expect(totalMatches).toBe(9);
        done();
      }
    });
  });

  it('should correctly count total matches so far with \'combineBy: Infinity\'', done => {
    new Mark($ctx[0]).mark('lorem ipsum dolor', {
      'diacritics': false,
      'combineBy' : Infinity,
      'filter': (node, term, totalMatchesSoFar, termMatches, info) => {
        if (totalMatchesSoFar >= 9) {
          info.abort = true;
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

  it('should correctly count matches so far when using \'info.count\' property', done => {
    new Mark($ctx[0]).mark('lorem ipsum dolor sit amet et diam vero', {
      'diacritics': false,
      'accuracy' : 'exactly',
      'combineBy': 3,
      'filter': (node, term, totalMatchesSoFar, termMatches, info) => {
        if (info.count >= 19) {
          info.abort = true;
          return  false;
        }
        return true;
      },
      'done': (total, totalMatches) => {
        expect(totalMatches).toBe(19);
        done();
      }
    });
  });

});
