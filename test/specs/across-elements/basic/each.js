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

  it('should correctly count matches so far on the \'each\' callback', done => {
    let count = 0;
    
    new Mark($ctx[0]).mark('lorem ipsum dolor sit amet et diam vero', {
      'diacritics': false,
      'accuracy' : 'exactly',
      'acrossElements': true,
      'combinePatterns': 3,
      'each': (elem, info) => {
        count = info.count;
      },
      'done': (total) => {
        expect(count).toBe(29);
        expect(total).toBe(29);
        done();
      }
    });
  });

});
