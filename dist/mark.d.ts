
// Type definitions for advanced-mark.js v2.7.0
// Based on "https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/mark.js"

declare namespace Mark {

  interface BoundaryObject {
    tags?: string[];
    extend?: boolean;
    char?: string;
  }

  interface ShadowObject {
    style: string;
  }

  interface ExecutionObject {
    abort: boolean;
  }

  interface AccuracyObject {
    value: 'exactly' | 'startsWith' | 'complementary';
    limiters: string | string[];
  }

  interface MarkOptions {
    element?: string;
    window?: Window;
    className?: string;
    exclude?: string | string[];
    separateWordSearch?: boolean | 'preserveTerms';
    acrossElements?: boolean;
    accuracy?: 'partially' | 'exactly' | 'startsWith' | 'complementary' | AccuracyObject;
    diacritics?: boolean;
    synonyms?: { [index: string] : string | string[] };
    caseSensitive?: boolean;
    ignoreJoiners?: boolean;
    ignorePunctuation?: string | string[];
    wildcards?: 'disabled' | 'enabled' | 'withSpaces';
    iframes?: boolean;
    iframesTimeout?: number;

    combinePatterns?: boolean;
    cacheTextNodes?: boolean;
    blockElementsBoundary?: boolean | BoundaryObject;
    shadowDOM?: boolean | ShadowObject;

    filter?(
      textNode: Text, term: string, totalMatchesSoFar: number, termMatchesSoFar: number, filterInfo: MarkFilterInfo
    ) : boolean;
    each?(element: Element, eachInfo: MarkEachInfo) : void;
    done?(totalMarks: number, totalMatches: number, termStats: TermStats) : void;

    noMatch?(term: string | string[]) : void;
    debug?: boolean;
    log?: object;
  }

  interface MarkFilterInfo {
    match: RegExpExecArray;
    matchStart: boolean;
    execution: ExecutionObject;
    offset: number;
  }

  interface MarkEachInfo {
    match: RegExpExecArray;
    matchStart: boolean;
    count: number;
  }

  interface TermStats {
    [index: string] : number;
  }

  interface RegExpOptions {
    element?: string;
    className?: string;
    exclude?: string | string[];
    acrossElements?: boolean;
    ignoreGroups?: number;
    iframes?: boolean;
    iframesTimeout?: number;

    separateGroups?: boolean;
    wrapAllRanges?: boolean;
    blockElementsBoundary?: boolean | BoundaryObject;
    shadowDOM?: boolean | ShadowObject;

    filter?(textNode: Text, regexp: string, matchesSoFar: number, filterInfo: RegExpFilterInfo) : boolean;
    each?(element: Element, eachInfo: RegExpEachInfo) : void;
    done?(totalMarks: number, totalMatches: number) : void;

    noMatch?(regexp: string) : void;
    debug?: boolean;
    log?: object;
  }

  interface RegExpFilterInfo {
    match: RegExpExecArray;
    matchStart: boolean;
    execution: ExecutionObject;
    groupIndex?: number;
    offset?: number;
  }

  interface RegExpEachInfo {
    match: RegExpExecArray;
    matchStart: boolean;
    count: number;
    groupIndex?: number;
    groupStart?: boolean;
  }

  interface RangesOptions {
    element?: string;
    className?: string;
    exclude?: string | string[];
    iframes?: boolean;
    iframesTimeout?: number;

    wrapAllRanges?: boolean;
    markLines?: boolean;
    shadowDOM?: boolean | ShadowObject;

    filter?(textNode: Text, range: Range, matchingString: string, currentIndex: number) : boolean;
    each?(element: Element, range: Range, eachInfo: RangeEachInfo) : void;
    done?(totalMarks: number, totalRanges: number) : void;

    noMatch?(range: string) : void;
    debug?: boolean;
    log?: object;
  }

  interface Range {
    start: number;
    length: number;
  }

  interface RangeEachInfo {
    matchStart: boolean;
    count: number;
  }

  interface UnmarkOptions {
    element?: string;
    className?: string;
    exclude?: string | string[];
    iframes?: boolean;
    iframesTimeout?: number;
    shadowDOM?: boolean;

    done?() : void;
    debug?: boolean;
    log?: object;
  }
}

declare class Mark {
  constructor(context: string | HTMLElement | ReadonlyArray<HTMLElement> | NodeList | null);

  /**
  * Highlights the specified search terms.
  * @param term The string to be marked. Can also be an array with multiple strings.
  * Note that keywords will be escaped. If you need to mark unescaped keywords (e.g. containing a pattern),
  * have a look at the `markRegExp()`
  * @param options Optional options
  */
  mark(term: string | ReadonlyArray<string>, options?: Mark.MarkOptions) : void;

  /**
  * Highlights a custom regular expression.
  * @param regexp The regular expression to be marked. Example: /Lor[^]?m/gmi.
  * Note that the `g` flag must be present when `acrossElements : true`, otherwise the RegExp is recompiled.
  * @param options Optional options
  */
  markRegExp(regexp: RegExp, options?: Mark.RegExpOptions) : void;

  /**
  * A method to mark ranges with a start position and length. They will be applied
  * to text nodes in the specified context.
  * @param ranges An array of objects with a start and length property.
  * Note that the start positions must be specified including whitespace characters.
  * @param options Optional options
  */
  markRanges(ranges: ReadonlyArray<Mark.Range>, options?: Mark.RangesOptions) : void;

  /**
  * A method to remove mark elements created by mark.js and normalize text nodes.
  * @param options Optional options
  */
  unmark(options?: Mark.UnmarkOptions) : void;
}

export = Mark;
