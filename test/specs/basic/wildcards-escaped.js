'use strict';
describe('basic mark with escaped wildcards', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('basic/wildcards-escaped.html');

    $ctx = $('.wildcards-escaped > div:nth-child(1)');
  });

  it('should treat escaped \'?\' and \'*\' normally when wildcards is set', done => {
    new Mark($ctx[0]).mark(['lor\\?m', 'Lor\\*m'], {
      'separateWordSearch': false,
      'diacritics': false,
      'wildcards': 'enabled',
      'done': () => {
        expect($ctx.find('mark').length).toBe(2);
        done();
      }
    });
  });

  it('should treat escaped \'?\' and \'*\' normally when wildcards not set', done => {
    new Mark($ctx[0]).mark(['lor\\?m', 'Lor\\*m'], {
      'separateWordSearch': false,
      'diacritics': false,
      'wildcards': 'false',
      'done': () => {
        expect($ctx.find('mark').length).toBe(2);
        done();
      }
    });
  });
  
  it('should find \'?\' matches', done => {
    let $ctx2 = $('.wildcards-escaped > div:nth-child(2)');
    
    new Mark($ctx2[0]).mark(['lor\\\\?m', 'ips\\\\\\?um' /*escaped*/, 'dol\\\\\\\\?m'], {
      'separateWordSearch': false,
      'diacritics': false,
      'wildcards': 'enabled',
      'done': () => {
        expect($ctx2.find('mark').length).toBe(5);
        done();
      }
    });
  });
  
  it('should find \'*\' matches', done => {
    let $ctx3 = $('.wildcards-escaped > div:nth-child(3)');
    
    new Mark($ctx3[0]).mark(['lo\\\\*m', 'ips\\\\\\*m' /*escaped*/, 'do\\\\\\\\*r'], {
      'separateWordSearch': false,
      'diacritics': false,
      'wildcards': 'enabled',
      'done': () => {
        expect($ctx3.find('mark').length).toBe(5);
        done();
      }
    });
  });
});
