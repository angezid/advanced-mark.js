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
nesting groups, capture groups inside positive lookaround assertions. It's practically removes all restrictions. 

Note: the `wrapAllRanges` option can cause performance degradation, if the context contains a very large number of text nodes and a large number of mark elements. 
This is because each wrap element inserts two objects into the array, resulting in the creation of a new copy of the array.

The 8MB file containing 177000 text nodes, marked groups 2500:  
with `wrapAllRanges` option - 0.65 sec.  
without - 0.45 sec.

The same file, marked groups 29000:  
with `wrapAllRanges` option - 3.6 sec.  
without - 0.7 sec.

With `acrossElements` option the code simple:
``` js
context.markRegExp(/. . . /dg, {
    'acrossElements' : true,
    'separateGroups' : true,
    'wrapAllRanges' : true,
});
```

To mark nesting/overlapping groups without `acrossElements` option is only possible through this hack:
``` js
let regex = /. . . /dg;
let ranges = buildRanges(context, regex);

context.markRanges(ranges, {
  'wrapAllRanges' : true,
  'each' : function(node, range) {
    // process additional properties
    // node.setAttribute('data-markjs', range.id);
  }
});

function buildRanges(context, regex) {
  let ranges = [];
  // it should only build ranges - an attempt to mark any group can break
  // a regex normal workflow 
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
            // some additional properties e.g. color to highlight nested group,
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
    matchId = 0,
    matchCount,
    marks,
    // highlight 3 words in sentences in any order
    regex = /(?=[^.]*?(word1))(?=[^.]*?(word2))(?=[^.]*?(word3))/dgi;
    
context.markRegExp(regex, {
    'acrossElements' : true,
    'separateGroups' : true,
    'wrapAllRanges' : true,
    'filter' : function(node, group, totalMatch, info) {
        // filter out whole match on presence of some conditional group before incrementing matchId
        // if(match[num]) return false;
        if(info.matchStart) {
            matchId++;
        }
        return  true;
    },
    'each' : function(elem, info) {
        elem.setAttribute('data-markjs', matchId);
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
