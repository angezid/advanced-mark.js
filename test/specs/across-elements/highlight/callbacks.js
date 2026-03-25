'use strict';
describe('type of callback\'s first parameter across elements', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('highlight/main.html');

    $ctx = $('.basic');
  });

  afterEach(() => {
    if (CSS.highlights) CSS.highlights.clear();
  });

  it('filter callback first parameter should be Text[]', done => {
    let run = 0;
    const instance = new Mark($ctx[0]),
      // eslint-disable-next-line
      highlight = new Highlight();

    instance.mark('lorem ipsum dolor', {
      'diacritics': false,
      'highlight': highlight,
      'acrossElements': true,
      'filter': (nodeOrArray, t, m, tm, info) => {
        expect(nodeOrArray instanceof Array).toBe(true);
        expect(nodeOrArray[0] instanceof Text).toBe(true);
        info.execution.abort = true;
        run++;
        return true;
      },
      'done': () => {
        expect(run).toBe(1);
        done();
      }
    });
  });

  it('each callback first parameter should be StaticRange', done => {
    let run = -1;
    const instance = new Mark($ctx[0]),
      // eslint-disable-next-line
      highlight = new Highlight();

    instance.mark('lorem ipsum dolor', {
      'diacritics': false,
      'acrossElements': true,
      'highlight': highlight,
      'filter': (n, t, m, tm, info) => {
        if (++run === 1) info.execution.abort = true;
        return true;
      },
      'each': (elementOrRange) => {
        expect(elementOrRange instanceof StaticRange).toBe(true);
      },
      'done': () => {
        expect(run).toBe(1);
        done();
      }
    });
  });

  it('each callback first parameter should be Range', done => {
    let run = -1;
    const instance = new Mark($ctx[0]),
      // eslint-disable-next-line
      highlight = new Highlight();

    instance.mark('lorem ipsum dolor', {
      'diacritics': false,
      'acrossElements': true,
      'highlight': highlight,
      'staticRanges': false,
      'filter': (n, t, m, tm, info) => {
        if (++run === 1) info.execution.abort = true;
        return true;
      },
      'each': (elementOrRange) => {
        expect(elementOrRange instanceof Range).toBe(true);
      },
      'done': () => {
        expect(run).toBe(1);
        done();
      }
    });
  });

});
