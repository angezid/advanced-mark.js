'use strict';
describe('Test the random generated ranges', () => {
  let $ctx, ranges, max, text = 'should wrap ';

  beforeEach(() => {
    loadFixtures('ranges/main.html');
    $ctx = $('.ranges');
    max = $ctx.text().length;

    ranges = generateRanges();
  });
  
  it(text + 'only valid ranges', done => {
    let valid = true, lastIndex = 0, end;

    new Mark($ctx[0]).markRanges(ranges, {
      'each' : (elem, range, info) => {
        if (info.matchStart) {
          end = range.start + range.length;
          
          if (range.start < lastIndex || end > max) {
            valid = false;
          }
          lastIndex = end;
        }
      },
      'done' : (totalMarks, totalMatches) => {
        expect(totalMatches).toBeGreaterThan(0);
        expect(valid).toBe(true);
        done();
      }
    });
  });

  it(text + 'nesting/overlapping ranges with wrapAllRanges option', done => {
    let valid = true, count = 0, lastIndex = 0, end = 0, nested = false, overlapped = false;
    
    new Mark($ctx[0]).markRanges(ranges, {
      'wrapAllRanges' : true,
      'each' : (elem, range, info) => {
        if (info.matchStart) {
          count++;
          end = range.start + range.length;
          
          if (range.start < 0 || end > max) {
            valid = false;
          }
          
          if (range.start < lastIndex) {
            if (end <= lastIndex) {
              nested = true;
              
            } else {
              overlapped = true;
            }
          }
        
          if (lastIndex < end) {
            lastIndex = end;
          }
        }
      },
      'done' : (totalMarks, totalMatches) => {
        expect(totalMatches).toBeGreaterThan(0);
        expect(totalMatches).toBe(count);
        expect(nested).toBe(true);
        expect(overlapped).toBe(true);
        expect(valid).toBe(true);
        done();
      }
    });
  });

  function generateRanges() {
    let start, length, ranges = [];

    for (let i = 0; i < 200; i++) {
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
    ranges.push({ start: 0, length: 'undefined' });
    ranges.push({ start: null, length: null });
    ranges.push({ length: 15 });
    ranges.push({ start: 15 });
    ranges.push('ab');
    ranges.push(/ab/i);
    ranges.push(['ab']);

    return  ranges;
  }
});
