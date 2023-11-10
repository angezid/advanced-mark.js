'use strict';
describe('mark() with acrossElements and blockElementsBoundary options', () => {
  let $ctx, str = 'block elements boundary';

  beforeEach(() => {
    loadFixtures('across-elements/basic/block-elements-boundary.html');

    $ctx = $('.block-elements-boundary');
  });

  it('should mark phrases with the default boundary elements', done => {
    new Mark($ctx[0]).mark(str, {
      'diacritics' : false,
      'separateWordSearch' : false,
      'acrossElements' : true,
      'blockElementsBoundary' : true,
      'done' : (totalMarks, totalMatches) => {
        expect(totalMatches).toBe(3);
        done();
      }
    });
  });

  it('should mark phrases with only custom boundary elements', done => {
    new Mark($ctx[0]).mark(str, {
      'diacritics' : false,
      'separateWordSearch' : false,
      'acrossElements' : true,
      'blockElementsBoundary' : {
        tagNames : ['Div', 'p', 'H1', 'h2'],
      },
      'done' : (totalMarks, totalMatches) => {
        expect(totalMatches).toBe(4);
        done();
      }
    });
  });
  
  it('should mark phrases with custom elements extending the default elements', done => {
    new Mark($ctx[0]).mark(str, {
      'diacritics' : false,
      'separateWordSearch' : false,
      'acrossElements' : true,
      'blockElementsBoundary' : {
        tagNames : ['custom-tag'],
        extend : true 
      },
      'done' : (totalMarks, totalMatches) => {
        expect(totalMatches).toBe(2);
        done();
      }
    });
  });
});
