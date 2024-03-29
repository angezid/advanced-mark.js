'use strict';
describe(
  'mark with acrossElements and regular expression with infinite matches',
  function() {
    let $ctx;
    beforeEach(done => {
      loadFixtures('across-elements/regexp/infinite.html');

      $ctx = $('.across-elements-regexp-infinite');
      new Mark($ctx[0]).markRegExp(/(|)/gmi, {
        'acrossElements': true,
        'done': () => {
          done();
        }
      });
    });

    it(
      'should not mark regular expressions with infinite matches',
      function() {
        expect($ctx.find('mark').length).toBe(0);
      }
    );
  }
);
