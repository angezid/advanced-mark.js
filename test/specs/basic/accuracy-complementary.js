'use strict';
describe('basic mark with accuracy complementary', () => {
  let $ctx1, $ctx2;
  beforeEach(done => {
    loadFixtures('basic/accuracy-complementary.html');

    $ctx1 = $('.basic-accuracy-complementary > div:first-child');
    $ctx2 = $('.basic-accuracy-complementary > div:last-child');
    new Mark($ctx1[0]).mark(['lorem', 'ipsumx'], {
      'accuracy': 'complementary',
      'separateWordSearch': false,
      'done': () => {
        new Mark($ctx2[0]).mark(['lorem', 'ipsumtest'], {
          'accuracy': 'complementary',
          'separateWordSearch': true,
          'done': () => {
            done();
          }
        });
      }
    });
  });

  it('should wrap the correct matches', () => {
    expect($ctx1.find('mark').length).toBe(4);
    let textOpts = ['testLoremtest', 'ipsumx', 'ipsumx-test', 'öipsumxö'];
    $ctx1.find('mark').each((i, elem) => {
      expect($.inArray($(elem).text(), textOpts)).toBeGreaterThan(-1);
    });
  });
  it('should work with separateWordSearch', () => {
    expect($ctx2.find('mark').length).toBe(2);
    let textOpts = ['testLorem', 'ipsumtest'];
    $ctx2.find('mark').each((i, elem) => {
      expect($.inArray($(elem).text(), textOpts)).toBeGreaterThan(-1);
    });
  });
});
