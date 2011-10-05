var iterator, job_queue, results, some_data, timeslice_count;
job_queue = new Background.JobQueue(10);
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
    text: 'job'
  }, {
    text: 'queue'
  }
];
results = null;
iterator = null;
timeslice_count = null;
job_queue.push(null, (function() {
  var item, _i, _len;
  results = [];
  for (_i = 0, _len = some_data.length; _i < _len; _i++) {
    item = some_data[_i];
    results.push(item.text);
  }
  alert("One timeslice. Results: '" + (results.join(' ')) + "'");
  return true;
}));
job_queue.push((function() {
  results = [];
  timeslice_count = 0;
  return iterator = new Background.ArrayIterator(some_data, 2);
}), (function() {
  timeslice_count++;
  return iterator.nextByItem(function(item) {
    return results.push(item.text);
  });
}), (function() {
  return alert("" + timeslice_count + " timeslices. Results: '" + (results.join(' ')) + "'");
}));
job_queue.push((function() {
  results = [];
  timeslice_count = 0;
  return iterator = new Background.ArrayIterator(some_data, 3);
}), (function() {
  timeslice_count++;
  return iterator.nextBySlice(function(items) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      _results.push(results.push(item.text));
    }
    return _results;
  });
}), (function() {
  return alert("" + timeslice_count + " timeslices. Results: '" + (results.join(' ')) + "'");
}));
job_queue.push((function() {
  results = [];
  timeslice_count = 0;
  return iterator = new Background.ArrayIterator(some_data, 1);
}), (function() {
  timeslice_count++;
  iterator.nextByItem(function(item) {
    var test_job, was_run;
    results.push(item.text);
    was_run = false;
    test_job = new Background.Job(null, (function() {
      return was_run = true;
    }), (function(was_completed) {
      if (!was_completed) {
        return alert("Cancelled: " + (was_run ? 'I was run' : 'I was never run'));
      }
    }));
    job_queue.push(test_job);
    if (timeslice_count === 3) {
      return job_queue.destroy();
    }
  });
  return false;
}), (function(was_completed) {
  return alert("" + (was_completed ? 'Finished processing' : 'Processing was cancelled') + ". " + timeslice_count + " timeslices. Results: '" + (results.join(' ')) + "'");
}));