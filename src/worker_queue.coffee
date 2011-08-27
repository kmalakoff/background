####################################################
# Classes
# 
#   cleanup_callback -> was successful (if not successful, you might want to stop your planned cleanup)
####################################################

window.WQ||(window.WQ={}) # namespace

WQ.ASSERT = (check_condition, message) -> 
  return if(not window.DEBUG)
  alert(message) if(not check_condition)
    
class WQ.ArrayIterator

  constructor: (array, @batch_size) ->
    @array = array
    @batch_count = Math.floor(@array.length/@batch_size) + 1
    @batch_index = 0
    @array_index = 0

  next_by_entry: (fn) ->
    current_batch_count = @array_index + @batch_size
    current_batch_count = @array.length if(current_batch_count > @array.length)

    # send entry by entry
    while(@array_index<current_batch_count)
      return true if fn(@array[@array_index], @array_index)  # done (possibly early)
      @array_index++
    
    @batch_index++
    return (@batch_index==@batch_count)

  next_by_slice: (fn) ->
    current_batch_count = @array_index + @batch_size
    current_batch_count = @array.length if(current_batch_count > @array.length)

    # send a slice of the array
    return true if((current_batch_count-@array_index)<=0)
    return true if fn(@array.slice(@array_index, current_batch_count))  # done (possibly early)

    @array_index += @batch_size
    @batch_index++
    return (@batch_index==@batch_count)

class WQ.Worker
  constructor: (@setup_callback, @task, @cleanup_callback) ->
    WQ.ASSERT(@task, "missing task for worker")
    @was_completed = false

  destroy: ->
    @_cleanup()
    @task = null 
    @setup_callback = null
    @cleanup_callback = null

  run: ->
    # set up the worker
    if @setup_callback
      try
        @setup_callback() 
      catch error
        WQ.ASSERT(null, "setup_callback failed because of '#{error.message}'")
        return true
      @setup_callback = null

    # run the task
    try
      @was_completed = @task()
    catch error
      WQ.ASSERT(null, "task failed because of '#{error.message}'")

    @_cleanup() if(@was_completed)
    return @was_completed

  _cleanup: ->
    # clean up the worker
    if @cleanup_callback
      try
        @cleanup_callback(@was_completed) 
      catch error
        WQ.ASSERT(null, "setup_callback failed because of '#{error.message}'")
      @cleanup_callback = null
    
class WQ.WorkerQueue

  constructor: (@frequency) ->
    @worker_queue = [];
    @timeout = 0;
    @current_worker = null;
    @being_destroyed = false

  destroy:      -> @being_destroyed = true
  isDestroyed: -> return (@being_destroyed or @destroyed) 

  isEmpty: -> return (@worker_queue.length == 0)
  pop: ->
    # we are destrey
    (@_do_destroy(); return) if(@being_destroyed)
    
    # get a new worker
    if(not @current_worker)
      # no workers, wait for next push
      if(not @worker_queue.length)
        window.clearInterval(@timeout)
        @timeout = 0
        return

      @current_worker = @worker_queue.shift()

    # done
    if(@current_worker.run())
      @current_worker.destroy(false)
      @current_worker = null 

    # we are done
    else
      (@_do_destroy(); return) if(@being_destroyed)

  pushWorker: (worker) ->
    WQ.ASSERT(not @isDestroyed(), "push shouldn't happen after destroy")
    return if(@isDestroyed())

    # add to the queue
    @worker_queue.push(worker)

    # set up timeslice and start a new worked
    @timeout = window.setInterval((=> @pop()), @frequency) if(not @timeout)
    @pop() if(not @current_worker) 

  push: (setup_callback, task, cleanup_callback) -> 
    @pushWorker(new WQ.Worker(setup_callback, task, cleanup_callback))

  _do_destroy: ->
    WQ.ASSERT(@being_destroyed, "not in destroy")
    WQ.ASSERT(not @is_destroyed, "already destroyed")
    return if(@is_destroyed)
    @is_destroyed = true
    
    # destroy the current worker
    if(@current_worker)
      @current_worker.destroy(true)
      @current_worker = null 

    # destroy the workers
    while(worker = @worker_queue.shift())
      worker.destroy(true)

    # clear the timer
    window.clearInterval(@timeout)
    @timeout = 0

####################################################
# CommonJS
####################################################
if (typeof exports != 'undefined')
  exports.WQ.ArrayIterator = WQ.ArrayIterator
  exports.WQ.Worker = WQ.Worker
  exports.WQ.WorkerQueue = WQ.WorkerQueue
