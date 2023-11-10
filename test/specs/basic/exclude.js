'use strict';
describe('basic mark with exclude', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('basic/exclude.html');

    $ctx = $('.basic-exclude');
  });

  it('should exclude elements from searching when \'exclude\' option is an array of selectors', done => {
    new Mark($ctx[0]).mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'exclude': ['*[data-ignore]', '.ignore'],
      'done': () => {
        expect($ctx.find('mark').length).toBe(4);
        done();
      }
    });
  });
  
  it('should exclude elements from searching when \'exclude\' option is a string of selectors', done => {
    new Mark($ctx[0]).mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'exclude': '*[data-ignore], .ignore',
      'done': () => {
        expect($ctx.find('mark').length).toBe(4);
        done();
      }
    });
  });
});
