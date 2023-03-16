
## Callbacks parameters
As the documentation is still in development state, there are links to the newly added pages for version 1:
* [mark method](doc/mark-method.md)
* [markRegExp method](doc/markRegExp-method.md)
* [markRanges method](doc/markRanges-method.md)
* [unmark method](doc/unmark-method.md)

The parameters `filterInfo`, `eachInfo`, and `rangeInfo` objects are exposed useful information that can simplify the code, help solve problems which are difficult or not possible to implement externally.

**Warning:** in `mark()` and `markRegExp()` methods, the `filter` callback parameters that count mark elements will be changed to count matches in version 2.  
Without `acrossElements` option, every mark element is a match - these parameters actually count matches.  
When `acrossElements: true` these parameters are practically useless - count matches is match more important.

### The `mark()` method:
* The `filter` callback:
  `filter : (textNode, term, totalMarksSoFar, termMarksSoFar, filterInfo) => {}`
  * {Text} `textNode` - The text node which includes the match or with `acrossElements` option can be part of the match
  * {string} `term` - The current term
  * {number} `totalMarksSoFar` - The number of all wrapped mark elements so far
  * {number} `termMarksSoFar` - The number of wrapped mark elements for the current term so far
  * {object} `filterInfo`:
    * {array} `match` - The result of RegExp exec() method
    * {boolean} `matchStart` - Indicate the start of a match  AE
    * {object} `execution` - The helper object for early abort:
      * {boolean} `abort` - When set to `true` it breaks method execution;
    * {number} `offset` - When 'acrossElements: false': the absolute start index of a text node in joined context.
      when 'acrossElements: true': the sum of lengths of separated spaces or boundary strings that were added to the composite string so far.

* The `each` callback:
  `each : (markElement, eachInfo) => {}`
  * {HTMLElement} `markElement` - The marked DOM element
  * {object} `eachInfo`:
    * {array} `match` - The result of RegExp exec() method
    * {boolean} `matchStart` - Indicate the start of a match  AE
    * {number} `count` - The number of matches so far

* The `done` callback parameters:
  `done : (totalMarks, totalMatches, termStats) => {}`
  * {number} `totalMarks` - The total number of marked elements
  * {number} `totalMatches` - The total number of matches
  * {object} `termStats` - An object containing an individual term's matches count


### The `markRegExp()` method:
* The `filter` callback:
  `filter : (textNode, matchString, totalMarksSoFar, filterInfo) => {}`
  * {Text} `textNode` - The text node which includes the match or with `acrossElements` option can be part of the match
  * {string} `matchString` - The matching string:
    1) without `ignoreGroups` and `separateGroups` options - the whole match
    2) with `ignoreGroups` option - the match[ignoreGroups+1] group matching string e.g. `/(-)(\w+)\s+/g`, `ignoreGroups : 1`, the matching string is content of the group 2
    3) with `separateGroups` option - the current group matching string
  * {number} `totalMarksSoFar` - The number of all wrapped mark elements so far
  * {object} `filterInfo`:
    * {array} `match` - The result of RegExp exec() method
    * {boolean} `matchStart` - Indicate the start of a match  AE
    * {number} `groupIndex` - The current group index  SG
    * {object} `execution` - The helper object for early abort:
      * {boolean} `abort` - When set to `true` it breaks method execution;
    * {number} `offset` - When 'acrossElements: false': the absolute start index of a text node in joined context.
      when 'acrossElements: true': the sum of lengths of separated spaces or boundary strings that were added to the composite string so far.

* The `each` callback:
  `each : (markElement, eachInfo) => {}`
  * {HTMLElement} `markElement` - The marked DOM element
  * {object} `eachInfo`:
    * {array} `match` - The result of RegExp exec() method
    * {boolean} `matchStart` - Indicate the start of a match  AE
    * {number} `count` - The number of matches so far
    * {number} `groupIndex` - The current index of match group  SG
    * {boolean} `groupStart` - Indicate the start of group  AE SG

* The `done` callback parameters:
  `done : (totalMarks, totalMatches) => {}`
  * {number} `totalMarks` - The total number of marked elements
  * {number} `totalMatches` - The total number of matches


### The `markRanges()` method:
* The `filter` callback:
  `filter : (textNode, range, matchString, index) => {}`
  * {Text} `textNode` - The text node which includes the range or is the part of the range
  * {object} `range` - The current range object
  * {string} `matchString` - The current range matching string
  * {number} `index` - The current range index

* The `each` callback:
  `each : (markElement, range, rangeInfo) => {}`
  * {HTMLElement} `markElement` - The marked DOM element
  * {object} `range` - The range object
  * {object} `rangeInfo`:
    * {boolean} `matchStart` - indicate the start of a range;
    * {number} `count` - The number of wrapped ranges so far

* The `done` callback parameters:
  `done : (totalMarks, totalRanges) => {}`
  * {number} `totalMarks` - The total number of marked elements
  * {number} `totalRanges` - The number of total ranges

### Available properties of the `filterInfo` object depending on options

|  method      |            options               |    match   |   matchStart   | groupIndex  |  execution  | offset |
|--------------|----------------------------------|------------|----------------|-------------|-------------|--------|
|  mark        |  acrossElements                  |     +      |      +         |     -       |     +       |   +    |
|  mark        |                                  |     +      |      -         |     -       |     +       |   +    |
|              |                                  |            |                |             |             |        |
|  markRegExp  |  acrossElements                  |     +      |      +         |     -       |     +       |   +    |
|  markRegExp  |  acrossElements, separateGroups  |     +      |      +         |     +       |     +       |   +    |
|  markRegExp  |  separateGroups                  |     +      |      +         |     +       |     +       |   +    |
|  markRegExp  |                                  |     +      |      -         |     -       |     +       |   +    |


### Available properties of the `eachInfo` object depending on options

|  method      |             options              |    match   |    matchStart   |  groupIndex  | groupStart | count |
|--------------|----------------------------------|------------|-----------------|--------------|------------|-------|
|  mark        |  acrossElements                  |     +      |      +          |     -        |     -      |   +   |
|  mark        |                                  |     +      |      -          |     -        |     -      |   +   |
|              |                                  |            |                 |              |            |   +   |
|  markRegExp  |  acrossElements                  |     +      |      +          |     -        |     -      |   +   |
|  markRegExp  |  acrossElements, separateGroups  |     +      |      +          |     +        |     +      |   +   |
|  markRegExp  |  separateGroups                  |     +      |      +          |     +        |     -      |   +   |
|  markRegExp  |                                  |     +      |      -          |     -        |     -      |   +   |

* AE across elements
* SG separate groups
