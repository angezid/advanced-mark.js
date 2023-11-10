'use strict';
describe('mark with acrossElements and regular expression', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('across-elements/regexp/main.html');

    $ctx = $('.across-elements-regexp');
    new Mark($ctx[0]).markRegExp(/lorem[\s]+ipsum/gmi, {
      'acrossElements': true,
      'done': () => {
        done();
      }
    });
  });

  it('should wrap matches', () => {
    expect($ctx.find('mark').length).toBe(6);
  });
});
