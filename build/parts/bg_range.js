var BGRange;
BGRange = (function() {
  function BGRange(index, excluded_boundary) {
    this.index = index;
    this.excluded_boundary = excluded_boundary;
    BGASSERT((typeof this.index !== 'undefined') && this.excluded_boundary, "missing parameters");
    return this;
  }
  BGRange.prototype.clone = function() {
    return new BGRange(this.index, this.excluded_boundary);
  };
  BGRange.prototype.setIsDone = function() {
    this.index = -1;
    this.excluded_boundary = -1;
    return this;
  };
  BGRange.prototype.addBatchLength = function(batch_length) {
    BGASSERT(batch_length, "missing parameters");
    this.excluded_boundary += batch_length;
    return this;
  };
  BGRange.prototype.reset = function() {
    this.index = 0;
    return this;
  };
  BGRange.prototype.isDone = function() {
    return this.index >= this.excluded_boundary;
  };
  BGRange.prototype.step = function() {
    this.index++;
    if (this.index >= this.excluded_boundary) {
      return -1;
    } else {
      return this.index;
    }
  };
  BGRange.prototype.stepToEnd = function() {
    return this.index = this.excluded_boundary;
  };
  BGRange.prototype.sliceArray = function(array) {
    return array.slice(this.index, this.excluded_boundary);
  };
  BGRange.isARange = function(range) {
    return range && (typeof range === 'object') && ('constructor' in range) && ('name' in range.constructor) && (range.constructor.name === 'BGRange');
  };
  return BGRange;
})();
if (typeof exports !== 'undefined') {
  exports.BGRange = BGRange;
}