'use strict';
describe('mark with accuracy startsWith', () => {
  let $ctx, array = ['Lorem',  'ipsum',  'dolor',  'dolore',  'dolores'];

  beforeEach(() => {
    loadFixtures('basic/accuracy-starts-with.html');
    $ctx = $('.accuracy-starts-with p');
  });

  it('should wrap matches with custom limiters', done => {
    new Mark($ctx[0]).mark('Lor ips dol', {
      'accuracy': {
        'value': 'startsWith',
        'limiters': ',.;:?!\'"()[]{}'
      },
      'done': () => {
        let marks = $ctx.find('mark');
        expect(marks.length).toBe(7);

        expect(getNumber(marks)).toBe(array.length);
        done();
      }
    });
  });

  it('should wrap matches with built-in limiters', done => {
    new Mark($ctx[0]).mark('Lor ips dol', {
      'accuracy': 'startsWith',
      'done': () => {
        let marks = $ctx.find('mark');
        expect(marks.length).toBe(7);

        expect(getNumber(marks)).toBe(array.length);
        done();
      }
    });
  });
  // determines if the library marks all array items
  function getNumber(marks) {
    let num = 0;
    array.forEach(item => {
      let filtered = marks.filter(function(i, elem) {
        return $(elem).text() === item;
      });
      if (filtered.length) {
        num++;
      }
    });
    return num;
  }
});
