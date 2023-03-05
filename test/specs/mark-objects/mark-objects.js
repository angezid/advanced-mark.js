'use strict';
describe('markObjects() test', function() {
  var $ctx;
  var stats = { 'lorem' : 4, 'ipsum' : 4, 'sea' : 2, '\\b(?:dolor|sed)\\b' : 8, '\\bdiam\\b' : 4 };
  var array = [
    {
      'options' : { 'className' : 'red' },
      'search' : ['lorem', 'ipsum']
    },
    {
      'options' : { 'className' : 'blue', 'acrossElements' : true },
      'method' : 'markRegExp',
      'search' : { source : '\\b(?:dolor|sed)\\b', flags : 'i' }
    },
    {
      'options' : { 'className' : 'green' },
      'method' : 'markRanges',
      'search' : [{ start : 42, length :10 }, { start : 53, length : 10 }]
    },
    {
      'options' : { 'className' : 'pink' },
      'method' : 'markRegExp',
      'search' : /\bdiam\b/gi
    },
    {
      'search' : 'sea'
    }
  ];

  beforeEach(function() {
    loadFixtures('mark-objects/main.html');

    $ctx = $('.mark-objects');
  });

  it('should mark an array of objects', function(done) {
    var index = 0;

    new Mark($ctx[0]).markObjects(array, {
      'diacritics' : false,
      'done' : function(marks, matches, termStats) {
        checkElements(index++, matches, termStats);
      },
      'allDone' : function(marks, matches, termStats) {
        expect(marks).toBe(24);
        expect(matches).toBe(24);
        checkTermStats(termStats, 3);
        done();
      }
    });
  });

  it('should mark an array of objects with cacheTextNodes option', function(done) {
    var index = 0;

    new Mark($ctx[0]).markObjects(array, {
      'diacritics' : false,
      'cacheTextNodes' : true,
      'done' : function(marks, matches, termStats) {
        checkElements(index++, matches, termStats);
      },
      'allDone' : function(marks, matches, termStats) {
        expect(marks).toBe(24);
        expect(matches).toBe(24);
        checkTermStats(termStats, 3);
        done();
      }
    });
  });

  function checkElements(index, matches, termStats) {
    switch (index)  {
      case 0 :
        expect($('mark.red').length).toBe(8);
        expect(matches).toBe(8);
        checkTermStats(termStats, 2);
        break;
      case 1 :
        expect($('mark.blue').length).toBe(8);
        expect(matches).toBe(8);
        break;
      case 2 :
        expect($('mark.green').length).toBe(2);
        expect(matches).toBe(2);
        break;
      case 3 :
        expect($('mark.pink').length).toBe(4);
        expect(matches).toBe(4);
        break;
      case 4 :
        expect($('mark:not([class])').length).toBe(2);
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
