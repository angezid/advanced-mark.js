'use strict';
describe('using CSS Custom Highlight API', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('across-elements/highlight/main.html');
    $ctx = $('.context');
  });

  afterEach(() => {
    if (CSS.highlights) CSS.highlights.clear();
  });

  it('should create expected number of Range objects with \'rangeAcrossElements\': false', done => {
    let instance = new Mark($ctx[0]),
      // eslint-disable-next-line
      highlight = new Highlight();

    instance.mark('lorem ipsum dolor', {
      'separateWordSearch' : false,
      'diacritics': false,
      'acrossElements': true,
      'highlight': highlight,
      'rangeAcrossElements': false,
      'done': (total) => {
        expect(total).toBe(14);
        expect(total).toBe(highlight.size);

        done();
      }
    });
  });

  it('should create expected number of single ranges for matches across elements', done => {
    let instance = new Mark($ctx[0]),
      // eslint-disable-next-line
      highlight = new Highlight();

    instance.mark('lorem ipsum dolor', {
      'separateWordSearch' : false,
      'diacritics': false,
      'acrossElements': true,
      'highlight': highlight,
      'done': (total, totalMatches) => {
        expect(total).toBe(6);
        expect(totalMatches).toBe(6);
        expect(totalMatches).toBe(highlight.size);

        done();
      }
    });
  });

});
