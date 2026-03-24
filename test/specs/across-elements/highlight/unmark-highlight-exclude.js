'use strict';
describe('delete ranges from Highlight object except', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('across-elements/highlight/unmark.html');

    $ctx = $('.unmark');
  });

  afterEach(() => {
    if (CSS.highlights) CSS.highlights.clear();
  });

  it('should delete Range objects with \'exclude\' option', done => {
    let instance = new Mark($ctx[0]),
      // eslint-disable-next-line
      highlight = new Highlight();

    instance.mark('lorem ipsum dolor', {
      'highlight': highlight,
      'separateWordSearch': true,
      'diacritics': false,
      'done': () => {
        expect(highlight.size).toBe(16);

        instance.unmark({
          'exclude': 'span, span *',
          'highlight': highlight,
          'done': () => {
            expect(highlight.size).toBe(9);
            done();
          }
        });
      }
    });
  });
});
