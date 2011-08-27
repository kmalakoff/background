job_queue = new BGJobQueue(10) # timeslice of 10ms per iteration
some_data = [{text:'I'}, {text:'was'}, {text:'processed'}, {text:'on'}, {text:'a'}, {text:'job'}, {text:'queue'}]

# batch set up
results = null
iterator = null
timeslice_count = null

job_queue.push(
  null, 
  (-> 
    results = _.map(some_data, (entry) -> return entry.text)
    alert("One timeslice. Results: '#{results.join(' ')}'")
    return true # done
  )
)

job_queue.push(
  (-> 
    results = []; timeslice_count = 0
    iterator = new BGArrayIterator(some_data, 2)     # process 2 entries per job timeslice
  ), 
  (-> timeslice_count++; return iterator.next_by_item((entry) -> results.push(entry.text)) ),
  (-> alert("#{timeslice_count} timeslices. Results: '#{results.join(' ')}'") )
)

job_queue.push(
  (-> 
    results = []; timeslice_count = 0
    iterator = new BGArrayIterator(some_data, 3)     # process 3 entries per job timeslice
  ), 
  (-> timeslice_count++; return iterator.next_by_slice((entries) -> results = results.concat(_.map(entries, (entry) -> return entry.text))) ),
  (-> alert("#{timeslice_count} timeslices. Results: '#{results.join(' ')}'") )
)

job_queue.push(
  (-> 
    results = []; timeslice_count = 0
    iterator = new BGArrayIterator(some_data, 1)     # process 1 entry per job timeslice
  ), 
  (-> 
    timeslice_count++
    iterator.next_by_item((entry) ->
      results.push(entry.text)

      # push another job
      was_run = false
      test_job = new BGJob(
        null, 
        (->was_run = true), 
        ((was_completed)-> alert("Cancelled: #{if was_run then 'I was run' else 'I was never run'}") if not was_completed)
      ) 
      job_queue.push(test_job)

      job_queue.destroy() if(timeslice_count==3)   # end early
    )
    return false # never signal as done
  ),
  ((was_completed)-> alert("#{if was_completed then 'Finished processing' else 'Processing was cancelled' }. #{timeslice_count} timeslices. Results: '#{results.join(' ')}'") )
)
