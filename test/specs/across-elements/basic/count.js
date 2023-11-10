'use strict';
describe('mark with acrossElements', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('across-elements/basic/count.html');

    $ctx = $('.across-elements-count');
  });

  it('should mark the first match', done => {
    new Mark($ctx[0]).mark('Lorem', {
      'acrossElements' : true,
      'filter' : (node, kw, totalMatches, matches, info) => {
        info.execution.abort = true;
        return true; 
      },
      'done' : () => {
        expect($ctx.find('mark').length).toBe(1);

        new Mark($ctx[0]).mark('ipsum', {
          'filter' : (node, kw, totalMatches, matches, info) => {
            info.execution.abort = true;
            return true;
          },
          'done' : () => {
            expect($ctx.find('mark').length).toBe(2);
            done();
          }
        });
      }
    });
  });

  it('should count and test content of whole words', done => {
    let wordCount = 0;
    new Mark($ctx[0]).mark(['Lorem', 'ipsum'], {
      'diacritics' : false,
      'accuracy' : 'exactly',
      'acrossElements' : true,
      'each' : (elem, info) => {
        if (info.matchStart) {
          elem.className = 'word-1';
          wordCount++;
        }
      },
      'done' : () => {
        let count = testMarkedText($ctx, 'word-1', /^(?:lorem|ipsum)$/);
        expect(count).toBe(wordCount);
        expect(count).toBe(52);
        done();
      }
    });
  });

  it('should count and test content of phrases', done => {
    let phraseCount = 0;

    new Mark($ctx[0]).mark('Lorem ipsum', {
      'diacritics' : false,
      'separateWordSearch' : false,
      'accuracy' : 'exactly',
      'acrossElements' : true,
      each : (elem, info) => {
        if (info.matchStart) {
          // elem in this case is the first marked element of the match
          elem.className = 'phrase-1';
          phraseCount++;
        }
      },
      'done' : () => {
        let count = testMarkedText($ctx, 'phrase-1', /^loremipsum$/);
        expect(count).toBe(phraseCount);
        expect(count).toBe(25);
        done();
      }
    });
  });

  function testMarkedText($ctx, klass, reg) {
    let count = 0,
      marks = $ctx.find('mark');

    marks.filter((i, elem) => {
      return $(elem).hasClass(klass);

    }).each((i, elem) => {
      expect(getMarkedText($(elem), marks)).toMatch(reg);
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
        if (el === elem[0]) {
          found = true;
        }

      } else if (el.className && /\b[a-z]+-1\b/.test(el.className)) {
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
