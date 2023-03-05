'use strict';
describe('markObjects() errors handling', function() {
  var $ctx;
  var array = [
    {
      'method' : 'unmarkX', // misspelled method name (skip)
    },
    {
      'optionsX' : { 'className' : 'red' }, // misspelled options (mark without 'className');
      'search' : ['lorem', 'ipsum']
    },
    {
      'method' : 'mark',
      'searchX' : ['lorem', 'ipsum'] // misspelled search (skip)
    },
    ['lorem', 'ipsum'], // not object (skip)
    {
      'method' : 'markRegExp',
      'search' : { sourceX : '\\b(?:diam|sed)\\b', flags : 'gi' } // misspelled source (skip)
    },
    {
      'options' : { 'className' : 'green', 'acrossElements' : true },
      'method' : 'markRegExp',
      'search' : { source : '\\b(?:dolor|sit)\\b', flagsX : 'gi' } // misspelled flags (mark with 'g' flag)
    },
    {
      'method' : 'markRegExp',
      'search' : '\\bdiam\\b/gi' // string instead of RegExp (skip)
    },
    {
      'method' : 'markRanges',
      'searchX' : [{ start : 42, length :10 }] // misspelled search (skip)
    },
  ];

  beforeEach(function() {
    loadFixtures('mark-objects/main.html');

    $ctx = $('.mark-objects');
  });

  it('should not mark array of invalid objects', function(done) {
    var errors = 0;

    new Mark($ctx[0]).markObjects(['ab', 10], {
      'allDone' : function() {
        expect($('mark').length).toBe(0);
        expect(errors).toBe(1);
        done();
      },
      'debug' : true,
      'log' : {
        'error' : function() {
          errors++;
        }
      },
    });
  });

  it('should mark only valid objects', function(done) {
    var index = 0, errors = 0;

    new Mark($ctx[0]).markObjects(array, {
      'diacritics' : false,
      'accuracy' : 'exactly',
      'combinePatterns' : true,
      'done' : function() {
        switch (index++)  {
          case 0 :
            expect($('mark:not(.red)').length).toBe(8); // first marked elements
            break;
          case 1 :
            expect($('mark.green').length).toBe(8);
            break;
          default: break;
        }
      },
      'allDone' : function() {
        expect($('mark').length).toBe(16);
        expect(index).toBe(2);
        expect(errors).toBe(6);
        done();
      },
      'debug' : true,
      'log' : {
        'error' : function() {
          errors++;
        }
      },
    });
  });

});
