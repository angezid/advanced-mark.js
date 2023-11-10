'use strict';
describe('when one instance calls multiple methods', () => {
  let $ctx, exception, count;

  beforeEach(done => {
    loadFixtures('basic/main.html');

    $ctx = $('.basic');
    exception = false;
    count = 0;

    let instance = new Mark($ctx[0]);

    try {
      instance.mark('lorem ipsum dolor', {
        'separateWordSearch': false,
        'cacheTextNodes' : true,
        'done' : (_, matches) => {
          count += matches;

          instance.mark('ipsum', {
            'separateWordSearch': false,
            'cacheTextNodes' : true,
            'done' : (_, matches) => {
              count += matches;

              instance.mark('lorem dolor', {
                'separateWordSearch': true,
                'cacheTextNodes' : true,
                'done' : (_, matches) => {
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

  it('should not throw an exception with different settings of the cacheTextNodes options', () => {
    expect(count).toBe(20);
    expect(exception).toBe(false);
  });
});
