'use strict';
describe(
  'mark with acrossElements, regular expression and ignoreGroups',
  function() {
    let $ctx1, $ctx2, prefix = 'across-elements-regexp';
    beforeEach(() => {
      loadFixtures('across-elements/regexp/ignore-groups.html');
    });

    it('should silently ignore groups when disabled', done => {
      $ctx1 = $('.' + prefix + '-ignore-groups > div:first-child');

      new Mark($ctx1[0]).markRegExp(/(Lor)([^]?m[\s]*)(ipsum)/gmi, {
        'acrossElements': true,
        'done': () => {
          expect($ctx1.find('mark').length).toBe(4);
          $ctx1.find('mark').each((i, elem) => {
            expect($(elem).text()).toBe('Lorem ipsum');
          });
          done();
        }
      });
    });

    it('should ignore specified groups when enabled', done => {
      $ctx2 = $('.' + prefix + '-ignore-groups > div:last-child');

      new Mark($ctx2[0]).markRegExp(/(Lor)([^]?m[\s]*)(ipsum)/gmi, {
        'acrossElements': true,
        'ignoreGroups': 2,
        'done': () => {
          expect($ctx2.find('mark').length).toBe(4);
          $ctx2.find('mark').each((i, elem) => {
            expect($(elem).text()).toBe('ipsum');
          });
          done();
        }
      });
    });
  }
);
