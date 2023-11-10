'use strict';
describe(
  'basic mark in a context with script-tags and style-tags',
  function() {
    let $ctx;
    beforeEach(done => {
      loadFixtures('basic/script-style.html');

      $ctx = $('.basic-script-style');
      new Mark($ctx[0]).mark('lorem', {
        'diacritics': false,
        'separateWordSearch': false,
        'done': () => {
          done();
        }
      });
    });

    it('should wrap matches', () => {
      expect($ctx.find('mark').length).toBe(4);
    });
    it('should not wrap anything inside these tags', () => {
      expect($ctx.find('style, script')).not.toContainElement('mark');
    });
  }
);
