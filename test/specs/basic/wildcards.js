'use strict';
describe('basic mark with wildcards', () => {
  let $ctx1, $ctx2, $ctx3, $ctx4;
  beforeEach(done => {
    loadFixtures('basic/wildcards.html');

    $ctx1 = $('.basic-wildcards > div:nth-child(1)');
    $ctx2 = $('.basic-wildcards > div:nth-child(2)');
    $ctx3 = $('.basic-wildcards > div:nth-child(3)');
    $ctx4 = $('.basic-wildcards > div:nth-child(4)');
    new Mark($ctx1[0]).mark('lor?m', {
      'separateWordSearch': false,
      'diacritics': false,
      'wildcards': 'enabled',
      'done': () => {
        new Mark($ctx2[0]).mark('lor*m', {
          'separateWordSearch': false,
          'diacritics': false,
          'wildcards': 'enabled',
          'done': () => {
            new Mark($ctx3[0]).mark(['lor?m', 'Lor*m'], {
              'separateWordSearch': false,
              'diacritics': false,
              'wildcards': 'enabled',
              'done': () => {
                new Mark($ctx4[0]).mark(['lor?m', 'Lor*m'], {
                  'separateWordSearch': false,
                  'diacritics': false,
                  'wildcards': 'disabled',
                  'done': () => {
                    done();
                  }
                });
              }
            });
          }
        });
      }
    });
  });

  it('should find \'?\' wildcard matches', () => {
    expect($ctx1.find('mark').length).toBe(6);
  });
  it('should find \'*\' wildcard matches', () => {
    expect($ctx2.find('mark').length).toBe(8);
  });
  it('should find both \'?\' and \'*\' matches', () => {
    expect($ctx3.find('mark').length).toBe(14);
  });
  it('should find wildcards as plain characters when disabled', () => {
    expect($ctx4.find('mark').length).toBe(2);
  });
});
