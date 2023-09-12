
'use strict';
describe('mark with ignoreGroups options', function() {
  var $ctx1;

  beforeEach(function() {
    loadFixtures('regexp/conditional-ignore-groups.html');
    
    $ctx1 = $('.conditional-ignore-groups');
  });
  
  it('should ignore specified conditional groups', function(done) {
    new Mark($ctx1[0]).markRegExp(/(conditional[ \t]+)?(ignore[ \t]+)?(groups)/gi, {
      'ignoreGroups' : 2,
      'done' : function() {
        var marks= $ctx1.find('mark');
        expect(marks.length).toBe(4);
        
        marks.each(function() {
          expect($(this).text()).toBe('groups');
        });
        done();
      }
    });
  });
  
  it('should call filter callback when main group is conditional', function(done) {
    var matches = 0; 
    
    new Mark($ctx1[0]).markRegExp(/([ \t]+)((?:conditional|ignore)[ \t]+)(groups)?/gi, {
      'ignoreGroups' : 2,
      'filter' : () => {
        matches++;
        return true;
      },
      'done' : function() {
        var marks= $ctx1.find('mark');
        expect(marks.length).toBe(2);
        expect(matches).toBe(5);
        
        done();
      }
    });
  });
});























