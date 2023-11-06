'use strict';
xdescribe('charSets option', function() {
  var $ctx, $ctx2;
  var quantifiers = ['se[a]?t', '[b]*eat', 'su[c]+ess', '[d]{3,}', 'g[e]*?t'],
    quantifiersObj = {
      'se[a]?t' : ['set',  'seat'],
      '[b]*eat' : ['beat',  'eat'],
      'su[c]+ess' : ['success',],
      '[d]{3,}' : ['ddd',  'dddd'],
      'g[e]*?t' : ['get',  'geet']
    },
    escapes = ['\\[[a]+', '\\[b]', '\\\\[c]+', '\\\\\\[d]', '\\\\\\\\[e]+'],
    escapeObj = {
      '\\[[a]+' : '[aaa',
      '\\[b]' : '[b]',
      '\\\\[c]+' : '\\ccc',
      '\\\\\\[d]' : '\\\\[d]',
      '\\\\\\\\[e]+' : '\\\\\\eee',
    };

  beforeEach(function() {
    loadFixtures('basic/char-sets.html');

    $ctx = $('.char-sets-escape');
    $ctx2 = $('.char-sets-quantifiers');
  });

  it('should mark charSets with quantifiers', function(done) {
    var curTerm = '';
    new Mark($ctx2[0]).mark(quantifiers, {
      'charSets' : true,
      filter: function(nd, term) {
        curTerm = term;
        return true;
      },
      each : function(elem) {
        expect(quantifiersObj[curTerm]).toContain(elem.textContent);
      },
      'done' : function() {
        expect($ctx2.find('mark').length).toBe(9);

        done();
      }
    });
  });

  it('should correctly handle escaped characters', function(done) {
    var curTerm = '';
    new Mark($ctx[0]).mark(escapes, {
      'charSets' : true,
      filter: function(nd, term) {
        curTerm = term;
        return true;
      },
      each : function(elem) {
        expect(elem.textContent).toBe(escapeObj[curTerm]);
      },
      'done' : function() {
        expect($ctx.find('mark').length).toBe(5);

        done();
      }
    });
  });
});
