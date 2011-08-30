var BGASSERT, _BGJobContainer;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
BGASSERT = function(check_condition, message) {
  if (!window.DEBUG) {
    return;
  }
  if (!check_condition) {
    return alert(message);
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
    var job;
    BGASSERT(this.being_destroyed, "not in destroy");
    BGASSERT(!this.is_destroyed, "already destroyed");
    if (this.is_destroyed) {
      return;
    }
    this.is_destroyed = true;
    while ((job = this.jobs.shift())) {
      job.destroy(true);
    }
    window.clearInterval(this.timeout);
    return this.timeout = 0;
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
var BGArrayIterator;
BGArrayIterator = (function() {
  function BGArrayIterator(array, batch_length) {
    this.batch_length = batch_length;
    this.array = array;
    this.array_length = this.array.length;
    this.batch_index = 0;
    this.batch_count = Math.floor(this.array_length / this.batch_length) + 1;
  }
  BGArrayIterator.prototype.isDone = function() {
    return this.batch_index >= this.batch_count;
  };
  BGArrayIterator.prototype.getCurrentRange = function() {
    var range;
    range = {
      index: (this.batch_index - 1) * this.batch_length
    };
    range.excluded_boundary = range.index + this.batch_length;
    if (range.excluded_boundary > this.array_length) {
      range.excluded_boundary = this.array_length;
    }
    return range;
  };
  BGArrayIterator.prototype.step = function() {
    if (this.isDone()) {
      return {
        index: this.array_length,
        excluded_boundary: this.array_length
      };
    }
    this.batch_index++;
    return this.getCurrentRange();
  };
  BGArrayIterator.prototype.nextByItem = function(fn) {
    var range;
    range = this.step();
    while (range.index < range.excluded_boundary) {
      fn(this.array[range.index], range.index, this.array);
      range.index++;
    }
    return this.isDone();
  };
  BGArrayIterator.prototype.nextBySlice = function(fn) {
    var range;
    range = this.step();
    if (range.index < range.excluded_boundary) {
      fn(this.array.slice(range.index, range.excluded_boundary), range, this.array);
    }
    return this.isDone();
  };
  BGArrayIterator.prototype.nextByRange = function(fn) {
    var range;
    range = this.step();
    if (range.index < range.excluded_boundary) {
      fn(range, this.array);
    }
    return this.isDone();
  };
  return BGArrayIterator;
})();
if (typeof exports !== 'undefined') {
  exports.BGArrayIterator = BGArrayIterator;
}