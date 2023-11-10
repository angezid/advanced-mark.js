'use strict';
describe(
  'mark with acrossElements, regular expression and ignoreGroups',
  function() {
    var $ctx1, $ctx2, prefix = 'across-elements-regexp';
    beforeEach(function() {
      loadFixtures('across-elements/regexp/ignore-groups.html');
    });

    it('should silently ignore groups when disabled', function(done) {
      $ctx1 = $('.' + prefix + '-ignore-groups > div:first-child');

      new Mark($ctx1[0]).markRegExp(/(Lor)([^]?m[\s]*)(ipsum)/gmi, {
        'acrossElements': true,
        'done': function() {
          expect($ctx1.find('mark').length).toBe(4);
          $ctx1.find('mark').each(function() {
            expect($(this).text()).toBe('Lorem ipsum');
          });
          done();
        }
      });
    });

    it('should ignore specified groups when enabled', function(done) {
      $ctx2 = $('.' + prefix + '-ignore-groups > div:last-child');

      new Mark($ctx2[0]).markRegExp(/(Lor)([^]?m[\s]*)(ipsum)/gmi, {
        'acrossElements': true,
        'ignoreGroups': 2,
        'done': function() {
          expect($ctx2.find('mark').length).toBe(4);
          $ctx2.find('mark').each(function() {
            expect($(this).text()).toBe('ipsum');
          });
          done();
        }
      });
    });
  }
);
