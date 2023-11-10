'use strict';
describe('basic mark with ignoreJoiners and special characters', () => {
  let err, $ctx;
  beforeEach(done => {
    loadFixtures('basic/ignore-joiners-escape.html');

    $ctx = $('.basic-ignore-joiners-escape');
    err = false;
    try {
      new Mark($ctx.get()).mark([
        'Lorem ipsum+',
        'sit*',
        'amet?',
        '$50',
        '{no}',
        'www.happy.com\\'
      ], {
        'separateWordSearch': false,
        'ignoreJoiners': true,
        'done': () => {
          done();
        }
      });
    } catch (e) {
      err = true;
      done();
    }
  });

  it('should find matches', () => {
    expect(err).toBe(false);
    expect($ctx.find('mark').length).toBe(9);
  });
});
