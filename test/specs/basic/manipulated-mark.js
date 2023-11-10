'use strict';
describe('unmark with elements inside marked elements', () => {
  let $ctx;
  beforeEach(done => {
    loadFixtures('basic/manipulated-mark.html');

    $ctx = $('.basic-manipulated-mark');
    let instance = new Mark($ctx[0]);
    instance.mark('lorem ipsum', {
      'diacritics': false,
      'separateWordSearch': false,
      'done': () => {
        $('<span />', {
          'html': 'test',
          'id': 'manipulatedMark'
        }).appendTo($ctx.find('mark').first());
        instance.unmark({
          'done': () => {
            done();
          }
        });
      }
    });
  });

  it('should not delete subsequently added elements', () => {
    expect($ctx).toContainElement('#manipulatedMark');
  });
});
