'use strict';
describe('basic unmark with exclude', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('basic/unmark-exclude.html');

    $ctx = $('.basic-unmark-exclude');
    new Mark($ctx[0]).mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'done': () => {
        new Mark($ctx[0]).unmark({
          'exclude': [
            '*[data-ignore] *',
            '.ignore *'
          ],
          'done': () => {
            done();
          }
        });
      }
    });
  });

  it('should not unmark inside exclude selectors', () => {
    expect($ctx.find('mark').length).toBe(2);
  });
});
