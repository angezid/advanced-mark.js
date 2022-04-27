# mark.js

##### Highlight keywords using JavaScript. Intended for every use case. <br> Can e.g. be used to mark text in search results.

Description and how to use can be found here [![Radical changes of across elements pipeline](https://github.com/julmot/mark.js/pull/450)]

## Modules
\*. es6.\*.js - pure ES6 Modules
\*.umd.\*.js - UMD modules    // previously named as \*. es6.\*.js 

It was tested on Firefox and Chrome.

### Module examples
In the ModuleExamples folder, there are two simple examples.
To test them on a local machine:

copy jquery.mark.es6.js, mark.es6.js, and jquery.js to the ModuleExamples directory

npm install --global http-server

cd 'full path to ModuleExamples directory'    // change path

http-server  // launch server

visit http://localhost:8080

## Mark nesting and overlapping ranges and match groups
The `markRanges` method with `wrapAllRanges` option, can mark nesting/overlapping ranges.

The `markRegExp` method with RegExp having the `d` flag, with `separateGroups` and `wrapAllRanges` options can mark:
nesting groups, capturing groups inside positive lookaround assertions. It's practically removes all restrictions.  

The lookaround examples below demonstrate cases when `wrapAllRanges` option should be used:

* RegExp with lookaround assertions can create overlapping matches.  
  With capturing group inside assertion, there is a possibility that the first group from the next match cannot be wrapped because the group from the previous match is already wrapped in the next match area:  
  e.g. regex `/(?<=(gr1)\s+\w+\b).+?(gr2)/dg`,  string 'gr1 match1 gr1 gr2 match2 gr2'.  

* Another case: regex `/(?=\d*(1))(?=\d*(2))(?=\d*(3))/dg`, matches '123, 132, 213, 231, 312, 321'.  
  This is not an overlapping case, but groups are wrapped in any order. If group 1 is wrapped first, the 2 and 3 will be ignored in '231, 321' ...  

* Groups overlapping case: regex `/\w+(?=.*?(gr1 \w+))(?=.*?(\w+ gr2))/dg` , string 'example gr1 overlap gr2' - the gr1 will be wrapped, the gr2 will be ignored.

Note: the `wrapAllRanges` option can cause performance degradation if the context contains a very large number of text nodes and a large number of mark elements. 
This is because with each wrapping, two more objects are inserted into the array, which require a lot of copying, memory allocation ...

* The 8MB file containing 177000 text nodes, marked groups 2500:  
  with `wrapAllRanges` option - 0.65 sec.  
  without - 0.45 sec.

* The same file, marked groups 29000:  
  with `wrapAllRanges` option - 3.6 sec.  
  without - 0.7 sec.

Note: `wrapAllRanges` option with `d` flag will wrap all capturing groups regardless of nested level.  
Without this option - if the group has been wrapped, all nested groups will be ignored.

With `acrossElements` option the code is simple:
``` js
context.markRegExp(/.../dg, {
    'acrossElements' : true,
    'separateGroups' : true,
    'wrapAllRanges' : true,
});
```

To mark nesting groups with the `acrossElements` option and with RegExp not having the `d` flag,  
it treats the whole match as a group 0, and all child groups, in this case 'group1, group2', as nested groups:
``` js
let regex = /...\b(group1)\b.+?\b(group2)\b.../gi;

context.markRanges(regex, {
    'acrossElements' : true,
    'separateGroups' : true,
    'wrapAllRanges' : true,
    'each' : function(elem, info) {
        // if(info.groupIndex === 0) elem.className = 'main-group';
        if(info.groupIndex > 0) {
            elem.className = 'nested-group';
        }
    }
});
```

To mark nesting/overlapping groups without `acrossElements` option and with RegExp having the `d` flag, is only possible through this hack:
``` js
let regex = /.../dg;
let ranges = buildRanges(context, regex);

context.markRanges(ranges, {
  'wrapAllRanges' : true,
  'each' : function(node, range) {
    // handle the additional properties
    // node.setAttribute('data-markjs', range.id);
  }
});

function buildRanges(context, regex) {
  let ranges = [];
  // it should only build ranges - an attempt to mark any group can break regex normal workflow
  context.markRegExp(regex, {
    'separateGroups' : true,
    'filter' : function(node, group, totalMatch, info) {
      if(info.matchStart) {
        // 'i = 1' - skips match[0] group
        for(let i = 1; i < info.match.length; i++)  {
          if(info.match[i]) {
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

Simple example with next/previous buttons. It's uses numbers as unique match identifiers in continuous ascending order.
``` js
let currentIndex = 0,
    matchCount,
    marks,
    // highlight 3 words in sentences in any order
    regex = /(?=[^.]*?(word1))(?=[^.]*?(word2))(?=[^.]*?(word3))/dgi;
    
context.markRegExp(regex, {
    'acrossElements' : true,
    'separateGroups' : true,
    'wrapAllRanges' : true,
    'each' : function(elem, info) {
        // info.count as a match identifier
        elem.setAttribute('data-markjs', info.count);
    },
    'done' : function(totalMarks, totalMatches) {
        marks = $('mark');
        matchCount = totalMatches;
    }
});

prevButton.click(function() {
    if(--currentIndex <= 0) currentIndex = 0;
    highlightMatchGroups();
});

nextButton.click(function() {
    if(++currentIndex > matchCount) currentIndex = matchCount;
    highlightMatchGroups();
});

function highlightMatchGroups() {
    marks.removeClass('current');
    marks.filter((i, elem) => elem.getAttribute('data-markjs') == currentIndex).addClass('current');
}
```
