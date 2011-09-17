var BGArrayIterator;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
BGArrayIterator = (function() {
  __extends(BGArrayIterator, _BGArrayIterator);
  function BGArrayIterator(array, batch_length) {
    this.array = array;
    BGASSERT(this.array, "array required");
    this.reset();
    BGArrayIterator.__super__.constructor.call(this, batch_length, this.array.length, new BGRange(0, batch_length));
  }
  BGArrayIterator.prototype.nextByItem = function(fn) {
    this.step();
    while (!this.current_range.isDone()) {
      fn(this.array[this.current_range.index], this.current_range.index, this.array);
      this.current_range.step();
    }
    return this.isDone();
  };
  BGArrayIterator.prototype.nextBySlice = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range.sliceArray(this.array), this.current_range, this.array);
    }
    this.current_range.stepToEnd();
    return this.isDone();
  };
  BGArrayIterator.prototype.nextByRange = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range.clone(), this.array);
    }
    this.current_range.stepToEnd();
    return this.isDone();
  };
  return BGArrayIterator;
})();
if (typeof exports !== 'undefined') {
  exports.BGArrayIterator = BGArrayIterator;
}