'use strict';
describe('mark with "separateWordSearch: \'preserveTerms\'" option', () => {
  beforeEach(() => {
    loadFixtures('basic/exact-terms.html');
  });

  it('should wrap exact terms and individual words', done => {
    let $ctx1 = $('.exact-terms'),
      str = 'lorem "dolore magna" ""ipsum"" """"sit amet"" dolor',
      array = ['lorem', 'dolore magna', '"ipsum"', '"""sit amet"', 'dolor'];
    
    new Mark($ctx1[0]).mark(str, {
      'diacritics': false,
      'accuracy' : 'exactly',
      'separateWordSearch': 'preserveTerms',
      'done': (m, mch, termStats) => {
        expect($ctx1.find('mark').length).toBe(12);
        
        for (let key in termStats) {
          expect(array).toContain(key);
        }
        
        done();
      }
    });
  });
});
