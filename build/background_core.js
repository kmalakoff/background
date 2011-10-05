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