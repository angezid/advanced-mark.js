'use strict';
describe('markRegExp with acrossElements and count words&phrases', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('across-elements/regexp/count.html');

    $ctx = $('.across-elements-count');
  });

  // just for code coverage
  it('should recompile RegExp which is without g or y flags', done => {
    let reg = /\w+/im;
    new Mark($ctx[0]).markRegExp(reg, {
      'acrossElements' : true,
      'done' : () => {
        expect($ctx.find('mark').length).toBeGreaterThan(50);
        done();
      }
    });
  });

  it('should count and test content of whole words', done => {
    let wordCount = 0;

    new Mark($ctx[0]).markRegExp(/\b(?:Lorem|ipsum)\b/gi, {
      'acrossElements' : true,
      'each' : (elem, info) => {
        if (info.matchStart) {
          elem.className = 'start-1';
          wordCount++;
        }
      },
      'done' : () => {
        let count = testMarkedText($ctx, /^(?:lorem|ipsum)$/);
        expect(count).toBe(wordCount);
        expect(count).toBe(52);
        done();
      }
    });
  });

  it('should count and test content of filtered matches', done => {
    let matchCount = 0;

    new Mark($ctx[0]).markRegExp(/(\best\s+)?\bLorem\s+ipsum\b/gi, {
      'acrossElements' : true,
      filter : (node, group, total, obj) => {
        // skip unwanted matches
        if (obj.match[1]) {
          return  false;
        }
        return true;
      },
      'each' : (elem, info) => {
        // if start of the match
        if (info.matchStart) {
          // elem in this case is the first marked element of the match
          elem.className = 'start-1';
          matchCount++;
        }
      },
      'done' : () => {
        let count = testMarkedText($ctx, /^loremipsum$/);
        expect(count).toBe(matchCount);
        expect(count).toBe(22);
        done();
      }
    });
  });

  function testMarkedText($ctx, reg) {
    let count = 0,
      marks = $ctx.find('mark');

    marks.filter(function(i, el) {
      return el.hasAttribute('class');

    }).each(function(i, elem) {
      expect(getMarkedText(elem, marks)).toMatch(reg);
      count++;
    });
    return count;
  }

  // it aggregate match text across elements
  function getMarkedText(elem, marks) {
    let text = '',
      found = false;
    marks.each(function(i, el) {
      if ( !found) {
        if (el === elem) {
          found = true;
        }

      } else if (el.hasAttribute('class')) {
        return  false;
      }
      if (found) {
        text += el.textContent;
      }
      return true;
    });
    // the text, aggregated without taking into account html elements,
    // requires some normalization
    return  text.replace(/\s+/g, '').toLowerCase();
  }
});
