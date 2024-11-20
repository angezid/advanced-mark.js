'use strict';
describe('charSets option', () => {
  let $ctx, $ctx2;
  let quantifiers = ['se[a]?t', '[b]*eat', 'su[c]+ess', '[d]{3,}', 'g[e]*?t'],
    quantifiersObj = {
      'se[a]?t' : ['set',  'seat'],
      '[b]*eat' : ['beat',  'eat'],
      'su[c]+ess' : ['success',],
      '[d]{3,}' : ['ddd',  'dddd'],
      'g[e]*?t' : ['get',  'geet']
    },
    escapes = ['\\[[a]+', '\\[b]', '\\\\[c]+', '\\\\\\[d]', '\\\\\\\\[e]+'],
    escapeObj = {
      '\\[[a]+' : '[aaa',
      '\\[b]' : '[b]',
      '\\\\[c]+' : '\\ccc',
      '\\\\\\[d]' : '\\\\[d]',
      '\\\\\\\\[e]+' : '\\\\\\eee',
    };

  beforeEach(() => {
    loadFixtures('basic/char-sets.html');

    $ctx = $('.char-sets-escape');
    $ctx2 = $('.char-sets-quantifiers');
  });

  it('should mark charSets with quantifiers', done => {
    let curTerm = '';
    new Mark($ctx2[0]).mark(quantifiers, {
      'charSets' : true,
      filter: (nd, term) => {
        curTerm = term;
        return true;
      },
      each : elem => {
        expect(quantifiersObj[curTerm]).toContain(elem.textContent);
      },
      'done' : () => {
        expect($ctx2.find('mark').length).toBe(9);

        done();
      }
    });
  });

  it('should correctly handle escaped characters', done => {
    let curTerm = '';
    new Mark($ctx[0]).mark(escapes, {
      'charSets' : true,
      filter: (nd, term) => {
        curTerm = term;
        return true;
      },
      each : elem => {
        expect(elem.textContent).toBe(escapeObj[curTerm]);
      },
      'done' : () => {
        expect($ctx.find('mark').length).toBe(5);

        done();
      }
    });
  });
});
