'use strict';
describe('basic mark with synonyms in an array', function() {
  var $ctx1, $ctx2, $ctx3;
  beforeEach(function() {
    loadFixtures('basic/synonyms-array.html');
  });

  it('should combine synonym values in an array', function(done) {
    $ctx1 = $('.basic-synonyms-array > div:nth-child(1)');
    
    new Mark($ctx1[0]).mark('1', {
      accuracy: 'exactly',
      synonyms: {
        '1': ['one', 'a', 'single', 'sole']
      },
      'done': function() {
        expect($ctx1.find('mark')).toHaveLength(11);
        done();
      }
    });
  });

  it('wildcards in synonym array should work', function(done) {
    $ctx2 = $('.basic-synonyms-array > div:nth-child(2)');
    
    new Mark($ctx2[0]).mark('Lorem', {
      accuracy: 'exactly',
      synonyms: {
        'i*m': ['lorem', 'do?or']
      },
      wildcards: 'enabled',
      'done': function() {
        expect($ctx2.find('mark')).toHaveLength(4);
        done();
      }
    });
  });

  it('finds all synonyms in the array', function(done) {
    $ctx3 = $('.basic-synonyms-array > div:nth-child(3)');
    
    new Mark($ctx3[0]).mark('been', {
      synonyms: {
        'am': ['be', 'is', 'are', 'were', 'was', 'being', 'been', 'am']
      },
      'done': function() {
        expect($ctx3.find('mark')).toHaveLength(8);
        done();
      }
    });
  });
});
