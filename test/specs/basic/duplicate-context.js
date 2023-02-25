'use strict';
describe('basic mark with duplicated contexts', function() {
  beforeEach(function() {
    loadFixtures('basic/duplicate-context.html');
  });

  it('should ignore duplicated passed contexts', function(done) {
    var $ctx1 = $('.basic-duplicate-context > div:first-child');
    var called = 0;

    new Mark([$ctx1[0], $ctx1[0]]).mark('test', {
      'diacritics': false,
      'separateWordSearch': false,
      'filter': function() {
        called++;
        return true;
      },
      'done': function() {
        // it should be called only once, as there's only one text node
        expect(called).toBe(1);
        done();
      }
    });
  });

  it('should ignore contexts inside other contexts', function(done){
    var $ctx2 = $('.basic-duplicate-context > div:last-child');
    var spans = $ctx2.find('span').get();
    var called = 0;

    new Mark([$ctx2[0], spans[0], spans[1]]).mark('test', {
      'filter': function() {
        called++;
        return true;
      },
      'done': function() {
        expect(called).toBe(3);
        done();
      }
    });
  });
});
