
'use strict';
describe('mark with acrossElements and ignoreGroups options', () => {
  let $ctx1;

  beforeEach(() => {
    loadFixtures('across-elements/regexp/conditional-ignore-groups.html');
    
    $ctx1 = $('.conditional-ignore-groups');
  });
  
  it('should ignore specified conditional groups', done => {
    new Mark($ctx1[0]).markRegExp(/(conditional[ \t]+)?(ignore[ \t]+)?(groups)/gi, {
      'acrossElements' : true,
      'ignoreGroups' : 2,
      'done' : () => {
        let marks= $ctx1.find('mark');
        expect(marks.length).toBe(4);
        
        marks.each((i, elem) => {
          expect($(elem).text()).toBe('groups');
        });
        done();
      }
    });
  });
  
});























