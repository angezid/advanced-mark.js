'use strict';
describe('basic unmark with custom element and class', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('basic/custom-element-class.html');

    $ctx = $('.basic-custom-element-class > div:first-child');
    let instance = new Mark($ctx[0]);
    instance.mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'element': 'i',
      'className': 'custom',
      'done': () => {
        instance.unmark({
          'element': 'i',
          'className': 'custom',
          'done': () => {
            done();
          }
        });
      }
    });
  });

  it('should remove all marked elements', () => {
    expect($ctx).not.toContainElement('i.custom');
  });
});
