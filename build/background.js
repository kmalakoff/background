var _BGArrayIterator, _BGJobContainer;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
window.BGDEBUG = true;
window.BGASSERT_ACTION = function(message) {
  return alert(message);
};
window.BGASSERT = function(check_condition, message) {
  if (!window.BGDEBUG) {
    return;
  }
  if (!check_condition) {
    return BGASSERT_ACTION(message);
  }
};
_BGJobContainer = (function() {
  function _BGJobContainer(frequency) {
    this.frequency = frequency;
    this.jobs = [];
    this.timeout = 0;
    this.being_destroyed = false;
  }
  _BGJobContainer.prototype.destroy = function() {
    return this.being_destroyed = true;
  };
  _BGJobContainer.prototype.isDestroyed = function() {
    return this.being_destroyed || this.destroyed;
  };
  _BGJobContainer.prototype.isEmpty = function() {
    return this.jobs.length === 0;
  };
  _BGJobContainer.prototype.tick = function() {
    if (this.being_destroyed) {
      this._doDestroy();
      return;
    }
    this._doTick();
    if (this.being_destroyed) {
      this._doDestroy();
    }
  };
  _BGJobContainer.prototype.clear = function() {
    var job;
    while ((job = this.jobs.shift())) {
      job.destroy(true);
    }
    if (this.timeout) {
      window.clearInterval(this.timeout);
      return this.timeout = null;
    }
  };
  _BGJobContainer.prototype._appendJob = function(init_fn_or_job, run_fn, destroy_fn) {
    var job;
    BGASSERT(!this.isDestroyed(), "push shouldn't happen after destroy");
    if (this.isDestroyed()) {
      return;
    }
    if (BGJob.isAJob(init_fn_or_job)) {
      job = init_fn_or_job;
    } else {
      job = new BGJob(init_fn_or_job, run_fn, destroy_fn);
    }
    this.jobs.push(job);
    if (!this.timeout) {
      return this.timeout = window.setInterval((__bind(function() {
        return this.tick();
      }, this)), this.frequency);
    }
  };
  _BGJobContainer.prototype._waitForJobs = function() {
    if (this.timeout) {
      window.clearInterval(this.timeout);
      return this.timeout = null;
    }
  };
  _BGJobContainer.prototype._doDestroy = function() {
    BGASSERT(this.being_destroyed, "not in destroy");
    BGASSERT(!this.is_destroyed, "already destroyed");
    if (this.is_destroyed) {
      return;
    }
    this.is_destroyed = true;
    return this.clear();
  };
  return _BGJobContainer;
})();
_BGArrayIterator = (function() {
  function _BGArrayIterator(batch_length, total_count, current_range) {
    this.batch_length = batch_length;
    this.total_count = total_count;
    this.current_range = current_range;
    BGASSERT(this.batch_length && (typeof this.total_count !== 'undefined') && this.current_range, "positive integer batch length and range required");
    this.reset();
  }
  _BGArrayIterator.prototype.reset = function() {
    this.batch_index = -1;
    return this.batch_count = Math.ceil(this.total_count / this.batch_length);
  };
  _BGArrayIterator.prototype.isDone = function() {
    return this.batch_index >= this.batch_count - 1;
  };
  _BGArrayIterator.prototype.updateCurrentRange = function() {
    var excluded_boundary, index;
    index = this.batch_index * this.batch_length;
    excluded_boundary = index + this.batch_length;
    if (excluded_boundary > this.total_count) {
      excluded_boundary = this.total_count;
    }
    if (index >= excluded_boundary) {
      return this.current_range._setIsDone();
    }
    this.current_range._addBatchLength(excluded_boundary - index);
    return this.current_range;
  };
  _BGArrayIterator.prototype.step = function() {
    if (this.isDone()) {
      return this.current_range._setIsDone();
    }
    this.batch_index++;
    if (this.batch_index === 0) {
      return this.current_range;
    } else {
      return this.updateCurrentRange();
    }
  };
  return _BGArrayIterator;
})();
var BGJob;
BGJob = (function() {
  function BGJob(init_fn, run_fn, destroy_fn) {
    this.init_fn = init_fn;
    this.run_fn = run_fn;
    this.destroy_fn = destroy_fn;
    if (!this.run_fn) {
      throw new Error('run_fn is mandatory');
    }
    this.was_completed = false;
  }
  BGJob.prototype.destroy = function() {
    this._cleanup();
    this.run_fn = null;
    this.init_fn = null;
    return this.destroy_fn = null;
  };
  BGJob.prototype.run = function() {
    if (this.init_fn) {
      try {
        this.init_fn();
      } catch (error) {
        BGASSERT(null, "init_fn failed because of '" + error.message + "'");
        return true;
      }
      this.init_fn = null;
    }
    try {
      this.was_completed = this.run_fn();
    } catch (error) {
      BGASSERT(null, "run_fn failed because of '" + error.message + "'");
    }
    if (this.was_completed) {
      this._cleanup();
    }
    return this.was_completed;
  };
  BGJob.prototype._cleanup = function() {
    if (this.destroy_fn) {
      try {
        this.destroy_fn(this.was_completed);
      } catch (error) {
        BGASSERT(null, "init_fn failed because of '" + error.message + "'");
      }
      return this.destroy_fn = null;
    }
  };
  BGJob.isAJob = function(job) {
    return job && (typeof job === 'object') && ('constructor' in job) && ('name' in job.constructor) && (job.constructor.name === 'BGJob');
  };
  return BGJob;
})();
if (typeof exports !== 'undefined') {
  exports.BGJob = BGJob;
}
var BGJobQueue;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
BGJobQueue = (function() {
  __extends(BGJobQueue, _BGJobContainer);
  function BGJobQueue(frequency) {
    BGJobQueue.__super__.constructor.call(this, frequency);
    this.current_job = null;
  }
  BGJobQueue.prototype._doTick = function() {
    if (!this.current_job) {
      if (!this.jobs.length) {
        this._waitForJobs();
        return;
      }
      this.current_job = this.jobs.shift();
    }
    if (this.current_job.run()) {
      this.current_job.destroy(false);
      return this.current_job = null;
    }
  };
  BGJobQueue.prototype.push = function(init_fn_or_job, run_fn, destroy_fn) {
    return this._appendJob(init_fn_or_job, run_fn, destroy_fn);
  };
  BGJobQueue.prototype._doDestroy = function() {
    if (this.current_job) {
      this.current_job.destroy(true);
      this.current_job = null;
    }
    return BGJobQueue.__super__._doDestroy.call(this);
  };
  return BGJobQueue;
})();
if (typeof exports !== 'undefined') {
  exports.BGJobQueue = BGJobQueue;
}
var BGJobList;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
BGJobList = (function() {
  __extends(BGJobList, _BGJobContainer);
  function BGJobList(frequency) {
    BGJobList.__super__.constructor.call(this, frequency);
  }
  BGJobList.prototype._doTick = function() {
    var job, jobs, _i, _len, _results;
    if (!this.jobs.length) {
      this._waitForJobs();
      return;
    }
    jobs = this.jobs.slice();
    _results = [];
    for (_i = 0, _len = jobs.length; _i < _len; _i++) {
      job = jobs[_i];
      _results.push(__bind(function(job) {
        if (job.run()) {
          this.jobs.splice(this.jobs.indexOf(job), 1);
          return job.destroy(false);
        }
      }, this)(job));
    }
    return _results;
  };
  BGJobList.prototype.append = function(init_fn_or_job, run_fn, destroy_fn) {
    return this._appendJob(init_fn_or_job, run_fn, destroy_fn);
  };
  return BGJobList;
})();
if (typeof exports !== 'undefined') {
  exports.BGJobList = BGJobList;
}
var BGRange;
BGRange = (function() {
  function BGRange(index, excluded_boundary) {
    this.index = index;
    this.excluded_boundary = excluded_boundary;
    BGASSERT((typeof this.index !== 'undefined') && this.excluded_boundary, "missing parameters");
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
    BGASSERT(batch_length, "missing parameters");
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
var BGRange_xN;
BGRange_xN = (function() {
  function BGRange_xN(ranges, batch_length) {
    this.ranges = ranges;
    this.batch_length = batch_length;
    BGASSERT(this.ranges && this.batch_length, "missing parameters or invalid batch length");
    this.batch_index = 0;
    return this;
  }
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
    this._setIsDone();
    return null;
  };
  BGRange_xN.prototype.getItems = function(arrays) {
    var array, index, items;
    items = [];
    for (index in arrays) {
      array = arrays[index];
      items.push(array[this.ranges[index].index]);
    }
    return items;
  };
  BGRange_xN.prototype.getCombinations = function(arrays) {
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
  BGRange_xN.prototype._setIsDone = function() {
    this.batch_index = -1;
    this.batch_length = -1;
    return this;
  };
  BGRange_xN.prototype._addBatchLength = function(batch_length) {
    BGASSERT(batch_length, "missing parameters");
    this.batch_index = 0;
    this.batch_length = batch_length;
    return this;
  };
  return BGRange_xN;
})();
if (typeof exports !== 'undefined') {
  exports.BGRange = BGRange;
}
var BGArrayIterator;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
BGArrayIterator = (function() {
  __extends(BGArrayIterator, _BGArrayIterator);
  function BGArrayIterator(array, batch_length) {
    var excluded_boundary;
    this.array = array;
    BGASSERT(this.array, "array required");
    this.reset();
    excluded_boundary = batch_length < this.array.length ? batch_length : (this.array.length ? this.array.length : 1);
    BGArrayIterator.__super__.constructor.call(this, batch_length, this.array.length, new BGRange(0, excluded_boundary));
  }
  BGArrayIterator.prototype.nextByItem = function(fn) {
    this.step();
    while (!this.current_range.isDone()) {
      fn(this.current_range.getItem(this.array), this.current_range.index, this.array);
      this.current_range.step();
    }
    return this.isDone();
  };
  BGArrayIterator.prototype.nextBySlice = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range.getSlice(this.array), this.current_range, this.array);
    }
    this.current_range._stepToEnd();
    return this.isDone();
  };
  BGArrayIterator.prototype.nextByRange = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range, this.array);
    }
    return this.isDone();
  };
  return BGArrayIterator;
})();
if (typeof exports !== 'undefined') {
  exports.BGArrayIterator = BGArrayIterator;
}
var BGArrayIterator_xN;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
BGArrayIterator_xN = (function() {
  __extends(BGArrayIterator_xN, _BGArrayIterator);
  function BGArrayIterator_xN(arrays, batch_length) {
    var array, array_combination_count, ranges, _i, _j, _len, _len2, _ref, _ref2;
    this.arrays = arrays;
    BGASSERT(this.arrays, "arrays required");
    array_combination_count = 1;
    _ref = this.arrays;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      array = _ref[_i];
      array_combination_count *= array.length;
    }
    this.reset();
    ranges = [];
    _ref2 = this.arrays;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      array = _ref2[_j];
      ranges.push(new BGRange(0, array.length));
    }
    BGArrayIterator_xN.__super__.constructor.call(this, batch_length, array_combination_count, new BGRange_xN(ranges, batch_length));
  }
  BGArrayIterator_xN.prototype.nextByItems = function(fn) {
    this.step();
    while (!this.current_range.isDone()) {
      fn(this.current_range.getItems(this.arrays), this.current_range, this.arrays);
      this.current_range.step();
    }
    return this.isDone();
  };
  BGArrayIterator_xN.prototype.nextByCombinations = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range.getCombinations(this.arrays), this.current_range, this.array);
    }
    return this.isDone();
  };
  BGArrayIterator_xN.prototype.nextByRange = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range, this.arrays);
    }
    return this.isDone();
  };
  return BGArrayIterator_xN;
})();
if (typeof exports !== 'undefined') {
  exports.BGArrayIterator = BGArrayIterator;
}