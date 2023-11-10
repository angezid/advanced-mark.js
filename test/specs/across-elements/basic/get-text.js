'use strict';
describe('get text nodes with taking into account html elements', () => {
  let $ctx;
  beforeEach(() => {
    loadFixtures('across-elements/basic/get-text.html');

    $ctx = $('.across-elements-get-text');
  });

  it('should correctly count whole words in match.input', done => {
    let count = 0, text;
    new Mark($ctx[0]).markRegExp(/^\s*\w+\b/g, {
      'acrossElements' : true,
      each : (elem, info) => {
        text = info.match.input;
      },
      'done' : () => {
        let reg = /\b\w+\b/g;
        while (reg.exec(text) !== null) {
          count++;
        }
        expect(count).toBe(56);
        done();
      }
    });
  });
});
