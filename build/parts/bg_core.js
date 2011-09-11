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