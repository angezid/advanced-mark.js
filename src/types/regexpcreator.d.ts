
// Type definitions for advanced-mark.js v1.1.0

declare namespace RegExpCreator {

  interface AccuracyObject {
    value: 'exactly' | 'complementary';
    limiters: string[];
  }

  interface RegExpCreatorOptions {
    accuracy?: 'partially' | 'exactly' | 'complementary' | AccuracyObject;
    diacritics?: boolean;
    synonyms?: { [index: string] : string };
    caseSensitive?: boolean;
    ignoreJoiners?: boolean;
    ignorePunctuation?: string[];
    wildcards?: 'disabled' | 'enabled' | 'withSpaces';
  }

  interface PatternObject {
    lookbehind: string;
    pattern: string;
    lookahead: string;
  }
}

declare class RegExpCreator {
  constructor(options?: RegExpCreator.RegExpCreatorOptions);

  /**
   * Creates a regular expression to match the specified search term considering the available option settings
   * @param str - The search term to be used
   * @param patterns - Whether to return an object with pattern parts or RegExp object
   */
  create(str: string, patterns: boolean): RegExp | RegExpCreator.PatternObject;

  /**
   * Creates a single combine pattern from the array of string considering the available option settings
   * @param array - The array of string
   * @param capture - Whether to wrap an individual pattern in a capturing or non-capturing group
   */
  createCombinePattern(array: ReadonlyArray<string>, capture: boolean): RegExpCreator.PatternObject | null;

  /**
   * Creates a diacritics pattern from a string
   * @param str - The string to be used
   */
  createDiacritics(str: string): string;
}

export = RegExpCreator;
