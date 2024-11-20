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
      calls = 0;
    try {
      new Mark($ctx[0]).mark(Object.keys(counter), {
        'diacritics': false,
        'separateWordSearch': false,
        'filter': (node, term, totalMatches, matches) => {
          expect(node.nodeType).toBe(3);

          expect($.inArray(term, Object.keys(counter))).toBeGreaterThan(-1);

          expect(counter[term]).toBe(matches);

          if (++calls !== 3) {
            counter[term]++;
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
});
