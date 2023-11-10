'use strict';
describe('mark across elements with wildcards', () => {
  let $ctx,
    str = 'block elements boundary',
    message = 'should limit matches within block elements; ';

  beforeEach(() => {
    loadFixtures('across-elements/basic/block-elements-boundary.html');

    $ctx = $('.block-elements-boundary');
  });

  it(message + 'wildcards : \'withSpaces\' opt and custom boundary char', done => {
    new Mark($ctx[0]).mark(str, {
      'diacritics' : false,
      'separateWordSearch' : false,
      'wildcards' : 'withSpaces',
      'acrossElements' : true,
      'blockElementsBoundary' : {
        char : '|'
      },
      'done' : (totalMarks, totalMatches) => {
        expect(totalMatches).toBe(3);
        done();
      }
    });
  });

  it(message + 'wildcards : \'withSpaces\' opt', done => {
    new Mark($ctx[0]).mark(str, {
      'diacritics' : false,
      'separateWordSearch' : false,
      'wildcards' : 'withSpaces',
      'acrossElements' : true,
      'blockElementsBoundary' : true,
      'done' : (totalMarks, totalMatches) => {
        expect(totalMatches).toBe(3);
        done();
      }
    });
  });

});
