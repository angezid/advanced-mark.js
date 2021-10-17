
'use strict';
describe(
  'markRegExp with acrossElements and separateGroups and RegExp.hasIndices',
  function() {
    var $ctx,
      matchCount, group1Count, group2Count, group3Count,
      message = 'should count and test content of separate groups ',
      groupReg = /\b(group1)\b.+?\b(group2)\b@?(?:\s+(?:\w+\s+)?(\w+3))?\b/dgi,
      nestedGr = /\b(group1\b.+?\b(group2)\b@?)(?:\s+(?:\w+\s+)?(\w+3))?\b/dgi;

    beforeEach(function() {
      $ctx = $('.across-elements-separate-groups');
      matchCount = 0, group1Count = 0, group2Count = 0, group3Count = 0;
    });

    afterEach(function() {
      $ctx.unmark();
    });

    it(message, function(done) {
      new Mark($ctx[0]).markRegExp(groupReg, {
        'acrossElements' : true,
        'separateGroups' : true,
        each : eachMark,
        'done' : function() {
          // mch, gr1, gr2, gr3,
          test([27, 27, 27, 16]);
          done();
        }
      });
    });

    it('should count separate groups in loop of 3 goes', function(done) {

      for (var i = 1; i < 4; i++)  {
        matchCount = 0, group1Count = 0, group2Count = 0, group3Count = 0;

        new Mark($ctx[0]).markRegExp(groupReg, {
          'acrossElements' : true,
          'separateGroups' : true,
          each : eachMark,
          'done' : function() {
            expect(matchCount).toBe(27);
            expect(group1Count).toBe(27);
            expect(group2Count).toBe(27);
            expect(group3Count).toBe(16);
            done();
          }
        });
      }
    });

    it(message + 'with filtered out group', function(done) {
      new Mark($ctx[0]).markRegExp(groupReg, {
        'acrossElements' : true,
        'separateGroups' : true,
        filter : function(node, group) {
          if (group.toLowerCase() === 'group2') {
            return  false;
          }
          return  true;
        },
        each : eachMark,
        'done' : function() {
          // mch, gr1, gr2, gr3,
          test([27, 27, 0, 16]);
          done();
        }
      });
    });

    it(message + 'with nested group in filtered out one', function(done) {
      new Mark($ctx[0]).markRegExp(nestedGr, {
        'acrossElements' : true,
        'separateGroups' : true,
        filter : function(node, group) {
          if (/^group1/i.test(group)) {
            return  false;
          }
          return  true;
        },
        each : eachMark,
        'done' : function() {
          // mch, gr1, gr2, gr3,
          test([27, 0, 27, 16]);
          done();
        }
      });
    });

    it(message + 'with nested group', function(done) {
      new Mark($ctx[0]).markRegExp(nestedGr, {
        'acrossElements' : true,
        'separateGroups' : true,
        each : eachMark,
        'done' : function() {
          // mch, gr1, gr2, gr3,
          test([27, 27, 0, 16]);
          done();
        }
      });
    });

    it(message + 'with group nested in ignore group', function(done) {
      new Mark($ctx[0]).markRegExp(nestedGr, {
        'acrossElements' : true,
        'separateGroups' : true,
        'ignoreGroups' : 1,
        each : eachMark,
        'done' : function() {
          // mch, gr1, gr2, gr3,
          test([27, 0, 27, 16]);
          done();
        }
      });
    });

    it(message + 'with ignoreGroups : 1', function(done) {
      new Mark($ctx[0]).markRegExp(groupReg, {
        'acrossElements' : true,
        'separateGroups' : true,
        'ignoreGroups' : 1,
        each : eachMark,
        'done' : function() {
          // mch, gr1, gr2, gr3,
          test([27, 0, 27, 16]);
          done();
        }
      });
    });

    it(message + 'with ignoreGroups : 2', function(done) {
      new Mark($ctx[0]).markRegExp(groupReg, {
        'acrossElements' : true,
        'separateGroups' : true,
        'ignoreGroups' : 2,
        each : eachMark,
        'done' : function() {
          // mch, gr1, gr2, gr3,
          test([16, 0, 0, 16]);
          done();
        }
      });
    });

    function eachMark(elem, info) {
      if (info.matchNodeIndex === 0) {
        matchCount++;
      }
      if (info.groupNodeIndex === 0) {
        if (info.groupIndex === 1) {
          elem.className = 'group1-1';
          group1Count++;

        } else if (info.groupIndex === 2) {
          elem.className = 'group2-1';
          group2Count++;

        } else if (info.groupIndex === 3) {
          elem.className = 'group3-1';
          group3Count++;
        }
      }
    }

    function test(val) {
      var count, marks = $ctx.find('mark');

      expect(matchCount).toBe(val[0]);

      count = testMarkedText(marks, 'group1-1', /group1(?:\s*text\s*)?/i);
      expect(count).toBe(group1Count);
      expect(group1Count).toBe(val[1]);

      count = testMarkedText(marks, 'group2-1', /group2/i);
      expect(count).toBe(group2Count);
      expect(group2Count).toBe(val[2]);

      count = testMarkedText(marks, 'group3-1', /group3/i);
      expect(count).toBe(group3Count);
      expect(group3Count).toBe(val[3]);
    }

    function testMarkedText(marks, klass, reg) {
      var count = 0;
      marks.filter(function() {
        return  $(this).hasClass(klass);

      }).each(function() {
        expect(getMarkedText($(this), marks)).toMatch(reg);
        count++;
      });
      return  count;
    }

    // it aggregate match text across elements
    function getMarkedText(elem, marks) {
      var text = '', found = false;
      marks.each(function(i, el) {
        if ( !found) {
          if (el === elem[0]) {
            found = true;
          }

        } else if (el.className && /\b[a-z]+\d-1\b/.test(el.className)) {
          return  false;
        }
        if (found) {
          text += $(this).text();
        }
        return  true;
      });
      return  text;
    }
  }
);

