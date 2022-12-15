
## Marking separate groups

**Important:** in this implementation two branches of code process separate groups, which one, depending on the existence of `d` flag.
1. Primitive, base on `indexOf()`, only reliable with contiguous groups - unwanted group(s) can be easily filtered out.
2. Exact, but not all browsers currently supported group `indices`.

Case without `wrapAllRanges` option:
* They both have identical logic for nested groups - if a parent group has been marked, there is no way to mark nested groups.
  This means you can use a nested group(s) as auxiliary and don't care about filtering them.
Case `wrapAllRanges : true`:
* With `acrossElements` option, the primitive one wrap a whole match as a group 0 and then all groups that are child of match[0] as a nested (see [Example](#mark-nesting-groups)).
* The exact one wrap all nested groups - you need to filter nested an auxiliary group(s).

They have different parent groups logic:
* The exact one does allow using a parent group as an auxiliary - you need to filter out it in order to mark a nested group(s).
* The primitive one does not allow this - if a parent group has filtered out, a nested group(s) won't be marked.

To test the primitive branch compatibility, just add the `d` flag.

There is no strict requirement for the contiguity of capturing groups.
Compare:
> string - 'AAB xxx BCD xx BC', to mark groups AB and BC
> in /(AB)\b.+?\b(BC)/g the indexOf('BC', start) find first 'BC', which is correct
> in /(AB)\b(.+?)\b(BC)(?!D)/g the indexOf('BC', start) also find first 'BC', which is wrong, because of condition '(?!D)', so group 2 is required.

Warning: related using RegExp without the `d` flag:
* Do not add a capturing group(s) to lookbehind assertion `(?<=)`, there is no code which handles such cases.
* With `acrossElements` option, currently not possible to highlight a capturing group(s) inside a lookahead assertion (?=).

**See [Callbacks parameters](callbacks-parameters.md)** doc about `info` object properties used in `filter` and `each` callbacks.

### Filtering capturing groups (to filter matches see [Filtering matches](filtering-matches.md)):
``` js
instance.markRegExp(/(AB)\b(.+)\b(?<gr3>CD)?(.+)(EF)\b/gi, {
    // 'acrossElements' : true,
    'separateGroups' : true,
    filter : (node, match, totalMarks, info) => {
        // To filter any group use info.groupIndex - a current group index
        // Note: if a group lays across several elements, the index be the same while a group is wrapping
        if (info.groupIndex === 2 || info.groupIndex === 4) return false;

        // also can be used a group content
       // if (info.group === 'AB') return  false;

        // To filter a whole match on a group presence
        // Note: it iterates through all groups and only then returns
        if (info.match[3]) return true/false;

        // also can be used a named capturing group
        if (info.match.groups.gr3) return  true/false;

        return  true;
    },
});
```
### Example to mark separate groups with `acrossElements` option:
``` js
let groupCount = 0, gr1Count = 0, gr2Count = 0;

instance.markRegExp(/\b(AB)\b.+?\b(CD)\b/gi, {
    'acrossElements' : true,
    'separateGroups' : true,
    'each' : (elem, info) => {
        // info.count - matches count so far
        
        // if start of match group
        if (info.groupStart) {
            // all group count
            groupCount++;
            
            // info.groupIndex is the index of a current match group
            if (info.groupIndex === 1) {
                elem.className = 'group1-1';
                gr1Count++;

            } else if (info.groupIndex === 2) {
                elem.className = 'group2-1';
                gr2Count++;
            }
        }
    }
});
```
### Example to mark separate groups without `acrossElements` option:
``` js
let count = 0, gr1Count = 0;

instance.markRegExp(/\b(AB)\b.+?\b(CD)\b/gi, {
    'separateGroups' : true,
    'each' : (elem, info) => {
        // all group count
        count++;
        
        if (info.groupIndex === 1) {
            // an individual group count
            gr1Count++;
        }
    }
});
```
<h3 id="mark-nesting-groups">To mark nesting groups with `acrossElements` option and RegExp without `d` flag</h3>
It treats the whole match as a group 0, and all child groups, in this case 'group1, group2', as nested ones (it's an only way to wrap nested groups):
``` js
let regex = /...\b(group1)\b.+?\b(group2)\b.../gi;

instance.markRegExp(regex, {
    'acrossElements' : true,
    'separateGroups' : true,
    'wrapAllRanges' : true,
    'each' : (elem, info) => {
        if (info.groupIndex === 0) {
            elem.className = 'main-group';
        }
        if (info.groupIndex > 0) {
            elem.className = 'nested-group';
        }
    }
});
```

