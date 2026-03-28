
## Compatibility with version 2

##### The requirement for `g` flag in `markRegExp()` API:
<details>
<summary>Details:</summary>
Prior to version 3, the RegExp <code>/(?<=word\s+)(?:\w+)?/g</code> failed to match <i>'match2'</i> in the string <i>'word match1 word $$$ word match2'</i> because of returning an empty match on <i>'word $$$'</i>.<br>
This causes breaking of the execution loop, as a result, there is no further matching.<br>
Fixing this bug brought requirement of the <code>g</code> flag for normal workflow.
</details>
For backward compatibility, a RegExp without <code>g</code> flag is recompiled internally.

##### Dropping support to highlight RegExp groups without the `d` flag:


##### Removing `cacheTextNodes` option:
Although in some cases this option increases performance, but not so radical as `combineBy` (old name `combinePatterns`) option.

##### Removing `offset` property from filter callback:
I suspect it has very rare usage if any. If it's needed there is version 2.

##### Adding support for CSS Custom Highlight API:

