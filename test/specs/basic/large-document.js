'use strict';
describe('basic mark in large documents', () => {
  let $ctx, err, start, end, diff;

  let browser = {
    isIe: () => {
      return navigator.appVersion.indexOf('MSIE') !== -1;
    },
    navigator: navigator.appVersion,
    getVersion: () => {
      let version = 999; // we assume a sane browser
      if (navigator.appVersion.indexOf('MSIE') !== -1) {
        version = parseFloat(navigator.appVersion.split('MSIE')[1]);
      }
      return version;
    }
  };
  let time = browser.isIe() && browser.getVersion() <= 9 ? 30000 : 10000;

  beforeEach(done => {
    loadFixtures('basic/large-document.html');

    $ctx = $('.basic-large-document');
    err = false;
    start = new Date();
    try {
      new Mark($ctx[0]).mark('lorem', {
        'diacritics': false,
        'separateWordSearch': false,
        'done': () => {
          end = new Date();
          diff = end.getTime() - start.getTime();
          done();
        }
      });
    } catch (e) {
      err = true;
    }
  }, 60000);

  it('should not throw a recursion error and be faster than ' + time + ' ms', () => {
    expect($ctx.find('mark').length).toBe(9569);
    expect(err).toBe(false);
    expect(diff).toBeLessThan(time);
  });
});
