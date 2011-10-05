var BGRange;
BGRange = (function() {
  function BGRange(index, excluded_boundary) {
    this.index = index;
    this.excluded_boundary = excluded_boundary;
    if ((this.index === void 0) || !this.excluded_boundary) {
      throw new Error("BGRange: parameters invalid");
    }
    return this;
  }
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
  BGRange.prototype.getItem = function(array) {
    return array[this.index];
  };
  BGRange.prototype.getSlice = function(array) {
    return array.slice(this.index, this.excluded_boundary);
  };
  BGRange.prototype._setIsDone = function() {
    this.index = -1;
    this.excluded_boundary = -1;
    return this;
  };
  BGRange.prototype._addBatchLength = function(batch_length) {
    if (!batch_length) {
      throw new Error("BGRange._addBatchLength: batch_length invalid");
    }
    this.excluded_boundary += batch_length;
    return this;
  };
  BGRange.prototype.reset = function() {
    this.index = 0;
    return this;
  };
  BGRange.prototype._stepToEnd = function() {
    return this.index = this.excluded_boundary;
  };
  return BGRange;
})();
if (typeof exports !== 'undefined') {
  exports.BGRange = BGRange;
}