'use strict';
describe('Handle `br` elements with acrossElements options', function() {
  var $ctx;

  beforeEach(function() {
    loadFixtures('across-elements/regexp/br-elements.html');

    $ctx = $('.br-elements pre');
  });

  it('should correctly convert `br` elements to `\n`', function(done) {
    var count = 0; 
    new Mark($ctx[0]).markRegExp(/\n/g, {
      'acrossElements' : true,
      'filter' : (n, t, m, info) => {
        if (info.matchStart) {
          count++;
        }
        return false;
      },
      'done' : function() {
        expect(count).toBe(10);
        done();
      }
    });
  });
});
