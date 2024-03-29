'use strict';
describe(
  'basic mark with ignoreJoiners and synonyms with diacritics',
  function() {
    let $ctx;
    beforeEach(done => {
      loadFixtures('basic/ignore-joiners-synonyms-diacritics.html');

      $ctx = $('.basic-ignore-joiners-synonyms-diacritics');
      new Mark($ctx[0]).mark(['Dołor', 'Sed', 'Lorèm ipsum'], {
        'separateWordSearch': false,
        'ignoreJoiners': true,
        'synonyms': {
          'Sed': 'justø',
          'Dołor': 'ãmet'
        },
        'diacritics': true,
        'done': () => {
          done();
        }
      });
    });

    it('should find synonyms with diacritics', () => {
      expect($ctx.find('mark').length).toBe(33);
    });
  }
);
