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
    let count; 
    const instance = new Mark($ctx[0]),
      // eslint-disable-next-line
      highlight = new Highlight();

    instance.mark('lorem', {
      'diacritics': false,
      'acrossElements': true,
      'highlight': highlight,
      'done': (total) => {
        count = total;

        instance.mark('ipsum', {
          'diacritics': false,
          'acrossElements': true,
          'highlight': highlight,
          'done': () => {
            count += total;

            instance.mark('dolor', {
              'diacritics': false,
              'acrossElements': true,
              'highlight': highlight,
              'done': (total) => {
                count += total;
                
                expect(count).toBe(25);
                expect(count).toBe(highlight.size);

                done();
              }
            });
          }
        });
      }
    });
  });

});
