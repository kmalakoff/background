var BGArrayIterator;
BGArrayIterator = (function() {
  function BGArrayIterator(array, batch_length) {
    this.array = array;
    this.batch_length = batch_length;
    BGASSERT(this.array && this.batch_length, "array and positive integer batch length required");
    this.array_length = this.array.length;
    this.reset();
    this.current_range = new BGRange();
  }
  BGArrayIterator.prototype.reset = function() {
    this.batch_index = 0;
    return this.batch_count = Math.floor(this.array_length / this.batch_length) + 1;
  };
  BGArrayIterator.prototype.isDone = function() {
    return this.batch_index >= this.batch_count;
  };
  BGArrayIterator.prototype.updateCurrentRange = function() {
    var excluded_boundary, index;
    index = (this.batch_index - 1) * this.batch_length;
    excluded_boundary = index + this.batch_length;
    if (excluded_boundary > this.array_length) {
      excluded_boundary = this.array_length;
    }
    return this.current_range.set(index, excluded_boundary);
  };
  BGArrayIterator.prototype.step = function() {
    if (this.isDone()) {
      return this.current_range.setIsDone();
    }
    this.batch_index++;
    return this.updateCurrentRange();
  };
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
    return this.isDone();
  };
  BGArrayIterator.prototype.nextByRange = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range, this.array);
    }
    return this.isDone();
  };
  return BGArrayIterator;
})();
if (typeof exports !== 'undefined') {
  exports.BGArrayIterator = BGArrayIterator;
}