
## Code examples

### The `mark()` method code example with `acrossElements` option 
``` js
let matchCount = 0;

context.mark(['AB CD', 'EF'], {
    'separateWordSearch' : true,
    'acrossElements' : true,
    'each' : (elem, info) => {
        // for external counter 
        matchCount = info.count;
    
        // internal use
        if (info.count ..) {}
    },
    'done' : (totalMarks, totalMatches, termStats) => {
        for (const term in termStats) {
            console.log(term + ' = ' + termStats[term]);
        }
    }
});
```

Simple example with next/previous buttons. Unusable with `markRegExp()` method having `wrapAllRanges` option.
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
        } else if ($(this).hasClass('start-1')) return  false;
        //} else if ($(this).data('markjs') === 'start-1') return  false;

        if (found){
            $(this).addClass('current');
			$(this).find('*[data-markjs]').addClass('current');  // add class to all descendant too
        }
    });
}
```