var BGArrayIterator;
BGArrayIterator = (function() {
  function BGArrayIterator(array, batch_length) {
    this.batch_length = batch_length;
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
    range.length = (range.index + this.batch_length) > this.array_length ? this.array_length - range.index : this.batch_length;
    return range;
  };
  BGArrayIterator.prototype.step = function() {
    if (this.isDone()) {
      return {
        index: this.array_length,
        length: 0
      };
    }
    this.batch_index++;
    return this.getCurrentRange();
  };
  BGArrayIterator.prototype.nextByItem = function(fn) {
    var index_bound, range;
    range = this.step();
    if (range.length === 0) {
      return true;
    }
    index_bound = range.index + range.length;
    while (range.index < index_bound) {
      fn(this.array[range.index], range.index, this.array);
      range.index++;
    }
    return index_bound >= this.array_length;
  };
  BGArrayIterator.prototype.nextBySlice = function(fn) {
    var index_bound, range;
    range = this.step();
    if (range.length === 0) {
      return true;
    }
    index_bound = range.index + range.length;
    fn(this.array.slice(range.index, index_bound), range, this.array);
    return index_bound >= this.array_length;
  };
  BGArrayIterator.prototype.nextByRange = function(fn) {
    var index_bound, range;
    range = this.step();
    if (range.length === 0) {
      return true;
    }
    index_bound = range.index + range.length;
    fn(range, this.array);
    return index_bound >= this.array_length;
  };
  return BGArrayIterator;
})();
if (typeof exports !== 'undefined') {
  exports.BGArrayIterator = BGArrayIterator;
}