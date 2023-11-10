'use strict';
describe('basic mark with debug callback', () => {
  let $ctx, debugCalled;
  beforeEach(done => {
    loadFixtures('basic/main.html');

    debugCalled = 0;
    $ctx = $('.basic');
    new Mark($ctx[0]).mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'debug': true,
      'log': {
        'debug': () => {
          debugCalled++;
        },
        'warn': () => {
          debugCalled++;
        }
      },
      'done': () => {
        done();
      }
    });
  });

  it('should call the log function when debug is enabled', () => {
    expect(debugCalled).toBeGreaterThan(0);
  });
});
