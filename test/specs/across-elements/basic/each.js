'use strict';
describe('mark with acrossElements and each callback', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('across-elements/basic/main.html');

    $ctx = $('.across-elements');
  });

  it('should call the \'each\' callback for each marked element', done => {
    let eachCalled = 0;

    new Mark($ctx[0]).mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'acrossElements': true,
      'each': () => {
        eachCalled++;
      },
      'done': () => {
        expect(eachCalled).toBe(6);
        done();
      }
    });
  });

  it('should be able to break an execution on the \'each\' callback', done => {
    new Mark($ctx[0]).mark('lorem', {
      'diacritics': false,
      'acrossElements': true,
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
