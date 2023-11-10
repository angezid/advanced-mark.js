'use strict';
describe('basic mark with duplicated keywords', () => {
  beforeEach(() => {
    loadFixtures('basic/duplicate-keywords.html');
  });

  it('should ignore duplicated array keywords', done => {
    let $ctx1 = $('.basic-duplicate-keywords > div:first-child');
    let called = 0;

    new Mark($ctx1[0]).mark(['test', 'test', 'test'], {
      'diacritics': false,
      'separateWordSearch': false,
      'filter': () => {
        called++;
        return false;
      },
      'done': () => {
        expect(called).toBe(1);
        done();
      }
    });
  });

  it('should ignore duplicated keywords with separateWordSearch', done => {
    let $ctx2 = $('.basic-duplicate-keywords > div:last-child');
    let called = 0;

    new Mark($ctx2[0]).mark('lorem test ipsum test lorem ipsum', {
      'separateWordSearch': true,
      'filter': () => {
        called++;
        return true;
      },
      'done': () => {
        expect(called).toBe(9);
        done();
      }
    });
  });
});
