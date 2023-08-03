'use strict';
describe('mark lines ranges with markLines option', function() {
  var $ctx;
  beforeEach(function() {
    loadFixtures('ranges/mark-lines.html');
  });

  it('should mark lines in \'p\' element', function(done) {
    $ctx = $('.mark-lines p');
    var lines = [
      { start: 1, length: 1, content : 'one' },
      { start: 2, length: 2, content : 'two\nthree' },
      { start: 6, length: 1, content : 'six' },
      { start: 7, length: 1, content : 'seven ' },
    ];
    new Mark($ctx[0]).markRanges(lines, {
      'markLines' : true,
      'each': function(node, range) {
        $(node).attr('data-content', range.content);
      },
      'done': function() {
        testResult(lines, 4, 0);

        done();
      }
    });
  });

  it('should mark lines in \'pre\' element', function(done) {
    $ctx = $('.mark-lines-pre pre');
    var lines = [
      { start: 0, length: 1, content : 'non-valid' },    // non-valid
      { start: 1, length: 1, content : 'one' },
      { start: 2, length: 2, content : 'two\nthree' },
      { start: 6, length: 1, content : 'six' },
      { start: 10, length: 3, content : 'ten\n' },
      { start: 12, length: 1, content : 'non-valid' },    // non-valid
    ];
    new Mark($ctx[0]).markRanges(lines, {
      'markLines' : true,
      'each': function(node, range) {
        $(node).attr('data-content', range.content);
      },
      'done': function() {
        testResult(lines, 4, 1);

        done();
      }
    });
  });

  it('should mark nesting/overlaping lines in \'pre\' element', function(done) {
    $ctx = $('.mark-lines-pre pre');
    var lines = [
      { start: 3, length: 1 },
      { start: 2, length: 3 },
      { start: 6, length: 2 },
      { start: 7, length: 3 },
    ];
    new Mark($ctx[0]).markRanges(lines, {
      'markLines' : true,
      'wrapAllRanges' : true,
      'each': function(node, range) {
        $(node).attr('data-content', range.content);
      },
      'done': function() {
        var marks = $ctx.find('mark');
        expect(marks).toHaveLength(6);

        done();
      }
    });
  });

  function testResult(lines, num, offset) {
    var marks = $ctx.find('mark');
    expect(marks).toHaveLength(num);

    marks.each((i, item) => {
      expect($(item).attr('data-content')).toBe(lines[i+offset].content);
    });
  }

});
