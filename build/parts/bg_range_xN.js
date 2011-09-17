var BGRange_xN;
BGRange_xN = (function() {
  function BGRange_xN(ranges, batch_length) {
    this.ranges = ranges;
    this.batch_length = batch_length;
    BGASSERT(this.ranges && this.batch_length, "missing parameters or invalid batch length");
    this.batch_index = 0;
    return this;
  }
  BGRange_xN.prototype.clone = function() {
    var range, ranges, _i, _len, _ref;
    ranges = [];
    _ref = this.ranges;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      range = _ref[_i];
      ranges.push(range.clone());
    }
    return new BGRange_xN(ranges, this.batch_length);
  };
  BGRange_xN.prototype.setIsDone = function() {
    this.batch_index = -1;
    this.batch_length = -1;
    return this;
  };
  BGRange_xN.prototype.addBatchLength = function(batch_length) {
    BGASSERT(batch_length, "missing parameters");
    this.batch_index = 0;
    this.batch_length = batch_length;
    return this;
  };
  BGRange_xN.prototype.isDone = function() {
    return this.batch_index >= this.batch_length;
  };
  BGRange_xN.prototype.step = function() {
    var current_range, index;
    this.batch_index++;
    index = this.ranges.length - 1;
    while (index >= 0) {
      current_range = this.ranges[index];
      current_range.step();
      if (!current_range.isDone()) {
        return this;
      }
      current_range.reset();
      index--;
    }
    this.setIsDone();
    return null;
  };
  BGRange_xN.prototype.stepToEnd = function() {
    var _results;
    _results = [];
    while (!this.isDone()) {
      _results.push(this.step());
    }
    return _results;
  };
  BGRange_xN.isARange_xN = function(range) {
    return range && (typeof range === 'object') && ('constructor' in range) && ('name' in range.constructor) && (range.constructor.name === 'BGRange_xN');
  };
  return BGRange_xN;
})();
if (typeof exports !== 'undefined') {
  exports.BGRange = BGRange;
}