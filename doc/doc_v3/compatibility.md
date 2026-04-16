
## Compatibility with version 2.x

##### The `combineBy` (old name `combinePatterns`) option become the default in the `mark()` API
The default number of this option also is increased from 10 to 100.  
If your code uses the `combinePatterns` option, it should work correctly with version 3.x, otherwise set the `combineBy: 1` option.

##### Removing the 'execution' object from the `filter ` and `each` callbacks` info object
This allow setting `info.abort = true; ` instead of `info.execution.abort = true;`.

##### Dropping support to highlight RegExp groups without the `d` flag
RegExp.prototype.hasIndices is well established and works across many browser versions.

##### The requirement for the `g` flag in the `markRegExp()` API
<details>
<summary>Details:</summary>
Prior to version 3, the RegExp <code>/(?<=word\s+)(?:\w+)?/g</code> failed to match <i>'match2'</i> in the string <i>'word match1 word $$$ word match2'</i> because of returning an empty match on <i>'word $$$'</i>.<br>
This causes breaking of the execution loop, as a result, there is no further matching.<br>
Fixing this bug brought requirement of the <code>g</code> flag for normal workflow.
</details>
For backward compatibility, a RegExp without <code>g</code> flag is recompiled internally.

##### Removing `cacheTextNodes` option
The performance gain with this option is relatively small, also the code is not covered necessary options.  
Plus, added support for the CSS Custom Highlight API.

##### Removing `offset` property from filter callback
I suspect it has very rare usage if any. If it's needed there is version 2.

