'use strict';
describe('mark with acrossElements and accuracy exactly', () => {
  let $ctx1, $ctx2, $ctx3;
  beforeEach(() => {
    loadFixtures('across-elements/basic/accuracy-exactly.html');
  });

  it('should wrap the right matches', done => {
    $ctx1 = $('.across-elements-accuracy-exactly > div:nth-child(1)');

    new Mark($ctx1[0]).mark('ipsu', {
      'accuracy': 'exactly',
      'acrossElements': true,
      'done': () => {
        expect($ctx1.find('mark').length).toBe(1);
        expect($ctx1.find('mark').text()).toBe('ipsu');
        expect($ctx1.find('.not mark')).toHaveLength(0);
        done();
      }
    });
  });

  it('should work with separateWordSearch', done => {
    $ctx2 = $('.across-elements-accuracy-exactly > div:nth-child(2)');

    new Mark($ctx2[0]).mark('ipsu dolo', {
      'accuracy': 'exactly',
      'separateWordSearch': true,
      'acrossElements': true,
      'done': () => {
        expect($ctx2.find('mark').length).toBe(2);
        let textOpts = ['ipsu', 'dolo'];
        $ctx2.find('mark').each((i, elem) => {
          expect($.inArray($(elem).text(), textOpts)).toBeGreaterThan(-1);
        });
        expect($ctx2.find('.not mark')).toHaveLength(0);
        done();
      }
    });
  });

  it('should work with diacritics', done => {
    $ctx3 = $('.across-elements-accuracy-exactly > div:nth-child(3)');

    new Mark($ctx3[0]).mark('ipsu', {
      'accuracy': 'exactly',
      'acrossElements': true,
      'done': () => {
        expect($ctx3.find('mark').length).toBe(4);
        let textOpts = ['ipsu', 'ipsü', 'īpsu', 'īpsü'];
        $ctx3.find('mark').each((i, elem) => {
          expect($.inArray($(elem).text(), textOpts)).toBeGreaterThan(-1);
        });
        expect($ctx3.find('.not mark')).toHaveLength(0);
        done();
      }
    });
  });
});
