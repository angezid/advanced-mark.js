
'use strict';
describe('mark with acrossElements and ignoreGroups options', function() {
  var $ctx1;

  beforeEach(function() {
    loadFixtures('across-elements/regexp/conditional-ignore-groups.html');
    
    $ctx1 = $('.conditional-ignore-groups');
  });
  
  it('should ignore specified conditional groups', function(done) {
    new Mark($ctx1[0]).markRegExp(/(conditional[ \t]+)?(ignore[ \t]+)?(groups)/gi, {
      'acrossElements' : true,
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
  
  it('should not thow exception when main group is conditional', function(done) {
    var matches = 0; 
    
    new Mark($ctx1[0]).markRegExp(/([ \t]+)((?:conditional|ignore)[ \t]+)(groups)?/gi, {
      'acrossElements' : true,
      'ignoreGroups' : 2,
      'filter' : (n, t, m, info) => {
        if (info.matchStart) {
          matches++;
        }
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























