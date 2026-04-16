
## Nesting/overlapping ranges and RegExp capturing groups

The `markRanges()` method with `wrapAllRanges` option, can highlight nesting/overlapping ranges.  
With this option, all ranges that have indexes within 0 and context length be wrapped.

The `markRegExp()` method with `separateGroups` and `wrapAllRanges` options can highlight the following:
* capturing groups regardless of nested level. You need to filter out unwanted groups  
  Without the `wrapAllRanges` option - if a group has been wrapped, all nested groups are ignored.
* capturing groups inside **positive** lookaround assertions

It practically removes all restrictions.

See Playground examples that demonstrate cases of using `wrapAllRanges` option:
* Playground - Examples -> Overlapped groups
* Playground - Examples -> Overlapped matches
* Playground - Examples -> Random groups

**The below issue does not occur when using a `Highlight` API with `acrossElements` (`markRanges()` API does not require this) option.**  
**Note:** the `wrapAllRanges` option can cause performance degradation when highlighting a very large number of overlapping matches.  
This is because with each wrapping, two more objects are inserted into the array, which require a lot of copying, memory allocation ...

The 1MB file containing 20800 text nodes:  
**Warning:** this performance tests were run on a slow processor and advanced-mark.js version 2 (more important is ratio than actual time)

|         option         |  marked groups 2500  |  marked groups 29000  |
|------------------------|----------------------|-----------------------|
| wrapAllRanges: true    |       120 ms        |      710 ms          |
| wrapAllRanges: false   |       70 ms         |      310 ms          |

#### To mark nesting/overlapping ranges.
``` js
const ranges = [{ start: 0, length: 50 }, { start: 10, length: 20, nested: true }, ..];

instance.markRanges(ranges, {
  'wrapAllRanges': true,
  'each': (markElement, range) => {
    // to distinguish ranges you can add some property to it
    if (range.nested) {
      markElement.className = 'nested';
    }
  }
});
```

#### To mark nesting groups with the `acrossElements` option and the `d` flag
``` js
instance.markRegExp(/\w+\s((nested group)\s+\w+)/dg, {
    'acrossElements': true,
    'separateGroups': true,
    'wrapAllRanges': true,
    'each': (markElement, info) => {
      if (info.groupIndex === 2) {
          markElement.className = 'nested';
      }
    }
});
```
#### Simple example with next/previous buttons and `wrapAllRanges: true`

It uses numbers as unique match identifiers in continuous ascending order.
The code example [with next/previous buttons](some-examples.md#simple-example-with-nextprevious-buttons) which uses 'start elements' doesn't work correctly with nesting/overlapping matches.

``` js
let currentIndex = 0,
    matchCount,
    marks,
    // highlight 3 words in sentences in any order, e.g. 'word word2 word word3 word word1.'
    regex = /(?=[^.]*?(word1))(?=[^.]*?(word2))(?=[^.]*?(word3))/dgi;
    
instance.markRegExp(regex, {
    'acrossElements': true,
    'separateGroups': true,
    'wrapAllRanges': true,
    'each': (markElement, info) => {
        // info.count as a match identifier
        markElement.setAttribute('data-markjs', info.count);
    },
    'done': (totalMarks, totalMatches) => {
        marks = $('mark');
        matchCount = totalMatches;
    }
});

prevButton.click(function() {
    if (--currentIndex <= 0) currentIndex = 0;
    highlightMatchGroups();
});

nextButton.click(function() {
    if (++currentIndex > matchCount) currentIndex = matchCount;
    highlightMatchGroups();
});

function highlightMatchGroups() {
    marks.removeClass('current');
    const elems = marks.filter((i, elem) => $(elem).data('markjs') === currentIndex).addClass('current');
    elems.find('*[data-markjs]').addClass('current'); // add class to all descendant too
}
```
