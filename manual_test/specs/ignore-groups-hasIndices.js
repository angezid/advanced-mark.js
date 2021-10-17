
'use strict';
describe(
  'markRegExp with acrossElements and ignoreGroups and RegExp.hasIndices',
  function() {
    var $ctx, reg, matchCount;

    beforeEach(function() {
      matchCount = 0;
    });

    afterEach(function() {
      $ctx.unmark();
    });

    it('should mark text with regex without groups', function(done) {
      $ctx = $('.across-elements-ignore-groups-1');
      reg = /\bsome\s+\w+\b/dgi;

      new Mark($ctx[0]).markRegExp(reg, {
        className : 'text',
        'acrossElements' : true,
        'ignoreGroups' : 1,
        each : eachMark,
        'done' : function() {
          expect(matchCount).toBe(11);
          expect(testMarkedText($ctx)).toBe(11);
          done();
        }
      });
    });

    it('should mark text with ignoreGroups: 1', function(done) {
      $ctx = $('.across-elements-ignore-groups-1');
      reg = /\b(group1)\s+some\s+\w+\b/dgi;

      new Mark($ctx[0]).markRegExp(reg, {
        className : 'text',
        'acrossElements' : true,
        'ignoreGroups' : 1,
        each : eachMark,
        'done' : function() {
          expect(matchCount).toBe(9);
          expect(testMarkedText($ctx)).toBe(9);
          done();
        }
      });
    });

    it('should mark group nested in ignore one & next word', function(done) {
      $ctx = $('.across-elements-ignore-groups-1');
      reg = /\b(group1\b.+?\b(some)\s+)\w+\b/dgi;

      new Mark($ctx[0]).markRegExp(reg, {
        className : 'text',
        'acrossElements' : true,
        'ignoreGroups' : 1,
        each : eachMark,
        'done' : function() {
          expect(matchCount).toBe(10);
          expect(testMarkedText($ctx)).toBe(10);
          done();
        }
      });
    });

    it('should mark text with ignoreGroups : 2', function(done) {
      $ctx = $('.across-elements-ignore-groups-2');
      reg = /\b(group1)\b.+?\b(group2@?)\s+some\s+\w+\b/dgi;

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

    it('should mark text with optional ignore group', function(done) {
      $ctx = $('.across-elements-ignore-groups-2');
      reg = /\b(group1)\b(.+?\bgroup2@?)?\s+some\s+\w+\b/dgi;

      new Mark($ctx[0]).markRegExp(reg, {
        className : 'text',
        'acrossElements' : true,
        'ignoreGroups' : 2,
        each : eachMark,
        'done' : function() {
          expect(matchCount).toBe(12);
          expect(testMarkedText($ctx)).toBe(12);
          done();
        }
      });
    });

    it('should mark text with nested ignore group', function(done) {
      $ctx = $('.across-elements-ignore-groups-2');
      reg = /\b(group1\b.+?\b(group2)@?\s+)some\s+\w+\b/dgi;

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

    it('should mark text with 2 nested ignore groups', function(done) {
      $ctx = $('.across-elements-ignore-groups-3');
      reg = /\b(\w+1.+?(\w+\d\b.+?\b(\w+\d)@?\s+))some\s+\w+\b/dgi;

      new Mark($ctx[0]).markRegExp(reg, {
        className : 'text',
        'acrossElements' : true,
        'ignoreGroups' : 3,
        each : eachMark,
        'done' : function() {
          expect(matchCount).toBe(1);
          expect(testMarkedText($ctx)).toBe(1);
          done();
        }
      });
    });

    function eachMark(elem, info) {
      if (info.matchNodeIndex === 0) {
        elem.className = 'text-1';
        matchCount++;
      }
    }

    function testMarkedText($ctx) {
      var count = 0,
        marks = $ctx.find('mark');

      marks.filter(function() {
        return  $(this).hasClass('text-1');

      }).each(function() {
        expect(getMarkedText($(this), marks)).toBe('sometext');
        count++;
      });
      return  count;
    }

    // it aggregate match text across elements
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
        return  true;
      });
      return  text.replace(/\s+/g, '').toLowerCase();
    }
  }
);

