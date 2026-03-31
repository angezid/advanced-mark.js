'use strict';
describe('using CSS Custom Highlight API', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('across-elements/highlight/main.html');
    $ctx = $('.context');
  });

  afterEach(() => {
    if (CSS.highlights) CSS.highlights.clear();
  });

  it('should create expected number of Range objects with \'rangeAcrossElements: false\'', done => {
    let instance = new Mark($ctx[0]),
      // eslint-disable-next-line
      highlight = new Highlight(),
      str = 'lorem ipsum dolor';

    instance.mark(str, {
      'separateWordSearch' : false,
      'diacritics': false,
      'acrossElements': true,
      'highlight': highlight,
      'rangeAcrossElements': false,
      'each': (range, info) => {
        if (info.matchStart) {
          range.className = 'range-1';
        }
      },
      'done': (total, totalMatches) => {
        expect(total).toBe(14);
        expect(total).toBe(highlight.size);
        expect(countHighlights2(highlight, str.replace(/\s+/g, ''))).toBe(totalMatches);

        done();
      }
    });
  });

  function countHighlights2(highlight, str) {
    let count = 0;

    highlight.forEach((range) => {
      if (range.className) {
        if (isEquals(getHighlightedText(highlight, range), str)) {
          count++;
        }
      }
    });
    return count;
  }

  // aggregates highlighted text across elements
  function getHighlightedText(highlight, range) {
    let text = '',
      found;

    for (let rng of highlight.values()) {
      if ( !found) {
        // the start range of a match
        if (rng === range) {
          found = true;
        }
      // start of next match mean end of the current match
      } else if (rng.className) {
        break;
      }
      if (found) {
        text += rng.startContainer.textContent;
      }
    }
    return text;
  }

  it('should create expected number of single ranges for matches across elements', done => {
    let instance = new Mark($ctx[0]),
      // eslint-disable-next-line
      highlight = new Highlight(),
      str = 'lorem ipsum dolor';

    instance.mark(str, {
      'separateWordSearch' : false,
      'diacritics': false,
      'acrossElements': true,
      'highlight': highlight,
      'done': (total, totalMatches) => {
        expect(total).toBe(6);
        expect(totalMatches).toBe(highlight.size);
        expect(countHighlights(highlight, str.replace(/\s+/g, ''))).toBe(totalMatches);

        done();
      }
    });
  });

  function countHighlights(highlight, str) {
    let count = 0;

    highlight.forEach((range) => {
      const node = range.startContainer;

      // match on single text node
      if (node === range.endContainer) {
        if (node.nodeType === 3) {
          if (isEquals(node.textContent.slice(range.startOffset, range.endOffset), str)) {
            count++;
          }
        }

      } else if (isEquals(getText(node, range), str)) {
        count++;
      }
    });
    return count;
  }

  function isEquals(text, str) {
    return text.toLowerCase().replace(/\s+/g, '') === str;
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
