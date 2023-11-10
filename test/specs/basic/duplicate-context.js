'use strict';
describe('basic mark with duplicated contexts', () => {
  beforeEach(() => {
    loadFixtures('basic/duplicate-context.html');
  });

  it('should ignore duplicated passed contexts', done => {
    let $ctx1 = $('.basic-duplicate-context > div:first-child');
    let called = 0;

    new Mark([$ctx1[0], $ctx1[0]]).mark('test', {
      'diacritics': false,
      'separateWordSearch': false,
      'filter': () => {
        called++;
        return true;
      },
      'done': () => {
        // it should be called only once, as there's only one text node
        expect(called).toBe(1);
        done();
      }
    });
  });

  it('should ignore contexts inside other contexts', done => {
    let $ctx2 = $('.basic-duplicate-context > div:last-child');
    let spans = $ctx2.find('span').get();
    let called = 0;

    new Mark([$ctx2[0], spans[0], spans[1]]).mark('test', {
      'filter': () => {
        called++;
        return true;
      },
      'done': () => {
        expect(called).toBe(3);
        done();
      }
    });
  });
});
