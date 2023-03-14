
## Filtering matches
See [Callbacks parameters](callbacks-parameters.md) doc about `filterInfo` object properties.

### To filter matches in the `markRegExp()` method
``` js
let count = 0, reg = /.../gi;
// if you have access to the RegExp object with 'acrossElements' option, you can
// also used `reg.lastIndex = Infinity;` instead of `filterInfo.execution.abort = true;`
instance.markRegExp(reg, {
    filter : (textNode, matchString, marksSoFar, filterInfo) => {
        // to mark only the first match
        filterInfo.execution.abort = true; return  true;

        // filter callback requires its own match counter
        if (filterInfo.matchStart) {
            count++;
        }
        // mark the first 10 matches.
        if (count > 10) {
            filterInfo.execution.abort = true;
            return  false;
        }

        // skip between
        if (count > 10 && count < 20) { return  false; }

        // mark between
        if (count <= 10) { return  false; }
        else if (count > 20) {
            filterInfo.execution.abort = true;
            return  false;
        }

        return  true;
    },
});

```
### Mark the first desired number of matches on `each` callback using `acrossElements` option.
It's much more limited than the `filter` callback.
``` js
let reg = /.../gi;

instance.markRegExp(reg, {
    'acrossElements' : true,
    'each' : (markElement, info) => {
        // to mark only the first match
        reg.lastIndex = Infinity;

        // first 10 matches
        if (info.count >= 10) {
            reg.lastIndex = Infinity;
        }
    }
});
```
### To filter matches in the `mark()` method with `acrossElements` option
``` js
let count = 0;

instance.mark('AB', {
    'acrossElements' : true,
    filter : (textNode, term, marksSoFar, termMarksSoFar, filterInfo) => {
         // to mark only the first match
        filterInfo.execution.abort = true; return  true;

        // filter callback requires its own match counter
        if (filterInfo.matchStart) {
            count++;
        }
        // mark the first 10 matches.
        if (count > 10) { filterInfo.execution.abort = true; return  false; }

        // skip between
        if (count > 10 && count < 20) { return  false; }

        // mark between
        if (count <= 10) { return  false; }
        else if (count > 20) { filterInfo.execution.abort = true; return  false; }

        return  true;
    }
});
```
### To filter matches in the `mark()` method without `acrossElements` option
``` js
let count = 0;

instance.mark('AB', {
    filter : (textNode, term, marksSoFar, termMarksSoFar, filterInfo) => {
        // the only difference is counter implementation
        count++;
    }
});
```
