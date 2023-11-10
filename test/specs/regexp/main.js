'use strict';
describe('mark with regular expression', () => {
  let $ctx1, $ctx2, errorThrown, ret;
  beforeEach(done => {
    loadFixtures('regexp/main.html');

    $ctx1 = $('.regexp > div:first-child');
    $ctx2 = $('.regexp > div:last-child');
    errorThrown = false;
    ret = new Mark($ctx1[0]).markRegExp(/Lor[^]?m/gmi, {
      'done': () => {
        try {
          new Mark($ctx2[0]).markRegExp(/(Lor)([^]?m)/gmi, {
            'done': () => {
              // timeout, otherwise "ret =" will not be executed
              setTimeout(() => {
                done();
              }, 50);
            }
          });
        } catch (e) {
          errorThrown = true;
          done();
        }
      }
    });
  });

  it('should wrap matches', () => {
    expect($ctx1.find('mark').length).toBe(4);
  });
  it('should silently ignore groups in regular expressions', () => {
    expect($ctx2.find('mark').length).toBe(4);
    expect(errorThrown).toBe(false);
  });
  it('should return an object with further methods', () => {
    expect(ret instanceof Mark).toBe(true);
    expect(typeof ret.mark).toBe('function');
    expect(typeof ret.unmark).toBe('function');
    expect(typeof ret.markRegExp).toBe('function');
  });
});
