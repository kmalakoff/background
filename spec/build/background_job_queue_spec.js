try {
  describe("Background.JobQueue", function() {
    describe("init_fn is called when expected", function() {
      it("should not call init_fn without a tick", function() {
        var init_fn, job_queue;
        job_queue = new Background.JobQueue(10000);
        init_fn = jasmine.createSpy("init_fn");
        expect(function() {
          return job_queue.push(init_fn, (function() {
            return false;
          }));
        }).not.toThrow();
        return expect(init_fn).not.toHaveBeenCalled();
      });
      it("should call init_fn once for one tick", function() {
        var init_fn, job_queue;
        job_queue = new Background.JobQueue(10000);
        init_fn = jasmine.createSpy("init_fn");
        expect(function() {
          return job_queue.push(init_fn, (function() {
            return false;
          }));
        }).not.toThrow();
        job_queue.tick();
        return expect(init_fn).toHaveBeenCalled();
      });
      return it("should call init_fn once for multiple ticks", function() {
        var call_count, init_fn, job_queue;
        call_count = 0;
        job_queue = new Background.JobQueue(10000);
        init_fn = jasmine.createSpy("init_fn").andCallFake(function() {
          return call_count++;
        });
        expect(function() {
          return job_queue.push(init_fn, (function() {
            return false;
          }));
        }).not.toThrow();
        job_queue.tick();
        job_queue.tick();
        job_queue.tick();
        expect(init_fn).toHaveBeenCalled();
        return expect(call_count === 1).toBeTruthy();
      });
    });
    describe("run_fn is called when expected", function() {
      it("should not call run_fn without a tick", function() {
        var job_queue, run_fn;
        job_queue = new Background.JobQueue(10000);
        run_fn = jasmine.createSpy("run_fn").andCallFake(function() {
          return false;
        });
        expect(function() {
          return job_queue.push(null, run_fn);
        }).not.toThrow();
        return expect(run_fn).not.toHaveBeenCalled();
      });
      it("should call run_fn once for one tick", function() {
        var job_queue, run_fn;
        job_queue = new Background.JobQueue(10000);
        run_fn = jasmine.createSpy("run_fn").andCallFake(function() {
          return false;
        });
        expect(function() {
          return job_queue.push(null, run_fn);
        }).not.toThrow();
        job_queue.tick();
        return expect(run_fn).toHaveBeenCalled();
      });
      it("should call run_fn once per tick for multiple ticks when told to continue", function() {
        var call_count, job_queue, run_fn;
        call_count = 0;
        job_queue = new Background.JobQueue(10000);
        run_fn = jasmine.createSpy("run_fn").andCallFake(function() {
          call_count++;
          return false;
        });
        expect(function() {
          return job_queue.push(null, run_fn);
        }).not.toThrow();
        job_queue.tick();
        job_queue.tick();
        job_queue.tick();
        expect(run_fn).toHaveBeenCalled();
        return expect(call_count === 3).toBeTruthy();
      });
      return it("should call run_fn once for multiple ticks when told to finish", function() {
        var call_count, job_queue, run_fn;
        call_count = 0;
        job_queue = new Background.JobQueue(10000);
        run_fn = jasmine.createSpy("run_fn").andCallFake(function() {
          call_count++;
          return true;
        });
        expect(function() {
          return job_queue.push(null, run_fn);
        }).not.toThrow();
        job_queue.tick();
        job_queue.tick();
        job_queue.tick();
        expect(run_fn).toHaveBeenCalled();
        return expect(call_count === 1).toBeTruthy();
      });
    });
    describe("destroy_fn is called when expected", function() {
      it("should not call destroy_fn without a tick", function() {
        var destroy_fn, job_queue;
        job_queue = new Background.JobQueue(10000);
        destroy_fn = jasmine.createSpy("destroy_fn");
        expect(function() {
          return job_queue.push(null, (function() {
            return false;
          }), destroy_fn);
        }).not.toThrow();
        return expect(destroy_fn).not.toHaveBeenCalled();
      });
      it("should not call destroy_fn with a tick and non-finished task", function() {
        var destroy_fn, job_queue;
        job_queue = new Background.JobQueue(10000);
        destroy_fn = jasmine.createSpy("destroy_fn");
        expect(function() {
          return job_queue.push(null, (function() {
            return false;
          }), destroy_fn);
        }).not.toThrow();
        return expect(destroy_fn).not.toHaveBeenCalled();
      });
      it("should call destroy_fn once for one tick for a finished task", function() {
        var destroy_fn, job_queue;
        job_queue = new Background.JobQueue(10000);
        destroy_fn = jasmine.createSpy("destroy_fn");
        expect(function() {
          return job_queue.push(null, (function() {
            return true;
          }), destroy_fn);
        }).not.toThrow();
        job_queue.tick();
        return expect(destroy_fn).toHaveBeenCalled();
      });
      it("should call destroy_fn once for multiple ticks when told to finish", function() {
        var call_count, destroy_fn, job_queue;
        call_count = 0;
        job_queue = new Background.JobQueue(10000);
        destroy_fn = jasmine.createSpy("destroy_fn").andCallFake(function() {
          return call_count++;
        });
        expect(function() {
          return job_queue.push(null, (function() {
            return true;
          }), destroy_fn);
        }).not.toThrow();
        job_queue.tick();
        job_queue.tick();
        job_queue.tick();
        expect(destroy_fn).toHaveBeenCalled();
        return expect(call_count === 1).toBeTruthy();
      });
      it("should call destroy_fn once for multiple ticks when destroyed", function() {
        var call_count, destroy_fn, job_queue;
        call_count = 0;
        job_queue = new Background.JobQueue(30);
        destroy_fn = jasmine.createSpy("destroy_fn").andCallFake(function() {
          return call_count++;
        });
        expect(function() {
          return job_queue.push(null, (function() {
            return false;
          }), destroy_fn);
        }).not.toThrow();
        job_queue.tick();
        job_queue.destroy();
        job_queue = null;
        waitsFor(function() {
          return destroy_fn.wasCalled;
        });
        return runs(function() {
          expect(destroy_fn).toHaveBeenCalled();
          return expect(call_count === 1).toBeTruthy();
        });
      });
      it("should indicate the task was completed when completed", function() {
        var destroy_fn, job_queue, param_was_completed;
        param_was_completed = false;
        job_queue = new Background.JobQueue(10000);
        destroy_fn = jasmine.createSpy("destroy_fn").andCallFake(function(was_completed) {
          return param_was_completed = was_completed;
        });
        expect(function() {
          return job_queue.push(null, (function() {
            return true;
          }), destroy_fn);
        }).not.toThrow();
        job_queue.tick();
        expect(destroy_fn).toHaveBeenCalled();
        return expect(param_was_completed).toBeTruthy();
      });
      return it("should indicate the task was not completed when destroyed", function() {
        var destroy_fn, job_queue, param_was_completed;
        param_was_completed = true;
        job_queue = new Background.JobQueue(30);
        destroy_fn = jasmine.createSpy("destroy_fn").andCallFake(function(was_completed) {
          return param_was_completed = was_completed;
        });
        expect(function() {
          return job_queue.push(null, (function() {
            return true;
          }), destroy_fn);
        }).not.toThrow();
        job_queue.tick();
        job_queue.tick();
        job_queue.tick();
        job_queue.destroy();
        job_queue = null;
        waitsFor(function() {
          return destroy_fn.wasCalled;
        });
        return runs(function() {
          return expect(destroy_fn).toHaveBeenCalled();
        });
      });
    });
    describe("checking job run_fn is called for each tick", function() {
      it("should call once for one tick", function() {
        var call_count, job_queue;
        job_queue = new Background.JobQueue(10000);
        call_count = 0;
        job_queue.push(null, (function() {
          call_count++;
          return false;
        }));
        job_queue.tick();
        return expect(call_count === 1).toBeTruthy();
      });
      return it("should call three times for three ticks", function() {
        var call_count, job_queue;
        job_queue = new Background.JobQueue(10000);
        call_count = 0;
        job_queue.push(null, (function() {
          call_count++;
          return false;
        }));
        job_queue.tick();
        job_queue.tick();
        job_queue.tick();
        return expect(call_count === 3).toBeTruthy();
      });
    });
    return describe("checking job run_fn is called for each tick", function() {
      it("should call once for one tick", function() {
        var call_count, job, job_queue;
        job_queue = new Background.JobQueue(10000);
        call_count = 0;
        job = new Background.Job(null, (function() {
          call_count++;
          return false;
        }));
        job_queue.push(job);
        job_queue.tick();
        return expect(call_count === 1).toBeTruthy();
      });
      return it("should call three times for three ticks", function() {
        var call_count, job, job_queue;
        job_queue = new Background.JobQueue(10000);
        call_count = 0;
        job = new Background.Job(null, (function() {
          call_count++;
          return false;
        }));
        job_queue.push(job);
        job_queue.tick();
        job_queue.tick();
        job_queue.tick();
        return expect(call_count === 3).toBeTruthy();
      });
    });
  });
} catch (error) {
  alert("Background.JobQueue specs failed: '" + error + "'");
}