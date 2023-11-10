'use strict';
describe('basic mark with ignoreJoiners', () => {
  let $ctx1, $ctx2;
  beforeEach(() => {
    loadFixtures('basic/ignore-joiners.html');
  });

  it('should find matches when enabled', done => {
    $ctx1 = $('.basic-ignore-joiners > div:nth-child(1)');

    new Mark($ctx1.get()).mark('Lorem ipsum', {
      'separateWordSearch': false,
      'ignoreJoiners': true,
      'done': () => {
        expect($ctx1.find('mark').length).toBe(4);
        done();
      }
    });
  });

  it('should not find matches when disabled', done => {
    $ctx2 = $('.basic-ignore-joiners > div:nth-child(2)');

    new Mark($ctx2[0]).mark(['ipsum'], {
      'separateWordSearch': false,
      'ignoreJoiners': false,
      'done': () => {
        expect($ctx2.find('mark').length).toBe(2);
        done();
      }
    });
  });
});
