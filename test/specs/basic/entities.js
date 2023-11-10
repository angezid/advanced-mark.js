'use strict';
describe('basic mark with HTML entities', () => {
  let $ctx1, $ctx2;
  beforeEach(done => {
    loadFixtures('basic/entities.html');

    $ctx1 = $('.basic-entities > div:first-child');
    $ctx2 = $('.basic-entities > div:last-child');
    new Mark($ctx1[0]).mark('Lorem © ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'done': () => {
        new Mark($ctx2[0]).mark('justo √ duo', {
          'diacritics': false,
          'separateWordSearch': false,
          'done': () => {
            done();
          }
        });
      }
    });
  });

  it('should wrap matches', () => {
    expect($ctx1.find('mark').length).toBe(1);
    expect($ctx2.find('mark').length).toBe(1);
  });
});
