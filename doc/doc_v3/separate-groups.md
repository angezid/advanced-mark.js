
## Highlighting separate groups

**Important:** this version supports only the RegExp with the `d` flag.

The group's highlighting logic:
* Case without `wrapAllRanges` option:
  * If the parent group has been marked, all nested groups are ignored.  
    If the parent group is used as an auxiliary, you need to filter it out in order to highlight a nested group(s).
* Case `wrapAllRanges: true`:
  * All groups (parent and nested group(s)) are highlighted - you need to filter out unwanted group(s).

See [markRegExp() method](markRegExp-method.md#markRegExp-filter) about `info` object properties used in `filter` and `each` callbacks.    
How to filter matches see [Filtering matches](filtering-matches.md).  
How to highlight nesting groups see [Nesting groups](nesting-overlapping.md).

#### Filtering capturing groups:
``` js
instance.markRegExp(/(AB)\b.+\b(?<gr2>CD)?.+(EF)\b/dgi, {
    // 'acrossElements': true,
    'separateGroups': true,
    'filter': (textNode, matchString, matchesSoFar, info) => {
        // To filter any group use info.groupIndex - a current group index
        // Note: if a group lays across several elements, the index be the same while a group is wrapping
        if (info.groupIndex === 1) return false;

        // also can be used a group content
       // if (matchString === 'AB') return  false;

        // To filter a whole match on a group presence
        // Note: it iterates through all groups and only then returns
        if (info.match[2]) return true/false;
        // or
        // also can be used a named capturing group
        if (info.match.groups.gr2) return  true/false;

        return  true;
    },
});
```
#### Example to highlight separate groups with `acrossElements` option:
``` js
let groupCount = 0, gr1Count = 0, gr2Count = 0;

instance.markRegExp(/(AB)\b.+?\b(CD)/dgi, {
    'acrossElements': true,
    'separateGroups': true,
    'each': (markElement, info) => {
        // info.count - matches count so far
        
        // if start of match group
        if (info.groupStart) {
            // all group count
            groupCount++;
            
            // info.groupIndex is the index of a current match group
            if (info.groupIndex === 1) {
                markElement.className = 'group1-1';
                gr1Count++;

            } else if (info.groupIndex === 2) {
                markElement.className = 'group2-1';
                gr2Count++;
            }
        }
    }
});
```
#### Example to highlight separate groups without `acrossElements` option:
``` js
let count = 0, gr1Count = 0;

instance.markRegExp(/(AB).+?(CD)/dgi, {
    'separateGroups': true,
    'each': (markElement, info) => {
        // all group count
        count++;
        
        if (info.groupIndex === 1) {
            // an individual group count
            gr1Count++;
        }
    }
});
```
