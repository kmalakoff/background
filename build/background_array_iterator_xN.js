var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Background.ArrayIterator_xN = (function() {
  __extends(ArrayIterator_xN, Background._ArrayIterator);
  function ArrayIterator_xN(arrays, batch_length) {
    var array, array_combination_count, ranges, _i, _j, _len, _len2, _ref, _ref2;
    this.arrays = arrays;
    if (!this.arrays) {
      throw new Error("Background.ArrayIterator_xN: missing arrays");
    }
    array_combination_count = 1;
    _ref = this.arrays;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      array = _ref[_i];
      array_combination_count *= array.length;
    }
    this.reset();
    ranges = [];
    _ref2 = this.arrays;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      array = _ref2[_j];
      ranges.push(new Background.Range(0, array.length));
    }
    ArrayIterator_xN.__super__.constructor.call(this, batch_length, array_combination_count, new Background.Range_xN(ranges, batch_length));
  }
  ArrayIterator_xN.prototype.nextByItems = function(fn) {
    this.step();
    while (!this.current_range.isDone()) {
      fn(this.current_range.getItems(this.arrays), this.current_range, this.arrays);
      this.current_range.step();
    }
    return this.isDone();
  };
  ArrayIterator_xN.prototype.nextByCombinations = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range.getCombinations(this.arrays), this.current_range, this.array);
    }
    return this.isDone();
  };
  ArrayIterator_xN.prototype.nextByRange = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range, this.arrays);
    }
    return this.isDone();
  };
  return ArrayIterator_xN;
})();
if (typeof exports !== 'undefined') {
  exports.Background.ArrayIterator = Background.ArrayIterator;
}