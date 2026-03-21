'use strict';
describe('delete ranges from Highlight object', () => {
  let $ctx, $ctx2;
  beforeEach(() => {
    loadFixtures('basic/unmark.html');

    $ctx = $('p#normal');
    $ctx2 = $('p#marked');
  });

  afterEach(() => {
    if (CSS.highlights) CSS.highlights.clear();
  });

  it('should delete all Range objects from Highlight object', done => {
    let instance = new Mark($ctx[0]),
      // eslint-disable-next-line
      highlight = new Highlight();

    instance.mark('lorem ipsum dolor', {
      'highlight': highlight,
      'diacritics': false,
      'done': () => {
        expect(highlight.size).toBe(16);

        instance.unmark({
          'highlight': highlight,
          'done': () => {
            expect(highlight.size).toBe(0);
            done();
          }
        });
      }
    });
  });

  it('should not remove any mark elements when using Highlight API', done => {
    new Mark($ctx2[0]).unmark({
      // eslint-disable-next-line
      'highlight': new Highlight(),
      'done': () => {
        expect($ctx2.find('mark').length).toBe(11);
        done();
      }
    });
  });
});
