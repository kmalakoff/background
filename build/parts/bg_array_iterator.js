var BGArrayIterator;
BGArrayIterator = (function() {
  function BGArrayIterator(array, batch_length) {
    this.batch_length = batch_length;
    BGASSERT(this.array && this.batch_length, "array and positive integer batch length required");
    this.array = array;
    this.array_length = this.array.length;
    this.batch_index = 0;
    this.batch_count = Math.floor(this.array_length / this.batch_length) + 1;
  }
  BGArrayIterator.prototype.isDone = function() {
    return this.batch_index >= this.batch_count;
  };
  BGArrayIterator.prototype.getCurrentRange = function() {
    var range;
    range = {
      index: (this.batch_index - 1) * this.batch_length
    };
    range.excluded_boundary = range.index + this.batch_length;
    if (range.excluded_boundary > this.array_length) {
      range.excluded_boundary = this.array_length;
    }
    return range;
  };
  BGArrayIterator.prototype.step = function() {
    if (this.isDone()) {
      return {
        index: this.array_length,
        excluded_boundary: this.array_length
      };
    }
    this.batch_index++;
    return this.getCurrentRange();
  };
  BGArrayIterator.prototype.nextByItem = function(fn) {
    var range;
    range = this.step();
    while (range.index < range.excluded_boundary) {
      fn(this.array[range.index], range.index, this.array);
      range.index++;
    }
    return this.isDone();
  };
  BGArrayIterator.prototype.nextBySlice = function(fn) {
    var range;
    range = this.step();
    if (range.index < range.excluded_boundary) {
      fn(this.array.slice(range.index, range.excluded_boundary), range, this.array);
    }
    return this.isDone();
  };
  BGArrayIterator.prototype.nextByRange = function(fn) {
    var range;
    range = this.step();
    if (range.index < range.excluded_boundary) {
      fn(range, this.array);
    }
    return this.isDone();
  };
  return BGArrayIterator;
})();
if (typeof exports !== 'undefined') {
  exports.BGArrayIterator = BGArrayIterator;
}