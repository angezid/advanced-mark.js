'use strict';
describe('using Highlight API', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('across-elements/highlight/chaining.html');
    $ctx = $('.context');
  });

  afterEach(() => {
    if (CSS.highlights) CSS.highlights.clear();
  });

  it('should create expected number of Range objects when chaining', done => {
    let count = 0;
    const instance = new Mark($ctx[0]),
      // eslint-disable-next-line
      highlight = new Highlight();

    const options = {
      'diacritics': false,
      'acrossElements': true,
      'highlight': highlight,
      'done': (total) => {
        count += total;
      }
    };

    instance.mark('lorem', options).mark('ipsum', options).mark('dolor', options);

    expect(count).toBe(25);
    expect(count).toBe(highlight.size);
    done();
  });

});
