## Callbacks parameters
The parameters `filterInfo`, `matchInfo`, and `rangeInfo` objects are exposed useful internal information.  
It can help to solve many problems, which match harder to implement externally.

### The `mark()` method:
* The `filter` callback `filterInfo` object properties:
  `filter : (textNode, foundTerm, totalMarks, counter, filterInfo) => {}`
  * {array} `match` - The result of RegExp exec() method
  * {boolean} `matchStart` - indicate the start of a match  AE
  * {object} `execution` - The helper object for early abort. Contains boolean 'abort' property.
  * {number} `offset` - The absolute start index of a text node. Can be used to translate the local node indexes to the absolute ones.

* The `each` callback `matchInfo` object properties:
  `each : (node, matchInfo) => {}`
  * {array} `match` - The result of RegExp exec() method
  * {boolean} `matchStart` - Indicate the start of a match  AE
  * {number} `count` - The number of matches so far

* The `done` callback parameters:
  `done : (totalMarks, totalMatches, termStats) => {}`
  * {number} `totalMarks` - The total number of marked elements
  * {number} `totalMatches` - The exact number of total matches
  * {object} `termStats` - An object containing an individual term's matches count


### The `markRegExp()` method:
* The `filter` callback `filterInfo` object properties:
  `filter : (textNode, foundTerm, totalMarks, filterInfo) => {}`
  * {array} `match` - The result of RegExp exec() method
  * {boolean} `matchStart` - indicate the start of a match  AE
  * {number} `groupIndex` - The current group index SG
  * {object} `execution` - The helper object for early abort. Contains boolean 'abort' property.
  * {number} `offset` - The absolute start index of a text node. Can be used to translate the local node indexes to the absolute ones.

* The `each` callback `matchInfo` object properties:
  `each : (node, matchInfo) => {}`
  * {array} `match` - The result of RegExp exec() method
  * {boolean} `matchStart` - Indicate the start of a match  AE
  * {number} `count` - The number of matches so far
  * {number} `groupIndex` - The current index of match group  SG
  * {boolean} `groupStart` - Indicate the start of group  AE SG

* The `done` callback parameters:
  `done : (totalMarks, totalMatches) => {}`
  * {number} `totalMarks` - The total number of marked elements
  * {number} `totalMatches` - The exact number of total matches

### The `each` callback `rangeInfo` object properties of the `markRanges()` method:
`each : (node, range, rangeInfo) => {}`
* {boolean} `matchStart` - indicate the start of a range;
* {number} `count` - The number of wrapped ranges so far

### Available properties of the `filterInfo` object depending on options

|  method      |            options               |    match   |   matchStart   | groupIndex  |  execution  | offset |
|--------------|----------------------------------|------------|----------------|-------------|-------------|--------|
|  mark        |  acrossElements                  |     +      |      +         |     -       |     +       |   +    |
|  mark        |                                  |     +      |      -         |     -       |     +       |   +    |
|              |                                  |            |                |             |             |        |
|  markRegExp  |  acrossElements                  |     +      |      +         |     -       |     +       |   +    |
|  markRegExp  |  acrossElements, separateGroups  |     +      |      +         |     +       |     +       |   -    |
|  markRegExp  |  separateGroups                  |     +      |      +         |     +       |     +       |   +    |
|  markRegExp  |                                  |     +      |      -         |     -       |     +       |   -    |


### Available properties of the `matchInfo` object depending on options

|  method      |             options              |    match   |    matchStart   |  groupIndex  | groupStart | count |
|--------------|----------------------------------|------------|-----------------|--------------|------------|-------|
|  mark        |  acrossElements                  |     +      |      +          |     -        |     -      |   +   |
|  mark        |                                  |     +      |      -          |     -        |     -      |   +   |
|              |                                  |            |                 |              |            |   +   |
|  markRegExp  |  acrossElements                  |     +      |      +          |     -        |     -      |   +   |
|  markRegExp  |  acrossElements, separateGroups  |     +      |      +          |     +        |     +      |   +   |
|  markRegExp  |  separateGroups                  |     +      |      +          |     +        |     -      |   +   |
|  markRegExp  |                                  |     +      |      -          |     -        |     -      |   +   |
