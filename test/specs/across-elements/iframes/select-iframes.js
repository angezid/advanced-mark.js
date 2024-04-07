'use strict';
describe('mark with selected iframes across-elements', () => {

  beforeEach(() => {
    loadFixtures('across-elements/iframes/select-iframes.html');
  }, 30000);

  it('should wrap matches only inside iframes', done => {
    const array = [];
    new Mark('iframe').mark('lorem', {
      'diacritics': false,
      'separateWordSearch': false,
      'iframes': true,
      'acrossElements' : true,
      'each' : elem => {
        array.push(elem);
      },
      'done': () => {
        expect(array.length).toBe(8);
        expect($('mark').length).toBe(0);
        done();
      }
    });
  }, 30000);

  it('should wrap matches inside iframes and "p" elements', done => {
    const array = [];
    new Mark('p, iframe').mark('lorem', {
      'diacritics': false,
      'separateWordSearch': false,
      'iframes': true,
      'acrossElements' : true,
      'each' : elem => {
        array.push(elem);
      },
      'done': () => {
        expect(array.length).toBe(14); // 8 inside iframes plus 6 in both 'p'
        expect($('h1 mark').length).toBe(0);
        done();
      }
    });
  }, 30000);
});
