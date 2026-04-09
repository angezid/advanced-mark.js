'use strict';
describe('mark with acrossElements and filter callback', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('across-elements/basic/filter.html');

    $ctx = $('.across-elements-filter');
  });

  it('should call the callback with the right parameters', done => {
    let counter = {
      'lorem': 0,
      'ipsum': 0,
      'dolor': 0
    };
    try {
      new Mark($ctx[0]).mark(Object.keys(counter), {
        'diacritics': false,
        'separateWordSearch': false,
        'acrossElements': true,
        'filter': (node, term, totalMatches, matches, info) => {
          expect(node.nodeType).toBe(3);

          expect($.inArray(term, Object.keys(counter))).toBeGreaterThan(-1);

          expect(counter[term]).toBe(matches);

          if (info.matchStart) {
            counter[term]++;
          }
          return true;
        },
        'done': () => {
          expect($ctx.find('mark').length).toBe(30);
          done();
        }
      });
    } catch (e) {
      done.fail(e.message);
    }
  });

  it('should correctly count total matches so far with \'combineBy: Infinity\'', done => {
    new Mark($ctx[0]).mark('lorem ipsum dolor', {
      'diacritics': false,
      'acrossElements': true,
      'combineBy' : Infinity,
      'filter': (node, term, totalMatchesSoFar, termMatches, info) => {
        if (totalMatchesSoFar >= 9) {
          info.execution.abort = true;
          return  false;
        }
        return true;
      },
      'done': (m, totalMatches) => {
        expect(totalMatches).toBe(9);

        done();
      }
    });
  });
  
  it('should correctly count matches so far when using \'info.count\' property', done => {
    new Mark($ctx[0]).mark('lorem ipsum dolor sit amet et diam vero', {
      'diacritics': false,
      'accuracy': 'exactly',
      'acrossElements': true,
      'combineBy': 3,
      'filter': (node, term, totalMatchesSoFar, termMatches, info) => {
        if (info.count >= 19) {
          info.execution.abort = true;
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
