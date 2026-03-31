'use strict';
describe('delete ranges from Highlight object', () => {
  let $ctx, $ctx2;
  beforeEach(() => {
    loadFixtures('highlight/unmark.html');

    $ctx = $('p#normal');
    $ctx2 = $('p#marked');
  });

  afterEach(() => {
    if (CSS.highlights) CSS.highlights.clear();
  });

  it('should create and delete expected number of Range objects in different Highlight objects', done => {
    const instance = new Mark($ctx[0]),
      registry = CSS.highlights;

    instance.mark('lorem', getOptions()); // Highlight with the default name
    expect(registry.get('advanced-markjs').size).toBe(4);

    instance.mark('ipsum', getOptions('highlight-2'));
    expect(registry.get('highlight-2').size).toBe(4);

    instance.mark('dolor', getOptions('highlight-3'));
    expect(registry.get('highlight-3').size).toBe(8);

    instance.unmark({
      'highlightName': ['advanced-markjs', 'highlight-2'],
    });

    expect(registry.get('advanced-markjs')).toBeUndefined();
    expect(registry.get('highlight-2')).toBeUndefined();
    expect(registry.get('highlight-3').size).toBe(8);

    done();
  });

  function getOptions(name) {
    const options = {
      'diacritics': false,
      'highlightName': name,
      // eslint-disable-next-line
      'highlight': new Highlight(),
    };
    return options;
  }

  it('should not delete anything from Highlight object with the default name when specify other name', done => {
    const instance = new Mark($ctx[0]),
      // eslint-disable-next-line
      highlight = new Highlight();

    instance.mark('lorem ipsum dolor', {
      'diacritics': false,
      'highlight': highlight,
      'done': () => {
        expect(highlight.size).toBe(16);

        instance.unmark({
          'highlightName': 'dummy', // the default name is 'advanced-markjs'
          'done': () => {
            expect(highlight.size).toBe(16);
            done();
          }
        });
      }
    });
  });

  it('should delete all StaticRange objects from Highlight object using its default name', done => {
    const instance = new Mark($ctx[0]),
      // eslint-disable-next-line
      highlight = new Highlight();

    instance.mark('lorem ipsum dolor', {
      'diacritics': false,
      'highlight': highlight,
      'done': () => {
        expect(highlight.size).toBe(16);

        instance.unmark({
          'done': () => {
            expect(highlight.size).toBe(0);
            done();
          }
        });
      }
    });
  });

  it('should not remove all mark elements when using \'highlight\' option', done => {
    // eslint-disable-next-line
    const highlight = new Highlight();

    new Mark($ctx2[0]).unmark({
      'highlight': highlight,
      'done': () => {
        expect($ctx2.find('mark').length).toBe(11);
        done();
      }
    });
  });

  it('should remove all mark elements when using \'highlightName\' option', done => {
    new Mark($ctx2[0]).unmark({
      'highlightName': 'dummy',
      'done': () => {
        expect($ctx2.find('mark').length).toBe(0);
        done();
      }
    });
  });
});
