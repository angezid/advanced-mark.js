
## Filtering matches

To filter RegExp capturing groups see: [Filtering capturing groups](separate-groups.md#filtering-capturing-groups).

#### To filter matches in the `mark()` method with the `acrossElements` option
See [mark() filter callback](mark-method.md#mark-filter)'s `info` object properties.
``` js
let count = 0;

instance.mark('AB', {
    'acrossElements': true,
    'filter': (nodeOrArray, term, matchesSoFar, termMatchesSoFar, info) => {
         // highlights only the first match
        info.execution.abort = true; return  true;

        // highlights the first 10 matches using internal counter
        if (matchesSoFar >= 10) { info.execution.abort = true; return  false; }
        // if (info.count >= 10) {..}

        // using external counter
        if (info.matchStart) {
            count++;
        }

        // skips between
        if (count > 10 && count < 20) { return  false; }

        // highlights between
        if (count <= 10) { return  false; }
        else if (count > 20) { info.execution.abort = true; return  false; }

        return  true;
    }
});
```

#### To filter matches in the `mark()` method without the `acrossElements` option
``` js
let count = 0;

instance.mark('AB', {
    'filter': (textNode, term, matchesSoFar, termMatchesSoFar, info) => {
        // the only difference is the external counter implementation
        count++;
    }
});
```

#### To filter matches in the `markRegExp()` method with the `acrossElements` option
See [markRegExp() filter callback](markRegExp-method.md#markRegExp-filter)'s `info` object properties.
``` js
let count = 0,
    reg = /.../gi;
// if you have access to the RegExp object, you can also used 'reg.lastIndex = Infinity;'
// instead of 'info.execution.abort = true;'
instance.markRegExp(reg, {
    'acrossElements': true,
    'filter': (nodeOrArray, matchString, matchesSoFar, info) => {
        // highlights only the first match
        info.execution.abort = true; return  true;

        // highlights the first 10 matches using internal counter
        if (matchesSoFar >= 10) { info.execution.abort = true; return  false; }
        // if (info.count >= 10) {..}

        // using external counter
        if (info.matchStart) {
            count++;
        }

        // skips between
        if (count > 10 && count < 20) { return  false; }

        // highlights between
        if (count <= 10) { return  false; }
        else if (count > 20) {
            info.execution.abort = true;
            return  false;
        }

        return  true;
    },
});
```

#### To filter matches in the `markRegExp()` method without the `acrossElements` option
``` js
let count = 0,
    reg = /.../gi;

instance.markRegExp(reg, {
    'filter': (textNode, matchString, matchesSoFar, info) => {
        // the only difference is the external counter implementation
        count++;
    }
});
```

#### To filter matches on `each` callback
This is applicable to the `mark()` and `markRegExp()` methods

``` js
instance.mark(str, {
    // 'acrossElements': true,
    'each': (markElement, info) => {
        // highlights only the first match
        info.execution.abort = true;

        // highlights the first 10 matches
        if (info.count >= 10) {
            info.execution.abort = true;
        }
    }
});
```
