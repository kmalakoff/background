var BGArrayIterator_xN;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
BGArrayIterator_xN = (function() {
  __extends(BGArrayIterator_xN, _BGArrayIterator);
  function BGArrayIterator_xN(arrays, batch_length) {
    var array, array_combination_count, ranges, _i, _j, _len, _len2, _ref, _ref2;
    this.arrays = arrays;
    BGASSERT(this.arrays, "arrays required");
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
      ranges.push(new BGRange(0, array.length));
    }
    BGArrayIterator_xN.__super__.constructor.call(this, batch_length, array_combination_count, new BGRange_xN(ranges, batch_length));
  }
  BGArrayIterator_xN.prototype.nextByItems = function(fn) {
    var array, index, items, _ref;
    this.step();
    while (!this.current_range.isDone()) {
      items = [];
      _ref = this.arrays;
      for (index in _ref) {
        array = _ref[index];
        items.push(array[this.current_range.ranges[index].index]);
      }
      fn(items, this.current_range, this.arrays);
      this.current_range.step();
    }
    return this.isDone();
  };
  BGArrayIterator_xN.prototype.nextByRange = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range.clone(), this.arrays);
    }
    this.current_range.stepToEnd();
    return this.isDone();
  };
  return BGArrayIterator_xN;
})();
if (typeof exports !== 'undefined') {
  exports.BGArrayIterator = BGArrayIterator;
}