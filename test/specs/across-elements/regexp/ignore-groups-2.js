'use strict';
describe('markRegExp with acrossElements and ignoreGroups', function() {
  var matchCount;
  beforeEach(function() {
    loadFixtures('across-elements/regexp/ignore-groups-2.html');
    matchCount = 0;
  });

  it('should mark text with ignoreGroups: 1', function(done) {
    var reg = /\b(group1)\s+some\s+\w+\b/gi,
      $ctx = $('.across-elements-ignore-groups-1');

    new Mark($ctx[0]).markRegExp(reg, {
      className : 'text',
      'acrossElements' : true,
      'ignoreGroups' : 1,
      each : eachMark,
      'done' : function() {
        expect(matchCount).toBe(6);
        expect(testMarkedText($ctx)).toBe(6);
        done();
      }
    });
  });

  it('should mark group nested in ignore one & next word', function(done) {
    var reg = /\b(group1\b.+\b(some)\s+)\w+\b/gi,
      $ctx = $('.across-elements-ignore-groups-1');

    new Mark($ctx[0]).markRegExp(reg, {
      className : 'text',
      'acrossElements' : true,
      'ignoreGroups' : 1,
      each : eachMark,
      'done' : function() {
        expect(matchCount).toBe(7);
        expect(testMarkedText($ctx)).toBe(7);
        done();
      }
    });
  });

  it('should mark text with ignoreGroups : 2', function(done) {
    var reg = /\b(group1)\b.+?\b(group2)\s+some\s+\w+\b/gi,
      $ctx = $('.across-elements-ignore-groups-2');

    new Mark($ctx[0]).markRegExp(reg, {
      className : 'text',
      'acrossElements' : true,
      'ignoreGroups' : 2,
      each : eachMark,
      'done' : function() {
        expect(matchCount).toBe(7);
        expect(testMarkedText($ctx)).toBe(7);
        done();
      }
    });
  });

  it('should mark text with optional ignore group', function(done) {
    var reg = /\b(group1)\b(.+?\bgroup2)?\s+some\s+\w+\b/gi,
      $ctx = $('.across-elements-ignore-groups-2');

    new Mark($ctx[0]).markRegExp(reg, {
      className : 'text',
      'acrossElements' : true,
      'ignoreGroups' : 2,
      each : eachMark,
      'done' : function() {
        expect(matchCount).toBe(9);
        expect(testMarkedText($ctx)).toBe(9);
        done();
      }
    });
  });

  it('should mark text with nested ignore group', function(done) {
    var reg = /\b(group1\b.+\b(group2))\s+some\s+\w+\b/gi,
      $ctx = $('.across-elements-ignore-groups-2');

    new Mark($ctx[0]).markRegExp(reg, {
      className : 'text',
      'acrossElements' : true,
      'ignoreGroups' : 2,
      each : eachMark,
      'done' : function() {
        expect(matchCount).toBe(7);
        expect(testMarkedText($ctx)).toBe(7);
        done();
      }
    });
  });

  function eachMark(elem, info)  {
    if (info.matchNodeIndex === 0) {
      elem.className = 'text-1';
      matchCount++;
    }
  }

  function testMarkedText($ctx) {
    var count = 0,
      marks = $ctx.find('mark');

    marks.filter(function() {
      return $(this).hasClass('text-1');

    }).each(function() {
      expect(getMarkedText($(this), marks)).toBe('sometext');
      count++;
    });
    return count;
  }

  // it collect match text across elements
  function getMarkedText(elem, marks) {
    var text = '', found = false;
    marks.each(function(i, el) {
      if ( !found) {
        if (el === elem[0]) {
          found = true;
        }

      } else if (el.className && /\b[a-z]+-1\b/.test(el.className)) {
        return  false;
      }
      if (found) {
        text += $(this).text();
      }
      return true;
    });
    // the text, collected without taking into account html elements,
    // requires some normalization
    return  text.replace(/\s+/g, '').toLowerCase();
  }
});
