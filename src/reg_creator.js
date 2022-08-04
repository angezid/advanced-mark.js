import RegCreator from './lib/regexpcreator';

export default function RegExpCreator(options) {
  const instance = new RegCreator(options);
  this.create = (str, patterns) => {
    return instance.create(str, patterns);
  };
  this.createDiacritics = (str) => {
    return instance.createDiacriticsRegExp(str);
  };
}

/*export function create(options, str, patterns) {
    return new RegCreator(options).create(str, patterns);
}

export function createDiacritics(options, str) {
    return new RegCreator(options).createDiacriticsRegExp(str);
}*/