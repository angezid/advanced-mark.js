'use strict';
describe('unmark with click event', () => {
  let $ctx, eventCalled;
  beforeEach(done => {
    loadFixtures('basic/events.html');

    $ctx = $('.basic-events');
    eventCalled = 0;
    $ctx.find('.event-target').on('click', () => {
      ++eventCalled;
    });
    let instance = new Mark($ctx[0]);
    instance.mark('test', {
      'diacritics': false,
      'separateWordSearch': false,
      'done': () => {
        instance.unmark({
          'done': () => {
            $ctx.find('.event-target').click();
            done();
          }
        });
      }
    });
  });

  it('should not remove bound events', () => {
    expect(eventCalled).toBe(1);
  });

});
