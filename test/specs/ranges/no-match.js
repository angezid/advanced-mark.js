'use strict';
describe('mark with range no matches', function() {
  var $ctx1, $ctx2, $ctx3, errCall, notFound;

  beforeEach(function() {
    loadFixtures('ranges/no-match.html');

    errCall = 0;
    notFound = [];
  });

  it('should report each range non-match', function(done) {
    $ctx1 = $('.ranges-no-match > div:nth-child(1)');
    $ctx2 = $('.ranges-no-match > div:nth-child(2)');

    new Mark($ctx1[0]).markRanges([
      { start: -20, length: -12 },
      // { start: 0, length: 3 } "should" only contain whitespace, so it
      // will be skipped
      { start: 0, length: 3 },
      // found
      { start: 30, length: 5},
      // skipped
      { start: 1500, length: 500 }
    ], {
      'noMatch': function(item) {
        notFound = notFound.concat(item);
      },
      'done': function() {
        new Mark($ctx2[0]).markRanges([
          { start: -8, length: 5 },
          { start: -1, length: 20 },
          'pie'
        ], {
          'noMatch': function(item) {
            notFound = notFound.concat(item);
            errCall++;
          },
          'done': function() {
            expect($ctx1.find('mark')).toHaveLength(1);
            expect($ctx2.find('mark')).toHaveLength(0);

            var ranges = notFound.sort(function(a, b) {
              return a.start - b.start;
            });
            expect(JSON.stringify(ranges)).toEqual(JSON.stringify([
              { start: -20, length: -12 },
              { start: 0, length: 3 },
              { start: 1500, length: 500 },
              { start: -8, length: 5 },
              { start: -1, length: 20 },
              'pie'
            ].sort(function(a, b) {
              return a.start - b.start;
            })));

            expect(errCall).toBe(3);

            done();
          }
        });
      }
    });
  });

  it('should allow out of range max', function(done) {
    $ctx3 = $('.ranges-no-match > div:nth-child(3)');

    new Mark($ctx3[0]).markRanges([
      { start: 99, length: 9999 }
    ], {
      'each': function(node, range) {
        $(node).attr({
          'data-range-start': range.start,
          'data-range-length': range.length
        });
      },
      'done': function() {
        var $mark3 = $ctx3.find('mark');
        // using 2 because the closing </p> gets wrapped creating a second mark
        expect($mark3).toHaveLength(2);
        expect($mark3.attr('data-range-start')).toBe('99');
        // end range does not get adjusted
        expect($mark3.attr('data-range-length')).toBe('9999');

        done();
      }
    });
  });
});
