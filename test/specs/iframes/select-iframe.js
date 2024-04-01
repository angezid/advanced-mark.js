'use strict';
describe('mark with iframes', () => {
  
  beforeEach(() => {
    loadFixtures('iframes/select-iframe.html');
    
  }, 30000);    // 30 sec timeout
  
  it('should wrap matches only inside iframe', done => {
    const array = [];
    new Mark('iframe').mark('lorem', {
      'diacritics': false,
      'separateWordSearch': false,
      'iframes': true,
      'each' : function(elem) {
        array.push(elem);
      },
      'done': () => {
        expect(array.length).toBe(4);
        expect($('mark').length).toBe(0);
        done();
      }
    });
  });
});
