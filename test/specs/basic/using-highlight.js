'use strict';
describe('using CSS Custom Highlight API', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('basic/main.html');
    $ctx = $('.basic');
  });

  it('should create expected number of Range objects', done => {
    let instance = new Mark($ctx[0]),
      // eslint-disable-next-line
      highlight = new Highlight();

    instance.mark('lorem ipsum dolor', {
      'highlight': highlight,
      'diacritics': false,
      'done': (total) => {
        expect(total).toBe(16);
        expect(total).toBe(highlight.size);

        done();
      }
    });
  });

});
