import RegCreator from './lib/regexpcreator';

export default function RegExpCreator(options) {
  const instance = new RegCreator(options);
  this.create = (str, patterns) => {
    return instance.create(str, patterns);
  };
  this.createCombinePattern = (array, capture) => {
    return instance.createCombinePattern(array, capture);
  };
  this.createDiacritics = (str) => {
    return instance.createDiacritics(str);
  };
}
