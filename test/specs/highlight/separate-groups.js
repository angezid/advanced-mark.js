
'use strict';

describe('markRegExp with separateGroups option and using Highlight API', function() {
  let $ctx,
    matchCount, group1Count, group2Count, group3Count,
    message = 'should count and test content of separate groups ',
    flags = 'dgi',
    groupReg = new RegExp('\\b(group1)\\b[^]+?\\b(group2)\\b@?(?:\\s+(?:\\w+\\s+)?(\\w+3))?\\b', flags),
    nestedGr = new RegExp('\\b(group1\\b[^]+?\\b(group2)\\b@?)(?:\\s+(?:\\w+\\s+)?(\\w+3))?\\b', flags);

  beforeEach(() => {
    loadFixtures('highlight/separate-groups.html');

    $ctx = $('.separate-groups-hasIndices');
    matchCount = 0, group1Count = 0, group2Count = 0, group3Count = 0;
  });

  afterEach(() => {
    if (CSS.highlights) CSS.highlights.clear();
  });

  it(message, done => {
    // eslint-disable-next-line
    const highlight = new Highlight();

    new Mark($ctx[0]).markRegExp(groupReg, {
      'highlight': highlight,
      'separateGroups' : true,
      each : eachMark,
      'done' : (total, matchCount) => {
        expect(matchCount).toBe(8);
        // mch, gr1, gr2, gr3,
        test(highlight, [8, 8, 8, 4]);
        done();
      }
    });
  });

  it('should count filtered separate groups', done => {
    // eslint-disable-next-line
    const highlight = new Highlight();

    new Mark($ctx[0]).markRegExp(groupReg, {
      'highlight': highlight,
      'separateGroups' : true,
      filter : (node, group, total, obj) => {
        // current group index. Note: if group lays across several elements
        // the index will be the same while the current group is wrapping
        if (obj.groupIndex === 1 || obj.groupIndex === 3) {
          return false;
        }
        return true;
      },
      each : eachMark,
      'done' : () => {
        // mch, gr1, gr2, gr3,
        test(highlight, [8, 0, 8, 0]);
        done();
      }
    });
  });

  it(message + 'with nested group in filtered out one', done => {
    // eslint-disable-next-line
    const highlight = new Highlight();

    new Mark($ctx[0]).markRegExp(nestedGr, {
      'highlight': highlight,
      'separateGroups' : true,
      filter : (node, group) => {
        // current group matching string. Note: if group lays across several
        // elements the matching string will be the same while the current
        // group is wrapping
        if (/^group1/i.test(group)) {
          return false;
        }
        return true;
      },
      each : eachMark,
      'done' : () => {
        // mch, gr1, gr2, gr3,
        test(highlight, [8, 0, 8, 4]);
        done();
      }
    });
  });

  it(message + 'with nested group', done => {
    // eslint-disable-next-line
    const highlight = new Highlight();

    new Mark($ctx[0]).markRegExp(nestedGr, {
      'highlight': highlight,
      'separateGroups' : true,
      each : eachMark,
      'done' : () => {
        // mch, gr1, gr2, gr3,
        test(highlight, [8, 8, 0, 4]);
        done();
      }
    });
  });

  function eachMark(range, info) {
    if (info.matchStart) {
      matchCount++;
    }
    if (info.groupIndex === 1) {
      range.className = 'group1-1';
      group1Count++;

    } else if (info.groupIndex === 2) {
      range.className = 'group2-1';
      group2Count++;

    } else if (info.groupIndex === 3) {
      range.className = 'group3-1';
      group3Count++;
    }
  }

  function test(highlight, array) {
    let count;

    expect(matchCount).toBe(array[0]);

    count = countHighlights(highlight, 'group1-1', /group1(?:\s*text\s*)?/i);
    expect(count).toBe(group1Count);
    expect(group1Count).toBe(array[1]);

    count = countHighlights(highlight, 'group2-1', /group2/i);
    expect(count).toBe(group2Count);
    expect(group2Count).toBe(array[2]);

    count = countHighlights(highlight, 'group3-1', /group3/i);
    expect(count).toBe(group3Count);
    expect(group3Count).toBe(array[3]);
  }

  function countHighlights(highlight, klass, reg) {
    let count = 0;

    highlight.forEach((range) => {
      if (range.className === klass) {
        // match on single text node
        let node = range.startContainer;

        if (node.nodeType === 3) {
          const text = node.textContent.slice(range.startOffset, range.endOffset);

          if (reg.test(text)) {
            count++;
          }
        }
      }
    });
    return count;
  }
});
