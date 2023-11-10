'use strict';
describe('basic mark with accuracy partially', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('basic/accuracy-partially.html');

    $ctx = $('.basic-accuracy-partially');
    new Mark($ctx[0]).mark('lorem', {
      'accuracy': 'partially',
      'separateWordSearch': false,
      'done': () => {
        done();
      }
    });
  });

  it('should wrap the right matches', () => {
    expect($ctx.find('mark').length).toBe(4);
    $ctx.find('mark').each((i, elem) => {
      expect($(elem).text()).toBe('Lorem');
    });
  });
});
