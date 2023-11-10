'use strict';
describe('basic mark with separateWordsearch', () => {
  let $ctx1, $ctx2, notFound;
  beforeEach(done => {
    loadFixtures('basic/separate-word-search.html');

    $ctx1 = $('.basic-separate > div:first-child');
    $ctx2 = $('.basic-separate > div:last-child');
    notFound = [];
    new Mark($ctx1[0]).mark('lorem ipsum test', {
      'diacritics': false,
      'separateWordSearch': true,
      'noMatch': term => {
        notFound.push(term);
      },
      'done': () => {
        new Mark($ctx2[0]).mark(['lorem ipsum'], {
          'diacritics': false,
          'separateWordSearch': true,
          'done': () => {
            done();
          }
        });
      }
    });
  });

  it('should wrap separated words', () => {
    expect($ctx1.find('mark').length).toBe(8);
    expect($ctx2.find('mark').length).toBe(8);
  });
  it('should call the noMatch callback for separated words', () => {
    expect(notFound).toEqual(['test']);
  });
});
