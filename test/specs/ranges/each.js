'use strict';
describe('mark with range each callback', () => {
  let $ctx, $elements, ranges;
  beforeEach(done => {
    loadFixtures('ranges/each.html');

    $elements = $();
    $ctx = $('.ranges-each');
    ranges = [];
    new Mark($ctx[0]).markRanges([
      { start: 20, length: 5 },
      { start: 64, length: 5 }
    ], {
      'each': (node, range) => {
        $elements = $elements.add($(node));
        ranges.push(range);
      },
      'done': () => {
        done();
      }
    });
  });

  it('should call the each callback and pass the correct parameters', () => {
    let textOpts = ['ipsum', 'elitr'];
    
    expect($elements).toHaveLength(2);
    
    $elements.each((i, elem) => {
      expect($.inArray($(elem).text(), textOpts)).toBeGreaterThan(-1);
    });
    expect(ranges).toEqual([
      { start: 20, length: 5 },
      { start: 64, length: 5 }
    ]);
  });
});
