import Mark from './lib/mark';
import './jquery.js';

$.fn.mark = function(sv, opt) {
  new Mark(this.get()).mark(sv, opt);
  return this;
};
$.fn.markRegExp = function(regexp, opt) {
  new Mark(this.get()).markRegExp(regexp, opt);
  return this;
};
$.fn.markRanges = function(ranges, opt) {
  new Mark(this.get()).markRanges(ranges, opt);
  return this;
};
$.fn.markObjects = function(sv, opt, index) {
  new Mark(this.get()).markObjects(sv, opt, index);
  return this;
};
$.fn.unmark = function(opt) {
  new Mark(this.get()).unmark(opt);
  return this;
};
$.fn.getVersion = function() {
  return new Mark(this.get()).version;
};

export default $;