'use strict';
describe('when one instance calls multiple methods', function() {
  var $ctx, exception, count;

  beforeEach(function(done) {
    loadFixtures('across-elements/basic/main.html');

    $ctx = $('.across-elements');
    exception = false;
    count = 0;

    var instance = new Mark($ctx[0]);

    try {
      instance.mark('lorem ipsum', {
        'separateWordSearch': false,
        'acrossElements' : true,
        'cacheTextNodes' : true,
        'done' : function(_, matches) {
          count += matches;

          instance.mark('ipsum dolor', {
            'separateWordSearch': false,
            'acrossElements' : true,
            'done' : function(_, matches) {
              count += matches;

              instance.mark('lorem ipsum', {
                'separateWordSearch': false,
                'acrossElements' : true,
                'cacheTextNodes' : true,
                'done' : function(_, matches) {
                  count += matches;

                  instance.mark('sit', {
                    'acrossElements' : true,
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
        }
      });
    } catch (e) {
      exception = true;
      done();
    }
  });

  it('should not throw an exception with different settings of the cacheTextNodes options', function() {
    expect(count).toBe(16);
    expect(exception).toBe(false);
  });
});
