'use strict';
describe('Test the random generated ranges', function() {
  var $ctx, ranges, text = 'should wrap ';

  beforeEach(function() {
    loadFixtures('ranges/main.html');
    $ctx = $('.ranges');

    ranges = generateRanges();
  });

  it(text + 'nesting/overlapping ranges with wrapAllRanges option', function(done) {
    var count = 0, lastIndex = 0, success = false;

    new Mark($ctx[0]).markRanges(ranges, {
      'wrapAllRanges' : true,
      'each' : (elem, range, onfo) => {
        if (onfo.matchStart) {
          count++;
        }
        if (range.start > lastIndex) {
          success = true;
        }
        if (lastIndex < range.start + range.length) {
          lastIndex = range.start + range.length;
        }
      },
      'done' : function(totalMarks, totalMatches) {
        expect(totalMatches).toBeGreaterThan(0);
        expect(totalMatches).toBe(count);
        expect(success).toBe(true);
        done();
      }
    });
  });

  function generateRanges() {
    var start, length, ranges = [];

    for (var i = 0; i < 200; i++) {
      if (i > 32 && (i % 10) === 0) {
        start = String.fromCharCode(232 - i);
        length = String.fromCharCode(i);

      } else {
        // start varied from -100 to 2000 (grater than size of the context)
        start = Math.floor((Math.random() * 2000) - 100);
        length = Math.floor((Math.random() * 15) - 1);
      }
      ranges.push({ start: start, length: length });
    }
    ranges.push({ start: null, length: null });
    ranges.push({ length: 15 });
    ranges.push({ start: 15 });

    return  ranges;
  }
});
