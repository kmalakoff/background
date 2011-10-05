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