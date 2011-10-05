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