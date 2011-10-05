Background.Range = (function() {
  function Range(index, excluded_boundary) {
    this.index = index;
    this.excluded_boundary = excluded_boundary;
    if ((this.index === void 0) || !this.excluded_boundary) {
      throw new Error("Background.Range: parameters invalid");
    }
    return this;
  }
  Range.prototype.isDone = function() {
    return this.index >= this.excluded_boundary;
  };
  Range.prototype.step = function() {
    this.index++;
    if (this.index >= this.excluded_boundary) {
      return -1;
    } else {
      return this.index;
    }
  };
  Range.prototype.getItem = function(array) {
    return array[this.index];
  };
  Range.prototype.getSlice = function(array) {
    return array.slice(this.index, this.excluded_boundary);
  };
  Range.prototype._setIsDone = function() {
    this.index = -1;
    this.excluded_boundary = -1;
    return this;
  };
  Range.prototype._addBatchLength = function(batch_length) {
    if (!batch_length) {
      throw new Error("Background.Range._addBatchLength: batch_length invalid");
    }
    this.excluded_boundary += batch_length;
    return this;
  };
  Range.prototype.reset = function() {
    this.index = 0;
    return this;
  };
  Range.prototype._stepToEnd = function() {
    return this.index = this.excluded_boundary;
  };
  return Range;
})();
if (typeof exports !== 'undefined') {
  exports.Background.Range = Background.Range;
}