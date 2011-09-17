var BGRange_xN;
BGRange_xN = (function() {
  function BGRange_xN(range2_length, batch_length, range1, range2) {
    this.range2_length = range2_length;
    this.batch_length = batch_length;
    this.range1 = range1;
    this.range2 = range2;
    BGASSERT(this.range2_length && this.batch_length, "a BGRange_xN requires all of the parameters");
    this.batch_index = 0;
    return this;
  }
  BGRange_xN.prototype.setIsDone = function() {
    this.batch_index = -1;
    this.batch_length = -1;
    return this;
  };
  BGRange_xN.prototype.set = function(batch_length_or_range, range1, range2, range2_length) {
    if (BGRange_xN.isARange_xN(batch_length_or_range)) {
      this.range2_length = batch_length_or_ranges[1]_length;
      this.batch_length = batch_length_or_range.batch_length;
      this.range1 = batch_length_or_ranges[0];
      this.range2 = batch_length_or_ranges[1];
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
  BGRange_xN.prototype.step = function() {
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
  BGRange_xN.prototype.isDone = function() {
    return this.batch_index >= this.batch_length;
  };
  BGRange_xN.isARange_xN = function(range) {
    return range && (typeof range === 'object') && ('constructor' in range) && ('name' in range.constructor) && (range.constructor.name === 'BGRange_xN');
  };
  return BGRange_xN;
})();
if (typeof exports !== 'undefined') {
  exports.BGRange = BGRange;
}