'use strict';
describe('basic mark with regex characters', function() {
  var $ctx;
  beforeEach(function(done) {
    loadFixtures('basic/escape.html');

    $ctx = $('.basic-escape');
    new Mark($ctx[0]).mark([
      '39,00 €', '0.009 €', 'Unk?nown', 'Some+>thing', 'www.happy.com\\'
    ], {
      'diacritics': false,
      'separateWordSearch': false,
      'done': function() {
        done();
      }
    });
  });

  it('should escape search terms and not modify text node values', function() {
    var marks = $ctx.find('mark');
    expect(marks).toHaveLength(5);
    expect(marks.get(0)).toContainText('39,00 €');
    expect(marks.get(1)).toContainText('0.009 €');
    expect(marks.get(2)).toContainText('Unk?nown');
    expect(marks.get(3)).toContainText('Some+>thing');
    expect(marks.get(4)).toContainText('www.happy.com\\');
  });
});
