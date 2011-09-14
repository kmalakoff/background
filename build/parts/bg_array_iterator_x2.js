var BGArrayIterator_x2;
BGArrayIterator_x2 = (function() {
  function BGArrayIterator_x2(array1, array2, batch_length) {
    this.array1 = array1;
    this.array2 = array2;
    this.batch_length = batch_length;
    BGASSERT(this.array1 && this.array2 && this.batch_length, "array and positive integer batch length required");
    this.array1_length = this.array1.length;
    this.array2_length = this.array2.length;
    this.array_combination_count = this.array1_length * this.array2_length;
    this.reset();
    this.current_range = new BGRange_x2(this.array2_length, this.batch_length);
  }
  BGArrayIterator_x2.prototype.reset = function() {
    this.batch_index = 0;
    return this.batch_count = Math.floor(this.array_combination_count / this.batch_length) + 1;
  };
  BGArrayIterator_x2.prototype.isDone = function() {
    return this.batch_index >= this.batch_count;
  };
  BGArrayIterator_x2.prototype.updateCurrentRange = function() {
    var excluded_boundary, excluded_boundary1, excluded_boundary2, index, index1, index2;
    index = (this.batch_index - 1) * this.batch_length;
    excluded_boundary = index + this.batch_length;
    if (excluded_boundary > this.array_combination_count) {
      excluded_boundary = this.array_combination_count;
    }
    if (index >= excluded_boundary) {
      return this.current_range.setIsDone();
    }
    index1 = Math.floor(index / this.array2_length);
    excluded_boundary1 = Math.floor(excluded_boundary / this.array2_length) + 1;
    index2 = index % this.array2_length;
    excluded_boundary2 = this.array2_length;
    this.current_range.set(excluded_boundary - index, new BGRange(index1, excluded_boundary1), new BGRange(index2, excluded_boundary2));
    return this.current_range;
  };
  BGArrayIterator_x2.prototype.step = function() {
    if (this.isDone()) {
      return this.current_range.setIsDone();
    }
    this.batch_index++;
    return this.updateCurrentRange();
  };
  BGArrayIterator_x2.prototype.nextByItems = function(fn) {
    this.step();
    while (!this.current_range.isDone()) {
      fn(this.array1[this.current_range.range1.index], this.array2[this.current_range.range2.index], this.current_range, this.array1, this.array2);
      this.current_range.step();
    }
    return this.isDone();
  };
  BGArrayIterator_x2.prototype.nextByRange = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range, this.array1, this.array2);
    }
    return this.isDone();
  };
  return BGArrayIterator_x2;
})();
if (typeof exports !== 'undefined') {
  exports.BGArrayIterator = BGArrayIterator;
}