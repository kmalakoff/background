var _BGJobContainer;
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
  BGRange.prototype.set = function(index_or_range, excluded_boundary) {
    if (BGRange.isARange(index_or_range)) {
      this.index = index_or_range.index;
      this.excluded_boundary = index_or_range.excluded_boundary;
    } else {
      this.index = index_or_range;
      this.excluded_boundary = excluded_boundary;
    }
    return this;
  };
  BGRange.prototype.step = function() {
    this.index++;
    if (this.index >= this.excluded_boundary) {
      return -1;
    } else {
      return this.index;
    }
  };
  BGRange.prototype.isDone = function() {
    return this.index >= this.excluded_boundary;
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
var BGArrayIterator;
BGArrayIterator = (function() {
  function BGArrayIterator(array, batch_length) {
    this.array = array;
    this.batch_length = batch_length;
    BGASSERT(this.array && this.batch_length, "array and positive integer batch length required");
    this.array_length = this.array.length;
    this.reset();
    this.current_range = new BGRange();
  }
  BGArrayIterator.prototype.reset = function() {
    this.batch_index = 0;
    return this.batch_count = Math.floor(this.array_length / this.batch_length) + 1;
  };
  BGArrayIterator.prototype.isDone = function() {
    return this.batch_index >= this.batch_count;
  };
  BGArrayIterator.prototype.updateCurrentRange = function() {
    var excluded_boundary, index;
    index = (this.batch_index - 1) * this.batch_length;
    excluded_boundary = index + this.batch_length;
    if (excluded_boundary > this.array_length) {
      excluded_boundary = this.array_length;
    }
    return this.current_range.set(index, excluded_boundary);
  };
  BGArrayIterator.prototype.step = function() {
    if (this.isDone()) {
      return this.current_range.setIsDone();
    }
    this.batch_index++;
    return this.updateCurrentRange();
  };
  BGArrayIterator.prototype.nextByItem = function(fn) {
    this.step();
    while (!this.current_range.isDone()) {
      fn(this.array[this.current_range.index], this.current_range.index, this.array);
      this.current_range.step();
    }
    return this.isDone();
  };
  BGArrayIterator.prototype.nextBySlice = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range.sliceArray(this.array), this.current_range, this.array);
    }
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
var BGArrayIterator_x2;
BGArrayIterator_x2 = (function() {
  function BGArrayIterator_x2(array1, array2, batch_length) {
    this.array1 = array1;
    this.array2 = array2;
    this.batch_length = batch_length;
    BGASSERT(this.array1 && this.array2 && this.batch_length, "array and positive integer batch length required");
    this.array1_length = this.array1.length;
    this.array2_length = this.array2.length;
    this.array_combination_count = this.array1_length * this.array2_length;
    this.reset();
    this.current_range = new BGRange_x2(this.array2_length, this.batch_length);
  }
  BGArrayIterator_x2.prototype.reset = function() {
    this.batch_index = 0;
    return this.batch_count = Math.floor(this.array_combination_count / this.batch_length) + 1;
  };
  BGArrayIterator_x2.prototype.isDone = function() {
    return this.batch_index >= this.batch_count;
  };
  BGArrayIterator_x2.prototype.updateCurrentRange = function() {
    var excluded_boundary, excluded_boundary1, excluded_boundary2, index, index1, index2;
    index = (this.batch_index - 1) * this.batch_length;
    excluded_boundary = index + this.batch_length;
    if (excluded_boundary > this.array_combination_count) {
      excluded_boundary = this.array_combination_count;
    }
    if (index >= excluded_boundary) {
      return this.current_range.setIsDone();
    }
    index1 = Math.floor(index / this.array2_length);
    excluded_boundary1 = Math.floor(excluded_boundary / this.array2_length) + 1;
    index2 = index % this.array2_length;
    excluded_boundary2 = this.array2_length;
    this.current_range.set(excluded_boundary - index, new BGRange(index1, excluded_boundary1), new BGRange(index2, excluded_boundary2));
    return this.current_range;
  };
  BGArrayIterator_x2.prototype.step = function() {
    if (this.isDone()) {
      return this.current_range.setIsDone();
    }
    this.batch_index++;
    return this.updateCurrentRange();
  };
  BGArrayIterator_x2.prototype.nextByItems = function(fn) {
    this.step();
    while (!this.current_range.isDone()) {
      fn(this.array1[this.current_range.range1.index], this.array2[this.current_range.range2.index], this.current_range, this.array1, this.array2);
      this.current_range.step();
    }
    return this.isDone();
  };
  BGArrayIterator_x2.prototype.nextByRange = function(fn) {
    this.step();
    if (!this.current_range.isDone()) {
      fn(this.current_range, this.array1, this.array2);
    }
    return this.isDone();
  };
  return BGArrayIterator_x2;
})();
if (typeof exports !== 'undefined') {
  exports.BGArrayIterator = BGArrayIterator;
}