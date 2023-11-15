
'use strict';
describe('mark with ignoreGroups options', () => {
  let $ctx1;

  beforeEach(() => {
    loadFixtures('regexp/conditional-ignore-groups.html');

    $ctx1 = $('.conditional-ignore-groups');
  });

  it('should ignore specified conditional groups', done => {
    new Mark($ctx1[0]).markRegExp(/(conditional[ \t]+)?(ignore[ \t]+)?(groups)/gi, {
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

  /*it('should call filter callback when main group is conditional', done => {
    let matches = 0;

    new Mark($ctx1[0]).markRegExp(/([ \t]+)((?:conditional|ignore)[ \t]+)(groups)?/gi, {
      'ignoreGroups' : 2,
      'filter' : () => {
        matches++;
        return true;
      },
      'done' : () => {
        let marks= $ctx1.find('mark');
        expect(marks.length).toBe(2);
        expect(matches).toBe(5);

        done();
      }
    });
  });*/
});























