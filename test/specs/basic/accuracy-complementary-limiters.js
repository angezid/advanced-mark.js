'use strict';
describe('basic mark with accuracy complementary and limiters', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('basic/accuracy-complementary-limiters.html');

    $ctx = $('.basic-accuracy-complementary-limiters');
    new Mark($ctx[0]).mark('test', {
      'accuracy': {
        'value': 'complementary',
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
    expect($ctx.find('mark').length).toBe(8);
    let textOpts = ['loremtestlorem', 'loremtest', 'test'];
    $ctx.find('mark').each((i, elem) => {
      expect($.inArray($(elem).text(), textOpts)).toBeGreaterThan(-1);
    });
  });
});
