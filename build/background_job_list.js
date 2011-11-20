var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
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
      if (!job.run()) {
        continue;
      }
      this.jobs.splice(this.jobs.indexOf(job), 1);
      _results.push(job.destroy(false));
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