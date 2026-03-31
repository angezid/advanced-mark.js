
'use strict';

describe('markRegExp with separateGroups and acrossElements options and using Highlight API', function() {
  let $ctx,
    matchCount, group1Count, group2Count, group3Count,
    message = 'should count and test content of separate groups ',
    flags = 'dgi',
    groupReg = new RegExp('\\b(group1)\\b[^]+?\\b(group2)\\b@?(?:\\s+(?:\\w+\\s+)?(\\w+3))?\\b', flags),
    nestedGr = new RegExp('\\b(group1\\b[^]+?\\b(group2)\\b@?)(?:\\s+(?:\\w+\\s+)?(\\w+3))?\\b', flags);

  beforeEach(() => {
    loadFixtures('across-elements/highlight/separate-groups.html');

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
      'acrossElements': true,
      each : eachMark,
      'done' : (total, matchCount) => {
        expect(matchCount).toBe(12);
        // mch, gr1, gr2, gr3,
        test(highlight, [12, 12, 12, 5]);
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
      'acrossElements': true,
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
        test(highlight, [12, 0, 12, 0]);
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
      'acrossElements': true,
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
        test(highlight, [12, 0, 12, 5]);
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
      'acrossElements': true,
      each : eachMark,
      'done' : () => {
        // mch, gr1, gr2, gr3,
        test(highlight, [12, 12, 0, 5]);
        done();
      }
    });
  });

  function eachMark(range, info) {
    if (info.matchStart) {
      matchCount++;
    }
    if (info.groupStart) {
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
        const node = range.startContainer;

        // match on single text node
        if (node === range.endContainer) {
          if (node.nodeType === 3 && reg.test(node.textContent.slice(range.startOffset, range.endOffset))) {
            count++;
          }

        } else {
          if (reg.test(getText(node, range))) {
            count++;
          }
        }
      }
    });
    return count;
  }

  function getText(node, range) {
    const iterator = document.createNodeIterator($ctx[0], NodeFilter.SHOW_TEXT, () => NodeFilter.FILTER_ACCEPT);
    const node2 = range.endContainer;
    let text = '',
      found,
      nd;

    while ((nd = iterator.nextNode())) {
      if ( !found) {
        if (nd === node) {
          text += nd.textContent.slice(range.startOffset);
          found = true;
        }

      } else {
        if (nd === node2) {
          text += nd.textContent.slice(0, range.endOffset);
          break;

        } else {
          text += nd.textContent;
        }
      }
    }
    return text;
  }
});
