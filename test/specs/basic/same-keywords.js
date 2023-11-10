'use strict';
describe('basic mark with multiple same keywords', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('basic/same-keywords.html');

    $ctx = $('.basic-same-keywords');
    new Mark($ctx[0]).mark(['test', 'test'], {
      'diacritics': false,
      'separateWordSearch': false,
      'done': () => {
        done();
      }
    });
  });

  it('matches should be wrapped only once', () => {
    expect($ctx.find('mark').length).toBe(1);
  });
});
