'use strict';
describe('sorting a custom array of elements', () => {
  let array = [],
    ranges = [
      { start: 0, length: 2 },
      { start: 20, length: 2 },
      { start: 40, length: 2 },
      { start: 60, length: 2 },
      { start: 80, length: 2 },
      { start: 100, length: 2 }
    ],
    matches = ['p1', 'p2', 'p3', 'p1', 'p3', 'p2'];

  beforeEach(() => {
    loadFixtures('ranges/array-of-elements.html');
    // collects elements not following the document order
    getElements('.p3');
    getElements('.p2');
    getElements('.p1');
  });

  it('mark an array of ranges following the document order', done => {
    new Mark(array).markRanges(ranges, {
      'filter' : (node, range, match, index) => {
        expect(matches[index]).toBe(match);
        return true;
      },
      'done' : (marks, matches) => {
        expect(matches).toBe(6);
        done();
      }
    });
  });
  
  function getElements(selector) {
    document.querySelectorAll(selector).forEach(item => {
      array.push(item);
    });
  }
});
