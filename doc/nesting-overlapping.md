
## Marking nesting and overlapping ranges and match groups

The `markRanges()` method with `wrapAllRanges` option, can mark nesting/overlapping ranges.

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
|          tested               |  marked groups 2500  |  marked groups 29000  |
|-------------------------------|----------------------|-----------------------|
|  with `wrapAllRanges` option  |       0.7 sec.       |      2.9 sec.         |
|  without                      |       0.65 sec.      |      0.7 sec.         |

The 1MB file containing 20800 text nodes:
|          tested               |  marked groups 2500  |  marked groups 29000  |
|-------------------------------|----------------------|-----------------------|
|  with `wrapAllRanges` option  |       120 ms.        |      710 ms.          |
|  without                      |       70 ms.         |      310 ms.          |

Note: `wrapAllRanges` option with `d` flag wrap all capturing groups regardless of nested level.  
Without this option - if the group has been wrapped, all nested groups are ignored.

With `acrossElements` option the code is simple:
``` js
instance.markRegExp(/.../dg, {
    'acrossElements' : true,
    'separateGroups' : true,
    'wrapAllRanges' : true,
});
```

### To mark nesting/overlapping groups without `acrossElements` option and with RegExp having the `d` flag, is only possible through this hack:
``` js
let regex = /.../dg;
let ranges = buildRanges(instance, regex);

instance.markRanges(ranges, {
  'wrapAllRanges' : true,
  'each' : (node, range) => {
    // handle the additional properties
    // node.setAttribute('data-markjs', range.id);
  }
});

function buildRanges(instance, regex) {
  let ranges = [];
  // it should only build ranges - an attempt to mark any group can break regex normal workflow
  instance.markRegExp(regex, {
    'separateGroups' : true,
    'filter' : (node, group, totalMatch, info) => {
      if (info.matchStart) {
        // 'i = 1' - skips match[0] group
        for (let i = 1; i < info.match.length; i++)  {
          if (info.match[i]) {
            let indices = info.match.indices[i];
            // info.offset is added to translate the local group index to the absolute one
            let range = {
              start : info.offset + indices[0],
              length : indices[1] - indices[0]
            };
            // some additional properties e.g. class/color to highlight nested group,
            // match identifer to highlight all match groups with next/previous buttons ...
            // can be added here to the range object
            ranges.push(range);
          }
        }
      }
      return false;
    }
  });
  return  ranges;
}
```

### Simple example with next/previous buttons. It uses numbers as unique match identifiers in continuous ascending order.
The code example with next/previous buttons which uses 'start elements' doesn't work correctly with nesting/overlapping matches.
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
    'each' : (elem, info) => {
        // info.count as a match identifier
        elem.setAttribute('data-markjs', info.count);
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
