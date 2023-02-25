'use strict';
describe('basic mark with duplicated keywords', function() {
  beforeEach(function() {
    loadFixtures('basic/duplicate-keywords.html');
  });

  it('should ignore duplicated array keywords', function(done) {
    var $ctx1 = $('.basic-duplicate-keywords > div:first-child');
    var called = 0;

    new Mark($ctx1[0]).mark(['test', 'test', 'test'], {
      'diacritics': false,
      'separateWordSearch': false,
      'filter': function() {
        called++;
        return false;
      },
      'done': function() {
        expect(called).toBe(1);
        done();
      }
    });
  });

  it('should ignore duplicated keywords with separateWordSearch', function(done) {
    var $ctx2 = $('.basic-duplicate-keywords > div:last-child');
    var called = 0;

    new Mark($ctx2[0]).mark('lorem test ipsum test lorem ipsum', {
      'separateWordSearch': true,
      'filter': function() {
        called++;
        return true;
      },
      'done': function(){
        expect(called).toBe(9);
        done();
      }
    });
  });
});
