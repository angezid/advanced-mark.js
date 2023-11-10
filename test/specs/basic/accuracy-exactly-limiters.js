'use strict';
describe('basic mark with accuracy exactly and limiters', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('basic/accuracy-exactly-limiters.html');

    $ctx = $('.basic-accuracy-exactly-limiters');
    new Mark($ctx[0]).mark('test', {
      'accuracy': {
        'value': 'exactly',
        'limiters': [
          ',', '.', '-', '!', '"', '\'', '(', ')', '%'
        ]
      },
      'separateWordSearch': false,
      'done': () => {
        done();
      }
    });
  });

  it('should wrap matches without custom limiters', () => {
    expect($ctx.find('mark').length).toBe(6);
    $ctx.find('mark').each((i, elem) => {
      expect($(elem).text()).toBe('test');
    });
  });
});
