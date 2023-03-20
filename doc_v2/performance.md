## Performance

### The performance test results in Firefox:
#### `markRegExp()` method, `acrossElements : true`; marked words 3000
|    library     |  size 100KB  |   size 200KB  |   size 500KB  |   size 1MB    |
|----------------|--------------|---------------|---------------|---------------|
|  old           |   ~350 ms.   |     ~680 ms.  |   ~1700 ms.   |   ~2800 ms.   |
|  this          |    ~30 ms.   |      ~35 ms.  |     ~45 ms.   |     ~60 ms.   |

#### the same without `acrossElements` option; marked words 3000
|    library     |  size 100KB  |   size 200KB  |   size 500KB  |   size 1MB    |
|----------------|--------------|---------------|---------------|---------------|
|  old           |   ~30 ms.    |     ~40 ms.   |    ~70 ms.    |    ~110 ms.   |
|  this          |   ~30 ms.    |     ~35 ms.   |    ~40 ms.    |     ~50 ms.   |

#### `markRanges()` method, marked ranges - 3000
|    library     |  size 100KB  |   size 200KB  |   size 500KB  |   size 1MB    |
|----------------|--------------|---------------|---------------|---------------|
|  old           |   ~220 ms.   |     ~350 ms.  |       ~970 ms.|   ~1700 ms.   |
|  this          |   ~36 ms.    |     ~40 ms.   |       ~51 ms. |     ~60 ms.   |

#### `unmark()` method, mark elements - 34500, size 1MB; mark time Firefox & Chrome - ~360 ms
|    library     |   Firefox    |    Chrome     |
|----------------|--------------|---------------|
|  old           |   ~1200 ms.  |    ~1300 ms.  |
|  this          |   ~210 ms.   |    ~630 ms.   |

### Ways to boost performance, when mark a (especially) large array of strings or string with the `separateWordSearch` option.
A `mark()` method highlights an array item by item, e.g. an array of 10 items is run 10 times. It isn't efficient.

There are two options to boost performance :
* `combinePatterns` : combines given numbers of RegExp patterns into a single pattern, e.g. an array of 50 strings, `combinePatterns : 10` - creates 5 combine patterns, so instead of 50 runs there are only 5 runs. Any number bigger than the array length or `Infinity` creates a single combined pattern.
  Note: with `diacritics` option, a single pattern can be monstrous and more slowly, it's better to create 5-7 patterns (it's probably related to a processor cache).
  Also, this option changes the behavior of marking strings, e.g. `['word1 word2 word3', 'word2']`, without this option, 'word2' be marked, with - don't.

* `cacheTextNodes` : collecting text nodes information on every run is expensive. Caching this information improves performance with a large array.
  The performance gain gradually grows, starting with an array containing 2-3 items and doubled with 4-5 items.
  Note: this option does not change behavior as the `combinePatterns` option does. It can be used with existing code to improve performance.
  
In Firefox marking an array of 500 words on a 1 MB page, 26500 text nodes, `diacritics : false` and ~7600 highlighted words :
- with `combinePatterns : Infinity` ~0.2 second. (single pattern)
- with `cacheTextNodes` option ~4.2 sec.
- with `cacheTextNodes` and `acrossElements` options ~1 sec.
- with `acrossElements` options ~21 sec.
- without above options ~19 sec.

The same with `diacritics`:
- with `combinePatterns : Infinity` ~1.8 second. (single pattern)
- with `combinePatterns : 100` ~0.4 second. (5 patterns)

``` js
instance.mark([ 'str1', 'str2', .. ], {
  'combinePatterns' : number  // or true (default number is 10)
});
```