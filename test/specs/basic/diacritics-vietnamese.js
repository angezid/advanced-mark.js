'use strict';
describe('basic mark with diacritics for Vietnamese', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('basic/diacritics-vietnamese.html');

    $ctx = $('.basic-diacritics-vietnamese');
    // including a term with a "s" and a whitespace to check "merge blanks"
    // behavior in combination with diacritics
    new Mark($ctx[0]).mark(['truong', 'am', 'ac'], {
      'separateWordSearch': false,
      'done': () => {
        done();
      }
    });
  });

  it('should treat normal and diacritic characters equally', () => {
    expect($ctx.find('mark').length).toBe(9);
  });
});
