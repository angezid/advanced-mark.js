'use strict';
describe('mark iframes inside shadow DOMs', () => {

  beforeEach(() => {
    loadFixtures('iframes/shadow-dom-iframes.html');
  }, 30000);

  it('should wrap matches inside shadow DOMs and its iframes', done => {
    let count = 0; 
    new Mark('.shadow-dom').mark('lorem', {
      'diacritics': false,
      'iframes': true,
      'shadowDOM': true,
      'each' : () => {
        count++;
      },
      'done': () => {
        expect(count).toBe(10);
        done();
      }
    });
  }, 30000);
});
