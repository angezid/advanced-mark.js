
## Highlighting separate groups

**Important:** in this implementation, two branches of code process separate groups, which one, depending on the presence of the `d` flag.
1. Primitive, based on `indexOf()`, is only reliable with contiguous groups - unwanted group(s) can be easily filtered out.
2. Exact, but older browsers do not support group `indices`.

* Case without `wrapAllRanges` option:
* They both have identical logic for nested groups - if a parent group has been marked, all nested groups are ignored.
* Case `wrapAllRanges: true`:
* With `acrossElements` option, the primitive one wraps a whole match as a group 0 and then all groups that are children of match[0] as nested (see [Example](nesting-overlapping.md#mark-nesting-groups)).
* The exact one wraps all (parent and nested group(s)) - you need to filter out unwanted group(s).

They have different parent group logic:
* The exact one does allow using a parent group as an auxiliary - you need to filter out it in order to highlight a nested group(s).
* The primitive one does not allow this - if the parent group has filtered out, all nested groups are ignored.

To test the primitive branch compatibility, just add the `d` flag.

There is no strict requirement for the contiguity of capturing groups.  
Compare: string - 'AAB xxx BCD xx BC', to highlight groups AB and BC
  - in `/(AB)\b.+?\b(BC)/g` the indexOf('BC', start) find first 'BC', which is correct
  - in `/(AB)\b(.+?)\b(BC)(?!D)/g` the indexOf('BC', start) also find first 'BC', which is wrong, because of condition '(?!D)', so group 2 is required.

**Warning** related to using RegExp without the `d` flag:
1. Do not add a capturing group(s) to lookbehind assertion `(?<=)`, there is no code which handles such cases.
2. With `acrossElements` option, it is not possible to highlight a capturing group(s) inside a lookahead assertion `(?=)`.

See [markRegExp() method](markRegExp-method.md#markRegExp-filter) about `info` object properties used in `filter` and `each` callbacks.    
How to filter matches see [Filtering matches](filtering-matches.md).  
How to highlight nesting groups see [Nesting groups](nesting-overlapping.md).

#### Filtering capturing groups:
``` js
instance.markRegExp(/(AB)\b(.+)\b(?<gr3>CD)?(.+)(EF)\b/gi, {
    // 'acrossElements': true,
    'separateGroups': true,
    'filter': (textNode, matchString, matchesSoFar, info) => {
        // To filter any group use info.groupIndex - a current group index
        // Note: if a group lays across several elements, the index be the same while a group is wrapping
        if (info.groupIndex === 2 || info.groupIndex === 4) return false;

        // also can be used a group content
       // if (matchString === 'AB') return  false;

        // To filter a whole match on a group presence
        // Note: it iterates through all groups and only then returns
        if (info.match[3]) return true/false;
        // or
        // also can be used a named capturing group
        if (info.match.groups.gr3) return  true/false;

        return  true;
    },
});
```
#### Example to highlight separate groups with `acrossElements` option:
``` js
let groupCount = 0, gr1Count = 0, gr2Count = 0;

instance.markRegExp(/(AB)\b.+?\b(CD)/gi, {
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

instance.markRegExp(/(AB).+?(CD)/gi, {
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
