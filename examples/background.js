/*
  background.js 0.2.0
  (c) 2011 Kevin Malakoff.
  Mixin is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/background/blob/master/LICENSE
  Dependencies: None.
*/
var root;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
this.Background || (this.Background = {});
root = this;
Background.VERSION = '0.2.0';
Background._JobContainer = (function() {
  function _JobContainer(frequency) {
    this.frequency = frequency;
    this.jobs = [];
    this.timeout = 0;
    this.being_destroyed = false;
  }
  _JobContainer.prototype.destroy = function() {
    return this.being_destroyed = true;
  };
  _JobContainer.prototype.isDestroyed = function() {
    return this.being_destroyed || this.destroyed;
  };
  _JobContainer.prototype.isEmpty = function() {
    return this.jobs.length === 0;
  };
  _JobContainer.prototype.tick = function() {
    if (this.being_destroyed) {
      this._doDestroy();
      return;
    }
    this._doTick();
    if (this.being_destroyed) {
      this._doDestroy();
    }
  };
  _JobContainer.prototype.clear = function() {
    var job;
    while ((job = this.jobs.shift())) {
      job.destroy(true);
    }
    if (this.timeout) {
      root.clearInterval(this.timeout);
      return this.timeout = null;
    }
  };
  _JobContainer.prototype._appendJob = function(init_fn_or_job, run_fn, destroy_fn) {
    var job;
    if (this.isDestroyed()) {
      throw new Error("Background._JobContainer._appendJob: trying to append a job to a destroyed container");
    }
    if (Background.Job.isAJob(init_fn_or_job)) {
      job = init_fn_or_job;
    } else {
      job = new Background.Job(init_fn_or_job, run_fn, destroy_fn);
    }
    this.jobs.push(job);
    if (!this.timeout) {
      return this.timeout = root.setInterval((__bind(function() {
        return this.tick();
      }, this)), this.frequency);
    }
  };
  _JobContainer.prototype._waitForJobs = function() {
    if (this.timeout) {
      root.clearInterval(this.timeout);
      return this.timeout = null;
    }
  };
  _JobContainer.prototype._doDestroy = function() {
    if (!this.being_destroyed || this.is_destroyed) {
      throw new Error("Background._JobContainer.destroy: destroy state is corrupted");
    }
    this.is_destroyed = true;
    return this.clear();
  };
  return _JobContainer;
})();
Background._ArrayIterator = (function() {
  function _ArrayIterator(batch_length, total_count, current_range) {
    this.batch_length = batch_length;
    this.total_count = total_count;
    this.current_range = current_range;
    if (!this.batch_length || (this.total_count === void 0) || !this.current_range) {
      throw new Error("Background._ArrayIterator: parameters invalid");
    }
    this.reset();
  }
  _ArrayIterator.prototype.reset = function() {
    this.batch_index = -1;
    return this.batch_count = Math.ceil(this.total_count / this.batch_length);
  };
  _ArrayIterator.prototype.isDone = function() {
    return this.batch_index >= this.batch_count - 1;
  };
  _ArrayIterator.prototype.updateCurrentRange = function() {
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
  _ArrayIterator.prototype.step = function() {
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
  return _ArrayIterator;
})();
Background.Job = (function() {
  function Job(init_fn, run_fn, destroy_fn) {
    this.init_fn = init_fn;
    this.run_fn = run_fn;
    this.destroy_fn = destroy_fn;
    if (!this.run_fn) {
      throw new Error('run_fn is mandatory');
    }
    this.was_completed = false;
  }
  Job.prototype.destroy = function() {
    this._cleanup();
    this.run_fn = null;
    this.init_fn = null;
    return this.destroy_fn = null;
  };
  Job.prototype.run = function() {
    if (this.init_fn) {
      this.init_fn();
      this.init_fn = null;
    }
    this.was_completed = this.run_fn();
    if (this.was_completed) {
      this._cleanup();
    }
    return this.was_completed;
  };
  Job.prototype._cleanup = function() {
    if (this.destroy_fn) {
      this.destroy_fn(this.was_completed);
      return this.destroy_fn = null;
    }
  };
  Job.isAJob = function(job) {
    return job && (typeof job === 'object') && ('constructor' in job) && ('name' in job.constructor) && (job.constructor.name === 'Job');
  };
  return Job;
})();
if (typeof exports !== 'undefined') {
  exports.Background.Job = Background.Job;
}
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Background.JobQueue = (function() {
  __extends(JobQueue, Background._JobContainer);
  function JobQueue(frequency) {
    JobQueue.__super__.constructor.call(this, frequency);
    this.current_job = null;
  }
  JobQueue.prototype._doTick = function() {
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
  JobQueue.prototype.push = function(init_fn_or_job, run_fn, destroy_fn) {
    return this._appendJob(init_fn_or_job, run_fn, destroy_fn);
  };
  JobQueue.prototype._doDestroy = function() {
    if (this.current_job) {
      this.current_job.destroy(true);
      this.current_job = null;
    }
    return JobQueue.__super__._doDestroy.call(this);
  };
  return JobQueue;
})();
if (typeof exports !== 'undefined') {
  exports.Background.JobQueue = Background.JobQueue;
}
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Background.JobList = (function() {
  __extends(JobList, Background._JobContainer);
  function JobList(frequency) {
    JobList.__super__.constructor.call(this, frequency);
  }
  JobList.prototype._doTick = function() {
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
  JobList.prototype.append = function(init_fn_or_job, run_fn, destroy_fn) {
    return this._appendJob(init_fn_or_job, run_fn, destroy_fn);
  };
  return JobList;
})();
if (typeof exports !== 'undefined') {
  exports.Background.JobList = Background.JobList;
}
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
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Background.ArrayIterator = (function() {
  __extends(ArrayIterator, Background._ArrayIterator);
  function ArrayIterator(array, batch_length) {
    var excluded_boundary;
    this.array = array;
    if (!this.array) {
      throw new Error("Background.ArrayIterator: missing array");
    }
    this.reset();
    excluded_boundary = batch_length < this.array.length ? batch_length : (this.array.length ? this.array.length : 1);
    ArrayIterator.__super__.constructor.call(this, batch_length, this.array.length, new Background.Range(0, excluded_boundary));
  }
  ArrayIterator.prototype.nextByItem = function(fn) {
    this.step();
    while (!this.current_range.isDone()) {
      fn(this.current_range.getItem(this.array), this.current_range.index, this.array);
      this.current_range.step();
    }
    return this.isDone();
  };
  ArrayIterator.prototype.nextBySlice = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range.getSlice(this.array), this.current_range, this.array);
    }
    this.current_range._stepToEnd();
    return this.isDone();
  };
  ArrayIterator.prototype.nextByRange = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range, this.array);
    }
    return this.isDone();
  };
  return ArrayIterator;
})();
if (typeof exports !== 'undefined') {
  exports.Background.ArrayIterator = Background.ArrayIterator;
}
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Background.ArrayIterator_xN = (function() {
  __extends(ArrayIterator_xN, Background._ArrayIterator);
  function ArrayIterator_xN(arrays, batch_length) {
    var array, array_combination_count, ranges, _i, _j, _len, _len2, _ref, _ref2;
    this.arrays = arrays;
    if (!this.arrays) {
      throw new Error("Background.ArrayIterator_xN: missing arrays");
    }
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
      ranges.push(new Background.Range(0, array.length));
    }
    ArrayIterator_xN.__super__.constructor.call(this, batch_length, array_combination_count, new Background.Range_xN(ranges, batch_length));
  }
  ArrayIterator_xN.prototype.nextByItems = function(fn) {
    this.step();
    while (!this.current_range.isDone()) {
      fn(this.current_range.getItems(this.arrays), this.current_range, this.arrays);
      this.current_range.step();
    }
    return this.isDone();
  };
  ArrayIterator_xN.prototype.nextByCombinations = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range.getCombinations(this.arrays), this.current_range, this.array);
    }
    return this.isDone();
  };
  ArrayIterator_xN.prototype.nextByRange = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range, this.arrays);
    }
    return this.isDone();
  };
  return ArrayIterator_xN;
})();
if (typeof exports !== 'undefined') {
  exports.Background.ArrayIterator = Background.ArrayIterator;
}