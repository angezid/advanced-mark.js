'use strict';
describe('mark ranges with wrapAllRanges option', function() {
  var $ctx;
  beforeEach(function() {
    loadFixtures('ranges/nested-overlapped.html');

    $ctx = $('.nested-overlapped-ranges');
  });

  it('should wrap nesting & overlapping ranges', function(done) {
    var ranges = [
      { start: 20, length: 300 },
      { start: 20, length: 100 },
      { start: 90, length: 300 },
      { start: 90, length: 500 }
    ];
    
    new Mark($ctx[0]).markRanges(ranges, {
      'wrapAllRanges' : true,
      'done' : function(totalMark) {
        expect(totalMark).toBe(9);
        expect($ctx.find('mark').length).toBe(9);
        done();
      }
    });
  });
});
