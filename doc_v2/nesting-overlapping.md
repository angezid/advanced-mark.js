
## Nesting/overlapping ranges and match groups

The `markRanges()` method with `wrapAllRanges` option, can mark nesting/overlapping ranges. With this option, all ranges that have indexes within 0 and context length be wrapped.  

The `markRegExp()` method with RegExp having the `d` flag, with `separateGroups` and `wrapAllRanges` options can mark:
nesting groups, capturing groups inside positive lookaround assertions. It practically removes all restrictions.  

The lookaround examples demonstrate cases when `wrapAllRanges` option should be used, otherwise they won't be correctly highlighted:

* RegExp with lookaround assertions can create overlapping matches.  
  e.g. regex `/(?<=(gr1)\s+\w+\b).+?(gr2)/dg`,  string 'gr1 match1 gr1 gr2 match2 gr2'.  
  The gr1 from the second match not wrapped because the gr2 from the first match is already wrapped.

* Another case: regex `/(?=\d*(1))(?=\d*(2))(?=\d*(3))/dg`, matches '123, 132, 213, 231, 312, 321'.  
  This is not an overlapping case, but groups are wrapped in any order. If group 1 is wrapped first, the 2 and 3 are ignored in '231, 321' ...  

* Groups overlapping case: regex `/\w+(?=.*?(gr1 \w+))(?=.*?(\w+ gr2))/dg` , string 'word gr1 overlap gr2' - the gr1 is wrapped, the gr2 is ignored.

Note: the `wrapAllRanges` option can cause performance degradation if the context contains a very large number of text nodes and mark elements. 
This is because with each wrapping, two more objects are inserted into the array, which require a lot of copying, memory allocation ...

The 8MB file containing 177000 text nodes:

|         option         |  marked groups 2500  |  marked groups 29000  |
|------------------------|----------------------|-----------------------|
| wrapAllRanges: true    |       0.7 sec.       |      2.9 sec.         |
| wrapAllRanges: false   |       0.65 sec.      |      0.7 sec.         |

The 1MB file containing 20800 text nodes:

|         option         |  marked groups 2500  |  marked groups 29000  |
|------------------------|----------------------|-----------------------|
| wrapAllRanges: true    |       120 ms.        |      710 ms.          |
| wrapAllRanges: false   |       70 ms.         |      310 ms.          |

Note: `wrapAllRanges` option with `d` flag wraps all capturing groups regardless of nested level. You need to filter out unwanted groups.  
Without this option - if a group has been wrapped, all nested groups are ignored.

#### To mark nesting/overlapping ranges.
``` js
const ranges = [{ start: 0, length: 50 }, { start: 10, length: 20, nested: true }, ..];

instance.markRanges(ranges, {
  'wrapAllRanges' : true,
  'each' : (markElement, range) => {
    // to distinguish ranges you can add some property to ranges
    if (range.nested) {
      markElement.className = 'nested';
    }
  }
});
```

#### To mark nesting groups with `acrossElements` option and `d` flag.
``` js
instance.markRegExp(/\w+\s((nested group)\s+\w+)/dg, {
    'acrossElements' : true,
    'separateGroups' : true,
    'wrapAllRanges' : true,
    'each' : (markElement, info) => {
      if (info.groupIndex === 2) {
          markElement.className = 'nested';
      }
    }
});
```

<h4 id="mark-nesting-groups">To mark nesting groups with <code>acrossElements</code> option and RegExp without <code>d</code> flag</h4>
It treats the whole match as a group 0, and all child groups, in this case 'group1, group2', as nested ones.  
It's an only way to wrap nested groups without `d` flag:

``` js
let regex = /\w+\s(group1).+?(group2).*/gi;

instance.markRegExp(regex, {
    'acrossElements' : true,
    'separateGroups' : true,
    'wrapAllRanges' : true,
    'each' : (markElement, info) => {
        if (info.groupIndex === 0) {
            markElement.className = 'main-group';
        }
        if (info.groupIndex > 0) {
            markElement.className = 'nested-group';
        }
    }
});
```

#### Simple example with next/previous buttons.

It uses numbers as unique match identifiers in continuous ascending order.
The code example [with next/previous buttons](some-examples.md#simple-example-with-nextprevious-buttons) which uses 'start elements' doesn't work correctly with nesting/overlapping matches.

``` js
let currentIndex = 0,
    matchCount,
    marks,
    // highlight 3 words in sentences in any order, e.g. 'word word2 word word3 word word1.'
    regex = /(?=[^.]*?(word1))(?=[^.]*?(word2))(?=[^.]*?(word3))/dgi;
    
instance.markRegExp(regex, {
    'acrossElements' : true,
    'separateGroups' : true,
    'wrapAllRanges' : true,
    'each' : (markElement, info) => {
        // info.count as a match identifier
        markElement.setAttribute('data-markjs', info.count);
    },
    'done' : (totalMarks, totalMatches) => {
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
