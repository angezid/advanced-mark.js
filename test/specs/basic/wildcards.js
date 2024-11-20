'use strict';
describe('basic mark with wildcards', () => {
  let $ctx1, $ctx2, $ctx3, $ctx4;
  beforeEach(() => {
    loadFixtures('basic/wildcards.html');

    $ctx1 = $('.basic-wildcards > div:nth-child(1)');
    $ctx2 = $('.basic-wildcards > div:nth-child(2)');
    $ctx3 = $('.basic-wildcards > div:nth-child(3)');
    $ctx4 = $('.basic-wildcards > div:nth-child(4)');
  });

  it('should find \'?\' wildcard matches', done => {
    new Mark($ctx1[0]).mark('lor?m', {
      'separateWordSearch': false,
      'diacritics': false,
      'wildcards': 'enabled',
      'done': () => {
        expect($ctx1.find('mark').length).toBe(6);
        done();
      }
    });
  });
  
  it('should find \'*\' wildcard matches', done => {
    new Mark($ctx2[0]).mark('lor*m', {
      'separateWordSearch': false,
      'diacritics': false,
      'wildcards': 'enabled',
      'done': () => {
        expect($ctx2.find('mark').length).toBe(8);
        done();
      }
    });
  });
  
  it('should find both \'?\' and \'*\' matches', done => {
    new Mark($ctx3[0]).mark(['lor?m', 'Lor*m'], {
      'separateWordSearch': false,
      'diacritics': false,
      'wildcards': 'enabled',
      'done': () => {
        //expect($ctx3.find('mark').length).toBe(14);
        expect($ctx3.find('mark').length).toBe(8);
        done();
      }
    });
  });
  
  it('should find wildcards as plain characters when disabled', done => {
    new Mark($ctx4[0]).mark(['lor?m', 'Lor*m'], {
      'separateWordSearch': false,
      'diacritics': false,
      'wildcards': 'disabled',
      'done': () => {
        expect($ctx4.find('mark').length).toBe(2);
        done();
      }
    });
  });
});
