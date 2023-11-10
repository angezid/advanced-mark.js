'use strict';
describe('mark with regular expression and ignoreGroups', () => {
  let $ctx1, $ctx2;
  beforeEach(done => {
    loadFixtures('regexp/ignore-groups.html');

    $ctx1 = $('.regexp-ignore-groups > div:first-child');
    $ctx2 = $('.regexp-ignore-groups > div:last-child');
    new Mark($ctx1[0]).markRegExp(/(Lor)([^]?m[\s]*)(ipsum)/gmi, {
      'done': () => {
        new Mark($ctx2[0]).markRegExp(/(Lor)([^]?m[\s]*)(ipsum)/gmi, {
          'ignoreGroups': 2,
          'done': () => {
            done();
          }
        });
      }
    });
  });

  it('should silently ignore groups when disabled', () => {
    expect($ctx1.find('mark').length).toBe(4);
    $ctx1.find('mark').each((i, elem) => {
      expect($(elem).text()).toBe('Lorem ipsum');
    });
  });
  it('should ignore specified groups when enabled', () => {
    expect($ctx2.find('mark').length).toBe(4);
    $ctx2.find('mark').each((i, elem) => {
      expect($(elem).text()).toBe('ipsum');
    });
  });
});
