## Performance

### The performance results in Firefox compare to mark.js v8.11.1:  
**Warning:** this performance tests were run on a slow processor and advanced-mark.js version 2 (more important is ratio than actual time)  
`markRegExp()` method, `acrossElements: true`; marked words 3000

|    library     |  size 100KB  |   size 200KB  |   size 500KB  |   size 1MB    |
|----------------|--------------|---------------|---------------|---------------|
|  mark.js       |   ~350 ms.   |     ~680 ms.  |   ~1700 ms.   |   ~2800 ms.   |
|  this          |    ~30 ms.   |      ~35 ms.  |     ~45 ms.   |     ~60 ms.   |

the same without `acrossElements` option; marked words 3000

|    library     |  size 100KB  |   size 200KB  |   size 500KB  |   size 1MB    |
|----------------|--------------|---------------|---------------|---------------|
|  mark.js       |   ~30 ms.    |     ~40 ms.   |    ~70 ms.    |    ~110 ms.   |
|  this          |   ~30 ms.    |     ~35 ms.   |    ~40 ms.    |     ~50 ms.   |

`markRanges()` method, marked ranges - 3000

|    library     |  size 100KB  |   size 200KB  |   size 500KB  |   size 1MB    |
|----------------|--------------|---------------|---------------|---------------|
|  mark.js       |   ~220 ms.   |     ~350 ms.  |       ~970 ms.|   ~1700 ms.   |
|  this          |   ~36 ms.    |     ~40 ms.   |       ~51 ms. |     ~60 ms.   |

`unmark()` method, mark elements - 34500, size 1MB; mark time Firefox & Chrome - ~360 ms

|    library     |   Firefox    |    Chrome     |
|----------------|--------------|---------------|
|  mark.js       |   ~1200 ms.  |    ~1300 ms.  |
|  this          |   ~210 ms.   |    ~630 ms.   |

**The performance page that allows to test every API is under way**
