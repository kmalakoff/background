var BGArrayIterator;
BGArrayIterator = (function() {
  function BGArrayIterator(array, batch_size) {
    this.batch_size = batch_size;
    this.array = array;
    this.batch_count = Math.floor(this.array.length / this.batch_size) + 1;
    this.batch_index = 0;
    this.array_index = 0;
  }
  BGArrayIterator.prototype.next_by_item = function(fn) {
    var current_batch_count;
    current_batch_count = this.array_index + this.batch_size;
    if (current_batch_count > this.array.length) {
      current_batch_count = this.array.length;
    }
    while (this.array_index < current_batch_count) {
      fn(this.array[this.array_index], this.array_index);
      this.array_index++;
    }
    this.batch_index++;
    return this.batch_index === this.batch_count;
  };
  BGArrayIterator.prototype.next_by_slice = function(fn) {
    var current_batch_count;
    current_batch_count = this.batch_size;
    if (this.array_index + current_batch_count > this.array.length) {
      current_batch_count = this.array.length - this.array_index;
    }
    if (current_batch_count === 0) {
      return true;
    }
    fn(this.array.slice(this.array_index, this.array_index + current_batch_count));
    this.array_index += current_batch_count;
    this.batch_index++;
    return this.batch_index === this.batch_count;
  };
  return BGArrayIterator;
})();
if (typeof exports !== 'undefined') {
  exports.BGArrayIterator = BGArrayIterator;
}