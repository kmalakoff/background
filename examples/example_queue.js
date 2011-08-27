var iterator, job_queue, results, some_data, timeslice_count;
job_queue = new BGJobQueue(10);
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
  results = _.map(some_data, function(entry) {
    return entry.text;
  });
  alert("One timeslice. Results: '" + (results.join(' ')) + "'");
  return true;
}));
job_queue.push((function() {
  results = [];
  timeslice_count = 0;
  return iterator = new BGArrayIterator(some_data, 2);
}), (function() {
  timeslice_count++;
  return iterator.next_by_item(function(entry) {
    return results.push(entry.text);
  });
}), (function() {
  return alert("" + timeslice_count + " timeslices. Results: '" + (results.join(' ')) + "'");
}));
job_queue.push((function() {
  results = [];
  timeslice_count = 0;
  return iterator = new BGArrayIterator(some_data, 3);
}), (function() {
  timeslice_count++;
  return iterator.next_by_slice(function(entries) {
    return results = results.concat(_.map(entries, function(entry) {
      return entry.text;
    }));
  });
}), (function() {
  return alert("" + timeslice_count + " timeslices. Results: '" + (results.join(' ')) + "'");
}));
job_queue.push((function() {
  results = [];
  timeslice_count = 0;
  return iterator = new BGArrayIterator(some_data, 1);
}), (function() {
  timeslice_count++;
  iterator.next_by_item(function(entry) {
    var test_job, was_run;
    results.push(entry.text);
    was_run = false;
    test_job = new BGJob(null, (function() {
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