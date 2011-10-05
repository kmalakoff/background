Background.Range_xN = (function() {
  function Range_xN(ranges, batch_length) {
    this.ranges = ranges;
    this.batch_length = batch_length;
    if (!this.ranges || !this.batch_length) {
      throw new Error("Background.Range_xN: parameters invalid");
    }
    this.batch_index = 0;
    return this;
  }
  Range_xN.prototype.isDone = function() {
    return this.batch_index >= this.batch_length;
  };
  Range_xN.prototype.step = function() {
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
    this._setIsDone();
    return null;
  };
  Range_xN.prototype.getItems = function(arrays) {
    var array, index, items;
    items = [];
    for (index in arrays) {
      array = arrays[index];
      items.push(array[this.ranges[index].index]);
    }
    return items;
  };
  Range_xN.prototype.getCombinations = function(arrays) {
    var combination, combinations, index, range, _ref;
    combinations = [];
    while (!this.isDone()) {
      combination = [];
      _ref = this.ranges;
      for (index in _ref) {
        range = _ref[index];
        combination.push(range.getItem(arrays[index]));
      }
      combinations.push(combination);
      this.step();
    }
    return combinations;
  };
  Range_xN.prototype._setIsDone = function() {
    this.batch_index = -1;
    this.batch_length = -1;
    return this;
  };
  Range_xN.prototype._addBatchLength = function(batch_length) {
    if (!batch_length) {
      throw new Error("Background.Range_xN._addBatchLength: batch_length invalid");
    }
    this.batch_index = 0;
    this.batch_length = batch_length;
    return this;
  };
  return Range_xN;
})();
if (typeof exports !== 'undefined') {
  exports.Background.Range = Background.Range;
}