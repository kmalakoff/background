job_queue = new Background.JobQueue(10) # timeslice of 10ms per iteration
some_data = [{text:'I'}, {text:'was'}, {text:'processed'}, {text:'on'}, {text:'a'}, {text:'job'}, {text:'queue'}]

# batch set up
results = null
iterator = null
timeslice_count = null

job_queue.push(
  tick: ->
    results = []; results.push(item.text) for item in some_data
    alert("One timeslice. Results: '#{results.join(' ')}'")
    return true # done
)

job_queue.push(
  start: ->
    results = []; timeslice_count = 0
    iterator = new Background.ArrayIterator(some_data, 2)     # process 2 items per job timeslice

  tick: -> timeslice_count++; return iterator.nextByItem((item) -> results.push(item.text))

  finish: -> alert("#{timeslice_count} timeslices. Results: '#{results.join(' ')}'")
)

job_queue.push(
  start: ->
    results = []; timeslice_count = 0
    iterator = new Background.ArrayIterator(some_data, 3)     # process 3 items per job timeslice

  tick: ->
    timeslice_count++; return iterator.nextBySlice((items) ->
      results.push(item.text) for item in items
      return
    )

  finish: -> alert("#{timeslice_count} timeslices. Results: '#{results.join(' ')}'")
)

job_queue.push(
  start: ->
    results = []; timeslice_count = 0
    iterator = new Background.ArrayIterator(some_data, 1)     # process 1 item per job timeslice

  tick: ->
    timeslice_count++
    iterator.nextByItem((item) ->
      results.push(item.text)

      # push another job
      was_run = false
      test_job = new Background.Job(
        tick: -> was_run = true
        finish: (was_completed) -> alert("Cancelled: #{if was_run then 'I was run' else 'I was never run'}") unless was_completed
      )
      job_queue.push(test_job)

      job_queue.destroy() if (timeslice_count==3)   # end early
    )
    return false # never signal as done

  finish: (was_completed)-> alert("#{if was_completed then 'Finished processing' else 'Processing was cancelled' }. #{timeslice_count} timeslices. Results: '#{results.join(' ')}'")
)