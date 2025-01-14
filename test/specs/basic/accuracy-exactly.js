'use strict';
describe('basic mark with accuracy exactly', () => {
  let $ctx1, $ctx2, $ctx3;
  beforeEach(() => {
    loadFixtures('basic/accuracy-exactly.html');

    $ctx1 = $('.basic-accuracy-exactly > div:nth-child(1)');
    $ctx2 = $('.basic-accuracy-exactly > div:nth-child(2)');
    $ctx3 = $('.basic-accuracy-exactly > div:nth-child(3)');
  });

  it('should wrap the right matches', done => {
    new Mark($ctx1[0]).mark('ipsu', {
      'accuracy': 'exactly',
      'separateWordSearch': false,
      'done': () => {
        expect($ctx1.find('mark').length).toBe(1);
        expect($ctx1.find('mark').first().text()).toBe('ipsu');
        expect($ctx1.find('.not mark').length).toBe(0);
        
        done();
      }
    });
  });
  
  it('should work with separateWordSearch', done => {
    new Mark($ctx2[0]).mark('ipsu dolo', {
      'accuracy': 'exactly',
      'separateWordSearch': true,
      'done': () => {
        expect($ctx2.find('mark').length).toBe(2);
        
        let textOpts = ['ipsu', 'dolo'];
        $ctx2.find('mark').each((i, elem) => {
          expect($.inArray($(elem).text(), textOpts)).toBeGreaterThan(-1);
        });
        expect($ctx2.find('.not mark').length).toBe(0);
        
        done();
      }
    });
  });
  
  it('should work with diacritics', done => {
    new Mark($ctx3[0]).mark('ipsu', {
      'accuracy': 'exactly',
      'separateWordSearch': false,
      'done': () => {
        expect($ctx3.find('mark').length).toBe(4);
        
        let textOpts = ['ipsu', 'ipsü', 'īpsu', 'īpsü'];
        $ctx3.find('mark').each((i, elem) => {
          expect($.inArray($(elem).text(), textOpts)).toBeGreaterThan(-1);
        });
        expect($ctx3.find('.not mark').length).toBe(0);
        
        done();
      }
    });
  });
});
