
## Compatibility

#### The requirement for `g` flag in `markRegExp()` API:
<details>
<summary>Details:</summary>
Prior to version 3 the RegExp `/(?<=word\s+)(?:\w+)?/g` fail to match 'match2' in the string `'word match1 word $$$ word match2'` because of returning empty match on `word $$$`.  
This causes breaking of execution loop, as a result there is no further matching.  
Fixing this bug brought requirement of the `g` flag for normal workflow.
</details>
For backward compatibility a RegExp without `g` flag is recompiled internally.

#### Removing ability to highlight RegExp groups without `d` flag:


#### Removing ability to highlight in nested iframes:
iframe inside another iframe is rare case.

#### Removing `cacheTextNodes` option:
although in some cases this option increase performance, but not so radical as `combineBy` (old name `combinePatterns`) option.

#### Removing `offset` property from filter callback:
i suspect it has very rare usage if any. If it's needed there is version 2.
