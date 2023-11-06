
## Code examples of using `each` and `done` callbacks
See [mark() each callback](mark-method.md#mark-each) about callback `info` object properties.

#### In `mark()` method with `acrossElements` option
``` js
let matchCount = 0;

instance.mark(['AB CD', 'EF'], {
    'acrossElements' : true,
    'each' : (markElement, info) => {
        // sets external counter
        matchCount = info.count;

        // internal use
        if (info.count ..) {}

        // if start of the match
        if(info.matchStart) {
            markElement.className = 'start-1';
            // markElement.setAttribute('data-markjs', 'start-1'); // to use the attribute instead of class

            // matchCount++; // to use the custom counter instead of info.count
        }
    },
    'done' : (totalMarks, totalMatches, termStats) => {
        for (const term in termStats) {
            console.log(term + ' = ' + termStats[term]);
        }
    }
});
```

#### In `mark()` method without `acrossElements` option
``` js
let matchCount = 0;

context.mark('AB CD EF', {
    'separateWordSearch' : true,
    'each' : (markElement, info) => {
        // for external counter
        matchCount = info.count; // also possible matchCount++;

        // for internal use
        if(info.count ..) {}
    },
    'done' : (totalMarks, totalMatches, termStats) => {
        console.log('Total matches = ' + totalMatches);

        for(var term in termStats) {
            console.log(term + ' = ' + termStats[term]);
        }
    }
});
```
#### In `markRegExp()` method with `acrossElements` option  
See [markRegExp() each callback](markRegExp-method.md#markRegExp-each) about callback `info` object properties.

``` js
let matchCount = 0;

instance.markRegExp(/.../gi, {
    'acrossElements' : true,
    'each' : (markElement, info) => {
        // usage of info.count and custom counter are the same
        // as in mark() method with `acrossElements` option

        // use of info.count as a unique match identifier
        markElement.setAttribute('data-markjs', info.count);
    },
    'done' : (totalMarks, totalMatches) => {
        console.log('Total matches = ' + totalMatches);
    }
});
```

#### Simple example with next/previous buttons
Unusable with `markRegExp()` method having `wrapAllRanges` option. See [Example with next/previous buttons](nesting-overlapping.md#simple-example-with-nextprevious-buttons) that can be used for this case.
``` js
let currentIndex = 0,
    marks = $('mark'),
    startElements = marks.filter((i, elem) => $(elem).hasClass('start-1'));
    //startElements = marks.filter((i, elem) => $(elem).data('markjs') === 'start-1');

prevButton.on('click', function() {
    if (--currentIndex <= 0) currentIndex = 0;

    let elem = startElements.eq(currentIndex);
    if (elem.length) highlightMatch(elem[0]);
});

nextButton.on('click', function() {
    if (++currentIndex >= startElements.length) currentIndex = startElements.length - 1;

    let elem = startElements.eq(currentIndex);
    if (elem.length) highlightMatch(elem[0]);
});

// adds class 'current' to all mark elements of the found match if it located across elements
// or to the first mark element
function highlightMatch(elem) {
    let found = false;
    marks.each((i, el) => {
        if ( !found) {
            if (el === elem[0]) found = true;

        // start of the next 'start element' means the end of the current match
        } else if ($(el).hasClass('start-1')) return  false;
        //} else if ($(el).data('markjs') === 'start-1') return  false;

        if (found){
            $(el).addClass('current');
            $(el).find('*[data-markjs]').addClass('current');  // add class to all descendant too
        }
    });
}
```