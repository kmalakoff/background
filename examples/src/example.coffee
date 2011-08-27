worker_queue = new WQ.WorkerQueue(10) # timeslice of 10ms per iteration
some_data = [{text:'I'}, {text:'was'}, {text:'processed'}, {text:'on'}, {text:'a'}, {text:'worker'}, {text:'queue'}]

# batch set up
results = null
iterator = null
timeslice_count = null

worker_queue.push(
  null, 
  (-> 
    results = _.map(some_data, (entry) -> return entry.text)
    alert("One timeslice. Results: '#{results.join(' ')}'")
    return true # done
  )
)

worker_queue.push(
  (-> 
    results = []
    iterator = new WQ.ArrayIterator(some_data, 2)     # process 2 entries per worker timeslice
    timeslice_count = 0
  ), 
  (-> 
    timeslice_count++
    return iterator.next_by_entry((entry) ->
      results.push(entry.text)
      return false # not done early
    )
  ),
  (->
    alert("#{timeslice_count} timeslices. Results: '#{results.join(' ')}'")
  )
)

worker_queue.push(
  (-> 
    results = []
    iterator = new WQ.ArrayIterator(some_data, 3)     # process 3 entries per worker timeslice
    timeslice_count = 0
  ), 
  (-> 
    timeslice_count++
    return iterator.next_by_slice((entries) ->
      results = results.concat(_.map(entries, (entry) -> return entry.text))
      return false # not done early
    )
  ),
  (->
    alert("#{timeslice_count} timeslices. Results: '#{results.join(' ')}'")
  )
)

worker_queue.push(
  (-> 
    results = []
    iterator = new WQ.ArrayIterator(some_data, 1)     # process 1 entry per worker timeslice
    timeslice_count = 0
  ), 
  (-> 
    timeslice_count++
    iterator.next_by_entry((entry) ->
      results.push(entry.text)

      # push another worker
      was_run = false
      test_worker = new WQ.Worker(
        null, 
        (->was_run = true), 
        ((was_completed)-> alert("Cancelled: #{if was_run then 'I was run' else 'I was never run'}") if not was_completed)
      ) 
      worker_queue.pushWorker(test_worker)

      worker_queue.destroy() if(timeslice_count==3)   # end early
      return false # not done early
    )
    return false # never signal as done
  ),
  ((was_completed)->
    alert("#{if was_completed then 'Finished processing' else 'Processing was cancelled' }. #{timeslice_count} timeslices. Results: '#{results.join(' ')}'")
  )
)
