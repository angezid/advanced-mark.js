'use strict';
describe('basic unmark', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('basic/main.html');

    $ctx = $('.basic');
  });

  it('should remove all marked elements and restore the DOM to the original state', done => {
    let instance = new Mark($ctx[0]);
    instance.mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'done': () => {
        expect($('mark').length).toBe(4);

        instance.unmark({
          'done': () => {
            // all text nodes (including empty nodes from mark-tag removal)
            // should be converted into a single node
            let nodes = $ctx.find('> p')[0].childNodes;
            expect(nodes.length).toBe(1);
            done();
          }
        });
      }
    });
  });

  it('should return an object with further methods', done => {
    let ret = new Mark($ctx[0]).unmark();
    expect(ret instanceof Mark).toBe(true);
    expect(typeof ret.mark).toBe('function');
    expect(typeof ret.unmark).toBe('function');
    expect(typeof ret.markRegExp).toBe('function');
    done();
  });
});
