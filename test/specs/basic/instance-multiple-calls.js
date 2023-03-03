'use strict';
describe('when one instance calls multiple methods', function() {
  var $ctx, exception, count;

  beforeEach(function(done) {
    loadFixtures('basic/main.html');

    $ctx = $('.basic');
    exception = false;
    count = 0;

    var instance = new Mark($ctx[0]);

    try {
      instance.mark('lorem ipsum dolor', {
        'separateWordSearch': false,
        'cacheTextNodes' : true,
        'done' : function(_, matches) {
          count += matches;

          instance.mark('ipsum', {
            'separateWordSearch': false,
            'cacheTextNodes' : true,
            'done' : function(_, matches) {
              count += matches;

              instance.mark('lorem dolor', {
                'separateWordSearch': true,
                'cacheTextNodes' : true,
                'done' : function(_, matches) {
                  count += matches;
                  done();
                }
              });
            }
          });
        }
      });
    } catch (e) {
      exception = true;
      done();
    }
  });

  it('should not throw an exception with different settings of the cacheTextNodes options', function() {
    expect(count).toBe(20);
    expect(exception).toBe(false);
  });
});
