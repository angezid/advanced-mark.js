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
          expect($ctx.find('mark').length).toBe(14);
          done();
        }
      });
    } catch (e) {
      done.fail(e.message);
    }
  });
});
