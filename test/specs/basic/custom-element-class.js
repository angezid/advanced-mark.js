'use strict';
describe('basic mark with custom element and class', () => {
  let $ctx1, $ctx2;
  beforeEach(done => {
    loadFixtures('basic/custom-element-class.html');

    $ctx1 = $('.basic-custom-element-class > div:first-child');
    $ctx2 = $('.basic-custom-element-class > div:last-child');
    new Mark($ctx1[0]).mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'element': 'i',
      'done': () => {
        new Mark($ctx2[0]).mark('lorem ipsum', {
          'diacritics': false,
          'separateWordSearch': false,
          'element': 'i',
          'className': 'custom',
          'done': () => {
            done();
          }
        });
      }
    });
  });

  it('should not add a class to matched elements if specified', () => {
    expect($ctx1.find('i')).toHaveLength(4);
  });
  it('should wrap matches with specified element and class', () => {
    expect($ctx2.find('i.custom')).toHaveLength(4);
  });
});
