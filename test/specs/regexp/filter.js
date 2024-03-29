'use strict';
describe('mark with regular expression and filter callback', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('regexp/filter.html');

    $ctx = $('.regexp-filter');
  });

  it('should call the callback with the right parameters', done => {
    let k = 0,
      textOpts = ['Lorem', 'ipsum'];
    new Mark($ctx[0]).markRegExp(/(Lore?m)|(ipsum)/gmi, {
      'filter': (node, term, totalMatches) => {
        expect(node.nodeType).toBe(3);
        expect($.inArray(term, textOpts)).toBeGreaterThan(-1);
        expect(k).toBe(totalMatches);
        if (term !== 'ipsum') {
          k++;
          return true;
        } else {
          return false;
        }
      },
      'done': () => {
        expect($ctx.find('mark').length).toBe(4);
        done();
      }
    });
  });
});
