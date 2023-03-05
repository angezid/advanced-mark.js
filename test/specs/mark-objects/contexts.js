'use strict';
describe('markObjects() test', function() {
  var $ctx,
    message = 'should mark an array of objects ';
  var red = 4,
    blue = 3,
    green = 2,
    pink = 2,
    none = 1,
    count = red + red + blue + green + pink + none;
  var stats = { 'lorem' : red, 'ipsum' : red, '\\b(?:vel|velit)\\b' : blue, '\\bnulla\\b' : pink, 'eros' : none };
  var array = [
    {
      'context' : '.ctx-1',
      'options' : { 'className' : 'red' },
      'search' : ['lorem', 'ipsum']
    },
    {
      'context' : '.ctx-2',
      'options' : { 'className' : 'blue', 'acrossElements' : true },
      'method' : 'markRegExp',
      'search' : { source : '\\b(?:vel|velit)\\b', flags : 'i' }
    },
    {
      'options' : { 'className' : 'green' },
      'method' : 'markRanges',
      'search' : [{ start : 42, length :10 }, { start : 53, length : 10 }]
    },
    {
      'context' : '.ctx-3',
      'options' : { 'className' : 'pink' },
      'method' : 'markRegExp',
      'search' : /\bnulla\b/gi
    },
    {
      'search' : 'eros'
    }
  ];

  beforeEach(function() {
    loadFixtures('mark-objects/contexts.html');

    $ctx = $();
  });

  it(message + 'with different contexts', function(done) {
    var index = 0;

    new Mark($ctx[0]).markObjects(array, {
      'diacritics' : false,
      'done' : function(marks, matches, termStats) {
        checkElements(index++, matches, termStats);
      },
      'allDone' : function(marks, matches, termStats) {
        expect(marks).toBe(count);
        expect(matches).toBe(count);
        checkTermStats(termStats, 3);
        done();
      }
    });
  });

  it(message + 'with different contexts & cacheTextNodes option', function(done) {
    var index = 0;

    new Mark($ctx[0]).markObjects(array, {
      'diacritics' : false,
      'cacheTextNodes' : true,
      'done' : function(marks, matches, termStats) {
        checkElements(index++, matches, termStats);
      },
      'allDone' : function(marks, matches, termStats) {
        expect(marks).toBe(count);
        expect(matches).toBe(count);
        checkTermStats(termStats, 3);
        done();
      }
    });
  });

  function checkElements(index, matches, termStats) {
    switch (index)  {
      case 0 :
        expect($('mark.red').length).toBe(red + red);
        expect(matches).toBe(red + red);
        checkTermStats(termStats, 2);
        break;
      case 1 :
        expect($('mark.blue').length).toBe(blue);
        expect(matches).toBe(blue);
        break;
      case 2 :
        expect($('mark.green').length).toBe(green);
        expect(matches).toBe(green);
        break;
      case 3 :
        expect($('mark.pink').length).toBe(pink);
        expect(matches).toBe(pink);
        break;
      case 4 :
        expect($('mark:not([class])').length).toBe(none);
        break;
      default: break;
    }
  }

  function checkTermStats(termStats, num) {
    var count = 0;
    for (var term in termStats) {
      count++;
      expect(termStats[term]).toBe(stats[term]);
    }
    expect(count).toBe(num);
  }
});
