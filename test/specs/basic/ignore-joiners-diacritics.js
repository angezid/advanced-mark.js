'use strict';
describe('basic mark with ignoreJoiners and diacritics', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('basic/ignore-joiners-diacritics.html');

    $ctx = $('.basic-ignore-joiners-diacritics');
    new Mark($ctx.get()).mark(['Dolor', 'Lorem ipsum'], {
      'separateWordSearch': false,
      'ignoreJoiners': true,
      'diacritics': true,
      'done': () => {
        done();
      }
    });
  });

  it('should find matches containing diacritics', () => {
    expect($ctx.find('mark').length).toBe(15);
  });
});
