'use strict';
describe('iframes unmark and mark with the same instance', () => {
  let $ctx, $elements;
  beforeEach(done => {
    loadFixtures('iframes/unmark-same-instance.html');

    $ctx = $('.iframes-unmark-same-instance');
    $elements = $();
    let instance = new Mark($ctx[0]);
    instance.unmark({
      'done': () => {
        instance.mark('lorem ipsum', {
          'diacritics': false,
          'iframes': true,
          'separateWordSearch': false,
          'each': node => {
            $elements = $elements.add($(node));
          },
          'done': () => {
            done();
          }
        });
      }
    });
  });

  it(
    'should work when setting different options for method calls',
    function() {
      expect($elements).toHaveLength(8);
      $elements.each((i, elem) => {
        expect($(elem)).toHaveText('Lorem ipsum');
      });
    }
  );
});
