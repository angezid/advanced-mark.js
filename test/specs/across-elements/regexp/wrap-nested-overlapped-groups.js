
'use strict';
describe('markRegExp with separateGroups & wrapAllRanges option', () => {
  let $ctx,
    flags = 'dg',
    message = 'should mark capture groups inside positive ',
    // the RegExp patterns below create overlapping groups in the same match
    lookaround = '(?<=(a)\\w*)(?=\\w*(b))(?=\\w*(c))(?=\\w*(d))(?=\\w*(e))',
    lookahead = '\\b(?=\\w*(a))(?=\\w*(b))(?=\\w*(c))(?=\\w*(d))(?=\\w*(e))',
    lookbehind = '\\b(?:(?<=(a)\\w*)(?<=(b)\\w*)(?<=(c)\\w*)(?<=(d)\\w*))';

  beforeEach(() => {
    loadFixtures('across-elements/regexp/nested-overlapped-groups.html');
    $ctx = $('.overlapping-groups');
  });

  afterEach(() => {
    $ctx.unmark();
  });
  
  it(message + 'lookbehind assertion', done => {
    let groupCount = 0;
    new Mark($ctx[0]).markRegExp(new RegExp(lookbehind, flags), {
      'acrossElements' : true,
      'separateGroups' : true,
      'wrapAllRanges' : true,
      each : () => {
        groupCount++;
      },
      'done' : () => {
        expect(groupCount).toBe(24);
        done();
      }
    });
  });

  it(message + 'lookahead assertion', done => {
    let groupCount = 0;
    new Mark($ctx[0]).markRegExp(new RegExp(lookahead, flags), {
      'acrossElements' : true,
      'separateGroups' : true,
      'wrapAllRanges' : true,
      each : () => {
        groupCount++;
      },
      'done' : () => {
        expect(groupCount).toBe(30);
        done();
      }
    });
  });

  it(message + 'lookaround assertions', done => {
    let groupCount = 0;
    new Mark($ctx[0]).markRegExp(new RegExp(lookaround, flags), {
      'acrossElements' : true,
      'separateGroups' : true,
      'wrapAllRanges' : true,
      each : () => {
        groupCount++;
      },
      'done' : () => {
        expect(groupCount).toBe(10);
        done();
      }
    });
  });
});

