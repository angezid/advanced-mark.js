'use strict';
describe('basic mark with accuracy exactly', () => {
  let $ctx1, $ctx2, $ctx3;
  beforeEach(done => {
    loadFixtures('basic/accuracy-exactly.html');

    $ctx1 = $('.basic-accuracy-exactly > div:nth-child(1)');
    $ctx2 = $('.basic-accuracy-exactly > div:nth-child(2)');
    $ctx3 = $('.basic-accuracy-exactly > div:nth-child(3)');
    new Mark($ctx1[0]).mark('ipsu', {
      'accuracy': 'exactly',
      'separateWordSearch': false,
      'done': () => {
        new Mark($ctx2[0]).mark('ipsu dolo', {
          'accuracy': 'exactly',
          'separateWordSearch': true,
          'done': () => {
            new Mark($ctx3[0]).mark('ipsu', {
              'accuracy': 'exactly',
              'separateWordSearch': false,
              'done': () => {
                done();
              }
            });
          }
        });
      }
    });
  });

  it('should wrap the right matches', () => {
    expect($ctx1.find('mark').length).toBe(1);
    expect($ctx1.find('mark').text()).toBe('ipsu');
    expect($ctx1.find('.not mark')).toHaveLength(0);
  });
  it('should work with separateWordSearch', () => {
    expect($ctx2.find('mark').length).toBe(2);
    let textOpts = ['ipsu', 'dolo'];
    $ctx2.find('mark').each((i, elem) => {
      expect($.inArray($(elem).text(), textOpts)).toBeGreaterThan(-1);
    });
    expect($ctx2.find('.not mark')).toHaveLength(0);
  });
  it('should work with diacritics', () => {
    expect($ctx3.find('mark').length).toBe(4);
    let textOpts = ['ipsu', 'ipsü', 'īpsu', 'īpsü'];
    $ctx3.find('mark').each((i, elem) => {
      expect($.inArray($(elem).text(), textOpts)).toBeGreaterThan(-1);
    });
    expect($ctx3.find('.not mark')).toHaveLength(0);
  });
});
