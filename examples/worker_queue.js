(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.WQ || (window.WQ = {});
  WQ.ASSERT = function(check_condition, message) {
    if (!window.DEBUG) {
      return;
    }
    if (!check_condition) {
      return alert(message);
    }
  };
  WQ.ArrayIterator = (function() {
    function ArrayIterator(array, batch_size) {
      this.batch_size = batch_size;
      this.array = array;
      this.batch_count = Math.floor(this.array.length / this.batch_size) + 1;
      this.batch_index = 0;
      this.array_index = 0;
    }
    ArrayIterator.prototype.next_by_entry = function(fn) {
      var current_batch_count;
      current_batch_count = this.array_index + this.batch_size;
      if (current_batch_count > this.array.length) {
        current_batch_count = this.array.length;
      }
      while (this.array_index < current_batch_count) {
        if (fn(this.array[this.array_index], this.array_index)) {
          return true;
        }
        this.array_index++;
      }
      this.batch_index++;
      return this.batch_index === this.batch_count;
    };
    ArrayIterator.prototype.next_by_slice = function(fn) {
      var current_batch_count;
      current_batch_count = this.array_index + this.batch_size;
      if (current_batch_count > this.array.length) {
        current_batch_count = this.array.length;
      }
      if ((current_batch_count - this.array_index) <= 0) {
        return true;
      }
      if (fn(this.array.slice(this.array_index, current_batch_count))) {
        return true;
      }
      this.array_index += this.batch_size;
      this.batch_index++;
      return this.batch_index === this.batch_count;
    };
    return ArrayIterator;
  })();
  WQ.Worker = (function() {
    function Worker(setup_callback, task, cleanup_callback) {
      this.setup_callback = setup_callback;
      this.task = task;
      this.cleanup_callback = cleanup_callback;
      WQ.ASSERT(this.task, "missing task for worker");
      this.was_completed = false;
    }
    Worker.prototype.destroy = function() {
      this._cleanup();
      this.task = null;
      this.setup_callback = null;
      return this.cleanup_callback = null;
    };
    Worker.prototype.run = function() {
      if (this.setup_callback) {
        try {
          this.setup_callback();
        } catch (error) {
          WQ.ASSERT(null, "setup_callback failed because of '" + error.message + "'");
          return true;
        }
        this.setup_callback = null;
      }
      try {
        this.was_completed = this.task();
      } catch (error) {
        WQ.ASSERT(null, "task failed because of '" + error.message + "'");
      }
      if (this.was_completed) {
        this._cleanup();
      }
      return this.was_completed;
    };
    Worker.prototype._cleanup = function() {
      if (this.cleanup_callback) {
        try {
          this.cleanup_callback(this.was_completed);
        } catch (error) {
          WQ.ASSERT(null, "setup_callback failed because of '" + error.message + "'");
        }
        return this.cleanup_callback = null;
      }
    };
    return Worker;
  })();
  WQ.WorkerQueue = (function() {
    function WorkerQueue(frequency) {
      this.frequency = frequency;
      this.worker_queue = [];
      this.timeout = 0;
      this.current_worker = null;
      this.being_destroyed = false;
    }
    WorkerQueue.prototype.destroy = function() {
      return this.being_destroyed = true;
    };
    WorkerQueue.prototype.isDestroyed = function() {
      return this.being_destroyed || this.destroyed;
    };
    WorkerQueue.prototype.isEmpty = function() {
      return this.worker_queue.length === 0;
    };
    WorkerQueue.prototype.pop = function() {
      if (this.being_destroyed) {
        this._do_destroy();
        return;
      }
      if (!this.current_worker) {
        if (!this.worker_queue.length) {
          window.clearInterval(this.timeout);
          this.timeout = 0;
          return;
        }
        this.current_worker = this.worker_queue.shift();
      }
      if (this.current_worker.run()) {
        this.current_worker.destroy(false);
        return this.current_worker = null;
      } else {
        if (this.being_destroyed) {
          this._do_destroy();
        }
      }
    };
    WorkerQueue.prototype.pushWorker = function(worker) {
      WQ.ASSERT(!this.isDestroyed(), "push shouldn't happen after destroy");
      if (this.isDestroyed()) {
        return;
      }
      this.worker_queue.push(worker);
      if (!this.timeout) {
        this.timeout = window.setInterval((__bind(function() {
          return this.pop();
        }, this)), this.frequency);
      }
      if (!this.current_worker) {
        return this.pop();
      }
    };
    WorkerQueue.prototype.push = function(setup_callback, task, cleanup_callback) {
      return this.pushWorker(new WQ.Worker(setup_callback, task, cleanup_callback));
    };
    WorkerQueue.prototype._do_destroy = function() {
      var worker;
      WQ.ASSERT(this.being_destroyed, "not in destroy");
      WQ.ASSERT(!this.is_destroyed, "already destroyed");
      if (this.is_destroyed) {
        return;
      }
      this.is_destroyed = true;
      if (this.current_worker) {
        this.current_worker.destroy(true);
        this.current_worker = null;
      }
      while ((worker = this.worker_queue.shift())) {
        worker.destroy(true);
      }
      window.clearInterval(this.timeout);
      return this.timeout = 0;
    };
    return WorkerQueue;
  })();
  if (typeof exports !== 'undefined') {
    exports.WQ.ArrayIterator = WQ.ArrayIterator;
    exports.WQ.Worker = WQ.Worker;
    exports.WQ.WorkerQueue = WQ.WorkerQueue;
  }
}).call(this);
