## Callbacks parameters
The parameters `filterInfo`, `eachInfo`, and `rangeInfo` objects are expose useful information that can simplify the code, help solve problems which are difficult or not possible to implement externally.

### The `mark()` method:
* The `filter` callback `filterInfo` object properties:
  `filter : (textNode, term, marksSoFar, termMarksSoFar, filterInfo) => {}`
  * {array} `match` - The result of RegExp exec() method
  * {boolean} `matchStart` - indicate the start of a match  AE
  * {object} `execution` - The helper object for early abort. Contains boolean 'abort' property.
  * {number} `offset` - The absolute start index of a text node. Can be used to translate the local node indexes to the absolute ones.

* The `each` callback `eachInfo` object properties:
  `each : (markElement, eachInfo) => {}`
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
  `filter : (textNode, term, marksSoFar, filterInfo) => {}`
  * {array} `match` - The result of RegExp exec() method
  * {boolean} `matchStart` - indicate the start of a match  AE
  * {number} `groupIndex` - The current group index  SG
  * {object} `execution` - The helper object for early abort. Contains boolean 'abort' property.
  * {number} `offset` - The absolute start index of a text node. Can be used to translate the local node indexes to the absolute ones.

* The `each` callback `eachInfo` object properties:
  `each : (markElement, eachInfo) => {}`
  * {array} `match` - The result of RegExp exec() method
  * {boolean} `matchStart` - Indicate the start of a match  AE
  * {number} `count` - The number of matches so far
  * {number} `groupIndex` - The current index of match group  SG
  * {boolean} `groupStart` - Indicate the start of group  AE SG

* The `done` callback parameters:
  `done : (totalMarks, totalMatches) => {}`
  * {number} `totalMarks` - The total number of marked elements
  * {number} `totalMatches` - The exact number of total matches

### The `markRanges()` method:
* The `each` callback `rangeInfo` object properties:
  `each : (markElement, range, rangeInfo) => {}`
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
|  markRegExp  |  acrossElements, separateGroups  |     +      |      +         |     +       |     +       |   -    |
|  markRegExp  |  separateGroups                  |     +      |      +         |     +       |     +       |   +    |
|  markRegExp  |                                  |     +      |      -         |     -       |     +       |   -    |


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
