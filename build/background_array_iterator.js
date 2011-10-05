var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Background.ArrayIterator = (function() {
  __extends(ArrayIterator, Background._ArrayIterator);
  function ArrayIterator(array, batch_length) {
    var excluded_boundary;
    this.array = array;
    if (!this.array) {
      throw new Error("Background.ArrayIterator: missing array");
    }
    this.reset();
    excluded_boundary = batch_length < this.array.length ? batch_length : (this.array.length ? this.array.length : 1);
    ArrayIterator.__super__.constructor.call(this, batch_length, this.array.length, new Background.Range(0, excluded_boundary));
  }
  ArrayIterator.prototype.nextByItem = function(fn) {
    this.step();
    while (!this.current_range.isDone()) {
      fn(this.current_range.getItem(this.array), this.current_range.index, this.array);
      this.current_range.step();
    }
    return this.isDone();
  };
  ArrayIterator.prototype.nextBySlice = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range.getSlice(this.array), this.current_range, this.array);
    }
    this.current_range._stepToEnd();
    return this.isDone();
  };
  ArrayIterator.prototype.nextByRange = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range, this.array);
    }
    return this.isDone();
  };
  return ArrayIterator;
})();
if (typeof exports !== 'undefined') {
  exports.Background.ArrayIterator = Background.ArrayIterator;
}