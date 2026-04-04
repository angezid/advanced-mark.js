'use strict';
describe('basic mark with each callback', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('basic/main.html');

    $ctx = $('.basic');
  });

  it('should call the \'each\' callback for each marked element', done => {
    let eachCalled = 0;

    new Mark($ctx[0]).mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'each': () => {
        eachCalled++;
      },
      'done': () => {
        expect(eachCalled).toBe(4);
        done();
      }
    });
  });

  it('should be able to break an execution on the \'each\' callback', done => {
    new Mark($ctx[0]).mark('lorem', {
      'diacritics': false,
      'separateWordSearch': false,
      'each': (elem, info) => {
        if (info.count >= 2) {
          info.execution.abort = true;
        }
      },
      'done': (total) => {
        expect(total).toBe(2);
        done();
      }
    });
  });

});
