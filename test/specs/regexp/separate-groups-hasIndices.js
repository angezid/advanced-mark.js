
'use strict';

describe('markRegExp with \'separateGroups\' option', function() {
  let $ctx,
    matchCount, group1Count, group2Count, group3Count,
    message = 'should count and test content of separate groups ',
    flags = 'dgi',
    groupReg = new RegExp('\\b(group1)\\b[^]+?\\b(group2)\\b@?(?:\\s+(?:\\w+\\s+)?(\\w+3))?\\b', flags),
    nestedGr = new RegExp('\\b(group1\\b[^]+?\\b(group2)\\b@?)(?:\\s+(?:\\w+\\s+)?(\\w+3))?\\b', flags);

  beforeEach(() => {
    loadFixtures('regexp/separate-groups-hasIndices.html');

    $ctx = $('.separate-groups-hasIndices');
    matchCount = 0, group1Count = 0, group2Count = 0, group3Count = 0;
  });

  afterEach(() => {
    $ctx.unmark();
  });

  it(message, done => {
    new Mark($ctx[0]).markRegExp(groupReg, {
      'separateGroups' : true,
      each : eachMark,
      'done' : (total, matchCount) => {
        expect(matchCount).toBe(8);
        // mch, gr1, gr2, gr3,
        test([8, 8, 8, 4]);
        done();
      }
    });
  });

  it('should count filtered separate groups', done => {
    new Mark($ctx[0]).markRegExp(groupReg, {
      'separateGroups' : true,
      filter : (node, group, total, obj) => {
        if (obj.groupIndex === 1 || obj.groupIndex === 3) {
          return false;
        }
        return true;
      },
      each : eachMark,
      'done' : () => {
        // mch, gr1, gr2, gr3,
        test([8, 0, 8, 0]);
        done();
      }
    });
  });

  it(message + 'with nested group in filtered out one', done => {
    new Mark($ctx[0]).markRegExp(nestedGr, {
      'separateGroups' : true,
      filter : (node, group) => {
        if (/^group1/i.test(group)) {
          return false;
        }
        return true;
      },
      each : eachMark,
      'done' : () => {
        // mch, gr1, gr2, gr3,
        test([8, 0, 8, 4]);
        done();
      }
    });
  });

  it(message + 'with nested group', done => {
    new Mark($ctx[0]).markRegExp(nestedGr, {
      'separateGroups' : true,
      each : eachMark,
      'done' : () => {
        // mch, gr1, gr2, gr3,
        test([8, 8, 0, 4]);
        done();
      }
    });
  });

  function eachMark(elem, info) {
    if (info.matchStart) {
      matchCount++;
    }
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

  function test(array) {
    let count, marks = $ctx.find('mark');

    expect(matchCount).toBe(array[0]);

    count = testMarkedText(marks, 'group1-1', /group1(?:\s*text\s*)?/i);
    expect(count).toBe(group1Count);
    expect(group1Count).toBe(array[1]);

    count = testMarkedText(marks, 'group2-1', /group2/i);
    expect(count).toBe(group2Count);
    expect(group2Count).toBe(array[2]);

    count = testMarkedText(marks, 'group3-1', /group3/i);
    expect(count).toBe(group3Count);
    expect(group3Count).toBe(array[3]);
  }

  function testMarkedText(marks, klass, reg) {
    let count = 0;
    marks.filter((i, elem) => {
      // filter all start elements
      return $(elem).hasClass(klass);

    }).each(function(i, elem) {
      expect(getMarkedText(elem, marks)).toMatch(reg);
      count++;
    });
    return count;
  }

  // it aggregate text across elements
  function getMarkedText(elem, marks) {
    let text = '', found = false;
    marks.each(function(i, el) {
      if ( !found) {
        // start element of a group
        if (el === elem) {
          found = true;
        }
      // start of next group mean end of the current group
      } else if (el.className && /\b[a-z]+\d-1\b/.test(el.className)) {
        return false;
      }
      if (found) {
        text += $(this).text();
      }
      return true;
    });
    return text;
  }
});
