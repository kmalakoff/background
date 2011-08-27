(function() {
  var iterator, results, some_data, timeslice_count, worker_queue;
  worker_queue = new WQ.WorkerQueue(10);
  some_data = [
    {
      text: 'I'
    }, {
      text: 'was'
    }, {
      text: 'processed'
    }, {
      text: 'on'
    }, {
      text: 'a'
    }, {
      text: 'worker'
    }, {
      text: 'queue'
    }
  ];
  results = null;
  iterator = null;
  timeslice_count = null;
  worker_queue.push(null, (function() {
    results = _.map(some_data, function(entry) {
      return entry.text;
    });
    alert("One timeslice. Results: '" + (results.join(' ')) + "'");
    return true;
  }));
  worker_queue.push((function() {
    results = [];
    iterator = new WQ.ArrayIterator(some_data, 2);
    return timeslice_count = 0;
  }), (function() {
    timeslice_count++;
    return iterator.next_by_entry(function(entry) {
      results.push(entry.text);
      return false;
    });
  }), (function() {
    return alert("" + timeslice_count + " timeslices. Results: '" + (results.join(' ')) + "'");
  }));
  worker_queue.push((function() {
    results = [];
    iterator = new WQ.ArrayIterator(some_data, 3);
    return timeslice_count = 0;
  }), (function() {
    timeslice_count++;
    return iterator.next_by_slice(function(entries) {
      results = results.concat(_.map(entries, function(entry) {
        return entry.text;
      }));
      return false;
    });
  }), (function() {
    return alert("" + timeslice_count + " timeslices. Results: '" + (results.join(' ')) + "'");
  }));
  worker_queue.push((function() {
    results = [];
    iterator = new WQ.ArrayIterator(some_data, 1);
    return timeslice_count = 0;
  }), (function() {
    timeslice_count++;
    iterator.next_by_entry(function(entry) {
      var was_run;
      results.push(entry.text);
      was_run = false;
      worker_queue.push(null, (function() {
        return was_run = true;
      }), (function(was_completed) {
        if (!was_completed) {
          return alert("Cancelled: " + (was_run ? 'I was run' : 'I was never run'));
        }
      }));
      if (timeslice_count === 3) {
        worker_queue.destroy();
      }
      return false;
    });
    return false;
  }), (function(was_completed) {
    return alert("" + (was_completed ? 'Finished processing' : 'Processing was cancelled') + ". " + timeslice_count + " timeslices. Results: '" + (results.join(' ')) + "'");
  }));
}).call(this);
