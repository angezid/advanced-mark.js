'use strict';
describe('mark with regular expression and separateGroups', () => {
  let $ctx1, $ctx2, $ctx3, $ctx4;
  beforeEach(() => {
    loadFixtures('regexp/separate-groups.html');
  });

  it('should separate groups when enabled', done => {
    $ctx1 = $('.regexp-separate-groups > div:nth-child(1)');

    new Mark($ctx1[0]).markRegExp(/(?:\[%)([a-z_]+):(\w+?)(?:%])/g, {
      separateGroups: true,
      done: () => {
        expect($ctx1.find('mark').length).toBe(6);
        let results = ['test', 'value', 'testx', 'value2', 'testz', '123'];
        $ctx1.find('mark').each((indx, elem) => {
          expect($(elem).text()).toBe(results[indx]);
        });
        done();
      }
    });
  });

  it('should not separate groups when disabled', done => {
    $ctx2 = $('.regexp-separate-groups > div:nth-child(2)');

    new Mark($ctx2[0]).markRegExp(/(\w+)-(\w+)/g, {
      separateGroups: true,
      done: () => {
        expect($ctx2.find('mark').length).toBe(8);
        let results = [
          'test', '1w',
          'test', '2x',
          'lorem', '3y',
          'ipsum', '4z'
        ];
        $ctx2.find('mark').each((indx, elem) => {
          expect($(elem).text()).toBe(results[indx]);
        });
        done();
      }
    });
  });

  it('should not separate groups when disabled', done => {
    $ctx3 = $('.regexp-separate-groups > div:nth-child(3)');

    new Mark($ctx3[0]).markRegExp(/(\w+)-(\w+)/g, {
      separateGroups: false,
      done: () => {
        expect($ctx3.find('mark').length).toBe(4);
        done();
      }
    });
  });

  it('should not cause an infinite loop with no groups in regexp', done => {
    $ctx4 = $('.regexp-separate-groups > div:nth-child(4)');

    new Mark($ctx4[0]).markRegExp(/\w+-\w+/g, {
      separateGroups: true,
      done : () => {
        // if regexp doesn't contains any groups nothing should be mark
        expect($ctx4.find('mark').length).toBe(0);
        done();
      }
    });
  });
});
