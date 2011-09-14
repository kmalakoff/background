var BGRange_x2;
BGRange_x2 = (function() {
  function BGRange_x2(range2_length, batch_length, range1, range2) {
    this.range2_length = range2_length;
    this.batch_length = batch_length;
    this.range1 = range1;
    this.range2 = range2;
    BGASSERT(this.range2_length && this.batch_length, "a BGRange_x2 requires all of the parameters");
    this.batch_index = 0;
    return this;
  }
  BGRange_x2.prototype.setIsDone = function() {
    this.batch_index = -1;
    this.batch_length = -1;
    return this;
  };
  BGRange_x2.prototype.set = function(batch_length_or_range, range1, range2, range2_length) {
    if (BGRange_x2.isARange_x2(batch_length_or_range)) {
      this.range2_length = batch_length_or_range.range2_length;
      this.batch_length = batch_length_or_range.batch_length;
      this.range1 = batch_length_or_range.range1;
      this.range2 = batch_length_or_range.range2;
    } else {
      this.batch_length = batch_length_or_range;
      if (range1) {
        this.range1 = range1;
      }
      if (range2) {
        this.range2 = range2;
      }
      if (range2_length) {
        this.range2_length = range2_length;
      }
    }
    return this.batch_index = 0;
  };
  BGRange_x2.prototype.step = function() {
    var range2_excluded_boundary;
    this.batch_index++;
    if (this.batch_index >= this.batch_length) {
      return null;
    }
    this.range2.step();
    if (this.range2.isDone()) {
      range2_excluded_boundary = this.batch_length - this.batch_index;
      if (range2_excluded_boundary > this.range2_length) {
        range2_excluded_boundary = this.range2_length;
      }
      this.range2.set(0, range2_excluded_boundary);
      return this.range1.step();
    }
  };
  BGRange_x2.prototype.isDone = function() {
    return this.batch_index >= this.batch_length;
  };
  BGRange_x2.isARange_x2 = function(range) {
    return range && (typeof range === 'object') && ('constructor' in range) && ('name' in range.constructor) && (range.constructor.name === 'BGRange_x2');
  };
  return BGRange_x2;
})();
if (typeof exports !== 'undefined') {
  exports.BGRange = BGRange;
}