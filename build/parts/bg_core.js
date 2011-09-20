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