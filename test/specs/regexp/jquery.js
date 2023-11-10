'use strict';
describe('mark with regular expression called with jquery', () => {
  let $ctx1, $ctx2, errorThrown, ret;
  beforeEach(done => {
    loadFixtures('regexp/main.html');

    $ctx1 = $('.regexp > div:first-child');
    $ctx2 = $('.regexp > div:last-child');
    errorThrown = false;
    ret = $ctx1.markRegExp(/Lor[^]?m/gmi, {
      'done': () => {
        try {
          $ctx2.markRegExp(/(Lor)([^]?m)/gmi, {
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
  it('should silently ignore groups in regular expression', () => {
    expect($ctx2.find('mark').length).toBe(4);
    expect(errorThrown).toBe(false);
  });
  it('should return the provided context jquery element', () => {
    expect(ret instanceof $).toBe(true);
    expect(ret).toBeMatchedBy('.regexp > div:first-child');
  });
});
