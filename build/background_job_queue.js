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