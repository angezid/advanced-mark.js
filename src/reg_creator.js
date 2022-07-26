import RegCreator from './lib/regexpcreator';

export default function RegExpCreator(options) {
  const instance = new RegCreator(options);
  this.create = (str, parts) => {
    return instance.create(str, parts);
  };
}
