'use strict';
describe('nested unmark', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('nested/main.html');

    $ctx = $('.nested');
    let instance = new Mark($ctx[0]);
    instance.mark('lorem', {
      'diacritics': false,
      'separateWordSearch': false,
      'className': 'mark',
      'done': () => {
        instance.unmark({
          'done': () => {
            done();
          }
        });
      }
    });
  });

  it('should remove all marked elements', () => {
    expect($ctx).not.toContainElement('mark.mark');
  });
  it('should restore the DOM to the original state', () => {
    let nodes1 = $ctx.find('> p')[0].childNodes,
      nodes2 = $ctx.find('> div > p')[0].childNodes,
      nodes3 = $ctx.find('.nested-mark')[0].childNodes;
    expect(nodes1.length).toBe(3);
    expect(nodes2.length).toBe(3);
    expect(nodes3.length).toBe(1);
  });
});
